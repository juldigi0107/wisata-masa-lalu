// Editorial intelligence shared by browser, tests, and Cloudflare Worker.
// IMPORTANT: completenessScore measures documentation/readiness, NOT historical truth.
// Readiness is intentionally stricter than the numeric score: a visually/source-incomplete
// record can score well on structure but must not be labelled release-ready.

const SOURCE_WEIGHTS={
 primary:5,official:5,'official-site':5,government:5,institutional:5,archive:5,academic:5,museum:5,library:5,
 database:4,'film-database':4,editorial:3,secondary:3,press:3,news:3,community:2,unknown:1
};
const STRONG_SOURCE_KINDS=new Set(['primary','official','official-site','government','institutional','archive','academic','museum','library']);
const BLOCKING_ISSUES=new Set(['core-metadata','missing-source','invalid-source-url','source-check-date','unresolved-fact-source','fact-provenance','quote-metadata','price-evidence','details-context','tags','layout','verified-provenance-mismatch']);
const YEAR_RE=/\b(199[0-9])\b/g;

const uniq=values=>[...new Set(values.filter(Boolean))];
const https=url=>typeof url==='string'&&url.startsWith('https://');
const text=value=>typeof value==='string'&&value.trim().length>0;
const clamp=n=>Math.max(0,Math.min(100,Math.round(n)));
const sourceKind=source=>SOURCE_WEIGHTS[source?.kind]?source.kind:'unknown';

export function extractEntryYears(entry){
 const fields=[
  entry?.details?.premiere,entry?.details?.context,entry?.factBox?.text,
  ...(entry?.tags||[]),entry?.priceTag?.past?.year,entry?.priceTag?.present?.year
 ].filter(value=>value!==null&&value!==undefined).join(' ');
 return uniq([...fields.matchAll(YEAR_RE)].map(match=>Number(match[1]))).sort((a,b)=>a-b);
}

export function auditEntry(entry){
 const issues=[];
 const sources=Array.isArray(entry?.sources)?entry.sources:[];
 const sourceIds=new Set(sources.map(source=>source?.id).filter(Boolean));
 const factSourceIds=Array.isArray(entry?.factBox?.sourceIds)?entry.factBox.sourceIds:[];
 const unresolvedFactSources=factSourceIds.filter(id=>!sourceIds.has(id));
 const validSourceUrls=sources.filter(source=>https(source?.url));
 const checkedSources=sources.filter(source=>text(source?.checkedAt));
 const sourceKinds=uniq(sources.map(sourceKind));
 const strongestSourceWeight=Math.max(0,...sources.map(source=>SOURCE_WEIGHTS[sourceKind(source)]||1));
 const strongSourceCount=sources.filter(source=>STRONG_SOURCE_KINDS.has(sourceKind(source))).length;
 const images=(entry?.assets||[]).filter(asset=>asset?.kind==='image'&&text(asset?.path));
 const quoteOkay=text(entry?.quoteBox?.text)&&text(entry?.quoteBox?.kind)&&text(entry?.quoteBox?.attribution);
 const factOkay=text(entry?.factBox?.text)&&text(entry?.factBox?.status)&&unresolvedFactSources.length===0;
 const price=entry?.priceTag;
 const priceNA=price?.basis==='not-applicable';
 const priceHasEvidence=priceNA
  ? text(price?.note)
  : Boolean(price&&text(price.label)&&(
      Number.isFinite(price?.past?.amount)||Number.isFinite(price?.present?.amount)||
      (price?.past?.sourceIds||[]).length||(price?.present?.sourceIds||[]).length||text(price?.note)
    ));
 const coreOkay=text(entry?.id)&&text(entry?.title)&&text(entry?.type)&&text(entry?.summary);
 const detailsOkay=entry?.details&&typeof entry.details==='object'&&Object.values(entry.details).some(text);
 const tagsOkay=Array.isArray(entry?.tags)&&entry.tags.length>0;
 const layoutOkay=text(entry?.layout);
 const verifiedAligned=entry?.status!=='verified'||(sources.length>0&&factSourceIds.length>0&&unresolvedFactSources.length===0);

 if(!coreOkay)issues.push('core-metadata');
 if(!sources.length)issues.push('missing-source');
 if(sources.length&&validSourceUrls.length!==sources.length)issues.push('invalid-source-url');
 if(sources.length&&checkedSources.length!==sources.length)issues.push('source-check-date');
 if(unresolvedFactSources.length)issues.push('unresolved-fact-source');
 if(!factOkay)issues.push('fact-provenance');
 if(!quoteOkay)issues.push('quote-metadata');
 if(!priceHasEvidence)issues.push('price-evidence');
 if(!images.length)issues.push('no-entry-visual');
 if(!detailsOkay)issues.push('details-context');
 if(!tagsOkay)issues.push('tags');
 if(!layoutOkay)issues.push('layout');
 if(!verifiedAligned)issues.push('verified-provenance-mismatch');
 if(sources.length&&!strongSourceCount)issues.push('no-strong-source');

 let score=0;
 score+=coreOkay?12:0;
 score+=detailsOkay?8:0;
 score+=tagsOkay?4:0;
 score+=layoutOkay?3:0;
 score+=sources.length?8:0;
 score+=sources.length?Math.round(6*validSourceUrls.length/sources.length):0;
 score+=sources.length?Math.round(4*checkedSources.length/sources.length):0;
 score+=Math.min(8,strongestSourceWeight*1.6);
 score+=factOkay?17:0;
 score+=quoteOkay?7:0;
 score+=priceHasEvidence?8:0;
 score+=images.length?8:0;
 score+=verifiedAligned?7:0;
 score=clamp(score);

 const uniqueIssues=uniq(issues);
 const blockingIssues=uniqueIssues.filter(issue=>BLOCKING_ISSUES.has(issue));
 const verifiedNeedsStrongerEvidence=entry?.status==='verified'&&sources.length>0&&!strongSourceCount;
 let readiness;
 if(blockingIssues.length||score<50)readiness='incomplete';
 else if(verifiedNeedsStrongerEvidence||score<70)readiness='needs-research';
 else if(score>=90&&uniqueIssues.length===0)readiness='release-ready';
 else readiness='solid';

 return {
  id:entry?.id||null,title:entry?.title||null,type:entry?.type||null,status:entry?.status||null,
  completenessScore:score,readiness,issues:uniqueIssues,blockingIssues,
  sourceCount:sources.length,strongSourceCount,sourceKinds,strongestSourceWeight,
  factSourceCount:factSourceIds.length,unresolvedFactSources,
  imageCount:images.length,years:extractEntryYears(entry),priceEvidence:Boolean(priceHasEvidence),
  verifiedNeedsStrongerEvidence
 };
}

export function auditCatalog(catalog){
 const entries=(catalog?.entries||[]).map(auditEntry);
 const byReadiness={};
 const byIssue={};
 const bySourceKind={};
 const byYear={};
 const byType={};
 let scoreTotal=0;
 for(const item of entries){
  byReadiness[item.readiness]=(byReadiness[item.readiness]||0)+1;
  byType[item.type]=(byType[item.type]||0)+1;
  scoreTotal+=item.completenessScore;
  for(const issue of item.issues)byIssue[issue]=(byIssue[issue]||0)+1;
  for(const kind of item.sourceKinds)bySourceKind[kind]=(bySourceKind[kind]||0)+1;
  for(const year of item.years)byYear[year]=(byYear[year]||0)+1;
 }
 const sortedScores=entries.map(item=>item.completenessScore).sort((a,b)=>a-b);
 const mid=Math.floor(sortedScores.length/2);
 const medianScore=sortedScores.length?(sortedScores.length%2?sortedScores[mid]:Math.round((sortedScores[mid-1]+sortedScores[mid])/2)):0;
 const severity={'incomplete':0,'needs-research':1,'solid':2,'release-ready':3};
 const priorityQueue=[...entries].sort((a,b)=>{
  const severityDiff=severity[a.readiness]-severity[b.readiness];
  if(severityDiff)return severityDiff;
  const verifiedDiff=(a.status==='verified'?0:1)-(b.status==='verified'?0:1);
  return verifiedDiff||a.completenessScore-b.completenessScore||a.title.localeCompare(b.title,'id');
 });
 return {
  version:catalog?.version||null,total:entries.length,
  meanScore:entries.length?Math.round(scoreTotal/entries.length):0,medianScore,
  byReadiness,byIssue,bySourceKind,byYear,byType,
  releaseReady:entries.filter(item=>item.readiness==='release-ready').length,
  needsAttention:entries.filter(item=>item.readiness==='needs-research'||item.readiness==='incomplete').length,
  solidButIncomplete:entries.filter(item=>item.readiness==='solid').length,
  verifiedWithIssues:entries.filter(item=>item.status==='verified'&&item.issues.length>0).length,
  verifiedNeedingStrongerEvidence:entries.filter(item=>item.verifiedNeedsStrongerEvidence).length,
  priorityQueue,entries
 };
}

export const editorialReadiness={
 'release-ready':'Dokumentasi, provenance, dan visual entry lengkap menurut quality gate; kualitas historis tetap bergantung pada sumber.',
 'solid':'Struktur dan provenance cukup kuat untuk ditampilkan, tetapi masih ada gap non-blocking seperti visual atau penguatan sumber.',
 'needs-research':'Ada kebutuhan riset nyata—terutama verified entry tanpa strong-source—yang harus diprioritaskan sebelum disebut matang.',
 'incomplete':'Ada blocker pada metadata/provenance inti atau kelengkapan minimum yang harus diperbaiki sebelum rilis.'
};

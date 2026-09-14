import test from 'node:test';
import assert from 'node:assert/strict';
import catalog from '../shared/assembled-catalog.js';
import {auditCatalog,auditEntry,editorialReadiness,extractEntryYears} from '../shared/editorial-audit.js';

const normalizedTitle=value=>String(value||'')
 .normalize('NFKD').replace(/[\u0300-\u036f]/g,'')
 .toLocaleLowerCase('id')
 .replace(/&/g,' dan ')
 .replace(/\b(edisi|versi|botol kaca|1990-an|90-an)\b/g,' ')
 .replace(/\b(19|20)\d{2}\b/g,' ')
 .replace(/[^a-z0-9]+/g,' ')
 .trim().replace(/\s+/g,' ');

const tokens=value=>new Set(normalizedTitle(value).split(' ').filter(token=>token.length>2));
const similarity=(a,b)=>{
 const left=tokens(a),right=tokens(b);
 if(!left.size||!right.size)return 0;
 const intersection=[...left].filter(token=>right.has(token)).length;
 const union=new Set([...left,...right]).size;
 return intersection/union;
};

test('editorial audit covers every SSOT entry without claiming a truth score',()=>{
 const audit=auditCatalog(catalog);
 assert.equal(audit.total,catalog.entries.length);
 assert.equal(audit.entries.length,catalog.entries.length);
 assert.equal(audit.priorityQueue.length,catalog.entries.length);
 assert.ok(audit.meanScore>=0&&audit.meanScore<=100);
 assert.ok(audit.medianScore>=0&&audit.medianScore<=100);
 assert.equal(Object.values(audit.byReadiness).reduce((sum,count)=>sum+count,0),catalog.entries.length);
 assert.ok(Object.keys(editorialReadiness).includes('needs-research'));
 assert.match(editorialReadiness['release-ready'],/kualitas historis tetap bergantung pada sumber/i);
 for(const item of audit.entries){
  assert.ok(item.completenessScore>=0&&item.completenessScore<=100,`score out of range: ${item.id}`);
  assert.ok(['release-ready','solid','needs-research','incomplete'].includes(item.readiness),`unknown readiness: ${item.id}`);
  assert.ok(Array.isArray(item.issues)&&Array.isArray(item.sourceKinds)&&Array.isArray(item.years)&&Array.isArray(item.blockingIssues));
  if(item.readiness==='release-ready'){
   assert.equal(item.issues.length,0,`release-ready item still has issues: ${item.id}`);
   if(item.status==='verified')assert.ok(item.strongSourceCount>0,`verified release-ready item lacks strong source: ${item.id}`);
  }
 }
});

test('audit detects provenance gaps deterministically',()=>{
 const weak=auditEntry({
  id:'uji-lemah',type:'tv',title:'Uji Lemah',summary:'Contoh test',status:'verified',layout:'story',tags:['uji'],
  factBox:{text:'Klaim test',status:'verified',sourceIds:['missing']},
  quoteBox:{text:'Kutipan',kind:'editorial-fiction',attribution:'Rekaan editorial'},
  priceTag:{label:'N/A',basis:'not-applicable',note:'Tidak berlaku'},
  sources:[],assets:[],details:{context:'Konteks test'}
 });
 assert.ok(weak.issues.includes('missing-source'));
 assert.ok(weak.issues.includes('unresolved-fact-source'));
 assert.ok(weak.issues.includes('verified-provenance-mismatch'));
 assert.ok(weak.issues.includes('no-entry-visual'));
 assert.equal(weak.readiness,'incomplete');
 assert.ok(weak.completenessScore<70);
});

test('verified entry with structurally strong metadata but only secondary evidence cannot be release-ready',()=>{
 const item=auditEntry({
  id:'uji-secondary',type:'tv',title:'Uji Secondary',summary:'Contoh metadata lengkap',status:'verified',layout:'story',tags:['uji','1995'],
  factBox:{text:'Klaim terhubung ke sumber.',status:'verified',sourceIds:['src-secondary']},
  quoteBox:{text:'Kutipan rekaan.',kind:'editorial-fiction',attribution:'Rekaan editorial'},
  priceTag:{label:'Harga nostalgia',basis:'not-applicable',note:'Tidak berlaku'},
  sources:[{id:'src-secondary',title:'Secondary source',url:'https://example.com/source',kind:'secondary',checkedAt:'2026-09-15'}],
  assets:[{path:'/assets/media/example.jpg',kind:'image',alt:'Example',rights:'test',credit:'test'}],
  details:{context:'Konteks lengkap',premiere:'1995'}
 });
 assert.ok(item.completenessScore>=70,'fixture should remain structurally strong');
 assert.ok(item.issues.includes('no-strong-source'));
 assert.equal(item.verifiedNeedsStrongerEvidence,true);
 assert.equal(item.readiness,'needs-research');
});

test('year indexing only extracts explicit 1990s signals',()=>{
 const years=extractEntryYears({details:{premiere:'1994, kembali 2001'},factBox:{text:'Dikembangkan sejak 1996 dan 1988.'},tags:['1999'],priceTag:{past:{year:1995},present:{year:2026}}});
 assert.deepEqual(years,[1994,1995,1996,1999]);
 const audit=auditCatalog(catalog);
 for(const year of Object.keys(audit.byYear).map(Number)) assert.ok(year>=1990&&year<=1999,`out-of-decade year leaked: ${year}`);
});

test('verified entries with editorial gaps are prioritized by evidence severity before healthy entries',()=>{
 const audit=auditCatalog(catalog);
 const severity={'incomplete':0,'needs-research':1,'solid':2,'release-ready':3};
 for(let index=1;index<audit.priorityQueue.length;index++){
  assert.ok(severity[audit.priorityQueue[index-1].readiness]<=severity[audit.priorityQueue[index].readiness],`priority severity regressed at ${index}`);
 }
 assert.equal(new Set(audit.priorityQueue.map(item=>item.id)).size,catalog.entries.length);
});

test('catalog has no obvious semantic title duplicates inside the same content type',()=>{
 const collisions=[];
 for(let i=0;i<catalog.entries.length;i++){
  for(let j=i+1;j<catalog.entries.length;j++){
   const left=catalog.entries[i],right=catalog.entries[j];
   if(left.type!==right.type)continue;
   const a=normalizedTitle(left.title),b=normalizedTitle(right.title);
   if(!a||!b)continue;
   const exact=a===b;
   const containment=(a.includes(b)||b.includes(a))&&Math.min(a.length,b.length)>=8;
   const close=similarity(left.title,right.title)>=0.8;
   if(exact||containment||close)collisions.push(`${left.id} (${left.title}) ↔ ${right.id} (${right.title})`);
  }
 }
 assert.deepEqual(collisions,[],`semantic duplicate candidates found:\n${collisions.join('\n')}`);
});

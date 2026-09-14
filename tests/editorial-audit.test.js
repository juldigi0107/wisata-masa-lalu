import test from 'node:test';
import assert from 'node:assert/strict';
import catalog from '../shared/assembled-catalog.js';
import {auditCatalog,auditEntry,editorialReadiness,extractEntryYears} from '../shared/editorial-audit.js';

test('editorial audit covers every SSOT entry without claiming a truth score',()=>{
 const audit=auditCatalog(catalog);
 assert.equal(audit.total,catalog.entries.length);
 assert.equal(audit.entries.length,catalog.entries.length);
 assert.equal(audit.priorityQueue.length,catalog.entries.length);
 assert.ok(audit.meanScore>=0&&audit.meanScore<=100);
 assert.ok(audit.medianScore>=0&&audit.medianScore<=100);
 assert.equal(Object.values(audit.byReadiness).reduce((sum,count)=>sum+count,0),catalog.entries.length);
 assert.ok(Object.keys(editorialReadiness).includes('needs-research'));
 assert.match(editorialReadiness['release-ready'],/kualitas sumber historis/i);
 for(const item of audit.entries){
  assert.ok(item.completenessScore>=0&&item.completenessScore<=100,`score out of range: ${item.id}`);
  assert.ok(['release-ready','solid','needs-research','incomplete'].includes(item.readiness),`unknown readiness: ${item.id}`);
  assert.ok(Array.isArray(item.issues)&&Array.isArray(item.sourceKinds)&&Array.isArray(item.years));
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
 assert.ok(weak.completenessScore<70);
});

test('year indexing only extracts explicit 1990s signals',()=>{
 const years=extractEntryYears({details:{premiere:'1994, kembali 2001'},factBox:{text:'Dikembangkan sejak 1996 dan 1988.'},tags:['1999'],priceTag:{past:{year:1995},present:{year:2026}}});
 assert.deepEqual(years,[1994,1995,1996,1999]);
 const audit=auditCatalog(catalog);
 for(const year of Object.keys(audit.byYear).map(Number)) assert.ok(year>=1990&&year<=1999,`out-of-decade year leaked: ${year}`);
});

test('verified entries with editorial gaps are surfaced before non-verified peers at equal/lower readiness',()=>{
 const audit=auditCatalog(catalog);
 const verifiedIssueIndexes=audit.priorityQueue.map((item,index)=>item.status==='verified'&&item.issues.length?index:null).filter(index=>index!==null);
 if(verifiedIssueIndexes.length) assert.ok(Math.min(...verifiedIssueIndexes)<catalog.entries.length,'verified gaps never surfaced');
 assert.equal(new Set(audit.priorityQueue.map(item=>item.id)).size,catalog.entries.length);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import worker from '../worker/index.js';
import catalog from '../shared/assembled-catalog.js';
import {auditCatalog} from '../shared/editorial-audit.js';

const ORIGIN='https://juldigi0107.github.io';
const call=(path,options={})=>worker.fetch(new Request('https://example.com'+path,options),{ALLOWED_ORIGIN:ORIGIN});

test('audit endpoint exposes evidence-aware diagnostics and explicit disclaimer',async()=>{
 const expected=auditCatalog(catalog);
 const response=await call('/api/audit?limit=7');
 assert.equal(response.status,200);
 const body=await response.json();
 assert.equal(body.version,catalog.version);
 assert.equal(body.total,catalog.entries.length);
 assert.equal(body.meanScore,expected.meanScore);
 assert.equal(body.medianScore,expected.medianScore);
 assert.equal(body.releaseReady,expected.releaseReady);
 assert.equal(body.solidButIncomplete,expected.solidButIncomplete);
 assert.equal(body.needsAttention,expected.needsAttention);
 assert.equal(body.verifiedNeedingStrongerEvidence,expected.verifiedNeedingStrongerEvidence);
 assert.equal(body.entries.length,7);
 assert.equal(body.queueTotal,catalog.entries.length);
 assert.ok(body.byReadiness&&body.byIssue&&body.bySourceKind&&body.byYear);
 assert.match(body.disclaimer,/bukan menjamin kebenaran historis/i);
 assert.match(body.disclaimer,/kekuatan sumber/i);
});

test('entries endpoint can filter by editorial readiness, issue, and score bounds',async()=>{
 const audit=auditCatalog(catalog);
 const target=audit.priorityQueue.find(item=>item.issues.length)||audit.priorityQueue[0];
 assert.ok(target,'audit target missing');
 const byReadiness=await(await call(`/api/entries?readiness=${encodeURIComponent(target.readiness)}&limit=100`)).json();
 assert.ok(byReadiness.total>=1);
 const auditedById=new Map(audit.entries.map(item=>[item.id,item]));
 assert.ok(byReadiness.entries.every(entry=>auditedById.get(entry.id)?.readiness===target.readiness));
 if(target.issues.length){
  const issue=target.issues[0];
  const byIssue=await(await call(`/api/entries?issue=${encodeURIComponent(issue)}&limit=100`)).json();
  assert.ok(byIssue.total>=1);
  assert.ok(byIssue.entries.every(entry=>auditedById.get(entry.id)?.issues.includes(issue)));
 }
 const bounded=await(await call('/api/entries?minScore=70&maxScore=80&limit=100')).json();
 assert.ok(bounded.entries.every(entry=>{const score=auditedById.get(entry.id)?.completenessScore;return score>=70&&score<=80;}));
 assert.deepEqual(bounded.qualityFilters,{readiness:null,issue:null,minScore:70,maxScore:80});
});

test('stats, facets, and health expose v2.8 evidence-aware editorial health without replacing historical provenance',async()=>{
 const expected=auditCatalog(catalog);
 const [health,stats,facets]=await Promise.all([
  call('/api/health').then(r=>r.json()),call('/api/stats').then(r=>r.json()),call('/api/facets').then(r=>r.json())
 ]);
 assert.equal(health.version,catalog.version);
 assert.equal(health.editorialMeanScore,expected.meanScore);
 assert.equal(health.editorialMedianScore,expected.medianScore);
 assert.equal(health.editorialReleaseReady,expected.releaseReady);
 assert.equal(health.editorialSolid,expected.solidButIncomplete);
 assert.equal(health.editorialNeedsAttention,expected.needsAttention);
 assert.equal(health.editorialVerifiedNeedingStrongerEvidence,expected.verifiedNeedingStrongerEvidence);
 assert.equal(stats.editorial.meanScore,expected.meanScore);
 assert.equal(stats.editorial.medianScore,expected.medianScore);
 assert.equal(stats.editorial.releaseReady,expected.releaseReady);
 assert.equal(stats.editorial.solidButIncomplete,expected.solidButIncomplete);
 assert.equal(stats.editorial.needsAttention,expected.needsAttention);
 assert.equal(stats.editorial.verifiedNeedingStrongerEvidence,expected.verifiedNeedingStrongerEvidence);
 assert.equal(Object.values(facets.byReadiness).reduce((sum,count)=>sum+count,0),catalog.entries.length);
 assert.ok(Object.keys(facets.bySourceKind).length>=1);
 assert.ok(Object.keys(facets.byYear).every(year=>Number(year)>=1990&&Number(year)<=1999));
});

test('v2.8 researched digital-life batch is discoverable through the same API contract',async()=>{
 const expectedIds=['indonet-internet-komersial-1994','wartel-1990','windows-95-indonesia','apjii-1996','sony-minidisc-1992','daun-di-atas-bantal'];
 const byId=new Map(catalog.entries.map(entry=>[entry.id,entry]));
 for(const id of expectedIds)assert.ok(byId.has(id),`missing v2.8 entry: ${id}`);
 const internet=await(await call('/api/entries?q=internet&type=teknologi&limit=100')).json();
 assert.ok(internet.entries.some(entry=>entry.id==='indonet-internet-komersial-1994'));
 assert.ok(internet.entries.some(entry=>entry.id==='apjii-1996'));
 const wartel=await(await call('/api/entries?q=wartel&limit=100')).json();
 assert.equal(wartel.entries[0]?.id,'wartel-1990');
 const windows=await(await call('/api/entries?q=windows%2095&limit=100')).json();
 assert.ok(windows.entries.some(entry=>entry.id==='windows-95-indonesia'));
});

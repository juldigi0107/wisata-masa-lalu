import test from 'node:test';
import assert from 'node:assert/strict';
import catalog from '../shared/assembled-catalog.js';
import {assetCredits,objectCabinet,quizQuestions} from '../src/content.js';
import {deepObjectCabinet,decadeMoments,provenanceTiers} from '../src/deepDive.js';

const fileFromPath = path => path?.split('/').pop();

test('nostalgia meter remains a complete 20-question experience',()=>{
 assert.equal(quizQuestions.length,20);
 for(const [index,question] of quizQuestions.entries()){
  assert.equal(question.length,3,`question ${index+1} has invalid tuple`);
  assert.ok(question[0]?.trim(),`question ${index+1} text missing`);
  assert.ok(Array.isArray(question[1])&&question[1].length>=2,`question ${index+1} choices missing`);
  assert.ok(Number.isInteger(question[2])&&question[2]>=0&&question[2]<question[1].length,`question ${index+1} answer index invalid`);
 }
});

test('visual ledger is unique and covers every object cabinet image',()=>{
 assert.ok(assetCredits.length>=25,'visual ledger unexpectedly small');
 assert.equal(new Set(assetCredits.map(item=>item.file)).size,assetCredits.length,'duplicate visual file in ledger');
 const credited=new Set(assetCredits.map(item=>item.file));
 for(const object of [...objectCabinet,...deepObjectCabinet]){
  assert.ok(credited.has(object.image),`object image lacks visible credit: ${object.id} -> ${object.image}`);
  assert.ok(object.source?.startsWith('https://'),`object source missing/invalid: ${object.id}`);
 }
 for(const entry of catalog.entries){
  for(const asset of entry.assets||[]){
   if(asset.kind!=='image'||!asset.path?.includes('/assets/media/'))continue;
   assert.ok(credited.has(fileFromPath(asset.path)),`catalog image missing from UI ledger: ${entry.id} -> ${asset.path}`);
  }
 }
});

test('decade chronology is ordered and every linked milestone resolves to the catalog',()=>{
 assert.ok(decadeMoments.length>=8,'deep-dive timeline unexpectedly short');
 const ids=new Set(catalog.entries.map(entry=>entry.id));
 let previous=1989;
 for(const moment of decadeMoments){
  assert.ok(moment.year>=1990&&moment.year<=1999,`timeline year outside 1990s: ${moment.year}`);
  assert.ok(moment.year>=previous,`timeline not chronological at ${moment.title}`);
  assert.ok(ids.has(moment.entryId),`timeline entry does not resolve: ${moment.entryId}`);
  assert.ok(moment.title&&moment.note&&moment.label,`timeline editorial metadata incomplete: ${moment.entryId}`);
  previous=moment.year;
 }
});

test('provenance vocabulary is explicit and catalog does not blur verified and curated entries',()=>{
 const tierIds=new Set(provenanceTiers.map(tier=>tier.id));
 assert.ok(tierIds.has('verified')&&tierIds.has('curated')&&tierIds.has('simulation'));
 assert.ok(catalog.entries.some(entry=>entry.status==='verified'),'no verified entries');
 assert.ok(catalog.entries.some(entry=>entry.status==='curated'),'no curated entries');
 for(const entry of catalog.entries.filter(entry=>entry.status==='verified')){
  assert.ok((entry.sources||[]).length>0,`verified entry missing source: ${entry.id}`);
  assert.ok(entry.factBox?.status==='verified'||(entry.factBox?.sourceIds||[]).length>0,`verified entry fact provenance weak: ${entry.id}`);
 }
});

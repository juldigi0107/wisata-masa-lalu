import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {memoryTriggers} from '../shared/memory-triggers.js';
import {mechanicFamilyFor} from '../shared/mechanic-registry.js';

const text=path=>readFile(new URL(`../${path}`,import.meta.url),'utf8');

test('every memory trigger resolves to a mechanic family',()=>{
 const unresolved=memoryTriggers.filter(trigger=>!mechanicFamilyFor(trigger.mechanic));
 assert.deepEqual(unresolved.map(trigger=>trigger.id),[]);
});

test('generic dispatcher covers every generic family and delegates the rest to special mechanics',async()=>{
 const jsx=await text('src/world/GenericMechanics.jsx');
 for(const family of ['slider','timing','compose','choice','find','dial','phone','billing','chat','repair','arcade','builder','shop','camera']){
  assert.match(jsx,new RegExp(`family==='${family}'`),`generic family not rendered: ${family}`);
 }
 assert.match(jsx,/SpecialMechanic family=\{family\}/);
 assert.match(jsx,/function useOnceComplete/);
});

test('special dispatcher covers every delegated family with once-only completion',async()=>{
 const jsx=await text('src/world/SpecialMechanics.jsx');
 for(const family of ['schedule','sequence','browse','boot','dialup','event','random','ledger','strategy','pet','secret','ambient','inspect']){
  assert.match(jsx,new RegExp(`family==='${family}'`),`special family not rendered: ${family}`);
 }
 assert.match(jsx,/function useOnceComplete/);
 assert.match(jsx,/const complete=useOnceComplete\(onComplete\)/);
});

test('special mechanics require meaningful actions before completion',async()=>{
 const jsx=await text('src/world/SpecialMechanics.jsx');
 assert.match(jsx,/const \[clock,setClock\]=useState\(''\)/);
 assert.match(jsx,/disabled=\{!clock\}/);
 assert.match(jsx,/disabled=\{running&&index<4\}/);
 assert.match(jsx,/visited\.length<3/);
 assert.match(jsx,/selected!==2/);
 assert.match(jsx,/heard\.length<3/);
 assert.match(jsx,/selected\.length<3/);
});

test('magrib ambience and cheat-code hint are semantically complete',async()=>{
 const jsx=await text('src/world/SpecialMechanics.jsx');
 assert.match(jsx,/trigger\.id==='magrib'/);
 assert.match(jsx,/suara mushola/);
 assert.match(jsx,/kanan, A/);
});

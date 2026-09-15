import test from 'node:test';
import assert from 'node:assert/strict';
import {easterEggs,easterEggCount,easterEggFor} from '../shared/easter-eggs.js';
import {scenes} from '../shared/world-model.js';

test('every scene object owns five contextual Easter egg tiers',()=>{
 const objectCount=Object.values(scenes).reduce((sum,scene)=>sum+scene.objects.length,0);
 assert.equal(easterEggCount,objectCount*5);
 assert.ok(easterEggCount>=200);
 for(const scene of Object.values(scenes))for(const object of scene.objects){
  const rows=easterEggs.filter(item=>item.scene===scene.id&&item.object===object.id);
  assert.equal(rows.length,5,`${scene.id}/${object.id}`);
  assert.deepEqual(rows.map(item=>item.threshold),[3,5,7,11,17]);
  assert.ok(rows.every(item=>item.message.includes(object.label)));
  assert.equal(easterEggFor(scene.id,object.id,17)?.tier,5);
 }
});

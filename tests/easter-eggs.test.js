import test from 'node:test';
import assert from 'node:assert/strict';
import {easterEggs,easterEggCount,easterEggFor} from '../shared/easter-eggs.js';
import {scenes} from '../shared/world-model.js';
import {readFile} from 'node:fs/promises';

const text=path=>readFile(new URL(`../${path}`,import.meta.url),'utf8');

test('systemic Easter egg engine exposes more than two hundred real unlockable secrets',()=>{
 const objectCount=Object.values(scenes).reduce((sum,scene)=>sum+scene.objects.length,0);
 assert.equal(easterEggCount,objectCount*5);
 assert.ok(easterEggCount>=200,`expected >=200 secrets, got ${easterEggCount}`);
 assert.equal(new Set(easterEggs.map(item=>item.id)).size,easterEggCount);
 for(const item of easterEggs){assert.ok([3,5,7,11,17].includes(item.threshold));assert.ok(scenes[item.scene]?.objects.some(object=>object.id===item.object))}
});

test('third secret layer resolves at seven interactions as a contextual hidden layer',()=>{
 const firstScene=Object.values(scenes)[0],object=firstScene.objects[0];const secret=easterEggFor(firstScene.id,object.id,7);
 assert.ok(secret);assert.equal(secret.tier,3);assert.equal(secret.tierName,'Lapisan Tersembunyi');assert.ok(secret.label.includes(object.label));
});

test('Easter egg runtime listens to actual scene object clicks and persists unlocks locally',async()=>{
 const [runtime,main,css]=await Promise.all([text('src/world/EasterEggRuntime.jsx'),text('src/main.jsx'),text('src/world/easter-eggs.css')]);
 assert.match(runtime,/\.scene-object/);
 assert.match(runtime,/document\.addEventListener\('click'/);
 assert.match(runtime,/localStorage\.setItem/);
 assert.match(runtime,/easterEggFor/);
 assert.match(main,/EasterEggRuntime/);
 assert.match(css,/secret-memory/);
});

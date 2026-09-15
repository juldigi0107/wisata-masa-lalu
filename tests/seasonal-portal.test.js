import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const text=path=>readFile(new URL(`../${path}`,import.meta.url),'utf8');

test('world exposes one low-cognitive seasonal portal instead of separate mode buttons',async()=>{
 const [app,panel]=await Promise.all([text('src/world/WorldAppV4.jsx'),text('src/world/SeasonPanel.jsx')]);
 assert.match(app,/openPanel\('season'\)/);
 assert.match(app,/overlay==='season'/);
 assert.match(app,/SeasonPanel active=\{specialMode\}/);
 assert.equal(/onClick=\{\(\)=>toggleSpecialMode\('ramadan'\)\}/.test(app),false);
 assert.equal(/onClick=\{\(\)=>toggleSpecialMode\('agustusan'\)\}/.test(app),false);
 for(const label of ['Ramadan 90-an','Lebaran di Kampung','Kampung Merdeka','Minggu Pagi','Malam Minggu'])assert.match(panel,new RegExp(label.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')));
});

test('seasonal choice drives the same specialMode used by scene memory ribbon and random engine',async()=>{
 const app=await text('src/world/WorldAppV4.jsx');
 assert.match(app,/setSpecialMode/);
 assert.match(app,/getSeasonalMemory\(specialMode/);
 assert.match(app,/getSeasonalEvent\(specialMode/);
 assert.match(app,/specialMode=\{specialMode\}/);
 assert.match(app,/season\.eyebrow/);
});

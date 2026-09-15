import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {achievements} from '../shared/world-model.js';
import {buildAchievementProgress,getSeasonalEvent,getSeasonalMemory,seasonalModes} from '../shared/world-v4-experience.js';

const text=path=>readFile(new URL(`../${path}`,import.meta.url),'utf8');

test('seasonal modes resolve only to real playable memory triggers',()=>{
 for(const mode of ['ramadan','agustusan']){
  const start=getSeasonalMemory(mode,0);
  const end=getSeasonalMemory(mode,.999);
  assert.ok(start?.id);
  assert.ok(end?.id);
  assert.ok(seasonalModes[mode].triggers.includes(start.id));
  assert.ok(seasonalModes[mode].triggers.includes(end.id));
  const event=getSeasonalEvent(mode,.5);
  assert.equal(event.seasonal,true);
  assert.ok(seasonalModes[mode].triggers.includes(event.trigger));
  assert.ok(event.label.includes(seasonalModes[mode].label));
 }
 assert.equal(getSeasonalMemory('normal',.5),null);
 assert.equal(getSeasonalEvent('normal',.5),null);
});

test('achievement progress counts actual category scene and year state',()=>{
 const progress=buildAchievementProgress(achievements,{
  completed:['tape-recorder','side-a-b','kaset-kusut','pensil-kaset','mixtape-maker','telepon-rumah'],
  visitedScenes:['rumah','kampung','sekolah'],
  visitedYears:[1990,1991,1992,1993]
 });
 const cassette=progress.find(item=>item.id==='anak-kaset-sejati');
 const world=progress.find(item=>item.id==='keliling-kota');
 const years=progress.find(item=>item.id==='penjelajah-waktu');
 assert.equal(cassette.current,5);
 assert.equal(cassette.unlocked,true);
 assert.equal(world.current,3);
 assert.equal(world.unlocked,false);
 assert.equal(years.current,4);
 assert.equal(years.unlocked,false);
});

test('world engine applies seasonal memory to daily ribbon random events and collection progress',async()=>{
 const app=await text('src/world/WorldAppV4.jsx');
 assert.match(app,/getSeasonalMemory\(specialMode,dailySeed\)/);
 assert.match(app,/featuredMemory=seasonalDaily\|\|daily/);
 assert.match(app,/getSeasonalEvent\(specialMode,Math\.random\(\)\)/);
 assert.match(app,/triggerMemoryEvent/);
 assert.match(app,/achievementProgress=useMemo/);
 assert.match(app,/achievementProgress=\{achievementProgress\}/);
 assert.match(app,/seasonal-note/);
});

test('search dialog prioritizes its explicitly marked autofocus target and restores focus',async()=>{
 const panel=await text('src/world/FeaturePanelsV2.jsx');
 assert.match(panel,/querySelector\('\[data-autofocus\]/);
 assert.match(panel,/data-autofocus autoFocus/);
 assert.match(panel,/previous\.current\?\.focus/);
});

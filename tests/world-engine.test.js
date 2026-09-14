import test from 'node:test';
import assert from 'node:assert/strict';
import {memoryTriggers,getTrigger} from '../shared/memory-triggers.js';
import {
 scenes,years,yearWorldState,nostalgiaProfiles,onboardingChoices,dayCampaign,
 randomMemoryEvents,collections,achievements
} from '../shared/world-model.js';

const normalized=value=>String(value??'').toLocaleLowerCase('id');

test('immersive engine exposes exactly 100 unique, numbered, actionable memory triggers',()=>{
 assert.equal(memoryTriggers.length,100);
 assert.equal(new Set(memoryTriggers.map(item=>item.id)).size,100);
 assert.deepEqual(memoryTriggers.map(item=>item.no).sort((a,b)=>a-b),Array.from({length:100},(_,i)=>i+1));
 for(const item of memoryTriggers){
  assert.ok(item.id&&item.title&&item.category&&item.scene&&item.interaction&&item.mechanic,`incomplete trigger: ${item.id}`);
  assert.ok(Number.isFinite(item.points)&&item.points>0,`invalid points: ${item.id}`);
  assert.ok(scenes[item.scene],`unknown scene ${item.scene} in ${item.id}`);
  assert.equal(getTrigger(item.id)?.id,item.id,`getTrigger failed: ${item.id}`);
 }
});

test('every spatial object, exit, campaign step, and random event resolves',()=>{
 const triggerIds=new Set(memoryTriggers.map(item=>item.id));
 for(const scene of Object.values(scenes)){
  assert.ok(scene.id&&scene.label&&scene.description);
  assert.ok(Array.isArray(scene.objects)&&scene.objects.length>0,`scene without objects: ${scene.id}`);
  assert.ok(Array.isArray(scene.exits)&&scene.exits.length>0,`scene without exits: ${scene.id}`);
  for(const exit of scene.exits)assert.ok(scenes[exit],`broken exit ${scene.id} -> ${exit}`);
  for(const object of scene.objects){
   assert.ok(object.label&&Number.isFinite(object.x)&&Number.isFinite(object.y),`invalid object ${scene.id}/${object.id}`);
   assert.ok(object.x>=0&&object.x<=100&&object.y>=0&&object.y<=100,`object outside scene ${scene.id}/${object.id}`);
   assert.ok(Array.isArray(object.triggerIds)&&object.triggerIds.length>0,`dead object ${scene.id}/${object.id}`);
   for(const id of object.triggerIds)assert.ok(triggerIds.has(id),`broken object trigger ${scene.id}/${object.id}/${id}`);
  }
 }
 for(const step of dayCampaign){assert.ok(scenes[step.scene]);assert.ok(triggerIds.has(step.trigger),`broken campaign trigger ${step.trigger}`)}
 for(const event of randomMemoryEvents){assert.ok(scenes[event.scene]);assert.ok(triggerIds.has(event.trigger),`broken random event ${event.trigger}`);assert.ok(event.weight>0)}
});

test('decade, profiles, collections, and achievements have complete production contracts',()=>{
 assert.deepEqual(years,Array.from({length:10},(_,i)=>1990+i));
 for(const year of years){
  const state=yearWorldState[year];
  assert.ok(state?.tech&&state?.media&&state?.mood&&/^#[0-9a-f]{6}$/i.test(state.accent),`invalid year state ${year}`);
 }
 assert.ok(nostalgiaProfiles.length>=10);
 assert.equal(new Set(nostalgiaProfiles.map(item=>item.id)).size,nostalgiaProfiles.length);
 for(const profile of nostalgiaProfiles)assert.ok(scenes[profile.scene],`profile points to missing scene: ${profile.id}`);
 for(const choice of onboardingChoices)assert.ok(nostalgiaProfiles.some(profile=>profile.id===choice.id),`orphan onboarding choice: ${choice.id}`);
 assert.ok(collections.length>=10);
 assert.equal(new Set(collections.map(item=>item.id)).size,collections.length);
 assert.ok(achievements.length>=4);
 for(const achievement of achievements)assert.ok(achievement.id&&achievement.label&&achievement.target>0);
});

test('world content contains no prototype placeholder language',()=>{
 const corpus=JSON.stringify({memoryTriggers,scenes,dayCampaign,randomMemoryEvents,collections,achievements,onboardingChoices});
 const banned=['lorem ipsum','coming soon','fitur belum tersedia','placeholder','dummy button','todo:','tbd'];
 for(const phrase of banned)assert.equal(normalized(corpus).includes(phrase),false,`prototype language leaked: ${phrase}`);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const text=path=>readFile(new URL(`../${path}`,import.meta.url),'utf8');

test('production entry uses World Experience Shell over modular WorldAppV4 and defers non-first-paint interaction styling',async()=>{
 const main=await text('src/main.jsx');const shell=await text('src/world/WorldExperienceShell.jsx');
 assert.match(main,/WorldExperienceShell\.jsx/);assert.match(shell,/WorldAppV4/);
 assert.match(main,/premium-runtime-styles\.js/);assert.match(main,/interaction-runtime-styles\.js/);
});

test('v4 profile migration sanitizes scene year arrays settings and corrupted progress',async()=>{
 const app=await text('src/world/WorldAppV4.jsx');
 assert.match(app,/function normalizeProfile/);assert.match(app,/VALID_SCENES/);assert.match(app,/VALID_YEARS/);assert.match(app,/VALID_PROFILES/);
 assert.match(app,/completed:uniq\(raw\.completed\)\.filter/);assert.match(app,/collections:uniq\(raw\.collections\)\.filter/);assert.match(app,/settings:sanitizeWorldSettings/);
});

test('daily memory uses device-local calendar rather than UTC ISO date',async()=>{
 const app=await text('src/world/WorldAppV4.jsx');assert.match(app,/getFullYear\(\)/);assert.match(app,/getMonth\(\)/);assert.match(app,/getDate\(\)/);assert.equal(app.includes("toISOString().slice(0,10)"),false);
});

test('replaying a completed memory cannot farm score or artifacts even on rapid submit',async()=>{
 const app=await text('src/world/WorldAppV4.jsx');assert.match(app,/completionLocks\.current\.has/);assert.match(app,/currentCompleted\.includes\(item\.id\)/);assert.match(app,/progress tidak dihitung dua kali/);
});

test('random events never compete visually with a focused modal or object lens',async()=>{
 const app=await text('src/world/WorldAppV4.jsx');assert.match(app,/if\(!profile\|\|overlay\|\|activeObject\|\|event\)return/);assert.match(app,/event&&!overlay&&!activeObject/);
});

test('campaign selection and campaign activity launch are separate actions',async()=>{
 const panel=await text('src/world/FeaturePanelsV2.jsx');assert.match(panel,/JALANI MOMEN INI/);assert.match(panel,/onClick=\{\(\)=>onPlay\(step\)\}/);assert.match(panel,/Memilih waktu hanya mengubah itinerary/);
});

test('time machine now derives archive recommendations from SSOT by selected year',async()=>{
 const panel=await text('src/world/FeaturePanelsV2.jsx');assert.match(panel,/catalog\.entries\.filter/);assert.match(panel,/includes\(String\(year\)\)/);assert.match(panel,/ARSIP YANG MENYEBUT/);
});

test('search has intentional semantic discovery and explicit empty states',async()=>{
 const panel=await text('src/world/FeaturePanelsV2.jsx');
 assert.match(panel,/item\.scene===currentScene/);assert.match(panel,/menampilkan pengalaman di/);assert.match(panel,/Tidak ada pengalaman yang cocok/);assert.match(panel,/Belum ada entri arsip yang cukup dekat/);assert.match(panel,/tanpa mengarang hasil sejarah/);
});

test('collection panel exposes artifact completion achievement progress and unlock state',async()=>{
 const panel=await text('src/world/FeaturePanelsV2.jsx');assert.match(panel,/cabinet-progress/);assert.match(panel,/Achievement/);assert.match(panel,/achievement-grid/);assert.match(panel,/achievementProgress/);assert.match(panel,/PROGRESS/);
});

test('all v4 modal surfaces trap Tab focus restore origin focus and close with Escape',async()=>{
 const panel=await text('src/world/FeaturePanelsV2.jsx');assert.match(panel,/event\.key==='Escape'/);assert.match(panel,/event\.key!=='Tab'/);assert.match(panel,/previous\.current=document\.activeElement/);assert.match(panel,/previous\.current\?\.focus/);
});

test('generic billing and arcade timers use real one-second ticks and completion is guarded once',async()=>{
 const mechanics=await text('src/world/GenericMechanics.jsx');assert.match(mechanics,/function useOnceComplete/);assert.match(mechanics,/setInterval\(\(\)=>setSeconds\(s=>s\+1\),1000\)/);assert.match(mechanics,/setTimeout\(\(\)=>setTime\(t=>t-1\),1000\)/);
});

test('offline memory packs are isolated from runtime media and core shell caches',async()=>{
 const sw=await text('public/sw.js');assert.match(sw,/CLEAR_MEMORY_PACKS/);assert.match(sw,/caches\.delete\(PACKS\)/);assert.match(sw,/MEMORY_PACKS_CLEARED/);const clearBlock=sw.slice(sw.indexOf("data.type==='CLEAR_MEMORY_PACKS'"),sw.indexOf("data.type==='CACHE_MEMORY_PACK'"));assert.equal(clearBlock.includes('caches.delete(SHELL)'),false);assert.equal(clearBlock.includes('caches.delete(MEDIA)'),false);
});

test('journey scene and year are written back to the current URL',async()=>{
 const app=await text('src/world/WorldAppV4.jsx');assert.match(app,/url\.searchParams\.set\('scene',sceneId\)/);assert.match(app,/url\.searchParams\.set\('year',String\(year\)\)/);assert.match(app,/history\.replaceState/);
});

test('archive portal dynamically loads full archive and contextual routes with recovery',async()=>{
 const portal=await text('src/world/ArchivePortal.jsx');
 assert.match(portal,/full:\(\)=>import\('\.\.\/ArchiveRoute\.jsx'\)/);
 assert.match(portal,/context:\(\)=>import\('\.\/ContextualArchiveRoute\.jsx'\)/);
 assert.match(portal,/routeLoaders\[routeKey\]\(\)/);
 assert.match(portal,/ArchiveFailure/);
 assert.match(portal,/COBA MUAT LAGI/);
});

test('seasonal model includes Ramadan Lebaran Agustusan Sunday and Malam Minggu with real trigger references',async()=>{
 const model=await text('shared/world-v4-experience.js');
 for(const id of ['ramadan','lebaran','agustusan','minggu'])assert.match(model,new RegExp(`\\b${id}:`));
 assert.match(model,/'malam-minggu':\{id:'malam-minggu'/);
 assert.match(model,/triggers:/);
});

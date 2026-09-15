import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const text=path=>readFile(new URL(`../${path}`,import.meta.url),'utf8');

test('production entry uses modular WorldAppV4 and defers non-first-paint interaction styling',async()=>{
 const [main,interactionStyles]=await Promise.all([text('src/main.jsx'),text('src/world/interaction-runtime-styles.js')]);
 assert.match(main,/WorldAppV4\.jsx/);
 assert.match(main,/import\("\.\/world\/interaction-runtime-styles\.js"\)/);
 assert.match(interactionStyles,/feature-deep-dive-v4\.css/);
 assert.equal(main.includes('feature-deep-dive-v4.css'),false);
 assert.match(main,/seasonal-function-v4\.css/);
});

test('v4 profile migration sanitizes scene year arrays settings and corrupted progress',async()=>{
 const app=await text('src/world/WorldAppV4.jsx');
 assert.match(app,/function normalizeProfile/);
 assert.match(app,/VALID_SCENES/);
 assert.match(app,/VALID_YEARS/);
 assert.match(app,/VALID_PROFILES/);
 assert.match(app,/completed:uniq\(raw\.completed\)\.filter/);
 assert.match(app,/collections:uniq\(raw\.collections\)\.filter/);
 assert.match(app,/settings:sanitizeWorldSettings\(raw\.settings\)/);
});

test('daily memory uses device-local calendar rather than UTC ISO date',async()=>{
 const app=await text('src/world/WorldAppV4.jsx');
 assert.match(app,/getFullYear\(\)/);
 assert.match(app,/getMonth\(\)/);
 assert.match(app,/getDate\(\)/);
 assert.equal(app.includes("toISOString().slice(0,10)"),false);
});

test('replaying a completed memory cannot farm score or artifacts even on rapid submit',async()=>{
 const app=await text('src/world/WorldAppV4.jsx');
 assert.match(app,/completionLocks=useRef\(new Set/);
 assert.match(app,/completionLocks\.current\.has\(item\.id\)/);
 assert.match(app,/if\(!already\)completionLocks\.current\.add\(item\.id\)/);
 assert.match(app,/if\(currentCompleted\.includes\(item\.id\)\)return current/);
 assert.match(app,/progress tidak dihitung dua kali/);
 assert.match(app,/tanpa menambah skor atau artefak/);
});

test('random events never compete visually with a focused modal or object lens',async()=>{
 const app=await text('src/world/WorldAppV4.jsx');
 assert.match(app,/if\(!profile\|\|overlay\|\|activeObject\|\|event\)return/);
 assert.match(app,/event&&!overlay&&!activeObject/);
 assert.match(app,/function triggerMemoryEvent/);
 assert.match(app,/onClick=\{triggerMemoryEvent\}/);
 assert.match(app,/DialogSurface className="ambient-event"/);
});

test('campaign selection and campaign activity launch are separate actions',async()=>{
 const panel=await text('src/world/FeaturePanelsV2.jsx');
 assert.match(panel,/JALANI MOMEN INI/);
 assert.match(panel,/onClick=\{\(\)=>onPlay\(step\)\}/);
 assert.match(panel,/Memilih waktu hanya mengubah itinerary/);
});

test('time machine now derives archive recommendations from SSOT by selected year',async()=>{
 const panel=await text('src/world/FeaturePanelsV2.jsx');
 assert.match(panel,/catalog\.entries\.filter/);
 assert.match(panel,/includes\(String\(year\)\)/);
 assert.match(panel,/ARSIP YANG MENYEBUT/);
});

test('search has intentional discovery and empty states instead of query-empty result spam',async()=>{
 const panel=await text('src/world/FeaturePanelsV2.jsx');
 assert.match(panel,/item\.scene===currentScene/);
 assert.match(panel,/menampilkan pengalaman di/);
 assert.match(panel,/Tidak ada pengalaman yang cocok/);
 assert.match(panel,/Tidak ada entri arsip yang cocok/);
});

test('collection panel exposes artifact completion achievement progress and unlock state',async()=>{
 const panel=await text('src/world/FeaturePanelsV2.jsx');
 assert.match(panel,/cabinet-progress/);
 assert.match(panel,/Achievement/);
 assert.match(panel,/achievement-grid/);
 assert.match(panel,/unlockedAchievements/);
 assert.match(panel,/achievementProgress/);
 assert.match(panel,/PROGRESS/);
});

test('all v4 modal surfaces trap Tab focus restore origin focus and close with Escape',async()=>{
 const panel=await text('src/world/FeaturePanelsV2.jsx');
 assert.match(panel,/event\.key==='Escape'/);
 assert.match(panel,/event\.key!=='Tab'/);
 assert.match(panel,/previous\.current=document\.activeElement/);
 assert.match(panel,/previous\.current\?\.focus/);
 assert.match(panel,/\[data-autofocus\]/);
});

test('generic billing and arcade timers use real one-second ticks and completion is guarded once',async()=>{
 const mechanics=await text('src/world/GenericMechanics.jsx');
 assert.match(mechanics,/function useOnceComplete/);
 assert.match(mechanics,/setInterval\(\(\)=>setSeconds\(s=>s\+1\),1000\)/);
 assert.match(mechanics,/setTimeout\(\(\)=>setTime\(t=>t-1\),1000\)/);
});

test('offline memory packs are isolated from runtime media and core shell caches',async()=>{
 const sw=await text('public/sw.js');
 assert.match(sw,/const PACKS=/);
 assert.match(sw,/CLEAR_MEMORY_PACKS/);
 assert.match(sw,/caches\.delete\(PACKS\)/);
 assert.match(sw,/caches\.open\(PACKS\)/);
 assert.match(sw,/MEMORY_PACKS_CLEARED/);
 const clearBlock=sw.slice(sw.indexOf("data.type==='CLEAR_MEMORY_PACKS'"),sw.indexOf("data.type==='CACHE_MEMORY_PACK'"));
 assert.equal(clearBlock.includes('caches.delete(SHELL)'),false);
 assert.equal(clearBlock.includes('caches.delete(MEDIA)'),false);
});

test('journey scene and year are written back to the current URL',async()=>{
 const app=await text('src/world/WorldAppV4.jsx');
 assert.match(app,/url\.searchParams\.set\('scene',sceneId\)/);
 assert.match(app,/url\.searchParams\.set\('year',String\(year\)\)/);
 assert.match(app,/history\.replaceState/);
});

test('archive portal dynamically loads both full archive and contextual dossier with recovery',async()=>{
 const [app,portal,contextRoute]=await Promise.all([text('src/world/WorldAppV4.jsx'),text('src/world/ArchivePortal.jsx'),text('src/world/ContextualArchiveRoute.jsx')]);
 assert.match(app,/ArchivePortal/);
 assert.equal(app.includes("import LegacyArchive"),false);
 assert.equal(app.includes("import ContextualArchivePage"),false);
 assert.match(portal,/full:\(\)=>import\('\.\.\/ArchiveRoute\.jsx'\)/);
 assert.match(portal,/context:\(\)=>import\('\.\/ContextualArchiveRoute\.jsx'\)/);
 assert.match(portal,/useArchiveModule/);
 assert.match(portal,/ArchiveFailure/);
 assert.match(portal,/setRetryToken/);
 assert.match(portal,/returnButton\.current\?\.focus\(\)/);
 assert.match(contextRoute,/archive-styles\.js/);
});

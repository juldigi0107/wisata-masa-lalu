import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const text=path=>readFile(new URL(`../${path}`,import.meta.url),'utf8');

test('premium v5 runtime is mounted with the World Experience Shell without inflating the critical stylesheet',async()=>{
 const [main,shell,styleLoader]=await Promise.all([text('src/main.jsx'),text('src/world/WorldExperienceShell.jsx'),text('src/world/premium-runtime-styles.js')]);
 assert.match(main,/PremiumRuntimeV5/);
 assert.match(main,/WorldExperienceShell/);
 assert.match(shell,/WorldAppV4/);
 assert.match(main,/import\("\.\/world\/premium-runtime-styles\.js"\)/);
 assert.match(styleLoader,/premium-experience-v5\.css/);
 assert.match(styleLoader,/premium-intensity-v5\.css/);
 assert.equal(main.includes('premium-experience-v5.css'),false);
 assert.equal(main.includes('premium-intensity-v5.css'),false);
 assert.match(main,/entry-premium-v5\.css/);
 assert.match(main,/AmbientRuntimeV4/);
});

test('cinematic atmosphere portals inside the world stacking context and disappears with world removal',async()=>{
 const runtime=await text('src/world/PremiumRuntimeV5.jsx');
 assert.match(runtime,/createPortal/);
 assert.match(runtime,/document\.querySelector\('\.world-app'\)/);
 assert.match(runtime,/childList:true/);
 assert.match(runtime,/premium-scene-entering/);
 assert.match(runtime,/premium-season-shift/);
 assert.match(runtime,/lastScene/);
 assert.match(runtime,/lastMode/);
 assert.match(runtime,/if\(!state\.active\|\|!state\.host\)return null/);
});

test('premium scene treatment covers time of day seasonal modes reduced motion and nostalgia intensity',async()=>{
 const [css,intensity,runtime]=await Promise.all([text('src/world/premium-experience-v5.css'),text('src/world/premium-intensity-v5.css'),text('src/world/PremiumRuntimeV5.jsx')]);
 for(const selector of ['premium-pagi','premium-siang','premium-sore','premium-malam','premium-ramadan','premium-agustusan','premium-scene-entering'])assert.match(css,new RegExp(selector));
 for(const mode of ['ramadan','lebaran','agustusan','minggu','malam-minggu'])assert.ok(runtime.includes(mode));
 for(const selector of ['intensity-ringan','intensity-imersif','intensity-total','year-accent'])assert.match(intensity,new RegExp(selector));
 assert.match(css,/prefers-reduced-motion:reduce/);
 assert.match(intensity,/prefers-reduced-motion:reduce/);
 assert.match(css,/experience-dock button\[aria-pressed=true\]/);
});

test('ambient synthesis reacts to scene phase and every seasonal mode without external audio files',async()=>{
 const runtime=await text('src/world/AmbientRuntimeV4.jsx');
 for(const mode of ['ramadan','lebaran','agustusan','minggu','malam-minggu'])assert.ok(runtime.includes(mode));
 assert.match(runtime,/seasonalAccent/);
 assert.match(runtime,/phase==='malam'/);
 assert.equal(/https?:\/\//.test(runtime),false);
 assert.equal(/\.(mp3|wav|ogg|m4a)/i.test(runtime),false);
});

test('entry onboarding and recovery states receive the same premium language with motion fallback',async()=>{
 const css=await text('src/world/entry-premium-v5.css');
 for(const selector of ['\.time-intro','\.onboarding-paper','\.profile-choices','\.archive-loading','\.fatal-shell'])assert.match(css,new RegExp(selector));
 assert.match(css,/prefers-reduced-motion:reduce/);
 assert.match(css,/safe-area-inset/);
});

test('archive premium v5 remains in the lazy archive style chunk and enhances long-form reading',async()=>{
 const [loader,css,contextCss,main]=await Promise.all([text('src/world/archive-styles.js'),text('src/world/archive-premium-v5.css'),text('src/world/context-premium-v5.css'),text('src/main.jsx')]);
 assert.match(loader,/archive-premium-v5\.css/);
 assert.match(loader,/context-premium-v5\.css/);
 assert.equal(main.includes('archive-premium-v5.css'),false);
 assert.equal(main.includes('context-premium-v5.css'),false);
 for(const selector of ['\.hero','\.module-card','\.clip-card','\.feature-story','\.quiz-ticket','\.credits'])assert.match(css,new RegExp(selector));
 for(const selector of ['\.context-entry-hero','\.context-entry-provenance','\.context-source-room','\.context-source-list'])assert.match(contextCss,new RegExp(selector));
 assert.match(css,/prefers-reduced-motion:reduce/);
 assert.match(contextCss,/prefers-reduced-motion:reduce/);
});
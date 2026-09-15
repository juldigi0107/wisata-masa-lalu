import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';

const sceneFiles=['rumah-90.svg','kampung-90.svg','sekolah-90.svg','kota-90.svg','digital-90.svg'];

test('premium world ships five lightweight original scene assets without embedded base64',async()=>{
 for(const name of sceneFiles){
  const path=new URL(`../public/assets/world/scenes/${name}`,import.meta.url);
  const [text,info]=await Promise.all([readFile(path,'utf8'),stat(path)]);
  assert.match(text,/^<svg[\s>]/,`not an SVG: ${name}`);
  assert.equal(/data:[^;]+;base64/i.test(text),false,`embedded base64 is forbidden: ${name}`);
  assert.ok(info.size<100_000,`scene asset too heavy: ${name} (${info.size} bytes)`);
  assert.match(text,/viewBox="0 0 1600 900"/,`scene art must share cinematic 16:9 canvas: ${name}`);
 }
});

test('premium CSS keeps anti-dashboard spatial layout and accessibility escape hatches',async()=>{
 const [premium,motion,polish]=await Promise.all([
  readFile(new URL('../src/world/premium.css',import.meta.url),'utf8'),
  readFile(new URL('../src/world/motion.css',import.meta.url),'utf8'),
  readFile(new URL('../src/world/polish.css',import.meta.url),'utf8')
 ]);
 assert.match(premium,/\.world-scene\{height:100svh/);
 assert.match(premium,/\.experience-dock\{position:fixed/);
 assert.match(premium,/\.environment-nav\{position:fixed/);
 assert.match(premium,/\.interaction-drawer\{position:fixed/);
 assert.match(premium,/prefers-reduced-motion:reduce/);
 assert.match(premium,/prefers-contrast:more/);
 assert.match(motion,/prefers-reduced-motion:reduce/);
 assert.match(polish,/@media\(hover:none\)/);
 assert.equal(/base64/i.test(premium+motion+polish),false,'premium CSS must not embed base64 assets');
});

test('mobile premium layer is a dedicated composition, not a scaled dashboard',async()=>{
 const mobile=await readFile(new URL('../src/world/mobile-premium.css',import.meta.url),'utf8');
 assert.match(mobile,/@media \(max-width:900px\)/);
 assert.match(mobile,/\.profile-strip\{display:none!important\}/);
 assert.match(mobile,/\.interaction-drawer[\s\S]*bottom:max\(8px,env\(safe-area-inset-bottom\)\)/);
 assert.match(mobile,/\.environment-nav[\s\S]*flex-direction:row!important/);
 assert.match(mobile,/\.experience-dock[\s\S]*scroll-snap-type:x proximity/);
 assert.match(mobile,/env\(safe-area-inset-top\)/);
 assert.match(mobile,/env\(safe-area-inset-bottom\)/);
 assert.match(mobile,/@media \(pointer:coarse\)/);
 assert.equal(/grid-template-columns:repeat\([4-9]/.test(mobile),false,'mobile layer must not introduce dashboard-like dense grids');
});

test('runtime visual assets are derived from Vite BASE_URL for Pages and custom-domain portability',async()=>{
 const [main,runtime]=await Promise.all([
  readFile(new URL('../src/main.jsx',import.meta.url),'utf8'),
  readFile(new URL('../src/world/runtime-assets.css',import.meta.url),'utf8')
 ]);
 assert.match(main,/import\.meta\.env\.BASE_URL/);
 assert.match(main,/--wml-portal-grid/);
 assert.match(main,/--wml-brand-orbit/);
 for(const id of ['rumah','kampung','sekolah','kota','digital']){
  assert.match(main,new RegExp(`--wml-scene-\\$\\{id\\}`));
  assert.match(runtime,new RegExp(`--wml-scene-${id}`));
 }
 assert.match(runtime,/var\(--wml-portal-grid\)/);
 assert.match(runtime,/var\(--wml-brand-orbit\)/);
 assert.equal(/\/wisata-masa-lalu\//.test(runtime),false,'runtime asset layer must not couple to repository path');
});

test('PWA shell includes scene art and memory-pack cache hook',async()=>{
 const sw=await readFile(new URL('../public/sw.js',import.meta.url),'utf8');
 for(const name of sceneFiles)assert.match(sw,new RegExp(name.replace('.','\\.')));
 assert.match(sw,/CACHE_MEMORY_PACK/);
 assert.match(sw,/MEMORY_PACK_READY/);
});

test('Pages workflow enforces performance budget after production build and before upload',async()=>{
 const workflow=await readFile(new URL('../.github/workflows/pages.yml',import.meta.url),'utf8');
 const buildIndex=workflow.indexOf('Build production bundle');
 const budgetIndex=workflow.indexOf('Enforce production performance budget');
 const uploadIndex=workflow.indexOf('actions/upload-pages-artifact');
 assert.ok(buildIndex>=0&&budgetIndex>buildIndex&&uploadIndex>budgetIndex,'performance budget must gate artifact upload');
 assert.match(workflow,/node scripts\/check-build-budget\.mjs/);
});

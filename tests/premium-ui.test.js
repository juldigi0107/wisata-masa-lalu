import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,readdir,stat} from 'node:fs/promises';

const sceneFiles=['rumah-90.svg','kampung-90.svg','sekolah-90.svg','kota-90.svg','digital-90.svg'];

test('premium world ships five lightweight original scene assets without embedded base64',async()=>{
 const dir=new URL('../public/assets/world/scenes/',import.meta.url);
 const files=(await readdir(dir)).filter(name=>name.endsWith('.svg'));
 for(const name of sceneFiles)assert.ok(files.includes(name),`missing scene asset: ${name}`);
 for(const name of sceneFiles){
  const file=new URL(name,dir);
  const [content,info]=await Promise.all([readFile(file,'utf8'),stat(file)]);
  assert.ok(info.size<18*1024,`${name} is too large for a critical scene asset`);
  assert.equal(content.includes('data:image'),false,`${name} must not embed base64 imagery`);
 }
});

test('premium CSS keeps anti-dashboard spatial layout and accessibility escape hatches',async()=>{
 const css=await readFile(new URL('../src/world/premium.css',import.meta.url),'utf8');
 assert.match(css,/\.world-scene/);
 assert.match(css,/\.scene-object/);
 assert.match(css,/prefers-reduced-motion/);
 assert.match(css,/focus-visible/);
 assert.equal(/grid-template-columns:\s*repeat\(4,\s*1fr\)/.test(css),false,'premium world should not collapse into a generic four-card dashboard');
});

test('mobile premium layer is a dedicated composition, not a scaled dashboard',async()=>{
 const css=await readFile(new URL('../src/world/mobile-premium.css',import.meta.url),'utf8');
 assert.match(css,/@media\s*\(max-width:\s*(?:760|900)px\)/);
 assert.match(css,/\.world-hud/);
 assert.match(css,/\.scene-object/);
 assert.match(css,/safe-area-inset/);
 assert.match(css,/scroll-snap-type/);
});

test('mobile keeps every primary HUD feature reachable and gives archive its own scrolling surface',async()=>{
 const [mobile,app]=await Promise.all([
  readFile(new URL('../src/world/mobile-premium.css',import.meta.url),'utf8'),
  readFile(new URL('../src/world/WorldAppV4.jsx',import.meta.url),'utf8')
 ]);
 for(const label of ['Cari','Koleksi','Suara'])assert.match(app,new RegExp(label));
 assert.match(mobile,/overflow-x:auto/);
 assert.match(mobile,/archive-mode/);
});

test('portrait focus pan covers every interactive object in every scene',async()=>{
 const css=await readFile(new URL('../src/world/mobile-focus.css',import.meta.url),'utf8');
 for(const id of ['rumah','kampung','sekolah','kota','digital'])assert.match(css,new RegExp(`scene-${id}`));
 assert.match(css,/:has\(\.scene-object:focus-visible\)/);
 assert.match(css,/:is\(\.active,:focus-visible\)/);
});

test('runtime visual assets are derived from Vite BASE_URL for Pages and custom-domain portability',async()=>{
 const [main,runtime]=await Promise.all([
  readFile(new URL('../src/main.jsx',import.meta.url),'utf8'),
  readFile(new URL('../src/world/runtime-assets.css',import.meta.url),'utf8')
 ]);
 assert.match(main,/import\.meta\.env\.BASE_URL/);
 assert.match(main,/--wml-scene-/);
 assert.match(runtime,/var\(--wml-scene-rumah\)/);
 assert.equal(runtime.includes('/wisata-masa-lalu/assets/world/scenes/'),false,'runtime scene CSS must not hardcode the repo path');
});

test('render failures have a branded recovery boundary instead of a blank page',async()=>{
 const [main,shell,resilience]=await Promise.all([
  readFile(new URL('../src/main.jsx',import.meta.url),'utf8'),
  readFile(new URL('../src/world/WorldExperienceShell.jsx',import.meta.url),'utf8'),
  readFile(new URL('../src/world/resilience.css',import.meta.url),'utf8')
 ]);
 assert.match(main,/class AppErrorBoundary extends React\.Component/);
 assert.match(main,/getDerivedStateFromError/);
 assert.match(main,/Muat ulang aplikasi/);
 const boundary=main.match(/<AppErrorBoundary>([\s\S]*?)<\/AppErrorBoundary>/)?.[1]||'';
 for(const runtime of ['WorldExperienceShell','AmbientRuntimeV4','PremiumRuntimeV5'])assert.match(boundary,new RegExp(`<${runtime}\\s*\\/>`),`${runtime} must stay inside the recovery boundary`);
 assert.match(shell,/<WorldAppV4\/>/,'WorldAppV4 must stay inside the experience shell that is protected by the recovery boundary');
 assert.match(resilience,/\.fatal-shell/);
 assert.equal(/localStorage\.removeItem/.test(main.split('class AppErrorBoundary')[1]||''),false,'render recovery must not delete user progress');
});

test('PWA manifest uses relative scope and shortcuts so install navigation survives a custom domain',async()=>{
 const raw=await readFile(new URL('../public/manifest.webmanifest',import.meta.url),'utf8');
 const manifest=JSON.parse(raw);
 assert.equal(manifest.id,'./');
 assert.equal(manifest.start_url,'./');
 assert.equal(manifest.scope,'./');
 assert.ok(Array.isArray(manifest.shortcuts)&&manifest.shortcuts.length>=3);
 for(const shortcut of manifest.shortcuts){
  assert.match(shortcut.url,/^\.\//,`shortcut must be scope-relative: ${shortcut.name}`);
  assert.equal(shortcut.url.includes('/wisata-masa-lalu/'),false,`shortcut is repository-coupled: ${shortcut.name}`);
 }
});

test('PWA shell includes scene art memory-pack hooks and first-run production bundle discovery',async()=>{
 const sw=await readFile(new URL('../public/sw.js',import.meta.url),'utf8');
 for(const name of sceneFiles)assert.match(sw,new RegExp(name.replace('.','\\.')));
 assert.match(sw,/CACHE_MEMORY_PACK/);
 assert.match(sw,/MEMORY_PACK_READY/);
 assert.match(sw,/function shellAssetUrls/);
 assert.match(sw,/\.\(\?:js\|css\)/);
 assert.match(sw,/async function installShell/);
 assert.match(sw,/production JS bundle not discoverable/);
 assert.match(sw,/Promise\.all\(discovered\.map/);
});

test('Pages workflow enforces performance budget after production build and before upload',async()=>{
 const workflow=await readFile(new URL('../.github/workflows/pages.yml',import.meta.url),'utf8');
 const buildIndex=workflow.indexOf('Build production bundle');
 const budgetIndex=workflow.indexOf('Enforce production performance budget');
 const uploadIndex=workflow.indexOf('actions/upload-pages-artifact');
 assert.ok(buildIndex>=0&&budgetIndex>buildIndex&&uploadIndex>budgetIndex,'performance budget must gate artifact upload');
 assert.match(workflow,/node scripts\/check-build-budget\.mjs/);
});
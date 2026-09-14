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

test('PWA shell includes scene art and memory-pack cache hook',async()=>{
 const sw=await readFile(new URL('../public/sw.js',import.meta.url),'utf8');
 for(const name of sceneFiles)assert.match(sw,new RegExp(name.replace('.','\\.')));
 assert.match(sw,/CACHE_MEMORY_PACK/);
 assert.match(sw,/MEMORY_PACK_READY/);
});

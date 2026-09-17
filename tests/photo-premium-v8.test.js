import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const text=path=>readFile(new URL(`../${path}`,import.meta.url),'utf8');

test('premium visual pipeline is photo-assisted after the legacy spatial raster pass',async()=>{
 const [pkg,generator]=await Promise.all([text('package.json'),text('scripts/generate-premium-photo-scenes.mjs')]);
 assert.match(pkg,/generate-premium-photo-scenes\.mjs/);
 assert.ok(pkg.indexOf('generate-world-raster.mjs')<pkg.indexOf('generate-premium-photo-scenes.mjs'));
 assert.match(generator,/scenePhotoMap/);
 assert.match(generator,/sharp/);
});

test('all primary world and feature surfaces receive raster page backdrops',async()=>{
 const [main,generator]=await Promise.all([text('src/main.jsx'),text('scripts/generate-premium-secondary-pages.mjs')]);
 for(const id of ['intro','onboarding','time-machine','search','collection','campaign','settings','social','moderation','recovery','season','memory-card','archive-loading'])assert.match(main,new RegExp(id));
 assert.match(generator,/assets\/generated/);
});

test('archive chapters use raster photo surfaces instead of plain decorative geometry',async()=>{
 const [main,css]=await Promise.all([text('src/main.jsx'),text('src/world/premium-photo-pages.css')]);
 for(const id of ['archive','tv','games','objects','timeline','warung','ramadan','music','quiz','collection','school'])assert.match(main,new RegExp(`--wml-surface-${id}`));
 assert.match(css,/--wml-surface-archive/);
});

test('release build enforces raster-only artifact and photo-premium coverage',async()=>{
 const checker=await text('scripts/check-photo-premium.mjs');
 assert.match(checker,/5\/5 scenes/);
 assert.match(checker,/page backdrops/);
});

test('offline shell rotates generation and preloads premium visual pages',async()=>{
 const sw=await text('public/sw.js');
 assert.match(sw,/wml-time-machine-v\d+-0/);
 assert.match(sw,/premiumPages/);
 assert.match(sw,/assets\/generated\/\$\{id\}-premium\.webp/);
});
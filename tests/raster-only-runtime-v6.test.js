import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const text=path=>readFile(new URL(`../${path}`,import.meta.url),'utf8');

test('first paint and PWA manifest use generated raster assets only',async()=>{
 const [html,manifest,sw]=await Promise.all([
  text('index.html'),text('public/manifest.webmanifest'),text('public/sw.js')
 ]);
 assert.equal(html.includes('.svg'),false,'index.html must not preload or icon-link SVG authoring files');
 assert.equal(manifest.includes('.svg'),false,'manifest icons must be raster');
 assert.equal(sw.includes('.svg'),false,'service worker must not depend on SVG runtime paths');
 for(const path of ['wml-64.png','wml-180.png'])assert.match(html,new RegExp(path.replace('.','\\.')));
 for(const path of ['wml-192.png','wml-512.png','wml-maskable-512.png'])assert.match(manifest,new RegExp(path.replace('.','\\.')));
 assert.match(html,/rumah-90\.webp/);
});

test('build generates install PNGs then scrubs all public SVG artifacts',async()=>{
 const [pkg,generator,scrubber,budget]=await Promise.all([
  text('package.json'),text('scripts/generate-world-raster.mjs'),text('scripts/scrub-runtime-svg.mjs'),text('scripts/check-build-budget.mjs')
 ]);
 assert.match(pkg,/vite build && node scripts\/scrub-runtime-svg\.mjs/);
 for(const icon of ['wml-64.png','wml-180.png','wml-192.png','wml-512.png','wml-maskable-512.png'])assert.match(generator,new RegExp(icon.replace('.','\\.')));
 assert.match(scrubber,/Runtime SVG references remain after raster rewrite/);
 assert.match(scrubber,/Authoring SVG still present in production artifact/);
 assert.match(budget,/SVG leaked into public production artifact/);
 assert.match(budget,/PWA PNG icons/);
});

test('archive SVG authoring references are explicitly rewritten to generated WebP during production scrub',async()=>{
 const scrubber=await text('scripts/scrub-runtime-svg.mjs');
 const pairs=[
  ['brand-seal.svg','brand-seal.webp'],
  ['cassette-player.svg','cassette-player.webp'],
  ['handheld-game.svg','handheld-game.webp'],
  ['ramadan-lantern.svg','ramadan-lantern.webp']
 ];
 for(const [from,to] of pairs){assert.match(scrubber,new RegExp(from.replace('.','\\.')));assert.match(scrubber,new RegExp(to.replace('.','\\.')))}
});

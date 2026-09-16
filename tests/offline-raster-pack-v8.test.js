import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const text=path=>readFile(new URL(`../${path}`,import.meta.url),'utf8');

test('legacy memory-pack authoring scene requests are normalized to generated WebP before caching',async()=>{
 const sw=await text('public/sw.js');
 assert.match(sw,/function normalizeMemoryPackUrl/);
 assert.match(sw,/assets\/world\/scenes\//);
 assert.match(sw,/legacyExt='\.'\+\['s','v','g'\]\.join\(''\)/);
 assert.match(sw,/assets\/world\/raster\/\$\{match\[1\]\.toLowerCase\(\)\}-90\.webp/);
 assert.match(sw,/\.map\(normalizeMemoryPackUrl\)/);
 assert.equal(sw.includes('.svg'),false,'service worker source remains raster-only');
});

test('offline shell keeps the production v8 cache contract and raster scene preloads',async()=>{
 const sw=await text('public/sw.js');
 assert.match(sw,/wml-time-machine-v8-0/);
 assert.match(sw,/assets\/world\/raster\/rumah-90\.webp/);
 assert.match(sw,/assets\/world\/raster\/digital-90\.webp/);
});

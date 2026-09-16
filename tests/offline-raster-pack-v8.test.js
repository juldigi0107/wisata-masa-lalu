import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const text=path=>readFile(new URL(`../${path}`,import.meta.url),'utf8');

test('legacy memory-pack scene SVG requests are normalized to generated WebP before caching',async()=>{
 const sw=await text('public/sw.js');
 assert.match(sw,/function normalizeMemoryPackUrl/);
 assert.match(sw,/assets\\\/world\\\/scenes/);
 assert.match(sw,/assets\/world\/raster\/\$\{match\[1\]\.toLowerCase\(\)\}-90\.webp/);
 assert.match(sw,/\.map\(normalizeMemoryPackUrl\)/);
});

test('offline shell generation was rotated after raster-only pack migration',async()=>{
 const sw=await text('public/sw.js');
 assert.match(sw,/wml-time-machine-v8-1/);
 assert.match(sw,/assets\/world\/raster\/rumah-90\.webp/);
 assert.match(sw,/assets\/world\/raster\/digital-90\.webp/);
});

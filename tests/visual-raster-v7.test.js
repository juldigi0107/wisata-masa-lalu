import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const text=path=>readFile(new URL(`../${path}`,import.meta.url),'utf8');

test('visual generator produces phase-specific raster scenes instead of relying on CSS tinting alone',async()=>{
 const script=await text('scripts/generate-world-raster.mjs');
 for(const phase of ['pagi','siang','sore','malam'])assert.match(script,new RegExp(`${phase}:svg`));
 assert.match(script,/sceneModes=id==='kampung'/);
 assert.match(script,/\['hujan','ramadan','agustusan','minggu'\]/);
 assert.match(script,/\$\{id\}-\$\{mode\}\.webp/);
 assert.match(script,/premium-surface/);
 assert.match(script,/texture-/);
});

test('runtime wires generated phase and contextual scene WebP through BASE_URL-safe variables',async()=>{
 const main=await text('src/main.jsx');
 assert.match(main,/const phases=\['pagi','siang','sore','malam'\]/);
 assert.match(main,/contextualStates=/);
 assert.match(main,/assets\/world\/raster\/\$\{id\}-\$\{phase\}\.webp/);
 assert.match(main,/assets\/generated\/\$\{id\}\.webp/);
 assert.match(main,/texture-\$\{id\}\.webp/);
});

test('visual raster CSS uses rendered scene states and photographic archive surfaces',async()=>{
 const css=await text('src/world/visual-raster-v7.css');
 for(const id of ['rumah','kampung','sekolah','kota','digital'])assert.match(css,new RegExp(`scene-${id}\\.phase-`));
 for(const surface of ['archive','tv','games','objects','timeline','warung','ramadan','music','quiz','collection'])assert.match(css,new RegExp(`--wml-surface-${surface}`));
 assert.match(css,/--wml-texture-photo/);
 assert.match(css,/--wml-texture-paper/);
});

test('premium raster pack is build-gated for presence size and total payload',async()=>{
 const [pkg,check]=await Promise.all([text('package.json'),text('scripts/check-premium-raster-pack.mjs')]);
 assert.match(pkg,/check-premium-raster-pack\.mjs/);
 assert.match(check,/420\*1024/);
 assert.match(check,/16\*1024\*1024/);
 assert.match(check,/Object Lens coverage/);
 assert.match(check,/Premium raster pack/);
});

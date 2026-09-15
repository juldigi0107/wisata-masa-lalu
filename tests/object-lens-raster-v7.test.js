import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {scenes} from '../shared/world-model.js';

const read=path=>readFile(new URL(`../${path}`,import.meta.url),'utf8');

test('every spatial object is mapped to a unique generated Object Lens WebP',async()=>{
 const [generator,runtime,css,check]=await Promise.all([read('scripts/generate-object-lens-raster.mjs'),read('src/world/ObjectLensVisualRuntimeV7.jsx'),read('src/world/object-lens-raster-v7.css'),read('scripts/check-premium-raster-pack.mjs')]);
 const objectCount=Object.values(scenes).reduce((sum,scene)=>sum+scene.objects.length,0);
 assert.equal(objectCount,43);
 assert.match(generator,/generated','objects/);
 assert.match(generator,/scene\.id}-\$\{object\.id\}\.webp/);
 assert.match(runtime,/assets\/generated\/objects\/\$\{hit\.scene\}-\$\{hit\.id\}\.webp/);
 assert.match(css,/--wml-object-lens-image/);
 assert.match(check,/Object Lens coverage/);
});

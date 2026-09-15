import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const read=path=>readFile(new URL(`../${path}`,import.meta.url),'utf8');

test('social memory and moderation use raster surfaces and canvas preview',async()=>{
 const [css,studio,styles]=await Promise.all([read('src/world/social-raster-v7.css'),read('src/world/MemoryCardStudio.jsx'),read('src/world/premium-runtime-styles.js')]);
 assert.match(css,/--wml-surface-collection/);
 assert.match(css,/memory-card-preview canvas/);
 assert.match(css,/--wml-texture-photo/);
 assert.match(studio,/<canvas ref=\{canvasRef\}/);
 assert.match(styles,/social-raster-v7\.css/);
});

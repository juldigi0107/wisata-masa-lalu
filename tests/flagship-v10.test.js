import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const text=path=>readFile(new URL(`../${path}`,import.meta.url),'utf8');

test('flagship runtime loads v10 after v8 and v9',async()=>{
 const runtime=await text('src/world/FlagshipRuntimeV8.jsx');
 const a=runtime.indexOf('flagship-v8.css'),b=runtime.indexOf('flagship-v9.css'),c=runtime.indexOf('flagship-v10.css');
 assert.ok(a>=0&&b>a&&c>b);
});

test('v10 protects text contrast on image-backed world and deep panels',async()=>{
 const css=await text('public/assets/flagship-v10.css');
 assert.match(css,/scene-caption\{background:linear-gradient/);
 assert.match(css,/context-entry-hero:after/);
 assert.match(css,/--v10-cream:#fff1dc/);
 assert.match(css,/prefers-contrast:more/);
});

test('v10 uses scene-specific dynamic object mass instead of uniform dashboard sizing',async()=>{
 const css=await text('public/assets/flagship-v10.css');
 for(const scene of ['rumah','kampung','sekolah','kota','digital'])assert.match(css,new RegExp(`scene-${scene} \\.scene-object:nth-of-type`));
 assert.match(css,/--v10-object:clamp/);
 assert.match(css,/--mass:1\.5/);
});

test('v10 keeps deepest surfaces fluid and mobile safe',async()=>{
 const css=await text('public/assets/flagship-v10.css');
 assert.match(css,/\.search-panel\{width:min\(1040px/);
 assert.match(css,/\.time-machine-panel>h2\{font-size:clamp/);
 assert.match(css,/\.collection-grid\{grid-template-columns:repeat\(4/);
 assert.match(css,/env\(safe-area-inset-bottom\)/);
 assert.match(css,/max-height:min\(88dvh,820px\)/);
});

test('PWA shell rotates cache generation and includes flagship v10',async()=>{
 const sw=await text('public/sw.js');
 assert.match(sw,/wml-time-machine-v10-0/);
 assert.match(sw,/assets\/flagship-v10\.css/);
});

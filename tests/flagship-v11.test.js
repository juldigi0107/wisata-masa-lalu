import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const text=path=>readFile(new URL(`../${path}`,import.meta.url),'utf8');

test('flagship runtime loads v11 after previous optical layers',async()=>{
 const runtime=await text('src/world/FlagshipRuntimeV8.jsx');
 assert.match(runtime,/wml-flagship-v11-css/);
 assert.match(runtime,/flagship-v11\.css/);
 const v10=runtime.indexOf('flagship-v10.css');
 const v11=runtime.indexOf('flagship-v11.css');
 assert.ok(v10>=0&&v11>v10,'v11 must load after v10');
});

test('v11 protects image-backed copy and archive paper contrast',async()=>{
 const css=await text('public/assets/flagship-v11.css');
 assert.match(css,/Global contrast safety/);
 assert.match(css,/context-entry-hero/);
 assert.match(css,/Archive: dark-on-paper contract/);
 assert.match(css,/color-scheme:light/);
 assert.match(css,/prefers-contrast:more/);
});

test('v11 object scale is fluid and bounded instead of fixed-size mockup hotspots',async()=>{
 const css=await text('public/assets/flagship-v11.css');
 assert.match(css,/container-type:size/);
 assert.match(css,/--v11-object:clamp\(/);
 assert.match(css,/6\.2cqw/);
 assert.match(css,/max-width:104px/);
 assert.match(css,/max-height:104px/);
});

test('v11 has dedicated portrait landscape and reduced-motion compositions',async()=>{
 const css=await text('public/assets/flagship-v11.css');
 assert.match(css,/@media\(max-width:760px\)/);
 assert.match(css,/@media\(max-width:430px\)/);
 assert.match(css,/@media\(max-height:640px\) and \(orientation:landscape\)/);
 assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
});

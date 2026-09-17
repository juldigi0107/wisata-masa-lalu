import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const text=path=>readFile(new URL(`../${path}`,import.meta.url),'utf8');

test('flagship v9 is loaded after v8',async()=>{
 const runtime=await text('src/world/FlagshipRuntimeV8.jsx');
 assert.match(runtime,/flagship-v8\.css/);assert.match(runtime,/flagship-v9\.css/);
 assert.ok(runtime.indexOf('flagship-v8.css')<runtime.indexOf('flagship-v9.css'));
});

test('flagship v9 provides explicit contrast and dynamic object scale contracts',async()=>{
 const css=await text('public/assets/flagship-v9.css');
 assert.match(css,/CONTRAST CONTRACT/);assert.match(css,/--v9-text:#f8efdf/);
 assert.match(css,/\.scene-caption:before/);assert.match(css,/\.scene-object:nth-of-type\(3n\+1\)/);
 assert.match(css,/--object-size:clamp/);assert.match(css,/prefers-contrast:more/);
});

test('flagship v9 keeps mobile and short-landscape layouts deliberate',async()=>{
 const css=await text('public/assets/flagship-v9.css');
 assert.match(css,/@media\(max-width:520px\)/);assert.match(css,/@media\(max-height:560px\) and \(orientation:landscape\)/);
 assert.match(css,/\.scene-object>small\{display:none!important\}/);
});

test('offline shell rotates and explicitly includes flagship runtime styles',async()=>{
 const sw=await text('public/sw.js');
 assert.match(sw,/wml-time-machine-v9-0/);assert.match(sw,/assets\/flagship-v8\.css/);assert.match(sw,/assets\/flagship-v9\.css/);
});

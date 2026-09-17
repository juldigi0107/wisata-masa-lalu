import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const text=path=>readFile(new URL(`../${path}`,import.meta.url),'utf8');

test('flagship runtime loads v12 after previous optical layers',async()=>{
 const runtime=await text('src/world/FlagshipRuntimeV8.jsx');
 const v11=runtime.indexOf('flagship-v11.css');
 const v12=runtime.indexOf('flagship-v12.css');
 assert.ok(v11>=0&&v12>v11,'v12 must be the final flagship cascade layer');
});

test('v12 explicitly protects contrast on dark panels and resets archive to dark ink on paper',async()=>{
 const css=await text('public/assets/flagship-v12.css');
 assert.match(css,/--f12-cream:#fff5e6/);
 assert.match(css,/\.deep-panel/);
 assert.match(css,/\.interaction-drawer/);
 assert.match(css,/\.social-memory-panel/);
 assert.match(css,/\.archive-mode,\.context-entry-page\{color-scheme:light/);
 assert.match(css,/color:#4b514a!important/);
 assert.match(css,/\.context-entry-hero :is\(h1,h2,h3,p,small,span,b,strong\)\{color:#fff5e6!important\}/);
});

test('v12 uses fluid object mass and scene-container sizing rather than fixed prototype icons',async()=>{
 const css=await text('public/assets/flagship-v12.css');
 assert.match(css,/--f12-object:clamp\(48px,6\.6cqw,88px\)/);
 assert.match(css,/width:calc\(var\(--f12-object\)\*var\(--mass,1\)\)/);
 assert.match(css,/font-size:calc\(clamp\(1\.15rem,1\.5vw,1\.85rem\)\*var\(--mass,1\)\)/);
 assert.match(css,/@media\(max-width:700px\)/);
 assert.match(css,/--f12-object:clamp\(44px,12cqw,64px\)/);
});

test('v12 deep surfaces stay non-dashboard and retain accessibility modes',async()=>{
 const css=await text('public/assets/flagship-v12.css');
 assert.match(css,/\.search-columns\{grid-template-columns:minmax\(0,1\.18fr\) minmax\(0,\.82fr\)/);
 assert.match(css,/\.season-list\{display:grid!important;grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/);
 assert.match(css,/\.collection-grid article:nth-child\(5n\+1\)\{grid-column:span 2!important\}/);
 assert.match(css,/prefers-contrast:more/);
 assert.match(css,/prefers-reduced-motion:reduce/);
 assert.equal(css.includes('grid-template-columns:repeat(4,1fr)'),false,'must not introduce a generic four-column dashboard grid');
});

import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const text=path=>readFile(new URL(`../${path}`,import.meta.url),'utf8');

test('community memory surfaces share the visual DNA without becoming a dashboard',async()=>{
 const css=await text('src/world/social-visual-dna-v6.css');
 for(const selector of ['.social-memory-panel','.memory-wall-layout','.memory-note','.capsule-layout','.moderation-shell','.moderation-queue'])assert.match(css,new RegExp(selector.replace('.','\\.')));
 assert.match(css,/backdrop-filter/);
 assert.match(css,/prefers-reduced-motion/);
 assert.equal(/grid-template-columns:\s*repeat\([4-9],\s*1fr\)/.test(css),false);
});

test('premium async style loader includes both world and community visual DNA',async()=>{
 const loader=await text('src/world/premium-runtime-styles.js');
 assert.match(loader,/visual-dna-v6\.css/);
 assert.match(loader,/social-visual-dna-v6\.css/);
});

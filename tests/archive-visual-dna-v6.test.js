import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const text=path=>readFile(new URL(`../${path}`,import.meta.url),'utf8');

test('archive loads the shared museum visual DNA as an async archive-only layer',async()=>{
 const [loader,css]=await Promise.all([
  text('src/world/archive-styles.js'),
  text('src/world/archive-visual-dna-v6.css')
 ]);
 assert.match(loader,/archive-visual-dna-v6\.css/);
 for(const selector of ['.hero','.module-grid','.tv-section','.object-section','.quiz','.collection','.feature-story'])assert.match(css,new RegExp(selector.replace('.','\\.')));
 assert.match(css,/prefers-reduced-motion/);
 assert.equal(/grid-template-columns:\s*repeat\([4-9],\s*1fr\)/.test(css),false);
});

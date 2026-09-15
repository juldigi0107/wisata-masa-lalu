import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const text=path=>readFile(new URL(`../${path}`,import.meta.url),'utf8');

test('main loads unified page, chapter, dossier, mobile and focus layers in production entry',async()=>{
 const main=await text('src/main.jsx');
 for(const stylesheet of [
  './world/archive-premium.css',
  './world/archive-chapters-v2.css',
  './world/context-dossier-v2.css',
  './world/mobile-premium.css',
  './world/mobile-focus.css',
  './world/page-system.css'
 ]) assert.match(main,new RegExp(stylesheet.replaceAll('.','\\.').replaceAll('/','\\/')));
});

test('page system covers every primary world overlay without hiding functionality',async()=>{
 const css=await text('src/world/page-system.css');
 for(const selector of ['interaction-drawer','time-machine-panel','collection-panel','search-panel','campaign-panel','settings-panel']){
  assert.match(css,new RegExp(`\\.${selector}`),`missing page system coverage for ${selector}`);
 }
 assert.match(css,/archive-return/);
 assert.match(css,/prefers-reduced-motion/);
 assert.match(css,/safe-area-inset/);
 assert.equal(/display\s*:\s*none[^}]*world-hud nav button/i.test(css),false,'page system must not hide primary HUD actions');
});

test('archive chapter layer gives all public chapters explicit art direction',async()=>{
 const css=await text('src/world/archive-chapters-v2.css');
 for(const selector of ['hero','index-section','tv-section','sunday','games','object-section','decade-section','warung','ramadan','music','quiz','#collection']){
  const escaped=selector.startsWith('#')?selector.replace('#','\\#'):`\\.${selector}`;
  assert.match(css,new RegExp(escaped),`archive chapter missing: ${selector}`);
 }
 assert.match(css,/\.clip-grid/);
 assert.match(css,/\.feature-story/);
 assert.match(css,/@media\(max-width:700px\)/);
});

test('contextual dossier separates fact, context, price and source rooms with provenance summary',async()=>{
 const [jsx,css]=await Promise.all([text('src/world/ContextualArchivePage.jsx'),text('src/world/context-dossier-v2.css')]);
 for(const id of ['dossier-top','dossier-fact','dossier-context','dossier-price','dossier-sources'])assert.match(jsx,new RegExp(id));
 assert.match(jsx,/context-entry-provenance/);
 assert.match(jsx,/source-room-summary/);
 assert.match(jsx,/source-empty/);
 assert.match(css,/\.context-local-nav/);
 assert.match(css,/\.context-entry-provenance/);
 assert.match(css,/\.source-empty/);
});

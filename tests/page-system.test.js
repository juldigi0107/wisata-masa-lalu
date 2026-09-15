import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const text=path=>readFile(new URL(`../${path}`,import.meta.url),'utf8');

test('main loads unified page, chapter, resilience, dossier, mechanic, mobile and focus layers in production entry',async()=>{
 const main=await text('src/main.jsx');
 for(const stylesheet of [
  './world/archive-premium.css',
  './world/archive-chapters-v2.css',
  './world/archive-resilience-v2.css',
  './world/mechanics-v2.css',
  './world/context-dossier-v2.css',
  './world/mobile-premium.css',
  './world/mobile-focus.css',
  './world/mobile-hardening-v2.css',
  './world/entry-flow-v2.css',
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
 assert.match(jsx,/onError=/);
 assert.match(jsx,/classList\.add\('abstract'\)/);
 assert.match(css,/\.context-local-nav/);
 assert.match(css,/\.context-entry-provenance/);
 assert.match(css,/\.source-empty/);
 assert.match(css,/\.context-entry-visual\.has-image>i/,'fallback dossier art must remain hidden while a real image works');
});

test('every dedicated mechanic family keeps tactile page-level polish',async()=>{
 const css=await text('src/world/mechanics-v2.css');
 for(const selector of ['schedule-mechanic','sequence-mechanic','browse-mechanic','boot-mechanic','dialup-mechanic','event-mechanic','random-mechanic','ledger-mechanic','strategy-mechanic','pet-mechanic','secret-mechanic','ambient-mechanic','inspect-mechanic']){
  assert.match(css,new RegExp(`\\.${selector}`),`missing mechanic polish: ${selector}`);
 }
 assert.match(css,/prefers-reduced-motion/);
});

test('entry flow suppresses competing chrome when a focused interaction is open',async()=>{
 const css=await text('src/world/entry-flow-v2.css');
 assert.match(css,/\.time-intro/);
 assert.match(css,/\.onboarding/);
 assert.match(css,/world-app:has\(\.interaction-drawer\)/);
 assert.match(css,/\.environment-nav/);
 assert.match(css,/\.memory-ribbon/);
 assert.match(css,/\.experience-dock/);
 assert.match(css,/\.profile-strip/);
 assert.match(css,/\.ambient-event/);
});

test('mobile hardening accounts for virtual keyboard dynamic viewport and narrow screens',async()=>{
 const css=await text('src/world/mobile-hardening-v2.css');
 assert.match(css,/100dvh/);
 assert.match(css,/safe-area-inset-top/);
 assert.match(css,/safe-area-inset-bottom/);
 assert.match(css,/:focus-within/);
 assert.match(css,/:has\(textarea:focus\)/);
 assert.match(css,/@media\(max-width:360px\)/);
 assert.match(css,/orientation:landscape/);
 assert.match(css,/font-size:16px!important/);
});

test('archive resilience supplies designed fallbacks instead of blank media or silent empty search columns',async()=>{
 const css=await text('src/world/archive-resilience-v2.css');
 for(const selector of ['hero-photo','tv-object','sunday-art','object-stage','warung-photo','ramadan-photo','story-visual'])assert.match(css,new RegExp(`\\.${selector}`));
 assert.match(css,/:has\(img\[hidden\]\)/);
 assert.match(css,/VISUAL ARSIP TIDAK TERSEDIA/);
 assert.match(css,/search-columns section:not\(:has\(button\)\):after/);
 assert.match(css,/\.empty-state/);
 assert.match(css,/PROVENANCE GAP/);
});

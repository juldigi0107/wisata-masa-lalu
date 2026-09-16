import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const text=path=>readFile(new URL(`../${path}`,import.meta.url),'utf8');

test('premium visual pipeline is photo-assisted after the legacy spatial raster pass',async()=>{
 const pkg=JSON.parse(await text('package.json'));
 const command=pkg.scripts['generate:world-art'];
 assert.match(command,/generate-world-raster\.mjs/);
 assert.match(command,/generate-premium-photo-scenes\.mjs/);
 assert.match(command,/generate-premium-secondary-pages\.mjs/);
 assert.match(command,/generate-premium-editorial-assets\.mjs/);
 assert.ok(command.indexOf('generate-premium-photo-scenes.mjs')>command.indexOf('generate-world-raster.mjs'));
});

test('all primary world and feature surfaces receive raster page backdrops',async()=>{
 const main=await text('src/main.jsx');
 const css=await text('src/world/premium-photo-pages.css');
 for(const id of ['intro','onboarding','time-machine','search','collection','campaign','settings','social','contextual','moderation','recovery','season','culture','memory-card','archive-loading','memory-wall'])assert.ok(main.includes(`'${id}'`),`missing page variable ${id}`);
 for(const selector of ['.time-intro','.onboarding','.time-machine-panel','.search-panel','.collection-panel','.campaign-panel','.settings-panel','.social-memory-panel','.season-panel','.moderation-shell','.context-entry-page','.fatal-shell','.archive-loading','.culture-studio','.memory-card-studio'])assert.ok(css.includes(selector),`missing premium selector ${selector}`);
});

test('archive chapters use raster photo surfaces instead of plain decorative geometry',async()=>{
 const css=await text('src/world/premium-photo-pages.css');
 for(const variable of ['--wml-surface-archive','--wml-surface-tv','--wml-surface-games','--wml-surface-objects','--wml-surface-timeline','--wml-surface-warung','--wml-surface-ramadan','--wml-surface-music','--wml-surface-quiz','--wml-surface-collection'])assert.ok(css.includes(variable),`archive surface ${variable} not used`);
});

test('release build enforces raster-only artifact and photo-premium coverage',async()=>{
 const pkg=JSON.parse(await text('package.json'));
 assert.match(pkg.scripts.build,/scrub-runtime-svg\.mjs/);
 assert.match(pkg.scripts.build,/check-photo-premium\.mjs/);
 const scrub=await text('scripts/scrub-runtime-svg.mjs');
 assert.match(scrub,/authoring SVG files removed/);
 const checker=await text('scripts/check-photo-premium.mjs');
 assert.match(checker,/5\/5 scenes/);
 assert.match(checker,/page backdrops/);
});

test('offline shell rotates generation and preloads premium visual pages',async()=>{
 const sw=await text('public/sw.js');
 assert.match(sw,/wml-time-machine-v8-0/);
 assert.match(sw,/premiumPages/);
 assert.match(sw,/assets\/generated\/\$\{id\}-premium\.webp/);
});

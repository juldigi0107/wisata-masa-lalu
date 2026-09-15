import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const text=path=>readFile(new URL(`../${path}`,import.meta.url),'utf8');

test('visual DNA v6 is loaded through the premium async style chunk',async()=>{
 const [loader,main]=await Promise.all([
  text('src/world/premium-runtime-styles.js'),
  text('src/main.jsx')
 ]);
 assert.match(loader,/visual-dna-v6\.css/);
 assert.match(loader,/visual-dna-optical-v6\.css/);
 assert.equal(main.includes('import "./world/visual-dna-v6.css"'),false,'visual DNA should not inflate critical CSS');
 assert.match(main,/assets\/world\/raster\/\$\{id\}-90\.webp/);
 assert.equal(/assets\/world\/scenes\/[^"']+\.svg/.test(main),false,'production runtime must stay raster-first');
});

test('visual DNA uses generated raster scenes plus real local raster texture details',async()=>{
 const [css,main]=await Promise.all([
  text('src/world/visual-dna-v6.css'),
  text('src/main.jsx')
 ]);
 for(const id of ['rumah','kampung','sekolah','kota','digital']){
  assert.match(css,new RegExp(`--wml-scene-${id}`));
  assert.match(main,new RegExp(`--wml-scene-\\$\\{id\\}-detail|--wml-scene-${id}-detail|sceneDetailAssets`));
 }
 for(const raster of ['cassette.jpg','warung.jpg','dr-grip.jpg','pager.jpg','gameboy-color.jpg'])assert.match(main,new RegExp(raster.replace('.','\\.')));
 assert.equal(css.includes('assets/world/scenes/'),false);
});

test('world chrome remains spatial instead of dashboard-like under the new DNA',async()=>{
 const css=await text('src/world/visual-dna-v6.css');
 for(const selector of ['.world-scene','.scene-object','.scene-caption','.interaction-drawer','.time-machine-panel','.search-panel','.collection-panel','.campaign-panel','.settings-panel'])assert.match(css,new RegExp(selector.replace('.','\\.')));
 assert.match(css,/backdrop-filter/);
 assert.match(css,/prefers-reduced-motion/);
 assert.equal(/grid-template-columns:\s*repeat\([4-9],\s*1fr\)/.test(css),false,'visual DNA must not become a dense SaaS dashboard grid');
});

test('visual DNA keeps mobile scene dominance and optical hotspots accessible',async()=>{
 const [css,optical,mobile]=await Promise.all([
  text('src/world/visual-dna-v6.css'),
  text('src/world/visual-dna-optical-v6.css'),
  text('src/world/mobile-premium.css')
 ]);
 assert.match(css,/@media\(max-width:620px\)/);
 assert.match(css,/\.scene-object:hover/);
 assert.match(css,/\.scene-object:focus-visible/);
 assert.match(css,/\.scene-object\.active/);
 assert.match(css,/\.scene-caption/);
 assert.match(mobile,/\.profile-strip\{display:none!important\}/);
 assert.match(mobile,/\.world-scene\{height:100svh!important;min-height:100svh!important\}/);
 assert.match(optical,/\.scene-object b\{font-size:0!important/);
 assert.match(optical,/\.scene-object b:before/);
 assert.match(optical,/\.scene-object b:after/);
 assert.match(optical,/prefers-reduced-motion/);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const text=path=>readFile(new URL(`../${path}`,import.meta.url),'utf8');

test('culture studio exposes radio fashion and film as real interactive tabs',async()=>{
 const jsx=await text('src/CultureStudioV4.jsx');
 for(const label of ['Radio Lab','Fashion Lookbook','Film Shelf'])assert.match(jsx,new RegExp(label));
 assert.match(jsx,/role="tablist"/);
 assert.match(jsx,/aria-selected=\{tab==='radio'\}/);
 assert.match(jsx,/setTab\('fashion'\)/);
 assert.match(jsx,/setTab\('film'\)/);
});

test('radio lab synthesizes original cues locally and explicitly avoids archival audio claims',async()=>{
 const jsx=await text('src/CultureStudioV4.jsx');
 assert.match(jsx,/AudioContext\|\|window\.webkitAudioContext/);
 assert.match(jsx,/createOscillator/);
 assert.match(jsx,/createBuffer/);
 assert.match(jsx,/Bukan rekaman stasiun historis/);
 assert.match(jsx,/Tidak memakai potongan siaran, jingle merek, atau rekaman berhak cipta/);
 assert.equal(/fetch\(|new Audio\(/.test(jsx),false,'radio soundboard must not fetch untracked external audio');
});

test('fashion lookbook is explicitly original-inspired rather than presented as historical reconstruction',async()=>{
 const jsx=await text('src/CultureStudioV4.jsx');
 assert.match(jsx,/style lab original-inspired/);
 assert.match(jsx,/bukan klaim bahwa kombinasi ini mewakili satu tren nasional/);
 assert.match(jsx,/ACAK LOOK/);
});

test('film shelf derives titles only from active SSOT film entries',async()=>{
 const jsx=await text('src/CultureStudioV4.jsx');
 assert.match(jsx,/data\.entries\.filter\(entry=>entry\.type==='film'\)/);
 assert.match(jsx,/entry\.status/);
 assert.match(jsx,/onOpenEntry\(entry\)/);
 assert.match(jsx,/tidak membuat judul atau tanggal baru/);
});

test('culture studio styling stays behind lazy archive route',async()=>{
 const [styles,main,css]=await Promise.all([text('src/world/archive-styles.js'),text('src/main.jsx'),text('src/world/culture-studio-v4.css')]);
 assert.match(styles,/culture-studio-v4\.css/);
 assert.equal(main.includes('culture-studio-v4.css'),false,'culture studio CSS should not tax initial World load');
 assert.match(css,/\.culture-radio/);
 assert.match(css,/\.fashion-lab/);
 assert.match(css,/\.film-card-grid/);
});

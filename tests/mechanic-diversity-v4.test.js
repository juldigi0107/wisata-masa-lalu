import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const text=path=>readFile(new URL(`../${path}`,import.meta.url),'utf8');

test('race chase and drive no longer collapse into the generic timing mechanic',async()=>{
 const jsx=await text('src/world/GenericMechanics.jsx');
 assert.match(jsx,/function PaceMechanic/);
 assert.match(jsx,/\['race','chase','drive'\]\.includes\(trigger\.mechanic\)/);
 assert.match(jsx,/pace-course/);
 assert.match(jsx,/timeLeft/);
});

test('gesture fold and wipe have an ordered tactile mechanic instead of a timing reskin',async()=>{
 const jsx=await text('src/world/GenericMechanics.jsx');
 assert.match(jsx,/function GestureSequenceMechanic/);
 assert.match(jsx,/\['gesture','fold','wipe'\]\.includes\(trigger\.mechanic\)/);
 assert.match(jsx,/Lipat sisi kiri/);
 assert.match(jsx,/Bersihkan sisa kapur/);
});

test('trade collection studio album and print each have a dedicated interaction path',async()=>{
 const jsx=await text('src/world/GenericMechanics.jsx');
 for(const name of ['TradeMechanic','CollectMechanic','StudioMechanic','AlbumMechanic','PrintMechanic'])assert.match(jsx,new RegExp(`function ${name}`));
 for(const mechanic of ['trade','collection','studio','album','print'])assert.match(jsx,new RegExp(`trigger\\.mechanic==='${mechanic}'`));
});

test('billing stops its timer before awarding completion and shop purchasing is atomic',async()=>{
 const jsx=await text('src/world/GenericMechanics.jsx');
 assert.match(jsx,/function finish\(\)\{setRunning\(false\);complete\(seconds\)\}/);
 assert.match(jsx,/const \[shop,setShop\]=useState\(\{money:1500,bag:\[\]\}\)/);
 assert.match(jsx,/current\.money<price\?current/);
});

test('interactive progress tracks expose semantic progressbar state',async()=>{
 const jsx=await text('src/world/GenericMechanics.jsx');
 assert.ok((jsx.match(/role="progressbar"/g)||[]).length>=4);
 assert.match(jsx,/aria-valuenow=\{distance\}/);
 assert.match(jsx,/aria-valuenow=\{progress\}/);
});

test('v4 diversity styling is critical only because mechanics render inside the World surface',async()=>{
 const [main,css]=await Promise.all([text('src/main.jsx'),text('src/world/mechanics-diversity-v4.css')]);
 assert.match(main,/mechanics-diversity-v4\.css/);
 for(const selector of ['pace-mechanic','gesture-sequence-mechanic','trade-columns','collection-pack-grid','album-slots'])assert.match(css,new RegExp(selector));
 assert.match(css,/prefers-reduced-motion/);
});

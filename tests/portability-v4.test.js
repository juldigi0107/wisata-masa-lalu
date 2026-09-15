import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const text=path=>readFile(new URL(`../${path}`,import.meta.url),'utf8');

test('scene art source itself contains no hardcoded GitHub repository path',async()=>{
 const css=await text('src/world/scene-art.css');
 assert.equal(css.includes('/wisata-masa-lalu/'),false);
 for(const id of ['rumah','kampung','sekolah','kota','digital'])assert.match(css,new RegExp(`var\\(--wml-scene-${id}\\)`));
});

test('runtime asset variables are supplied from Vite BASE_URL',async()=>{
 const main=await text('src/main.jsx');
 assert.match(main,/import\.meta\.env\.BASE_URL/);
 assert.match(main,/rootStyle\.setProperty\(`--wml-scene-/);
 assert.match(main,/runtimeAsset\(`assets\/world\/scenes\/\$\{id\}-90\.svg`\)/);
});

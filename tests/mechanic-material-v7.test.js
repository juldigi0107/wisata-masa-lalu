import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const read=path=>readFile(new URL(`../${path}`,import.meta.url),'utf8');

test('interaction runtime gives key mechanic families distinct material treatments',async()=>{
 const [css,entry]=await Promise.all([read('src/world/mechanic-material-v7.css'),read('src/world/interaction-runtime-styles.js')]);
 for(const selector of ['phone-mechanic','billing-screen','schedule-mechanic','ledger-mechanic','shop-grid','inspect-mechanic','arcade-mechanic','pet-mechanic','ambient-mechanic','secret-mechanic'])assert.match(css,new RegExp(selector));
 for(const texture of ['--wml-texture-plastic','--wml-texture-paper','--wml-texture-wood','--wml-texture-photo','--wml-texture-crt'])assert.match(css,new RegExp(texture));
 assert.match(entry,/mechanic-material-v7\.css/);
});

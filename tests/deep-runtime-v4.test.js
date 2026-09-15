import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {achievements,worldVersion} from '../shared/world-model.js';
import {buildAchievementProgress} from '../shared/world-v4-experience.js';

const text=path=>readFile(new URL(`../${path}`,import.meta.url),'utf8');
const achievement=id=>achievements.find(item=>item.id===id);
const progress=(id,completed)=>buildAchievementProgress([achievement(id)],{completed,visitedScenes:[],visitedYears:[]})[0];

test('world v4 uses exact trigger achievement semantics instead of broad category approximations',()=>{
 assert.equal(worldVersion,'4.0.0');
 const wartel=progress('penguasa-wartel',['telepon-rumah','pager','wartel']);
 assert.equal(wartel.current,1,'unrelated communication memories must not count toward Penguasa Wartel');
 assert.equal(wartel.unlocked,false);
 const wartelDone=progress('penguasa-wartel',['wartel','billing-wartel']);
 assert.equal(wartelDone.current,2);
 assert.equal(wartelDone.unlocked,true);
 const arcade=progress('raja-dingdong',['mesin-arcade','token-arcade']);
 assert.equal(arcade.current,2);
 assert.equal(arcade.remaining,1);
 assert.equal(arcade.percent,67);
 const arcadeDone=progress('raja-dingdong',['mesin-arcade','token-arcade','high-score','virtual-pet']);
 assert.equal(arcadeDone.current,3,'unrelated mainan must not inflate exact arcade progress');
 assert.equal(arcadeDone.unlocked,true);
});

test('mechanic-filtered achievement only counts matching game mechanics',()=>{
 const partial=progress('pemburu-layangan',['bentengan','petak-umpet','kelereng','gasing','layangan-putus']);
 assert.equal(partial.current,3,'strategy/find mechanics should not count toward timing/chase/aim badge');
 assert.equal(partial.unlocked,false);
 const complete=progress('pemburu-layangan',['kelereng','adu-gambar','gasing','lompat-karet','layangan-putus']);
 assert.equal(complete.current,5);
 assert.equal(complete.unlocked,true);
});

test('legacy local score is reconciled from unique completed trigger points before World mounts',async()=>{
 const main=await text('src/main.jsx');
 assert.match(main,/stored\.score=completed\.reduce/);
 assert.match(main,/new Set\(Array\.isArray\(stored\.completed\)/);
 assert.match(main,/stored\.schema=4/);
});

test('archive route remains code-split and has explicit loading failure retry and world fallback',async()=>{
 const [portal,route]=await Promise.all([text('src/world/ArchivePortal.jsx'),text('src/ArchiveRoute.jsx')]);
 assert.match(portal,/import\('\.\.\/ArchiveRoute\.jsx'\)/);
 assert.match(portal,/import\('\.\/ContextualArchiveRoute\.jsx'\)/);
 assert.match(portal,/ArchiveFailure/);
 assert.match(portal,/COBA MUAT LAGI/);
 assert.match(portal,/KEMBALI KE WORLD/);
 assert.match(portal,/setRetryToken/);
 assert.match(route,/archive-styles\.js/,'archive editorial CSS should stay behind the lazy archive route');
});

test('critical bundle contains only recovery styling needed when archive chunk itself fails',async()=>{
 const [main,css]=await Promise.all([text('src/main.jsx'),text('src/world/archive-recovery-v4.css')]);
 assert.match(main,/archive-recovery-v4\.css/);
 assert.match(css,/\.archive-failure/);
 assert.match(css,/prefers-reduced-motion/);
 assert.match(css,/100dvh/);
});

test('dialog focus priority favors explicit autofocus targets before generic buttons',async()=>{
 const panel=await text('src/world/FeaturePanelsV2.jsx');
 assert.match(panel,/querySelector\('\[data-autofocus\],input\[autofocus\]/);
 assert.match(panel,/data-autofocus autoFocus/);
 assert.match(panel,/previous\.current\?\.focus/);
});

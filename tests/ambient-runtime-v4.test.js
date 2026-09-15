import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const text=path=>readFile(new URL(`../${path}`,import.meta.url),'utf8');

test('ambient runtime is mounted beside the World experience shell and remains renderless',async()=>{
 const [main,shell,ambient]=await Promise.all([text('src/main.jsx'),text('src/world/WorldExperienceShell.jsx'),text('src/world/AmbientRuntimeV4.jsx')]);
 assert.match(main,/import AmbientRuntimeV4/);
 assert.match(main,/<WorldExperienceShell\/><AmbientRuntimeV4\/>/);
 assert.match(shell,/<WorldAppV4\/>/);
 assert.match(ambient,/return null/);
});

test('ambience obeys browser autoplay policy and only arms after user interaction',async()=>{
 const ambient=await text('src/world/AmbientRuntimeV4.jsx');
 assert.match(ambient,/armedRef=useRef\(false\)/);
 assert.match(ambient,/pointerdown/);
 assert.match(ambient,/keydown/);
 assert.match(ambient,/if\(!armedRef\.current\)return null/);
});

test('ambience reads live local mute master and ambience levels instead of fixed volume',async()=>{
 const ambient=await text('src/world/AmbientRuntimeV4.jsx');
 assert.match(ambient,/value\.mute/);
 assert.match(ambient,/value\.master/);
 assert.match(ambient,/value\.ambience/);
 assert.match(ambient,/settings\.mute\|\|settings\.master<=0\|\|settings\.ambience<=0/);
 assert.match(ambient,/\.012\*settings\.master\*settings\.ambience/);
});

test('all five authored environments have distinct sparse synthetic cue contracts',async()=>{
 const ambient=await text('src/world/AmbientRuntimeV4.jsx');
 for(const id of ['rumah','kampung','sekolah','kota','digital'])assert.match(ambient,new RegExp(`${id}:\\{`));
 for(const kind of ['home','kampung','school','city','digital'])assert.match(ambient,new RegExp(`kind==='${kind}'`));
 assert.match(ambient,/min:6500/);
 assert.match(ambient,/max:15500/);
});

test('ambient runtime pauses for hidden pages and Archive mode and never fetches historical recordings',async()=>{
 const ambient=await text('src/world/AmbientRuntimeV4.jsx');
 assert.match(ambient,/document\.visibilityState!=='visible'/);
 assert.match(ambient,/document\.querySelector\('\.archive-mode'\)/);
 assert.equal(/fetch\(|new Audio\(/.test(ambient),false,'ambient layer must not fetch or play untracked recordings');
 assert.match(ambient,/createOscillator/);
 assert.match(ambient,/createBuffer/);
});

test('ambient gain remains deliberately low to avoid competing with interaction cues',async()=>{
 const ambient=await text('src/world/AmbientRuntimeV4.jsx');
 assert.match(ambient,/Math\.min\(\.018/);
});

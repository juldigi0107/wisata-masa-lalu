import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const read=path=>readFile(new URL(`../${path}`,import.meta.url),'utf8');

test('random memory cards can alter world visuals without mutating historical data',async()=>{
 const [runtime,css,main]=await Promise.all([read('src/world/EventVisualRuntimeV7.jsx'),read('src/world/event-raster-v7.css'),read('src/main.jsx')]);
 for(const token of ['runtime-hujan','runtime-blackout','runtime-magrib','runtime-tv-static']){assert.match(runtime,new RegExp(token));assert.match(css,new RegExp(token))}
 assert.match(css,/--wml-scene-kampung-hujan/);
 assert.match(main,/EventVisualRuntimeV7/);
});

test('offline shell caches all twenty raster day-phase scenes',async()=>{
 const sw=await read('public/sw.js');
 assert.match(sw,/wml-time-machine-v7-0/);
 assert.match(sw,/\['rumah','kampung','sekolah','kota','digital'\]/);
 assert.match(sw,/\['pagi','siang','sore','malam'\]/);
 assert.match(sw,/phaseScenes/);
});

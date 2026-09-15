import test from 'node:test';
import assert from 'node:assert/strict';
import {interpretMemoryQuery,memoryQueryMatchesTrigger} from '../shared/memory-search.js';
import {getTrigger} from '../shared/memory-triggers.js';
import {readFile} from 'node:fs/promises';

const text=path=>readFile(new URL(`../${path}`,import.meta.url),'utf8');
const cases=[
 ['jajanan plastik yang dulu digigit ujungnya','es-plastik'],
 ['kaset diputar pakai pensil','pensil-kaset'],
 ['internet bunyi aneh sebelum nyambung','dialup-modem'],
 ['telepon pakai koin','telepon-koin'],
 ['kembalian dikasih permen','kembalian-permen'],
 ['ngejar layangan putus','layangan-putus']
];

test('natural nostalgic phrases resolve to concrete memory triggers',()=>{
 for(const [query,id] of cases){const result=interpretMemoryQuery(query);assert.ok(result.triggerIds.includes(id),`${query} should resolve ${id}`);assert.ok(memoryQueryMatchesTrigger(getTrigger(id),query))}
});

test('memory search remains local and does not send private phrases to an external search service',async()=>{
 const [engine,panel]=await Promise.all([text('shared/memory-search.js'),text('src/world/FeaturePanelsV2.jsx')]);
 assert.equal(/fetch\(|https?:\/\//.test(engine),false);
 assert.match(panel,/interpretMemoryQuery/);
 assert.match(panel,/memoryQueryMatchesTrigger/);
 assert.match(panel,/Ingatan dikenali/);
});

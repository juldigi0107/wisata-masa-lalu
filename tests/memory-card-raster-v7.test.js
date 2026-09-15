import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

test('memory card studio renders and exports PNG rather than SVG',async()=>{
 const source=await readFile(new URL('../src/world/MemoryCardStudio.jsx',import.meta.url),'utf8');
 assert.match(source,/canvasRef/);
 assert.match(source,/toBlob\(resolve,'image\/png'/);
 assert.match(source,/\.png`/);
 assert.match(source,/Simpan PNG/);
 assert.match(source,/sceneId}-sore\.webp/);
 assert.equal(source.includes('image/svg+xml'),false);
 assert.equal(source.includes('.svg`'),false);
});

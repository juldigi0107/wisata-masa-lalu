import {readFile,writeFile} from 'node:fs/promises';

// The authoring generator uses 760px collage tiles. The fourth/right-most slot begins
// at x=1040 on a 1600px surface, so a 760px tile exceeds Sharp's composite bounds.
// Keep authoring source untouched and normalize the generated-run copy to a safe 560px
// tile. 560px exactly fits the right edge and leaves the lower slot inside 900px height.
const path='scripts/generate-world-raster.mjs';
const original=await readFile(path,'utf8');
const needle='photoTile(name,760,760)';
if(!original.includes(needle))throw new Error('World raster surface contract changed; review collage tile bounds before build.');
const patched=original.replace(needle,'photoTile(name,560,560)');
await writeFile(path,patched,'utf8');
try{await import('./generate-world-raster.mjs')}finally{await writeFile(path,original,'utf8')}

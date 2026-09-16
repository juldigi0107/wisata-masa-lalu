import {access,readFile} from 'node:fs/promises';
import {join} from 'node:path';

const root=new URL('../',import.meta.url);
const main=await readFile(new URL('../src/main.jsx',import.meta.url),'utf8');
const forbidden=['assets/world/raster/','assets/generated/'];
const violations=forbidden.filter(value=>main.includes(value));
if(violations.length){
 console.error(`Forbidden unresolved premium asset namespaces in src/main.jsx: ${violations.join(', ')}`);
 process.exit(1);
}

const required=[
 'assets/media/crt.jpg','assets/media/cassette.jpg','assets/media/camera.jpg',
 'assets/media/warung.jpg','assets/media/permainan-tradisional.jpg','assets/media/kelereng.jpg',
 'assets/media/bobo-logo.png','assets/media/dr-grip.jpg','assets/media/pilot-pens.jpg',
 'assets/media/pager.jpg','assets/media/rollerskates.png','assets/media/discman.jpg',
 'assets/media/gameboy-color.jpg','assets/media/floppy.jpg','assets/media/ramadan.jpg','assets/media/jakarta-1991.jpg'
];
const missing=[];
for(const path of required){
 try{await access(join(new URL('../public/',import.meta.url).pathname,path))}catch{missing.push(path)}
}
if(missing.length){
 console.error('Runtime raster assets missing after visual fetch:');
 for(const path of missing)console.error(`- public/${path}`);
 process.exit(1);
}
console.log(`Runtime raster asset contract passed: ${required.length}/${required.length} required files present; no unresolved premium namespaces.`);

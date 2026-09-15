import {stat} from 'node:fs/promises';
import {join} from 'node:path';

const required=[];
for(const scene of ['rumah','kampung','sekolah','kota','digital']){
 required.push(`assets/world/raster/${scene}-90.webp`);
 for(const phase of ['pagi','siang','sore','malam'])required.push(`assets/world/raster/${scene}-${phase}.webp`);
}
for(const name of ['rumah-ramadan','rumah-lebaran','rumah-minggu','rumah-malam-minggu','kampung-hujan','kampung-ramadan','kampung-lebaran','kampung-agustusan','kampung-minggu','sekolah-agustusan','kota-ramadan','kota-lebaran','kota-malam-minggu'])required.push(`assets/world/raster/${name}.webp`);
for(const id of ['archive','tv','games','objects','timeline','warung','ramadan','music','quiz','collection','school'])required.push(`assets/generated/${id}.webp`);
for(const id of ['paper','wood','plastic','photo','crt'])required.push(`assets/generated/texture-${id}.webp`);

const missing=[];let total=0;let largest={path:'',size:0};
for(const path of required){
 try{const info=await stat(join('dist',path));if(!info.isFile())throw Error('not-file');total+=info.size;if(info.size>largest.size)largest={path,size:info.size}}
 catch{missing.push(path)}
}
if(missing.length)throw new Error(`Premium raster pack incomplete: ${missing.join(', ')}`);
if(largest.size>420*1024)throw new Error(`Premium raster asset too large: ${largest.path} ${(largest.size/1024).toFixed(1)} kB`);
if(total>11*1024*1024)throw new Error(`Premium raster pack exceeds 11 MB: ${(total/1024/1024).toFixed(2)} MB`);
console.log(`Premium raster pack: ${required.length}/${required.length} assets · ${(total/1024/1024).toFixed(2)} MB · largest ${largest.path} ${(largest.size/1024).toFixed(1)} kB`);

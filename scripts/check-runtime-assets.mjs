import {access,readdir,readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';

const publicRoot=fileURLToPath(new URL('../public/',import.meta.url));
const distRoot=fileURLToPath(new URL('../dist/',import.meta.url));
const main=await readFile(new URL('../src/main.jsx',import.meta.url),'utf8');

/* Runtime must point to generated raster assets, never back to authoring scene SVG. */
for(const token of [
 'assets/world/raster/${id}-90.webp',
 'assets/world/raster/${id}-${phase}.webp',
 'assets/generated/${id}.webp',
 'assets/generated/texture-${id}.webp',
 'assets/generated/${id}-premium.webp'
]){
 if(!main.includes(token)){
  console.error(`Missing generated raster registry contract: ${token}`);
  process.exit(1);
 }
}
if(main.includes('assets/world/scenes/${id}-90.svg')){
 console.error('Runtime scene registry points back to authoring SVG.');
 process.exit(1);
}

const sceneIds=['rumah','kampung','sekolah','kota','digital'];
const phases=['pagi','siang','sore','malam'];
const contextual={
 rumah:['ramadan','lebaran','minggu','malam-minggu'],
 kampung:['hujan','ramadan','lebaran','agustusan','minggu'],
 sekolah:['agustusan'],
 kota:['ramadan','lebaran','malam-minggu'],
 digital:[]
};
const surfaces=['archive','tv','games','objects','timeline','warung','ramadan','music','quiz','collection','school'];
const textures=['paper','wood','plastic','photo','crt'];
const pages=['intro','onboarding','time-machine','search','collection','campaign','settings','social','contextual','moderation','recovery','season','culture','memory-card','archive-loading','memory-wall'];

const required=[
 ...sceneIds.map(id=>`assets/world/raster/${id}-90.webp`),
 ...sceneIds.flatMap(id=>phases.map(phase=>`assets/world/raster/${id}-${phase}.webp`)),
 ...Object.entries(contextual).flatMap(([id,states])=>states.map(state=>`assets/world/raster/${id}-${state}.webp`)),
 'assets/world/raster/portal-grid.webp','assets/world/raster/brand-orbit.webp',
 ...surfaces.map(id=>`assets/generated/${id}.webp`),
 ...textures.map(id=>`assets/generated/texture-${id}.webp`),
 ...pages.map(id=>`assets/generated/${id}-premium.webp`)
];
const missing=[];
for(const relative of required){
 try{await access(join(publicRoot,relative))}catch{missing.push(relative)}
}
if(missing.length){
 console.error('Generated runtime raster contract incomplete after build:');
 for(const relative of missing)console.error(`- public/${relative}`);
 process.exit(1);
}

const distFiles=await readdir(distRoot,{recursive:true});
const leakedSvg=distFiles.filter(path=>String(path).toLowerCase().endsWith('.svg'));
if(leakedSvg.length){
 console.error('Production artifact still contains authoring SVG files:');
 for(const path of leakedSvg)console.error(`- dist/${path}`);
 process.exit(1);
}

console.log(`Runtime raster contract passed: ${required.length}/${required.length} generated WebP assets present; production artifact contains 0 SVG files.`);

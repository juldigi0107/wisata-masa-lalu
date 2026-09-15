import sharp from 'sharp';
import {mkdir,access} from 'node:fs/promises';
import {join} from 'node:path';

const sourceRoot='public/assets/world';
const sceneRoot=join(sourceRoot,'scenes');
const outRoot=join(sourceRoot,'raster');
const scenes=['rumah','kampung','sekolah','kota','digital'];
await mkdir(outRoot,{recursive:true});

const grain=Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
 <filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".72" numOctaves="3" seed="27"/><feColorMatrix type="saturate" values="0"/></filter>
 <rect width="1920" height="1080" filter="url(#n)" opacity=".065"/>
 <rect width="1920" height="1080" fill="none" stroke="#f7e7c5" stroke-opacity=".06"/>
</svg>`);
const vignette=Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
 <defs><radialGradient id="v"><stop offset="58%" stop-color="#000" stop-opacity="0"/><stop offset="100%" stop-color="#000" stop-opacity=".22"/></radialGradient></defs>
 <rect width="1920" height="1080" fill="url(#v)"/>
</svg>`);

async function exists(path){try{await access(path);return true}catch{return false}}

for(const id of scenes){
 const input=join(sceneRoot,`${id}-90.svg`);
 const output=join(outRoot,`${id}-90.webp`);
 if(!(await exists(input)))throw new Error(`Missing world scene source: ${input}`);
 await sharp(input,{density:180})
  .resize(1920,1080,{fit:'cover',position:'centre'})
  .modulate({brightness:.985,saturation:.93})
  .composite([{input:grain,blend:'soft-light'},{input:vignette,blend:'multiply'}])
  .sharpen({sigma:.45,m1:.7,m2:.35})
  .webp({quality:86,alphaQuality:90,effort:6,smartSubsample:true})
  .toFile(output);
 console.log(`world-raster ${id}: ${output}`);
}

const support=[
 ['brand-orbit.svg','brand-orbit.webp',512,512],
 ['portal-grid.svg','portal-grid.webp',1920,1080]
];
for(const [sourceName,outName,width,height] of support){
 const input=join(sourceRoot,sourceName);const output=join(outRoot,outName);
 if(!(await exists(input)))continue;
 await sharp(input,{density:180}).resize(width,height,{fit:'contain'}).webp({quality:88,alphaQuality:92,effort:6}).toFile(output);
 console.log(`world-raster support: ${output}`);
}

const editorial=[
 ['brand-seal.svg','brand-seal.webp',512,512],
 ['cassette-player.svg','cassette-player.webp',1200,760],
 ['handheld-game.svg','handheld-game.webp',1100,800],
 ['ramadan-lantern.svg','ramadan-lantern.webp',900,1080]
];
for(const [sourceName,outName,width,height] of editorial){
 const input=join('public/assets',sourceName);const output=join('public/assets',outName);
 if(!(await exists(input)))continue;
 await sharp(input,{density:200})
  .resize(width,height,{fit:'contain',background:{r:0,g:0,b:0,alpha:0}})
  .webp({quality:90,alphaQuality:95,effort:6})
  .toFile(output);
 console.log(`editorial-raster: ${output}`);
}

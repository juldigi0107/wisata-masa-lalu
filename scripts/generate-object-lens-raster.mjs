import sharp from 'sharp';
import {mkdir,stat} from 'node:fs/promises';
import {join} from 'node:path';
import {scenes} from '../shared/world-model.js';

const W=1920,H=1080,CW=620,CH=460;
const inputRoot=join('public','assets','world','raster');
const outRoot=join('public','assets','generated','objects');
await mkdir(outRoot,{recursive:true});
const clamp=(value,min,max)=>Math.min(max,Math.max(min,value));
const overlay=Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="760" height="560"><defs><linearGradient id="g" x2="0" y2="1"><stop stop-color="#06100d" stop-opacity=".04"/><stop offset=".6" stop-color="#06100d" stop-opacity=".12"/><stop offset="1" stop-color="#030706" stop-opacity=".72"/></linearGradient><radialGradient id="r"><stop offset="45%" stop-color="#000" stop-opacity="0"/><stop offset="100%" stop-color="#000" stop-opacity=".32"/></radialGradient></defs><rect width="100%" height="100%" fill="url(#g)"/><rect width="100%" height="100%" fill="url(#r)"/><rect x="10" y="10" width="740" height="540" rx="28" fill="none" stroke="#d8bd7b" stroke-opacity=".18" stroke-width="2"/></svg>`);
let count=0,total=0;
for(const scene of Object.values(scenes)){
 const input=join(inputRoot,`${scene.id}-siang.webp`);
 for(const object of scene.objects){
  const cx=Math.round(object.x/100*W),cy=Math.round(object.y/100*H),left=clamp(cx-Math.floor(CW/2),0,W-CW),top=clamp(cy-Math.floor(CH/2),0,H-CH);
  const output=join(outRoot,`${scene.id}-${object.id}.webp`);
  await sharp(input).extract({left,top,width:CW,height:CH}).resize(760,560,{fit:'cover'}).modulate({brightness:.96,saturation:.9}).sharpen({sigma:.5,m1:.75,m2:.35}).composite([{input:overlay}]).webp({quality:80,effort:6,smartSubsample:true}).toFile(output);
  const info=await stat(output);count+=1;total+=info.size;
 }
}
console.log(`Object Lens raster pack: ${count} unique object crops · ${(total/1024/1024).toFixed(2)} MB`);

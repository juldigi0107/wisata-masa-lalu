import sharp from 'sharp';
import {access,mkdir,stat} from 'node:fs/promises';
import {join} from 'node:path';
import {scenes} from '../shared/world-model.js';

const W=1920,H=1080,CW=620,CH=460;
const inputRoot=join('public','assets','world','raster');
const mediaRoot=join('public','assets','media');
const outRoot=join('public','assets','generated','objects');
await mkdir(outRoot,{recursive:true});
const clamp=(value,min,max)=>Math.min(max,Math.max(min,value));
const exists=async path=>{try{await access(path);return true}catch{return false}};
const photoOverrides={
 'rumah:tv':'crt.jpg','rumah:tape':'cassette.jpg','rumah:telepon':'phone.jpg','rumah:kamera':'camera.jpg','rumah:walkman':'walkman.jpg','rumah:mainan':'tamagotchi.jpg',
 'kampung:warung':'warung.jpg','kampung:lapangan':'kelereng.jpg',
 'kota:wartel':'phone.jpg','kota:arcade':'gameboy-color.jpg','kota:rental':'playstation.jpg','kota:toko-kaset':'cassette.jpg','kota:pager':'pager.jpg','kota:studio-foto':'camera.jpg','kota:photo-lab':'camera.jpg',
 'digital:floppy':'floppy.jpg'
};
const overlay=Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="760" height="560"><defs><linearGradient id="g" x2="0" y2="1"><stop stop-color="#06100d" stop-opacity=".02"/><stop offset=".56" stop-color="#06100d" stop-opacity=".08"/><stop offset="1" stop-color="#030706" stop-opacity=".66"/></linearGradient><radialGradient id="r"><stop offset="48%" stop-color="#000" stop-opacity="0"/><stop offset="100%" stop-color="#000" stop-opacity=".3"/></radialGradient></defs><rect width="100%" height="100%" fill="url(#g)"/><rect width="100%" height="100%" fill="url(#r)"/><rect x="10" y="10" width="740" height="540" rx="28" fill="none" stroke="#d8bd7b" stroke-opacity=".18" stroke-width="2"/></svg>`);
let count=0,total=0,photoBacked=0,cropped=0;
for(const scene of Object.values(scenes)){
 const input=join(inputRoot,`${scene.id}-siang.webp`);
 for(const object of scene.objects){
  const key=`${scene.id}:${object.id}`,photoName=photoOverrides[key],photoPath=photoName?join(mediaRoot,photoName):null;
  const output=join(outRoot,`${scene.id}-${object.id}.webp`);
  let pipeline;
  if(photoPath&&await exists(photoPath)){
   pipeline=sharp(photoPath).resize(760,560,{fit:'cover',position:'centre'}).modulate({brightness:.88,saturation:.8}).sharpen({sigma:.52,m1:.78,m2:.35});
   photoBacked+=1;
  }else{
   const cx=Math.round(object.x/100*W),cy=Math.round(object.y/100*H),left=clamp(cx-Math.floor(CW/2),0,W-CW),top=clamp(cy-Math.floor(CH/2),0,H-CH);
   pipeline=sharp(input).extract({left,top,width:CW,height:CH}).resize(760,560,{fit:'cover'}).modulate({brightness:.96,saturation:.9}).sharpen({sigma:.5,m1:.75,m2:.35});
   cropped+=1;
  }
  await pipeline.composite([{input:overlay}]).webp({quality:80,effort:6,smartSubsample:true}).toFile(output);
  const info=await stat(output);count+=1;total+=info.size;
 }
}
console.log(`Object Lens raster pack: ${count} unique objects · ${photoBacked} licensed-photo studies · ${cropped} contextual scene crops · ${(total/1024/1024).toFixed(2)} MB`);

import sharp from 'sharp';
import {access} from 'node:fs/promises';
import {join} from 'node:path';

const root=join('public','assets','world','raster');
const scenes=['rumah','kampung','kota'];
async function exists(path){try{await access(path);return true}catch{return false}}
const overlay=Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080"><defs><linearGradient id="g"><stop stop-color="#f2d59a" stop-opacity=".11"/><stop offset=".42" stop-color="#eff5df" stop-opacity=".035"/><stop offset="1" stop-color="#295b49" stop-opacity=".13"/></linearGradient><radialGradient id="a"><stop stop-color="#f4d482" stop-opacity=".2"/><stop offset="1" stop-color="#f4d482" stop-opacity="0"/></radialGradient></defs><rect width="100%" height="100%" fill="url(#g)"/><ellipse cx="1450" cy="300" rx="520" ry="420" fill="url(#a)"/><ellipse cx="360" cy="760" rx="400" ry="300" fill="url(#a)"/></svg>`);
for(const scene of scenes){
 const input=join(root,`${scene}-siang.webp`),output=join(root,`${scene}-lebaran.webp`);
 if(!(await exists(input)))throw new Error(`Missing phase scene for Lebaran render: ${input}`);
 await sharp(input).composite([{input:overlay,blend:'soft-light'}]).modulate({brightness:1.025,saturation:.94}).webp({quality:83,effort:6,smartSubsample:true}).toFile(output);
 console.log(`event-raster lebaran: ${output}`);
}

import sharp from 'sharp';
import {access,mkdir} from 'node:fs/promises';
import {join} from 'node:path';

const mediaRoot='public/assets/media';const outRoot='public/assets/generated';await mkdir(outRoot,{recursive:true});
async function exists(path){try{await access(path);return true}catch{return false}}
async function make(id,names){
 const paths=[];for(const name of names){const path=join(mediaRoot,name);if(await exists(path))paths.push(path)}
 if(!paths.length)return false;
 const W=1600,H=900;const first=await sharp(paths[0]).resize(W,H,{fit:'cover'}).blur(3).modulate({brightness:.6,saturation:.72}).png().toBuffer();
 const comps=[];const slots=[[60,110,660,470],[830,90,650,410],[960,560,500,260],[160,620,600,220]];
 for(let i=1;i<paths.length&&i<=slots.length;i++){const [left,top,w,h]=slots[i-1];const img=await sharp(paths[i]).resize(w,h,{fit:'cover'}).modulate({brightness:.82,saturation:.78}).png().toBuffer();comps.push({input:img,left,top,opacity:i===1?.4:.26,blend:'screen'})}
 const wash=Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><defs><linearGradient id="g"><stop stop-color="#06100d" stop-opacity=".22"/><stop offset=".52" stop-color="#08100e" stop-opacity=".46"/><stop offset="1" stop-color="#020403" stop-opacity=".9"/></linearGradient><radialGradient id="r"><stop stop-color="#e3bd72" stop-opacity=".09"/><stop offset="1" stop-color="#e3bd72" stop-opacity="0"/></radialGradient><filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".83" numOctaves="3" seed="67"/></filter></defs><rect width="100%" height="100%" fill="url(#g)"/><circle cx="1320" cy="180" r="500" fill="url(#r)"/><rect width="100%" height="100%" filter="url(#n)" opacity=".045"/></svg>`);
 await sharp(first).composite([...comps,{input:wash}]).webp({quality:84,effort:6,smartSubsample:true}).toFile(join(outRoot,`${id}-premium.webp`));return true;
}
const specs={
 season:['ramadan.jpg','warung.jpg','kelereng.jpg','camera.jpg'],
 culture:['cassette.jpg','walkman.jpg','rollerskates.png','camera.jpg'],
 'memory-card':['camera.jpg','cassette.jpg','bobo-logo.png','warung.jpg'],
 'archive-loading':['jakarta-1991.jpg','floppy.jpg','pager.jpg','camera.jpg'],
 'memory-wall':['camera.jpg','warung.jpg','bobo-logo.png','cassette.jpg']
};
let count=0;for(const [id,names] of Object.entries(specs))if(await make(id,names))count+=1;
console.log(`Premium secondary pages: ${count}/${Object.keys(specs).length} raster backdrops generated.`);

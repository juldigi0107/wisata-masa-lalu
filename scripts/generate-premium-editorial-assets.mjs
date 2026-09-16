import sharp from 'sharp';
import {access} from 'node:fs/promises';
import {join} from 'node:path';

const mediaRoot='public/assets/media';
const assetsRoot='public/assets';
const worldRaster='public/assets/world/raster';
async function exists(path){try{await access(path);return true}catch{return false}}
async function media(name){const path=join(mediaRoot,name);return await exists(path)?path:null}

async function contactSheet(output,names,{width=1920,height=1080,quality=82}={}){
 const paths=(await Promise.all(names.map(media))).filter(Boolean);if(!paths.length)return false;
 const bg=await sharp(paths[0]).resize(width,height,{fit:'cover'}).blur(12).modulate({brightness:.42,saturation:.6}).png().toBuffer();
 const slots=[
  {left:90,top:100,w:760,h:500,rot:-4,opacity:.62},
  {left:980,top:70,w:700,h:440,rot:3,opacity:.52},
  {left:280,top:610,w:620,h:330,rot:2,opacity:.46},
  {left:1090,top:560,w:620,h:360,rot:-3,opacity:.42}
 ];
 const comps=[];
 for(let i=0;i<Math.min(paths.length,slots.length);i++){
  const s=slots[i];
  const tile=await sharp(paths[i]).resize(s.w,s.h,{fit:'cover'}).modulate({brightness:.86,saturation:.78}).rotate(s.rot,{background:{r:4,g:8,b:7,alpha:1}}).png().toBuffer();
  comps.push({input:tile,left:s.left,top:s.top,opacity:s.opacity,blend:'screen'});
 }
 const finish=Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><defs><linearGradient id="g"><stop stop-color="#06100d" stop-opacity=".2"/><stop offset=".55" stop-color="#08110e" stop-opacity=".4"/><stop offset="1" stop-color="#020403" stop-opacity=".88"/></linearGradient><filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".86" numOctaves="3" seed="55"/></filter></defs><rect width="100%" height="100%" fill="url(#g)"/><rect width="100%" height="100%" filter="url(#n)" opacity=".05"/></svg>`);
 await sharp(bg).composite([...comps,{input:finish}]).webp({quality,effort:6,smartSubsample:true}).toFile(output);
 return true;
}

await contactSheet(join(worldRaster,'portal-grid.webp'),['jakarta-1991.jpg','warung.jpg','kelereng.jpg','floppy.jpg'],{width:1920,height:1080,quality:78});
await contactSheet(join(worldRaster,'brand-orbit.webp'),['camera.jpg','cassette.jpg','phone.jpg','bobo-logo.png'],{width:700,height:700,quality:82});
await contactSheet(join(assetsRoot,'cassette-player.webp'),['cassette.jpg','walkman.jpg','discman.jpg','camera.jpg'],{width:1200,height:760,quality:86});
await contactSheet(join(assetsRoot,'handheld-game.webp'),['gameboy-color.jpg','tamagotchi.jpg','yoyo.jpg','pager.jpg'],{width:1100,height:800,quality:86});
await contactSheet(join(assetsRoot,'ramadan-lantern.webp'),['ramadan.jpg','camera.jpg','warung.jpg'],{width:900,height:1080,quality:86});
console.log('Premium editorial raster replacements generated for portal, orbit, cassette, handheld and Ramadan visual anchors.');

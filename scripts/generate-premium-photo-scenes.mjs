import sharp from 'sharp';
import {access,mkdir,writeFile} from 'node:fs/promises';
import {join} from 'node:path';

const W=1920,H=1080;
const mediaRoot='public/assets/media';
const sceneRoot='public/assets/world/raster';
const outRoot='public/assets/generated';
await mkdir(outRoot,{recursive:true});

async function exists(path){try{await access(path);return true}catch{return false}}
async function media(name){const path=join(mediaRoot,name);return await exists(path)?path:null}
const svg=body=>Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${body}</svg>`);
const finishOverlay=svg(`<defs><linearGradient id="g" x2="0" y2="1"><stop stop-color="#020604" stop-opacity=".05"/><stop offset=".55" stop-color="#09100d" stop-opacity=".12"/><stop offset="1" stop-color="#010302" stop-opacity=".62"/></linearGradient><radialGradient id="r"><stop offset="0" stop-color="#e1bc71" stop-opacity=".15"/><stop offset="1" stop-color="#e1bc71" stop-opacity="0"/></radialGradient><filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".78" numOctaves="3" seed="91"/></filter></defs><rect width="100%" height="100%" fill="url(#g)"/><circle cx="1500" cy="210" r="600" fill="url(#r)"/><rect width="100%" height="100%" filter="url(#n)" opacity=".045"/>`);
const phaseTint={
 pagi:svg(`<defs><linearGradient id="g"><stop stop-color="#ffdba3" stop-opacity=".18"/><stop offset="1" stop-color="#d6f0ef" stop-opacity=".02"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/>`),
 siang:svg(`<rect width="100%" height="100%" fill="#f5e9d0" opacity=".035"/>`),
 sore:svg(`<defs><linearGradient id="g"><stop stop-color="#d9814b" stop-opacity=".22"/><stop offset="1" stop-color="#1a3340" stop-opacity=".08"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/>`),
 malam:svg(`<defs><linearGradient id="g"><stop stop-color="#07131e" stop-opacity=".44"/><stop offset="1" stop-color="#020405" stop-opacity=".56"/></linearGradient><radialGradient id="l"><stop stop-color="#f4c774" stop-opacity=".2"/><stop offset="1" stop-color="#f4c774" stop-opacity="0"/></radialGradient></defs><rect width="100%" height="100%" fill="url(#g)"/><ellipse cx="480" cy="520" rx="420" ry="300" fill="url(#l)"/>`)
};
const contextTint={
 ramadan:svg(`<rect width="100%" height="100%" fill="#0f332b" opacity=".18"/><circle cx="1610" cy="200" r="310" fill="#e8c878" opacity=".08"/>`),
 lebaran:svg(`<rect width="100%" height="100%" fill="#c3aa6a" opacity=".08"/><circle cx="320" cy="180" r="500" fill="#fff3cf" opacity=".06"/>`),
 agustusan:svg(`<rect width="100%" height="100%" fill="#9f2f34" opacity=".07"/><rect y="0" width="100%" height="70" fill="#f4efe5" opacity=".06"/>`),
 minggu:svg(`<circle cx="340" cy="140" r="650" fill="#ffe6a8" opacity=".1"/>`),
 'malam-minggu':svg(`<ellipse cx="420" cy="560" rx="600" ry="360" fill="#b14d87" opacity=".08"/><ellipse cx="1550" cy="380" rx="540" ry="330" fill="#53bbb9" opacity=".07"/>`),
 hujan:svg(`<rect width="100%" height="100%" fill="#385a67" opacity=".2"/><path d="M0 0l-160 1080M180 0L20 1080M360 0L200 1080M540 0L380 1080M720 0L560 1080M900 0L740 1080M1080 0L920 1080M1260 0L1100 1080M1440 0L1280 1080M1620 0L1460 1080M1800 0L1640 1080M1980 0L1820 1080" stroke="#d7ebee" stroke-opacity=".08" stroke-width="3"/>`)
};

const sceneSpecs={
 rumah:['crt.jpg','cassette.jpg','phone.jpg','camera.jpg','walkman.jpg'],
 kampung:['warung.jpg','kelereng.jpg','permainan-tradisional.jpg','yoyo.jpg'],
 sekolah:['dr-grip.jpg','pilot-pens.jpg','bobo-logo.png','kelereng.jpg'],
 kota:['jakarta-1991.jpg','pager.jpg','rollerskates.png','discman.jpg'],
 digital:['floppy.jpg','gameboy-color.jpg','pager.jpg','discman.jpg','tamagotchi.jpg']
};
const contextual={rumah:['ramadan','lebaran','minggu','malam-minggu'],kampung:['hujan','ramadan','lebaran','agustusan','minggu'],sekolah:['agustusan'],kota:['ramadan','lebaran','malam-minggu'],digital:[]};

async function roundedTile(path,width,height,radius=46){
 const image=await sharp(path).resize(width,height,{fit:'cover',position:'centre'}).modulate({brightness:.86,saturation:.82}).sharpen({sigma:.35}).png().toBuffer();
 const mask=Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect width="100%" height="100%" rx="${radius}" fill="#fff"/></svg>`);
 return sharp(image).composite([{input:mask,blend:'dest-in'}]).png().toBuffer();
}

async function buildScene(id,names){
 const existing=join(sceneRoot,`${id}-90.webp`);if(!(await exists(existing)))return null;
 const paths=(await Promise.all(names.map(media))).filter(Boolean);
 if(paths.length<2)return null;
 const background=await sharp(paths[0]).resize(W,H,{fit:'cover',position:'centre'}).blur(5).modulate({brightness:.62,saturation:.66}).png().toBuffer();
 const comps=[];
 const slots=[
  {left:70,top:130,w:980,h:760,opacity:.7},
  {left:1010,top:120,w:770,h:520,opacity:.55},
  {left:1120,top:650,w:620,h:330,opacity:.46},
  {left:120,top:760,w:720,h:240,opacity:.34}
 ];
 for(let i=1;i<paths.length&&i<=slots.length;i++){
  const s=slots[i-1],tile=await roundedTile(paths[i],s.w,s.h,42);
  comps.push({input:tile,left:s.left,top:s.top,opacity:s.opacity,blend:'screen'});
 }
 const spatial=await sharp(existing).resize(W,H,{fit:'cover'}).modulate({brightness:1.04,saturation:.55}).png().toBuffer();
 const base=await sharp(background).composite([...comps,{input:spatial,opacity:.26,blend:'soft-light'},{input:finishOverlay,blend:'over'}]).webp({quality:86,effort:6,smartSubsample:true}).toBuffer();
 await sharp(base).toFile(existing);
 for(const [phase,tint] of Object.entries(phaseTint))await sharp(base).composite([{input:tint,blend:'soft-light'}]).webp({quality:83,effort:6,smartSubsample:true}).toFile(join(sceneRoot,`${id}-${phase}.webp`));
 for(const state of contextual[id]||[]){const tint=contextTint[state];if(tint)await sharp(base).composite([{input:tint,blend:'soft-light'}]).webp({quality:83,effort:6,smartSubsample:true}).toFile(join(sceneRoot,`${id}-${state}.webp`));}
 return {id,photos:paths.map(path=>path.split('/').pop())};
}

const pageSpecs={
 'intro-premium':['jakarta-1991.jpg','crt.jpg','cassette.jpg','phone.jpg'],
 'onboarding-premium':['warung.jpg','kelereng.jpg','camera.jpg','cassette.jpg'],
 'time-machine-premium':['floppy.jpg','pager.jpg','gameboy-color.jpg','discman.jpg'],
 'search-premium':['bobo-logo.png','pilot-pens.jpg','pager.jpg','cassette.jpg'],
 'collection-premium':['camera.jpg','gameboy-color.jpg','bobo-logo.png','cassette.jpg'],
 'campaign-premium':['kelereng.jpg','warung.jpg','crt.jpg','phone.jpg'],
 'settings-premium':['walkman.jpg','floppy.jpg','camera.jpg','pager.jpg'],
 'social-premium':['camera.jpg','bobo-logo.png','warung.jpg','cassette.jpg'],
 'contextual-premium':['pager.jpg','floppy.jpg','walkman.jpg','camera.jpg'],
 'moderation-premium':['jakarta-1991.jpg','camera.jpg','bobo-logo.png','pager.jpg'],
 'recovery-premium':['crt.jpg','floppy.jpg','cassette.jpg','camera.jpg']
};

async function makePage(id,names){
 const paths=(await Promise.all(names.map(media))).filter(Boolean);if(!paths.length)return false;
 const first=await sharp(paths[0]).resize(1600,900,{fit:'cover',position:'centre'}).blur(2).modulate({brightness:.63,saturation:.74}).png().toBuffer();
 const comps=[];const slots=[[820,70,650,440],[990,500,480,300],[70,550,650,280]];
 for(let i=1;i<paths.length&&i<=slots.length;i++){const [left,top,w,h]=slots[i-1];const tile=await roundedTile(paths[i],w,h,38);comps.push({input:tile,left,top,opacity:i===1?.46:.32,blend:'screen'});}
 const overlay=Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900"><defs><linearGradient id="g"><stop stop-color="#05110e" stop-opacity=".15"/><stop offset=".52" stop-color="#08100e" stop-opacity=".4"/><stop offset="1" stop-color="#020403" stop-opacity=".86"/></linearGradient><filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".84" numOctaves="3" seed="43"/></filter></defs><rect width="100%" height="100%" fill="url(#g)"/><rect width="100%" height="100%" filter="url(#n)" opacity=".045"/></svg>`);
 await sharp(first).composite([...comps,{input:overlay}]).webp({quality:84,effort:6,smartSubsample:true}).toFile(join(outRoot,`${id}.webp`));
 return true;
}

const sceneManifest=[];
for(const [id,names] of Object.entries(sceneSpecs)){const result=await buildScene(id,names);if(result)sceneManifest.push(result);}
const pageManifest=[];
for(const [id,names] of Object.entries(pageSpecs))if(await makePage(id,names))pageManifest.push(id);
await writeFile(join(outRoot,'premium-photo-manifest.json'),JSON.stringify({pipeline:'photo-assisted-spatial-raster-v1',generatedAt:new Date().toISOString(),scenes:sceneManifest,pages:pageManifest},null,2));
console.log(`Premium photo layer: ${sceneManifest.length}/5 world scenes photo-assisted · ${pageManifest.length}/${Object.keys(pageSpecs).length} page backdrops generated.`);

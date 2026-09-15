import sharp from 'sharp';
import {mkdir,access} from 'node:fs/promises';
import {join} from 'node:path';

const W=1920,H=1080;
const sourceRoot='public/assets/world';
const sceneRoot=join(sourceRoot,'scenes');
const outRoot=join(sourceRoot,'raster');
const premiumRoot=join('public/assets','generated');
const iconRoot=join('public/assets','icons');
const mediaRoot=join('public/assets','media');
const scenes=['rumah','kampung','sekolah','kota','digital'];
await Promise.all([mkdir(outRoot,{recursive:true}),mkdir(premiumRoot,{recursive:true}),mkdir(iconRoot,{recursive:true})]);

async function exists(path){try{await access(path);return true}catch{return false}}
const svg=body=>Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${body}</svg>`);
const grain=svg(`<filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".72" numOctaves="3" seed="27"/><feColorMatrix type="saturate" values="0"/></filter><rect width="100%" height="100%" filter="url(#n)" opacity=".06"/>`);
const vignette=svg(`<defs><radialGradient id="v"><stop offset="56%" stop-color="#000" stop-opacity="0"/><stop offset="100%" stop-color="#000" stop-opacity=".3"/></radialGradient></defs><rect width="100%" height="100%" fill="url(#v)"/>`);

const phaseOverlays={
 pagi:svg(`<defs><linearGradient id="g"><stop stop-color="#f7d8a0" stop-opacity=".18"/><stop offset=".45" stop-color="#fff2d7" stop-opacity=".04"/><stop offset="1" stop-color="#8bc7ca" stop-opacity=".05"/></linearGradient><radialGradient id="s"><stop stop-color="#fff4ca" stop-opacity=".22"/><stop offset="1" stop-color="#fff4ca" stop-opacity="0"/></radialGradient></defs><rect width="100%" height="100%" fill="url(#g)"/><circle cx="280" cy="120" r="430" fill="url(#s)"/>`),
 siang:svg(`<defs><linearGradient id="g" x2="0" y2="1"><stop stop-color="#dceff0" stop-opacity=".08"/><stop offset=".7" stop-color="#fff8e7" stop-opacity=".025"/><stop offset="1" stop-color="#c7a875" stop-opacity=".03"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/>`),
 sore:svg(`<defs><linearGradient id="g"><stop stop-color="#f0a45d" stop-opacity=".19"/><stop offset=".5" stop-color="#c56b58" stop-opacity=".055"/><stop offset="1" stop-color="#374b63" stop-opacity=".08"/></linearGradient><radialGradient id="s"><stop stop-color="#ffd39a" stop-opacity=".18"/><stop offset="1" stop-color="#ffd39a" stop-opacity="0"/></radialGradient></defs><rect width="100%" height="100%" fill="url(#g)"/><circle cx="1540" cy="330" r="520" fill="url(#s)"/>`),
 malam:svg(`<defs><linearGradient id="g" x2="0" y2="1"><stop stop-color="#081521" stop-opacity=".52"/><stop offset=".55" stop-color="#0a1018" stop-opacity=".34"/><stop offset="1" stop-color="#010304" stop-opacity=".5"/></linearGradient><radialGradient id="lamp"><stop stop-color="#ffd98d" stop-opacity=".18"/><stop offset="1" stop-color="#ffd98d" stop-opacity="0"/></radialGradient></defs><rect width="100%" height="100%" fill="url(#g)"/><ellipse cx="520" cy="520" rx="360" ry="250" fill="url(#lamp)"/><ellipse cx="1420" cy="460" rx="300" ry="220" fill="url(#lamp)"/>`)
};
const modeOverlays={
 hujan:svg(`<defs><linearGradient id="g"><stop stop-color="#4e6571" stop-opacity=".2"/><stop offset="1" stop-color="#13242a" stop-opacity=".25"/></linearGradient><pattern id="r" width="42" height="42" patternUnits="userSpaceOnUse" patternTransform="rotate(16)"><path d="M4-10V52M24-10V52" stroke="#d5e8ec" stroke-opacity=".12" stroke-width="2"/></pattern></defs><rect width="100%" height="100%" fill="url(#g)"/><rect width="100%" height="100%" fill="url(#r)"/>`),
 ramadan:svg(`<defs><radialGradient id="a"><stop stop-color="#f3cb76" stop-opacity=".18"/><stop offset="1" stop-color="#f3cb76" stop-opacity="0"/></radialGradient><linearGradient id="g"><stop stop-color="#15332c" stop-opacity=".16"/><stop offset="1" stop-color="#07130f" stop-opacity=".2"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/><circle cx="1530" cy="220" r="260" fill="url(#a)"/><circle cx="1640" cy="170" r="5" fill="#f4dfae" opacity=".55"/><circle cx="1760" cy="260" r="4" fill="#f4dfae" opacity=".42"/>`),
 agustusan:svg(`<defs><linearGradient id="g"><stop stop-color="#a83f3f" stop-opacity=".09"/><stop offset=".5" stop-color="#fff" stop-opacity=".025"/><stop offset="1" stop-color="#a83f3f" stop-opacity=".06"/></linearGradient></defs><rect width="100%" height="100%" fill="url(#g)"/><path d="M0 92 C420 150 720 54 1080 110 S1580 160 1920 82" fill="none" stroke="#f4eee3" stroke-opacity=".28" stroke-width="3"/><g opacity=".45"><path d="M170 112l28 0-14 34zM520 109l28 0-14 34zM870 91l28 0-14 34zM1220 118l28 0-14 34zM1560 111l28 0-14 34z" fill="#b43f42"/><path d="M340 124l28 0-14 34zM690 93l28 0-14 34zM1040 104l28 0-14 34zM1390 123l28 0-14 34zM1740 99l28 0-14 34z" fill="#f5f0e6"/></g>`),
 minggu:svg(`<defs><radialGradient id="s"><stop stop-color="#fff0bb" stop-opacity=".22"/><stop offset="1" stop-color="#fff0bb" stop-opacity="0"/></radialGradient></defs><circle cx="340" cy="160" r="600" fill="url(#s)"/>`),
 'malam-minggu':svg(`<defs><radialGradient id="p"><stop stop-color="#d3549e" stop-opacity=".12"/><stop offset="1" stop-color="#d3549e" stop-opacity="0"/></radialGradient><radialGradient id="c"><stop stop-color="#62d5d0" stop-opacity=".11"/><stop offset="1" stop-color="#62d5d0" stop-opacity="0"/></radialGradient></defs><ellipse cx="340" cy="560" rx="520" ry="340" fill="url(#p)"/><ellipse cx="1540" cy="380" rx="520" ry="340" fill="url(#c)"/>`)
};

async function sceneBaseBuffer(input){
 return sharp(input,{density:200}).resize(W,H,{fit:'cover',position:'centre'}).modulate({brightness:.99,saturation:.94}).sharpen({sigma:.45,m1:.7,m2:.35}).png().toBuffer();
}
async function writeScene(buffer,output,extra=[],quality=84){
 await sharp(buffer).composite([...extra,{input:grain,blend:'soft-light'},{input:vignette,blend:'multiply'}]).webp({quality,alphaQuality:90,effort:6,smartSubsample:true}).toFile(output);
}
for(const id of scenes){
 const input=join(sceneRoot,`${id}-90.svg`);
 if(!(await exists(input)))throw new Error(`Missing world scene source: ${input}`);
 const base=await sceneBaseBuffer(input);
 await writeScene(base,join(outRoot,`${id}-90.webp`));
 for(const [phase,overlay] of Object.entries(phaseOverlays))await writeScene(base,join(outRoot,`${id}-${phase}.webp`),[{input:overlay,blend:'soft-light'}],82);
 const sceneModes=id==='kampung'?['hujan','ramadan','agustusan','minggu']:id==='kota'?['ramadan','malam-minggu']:id==='rumah'?['ramadan','minggu','malam-minggu']:id==='sekolah'?['agustusan']:[];
 for(const mode of sceneModes)await writeScene(base,join(outRoot,`${id}-${mode}.webp`),[{input:modeOverlays[mode],blend:'soft-light'}],82);
 console.log(`world-raster ${id}: base + 4 day phases + ${sceneModes.length} contextual states`);
}

const support=[['brand-orbit.svg','brand-orbit.webp',512,512],['portal-grid.svg','portal-grid.webp',1920,1080]];
for(const [sourceName,outName,width,height] of support){const input=join(sourceRoot,sourceName);if(await exists(input))await sharp(input,{density:200}).resize(width,height,{fit:'contain'}).webp({quality:88,alphaQuality:92,effort:6}).toFile(join(outRoot,outName));}
const editorial=[['brand-seal.svg','brand-seal.webp',512,512],['cassette-player.svg','cassette-player.webp',1200,760],['handheld-game.svg','handheld-game.webp',1100,800],['ramadan-lantern.svg','ramadan-lantern.webp',900,1080]];
for(const [sourceName,outName,width,height] of editorial){const input=join('public/assets',sourceName);if(await exists(input))await sharp(input,{density:220}).resize(width,height,{fit:'contain',background:{r:0,g:0,b:0,alpha:0}}).webp({quality:90,alphaQuality:95,effort:6}).toFile(join('public/assets',outName));}

const surfaceSpecs={
 archive:['jakarta-1991.jpg','pager.jpg','bobo-logo.png'],tv:['crt.jpg','jakarta-1991.jpg'],games:['permainan-tradisional.jpg','kelereng.jpg','congklak.jpg'],objects:['pager.jpg','gameboy-color.jpg','walkman.jpg'],timeline:['floppy.jpg','discman.jpg','pager.jpg'],warung:['warung.jpg','indomie.jpg'],ramadan:['ramadan.jpg','camera.jpg'],music:['cassette.jpg','walkman.jpg','discman.jpg'],quiz:['camera.jpg','tamagotchi.jpg','yoyo.jpg'],collection:['bobo-logo.png','pilot-pens.jpg','gameboy-color.jpg','camera.jpg'],school:['dr-grip.jpg','pilot-pens.jpg','bobo-logo.png']
};
async function photoTile(name,width,height,position='centre'){
 const path=join(mediaRoot,name);if(!(await exists(path)))return null;
 return sharp(path).resize(width,height,{fit:'cover',position}).modulate({brightness:.82,saturation:.78}).sharpen({sigma:.35}).png().toBuffer();
}
async function makeSurface(id,names){
 const usable=[];for(const name of names){const tile=await photoTile(name,760,760);if(tile)usable.push(tile)}
 if(!usable.length)return;
 const base=sharp({create:{width:1600,height:900,channels:4,background:{r:8,g:14,b:13,alpha:1}}});
 const comps=[];const slots=[[0,0],[650,80],[1040,240],[240,300]];
 for(let i=0;i<usable.length&&i<4;i++){comps.push({input:usable[i],left:slots[i][0],top:slots[i][1],blend:i===0?'over':'screen',opacity:i===0?.8:.34})}
 const finish=Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900"><defs><linearGradient id="g"><stop stop-color="#06100d" stop-opacity=".18"/><stop offset=".48" stop-color="#08100e" stop-opacity=".28"/><stop offset="1" stop-color="#020504" stop-opacity=".8"/></linearGradient><radialGradient id="r"><stop stop-color="#d9b96f" stop-opacity=".1"/><stop offset="1" stop-color="#d9b96f" stop-opacity="0"/></radialGradient></defs><rect width="100%" height="100%" fill="url(#g)"/><circle cx="1320" cy="160" r="460" fill="url(#r)"/></svg>`);
 await base.composite([...comps,{input:finish},{input:grain,blend:'soft-light'}]).webp({quality:82,effort:6,smartSubsample:true}).toFile(join(premiumRoot,`${id}.webp`));
 console.log(`premium-surface ${id}: ${usable.length} source tiles`);
}
for(const [id,names] of Object.entries(surfaceSpecs))await makeSurface(id,names);

const textureSpecs={paper:'#d9c9aa',wood:'#6f5137',plastic:'#40565a',photo:'#1d2422',crt:'#16211e'};
for(const [name,color] of Object.entries(textureSpecs)){
 const pattern=name==='wood'?`<path d="M0 80 C120 40 220 120 360 76 S650 48 800 100" fill="none" stroke="#f2d0a1" stroke-opacity=".09" stroke-width="5"/><path d="M0 220 C160 180 290 260 460 215 S680 210 800 245" fill="none" stroke="#25180f" stroke-opacity=".16" stroke-width="7"/>`:name==='crt'?`<pattern id="p" width="4" height="4" patternUnits="userSpaceOnUse"><path d="M0 1h4" stroke="#9de7d9" stroke-opacity=".1"/></pattern><rect width="100%" height="100%" fill="url(#p)"/>`:'';
 const source=Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="800" height="512"><rect width="100%" height="100%" fill="${color}"/>${pattern}<filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="3" seed="17"/></filter><rect width="100%" height="100%" filter="url(#n)" opacity=".11"/></svg>`);
 await sharp(source).webp({quality:76,effort:6}).toFile(join(premiumRoot,`texture-${name}.webp`));
}

const sealSource=join('public/assets','brand-seal.svg');
async function appIcon(size,fileName,{maskable=false}={}){
 if(!(await exists(sealSource)))throw new Error(`Missing app icon source: ${sealSource}`);
 const logoSize=Math.round(size*(maskable?.62:.74));
 const logo=await sharp(sealSource,{density:260}).resize(logoSize,logoSize,{fit:'contain'}).png().toBuffer();
 const halo=Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><defs><radialGradient id="g"><stop offset="0" stop-color="#79dfd3" stop-opacity=".15"/><stop offset=".52" stop-color="#dcbc76" stop-opacity=".055"/><stop offset="1" stop-color="#08100e" stop-opacity="0"/></radialGradient></defs><rect width="100%" height="100%" fill="#08100e"/><rect width="100%" height="100%" fill="url(#g)"/></svg>`);
 await sharp(halo).composite([{input:logo,gravity:'centre'}]).png({compressionLevel:9,palette:false}).toFile(join(iconRoot,fileName));
}
await appIcon(64,'wml-64.png');await appIcon(180,'wml-180.png');await appIcon(192,'wml-192.png');await appIcon(512,'wml-512.png');await appIcon(512,'wml-maskable-512.png',{maskable:true});

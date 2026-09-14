import {access, mkdir, stat, writeFile} from 'node:fs/promises';

const out = new URL('../public/assets/media/', import.meta.url);
await mkdir(out, {recursive:true});

// required=true berarti gambar dipakai pada modul utama yang selalu terlihat.
// Aset object-study/detail bersifat optional: kegagalan CDN tidak boleh memblokir
// deployment seluruh aplikasi; komponen Picture sudah mempunyai graceful fallback.
const assets = [
 {target:'jakarta-1991.jpg',file:'Jakarta-Senen-Shophouse4.jpg',width:1600,required:true},
 {target:'kelereng.jpg',file:'Bermain Kelereng.jpg',width:1600,required:true},
 {target:'congklak.jpg',file:'01 Permainan Tradisional Congklak.jpg',width:1200,required:true},
 {target:'permainan-tradisional.jpg',file:'Permainan Tradisional Indonesia.jpg',width:1600,required:true},
 {target:'warung.jpg',file:'Makanan warung.jpg',width:1200,required:true},
 {target:'ramadan.jpg',file:"On the night of the 21st of Ramadan 1446 at the Ubay bin Ka'ab Mosque.jpg",width:1600,required:true},
 {target:'cassette.jpg',file:'TDK D 90 IEC Type I normal transparent orange Cassette Tape (51878709668).jpg',width:1400,required:true},
 {target:'crt.jpg',file:'Retro CRT Television.jpg',width:1200,required:true},
 {target:'playstation.jpg',file:'PlayStation-SCPH-1000-with-Controller.jpg',width:1400,required:true},
 {target:'tamagotchi.jpg',file:'Gele tamagotchi, objectnr 78041.JPG',width:1200,required:true},
 {target:'walkman.jpg',file:'Sony Walkman WM-EX116 cassette player.jpg',width:1200,required:true},
 {target:'yoyo.jpg',file:'Yo-Yo-Plastic-Toy-Green.jpg',width:1100},
 {target:'floppy.jpg',file:'3.5" floppy disk.jpg',width:1100},
 {target:'phone.jpg',file:'Old rotary phone.jpg',width:1100},
 {target:'camera.jpg',file:'Olympus Trip 505.jpg',width:1100},
 {target:'bobo-logo.png',file:'Logo Majalah Bobo.png',width:900},
 {target:'gramedia-comics.jpg',file:'Bookshelf Comics in Gramedia.jpg',width:1600},
 {target:'gramedia-books.jpg',file:'Books stack in Gramedia Book Store.jpg',width:1600},
 {target:'indomie.jpg',file:'Boxes of Indo Mie instant noodles.jpg',width:1200},
 {target:'discman.jpg',file:'Sony Discman D 50.jpg',width:1162},
 {target:'dr-grip.jpg',file:'GrGRIP.jpg',width:1200},
 {target:'pilot-pens.jpg',file:"My Hi-TEC-Cs and Erk's Pens (498161156).jpg",width:1200},
 {target:'gameboy-color.jpg',file:'Nintendo-Game-Boy-Color-BL.jpg',width:1200},
 {target:'pager.jpg',file:'Motorola Advisor Pager (5005137730).jpg',width:1200},
 {target:'rollerskates.png',file:'Rollerskates.png',width:1000}
];

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function hasUsableCachedAsset(target) {
 const url = new URL(target, out);
 try {
  await access(url);
  const info = await stat(url);
  return info.isFile() && info.size > 2048;
 } catch {
  return false;
 }
}

async function fetchAsset(url, target, waits=[0,1800,4200,8000]) {
 let lastError;
 for (let attempt = 0; attempt < waits.length; attempt++) {
  if (waits[attempt]) await sleep(waits[attempt]);
  try {
   const res = await fetch(url, {
    headers:{
     'User-Agent':'WisataMasaLalu/2.6 (licensed editorial asset build; GitHub Pages)',
     'Accept':'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
    },
    signal: AbortSignal.timeout(30000)
   });
   if (!res.ok) {
    const retryable = res.status === 429 || res.status >= 500;
    if (retryable && attempt < waits.length - 1) {
     console.warn(`asset ${target}: HTTP ${res.status}; retry ${attempt + 1}/${waits.length - 1}`);
     continue;
    }
    throw new Error(`HTTP ${res.status}`);
   }
   const type = res.headers.get('content-type') || '';
   if (!type.startsWith('image/')) throw new Error(`unexpected content-type ${type}`);
   const bytes = new Uint8Array(await res.arrayBuffer());
   if (bytes.length < 2048) throw new Error(`suspiciously small image (${bytes.length} bytes)`);
   return bytes;
  } catch (error) {
   lastError = error;
   if (attempt < waits.length - 1) {
    console.warn(`asset ${target}: ${error.message}; retry ${attempt + 1}/${waits.length - 1}`);
    continue;
   }
  }
 }
 throw lastError || new Error('download failed');
}

const downloaded = new Set();
const cached = new Set();
let failed = [];

async function tryOne(asset, waits) {
 const {target,file,width} = asset;
 if (await hasUsableCachedAsset(target)) {
  cached.add(target);
  console.log(`asset ${target}: cache hit`);
  return true;
 }
 const url = `https://commons.wikimedia.org/wiki/Special:Redirect/file/${encodeURIComponent(file)}?width=${width}`;
 try {
  const bytes = await fetchAsset(url, target, waits);
  await writeFile(new URL(target, out), bytes);
  downloaded.add(target);
  console.log(`asset ${target}: ${Math.round(bytes.length/1024)} KB`);
  return true;
 } catch (error) {
  console.warn(`asset ${target}: pass failed (${error.message})`);
  return false;
 }
}

// Pass 1: pelan untuk mengurangi 429 dari Commons.
for (const asset of assets) {
 if (!await tryOne(asset)) failed.push(asset);
 await sleep(700);
}

// Pass 2: hanya item gagal, setelah cooldown global. Ini mengatasi burst throttling
// yang sebelumnya membuat build gagal walaupun 22/25 visual sudah tersedia.
if (failed.length) {
 console.warn(`Cooling down before recovery pass for ${failed.length} asset(s)…`);
 await sleep(12000);
 const retry = [];
 for (const asset of failed) {
  if (!await tryOne(asset,[0,3500,8000,14000])) retry.push(asset);
  await sleep(1200);
 }
 failed = retry;
}

const missingRequired = failed.filter(asset=>asset.required);
const available = assets.length - failed.length;
const manifest = {
 generatedAt:new Date().toISOString(),
 total:assets.length,
 available,
 cached:[...cached],
 downloaded:[...downloaded],
 missing:failed.map(asset=>asset.target),
 missingRequired:missingRequired.map(asset=>asset.target)
};
await writeFile(new URL('manifest.json', out), JSON.stringify(manifest,null,2));

if (missingRequired.length) {
 throw new Error(`Required visual assets unavailable after recovery pass: ${missingRequired.map(a=>a.target).join(', ')}`);
}

console.log(`Visual pipeline ready: ${available}/${assets.length} available; ${cached.size} cache hits; ${downloaded.size} downloaded.${failed.length ? ` Optional missing: ${failed.map(a=>a.target).join(', ')}` : ' Complete visual set.'}`);

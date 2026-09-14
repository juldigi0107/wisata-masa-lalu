import {mkdir, writeFile} from 'node:fs/promises';

const out = new URL('../public/assets/media/', import.meta.url);
await mkdir(out, {recursive:true});

const assets = [
 ['jakarta-1991.jpg','Jakarta-Senen-Shophouse4.jpg',1600],
 ['kelereng.jpg','Bermain Kelereng.jpg',1600],
 ['congklak.jpg','01 Permainan Tradisional Congklak.jpg',1200],
 ['permainan-tradisional.jpg','Permainan Tradisional Indonesia.jpg',1600],
 ['warung.jpg','Makanan warung.jpg',1200],
 ['ramadan.jpg',"On the night of the 21st of Ramadan 1446 at the Ubay bin Ka'ab Mosque.jpg",1600],
 ['cassette.jpg','TDK D 90 IEC Type I normal transparent orange Cassette Tape (51878709668).jpg',1400],
 ['crt.jpg','Retro CRT Television.jpg',1200],
 ['playstation.jpg','PlayStation-SCPH-1000-with-Controller.jpg',1400],
 ['tamagotchi.jpg','Gele tamagotchi, objectnr 78041.JPG',1200],
 ['walkman.jpg','Sony Walkman WM-EX116 cassette player.jpg',1200],
 ['yoyo.jpg','Yo-Yo-Plastic-Toy-Green.jpg',1100],
 ['floppy.jpg','3.5" floppy disk.jpg',1100],
 ['phone.jpg','Old rotary phone.jpg',1100],
 ['camera.jpg','Olympus Trip 505.jpg',1100],
 ['bobo-logo.png','Logo Majalah Bobo.png',900],
 ['gramedia-comics.jpg','Bookshelf Comics in Gramedia.jpg',1600],
 ['gramedia-books.jpg','Books stack in Gramedia Book Store.jpg',1600],
 ['indomie.jpg','Boxes of Indo Mie instant noodles.jpg',1200],
 ['discman.jpg','Sony Discman D 50.jpg',1162],
 ['dr-grip.jpg','GrGRIP.jpg',1200],
 ['pilot-pens.jpg',"My Hi-TEC-Cs and Erk's Pens (498161156).jpg",1200],
 ['gameboy-color.jpg','Nintendo-Game-Boy-Color-BL.jpg',1200],
 ['pager.jpg','Motorola Advisor Pager (5005137730).jpg',1200],
 ['rollerskates.png','Rollerskates.png',1000]
];

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function fetchAsset(url, target) {
 const waits = [0, 1400, 3200, 5600];
 let lastError;
 for (let attempt = 0; attempt < waits.length; attempt++) {
  if (waits[attempt]) await sleep(waits[attempt]);
  try {
   const res = await fetch(url, {
    headers:{
     'User-Agent':'WisataMasaLalu/2.0 (licensed editorial asset build; GitHub Pages)',
     'Accept':'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
    }
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
   return new Uint8Array(await res.arrayBuffer());
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

let ok = 0;
const failed = [];
for (const [target, file, width] of assets) {
 const url = `https://commons.wikimedia.org/wiki/Special:Redirect/file/${encodeURIComponent(file)}?width=${width}`;
 try {
  const bytes = await fetchAsset(url, target);
  await writeFile(new URL(target, out), bytes);
  ok++;
  console.log(`asset ${target}: ${Math.round(bytes.length/1024)} KB`);
 } catch (error) {
  failed.push(target);
  console.warn(`asset ${target} skipped after retries: ${error.message}`);
 }
 await sleep(350);
}

if (ok < 23) throw new Error(`Only ${ok}/${assets.length} visual assets could be fetched; refusing incomplete build. Missing: ${failed.join(', ')}`);
console.log(`Downloaded ${ok}/${assets.length} licensed visual assets.${failed.length ? ` Missing after retries: ${failed.join(', ')}` : ' Complete visual set.'}`);

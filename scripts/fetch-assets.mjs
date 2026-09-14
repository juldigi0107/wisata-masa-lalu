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
 ['camera.jpg','Olympus Trip 505.jpg',1100]
];

let ok = 0;
for (const [target, file, width] of assets) {
 const url = `https://commons.wikimedia.org/wiki/Special:Redirect/file/${encodeURIComponent(file)}?width=${width}`;
 try {
  const res = await fetch(url, {headers:{'User-Agent':'WisataMasaLalu/2.0 (licensed editorial asset build; GitHub Pages)'}});
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const type = res.headers.get('content-type') || '';
  if (!type.startsWith('image/')) throw new Error(`unexpected content-type ${type}`);
  const bytes = new Uint8Array(await res.arrayBuffer());
  await writeFile(new URL(target, out), bytes);
  ok++;
  console.log(`asset ${target}: ${Math.round(bytes.length/1024)} KB`);
 } catch (error) {
  console.warn(`asset ${target} skipped: ${error.message}`);
 }
}

if (ok < 8) throw new Error(`Only ${ok}/${assets.length} visual assets could be fetched; refusing incomplete build.`);
console.log(`Downloaded ${ok}/${assets.length} licensed visual assets.`);

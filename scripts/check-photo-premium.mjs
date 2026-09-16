import {readFile,stat} from 'node:fs/promises';
import {join} from 'node:path';

const pageIds=['intro','onboarding','time-machine','search','collection','campaign','settings','social','contextual','moderation','recovery'];
const sceneIds=['rumah','kampung','sekolah','kota','digital'];
const required=[...pageIds.map(id=>`assets/generated/${id}-premium.webp`),...sceneIds.map(id=>`assets/world/raster/${id}-90.webp`),'assets/generated/premium-photo-manifest.json','assets/world/raster/portal-grid.webp','assets/world/raster/brand-orbit.webp','assets/cassette-player.webp','assets/handheld-game.webp','assets/ramadan-lantern.webp'];
const missing=[];let total=0;
for(const path of required){try{const info=await stat(join('dist',path));if(!info.isFile())throw Error('not file');total+=info.size;if(path.endsWith('.webp')&&info.size<8*1024)throw Error('suspiciously small raster')}catch(error){missing.push(`${path}${error?.message==='suspiciously small raster'?' (too small)':''}`)}}
if(missing.length)throw new Error(`Photo-premium layer incomplete: ${missing.join(', ')}`);
const manifest=JSON.parse(await readFile(join('dist','assets/generated/premium-photo-manifest.json'),'utf8'));
if(manifest.pipeline!=='photo-assisted-spatial-raster-v1')throw new Error(`Unexpected premium photo pipeline: ${manifest.pipeline}`);
if(!Array.isArray(manifest.scenes)||manifest.scenes.length!==5)throw new Error(`Photo-assisted scenes ${manifest.scenes?.length||0}/5`);
if(!Array.isArray(manifest.pages)||manifest.pages.length!==pageIds.length)throw new Error(`Premium page backdrops ${manifest.pages?.length||0}/${pageIds.length}`);
for(const scene of manifest.scenes){if(!Array.isArray(scene.photos)||scene.photos.length<2)throw new Error(`Scene ${scene.id} lacks enough photographic sources`)}
if(total>11*1024*1024)throw new Error(`Photo-premium layer exceeds 11 MB: ${(total/1024/1024).toFixed(2)} MB`);
console.log(`Photo-premium layer: 5/5 scenes · ${pageIds.length}/${pageIds.length} page backdrops · ${(total/1024/1024).toFixed(2)} MB checked.`);

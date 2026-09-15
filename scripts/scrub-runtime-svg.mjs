import {readdir,readFile,writeFile,unlink,stat} from 'node:fs/promises';
import {join,extname,relative} from 'node:path';

const DIST='dist';
const TEXT_EXTENSIONS=new Set(['.html','.js','.css','.json','.webmanifest','.txt','.md']);
const REWRITES=new Map([
 ['brand-seal.svg','brand-seal.webp'],
 ['cassette-player.svg','cassette-player.webp'],
 ['handheld-game.svg','handheld-game.webp'],
 ['ramadan-lantern.svg','ramadan-lantern.webp'],
 ['world/brand-orbit.svg','world/raster/brand-orbit.webp'],
 ['world/portal-grid.svg','world/raster/portal-grid.webp'],
 ['world/scenes/rumah-90.svg','world/raster/rumah-90.webp'],
 ['world/scenes/kampung-90.svg','world/raster/kampung-90.webp'],
 ['world/scenes/sekolah-90.svg','world/raster/sekolah-90.webp'],
 ['world/scenes/kota-90.svg','world/raster/kota-90.webp'],
 ['world/scenes/digital-90.svg','world/raster/digital-90.webp']
]);

async function walk(dir){
 const entries=await readdir(dir,{withFileTypes:true});
 const files=[];
 for(const entry of entries){
  const full=join(dir,entry.name);
  if(entry.isDirectory())files.push(...await walk(full));
  else files.push(full);
 }
 return files;
}

const initial=await walk(DIST);
let rewrittenFiles=0;
let rewriteCount=0;

for(const file of initial){
 if(!TEXT_EXTENSIONS.has(extname(file).toLowerCase()))continue;
 let content=await readFile(file,'utf8');
 const before=content;
 for(const [from,to] of REWRITES){
  if(content.includes(from)){
   const count=content.split(from).length-1;
   content=content.split(from).join(to);
   rewriteCount+=count;
  }
 }
 if(content!==before){await writeFile(file,content);rewrittenFiles+=1}
}

const afterRewrite=await walk(DIST);
const leakedReferences=[];
for(const file of afterRewrite){
 if(!TEXT_EXTENSIONS.has(extname(file).toLowerCase()))continue;
 const content=await readFile(file,'utf8');
 const matches=[...content.matchAll(/(?:["'`(=:\s]|^)([^"'`\s)]+\.svg)(?:[?#["'`\s)]|$)/gi)].map(match=>match[1]);
 if(matches.length)leakedReferences.push({file:relative(DIST,file),refs:[...new Set(matches)]});
}
if(leakedReferences.length){
 console.error('Runtime SVG references remain after raster rewrite:');
 for(const leak of leakedReferences)console.error(`- ${leak.file}: ${leak.refs.join(', ')}`);
 process.exit(1);
}

let removed=0;
for(const file of afterRewrite){
 if(extname(file).toLowerCase()!=='.svg')continue;
 await unlink(file);removed+=1;
}

const finalFiles=await walk(DIST);
const remainingSvg=finalFiles.filter(file=>extname(file).toLowerCase()==='.svg');
if(remainingSvg.length){
 console.error('Authoring SVG still present in production artifact:',remainingSvg.map(file=>relative(DIST,file)).join(', '));
 process.exit(1);
}

const required=[
 'assets/world/raster/rumah-90.webp','assets/world/raster/kampung-90.webp','assets/world/raster/sekolah-90.webp','assets/world/raster/kota-90.webp','assets/world/raster/digital-90.webp',
 'assets/world/raster/brand-orbit.webp','assets/world/raster/portal-grid.webp','assets/brand-seal.webp','assets/cassette-player.webp','assets/handheld-game.webp','assets/ramadan-lantern.webp',
 'assets/icons/wml-64.png','assets/icons/wml-180.png','assets/icons/wml-192.png','assets/icons/wml-512.png','assets/icons/wml-maskable-512.png'
];
for(const path of required){
 const full=join(DIST,path);
 try{const info=await stat(full);if(!info.isFile())throw Error('not file')}
 catch{console.error(`Required raster production asset missing: ${path}`);process.exit(1)}
}

console.log(`Raster-only production scrub complete: ${rewriteCount} reference rewrites across ${rewrittenFiles} files; ${removed} authoring SVG files removed.`);

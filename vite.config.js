import {defineConfig} from "vite";
import react from "@vitejs/plugin-react";
import tailwind from "@tailwindcss/vite";
import {rm} from "node:fs/promises";

const runtimeRasterRewrites=new Map([
 ["brand-seal.svg","brand-seal.webp"],
 ["cassette-player.svg","cassette-player.webp"],
 ["handheld-game.svg","handheld-game.webp"],
 ["ramadan-lantern.svg","ramadan-lantern.webp"],
 ["assets/world/scenes/rumah-90.svg","assets/world/raster/rumah-90.webp"],
 ["assets/world/scenes/kampung-90.svg","assets/world/raster/kampung-90.webp"],
 ["assets/world/scenes/sekolah-90.svg","assets/world/raster/sekolah-90.webp"],
 ["assets/world/scenes/kota-90.svg","assets/world/raster/kota-90.webp"],
 ["assets/world/scenes/digital-90.svg","assets/world/raster/digital-90.webp"]
]);

const rasterRuntimeAssets={
 name:"raster-runtime-assets",
 enforce:"pre",
 transform(code,id){
  if(!/\.(?:[jt]sx?|mjs)$/.test(id))return null;
  let next=code;
  for(const [from,to] of runtimeRasterRewrites)next=next.split(from).join(to);
  return next===code?null:{code:next,map:null};
 }
};

const portableWorldAssets={
 name:"portable-world-assets",
 enforce:"pre",
 transform(code,id){
  if(!id.endsWith("/premium.css")&&!id.endsWith("/scene-art.css"))return null;
  const replacements=new Map([
   ["url('/wisata-masa-lalu/assets/world/portal-grid.svg')","var(--wml-portal-grid)"],
   ["url('/wisata-masa-lalu/assets/world/brand-orbit.svg')","var(--wml-brand-orbit)"],
   ["url('/wisata-masa-lalu/assets/world/scenes/rumah-90.svg')","var(--wml-scene-rumah)"],
   ["url('/wisata-masa-lalu/assets/world/scenes/kampung-90.svg')","var(--wml-scene-kampung)"],
   ["url('/wisata-masa-lalu/assets/world/scenes/sekolah-90.svg')","var(--wml-scene-sekolah)"],
   ["url('/wisata-masa-lalu/assets/world/scenes/kota-90.svg')","var(--wml-scene-kota)"],
   ["url('/wisata-masa-lalu/assets/world/scenes/digital-90.svg')","var(--wml-scene-digital)"]
  ]);
  let next=code;
  for(const [from,to] of replacements)next=next.split(from).join(to);
  return next===code?null:{code:next,map:null};
 }
};

const stripWorldAuthoringVectors={
 name:"strip-world-authoring-vectors",
 apply:"build",
 async closeBundle(){
  await Promise.all([
   rm('dist/assets/world/scenes',{recursive:true,force:true}),
   rm('dist/assets/world/brand-orbit.svg',{force:true}),
   rm('dist/assets/world/portal-grid.svg',{force:true})
  ]);
 }
};

export default defineConfig({
 plugins:[rasterRuntimeAssets,portableWorldAssets,react(),tailwind(),stripWorldAuthoringVectors],
 base:"./"
});

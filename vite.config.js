import {defineConfig} from "vite";
import react from "@vitejs/plugin-react";
import tailwind from "@tailwindcss/vite";
import {rm} from "node:fs/promises";

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
 plugins:[portableWorldAssets,react(),tailwind(),stripWorldAuthoringVectors],
 base:"./"
});

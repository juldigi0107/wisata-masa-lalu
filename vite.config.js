import {defineConfig} from "vite";
import react from "@vitejs/plugin-react";
import tailwind from "@tailwindcss/vite";

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

export default defineConfig({
 plugins:[portableWorldAssets,react(),tailwind()],
 base:"./"
});

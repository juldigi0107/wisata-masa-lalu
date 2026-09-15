import React from "react";
import {createRoot} from "react-dom/client";
import WorldExperienceShell from "./world/WorldExperienceShell.jsx";
import AmbientRuntimeV4 from "./world/AmbientRuntimeV4.jsx";
import PremiumRuntimeV5 from "./world/PremiumRuntimeV5.jsx";
import EasterEggRuntime from "./world/EasterEggRuntime.jsx";
import EventVisualRuntimeV7 from "./world/EventVisualRuntimeV7.jsx";
import ObjectLensVisualRuntimeV7 from "./world/ObjectLensVisualRuntimeV7.jsx";
import baseCatalog from "../shared/catalog.js";
import assembledCatalog from "../shared/assembled-catalog.js";
import {scenes,years} from "../shared/world-model.js";
import {getTrigger} from "../shared/memory-triggers.js";
import "./styles.css";
import "./details.css";
import "./world/premium.css";
import "./world/scene-art.css";
import "./world/runtime-assets.css";
import "./world/motion.css";
import "./world/polish.css";
import "./world/special-mechanics.css";
import "./world/mechanics-v2.css";
import "./world/mechanics-diversity-v4.css";
import "./world/simulation-provenance-v4.css";
import "./world/device-controls.css";
import "./world/resilience.css";
import "./world/mobile-premium.css";
import "./world/mobile-focus.css";
import "./world/mobile-hardening-v2.css";
import "./world/entry-flow-v2.css";
import "./world/page-system.css";
import "./world/seasonal-function-v4.css";
import "./world/archive-recovery-v4.css";
import "./world/entry-premium-v5.css";

Object.assign(baseCatalog, assembledCatalog);
const appBase=import.meta.env.BASE_URL||"/";
const runtimeAsset=path=>`url("${appBase}${path}")`;
const rootStyle=document.documentElement.style;
rootStyle.setProperty("--wml-portal-grid",runtimeAsset("assets/world/raster/portal-grid.webp"));
rootStyle.setProperty("--wml-brand-orbit",runtimeAsset("assets/world/raster/brand-orbit.webp"));
rootStyle.setProperty("--wml-brand-seal",runtimeAsset("assets/brand-seal.webp"));
rootStyle.setProperty("--wml-cassette-player",runtimeAsset("assets/cassette-player.webp"));
rootStyle.setProperty("--wml-handheld-game",runtimeAsset("assets/handheld-game.webp"));
rootStyle.setProperty("--wml-ramadan-lantern",runtimeAsset("assets/ramadan-lantern.webp"));
const phases=['pagi','siang','sore','malam'];
const contextualStates={rumah:['ramadan','lebaran','minggu','malam-minggu'],kampung:['hujan','ramadan','lebaran','agustusan','minggu'],sekolah:['agustusan'],kota:['ramadan','lebaran','malam-minggu'],digital:[]};
for(const id of Object.keys(scenes)){
 rootStyle.setProperty(`--wml-scene-${id}`,runtimeAsset(`assets/world/raster/${id}-90.webp`));
 for(const phase of phases)rootStyle.setProperty(`--wml-scene-${id}-${phase}`,runtimeAsset(`assets/world/raster/${id}-${phase}.webp`));
 for(const state of contextualStates[id]||[])rootStyle.setProperty(`--wml-scene-${id}-${state}`,runtimeAsset(`assets/world/raster/${id}-${state}.webp`));
}
const sceneDetailAssets={rumah:'assets/media/cassette.jpg',kampung:'assets/media/warung.jpg',sekolah:'assets/media/dr-grip.jpg',kota:'assets/media/pager.jpg',digital:'assets/media/gameboy-color.jpg'};
for(const [id,path] of Object.entries(sceneDetailAssets))rootStyle.setProperty(`--wml-scene-${id}-detail`,runtimeAsset(path));
for(const id of ['archive','tv','games','objects','timeline','warung','ramadan','music','quiz','collection','school'])rootStyle.setProperty(`--wml-surface-${id}`,runtimeAsset(`assets/generated/${id}.webp`));
for(const id of ['paper','wood','plastic','photo','crt'])rootStyle.setProperty(`--wml-texture-${id}`,runtimeAsset(`assets/generated/texture-${id}.webp`));

try{
 const key='wml-v3-profile',params=new URLSearchParams(window.location.search),requestedScene=params.get('scene'),requestedYear=Number(params.get('year')),hasScene=Boolean(requestedScene&&scenes[requestedScene]),hasYear=years.includes(requestedYear),existing=JSON.parse(localStorage.getItem(key)||'null');let stored=existing;
 if(hasScene||hasYear)stored=stored||{type:'anak-tv',completed:[],collections:[],visitedScenes:[],visitedYears:[],score:0,settings:{master:.7,ambience:.55,ui:.75,mute:false,intensity:'imersif'}};
 if(stored){const completed=[...new Set(Array.isArray(stored.completed)?stored.completed:[])].filter(id=>Boolean(getTrigger(id)));stored.completed=completed;stored.score=completed.reduce((sum,id)=>sum+(getTrigger(id)?.points||0),0);stored.schema=4;if(hasScene){stored.scene=requestedScene;stored.visitedScenes=[...new Set([...(stored.visitedScenes||[]),requestedScene])]}if(hasYear){stored.year=requestedYear;stored.visitedYears=[...new Set([...(stored.visitedYears||[]),requestedYear])]}localStorage.setItem(key,JSON.stringify(stored));}
}catch{}

class AppErrorBoundary extends React.Component{
 constructor(props){super(props);this.state={failed:false}}
 static getDerivedStateFromError(){return{failed:true}}
 componentDidCatch(error,info){console.error('Wisata Masa Lalu render recovery',error,info)}
 render(){if(!this.state.failed)return this.props.children;return <main className="fatal-shell" role="alert"><section><small>RECOVERY / TIME MACHINE</small><h1>Mesin waktu tersendat.</h1><p>Perjalanan lokalmu tidak dihapus. Muat ulang aplikasi untuk membangun ulang scene dan melanjutkan dari progress yang tersimpan di perangkat ini.</p><button onClick={()=>window.location.reload()}>MUAT ULANG DUNIA ↻</button></section></main>;}
}
createRoot(document.getElementById("root")).render(<React.StrictMode><AppErrorBoundary><WorldExperienceShell/><AmbientRuntimeV4/><PremiumRuntimeV5/><EventVisualRuntimeV7/><ObjectLensVisualRuntimeV7/><EasterEggRuntime/></AppErrorBoundary></React.StrictMode>);
void import("./world/premium-runtime-styles.js").catch(error=>console.warn('Premium atmosphere style chunk unavailable',error));
void import("./world/interaction-runtime-styles.js").catch(error=>console.warn('Deep interaction style chunk unavailable',error));
if('serviceWorker' in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register(`${appBase}sw.js`).catch(()=>{}));

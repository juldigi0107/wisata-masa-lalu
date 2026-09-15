import React from "react";
import {createRoot} from "react-dom/client";
import WorldExperienceShell from "./world/WorldExperienceShell.jsx";
import AmbientRuntimeV4 from "./world/AmbientRuntimeV4.jsx";
import PremiumRuntimeV5 from "./world/PremiumRuntimeV5.jsx";
import EasterEggRuntime from "./world/EasterEggRuntime.jsx";
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
import "./world/visual-dna-v6.css";

Object.assign(baseCatalog, assembledCatalog);

const appBase=import.meta.env.BASE_URL||"/";
const runtimeAsset=path=>`url("${appBase}${path}")`;
const rootStyle=document.documentElement.style;

/* Visual DNA v6 is raster-first. Every image below already ships in the repository
   and is covered by the visual-source ledger/build pipeline. CSS gradients supply
   the futuristic time-machine framing without depending on missing binary assets. */
rootStyle.setProperty("--wml-portal-grid","radial-gradient(circle at 50% 50%,rgba(119,224,212,.16) 0 1px,transparent 1.5px),linear-gradient(rgba(119,224,212,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(119,224,212,.04) 1px,transparent 1px)");
rootStyle.setProperty("--wml-brand-orbit","radial-gradient(circle,transparent 46%,rgba(119,224,212,.14) 47% 47.5%,transparent 48%),conic-gradient(from 12deg,transparent 0 8%,rgba(228,192,119,.26) 8.2% 8.6%,transparent 8.8% 24%,rgba(119,224,212,.2) 24.2% 24.7%,transparent 25% 100%)");
rootStyle.setProperty("--wml-brand-seal","radial-gradient(circle at 40% 35%,#d8b56b 0 4%,#172522 4.5% 21%,#7cded2 21.5% 23%,#0d1513 23.5% 100%)");
rootStyle.setProperty("--wml-cassette-player",runtimeAsset("assets/media/cassette.jpg"));
rootStyle.setProperty("--wml-handheld-game",runtimeAsset("assets/media/gameboy-color.jpg"));
rootStyle.setProperty("--wml-ramadan-lantern",runtimeAsset("assets/media/ramadan.jpg"));

const rasterSceneAssets={
 rumah:['assets/media/crt.jpg','assets/media/cassette.jpg'],
 kampung:['assets/media/permainan-tradisional.jpg','assets/media/warung.jpg'],
 sekolah:['assets/media/kelereng.jpg','assets/media/dr-grip.jpg'],
 kota:['assets/media/jakarta-1991.jpg','assets/media/pager.jpg'],
 digital:['assets/media/floppy.jpg','assets/media/gameboy-color.jpg']
};
for(const id of Object.keys(scenes)){
 const pair=rasterSceneAssets[id]||rasterSceneAssets.rumah;
 rootStyle.setProperty(`--wml-scene-${id}`,runtimeAsset(pair[0]));
 rootStyle.setProperty(`--wml-scene-${id}-detail`,runtimeAsset(pair[1]));
}

try{
 const key='wml-v3-profile';
 const params=new URLSearchParams(window.location.search);
 const requestedScene=params.get('scene');
 const requestedYear=Number(params.get('year'));
 const hasScene=Boolean(requestedScene&&scenes[requestedScene]);
 const hasYear=years.includes(requestedYear);
 const existing=JSON.parse(localStorage.getItem(key)||'null');
 let stored=existing;
 if(hasScene||hasYear){
  stored=stored||{
   type:'anak-tv',completed:[],collections:[],visitedScenes:[],visitedYears:[],score:0,
   settings:{master:.7,ambience:.55,ui:.75,mute:false,intensity:'imersif'}
  };
 }
 if(stored){
  const completed=[...new Set(Array.isArray(stored.completed)?stored.completed:[])].filter(id=>Boolean(getTrigger(id)));
  stored.completed=completed;
  stored.score=completed.reduce((sum,id)=>sum+(getTrigger(id)?.points||0),0);
  stored.schema=4;
  if(hasScene){
   stored.scene=requestedScene;
   stored.visitedScenes=[...new Set([...(stored.visitedScenes||[]),requestedScene])];
  }
  if(hasYear){
   stored.year=requestedYear;
   stored.visitedYears=[...new Set([...(stored.visitedYears||[]),requestedYear])];
  }
  localStorage.setItem(key,JSON.stringify(stored));
 }
}catch{}

class AppErrorBoundary extends React.Component{
 constructor(props){super(props);this.state={failed:false}}
 static getDerivedStateFromError(){return{failed:true}}
 componentDidCatch(error,info){console.error('Wisata Masa Lalu render recovery',error,info)}
 render(){
  if(!this.state.failed)return this.props.children;
  return <main className="fatal-shell" role="alert"><section><small>RECOVERY / TIME MACHINE</small><h1>Mesin waktu tersendat.</h1><p>Perjalanan lokalmu tidak dihapus. Muat ulang aplikasi untuk membangun ulang scene dan melanjutkan dari progress yang tersimpan di perangkat ini.</p><button onClick={()=>window.location.reload()}>MUAT ULANG DUNIA ↻</button></section></main>;
 }
}

createRoot(document.getElementById("root")).render(
 <React.StrictMode><AppErrorBoundary><WorldExperienceShell/><AmbientRuntimeV4/><PremiumRuntimeV5/><EasterEggRuntime/></AppErrorBoundary></React.StrictMode>
);

void import("./world/premium-runtime-styles.js").catch(error=>console.warn('Premium atmosphere style chunk unavailable',error));
void import("./world/interaction-runtime-styles.js").catch(error=>console.warn('Deep interaction style chunk unavailable',error));

if('serviceWorker' in navigator){
 window.addEventListener('load',()=>navigator.serviceWorker.register(`${appBase}sw.js`).catch(()=>{}));
}

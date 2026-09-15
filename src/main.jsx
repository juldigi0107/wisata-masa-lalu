import React from "react";
import {createRoot} from "react-dom/client";
import WorldApp from "./world/WorldApp.jsx";
import baseCatalog from "../shared/catalog.js";
import assembledCatalog from "../shared/assembled-catalog.js";
import {scenes,years} from "../shared/world-model.js";
import "./styles.css";
import "./details.css";
import "./world/premium.css";
import "./world/scene-art.css";
import "./world/runtime-assets.css";
import "./world/motion.css";
import "./world/polish.css";
import "./world/archive-premium.css";
import "./world/special-mechanics.css";
import "./world/context-archive.css";
import "./world/context-dossier-v2.css";
import "./world/device-controls.css";
import "./world/resilience.css";
import "./world/mobile-premium.css";
import "./world/mobile-focus.css";
import "./world/page-system.css";

Object.assign(baseCatalog, assembledCatalog);

const appBase=import.meta.env.BASE_URL||"/";
const runtimeAsset=path=>`url("${appBase}${path}")`;
const rootStyle=document.documentElement.style;
rootStyle.setProperty("--wml-portal-grid",runtimeAsset("assets/world/portal-grid.svg"));
rootStyle.setProperty("--wml-brand-orbit",runtimeAsset("assets/world/brand-orbit.svg"));
for(const id of Object.keys(scenes)){
 rootStyle.setProperty(`--wml-scene-${id}`,runtimeAsset(`assets/world/scenes/${id}-90.svg`));
}

try{
 const params=new URLSearchParams(window.location.search);
 const requestedScene=params.get('scene');
 const requestedYear=Number(params.get('year'));
 if(requestedScene&&scenes[requestedScene]){
  const key='wml-v3-profile';
  const stored=JSON.parse(localStorage.getItem(key)||'null')||{
   type:'anak-tv',completed:[],collections:[],visitedScenes:[],visitedYears:[],score:0,
   settings:{master:.7,ambience:.55,ui:.75,mute:false,intensity:'imersif'}
  };
  stored.scene=requestedScene;
  stored.visitedScenes=[...new Set([...(stored.visitedScenes||[]),requestedScene])];
  if(years.includes(requestedYear)){
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
 <React.StrictMode><AppErrorBoundary><WorldApp/></AppErrorBoundary></React.StrictMode>
);

if('serviceWorker' in navigator){
 window.addEventListener('load',()=>navigator.serviceWorker.register(`${appBase}sw.js`).catch(()=>{}));
}

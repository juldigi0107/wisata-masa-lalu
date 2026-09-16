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
import "./world/premium-photo-pages.css";
import "./world/raster-world-v6.css";

Object.assign(baseCatalog, assembledCatalog);
const appBase=import.meta.env.BASE_URL||"/";
const runtimeAsset=path=>`url("${appBase}${path}")`;
const rootStyle=document.documentElement.style;

/* Production visual registry intentionally references only assets that are either committed
   or produced by the licensed build-time media pipeline. Missing future art must never become
   the primary render path. */
rootStyle.setProperty("--wml-portal-grid",runtimeAsset("assets/world/portal-grid.svg"));
rootStyle.setProperty("--wml-brand-orbit",runtimeAsset("assets/world/brand-orbit.svg"));
const sceneRaster={
 rumah:{hero:'assets/media/crt.jpg',a:'assets/media/cassette.jpg',b:'assets/media/camera.jpg'},
 kampung:{hero:'assets/media/warung.jpg',a:'assets/media/permainan-tradisional.jpg',b:'assets/media/kelereng.jpg'},
 sekolah:{hero:'assets/media/bobo-logo.png',a:'assets/media/dr-grip.jpg',b:'assets/media/pilot-pens.jpg'},
 kota:{hero:'assets/media/pager.jpg',a:'assets/media/rollerskates.png',b:'assets/media/discman.jpg'},
 digital:{hero:'assets/media/gameboy-color.jpg',a:'assets/media/floppy.jpg',b:'assets/media/discman.jpg'}
};
for(const [id,assets] of Object.entries(sceneRaster)){
 rootStyle.setProperty(`--wml-scene-${id}`,runtimeAsset(assets.hero));
 rootStyle.setProperty(`--wml-scene-${id}-detail-a`,runtimeAsset(assets.a));
 rootStyle.setProperty(`--wml-scene-${id}-detail-b`,runtimeAsset(assets.b));
}
const surfaceRaster={archive:'jakarta-1991.jpg',tv:'crt.jpg',games:'permainan-tradisional.jpg',objects:'cassette.jpg',timeline:'pager.jpg',warung:'warung.jpg',ramadan:'ramadan.jpg',music:'cassette.jpg',quiz:'camera.jpg',collection:'bobo-logo.png',school:'dr-grip.jpg'};
for(const [id,file] of Object.entries(surfaceRaster))rootStyle.setProperty(`--wml-surface-${id}`,runtimeAsset(`assets/media/${file}`));
const textureRaster={paper:'bobo-logo.png',wood:'cassette.jpg',plastic:'gameboy-color.jpg',photo:'camera.jpg',crt:'crt.jpg'};
for(const [id,file] of Object.entries(textureRaster))rootStyle.setProperty(`--wml-texture-${id}`,runtimeAsset(`assets/media/${file}`));
const pageRaster={intro:'jakarta-1991.jpg',onboarding:'camera.jpg','time-machine':'pager.jpg',search:'bobo-logo.png',collection:'cassette.jpg',campaign:'permainan-tradisional.jpg',settings:'floppy.jpg',social:'warung.jpg',contextual:'camera.jpg',moderation:'bobo-logo.png',recovery:'crt.jpg',season:'ramadan.jpg',culture:'permainan-tradisional.jpg','memory-card':'camera.jpg','archive-loading':'jakarta-1991.jpg','memory-wall':'warung.jpg'};
for(const [id,file] of Object.entries(pageRaster))rootStyle.setProperty(`--wml-page-${id}`,runtimeAsset(`assets/media/${file}`));

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

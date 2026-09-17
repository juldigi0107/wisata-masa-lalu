import {useEffect,useState} from 'react';
import {createPortal} from 'react-dom';

const BASE=import.meta.env.BASE_URL||'/';
const SURFACES=[
 ['.time-intro','intro'],['.onboarding','onboarding'],['.moderation-shell','moderation'],['.fatal-shell','recovery'],
 ['.archive-mode .context-entry-page','contextual'],['.archive-failure','archive-failure'],['.archive-loading','archive-loading'],['.archive-mode','archive'],
 ['.social-memory-panel','social'],['.season-panel','season'],['.settings-panel','settings'],['.campaign-panel','campaign'],
 ['.search-panel','search'],['.collection-panel','collection'],['.time-machine-panel','time-machine'],['.ambient-event','ambient-event'],
 ['.interaction-drawer','object-lens'],['.world-app','world']
];

function detectSurface(){
 for(const [selector,id] of SURFACES)if(document.querySelector(selector))return id;
 return 'boot';
}

export default function FlagshipRuntimeV8(){
 const [active,setActive]=useState(false);
 useEffect(()=>{
  for(const [id,file] of [['wml-flagship-v8-css','flagship-v8.css'],['wml-flagship-v9-css','flagship-v9.css'],['wml-flagship-v10-css','flagship-v10.css'],['wml-flagship-v11-css','flagship-v11.css'],['wml-flagship-v12-css','flagship-v12.css']]){
   if(document.getElementById(id))continue;
   const link=document.createElement('link');link.id=id;link.rel='stylesheet';link.href=`${BASE}assets/${file}`;document.head.appendChild(link);
  }
 },[]);
 useEffect(()=>{
  let frame=0;
  const sync=()=>{frame=0;const surface=detectSurface();document.documentElement.dataset.wmlSurface=surface;setActive(surface!=='boot')};
  const schedule=()=>{if(!frame)frame=requestAnimationFrame(sync)};
  sync();const observer=new MutationObserver(schedule);observer.observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['class']});
  return()=>{observer.disconnect();if(frame)cancelAnimationFrame(frame);delete document.documentElement.dataset.wmlSurface};
 },[]);
 useEffect(()=>{
  if(!window.matchMedia?.('(pointer:fine)').matches||window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)return;
  let frame=0,last=null;
  const paint=()=>{frame=0;if(!last)return;const nx=last.clientX/window.innerWidth-.5,ny=last.clientY/window.innerHeight-.5;const root=document.documentElement.style;root.setProperty('--flagship-x',`${last.clientX}px`);root.setProperty('--flagship-y',`${last.clientY}px`);root.setProperty('--flagship-nx',nx.toFixed(4));root.setProperty('--flagship-ny',ny.toFixed(4))};
  const move=event=>{last=event;if(!frame)frame=requestAnimationFrame(paint)};
  const reset=()=>{const root=document.documentElement.style;root.setProperty('--flagship-nx','0');root.setProperty('--flagship-ny','0')};
  window.addEventListener('pointermove',move,{passive:true});window.addEventListener('blur',reset);document.addEventListener('mouseleave',reset);
  return()=>{window.removeEventListener('pointermove',move);window.removeEventListener('blur',reset);document.removeEventListener('mouseleave',reset);if(frame)cancelAnimationFrame(frame)};
 },[]);
 if(!active||typeof document==='undefined')return null;
 return createPortal(<div className="flagship-runtime-v8" aria-hidden="true"><i className="flagship-cursor-light"/><i className="flagship-vignette"/><i className="flagship-optical-noise"/><i className="flagship-edge-frame"/></div>,document.body);
}

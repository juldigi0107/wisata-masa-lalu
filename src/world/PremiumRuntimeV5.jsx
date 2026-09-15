import {useEffect,useRef,useState} from 'react';
import {createPortal} from 'react-dom';

const SCENES=['rumah','kampung','sekolah','kota','digital'];
const PHASES=['pagi','siang','sore','malam'];
const MODES=['normal','ramadan','agustusan'];

function readWorldState(){
 const sceneNode=document.querySelector('.world-scene');
 const appNode=document.querySelector('.world-app');
 if(!sceneNode||!appNode)return {active:false,host:null,scene:'rumah',phase:'siang',mode:'normal',year:1995};
 const scene=SCENES.find(id=>sceneNode.classList.contains(`scene-${id}`))||'rumah';
 const phase=PHASES.find(id=>sceneNode.classList.contains(`phase-${id}`))||'siang';
 const mode=MODES.find(id=>sceneNode.classList.contains(`mode-${id}`))||'normal';
 let year=1995;
 try{
  const stored=JSON.parse(localStorage.getItem('wml-v3-profile')||'null');
  const candidate=Number(new URL(window.location.href).searchParams.get('year')||stored?.year);
  if(candidate>=1990&&candidate<=1999)year=candidate;
 }catch{}
 return {active:true,host:appNode,scene,phase,mode,year};
}

export default function PremiumRuntimeV5(){
 const [state,setState]=useState(()=>({active:false,host:null,scene:'rumah',phase:'siang',mode:'normal',year:1995}));
 const stateKey=useRef('');
 const lastScene=useRef(null);
 const lastMode=useRef(null);
 useEffect(()=>{
  let transitionTimer=0;
  let seasonTimer=0;
  const sync=()=>{
   const next=readWorldState();
   if(next.active){
    const node=document.querySelector('.world-scene');
    if(lastScene.current&&next.scene!==lastScene.current&&node){
     node.classList.remove('premium-scene-entering');
     void node.offsetWidth;
     node.classList.add('premium-scene-entering');
     clearTimeout(transitionTimer);
     transitionTimer=window.setTimeout(()=>node.classList.remove('premium-scene-entering'),900);
    }
    if(lastMode.current&&next.mode!==lastMode.current){
     const app=document.querySelector('.world-app');
     if(app){
      app.classList.remove('premium-season-shift');
      void app.offsetWidth;
      app.classList.add('premium-season-shift');
      clearTimeout(seasonTimer);
      seasonTimer=window.setTimeout(()=>app.classList.remove('premium-season-shift'),1050);
     }
    }
    lastScene.current=next.scene;
    lastMode.current=next.mode;
   }else{
    lastScene.current=null;
    lastMode.current=null;
   }
   const key=`${next.active}|${next.scene}|${next.phase}|${next.mode}|${next.year}|${Boolean(next.host)}`;
   if(stateKey.current===key)return;
   stateKey.current=key;
   setState(next);
  };
  sync();
  const observer=new MutationObserver(sync);
  observer.observe(document.documentElement,{subtree:true,attributes:true,childList:true,attributeFilter:['class']});
  window.addEventListener('popstate',sync);
  const interval=window.setInterval(sync,10000);
  return()=>{observer.disconnect();window.removeEventListener('popstate',sync);clearInterval(interval);clearTimeout(transitionTimer);clearTimeout(seasonTimer)};
 },[]);
 if(!state.active||!state.host)return null;
 return createPortal(<div className={`premium-runtime premium-${state.scene} premium-${state.phase} premium-${state.mode}`} aria-hidden="true">
  <div className="premium-lightfield"/>
  <div className="premium-atmospheric-depth"/>
  <div className="premium-season-motif"/>
  <div className="premium-optical-frame"/>
  <span className="premium-era-mark">{state.year} / INDONESIA</span>
 </div>,state.host);
}

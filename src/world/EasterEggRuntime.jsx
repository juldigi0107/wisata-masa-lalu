import {useEffect,useRef,useState} from 'react';
import {createPortal} from 'react-dom';
import {easterEggFor,easterEggCount,objectIdFromLabel} from '../../shared/easter-eggs.js';

const STORAGE='wml-easter-eggs-v1';
const read=()=>{try{return JSON.parse(localStorage.getItem(STORAGE)||'null')||{counts:{},unlocked:[]}}catch{return{counts:{},unlocked:[]}}};
const save=value=>{try{localStorage.setItem(STORAGE,JSON.stringify(value))}catch{}};
function activeScene(){const node=document.querySelector('.world-scene');if(!node)return null;for(const id of ['rumah','kampung','sekolah','kota','digital'])if(node.classList.contains(`scene-${id}`))return id;return null}

export default function EasterEggRuntime(){
 const [secret,setSecret]=useState(null);const [host,setHost]=useState(null);const timer=useRef(null);
 useEffect(()=>{
  const syncHost=()=>setHost(document.querySelector('.world-app'));
  syncHost();const observer=new MutationObserver(syncHost);observer.observe(document.documentElement,{childList:true,subtree:true});
  function click(event){
   const button=event.target.closest?.('.scene-object');if(!button)return;
   const scene=activeScene();const label=button.querySelector('em')?.textContent?.trim();const object=objectIdFromLabel(scene,label);if(!scene||!object)return;
   const state=read(),key=`${scene}:${object}`,count=Number(state.counts[key]||0)+1;state.counts[key]=count;
   const found=easterEggFor(scene,object,count);
   if(found&&!state.unlocked.includes(found.id)){
    state.unlocked.push(found.id);setSecret({...found,unlocked:state.unlocked.length,total:easterEggCount});clearTimeout(timer.current);timer.current=setTimeout(()=>setSecret(null),5200);
   }
   save(state);
  }
  document.addEventListener('click',click,true);
  return()=>{observer.disconnect();document.removeEventListener('click',click,true);clearTimeout(timer.current)}
 },[]);
 if(!host||!secret)return null;
 return createPortal(<aside className="secret-memory" role="status" aria-live="polite"><small>SECRET MEMORY · TIER {secret.tier}</small><b>{secret.label}</b><p>{secret.message}</p><span>{secret.unlocked}/{secret.total} rahasia ditemukan</span><button onClick={()=>setSecret(null)} aria-label="Tutup secret memory">×</button></aside>,host);
}

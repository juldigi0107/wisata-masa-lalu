import {useEffect} from 'react';
import {scenes} from '../../shared/world-model.js';

const BASE=import.meta.env.BASE_URL||'/';
const byLabel=new Map(Object.values(scenes).flatMap(scene=>scene.objects.map(object=>[object.label,{scene:scene.id,id:object.id}])));

export default function ObjectLensVisualRuntimeV7(){
 useEffect(()=>{
  function sync(){
   const drawer=document.querySelector('.interaction-drawer');
   if(!drawer)return;
   const label=drawer.querySelector('h3')?.textContent?.trim();const hit=byLabel.get(label);
   if(!hit){drawer.classList.remove('has-object-raster');drawer.style.removeProperty('--wml-object-lens-image');return}
   drawer.classList.add('has-object-raster');drawer.style.setProperty('--wml-object-lens-image',`url("${BASE}assets/generated/objects/${hit.scene}-${hit.id}.webp")`);
  }
  sync();const observer=new MutationObserver(sync);observer.observe(document.documentElement,{subtree:true,childList:true,characterData:true});
  return()=>observer.disconnect();
 },[]);
 return null;
}

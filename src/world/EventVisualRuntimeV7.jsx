import {useEffect} from 'react';

const rules=[
 {match:/hujan/i,className:'runtime-hujan'},
 {match:/mati lampu/i,className:'runtime-blackout'},
 {match:/magrib/i,className:'runtime-magrib'},
 {match:/semut|static/i,className:'runtime-tv-static'},
 {match:/layangan/i,className:'runtime-layangan'},
 {match:/pedagang/i,className:'runtime-pedagang'}
];
const classes=rules.map(rule=>rule.className);

export default function EventVisualRuntimeV7(){
 useEffect(()=>{
  function sync(){
   const app=document.querySelector('.world-app'),scene=document.querySelector('.world-scene'),event=document.querySelector('.ambient-event');
   if(!app||!scene)return;
   scene.classList.remove(...classes);
   if(!event)return;
   const text=event.textContent||'';const found=rules.find(rule=>rule.match.test(text));if(found)scene.classList.add(found.className);
  }
  sync();const observer=new MutationObserver(sync);observer.observe(document.documentElement,{subtree:true,childList:true,characterData:true});
  return()=>{observer.disconnect();document.querySelector('.world-scene')?.classList.remove(...classes)};
 },[]);
 return null;
}

import {useEffect,useRef} from 'react';

const STORAGE='wml-v3-profile';
const sceneCue={
 rumah:{min:8500,max:14500,kind:'home'},
 kampung:{min:7000,max:12500,kind:'kampung'},
 sekolah:{min:9000,max:15500,kind:'school'},
 kota:{min:6500,max:11500,kind:'city'},
 digital:{min:7500,max:13000,kind:'digital'}
};
const MODES=['ramadan','lebaran','agustusan','minggu','malam-minggu'];

function readSettings(){
 try{
  const value=JSON.parse(localStorage.getItem(STORAGE)||'null')?.settings||{};
  return {mute:Boolean(value.mute),master:Number.isFinite(Number(value.master))?Number(value.master):.7,ambience:Number.isFinite(Number(value.ambience))?Number(value.ambience):.55};
 }catch{return {mute:false,master:.7,ambience:.55}}
}
function activeEnvironment(){
 const node=document.querySelector('.world-scene');
 if(!node)return null;
 const scene=Object.keys(sceneCue).find(id=>node.classList.contains(`scene-${id}`))||null;
 const mode=MODES.find(id=>node.classList.contains(`mode-${id}`))||'normal';
 const phase=node.classList.contains('phase-malam')?'malam':node.classList.contains('phase-sore')?'sore':node.classList.contains('phase-pagi')?'pagi':'siang';
 return scene?{scene,mode,phase}:null;
}
function nextDelay(config){return config.min+Math.random()*(config.max-config.min)}

export default function AmbientRuntimeV4(){
 const ctxRef=useRef(null);const timerRef=useRef(null);const armedRef=useRef(false);const mountedRef=useRef(true);
 useEffect(()=>{
  mountedRef.current=true;
  const AudioContext=window.AudioContext||window.webkitAudioContext;
  if(!AudioContext)return()=>{};

  function getContext(){
   if(!armedRef.current)return null;
   try{
    if(!ctxRef.current||ctxRef.current.state==='closed')ctxRef.current=new AudioContext();
    if(ctxRef.current.state==='suspended')ctxRef.current.resume().catch(()=>{});
    return ctxRef.current;
   }catch{return null}
  }
  function level(){const settings=readSettings();if(settings.mute||settings.master<=0||settings.ambience<=0)return 0;return Math.min(.018,Math.max(0,.012*settings.master*settings.ambience))}
  function tone(freq,duration=.08,type='sine',gainScale=1,delay=0){
   const c=getContext(),gain=level()*gainScale;if(!c||!gain)return;
   try{const osc=c.createOscillator(),g=c.createGain(),start=c.currentTime+delay;osc.type=type;osc.frequency.setValueAtTime(freq,start);g.gain.setValueAtTime(.0001,start);g.gain.exponentialRampToValueAtTime(gain,start+.01);g.gain.exponentialRampToValueAtTime(.0001,start+duration);osc.connect(g);g.connect(c.destination);osc.start(start);osc.stop(start+duration+.02)}catch{}
  }
  function noise(duration=.15,gainScale=.5){
   const c=getContext(),gain=level()*gainScale;if(!c||!gain)return;
   try{const length=Math.max(1,Math.floor(c.sampleRate*duration)),buffer=c.createBuffer(1,length,c.sampleRate),data=buffer.getChannelData(0);for(let i=0;i<length;i++)data[i]=(Math.random()*2-1)*(1-i/length);const source=c.createBufferSource(),g=c.createGain();source.buffer=buffer;g.gain.value=gain;source.connect(g);g.connect(c.destination);source.start()}catch{}
  }
  function seasonalAccent(mode,phase){
   if(mode==='ramadan'){
    tone(392,.16,'sine',.18,.04);tone(523,.22,'sine',.12,.16);if(phase==='malam'||phase==='sore')tone(659,.28,'sine',.08,.31);return;
   }
   if(mode==='lebaran'){
    tone(523,.1,'sine',.14,.02);tone(659,.12,'sine',.11,.13);tone(784,.16,'sine',.08,.27);return;
   }
   if(mode==='agustusan'){
    tone(124,.06,'triangle',.22,.02);tone(156,.05,'triangle',.17,.1);tone(124,.05,'triangle',.14,.18);return;
   }
   if(mode==='minggu'){
    tone(740,.04,'sine',.11,.02);tone(980,.04,'sine',.08,.14);return;
   }
   if(mode==='malam-minggu'){
    tone(220,.11,'triangle',.12,.03);tone(330,.08,'sine',.08,.18);return;
   }
  }
  function play(kind,mode,phase){
   if(document.visibilityState!=='visible'||document.querySelector('.archive-mode'))return;
   if(kind==='home'){tone(92,.12,'sine',.34);tone(760,.025,'square',.2,.16)}
   else if(kind==='kampung'){tone(1180,.055,'sine',.46);tone(1540,.045,'sine',.38,.08)}
   else if(kind==='school'){tone(690,.18,'sine',.42);tone(1035,.13,'sine',.25,.02)}
   else if(kind==='city'){noise(.12,.34);tone(165,.08,'sine',.26,.04)}
   else if(kind==='digital'){tone(74,.12,'square',.22);tone(112,.08,'square',.16,.13)}
   if(phase==='malam'&&kind!=='digital')tone(210,.12,'sine',.08,.34);
   seasonalAccent(mode,phase);
  }
  function schedule(){
   clearTimeout(timerRef.current);
   if(!mountedRef.current)return;
   const env=activeEnvironment();
   if(!env){timerRef.current=setTimeout(schedule,3000);return}
   const config=sceneCue[env.scene];
   timerRef.current=setTimeout(()=>{play(config.kind,env.mode,env.phase);schedule()},nextDelay(config));
  }
  function arm(){
   if(armedRef.current)return;
   armedRef.current=true;
   const c=getContext();c?.resume?.().catch(()=>{});
   schedule();
  }
  window.addEventListener('pointerdown',arm,{once:true,passive:true});
  window.addEventListener('keydown',arm,{once:true});
  schedule();
  return()=>{
   mountedRef.current=false;clearTimeout(timerRef.current);
   window.removeEventListener('pointerdown',arm);window.removeEventListener('keydown',arm);
   ctxRef.current?.close?.().catch?.(()=>{});
  };
 },[]);
 return null;
}

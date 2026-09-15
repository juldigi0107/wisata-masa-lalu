import {useEffect,useState} from 'react';
import WorldAppV4 from './WorldAppV4.jsx';
import SocialMemoryPanel from './SocialMemoryPanel.jsx';

function currentContext(){
 const params=new URLSearchParams(window.location.search);
 const year=Number(params.get('year'));
 const scene=params.get('scene')||'rumah';
 return {year:Number.isFinite(year)&&year>=1990&&year<=1999?year:1995,scene};
}

export default function WorldExperienceShell(){
 const [ready,setReady]=useState(false);const [open,setOpen]=useState(false);const [context,setContext]=useState(()=>typeof window==='undefined'?{year:1995,scene:'rumah'}:currentContext());
 useEffect(()=>{const refresh=()=>setReady(Boolean(document.querySelector('.world-app')));refresh();const observer=new MutationObserver(refresh);observer.observe(document.getElementById('root'),{childList:true,subtree:true});return()=>observer.disconnect()},[]);
 function showMemory(){setContext(currentContext());setOpen(true)}
 return <><WorldAppV4/>{ready&&!open&&<button className="memory-wall-orb" onClick={showMemory} aria-label="Buka Dinding Memori dan Kapsul Waktu"><span>MEMORY</span><b>Kenanganmu</b><i>✦</i></button>}{open&&<SocialMemoryPanel year={context.year} scene={context.scene} onClose={()=>setOpen(false)}/>}</>;
}

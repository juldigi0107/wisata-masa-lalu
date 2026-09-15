import {useEffect,useState} from 'react';
import WorldAppV4 from './WorldAppV4.jsx';
import SocialMemoryPanel from './SocialMemoryPanel.jsx';
import ModerationPanel from './ModerationPanel.jsx';

function params(){return new URLSearchParams(window.location.search)}
function currentContext(){
 const query=params();const year=Number(query.get('year'));const scene=query.get('scene')||'rumah';
 return {year:Number.isFinite(year)&&year>=1990&&year<=1999?year:1995,scene};
}
function adminRoute(){return typeof window!=='undefined'&&params().get('admin')==='memories'}

export default function WorldExperienceShell(){
 const [ready,setReady]=useState(false);const [open,setOpen]=useState(false);const [admin,setAdmin]=useState(()=>adminRoute());const [context,setContext]=useState(()=>typeof window==='undefined'?{year:1995,scene:'rumah'}:currentContext());
 useEffect(()=>{const refresh=()=>setReady(Boolean(document.querySelector('.world-app')));refresh();const observer=new MutationObserver(refresh);observer.observe(document.getElementById('root'),{childList:true,subtree:true});return()=>observer.disconnect()},[]);
 useEffect(()=>{const sync=()=>setAdmin(adminRoute());window.addEventListener('popstate',sync);return()=>window.removeEventListener('popstate',sync)},[]);
 function showMemory(){setContext(currentContext());setOpen(true)}
 function closeAdmin(){const url=new URL(window.location.href);url.searchParams.delete('admin');window.history.replaceState(window.history.state,'',url.href);setAdmin(false)}
 return <><WorldAppV4/>{ready&&!open&&!admin&&<button className="memory-wall-orb" onClick={showMemory} aria-label="Buka Dinding Memori dan Kapsul Waktu"><span>MEMORY</span><b>Kenanganmu</b><i>✦</i></button>}{open&&!admin&&<SocialMemoryPanel year={context.year} scene={context.scene} onClose={()=>setOpen(false)}/>} {admin&&<ModerationPanel onClose={closeAdmin}/>}</>;
}

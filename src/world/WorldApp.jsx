import {useEffect,useMemo,useRef,useState} from 'react';
import LegacyArchive from '../App.jsx';
import catalog from '../../shared/assembled-catalog.js';
import {memoryTriggers,getTrigger} from '../../shared/memory-triggers.js';
import {mechanicFamilyFor} from '../../shared/mechanic-registry.js';
import {
 scenes,years,yearWorldState,nostalgiaProfiles,onboardingChoices,dayCampaign,weightedRandomEvent,
 collections,achievements,getScene,getWorldTrigger,worldVersion
} from '../../shared/world-model.js';
import SpecialMechanic from './SpecialMechanics.jsx';
import ContextualArchivePage from './ContextualArchivePage.jsx';
import './world.css';

const STORAGE='wml-v3-profile';
const clamp=(value,min,max)=>Math.min(max,Math.max(min,value));
const pseudoRandomFromDate=()=>{
 const value=new Date().toISOString().slice(0,10).replaceAll('-','');
 let seed=Number(value)%2147483647;
 seed=seed*16807%2147483647;
 return (seed-1)/2147483646;
};

const contextualMap={
 'wartel':'wartel-1990','billing-wartel':'wartel-1990','pager':'pager-motorola-90an',
 'dialup-modem':'indonet-internet-komersial-1994','internet-disconnect':'indonet-internet-komersial-1994',
 'warnet-billing':'apjii-1996','boot-pc':'windows-95-indonesia','disket-144':'windows-95-indonesia',
 'floppy-corrupt':'windows-95-indonesia','homepage-pribadi':'apjii-1996','chat-room':'apjii-1996',
 'radio-tuner':'kla-project-yogyakarta','tape-recorder':'dewa-19','walkman-simulator':'sony-minidisc-1992',
 'tv-tabung':'si-doel','jadwal-tv-koran':'si-doel','virtual-pet':'tamagotchi','bentengan':'benteng-bentengan',
 'layangan-putus':'layang-layang-rakyat','kelereng':'kelereng','kantin':'tehbotol-sosro',
 'mesin-arcade':'game-boy-color','kamera-36-frame':'olga-dan-sepatu-roda','magrib':'lorong-waktu'
};

function loadProfile(){
 try{return JSON.parse(localStorage.getItem(STORAGE)||'null')}catch{return null}
}
function persistProfile(profile){
 try{localStorage.setItem(STORAGE,JSON.stringify(profile))}catch{}
}

function useSynthAudio(settings){
 const ctxRef=useRef(null);
 useEffect(()=>()=>{ctxRef.current?.close?.()},[]);
 async function ctx(){
  if(settings.mute||settings.master<=0)return null;
  const AC=window.AudioContext||window.webkitAudioContext;
  if(!AC)return null;
  ctxRef.current??=new AC();
  await ctxRef.current.resume();
  return ctxRef.current;
 }
 async function tone(freq=240,duration=.08,type='sine',gain=.025){
  const c=await ctx();if(!c)return;
  const osc=c.createOscillator(),g=c.createGain();
  osc.type=type;osc.frequency.setValueAtTime(freq,c.currentTime);
  g.gain.setValueAtTime(gain*settings.master*settings.ui,c.currentTime);
  g.gain.exponentialRampToValueAtTime(.0001,c.currentTime+duration);
  osc.connect(g);g.connect(c.destination);osc.start();osc.stop(c.currentTime+duration);
 }
 async function noise(duration=.25,gain=.012){
  const c=await ctx();if(!c)return;
  const length=Math.floor(c.sampleRate*duration);const buffer=c.createBuffer(1,length,c.sampleRate);const data=buffer.getChannelData(0);
  for(let i=0;i<length;i++)data[i]=(Math.random()*2-1)*(1-i/length);
  const source=c.createBufferSource(),g=c.createGain();source.buffer=buffer;g.gain.value=gain*settings.master*settings.ambience;source.connect(g);g.connect(c.destination);source.start();
 }
 async function cue(kind){
  if(kind==='dialup'){await tone(620,.12,'square',.02);setTimeout(()=>tone(980,.16,'sawtooth',.018),90);setTimeout(()=>noise(.35,.018),190);return;}
  if(kind==='phone'){await tone(440,.14,'sine',.018);setTimeout(()=>tone(480,.14,'sine',.018),160);return;}
  if(kind==='tv'||kind==='signal'){await noise(.12,.018);setTimeout(()=>tone(96,.08,'square',.012),60);return;}
  if(kind==='cassette'||kind==='vhs'){await tone(120,.06,'square',.012);setTimeout(()=>tone(85,.08,'square',.01),65);return;}
  if(kind==='arcade'){await tone(880,.06,'square',.02);setTimeout(()=>tone(1320,.07,'square',.018),70);return;}
  if(kind==='bell'){await tone(730,.28,'sine',.025);return;}
  await tone(320,.07,'square',.018);
 }
 return {tone,noise,cue};
}

function Intro({onDone}){
 const [step,setStep]=useState(0);
 const labels=['2026','2010','2000','1999','SELAMAT DATANG KEMBALI'];
 useEffect(()=>{
  if(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches){setStep(labels.length-1);return;}
  const timer=setInterval(()=>setStep(value=>{
   if(value>=labels.length-1){clearInterval(timer);return value}
   return value+1;
  }),620);
  return()=>clearInterval(timer);
 },[]);
 return <div className="time-intro" role="dialog" aria-modal="true" aria-label="Mesin waktu">
  <div className="intro-noise"/>
  <p>WISATA MASA LALU / TIME MACHINE</p>
  <div className="intro-year" key={step}>{labels[step]}</div>
  <span>{step<4?'Kalender bergerak mundur…':'Indonesia, tahun 1990-an.'}</span>
  {step>=4&&<button onClick={onDone}>MASUK KE 90-AN ↘</button>}
  <button className="intro-skip" onClick={onDone}>Lewati intro</button>
 </div>;
}

function Onboarding({onChoose}){
 return <main className="onboarding">
  <div className="onboarding-paper">
   <p className="world-eyebrow">SATU PERTANYAAN SAJA</p>
   <h1>Kamu paling ingat<br/>masa 90-an sebagai…</h1>
   <p className="onboarding-hint">Tidak ada tutorial panjang. Pilih yang paling terasa familiar. Nanti cukup sentuh benda yang kamu kenal.</p>
   <div className="profile-choices">
    {onboardingChoices.map(choice=><button key={choice.id} onClick={()=>onChoose(choice.id)}>{choice.label}<span>↘</span></button>)}
   </div>
  </div>
 </main>;
}

function SceneObject({item,active,onOpen,intensity}){
 return <button
  className={`scene-object ${active?'active':''} intensity-${intensity}`}
  style={{'--x':`${item.x}%`,'--y':`${item.y}%`}}
  onClick={()=>onOpen(item)} aria-label={`${item.label}. ${item.hint}`}
 >
  <span className="object-pulse"/><b>{item.icon}</b><em>{item.label}</em><small>{item.hint}</small>
 </button>;
}

function Scene({scene,activeObject,onOpen,intensity,dayPhase,specialMode}){
 const phase=dayPhase?.toLocaleLowerCase('id')||'sore';
 return <section className={`world-scene scene-${scene.id} phase-${phase} mode-${specialMode||'normal'}`} aria-label={scene.label}>
  <div className="scene-sky"/><div className="scene-ground"/><div className="scene-architecture"/>
  <div className="scene-grain" aria-hidden="true"/>
  {scene.objects.map(item=><SceneObject key={item.id} item={item} active={activeObject?.id===item.id} onOpen={onOpen} intensity={intensity}/>)}
  <div className="scene-caption"><small>{scene.eyebrow}</small><h2>{scene.label}</h2><p>{scene.description}</p></div>
 </section>;
}

function SliderMechanic({label='Geser sampai pas',onComplete}){
 const [value,setValue]=useState(22);
 const good=value>=44&&value<=60;
 return <div className="mechanic-box"><p>{label}</p><input type="range" min="0" max="100" value={value} onChange={e=>setValue(Number(e.target.value))}/><div className={`meter ${good?'good':''}`}><i style={{width:`${value}%`}}/></div><button disabled={!good} onClick={onComplete}>{good?'Sinyal stabil — simpan':'Cari titik yang stabil'}</button></div>;
}
function TimingMechanic({onComplete}){
 const [value,setValue]=useState(0);const [direction,setDirection]=useState(1);const [locked,setLocked]=useState(false);
 useEffect(()=>{if(locked)return;const timer=setInterval(()=>setValue(v=>{const next=v+direction*4;if(next>=100){setDirection(-1);return 100}if(next<=0){setDirection(1);return 0}return next}),45);return()=>clearInterval(timer)},[direction,locked]);
 const score=Math.round(100-Math.abs(52-value)*1.9);
 return <div className="mechanic-box"><p>Tekan saat indikator masuk zona tengah.</p><div className="timing-track"><i style={{left:`${value}%`}}/></div><button onClick={()=>{setLocked(true);if(score>62)onComplete(score);else setTimeout(()=>setLocked(false),350)}}>{locked?`Timing ${score}`:'TEKAN'}</button></div>;
}
function ComposeMechanic({onComplete,type='pesan'}){
 const [text,setText]=useState('');return <div className="mechanic-box"><label>Tulis {type}<textarea maxLength="160" value={text} onChange={e=>setText(e.target.value)} placeholder="Tulis singkat seperti dulu…"/></label><button disabled={text.trim().length<3} onClick={()=>onComplete(text.trim())}>Lipat & simpan ↘</button></div>;
}
function ChoiceMechanic({onComplete}){
 return <div className="mechanic-box choice-grid"><button onClick={()=>onComplete('iya')}>IYA, PERNAH</button><button onClick={()=>onComplete('tidak')}>TIDAK / LUPA</button></div>;
}
function FindMechanic({onComplete}){
 const [tries,setTries]=useState(0);const target=3;
 return <div className="mechanic-box"><p>Cari di tiga tempat. Salah satu menyimpan kejutan.</p><div className="find-grid">{['bawah meja','sela sofa','balik majalah','atas lemari'].map((spot,index)=><button key={spot} disabled={tries>0&&index!==target} onClick={()=>{setTries(t=>t+1);if(index===target)onComplete(90)}}>{spot}</button>)}</div><small>{tries?`${tries} tempat sudah dicek.`:'Mulai mencari.'}</small></div>;
}
function DialMechanic({onComplete}){
 const [value,setValue]=useState(50);return <div className="mechanic-box"><p>Putar dial perlahan.</p><input className="dial-range" type="range" min="0" max="100" value={value} onChange={e=>setValue(Number(e.target.value))}/><output>{value<30?'noise…':value<65?'hampir dapat…':'jernih ✦'}</output><button disabled={value<65} onClick={()=>onComplete(value)}>KUNCI FREKUENSI</button></div>;
}
function PhoneMechanic({onComplete}){
 const [number,setNumber]=useState('');return <div className="mechanic-box phone-mechanic"><div className="phone-display">{number||'— — — — — — —'}</div><div className="phone-pad">{['1','2','3','4','5','6','7','8','9','*','0','#'].map(n=><button key={n} onClick={()=>setNumber(value=>(value+n).slice(0,10))}>{n}</button>)}</div><button disabled={number.length<5} onClick={()=>onComplete(number)}>HUBUNGI</button></div>;
}
function BillingMechanic({onComplete}){
 const [seconds,setSeconds]=useState(0);const [running,setRunning]=useState(false);
 useEffect(()=>{if(!running)return;const timer=setInterval(()=>setSeconds(s=>s+1),500);return()=>clearInterval(timer)},[running]);
 return <div className="mechanic-box"><div className="billing-screen"><span>DURASI</span><b>{String(Math.floor(seconds/60)).padStart(2,'0')}:{String(seconds%60).padStart(2,'0')}</b><span>BIAYA SIMULASI</span><strong>Rp {seconds*125}</strong></div><div className="row-actions"><button onClick={()=>setRunning(true)} disabled={running}>MULAI</button><button onClick={()=>{setRunning(false);onComplete(seconds)}} disabled={seconds<3}>SELESAI</button></div></div>;
}
function ChatMechanic({onComplete}){
 const [messages,setMessages]=useState([{from:'operator90',text:'halo, baru masuk?'}]);const [text,setText]=useState('');
 function send(){if(!text.trim())return;setMessages(m=>[...m,{from:'kamu',text:text.trim()},{from:'anak_warnet',text:'hehe iya, salam dari bilik sebelah :D'}]);setText('');if(messages.length>=2)onComplete('chat')}
 return <div className="mechanic-box chat-box"><div className="chat-log">{messages.map((m,i)=><p key={i}><b>{m.from}:</b> {m.text}</p>)}</div><div className="chat-input"><input value={text} maxLength="80" onChange={e=>setText(e.target.value)} onKeyDown={e=>{if(e.key==='Enter')send()}}/><button onClick={send}>KIRIM</button></div></div>;
}
function RepairMechanic({onComplete}){
 const [progress,setProgress]=useState(0);return <div className="mechanic-box"><p>Putar perlahan. Jangan terlalu cepat.</p><button className="repair-wheel" onClick={()=>setProgress(p=>clamp(p+17,0,100))}>↻</button><div className="meter"><i style={{width:`${progress}%`}}/></div><button disabled={progress<100} onClick={()=>onComplete(progress)}>RAPIKAN PITA</button></div>;
}
function ArcadeMechanic({onComplete}){
 const [score,setScore]=useState(0);const [time,setTime]=useState(8);const [running,setRunning]=useState(false);
 useEffect(()=>{if(!running||time<=0)return;const timer=setTimeout(()=>setTime(t=>t-1),500);return()=>clearTimeout(timer)},[running,time]);
 useEffect(()=>{if(running&&time===0){setRunning(false);onComplete(score)}},[running,time,score,onComplete]);
 return <div className="mechanic-box arcade-mechanic"><div><span>TIME {time}</span><b>{String(score).padStart(6,'0')}</b></div><button onClick={()=>{if(!running){setScore(0);setTime(8);setRunning(true)}else setScore(s=>s+125)}}>{running?'HIT!':'INSERT TOKEN'}</button></div>;
}
function BuilderMechanic({onComplete}){
 const [parts,setParts]=useState([]);const options=['judul','warna','stiker','counter'];
 return <div className="mechanic-box"><p>Rakit empat bagian kecil.</p><div className="builder-grid">{options.map(part=><button key={part} className={parts.includes(part)?'selected':''} onClick={()=>setParts(p=>p.includes(part)?p:[...p,part])}>{part}</button>)}</div><button disabled={parts.length<4} onClick={()=>onComplete(parts)}>SIMPAN HASIL</button></div>;
}
function ShopMechanic({onComplete}){
 const items=[['es plastik',500],['permen',100],['snack',750],['minuman',600]];const [money,setMoney]=useState(1500);const [bag,setBag]=useState([]);
 return <div className="mechanic-box"><div className="money-line">Uang saku <b>Rp {money}</b></div><div className="shop-grid">{items.map(([name,price])=><button key={name} disabled={money<price} onClick={()=>{setMoney(m=>m-price);setBag(b=>[...b,name])}}>{name}<small>Rp {price}</small></button>)}</div><button disabled={!bag.length} onClick={()=>onComplete(bag)}>PULANG DENGAN {bag.length} JAJANAN</button></div>;
}
function CameraMechanic({onComplete}){
 const [frames,setFrames]=useState(3);const [shot,setShot]=useState(null);
 function snap(){if(frames<=0)return;setFrames(f=>f-1);setShot(['terlalu gelap','pas!','sedikit blur'][Math.floor(Math.random()*3)])}
 return <div className="mechanic-box camera-mechanic"><div className="camera-view"><span>{shot||'36 EXP / FRAME '+frames}</span></div><button onClick={snap} disabled={frames<=0}>JEPRET</button><button onClick={()=>onComplete(shot)} disabled={!shot}>SIMPAN FRAME</button></div>;
}

function GenericMechanic({trigger,onComplete}){
 const family=mechanicFamilyFor(trigger.mechanic);
 if(family==='slider')return <SliderMechanic onComplete={onComplete}/>;
 if(family==='timing')return <TimingMechanic onComplete={onComplete}/>;
 if(family==='compose')return <ComposeMechanic onComplete={onComplete}/>;
 if(family==='choice')return <ChoiceMechanic onComplete={onComplete}/>;
 if(family==='find')return <FindMechanic onComplete={onComplete}/>;
 if(family==='dial')return <DialMechanic onComplete={onComplete}/>;
 if(family==='phone')return <PhoneMechanic onComplete={onComplete}/>;
 if(family==='billing')return <BillingMechanic onComplete={onComplete}/>;
 if(family==='chat')return <ChatMechanic onComplete={onComplete}/>;
 if(family==='repair')return <RepairMechanic onComplete={onComplete}/>;
 if(family==='arcade')return <ArcadeMechanic onComplete={onComplete}/>;
 if(family==='builder')return <BuilderMechanic onComplete={onComplete}/>;
 if(family==='shop')return <ShopMechanic onComplete={onComplete}/>;
 if(family==='camera')return <CameraMechanic onComplete={onComplete}/>;
 return <SpecialMechanic family={family} trigger={trigger} onComplete={onComplete}/>;
}

function ContextArchive({trigger,onOpenArchive}){
 const mapped=contextualMap[trigger?.id];
 const entry=mapped?catalog.entries.find(item=>item.id===mapped):catalog.entries.find(item=>{
  const haystack=`${item.title} ${(item.tags||[]).join(' ')}`.toLocaleLowerCase('id');
  return haystack.includes(trigger?.object?.toLocaleLowerCase('id')||'__none__');
 });
 if(!entry)return <div className="context-archive muted"><small>ARSIP KONTEKSTUAL</small><p>Belum ada entri sejarah spesifik untuk objek ini. Experience tetap dapat dimainkan tanpa mengarang fakta.</p><button onClick={()=>onOpenArchive(null)}>Buka arsip penuh</button></div>;
 return <div className="context-archive"><small>ARSIP KONTEKSTUAL · {entry.status}</small><h4>{entry.title}</h4><p>{entry.factBox?.text||entry.summary}</p><div className="context-sources">{(entry.sources||[]).slice(0,2).map(source=><a key={source.id} href={source.url} target="_blank" rel="noreferrer">{source.title} ↗</a>)}</div><button onClick={()=>onOpenArchive(entry)}>Buka arsip terkait ↘</button></div>;
}

function InteractionDrawer({object,trigger,onClose,onComplete,onPickTrigger,onOpenArchive}){
 if(!object)return null;
 return <aside className="interaction-drawer" aria-label={`Interaksi ${object.label}`}>
  <button className="drawer-close" onClick={onClose} aria-label="Tutup">×</button>
  <p className="world-eyebrow">SENTUH BENDA / LAKUKAN SESUATU</p>
  <h3>{object.label}</h3>
  <p className="object-hint">{object.hint}</p>
  <div className="trigger-tabs">{object.triggerIds.map(id=>{const item=getTrigger(id);return item?<button key={id} className={trigger?.id===id?'active':''} onClick={()=>onPickTrigger(item)}>{item.title}</button>:null})}</div>
  {trigger&&<>
   <div className="trigger-brief"><span>{String(trigger.no).padStart(3,'0')} / 100</span><b>{trigger.title}</b><p>{trigger.interaction}</p></div>
   <GenericMechanic key={trigger.id} trigger={trigger} onComplete={value=>onComplete(trigger,value)}/>
   <ContextArchive trigger={trigger} onOpenArchive={onOpenArchive}/>
  </>}
 </aside>;
}

function TimeMachine({year,onYear,onClose}){
 return <div className="time-machine-panel" role="dialog" aria-modal="true" aria-label="Mesin waktu 1990 sampai 1999">
  <button className="panel-close" onClick={onClose}>×</button><p className="world-eyebrow">MESIN WAKTU / DEKADE</p><h2>{year}</h2>
  <p>{yearWorldState[year].mood}</p><div className="year-strip">{years.map(y=><button key={y} className={year===y?'active':''} onClick={()=>onYear(y)}>{y}</button>)}</div>
  <div className="year-state"><div><small>TEKNOLOGI</small><b>{yearWorldState[year].tech}</b></div><div><small>MEDIA</small><b>{yearWorldState[year].media}</b></div></div>
  <p className="panel-note">Perubahan tahun memengaruhi mood, rekomendasi, ambient, dan indeks arsip. Experience tidak mengklaim semua benda hilang/muncul tepat pada satu tahun.</p>
 </div>;
}

function CollectionPanel({owned,onClose}){
 return <div className="collection-panel" role="dialog" aria-modal="true"><button className="panel-close" onClick={onClose}>×</button><p className="world-eyebrow">DIGITAL CABINET</p><h2>Koleksi kecilmu.</h2><div className="collection-grid">{collections.map(item=><article key={item.id} className={owned.includes(item.id)?'owned':''}><span>{item.icon}</span><b>{item.label}</b><small>{owned.includes(item.id)?'TERKUMPUL':'BELUM DITEMUKAN'}</small></article>)}</div></div>;
}

function SearchPanel({query,setQuery,onClose,onSelectTrigger,onOpenEntry}){
 const triggerResults=memoryTriggers.filter(item=>`${item.title} ${item.category} ${item.interaction}`.toLocaleLowerCase('id').includes(query.toLocaleLowerCase('id'))).slice(0,8);
 const entryResults=catalog.entries.filter(item=>`${item.title} ${item.summary} ${(item.tags||[]).join(' ')}`.toLocaleLowerCase('id').includes(query.toLocaleLowerCase('id'))).slice(0,8);
 return <div className="search-panel" role="dialog" aria-modal="true"><button className="panel-close" onClick={onClose}>×</button><p className="world-eyebrow">MEMORY SEARCH</p><h2>Cari dari ingatan.</h2><input autoFocus value={query} onChange={e=>setQuery(e.target.value)} placeholder="misal: kaset, wartel, jajanan plastik…"/>
  <div className="search-columns"><section><h3>Pengalaman</h3>{triggerResults.map(item=><button key={item.id} onClick={()=>onSelectTrigger(item)}><b>{item.title}</b><small>{item.category} · {item.scene}</small></button>)}</section><section><h3>Arsip</h3>{entryResults.map(item=><button key={item.id} onClick={()=>onOpenEntry(item)}><b>{item.title}</b><small>{item.type} · {item.status}</small></button>)}</section></div>
 </div>;
}

function CampaignPanel({index,onStep,onClose}){
 const step=dayCampaign[index];return <div className="campaign-panel"><button className="panel-close" onClick={onClose}>×</button><p className="world-eyebrow">SATU HARI DI 90-AN</p><div className="campaign-time">{step.time}</div><h2>{step.phase}</h2><p>{step.prompt}</p><div className="campaign-progress">{dayCampaign.map((_,i)=><i key={i} className={i<=index?'done':''}/>)}</div><div className="row-actions"><button onClick={()=>onStep(Math.max(0,index-1))} disabled={!index}>← Sebelum</button><button onClick={()=>onStep(Math.min(dayCampaign.length-1,index+1))} disabled={index===dayCampaign.length-1}>Berikutnya →</button></div></div>;
}

function SettingsPanel({settings,onChange,onClose}){
 return <div className="settings-panel"><button className="panel-close" onClick={onClose}>×</button><p className="world-eyebrow">AUDIO & ACCESSIBILITY</p><h2>Atur pengalaman.</h2>
  <label>Master volume<input type="range" min="0" max="1" step=".05" value={settings.master} onChange={e=>onChange({...settings,master:Number(e.target.value)})}/></label>
  <label>Ambience<input type="range" min="0" max="1" step=".05" value={settings.ambience} onChange={e=>onChange({...settings,ambience:Number(e.target.value)})}/></label>
  <label>UI sound<input type="range" min="0" max="1" step=".05" value={settings.ui} onChange={e=>onChange({...settings,ui:Number(e.target.value)})}/></label>
  <label className="toggle-line">Mute<input type="checkbox" checked={settings.mute} onChange={e=>onChange({...settings,mute:e.target.checked})}/></label>
  <label>Nostalgia intensity<select value={settings.intensity} onChange={e=>onChange({...settings,intensity:e.target.value})}><option value="ringan">Ringan</option><option value="imersif">Imersif</option><option value="total">Total Nostalgia</option></select></label>
 </div>;
}

export default function WorldApp(){
 const existing=typeof window!=='undefined'?loadProfile():null;
 const [intro,setIntro]=useState(!existing);
 const [profile,setProfile]=useState(existing);
 const [sceneId,setSceneId]=useState(existing?.scene||'rumah');
 const [year,setYear]=useState(existing?.year||1995);
 const [activeObject,setActiveObject]=useState(null);
 const [trigger,setTrigger]=useState(null);
 const [overlay,setOverlay]=useState(null);
 const [searchQuery,setSearchQuery]=useState('');
 const [toast,setToast]=useState('');
 const [event,setEvent]=useState(null);
 const [campaignIndex,setCampaignIndex]=useState(0);
 const [specialMode,setSpecialMode]=useState('normal');
 const [archiveEntry,setArchiveEntry]=useState(null);
 const [settings,setSettings]=useState(existing?.settings||{master:.7,ambience:.55,ui:.75,mute:false,intensity:'imersif'});
 const audio=useSynthAudio(settings);
 const scene=getScene(sceneId);
 const daily=memoryTriggers[Math.floor(pseudoRandomFromDate()*memoryTriggers.length)];
 const completed=profile?.completed||[];
 const owned=profile?.collections||[];
 const visitedScenes=profile?.visitedScenes||[sceneId];
 const visitedYears=profile?.visitedYears||[year];
 const score=profile?.score||0;

 const categoryCounts=useMemo(()=>completed.reduce((acc,id)=>{const item=getWorldTrigger(id);if(item)acc[item.category]=(acc[item.category]||0)+1;return acc},{}),[completed]);
 const evolvedProfile=useMemo(()=>{
  const top=Object.entries(categoryCounts).sort((a,b)=>b[1]-a[1])[0]?.[0];
  const map={televisi:'anak-tv',musik:'anak-musik',komunikasi:'anak-warung',teknologi:'anak-warnet',sekolah:'anak-sekolah',jajanan:'anak-warung',permainan:'anak-lapangan',mainan:'anak-arcade',fotografi:'anak-komik'};
  return nostalgiaProfiles.find(item=>item.id===(map[top]||profile?.type))||nostalgiaProfiles[0];
 },[categoryCounts,profile?.type]);
 const unlockedAchievements=useMemo(()=>achievements.filter(item=>{
  if(item.kind==='scenes')return visitedScenes.length>=item.target;
  if(item.kind==='years')return visitedYears.length>=item.target;
  if(item.category)return (categoryCounts[item.category]||0)>=item.target;
  return false;
 }),[visitedScenes,visitedYears,categoryCounts]);

 useEffect(()=>{
  if(!profile)return;
  const next={...profile,scene:sceneId,year,settings,visitedScenes,visitedYears,completed,collections:owned,score};
  persistProfile(next);
 },[profile,sceneId,year,settings,visitedScenes,visitedYears,completed,owned,score]);
 useEffect(()=>{
  if(!profile)return;
  const timer=setInterval(()=>{
   if(Math.random()<.36){const next=weightedRandomEvent(sceneId);setEvent(next);setToast(next.label);setTimeout(()=>setToast(''),4200)}
  },26000);
  return()=>clearInterval(timer);
 },[profile,sceneId]);
 useEffect(()=>{
  function onKey(event){
   if(event.key!=='Escape')return;
   if(activeObject){setActiveObject(null);setTrigger(null);return;}
   if(overlay){setOverlay(null);setArchiveEntry(null);return;}
   if(event){setEvent(null)}
  }
  window.addEventListener('keydown',onKey);
  return()=>window.removeEventListener('keydown',onKey);
 },[activeObject,overlay,event]);

 function chooseProfile(type){
  const choice=nostalgiaProfiles.find(item=>item.id===type)||nostalgiaProfiles[0];
  const next={type:choice.id,scene:choice.scene,year:1995,completed:[],collections:[],visitedScenes:[choice.scene],visitedYears:[1995],score:0,settings};
  setProfile(next);setSceneId(choice.scene);persistProfile(next);
 }
 function travelScene(next){
  setSceneId(next);setActiveObject(null);setTrigger(null);setOverlay(null);
  setProfile(current=>current?{...current,visitedScenes:[...new Set([...(current.visitedScenes||[]),next])]}:current);
  audio.cue('default');
 }
 function travelYear(next){
  setYear(next);setProfile(current=>current?{...current,visitedYears:[...new Set([...(current.visitedYears||[]),next])]}:current);audio.cue('tv');
 }
 function openObject(item){setActiveObject(item);setTrigger(getTrigger(item.triggerIds[0]));audio.cue(item.id==='tv'?'tv':item.id==='telepon'?'phone':'default')}
 function completeTrigger(item,value){
  const already=completed.includes(item.id);
  const reward=collections[(item.no+completed.length)%collections.length];
  setProfile(current=>current?{
   ...current,
   completed:already?(current.completed||[]):[...(current.completed||[]),item.id],
   collections:(current.collections||[]).includes(reward.id)?(current.collections||[]):[...(current.collections||[]),reward.id],
   score:(current.score||0)+(already?2:item.points)
  }:current);
  setToast(already?`Memori diulang · +2`:`Memori tersimpan · +${item.points} · ${reward.label}`);
  setTimeout(()=>setToast(''),3500);audio.cue(item.mechanic==='arcade'?'arcade':item.mechanic==='phone'?'phone':item.mechanic==='dialup'?'dialup':'default');
 }
 function teleport(){const ids=Object.keys(scenes);travelScene(ids[Math.floor(Math.random()*ids.length)]);setToast('Kamu dilempar ke bagian lain dari 90-an.');setTimeout(()=>setToast(''),2500)}
 function launchTrigger(item){if(!item)return;travelScene(item.scene);const target=getScene(item.scene).objects.find(object=>object.triggerIds.includes(item.id));if(target){setActiveObject(target);setTrigger(item)}}
 function openArchiveForEntry(entry){setArchiveEntry(entry||null);setOverlay('archive')}
 const phase=new Date().getHours()<10?'pagi':new Date().getHours()<15?'siang':new Date().getHours()<18?'sore':'malam';

 if(intro)return <Intro onDone={()=>setIntro(false)}/>;
 if(!profile)return <Onboarding onChoose={chooseProfile}/>;
 if(overlay==='archive')return <div className="archive-mode"><div className="archive-return"><button onClick={()=>{setOverlay(null);setArchiveEntry(null)}}>← Kembali ke dunia</button>{archiveEntry&&<span>Arsip terkait: {archiveEntry.title}</span>}</div>{archiveEntry?<ContextualArchivePage entry={archiveEntry}/>:<LegacyArchive/>}</div>;

 return <div className={`world-app intensity-${settings.intensity}`} style={{'--year-accent':yearWorldState[year].accent}}>
  <a className="world-skip" href="#world-main">Langsung ke dunia</a>
  <header className="world-hud">
   <button className="brand-ticket" onClick={()=>travelScene('rumah')}><span>WISATA MASA LALU</span><b>INDONESIA 90-AN</b></button>
   <div className="hud-status"><span>{year}</span><i/> <span>{scene.label}</span><i/><span>{phase}</span></div>
   <nav aria-label="Kontrol utama"><button onClick={()=>setOverlay('search')}>Cari</button><button onClick={()=>setOverlay('collection')}>Koleksi <sup>{owned.length}</sup></button><button onClick={()=>setOverlay('time')}>{year}</button><button onClick={()=>setOverlay('settings')}>Suara</button></nav>
  </header>

  <main id="world-main">
   <Scene scene={scene} activeObject={activeObject} onOpen={openObject} intensity={settings.intensity} dayPhase={phase} specialMode={specialMode}/>
   <div className="environment-nav" aria-label="Peta lingkungan">{scene.exits.map(id=><button key={id} onClick={()=>travelScene(id)}><span>{scenes[id].eyebrow.split('/')[0]}</span><b>{scenes[id].label}</b></button>)}</div>

   <section className="memory-ribbon">
    <div><small>MEMORI HARI INI</small><b>{daily.title}</b><p>{daily.interaction}</p></div><button onClick={()=>launchTrigger(daily)}>COBA SEKARANG ↘</button>
   </section>

   <section className="experience-dock" aria-label="Mode pengalaman">
    <button onClick={()=>setOverlay('campaign')}><span>06:00—22:00</span><b>Satu Hari di 90-an</b></button>
    <button onClick={teleport}><span>RANDOM</span><b>Bawa Saya ke 90-an</b></button>
    <button onClick={()=>{const next=weightedRandomEvent(sceneId);setEvent(next);launchTrigger(getTrigger(next.trigger))}}><span>MEMORY ENGINE</span><b>Picu kejadian</b></button>
    <button onClick={()=>setSpecialMode(m=>m==='ramadan'?'normal':'ramadan')}><span>SEASON</span><b>{specialMode==='ramadan'?'Keluar Ramadan':'Mode Ramadan'}</b></button>
    <button onClick={()=>setSpecialMode(m=>m==='agustusan'?'normal':'agustusan')}><span>17 AGUSTUS</span><b>{specialMode==='agustusan'?'Mode normal':'Kampung Merdeka'}</b></button>
    <button onClick={()=>openArchiveForEntry(null)}><span>{catalog.entries.length} ENTRI</span><b>Arsip 90-an</b></button>
   </section>

   <section className="profile-strip">
    <div><small>PROFIL NOSTALGIA</small><h3>{evolvedProfile.label}</h3><p>{completed.length}/100 memory triggers disentuh · {visitedScenes.length}/5 area · {visitedYears.length}/10 tahun</p></div>
    <div className="profile-meter"><i style={{width:`${completed.length}%`}}/></div>
    <div className="achievement-mini">{unlockedAchievements.slice(0,3).map(item=><span key={item.id}>{item.label}</span>)}{!unlockedAchievements.length&&<span>Achievement pertama masih menunggu.</span>}</div>
   </section>
  </main>

  <InteractionDrawer object={activeObject} trigger={trigger} onClose={()=>{setActiveObject(null);setTrigger(null)}} onComplete={completeTrigger} onPickTrigger={setTrigger} onOpenArchive={openArchiveForEntry}/>
  {overlay==='time'&&<TimeMachine year={year} onYear={travelYear} onClose={()=>setOverlay(null)}/>} 
  {overlay==='collection'&&<CollectionPanel owned={owned} onClose={()=>setOverlay(null)}/>} 
  {overlay==='search'&&<SearchPanel query={searchQuery} setQuery={setSearchQuery} onClose={()=>setOverlay(null)} onSelectTrigger={item=>{setOverlay(null);launchTrigger(item)}} onOpenEntry={openArchiveForEntry}/>} 
  {overlay==='campaign'&&<CampaignPanel index={campaignIndex} onStep={index=>{setCampaignIndex(index);const item=dayCampaign[index];travelScene(item.scene);launchTrigger(getTrigger(item.trigger));setOverlay('campaign')}} onClose={()=>setOverlay(null)}/>} 
  {overlay==='settings'&&<SettingsPanel settings={settings} onChange={next=>{setSettings(next);setProfile(current=>current?{...current,settings:next}:current)}} onClose={()=>setOverlay(null)}/>} 

  <footer className="world-footer"><span>“Bukan membaca masa lalu. Masuk kembali ke dalamnya.”</span><b>WORLD ENGINE {worldVersion}</b><button onClick={()=>{localStorage.removeItem(STORAGE);location.reload()}}>Reset perjalanan</button></footer>
  {toast&&<div className="world-toast" role="status">{toast}</div>}
  {event&&<div className="ambient-event"><small>KEJADIAN RANDOM</small><b>{event.label}</b><button onClick={()=>{const item=getTrigger(event.trigger);setEvent(null);if(item)launchTrigger(item)}}>Ikuti ↘</button><button onClick={()=>setEvent(null)}>Lewati</button></div>}
 </div>;
}

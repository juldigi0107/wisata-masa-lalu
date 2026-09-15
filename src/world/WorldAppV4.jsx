import {useEffect,useMemo,useRef,useState} from 'react';
import LegacyArchive from '../App.jsx';
import catalog from '../../shared/assembled-catalog.js';
import {memoryTriggers,getTrigger} from '../../shared/memory-triggers.js';
import {
 scenes,yearWorldState,nostalgiaProfiles,onboardingChoices,dayCampaign,weightedRandomEvent,
 collections,achievements,getScene,getWorldTrigger,worldVersion
} from '../../shared/world-model.js';
import {buildAchievementProgress,getSeasonalEvent,getSeasonalMemory,sanitizeWorldSettings,seasonalModes} from '../../shared/world-v4-experience.js';
import GenericMechanic from './GenericMechanics.jsx';
import ContextualArchivePage from './ContextualArchivePage.jsx';
import {
 CampaignPanel,CollectionPanel,DialogSurface,SearchPanel,SettingsPanel,TimeMachinePanel
} from './FeaturePanelsV2.jsx';
import './world.css';

const STORAGE='wml-v3-profile';
const APP_BASE=import.meta.env.BASE_URL||'/';
const DEFAULT_SETTINGS={master:.7,ambience:.55,ui:.75,mute:false,intensity:'imersif'};
const VALID_SCENES=new Set(Object.keys(scenes));
const VALID_YEARS=new Set(Object.keys(yearWorldState).map(Number));
const VALID_PROFILES=new Set(nostalgiaProfiles.map(item=>item.id));

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

const memoryPacks={
 rumah:{label:'Rumah 90-an',note:'Scene rumah + TV, kaset, Walkman, kamera dan CRT.',urls:['assets/world/scenes/rumah-90.svg','assets/media/crt.jpg','assets/media/cassette.jpg','assets/media/walkman.jpg','assets/media/camera.jpg']},
 sekolah:{label:'Sekolah',note:'Scene sekolah + permainan, warung dan benda alat tulis.',urls:['assets/world/scenes/sekolah-90.svg','assets/media/kelereng.jpg','assets/media/warung.jpg','assets/media/dr-grip.jpg','assets/media/pilot-pens.jpg','assets/media/bobo-logo.png']},
 digital:{label:'Digital 90-an',note:'Scene digital + disket, pager, handheld dan personal audio.',urls:['assets/world/scenes/digital-90.svg','assets/media/floppy.jpg','assets/media/pager.jpg','assets/media/gameboy-color.jpg','assets/media/discman.jpg']}
};

const uniq=list=>[...new Set(Array.isArray(list)?list:[])];
const localDateKey=(date=new Date())=>`${date.getFullYear()}${String(date.getMonth()+1).padStart(2,'0')}${String(date.getDate()).padStart(2,'0')}`;
function dailyRandom(){let seed=Number(localDateKey())%2147483647;seed=seed*16807%2147483647;return(seed-1)/2147483646}
function normalizeProfile(raw){
 if(!raw||typeof raw!=='object')return null;
 const scene=VALID_SCENES.has(raw.scene)?raw.scene:'rumah';const year=VALID_YEARS.has(Number(raw.year))?Number(raw.year):1995;
 return {
  schema:4,type:VALID_PROFILES.has(raw.type)?raw.type:'anak-tv',scene,year,
  completed:uniq(raw.completed).filter(id=>Boolean(getTrigger(id))),collections:uniq(raw.collections).filter(id=>collections.some(item=>item.id===id)),
  visitedScenes:uniq([...(raw.visitedScenes||[]),scene]).filter(id=>VALID_SCENES.has(id)),visitedYears:uniq([...(raw.visitedYears||[]).map(Number),year]).filter(value=>VALID_YEARS.has(value)),
  score:Number.isFinite(Number(raw.score))?Math.max(0,Number(raw.score)):0,settings:sanitizeWorldSettings(raw.settings)
 };
}
function loadProfile(){try{return normalizeProfile(JSON.parse(localStorage.getItem(STORAGE)||'null'))}catch{return null}}
function persistProfile(profile){try{localStorage.setItem(STORAGE,JSON.stringify(profile))}catch{}}

function useSynthAudio(settings){
 const ctxRef=useRef(null);useEffect(()=>()=>{ctxRef.current?.close?.()},[]);
 async function ctx(){if(settings.mute||settings.master<=0)return null;const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return null;ctxRef.current??=new AC();await ctxRef.current.resume();return ctxRef.current}
 async function tone(freq=240,duration=.08,type='sine',gain=.025){const c=await ctx();if(!c)return;const osc=c.createOscillator(),g=c.createGain();osc.type=type;osc.frequency.setValueAtTime(freq,c.currentTime);g.gain.setValueAtTime(gain*settings.master*settings.ui,c.currentTime);g.gain.exponentialRampToValueAtTime(.0001,c.currentTime+duration);osc.connect(g);g.connect(c.destination);osc.start();osc.stop(c.currentTime+duration)}
 async function noise(duration=.25,gain=.012){const c=await ctx();if(!c)return;const length=Math.floor(c.sampleRate*duration);const buffer=c.createBuffer(1,length,c.sampleRate);const data=buffer.getChannelData(0);for(let i=0;i<length;i++)data[i]=(Math.random()*2-1)*(1-i/length);const source=c.createBufferSource(),g=c.createGain();source.buffer=buffer;g.gain.value=gain*settings.master*settings.ambience;source.connect(g);g.connect(c.destination);source.start()}
 async function cue(kind){if(kind==='dialup'){await tone(620,.12,'square',.02);setTimeout(()=>tone(980,.16,'sawtooth',.018),90);setTimeout(()=>noise(.35,.018),190);return}if(kind==='phone'){await tone(440,.14,'sine',.018);setTimeout(()=>tone(480,.14,'sine',.018),160);return}if(kind==='tv'||kind==='signal'){await noise(.12,.018);setTimeout(()=>tone(96,.08,'square',.012),60);return}if(kind==='cassette'||kind==='vhs'){await tone(120,.06,'square',.012);setTimeout(()=>tone(85,.08,'square',.01),65);return}if(kind==='arcade'){await tone(880,.06,'square',.02);setTimeout(()=>tone(1320,.07,'square',.018),70);return}if(kind==='bell'){await tone(730,.28,'sine',.025);return}await tone(320,.07,'square',.018)}
 return {cue};
}

function useClockPhase(){
 const phaseFor=date=>date.getHours()<10?'pagi':date.getHours()<15?'siang':date.getHours()<18?'sore':'malam';const [phase,setPhase]=useState(()=>phaseFor(new Date()));
 useEffect(()=>{const timer=setInterval(()=>setPhase(phaseFor(new Date())),60000);return()=>clearInterval(timer)},[]);return phase;
}
function useOnlineState(){const [online,setOnline]=useState(()=>typeof navigator==='undefined'||navigator.onLine!==false);useEffect(()=>{const yes=()=>setOnline(true),no=()=>setOnline(false);window.addEventListener('online',yes);window.addEventListener('offline',no);return()=>{window.removeEventListener('online',yes);window.removeEventListener('offline',no)}},[]);return online}
function useToast(){const [toast,setToast]=useState('');const timer=useRef(null);useEffect(()=>()=>clearTimeout(timer.current),[]);function show(message,duration=3200){clearTimeout(timer.current);setToast(message);timer.current=setTimeout(()=>setToast(''),duration)}return [toast,show]}

function Intro({onDone}){
 const [step,setStep]=useState(0);const labels=['2026','2010','2000','1999','SELAMAT DATANG KEMBALI'];
 useEffect(()=>{if(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches){setStep(labels.length-1);return}const timer=setInterval(()=>setStep(value=>{if(value>=labels.length-1){clearInterval(timer);return value}return value+1}),620);return()=>clearInterval(timer)},[]);
 return <div className="time-intro" role="dialog" aria-modal="true" aria-label="Mesin waktu"><div className="intro-noise"/><p>WISATA MASA LALU / TIME MACHINE</p><div className="intro-year" key={step}>{labels[step]}</div><span>{step<4?'Kalender bergerak mundur…':'Indonesia, tahun 1990-an.'}</span>{step>=4&&<button onClick={onDone}>MASUK KE 90-AN ↘</button>}<button className="intro-skip" onClick={onDone}>Lewati intro</button></div>;
}
function Onboarding({onChoose}){return <main className="onboarding"><div className="onboarding-paper"><p className="world-eyebrow">SATU PERTANYAAN SAJA</p><h1>Kamu paling ingat<br/>masa 90-an sebagai…</h1><p className="onboarding-hint">Tidak ada tutorial panjang. Pilih yang paling terasa familiar. Nanti cukup sentuh benda yang kamu kenal.</p><div className="profile-choices">{onboardingChoices.map(choice=><button key={choice.id} onClick={()=>onChoose(choice.id)}>{choice.label}<span>↘</span></button>)}</div></div></main>}
function SceneObject({item,active,onOpen,intensity}){return <button className={`scene-object ${active?'active':''} intensity-${intensity}`} style={{'--x':`${item.x}%`,'--y':`${item.y}%`}} onClick={()=>onOpen(item)} aria-label={`${item.label}. ${item.hint}`} aria-pressed={active}><span className="object-pulse"/><b>{item.icon}</b><em>{item.label}</em><small>{item.hint}</small></button>}
function Scene({scene,activeObject,onOpen,intensity,dayPhase,specialMode}){return <section className={`world-scene scene-${scene.id} phase-${dayPhase} mode-${specialMode||'normal'}`} aria-label={scene.label}><div className="scene-sky"/><div className="scene-ground"/><div className="scene-architecture"/><div className="scene-grain" aria-hidden="true"/>{scene.objects.map(item=><SceneObject key={item.id} item={item} active={activeObject?.id===item.id} onOpen={onOpen} intensity={intensity}/>)}<div className="scene-caption"><small>{scene.eyebrow}</small><h2>{scene.label}</h2><p>{scene.description}</p></div></section>}

function ContextArchive({trigger,onOpenArchive}){
 const mapped=contextualMap[trigger?.id];const entry=mapped?catalog.entries.find(item=>item.id===mapped):catalog.entries.find(item=>`${item.title} ${(item.tags||[]).join(' ')}`.toLocaleLowerCase('id').includes(trigger?.object?.toLocaleLowerCase('id')||'__none__'));
 if(!entry)return <div className="context-archive muted"><small>ARSIP KONTEKSTUAL</small><p>Belum ada entri sejarah spesifik untuk objek ini. Experience tetap dapat dimainkan tanpa mengarang fakta.</p><button onClick={()=>onOpenArchive(null)}>Buka arsip penuh</button></div>;
 return <div className="context-archive"><small>ARSIP KONTEKSTUAL · {entry.status}</small><h4>{entry.title}</h4><p>{entry.factBox?.text||entry.summary}</p><div className="context-sources">{(entry.sources||[]).slice(0,2).map(source=><a key={source.id||source.url} href={source.url} target="_blank" rel="noreferrer">{source.title} ↗</a>)}</div><button onClick={()=>onOpenArchive(entry)}>Buka arsip terkait ↘</button></div>;
}
function InteractionDrawer({object,trigger,completed,onClose,onComplete,onPickTrigger,onOpenArchive}){
 if(!object)return null;
 return <DialogSurface className="interaction-drawer" label={`Interaksi ${object.label}`} onClose={onClose}><button className="drawer-close" onClick={onClose} aria-label="Tutup Object Lens">×</button><p className="world-eyebrow">OBJECT LENS / SENTUH BENDA</p><h3>{object.label}</h3><p className="object-hint">{object.hint}</p><div className="trigger-tabs">{object.triggerIds.map(id=>{const item=getTrigger(id);return item?<button key={id} className={trigger?.id===id?'active':''} aria-pressed={trigger?.id===id} onClick={()=>onPickTrigger(item)}>{completed.includes(id)&&<span aria-label="sudah selesai">✓</span>}{item.title}</button>:null})}</div>{trigger&&<><div className="trigger-brief"><span>{String(trigger.no).padStart(3,'0')} / 100</span><b>{trigger.title}</b><p>{trigger.interaction}</p>{completed.includes(trigger.id)&&<small className="replay-note">Memori ini sudah tersimpan. Kamu tetap bisa mengulang tanpa menambah skor.</small>}</div><GenericMechanic key={trigger.id} trigger={trigger} onComplete={value=>onComplete(trigger,value)}/><ContextArchive trigger={trigger} onOpenArchive={onOpenArchive}/></>}</DialogSurface>;
}

export default function WorldAppV4(){
 const existing=typeof window!=='undefined'?loadProfile():null;
 const [intro,setIntro]=useState(!existing);const [profile,setProfile]=useState(existing);const [sceneId,setSceneId]=useState(existing?.scene||'rumah');const [year,setYear]=useState(existing?.year||1995);const [activeObject,setActiveObject]=useState(null);const [trigger,setTrigger]=useState(null);const [overlay,setOverlay]=useState(null);const [searchQuery,setSearchQuery]=useState('');const [event,setEvent]=useState(null);const [campaignIndex,setCampaignIndex]=useState(0);const [specialMode,setSpecialMode]=useState('normal');const [archiveEntry,setArchiveEntry]=useState(null);const [offlineStatus,setOfflineStatus]=useState('');const [settings,setSettings]=useState(existing?.settings||DEFAULT_SETTINGS);const [toast,showToast]=useToast();
 const phase=useClockPhase();const isOnline=useOnlineState();const audio=useSynthAudio(settings);const scene=getScene(sceneId);const dailySeed=dailyRandom();const daily=memoryTriggers[Math.floor(dailySeed*memoryTriggers.length)];const seasonalDaily=getSeasonalMemory(specialMode,dailySeed);const featuredMemory=seasonalDaily||daily;const season=seasonalModes[specialMode]||seasonalModes.normal;const completed=profile?.completed||[];const owned=profile?.collections||[];const visitedScenes=profile?.visitedScenes||[sceneId];const visitedYears=profile?.visitedYears||[year];const score=profile?.score||0;
 const categoryCounts=useMemo(()=>completed.reduce((acc,id)=>{const item=getWorldTrigger(id);if(item)acc[item.category]=(acc[item.category]||0)+1;return acc},{}),[completed]);
 const evolvedProfile=useMemo(()=>{const top=Object.entries(categoryCounts).sort((a,b)=>b[1]-a[1])[0]?.[0];const map={televisi:'anak-tv',musik:'anak-musik',komunikasi:'anak-warung',teknologi:'anak-warnet',sekolah:'anak-sekolah',jajanan:'anak-warung',permainan:'anak-lapangan',mainan:'anak-arcade',fotografi:'anak-komik'};return nostalgiaProfiles.find(item=>item.id===(map[top]||profile?.type))||nostalgiaProfiles[0]},[categoryCounts,profile?.type]);
 const achievementProgress=useMemo(()=>buildAchievementProgress(achievements,{completed,visitedScenes,visitedYears}),[completed,visitedScenes,visitedYears]);
 const unlockedAchievements=useMemo(()=>achievementProgress.filter(item=>item.unlocked),[achievementProgress]);
 useEffect(()=>{if(!profile)return;persistProfile(normalizeProfile({...profile,scene:sceneId,year,settings,visitedScenes,visitedYears,completed,collections:owned,score}))},[profile,sceneId,year,settings,visitedScenes,visitedYears,completed,owned,score]);
 useEffect(()=>{if(!profile||typeof window==='undefined')return;const url=new URL(window.location.href);url.searchParams.set('scene',sceneId);url.searchParams.set('year',String(year));window.history.replaceState(window.history.state,'',url.href)},[sceneId,year,profile?.type]);
 useEffect(()=>{if(!profile||overlay||activeObject||event)return;const timer=setInterval(()=>{if(document.visibilityState==='visible'&&Math.random()<.36){const next=specialMode==='normal'?weightedRandomEvent(sceneId):(getSeasonalEvent(specialMode,Math.random())||weightedRandomEvent(sceneId));setEvent(next);showToast(next.label,4200)}},26000);return()=>clearInterval(timer)},[profile,sceneId,overlay,activeObject,event,specialMode]);
 useEffect(()=>{if(!('serviceWorker'in navigator))return;function onMessage(message){if(message.data?.type==='MEMORY_PACK_READY')setOfflineStatus(`Memory Pack siap · ${message.data.count}/${message.data.requested||message.data.count} aset tersimpan.`);if(message.data?.type==='MEMORY_PACKS_CLEARED')setOfflineStatus('Memory Pack tambahan sudah dihapus. Offline shell inti tetap tersimpan.')}navigator.serviceWorker.addEventListener('message',onMessage);return()=>navigator.serviceWorker.removeEventListener('message',onMessage)},[]);
 useEffect(()=>{function onKey(eventKey){if(eventKey.key!=='Escape'||overlay)return;if(activeObject){setActiveObject(null);setTrigger(null);return}if(event)setEvent(null)}window.addEventListener('keydown',onKey);return()=>window.removeEventListener('keydown',onKey)},[activeObject,overlay,event]);

 function chooseProfile(type){const choice=nostalgiaProfiles.find(item=>item.id===type)||nostalgiaProfiles[0];const next=normalizeProfile({type:choice.id,scene:choice.scene,year:1995,completed:[],collections:[],visitedScenes:[choice.scene],visitedYears:[1995],score:0,settings});setProfile(next);setSceneId(choice.scene);persistProfile(next)}
 function closeFocused(){setActiveObject(null);setTrigger(null)}
 function openPanel(name){closeFocused();setEvent(null);setOverlay(name)}
 function travelScene(next,{keepOverlay=false}={}){if(!VALID_SCENES.has(next))return;setSceneId(next);closeFocused();if(!keepOverlay)setOverlay(null);setProfile(current=>current?{...current,visitedScenes:uniq([...(current.visitedScenes||[]),next])}:current);audio.cue('default')}
 function travelYear(next){if(!VALID_YEARS.has(Number(next)))return;setYear(Number(next));setProfile(current=>current?{...current,visitedYears:uniq([...(current.visitedYears||[]),Number(next)])}:current);audio.cue('tv')}
 function openObject(item){setOverlay(null);setEvent(null);setActiveObject(item);setTrigger(getTrigger(item.triggerIds[0]));audio.cue(item.id==='tv'?'tv':item.id.includes('telepon')?'phone':'default')}
 function completeTrigger(item){const already=completed.includes(item.id);const reward=collections[(Math.max(1,item.no)-1)%collections.length];setProfile(current=>{if(!current)return current;const nextCompleted=already?(current.completed||[]):uniq([...(current.completed||[]),item.id]);const nextCollections=(current.collections||[]).includes(reward.id)?(current.collections||[]):uniq([...(current.collections||[]),reward.id]);return {...current,completed:nextCompleted,collections:nextCollections,score:(current.score||0)+(already?0:item.points)}});showToast(already?'Memori diulang · progress tidak dihitung dua kali':`Memori tersimpan · +${item.points} · ${reward.label}`);audio.cue(item.mechanic==='arcade'?'arcade':item.mechanic==='phone'?'phone':item.mechanic==='dialup'?'dialup':'default')}
 function teleport(){const ids=Object.keys(scenes);let next=sceneId;while(ids.length>1&&next===sceneId)next=ids[Math.floor(Math.random()*ids.length)];travelScene(next);showToast('Kamu dilempar ke bagian lain dari 90-an.',2500)}
 function launchTrigger(item){if(!item)return;setOverlay(null);setEvent(null);const target=getScene(item.scene).objects.find(object=>object.triggerIds.includes(item.id));setSceneId(item.scene);setProfile(current=>current?{...current,visitedScenes:uniq([...(current.visitedScenes||[]),item.scene])}:current);if(target){setActiveObject(target);setTrigger(item)}audio.cue('default')}
 function openArchiveForEntry(entry){setEvent(null);setArchiveEntry(entry||null);setOverlay('archive')}
 function toggleSpecialMode(mode){setSpecialMode(current=>{const next=current===mode?'normal':mode;const config=seasonalModes[next]||seasonalModes.normal;showToast(next==='normal'?'Mode musiman selesai.':`${config.label} aktif · rekomendasi memori menyesuaikan.`,3000);return next})}
 function triggerMemoryEvent(){const next=specialMode==='normal'?weightedRandomEvent(sceneId):(getSeasonalEvent(specialMode,Math.random())||weightedRandomEvent(sceneId));setEvent(next)}
 async function cacheMemoryPack(id){const pack=memoryPacks[id];if(!pack)return;if(!('serviceWorker'in navigator)){setOfflineStatus('Service worker tidak didukung browser ini.');return}setOfflineStatus(`Menyimpan ${pack.label}…`);try{const registration=await navigator.serviceWorker.ready;const target=registration.active||navigator.serviceWorker.controller;if(!target)throw Error('service worker belum aktif');target.postMessage({type:'CACHE_MEMORY_PACK',urls:pack.urls.map(path=>`${APP_BASE}${path}`)})}catch(error){setOfflineStatus(`Memory Pack gagal disimpan · ${error.message}`)}}
 async function clearMemoryPacks(){if(!('serviceWorker'in navigator)){setOfflineStatus('Service worker tidak didukung browser ini.');return}setOfflineStatus('Menghapus Memory Pack tambahan…');try{const registration=await navigator.serviceWorker.ready;const target=registration.active||navigator.serviceWorker.controller;if(!target)throw Error('service worker belum aktif');target.postMessage({type:'CLEAR_MEMORY_PACKS'})}catch(error){setOfflineStatus(`Cache tambahan gagal dihapus · ${error.message}`)}}
 function resetJourney(){localStorage.removeItem(STORAGE);window.location.reload()}

 if(intro)return <Intro onDone={()=>setIntro(false)}/>;
 if(!profile)return <Onboarding onChoose={chooseProfile}/>;
 if(overlay==='archive')return <div className="archive-mode"><div className="archive-return"><button onClick={()=>{setOverlay(null);setArchiveEntry(null)}}>← Kembali ke dunia</button>{archiveEntry?<span>Arsip terkait: {archiveEntry.title}</span>:<span>Arsip lengkap · {catalog.entries.length} entri</span>}</div>{archiveEntry?<ContextualArchivePage entry={archiveEntry}/>:<LegacyArchive/>}</div>;

 return <div className={`world-app intensity-${settings.intensity}`} style={{'--year-accent':yearWorldState[year].accent}}>
  <a className="world-skip" href="#world-main">Langsung ke dunia</a>
  <header className="world-hud"><button className="brand-ticket" onClick={()=>travelScene('rumah')}><span>WISATA MASA LALU</span><b>INDONESIA 90-AN</b></button><div className="hud-status"><span>{year}</span><i/><span>{scene.label}</span><i/><span>{phase}</span><i/><span className={isOnline?'online-dot':'offline-dot'}>{isOnline?'online':'offline'}</span></div><nav aria-label="Kontrol utama"><button onClick={()=>openPanel('search')}>Cari</button><button onClick={()=>openPanel('collection')}>Koleksi <sup>{owned.length}</sup></button><button onClick={()=>openPanel('time')}>{year}</button><button onClick={()=>openPanel('settings')}>Suara</button></nav></header>
  <main id="world-main"><Scene scene={scene} activeObject={activeObject} onOpen={openObject} intensity={settings.intensity} dayPhase={phase} specialMode={specialMode}/><div className="environment-nav" aria-label="Peta lingkungan">{scene.exits.map(id=><button key={id} onClick={()=>travelScene(id)}><span>{scenes[id].eyebrow.split('/')[0]}</span><b>{scenes[id].label}</b></button>)}</div><section className={`memory-ribbon ${specialMode!=='normal'?'seasonal':''}`}><div><small>{season.eyebrow} · {localDateKey().slice(6,8)}/{localDateKey().slice(4,6)}</small><b>{featuredMemory.title}</b><p>{featuredMemory.interaction}</p>{specialMode!=='normal'&&<em className="seasonal-note">{season.note}</em>}</div><button onClick={()=>launchTrigger(featuredMemory)}>COBA SEKARANG ↘</button></section><section className="experience-dock" aria-label="Mode pengalaman"><button onClick={()=>openPanel('campaign')}><span>06:00—22:00</span><b>Satu Hari di 90-an</b></button><button onClick={teleport}><span>RANDOM</span><b>Bawa Saya ke 90-an</b></button><button onClick={triggerMemoryEvent}><span>MEMORY ENGINE</span><b>{specialMode==='normal'?'Picu kejadian':`Picu ${season.label}`}</b></button><button aria-pressed={specialMode==='ramadan'} onClick={()=>toggleSpecialMode('ramadan')}><span>SEASON</span><b>{specialMode==='ramadan'?'Keluar Ramadan':'Mode Ramadan'}</b></button><button aria-pressed={specialMode==='agustusan'} onClick={()=>toggleSpecialMode('agustusan')}><span>17 AGUSTUS</span><b>{specialMode==='agustusan'?'Mode normal':'Kampung Merdeka'}</b></button><button onClick={()=>openArchiveForEntry(null)}><span>{catalog.entries.length} ENTRI</span><b>Arsip 90-an</b></button></section><section className="profile-strip"><div><small>PROFIL NOSTALGIA</small><h3>{evolvedProfile.label}</h3><p>{completed.length}/100 memori · {visitedScenes.length}/5 area · {visitedYears.length}/10 tahun · skor {score}</p></div><div className="profile-meter"><i style={{width:`${completed.length}%`}}/></div><div className="achievement-mini">{unlockedAchievements.slice(0,3).map(item=><span key={item.id}>{item.label}</span>)}{!unlockedAchievements.length&&<span>Achievement pertama masih menunggu.</span>}</div></section></main>
  <InteractionDrawer object={activeObject} trigger={trigger} completed={completed} onClose={closeFocused} onComplete={completeTrigger} onPickTrigger={setTrigger} onOpenArchive={openArchiveForEntry}/>
  {overlay==='time'&&<TimeMachinePanel year={year} onYear={travelYear} onClose={()=>setOverlay(null)} onOpenEntry={openArchiveForEntry}/>} 
  {overlay==='collection'&&<CollectionPanel owned={owned} unlockedAchievements={unlockedAchievements} achievementProgress={achievementProgress} onClose={()=>setOverlay(null)}/>} 
  {overlay==='search'&&<SearchPanel query={searchQuery} setQuery={setSearchQuery} currentScene={sceneId} year={year} onClose={()=>setOverlay(null)} onSelectTrigger={launchTrigger} onOpenEntry={openArchiveForEntry}/>} 
  {overlay==='campaign'&&<CampaignPanel index={campaignIndex} onStep={setCampaignIndex} onPlay={step=>launchTrigger(getTrigger(step.trigger))} onClose={()=>setOverlay(null)}/>} 
  {overlay==='settings'&&<SettingsPanel settings={settings} onChange={next=>{setSettings(next);setProfile(current=>current?{...current,settings:next}:current)}} onClose={()=>setOverlay(null)} onCachePack={cacheMemoryPack} onClearPacks={clearMemoryPacks} offlineStatus={offlineStatus} onReset={resetJourney} memoryPacks={memoryPacks} isOnline={isOnline}/>} 
  <footer className="world-footer"><span>“Bukan membaca masa lalu. Masuk kembali ke dalamnya.”</span><b>WORLD ENGINE {worldVersion} / UX V4</b><button onClick={()=>openPanel('settings')}>Pengaturan perjalanan</button></footer>
  {toast&&<div className="world-toast" role="status">{toast}</div>}
  {event&&!overlay&&!activeObject&&<div className="ambient-event" role="dialog" aria-label="Kejadian random"><small>{event.seasonal?'SEASONAL MEMORY':'KEJADIAN RANDOM'}</small><b>{event.label}</b><button onClick={()=>{const item=getTrigger(event.trigger);setEvent(null);if(item)launchTrigger(item)}}>Ikuti ↘</button><button onClick={()=>setEvent(null)}>Lewati</button></div>}
 </div>;
}
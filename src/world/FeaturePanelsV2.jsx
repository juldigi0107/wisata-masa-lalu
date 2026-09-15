import {useEffect,useMemo,useRef,useState} from 'react';
import catalog from '../../shared/assembled-catalog.js';
import {memoryTriggers} from '../../shared/memory-triggers.js';
import {achievements,collections,dayCampaign,yearWorldState,years} from '../../shared/world-model.js';

const normalize=value=>String(value||'').toLocaleLowerCase('id');
const searchableEntry=entry=>normalize(`${entry.title} ${entry.summary} ${(entry.tags||[]).join(' ')} ${JSON.stringify(entry.details||{})}`);

export function DialogSurface({className,label,onClose,children}){
 const ref=useRef(null);const previous=useRef(null);
 useEffect(()=>{
  previous.current=document.activeElement;
  const root=ref.current;const timer=requestAnimationFrame(()=>root?.querySelector('input,button,select,textarea,a[href]')?.focus());
  function keydown(event){
   if(event.key==='Escape'){event.stopPropagation();onClose();return}
   if(event.key!=='Tab'||!root)return;
   const nodes=[...root.querySelectorAll('button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])')];
   if(!nodes.length)return;
   const first=nodes[0],last=nodes.at(-1);
   if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}
   else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}
  }
  root?.addEventListener('keydown',keydown);
  return()=>{cancelAnimationFrame(timer);root?.removeEventListener('keydown',keydown);previous.current?.focus?.()}
 },[onClose]);
 return <div ref={ref} className={className} role="dialog" aria-modal="true" aria-label={label}>{children}</div>;
}

export function TimeMachinePanel({year,onYear,onClose,onOpenEntry}){
 const state=yearWorldState[year];
 const recommendations=useMemo(()=>catalog.entries.filter(entry=>searchableEntry(entry).includes(String(year))).slice(0,6),[year]);
 return <DialogSurface className="time-machine-panel deep-panel" label="Mesin waktu 1990 sampai 1999" onClose={onClose}>
  <button className="panel-close" onClick={onClose} aria-label="Tutup mesin waktu">×</button>
  <p className="world-eyebrow">MESIN WAKTU / DEKADE</p><h2>{year}</h2><p>{state.mood}</p>
  <div className="year-strip" aria-label="Pilih tahun">{years.map(value=><button key={value} className={year===value?'active':''} aria-pressed={year===value} onClick={()=>onYear(value)}>{value}</button>)}</div>
  <div className="year-state"><div><small>TEKNOLOGI</small><b>{state.tech}</b></div><div><small>MEDIA</small><b>{state.media}</b></div></div>
  <section className="year-recommendations"><div><small>ARSIP YANG MENYEBUT {year}</small><b>{recommendations.length} jejak kontekstual</b></div>{recommendations.length?<div className="year-reco-list">{recommendations.map(entry=><button key={entry.id} onClick={()=>onOpenEntry(entry)}><span>{entry.type}</span><b>{entry.title}</b><small>{entry.status}</small></button>)}</div>:<p>Belum ada entri yang menyebut {year} secara eksplisit. Mood tahun tetap dapat dipakai tanpa memaksakan klaim historis.</p>}</section>
  <p className="panel-note">Perubahan tahun memengaruhi mood visual dan indeks rekomendasi. Benda tidak dianggap muncul atau hilang tepat pada satu tahun kecuali sumbernya memang menyatakan demikian.</p>
 </DialogSurface>;
}

export function CollectionPanel({owned,unlockedAchievements,onClose}){
 const [tab,setTab]=useState('koleksi');const percent=Math.round(owned.length/collections.length*100);
 return <DialogSurface className="collection-panel deep-panel" label="Koleksi nostalgia" onClose={onClose}>
  <button className="panel-close" onClick={onClose} aria-label="Tutup koleksi">×</button><p className="world-eyebrow">DIGITAL CABINET / PROGRESS</p><h2>Koleksi kecilmu.</h2>
  <div className="cabinet-progress"><div><strong>{owned.length}</strong><span>/ {collections.length} artefak</span></div><div className="cabinet-meter"><i style={{width:`${percent}%`}}/></div><b>{percent}% ditemukan</b></div>
  <div className="panel-tabs" role="tablist"><button role="tab" aria-selected={tab==='koleksi'} onClick={()=>setTab('koleksi')}>Artefak</button><button role="tab" aria-selected={tab==='achievement'} onClick={()=>setTab('achievement')}>Achievement <sup>{unlockedAchievements.length}</sup></button></div>
  {tab==='koleksi'?<div className="collection-grid">{collections.map((item,index)=>{const found=owned.includes(item.id);return <article key={item.id} className={found?'owned':''}><span>{item.icon}</span><b>{item.label}</b><small>{found?'TERKUMPUL':`BELUM DITEMUKAN · SLOT ${String(index+1).padStart(2,'0')}`}</small></article>})}</div>:<div className="achievement-grid">{achievements.map(item=>{const unlocked=unlockedAchievements.some(value=>value.id===item.id);return <article key={item.id} className={unlocked?'unlocked':''}><span>{unlocked?'✦':'○'}</span><div><b>{item.label}</b><p>{item.description}</p><small>{unlocked?'TERBUKA':'MASIH TERKUNCI'}</small></div></article>})}</div>}
 </DialogSurface>;
}

export function SearchPanel({query,setQuery,onClose,onSelectTrigger,onOpenEntry,currentScene,year}){
 const needle=normalize(query.trim());
 const triggerResults=useMemo(()=>memoryTriggers.filter(item=>!needle?item.scene===currentScene:normalize(`${item.title} ${item.category} ${item.interaction} ${item.scene} ${item.object}`).includes(needle)).slice(0,10),[needle,currentScene]);
 const entryResults=useMemo(()=>catalog.entries.filter(item=>!needle?searchableEntry(item).includes(String(year)):searchableEntry(item).includes(needle)).slice(0,10),[needle,year]);
 return <DialogSurface className="search-panel deep-panel" label="Pencarian memori" onClose={onClose}>
  <button className="panel-close" onClick={onClose} aria-label="Tutup pencarian">×</button><p className="world-eyebrow">MEMORY SEARCH / EXPERIENCE + ARCHIVE</p><h2>Cari dari ingatan.</h2>
  <div className="search-field"><input autoFocus value={query} onChange={e=>setQuery(e.target.value)} placeholder="misal: kaset, wartel, jajanan plastik…" aria-label="Cari memori"/>{query&&<button onClick={()=>setQuery('')} aria-label="Bersihkan pencarian">×</button>}</div>
  <p className="search-mode-note">{needle?`Hasil untuk “${query.trim()}”`:`Belum mengetik — menampilkan pengalaman di ${currentScene} dan jejak arsip sekitar ${year}.`}</p>
  <div className="search-columns"><section><h3>Pengalaman <sup>{triggerResults.length}</sup></h3>{triggerResults.map(item=><button key={item.id} onClick={()=>onSelectTrigger(item)}><b>{item.title}</b><small>{item.category} · {item.scene}</small></button>)}{!triggerResults.length&&<p className="panel-empty">Tidak ada pengalaman yang cocok. Coba istilah benda atau aktivitas.</p>}</section><section><h3>Arsip <sup>{entryResults.length}</sup></h3>{entryResults.map(item=><button key={item.id} onClick={()=>onOpenEntry(item)}><b>{item.title}</b><small>{item.type} · {item.status}</small></button>)}{!entryResults.length&&<p className="panel-empty">Tidak ada entri arsip yang cocok dengan kata tersebut.</p>}</section></div>
 </DialogSurface>;
}

export function CampaignPanel({index,onStep,onPlay,onClose}){
 const step=dayCampaign[index];
 return <DialogSurface className="campaign-panel deep-panel" label="Satu hari di 90-an" onClose={onClose}>
  <button className="panel-close" onClick={onClose} aria-label="Tutup perjalanan sehari">×</button><p className="world-eyebrow">SATU HARI DI 90-AN / 14 MOMEN</p><div className="campaign-time">{step.time}</div><h2>{step.phase}</h2><p>{step.prompt}</p>
  <div className="campaign-progress" aria-hidden="true">{dayCampaign.map((_,i)=><i key={i} className={i<=index?'done':''}/>)}</div>
  <div className="campaign-timeline" aria-label="Pilih momen">{dayCampaign.map((item,i)=><button key={`${item.time}-${item.phase}`} className={i===index?'active':''} aria-pressed={i===index} onClick={()=>onStep(i)}><time>{item.time}</time><span>{item.phase}</span></button>)}</div>
  <button className="campaign-play" onClick={()=>onPlay(step)}>JALANI MOMEN INI ↘</button>
  <div className="row-actions"><button onClick={()=>onStep(Math.max(0,index-1))} disabled={!index}>← Sebelum</button><button onClick={()=>onStep(Math.min(dayCampaign.length-1,index+1))} disabled={index===dayCampaign.length-1}>Berikutnya →</button></div>
  <small className="campaign-note">Memilih waktu hanya mengubah itinerary. Aktivitas dibuka setelah kamu menekan “Jalani momen ini”, jadi tidak ada Object Lens yang tersembunyi di belakang panel.</small>
 </DialogSurface>;
}

export function SettingsPanel({settings,onChange,onClose,onCachePack,onClearPacks,offlineStatus,onReset,memoryPacks,isOnline}){
 const [resetArmed,setResetArmed]=useState(false);const [clearArmed,setClearArmed]=useState(false);
 return <DialogSurface className="settings-panel deep-panel" label="Pengaturan pengalaman" onClose={onClose}>
  <button className="panel-close" onClick={onClose} aria-label="Tutup pengaturan">×</button><p className="world-eyebrow">AUDIO / DEVICE / ACCESSIBILITY</p><h2>Atur pengalaman.</h2>
  <div className={`network-state ${isOnline?'online':'offline'}`}><i/>{isOnline?'Perangkat sedang online':'Offline — shell lokal tetap dapat digunakan'}</div>
  <label>Master volume <output>{Math.round(settings.master*100)}%</output><input type="range" min="0" max="1" step=".05" value={settings.master} onChange={e=>onChange({...settings,master:Number(e.target.value)})}/></label>
  <label>Ambience <output>{Math.round(settings.ambience*100)}%</output><input type="range" min="0" max="1" step=".05" value={settings.ambience} onChange={e=>onChange({...settings,ambience:Number(e.target.value)})}/></label>
  <label>UI sound <output>{Math.round(settings.ui*100)}%</output><input type="range" min="0" max="1" step=".05" value={settings.ui} onChange={e=>onChange({...settings,ui:Number(e.target.value)})}/></label>
  <label className="toggle-line">Mute<input type="checkbox" checked={settings.mute} onChange={e=>onChange({...settings,mute:e.target.checked})}/></label>
  <label>Nostalgia intensity<select value={settings.intensity} onChange={e=>onChange({...settings,intensity:e.target.value})}><option value="ringan">Ringan</option><option value="imersif">Imersif</option><option value="total">Total Nostalgia</option></select></label>
  <section className="memory-pack-settings"><small>OFFLINE / MEMORY PACK</small><h3>Bawa sebagian 90-an tanpa koneksi.</h3><p>Scene inti sudah masuk offline shell. Paket tambahan menyimpan object-study terpilih pada cache perangkat.</p><div>{Object.entries(memoryPacks).map(([id,pack])=><button key={id} onClick={()=>onCachePack(id)}><b>{pack.label}</b><span>{pack.note}</span><i>↓</i></button>)}</div><output role="status">{offlineStatus||'Pilih satu paket untuk menyimpannya di perangkat.'}</output><button className={clearArmed?'danger-soft armed':'danger-soft'} onClick={()=>{if(clearArmed){onClearPacks();setClearArmed(false)}else setClearArmed(true)}} onBlur={()=>setClearArmed(false)}>{clearArmed?'TEKAN LAGI UNTUK HAPUS CACHE TAMBAHAN':'Hapus Memory Pack tambahan'}</button></section>
  <section className="journey-reset"><small>PERJALANAN</small><p>Reset hanya menghapus progress lokal profil ini. Arsip aplikasi tidak ikut terhapus.</p><button className={resetArmed?'armed':''} onClick={()=>{if(resetArmed)onReset();else setResetArmed(true)}} onBlur={()=>setResetArmed(false)}>{resetArmed?'TEKAN SEKALI LAGI UNTUK RESET':'Reset perjalanan lokal'}</button></section>
 </DialogSurface>;
}

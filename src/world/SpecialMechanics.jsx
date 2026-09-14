import {useEffect,useMemo,useState} from 'react';

function Schedule({onComplete}){
 const slots=[['06:30','Kartun pagi'],['12:30','Acara keluarga'],['19:30','Prime time'],['21:00','Film / hiburan']];
 const [clock,setClock]=useState('19:30');
 return <div className="mechanic-box special-mechanic schedule-mechanic"><p className="mechanic-kicker">KORAN / JADWAL SIARAN</p><div className="paper-schedule">{slots.map(([time,label])=><button key={time} className={clock===time?'selected':''} onClick={()=>setClock(time)}><time>{time}</time><span>{label}</span></button>)}</div><div className="mechanic-readout"><small>JAM DINDING</small><b>{clock}</b></div><button onClick={()=>onComplete(clock)}>LINGKARI ACARA ↘</button></div>;
}

function Sequence({trigger,onComplete}){
 const steps=useMemo(()=>{
  const map={
   'pager':['Baca nomor masuk','Cari telepon terdekat','Hubungi kembali'],
   'vhs-player':['Masukkan kaset','REWIND sampai awal','Tekan PLAY'],
   'upacara':['Siapkan barisan','Ikuti urutan upacara','Kembali ke kelas'],
   'kapal-otok-otok':['Isi air','Siapkan perahu','Jalankan simulasi'],
   'photo-lab':['Serahkan roll','Pilih ukuran cetak','Ambil amplop foto']
  };
  return map[trigger.id]||['Mulai ritual','Ikuti langkah berikutnya','Selesaikan memori'];
 },[trigger.id]);
 const [index,setIndex]=useState(0);
 return <div className="mechanic-box special-mechanic sequence-mechanic"><p className="mechanic-kicker">URUTAN RITUAL</p><ol>{steps.map((step,i)=><li key={step} className={i<index?'done':i===index?'active':''}><span>{String(i+1).padStart(2,'0')}</span><b>{step}</b></li>)}</ol><button onClick={()=>{if(index<steps.length-1)setIndex(i=>i+1);else onComplete(steps)}}>{index<steps.length-1?'LANJUTKAN →':'SELESAIKAN RITUAL ✓'}</button></div>;
}

function Browse({trigger,onComplete}){
 const rows=trigger.id==='toko-kaset'?['Pop Indonesia','Rock / alternatif','Soundtrack','Kompilasi radio','Rak impor']:['Koleksi favorit','Lembar warna','Pembatas','Stiker','Catatan teman'];
 const [visited,setVisited]=useState([]);
 return <div className="mechanic-box special-mechanic browse-mechanic"><p className="mechanic-kicker">JELAJAHI RAK</p><div className="browse-spines">{rows.map((row,i)=><button key={row} className={visited.includes(i)?'seen':''} onClick={()=>setVisited(v=>v.includes(i)?v:[...v,i])}><i/>{row}</button>)}</div><small>{visited.length}/{rows.length} bagian sudah dilihat.</small><button disabled={visited.length<3} onClick={()=>onComplete(visited)}>PILIH YANG PALING MELEKAT</button></div>;
}

function Boot({onComplete}){
 const stages=['POWER ON','MEMORY CHECK','DRIVE A: / C:','WINDOW SYSTEM','DESKTOP READY'];
 const [index,setIndex]=useState(0);
 useEffect(()=>{if(index>=stages.length-1)return;const timer=setTimeout(()=>setIndex(i=>i+1),520);return()=>clearTimeout(timer)},[index]);
 return <div className="mechanic-box special-mechanic boot-mechanic"><div className="terminal-screen"><small>RETRO PC BIOS</small>{stages.map((stage,i)=><p key={stage} className={i<=index?'visible':''}>{i<index?'✓':'>'} {stage}{i===index&&i<stages.length-1?' _':''}</p>)}</div><button disabled={index<stages.length-1} onClick={()=>onComplete('desktop-ready')}>BUKA DESKTOP</button></div>;
}

function Dialup({onComplete}){
 const stages=['Dialing…','Carrier detected','Handshake 33.6k','Verifying user','Connected'];
 const [running,setRunning]=useState(false);const [index,setIndex]=useState(0);
 useEffect(()=>{if(!running||index>=stages.length-1)return;const timer=setTimeout(()=>setIndex(i=>i+1),620);return()=>clearTimeout(timer)},[running,index,stages.length]);
 return <div className="mechanic-box special-mechanic dialup-mechanic"><div className="modem-orbit"><i className={running?'active':''}/><strong>{stages[index]}</strong><small>{index===4?'00:00:01 · CONNECTED':'MODEM / TELEPHONE LINE'}</small></div><button onClick={()=>{if(index===4)onComplete('connected');else setRunning(true)}}>{index===4?'MASUK INTERNET ↘':running?'MENUNGGU HANDSHAKE…':'DIAL SEKARANG'}</button></div>;
}

function EventMechanic({trigger,onComplete}){
 const [phase,setPhase]=useState(0);
 const copy=trigger.id==='mati-lampu'?['Klik. Semua lampu padam.','Cari senter / lilin virtual.','Listrik kembali.']:trigger.id==='internet-disconnect'?['Telepon rumah berbunyi.','Modem kehilangan carrier.','Sambungkan ulang setelah telepon selesai.']:['Suasana berubah tiba-tiba.','Perhatikan apa yang ikut berubah.','Lanjutkan hari.'];
 return <div className={`mechanic-box special-mechanic event-mechanic phase-${phase}`}><div className="event-flash"><span>{phase===0?'!':phase===1?'…':'✓'}</span><p>{copy[phase]}</p></div><button onClick={()=>{if(phase<2)setPhase(p=>p+1);else onComplete('event-resolved')}}>{phase<2?'RESPONS →':'SELESAI'}</button></div>;
}

function RandomReveal({onComplete}){
 const rewards=['stiker hologram','kartu angka','mainan mini','cuma bungkusnya','kupon kecil'];const [value,setValue]=useState(null);
 return <div className="mechanic-box special-mechanic random-mechanic"><button className="mystery-pack" onClick={()=>setValue(rewards[Math.floor(Math.random()*rewards.length)])} disabled={Boolean(value)}>?</button><p>{value?`Kamu menemukan: ${value}`:'Buka bungkus tanpa tahu isinya.'}</p><button disabled={!value} onClick={()=>onComplete(value)}>SIMPAN KE MEMORI</button></div>;
}

function Ledger({onComplete}){
 const [name,setName]=useState('');const [amount,setAmount]=useState('');
 return <div className="mechanic-box special-mechanic ledger-mechanic"><p className="mechanic-kicker">BUKU BON WARUNG</p><div className="ledger-paper"><label>Nama<input maxLength="18" value={name} onChange={e=>setName(e.target.value)}/></label><label>Catatan<input inputMode="numeric" maxLength="6" value={amount} onChange={e=>setAmount(e.target.value.replace(/\D/g,''))}/></label><div className="ledger-line"><span>{name||'………………'}</span><b>{amount?`Rp ${Number(amount).toLocaleString('id-ID')}`:'Rp ……'}</b></div></div><button disabled={!name.trim()||!amount} onClick={()=>onComplete({name,amount})}>CATAT BON ✓</button></div>;
}

function Strategy({onComplete}){
 const routes=[['KIRI','Memancing penjaga keluar'],['TENGAH','Cepat tapi terbuka'],['KANAN','Lebih jauh, lebih aman']];const [selected,setSelected]=useState(null);const [result,setResult]=useState('');
 function play(index){setSelected(index);setResult(index===2?'Lolos! Teman satu regu membuka jalur.':index===0?'Hampir tersentuh—mundur ke benteng.':'Penjaga membaca gerakanmu. Coba sisi lain.')}
 return <div className="mechanic-box special-mechanic strategy-mechanic"><div className="strategy-field"><span className="base a">A</span><span className="guard">◆</span><span className="base b">B</span>{routes.map(([name],i)=><button key={name} className={selected===i?'selected':''} onClick={()=>play(i)}>{name}</button>)}</div><p>{result||'Pilih jalur. Tidak semua rute harus diserang langsung.'}</p><button disabled={selected!==2} onClick={()=>onComplete('safe-route')}>KEMBALI KE BENTENG ✓</button></div>;
}

function Pet({onComplete}){
 const [food,setFood]=useState(35);const [clean,setClean]=useState(42);const [mood,setMood]=useState(38);
 const good=food>=70&&clean>=70&&mood>=70;
 return <div className="mechanic-box special-mechanic pet-mechanic"><div className="pet-screen"><div className="pixel-pet">◉ᴗ◉</div><Meter label="MAKAN" value={food}/><Meter label="BERSIH" value={clean}/><Meter label="MOOD" value={mood}/></div><div className="pet-actions"><button onClick={()=>setFood(v=>Math.min(100,v+22))}>Beri makan</button><button onClick={()=>setClean(v=>Math.min(100,v+25))}>Bersihkan</button><button onClick={()=>setMood(v=>Math.min(100,v+19))}>Ajak main</button></div><button disabled={!good} onClick={()=>onComplete({food,clean,mood})}>PET SENANG ✓</button></div>;
}
function Meter({label,value}){return <div className="pet-meter"><span>{label}</span><i><u style={{width:`${value}%`}}/></i><b>{value}</b></div>}

function Secret({onComplete}){
 const target=['↑','↑','←','→','A'];const [input,setInput]=useState([]);const solved=target.every((value,i)=>input[i]===value)&&input.length===target.length;
 function add(value){setInput(current=>[...current,value].slice(-target.length))}
 return <div className="mechanic-box special-mechanic secret-mechanic"><div className="secret-display">{input.length?input.join(' '):'· · · · ·'}</div><div className="secret-pad">{['↑','↓','←','→','A','B'].map(key=><button key={key} onClick={()=>add(key)}>{key}</button>)}</div><small>Rumor di rental: “dua kali atas, lalu kiri…”</small><button disabled={!solved} onClick={()=>onComplete(input)}>SECRET TERBUKA ✦</button></div>;
}

function Ambient({trigger,onComplete}){
 const layers=trigger.id==='suara-malam'?['jangkrik','tokek','motor jauh','TV tetangga']:trigger.id==='penjual-keliling'?['roda gerobak','panggilan','bel kecil','motor lewat']:['hujan genteng','air talang','angin','suara rumah'];
 const [heard,setHeard]=useState([]);
 return <div className="mechanic-box special-mechanic ambient-mechanic"><div className="wave-field" aria-hidden="true">{Array.from({length:18},(_,i)=><i key={i} style={{height:`${20+((i*17)%65)}%`}}/>)}</div><p>Dengarkan dengan mata: sentuh layer yang kamu kenali.</p><div className="ambient-layers">{layers.map(layer=><button key={layer} className={heard.includes(layer)?'heard':''} onClick={()=>setHeard(h=>h.includes(layer)?h:[...h,layer])}>{layer}</button>)}</div><button disabled={heard.length<3} onClick={()=>onComplete(heard)}>SIMPAN SOUNDSCAPE</button></div>;
}

function Inspect({onComplete}){
 const frames=['01A','02A','03A','04A','05A','06A'];const [selected,setSelected]=useState([]);
 return <div className="mechanic-box special-mechanic inspect-mechanic"><div className="negative-strip">{frames.map((frame,i)=><button key={frame} className={selected.includes(i)?'selected':''} onClick={()=>setSelected(v=>v.includes(i)?v:[...v,i])}><span>{frame}</span><i/></button>)}</div><small>Pilih tiga frame yang ingin diperiksa lebih dekat.</small><button disabled={selected.length<3} onClick={()=>onComplete(selected)}>BACA CONTACT SHEET</button></div>;
}

export default function SpecialMechanic({family,trigger,onComplete}){
 if(family==='schedule')return <Schedule onComplete={onComplete}/>;
 if(family==='sequence')return <Sequence trigger={trigger} onComplete={onComplete}/>;
 if(family==='browse')return <Browse trigger={trigger} onComplete={onComplete}/>;
 if(family==='boot')return <Boot onComplete={onComplete}/>;
 if(family==='dialup')return <Dialup onComplete={onComplete}/>;
 if(family==='event')return <EventMechanic trigger={trigger} onComplete={onComplete}/>;
 if(family==='random')return <RandomReveal onComplete={onComplete}/>;
 if(family==='ledger')return <Ledger onComplete={onComplete}/>;
 if(family==='strategy')return <Strategy onComplete={onComplete}/>;
 if(family==='pet')return <Pet onComplete={onComplete}/>;
 if(family==='secret')return <Secret onComplete={onComplete}/>;
 if(family==='ambient')return <Ambient trigger={trigger} onComplete={onComplete}/>;
 if(family==='inspect')return <Inspect onComplete={onComplete}/>;
 return null;
}

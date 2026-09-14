import {useState,useEffect,useRef} from "react";
import bundled from "../shared/catalog.js";
const time=m=>String(Math.floor(m/60)).padStart(2,"0")+":"+String(m%60).padStart(2,"0");
export default function App(){
 const [data,setData]=useState(bundled),[connection,setConnection]=useState("Katalog bawaan · Batch 1"),[channel,setChannel]=useState("RCTI"),[power,setPower]=useState(true),[crt,setCrt]=useState(true),[audio,setAudio]=useState(false),[minute,setMinute]=useState(390),[region,setRegion]=useState("Betawi"),[query,setQuery]=useState(""),[day,setDay]=useState("Minggu"),[hour,setHour]=useState(""),[active,setActive]=useState(bundled.entries[0]),[soundError,setSoundError]=useState("");
 const ctx=useRef(null), detail=useRef(null);
 useEffect(()=>{
  const base=import.meta.env.VITE_API_BASE_URL?.trim();
  if(!base)return;
  const controller=new AbortController();
  const timeout=setTimeout(()=>controller.abort(),8000);
  setConnection("Menghubungkan katalog…");
  fetch(base.replace(/\/$/,"")+"/api/catalog",{signal:controller.signal})
  .then(r=>{if(!r.ok)throw Error();return r.json()})
  .then(d=>{
   if(!Array.isArray(d.entries)||!d.entries.length||!Array.isArray(d.stations)||!Array.isArray(d.regions)||!Array.isArray(d.schedules)||d.entries.some(e=>!e.id||!e.title||!e.factBox||!e.quoteBox||!e.priceTag||!e.details||!Array.isArray(e.tags)))throw Error();
   setData(d);setActive(d.entries[0]);setConnection("Terhubung ke Cloudflare");
  }).catch(()=>{if(!controller.signal.aborted||!stopped)setConnection("API belum terjangkau · memakai katalog bawaan")});
  let stopped=false;
  return()=>{stopped=true;clearTimeout(timeout);controller.abort()};
 },[]);
 useEffect(()=>()=>{if(ctx.current?.state!=="closed")ctx.current?.close()},[]);
 async function click(force=false){
  if(!audio&&!force)return;
  try{
   const AC=window.AudioContext||window.webkitAudioContext;if(!AC)throw Error();
   ctx.current??=new AC();await ctx.current.resume();
   const c=ctx.current,o=c.createOscillator(),g=c.createGain();
   o.type="square";o.frequency.setValueAtTime(440,c.currentTime);o.frequency.exponentialRampToValueAtTime(90,c.currentTime+.07);
   g.gain.setValueAtTime(.025,c.currentTime);g.gain.exponentialRampToValueAtTime(.001,c.currentTime+.08);
   o.connect(g);g.connect(c.destination);o.start();o.stop(c.currentTime+.09);o.onended=()=>{o.disconnect();g.disconnect()};
  }catch{setSoundError("Efek suara tidak dapat diputar pada perangkat ini.")}
 }
 function open(e){setActive(e);requestAnimationFrame(()=>detail.current?.focus())}
 const program=data.entries.find(e=>e.type==="tv"&&e.details.station===channel);
 const slot=data.schedules.find(s=>s.day==="Minggu"&&minute>=s.startMinute&&minute<s.endMinute);
 const cartoon=data.entries.find(e=>e.id===slot?.entryId);
 const chosen=data.regions.find(r=>r.name===region)||data.regions[0];
 const filtered=data.entries.filter(e=>(e.title+" "+e.tags.join(" ")).toLowerCase().includes(query.trim().toLowerCase()));
 const rows=data.schedules.filter(s=>s.day===day&&(hour===""||(s.startMinute<(Number(hour)+1)*60&&s.endMinute>Number(hour)*60)));
 return <>
 <a className="skip" href="#main">Langsung ke konten</a>
 <header><div className="header-inner"><a className="brand" href="#">WML<span> VOL. 1990–1999</span></a><nav aria-label="Navigasi utama"><a href="#tv">TV Tabung</a><a href="#map">Peta Nostalgia</a><a href="#sunday">Minggu Pagi</a><a href="#collection">Kliping</a></nav><button aria-pressed={audio} onClick={()=>{if(!audio)click(true);setAudio(!audio)}}>Suara {audio?"aktif":"mati"}</button></div></header>
 <main id="main" className="mx-auto max-w-7xl px-5">
 <section className="ticket"><div className="p-7 sm:p-12"><span className="stamp">TIKET SEKALI JALAN KE KENANGAN</span><p className="eyebrow mt-8">WISATA MASA LALU</p><h1>Pulang sebentar<br/>ke <em>tahun 90-an.</em></h1><p className="my-6 max-w-xl text-lg">Sini, duduk dulu. TV tabung sudah menyala, sandal tinggal di teras, dan sore rasanya masih panjang.</p><a className="button" href="#tv">Masuk ruang tamu →</a></div><aside className="stub"><p className="eyebrow">BOARDING PASS</p><strong className="block my-6 text-6xl">90<br/>AN</strong><p>DARI: Hari yang sibuk<br/>KE: Kenangan rumah<br/>KURSI: Lesehan / bebas</p><div className="barcode"/></aside></section>
 <p className="status" role="status">{connection}</p>{soundError&&<p role="status">{soundError}</p>}
 <section id="tv"><p className="eyebrow">01 / RUANG TAMU</p><h2>Remotenya mana, nih?</h2><div className="grid gap-6 lg:grid-cols-[1fr_230px] mt-6"><div className="tv"><div className={"screen "+(crt?"crt":"")}><div aria-live="polite">{power?<><p className="font-mono">{channel} • SIMULASI</p><h3 className="text-4xl sm:text-5xl my-6">{program?.title||"Saluran kenangan"}</h3><p>{program?.summary||"Katalog saluran ini belum diisi pada Batch 1."}</p>{program&&<button className="mt-6" onClick={()=>open(program)}>Buka cerita →</button>}</>:<p>TV sedang dimatikan</p>}</div></div><p className="mt-4 text-xs text-white/70">KOLEKTOR • COLOR TELEVISION</p></div><div className="remote"><p className="eyebrow mb-4">REMOTE CONTROL</p><button className="w-full mb-5" aria-pressed={power} onClick={()=>{setPower(!power);click()}}>{power?"Matikan TV":"Nyalakan TV"}</button><div className="grid grid-cols-2 gap-3">{data.stations.map(s=><button key={s} disabled={!power} aria-pressed={channel===s} onClick={()=>{setChannel(s);click()}}>{s}</button>)}</div><label className="flex gap-3 mt-6"><input type="checkbox" checked={crt} onChange={e=>setCrt(e.target.checked)}/>Filter CRT</label><p className="text-xs mt-5">Kartu cerita interaktif; belum memutar video siaran.</p></div></div></section>
 <section id="map"><p className="eyebrow">02 / PULANG KE KAMPUNG</p><h2>Main ke mana sore ini?</h2><div className="paper mt-6"><div className="map" role="group" aria-label="Peta titik wilayah skematis"><span className="absolute top-4 left-4 text-xs font-mono">PETA TITIK SKEMATIS</span>{data.regions.map(r=><button key={r.name} className="pin" style={{left:((r.lon-94)/47*100)+"%",top:((7-r.lat)/19*100)+"%"}} aria-label={r.name} title={r.name} aria-pressed={region===r.name} onClick={()=>setRegion(r.name)}>●</button>)}</div><div className="p-6"><div className="flex flex-wrap gap-3">{data.regions.map(r=><button key={r.name} aria-pressed={region===r.name} onClick={()=>setRegion(r.name)}>{r.name}</button>)}</div><div aria-live="polite" className="mt-5"><h3 className="text-3xl">{chosen?.name}</h3><p>{chosen?.games.join(" · ")}</p></div><p className="text-xs mt-4">Contoh penelusuran wilayah, bukan klaim asal permainan. Panduan bermain belum termasuk Batch 1.</p></div></div></section>
 <section id="sunday" className="paper pink p-7 sm:p-10"><p className="eyebrow">03 / ALARM TAK DIPERLUKAN</p><h2>Minggu pagi milik kita.</h2><p className="my-4">Bantal di lantai dan sarapan di dekat TV. Geser waktunya.</p><label htmlFor="time">Jam simulasi: <strong>{time(minute)}</strong></label><input id="time" className="block w-full my-6" type="range" min="390" max="720" step="15" value={minute} onChange={e=>setMinute(Number(e.target.value))}/><div className="flex justify-between"><span>06.30</span><span>12.00</span></div><div className="my-6 min-h-24" aria-live="polite"><h3 className="text-3xl">{cartoon?.title||(minute===720?"Waktunya makan siang.":"Jeda dalam simulasi.")}</h3>{cartoon?<button className="mt-4" onClick={()=>open(cartoon)}>Buka kliping kartun</button>:<p>Tidak ada contoh acara pada waktu ini.</p>}</div><small>Jadwal editorial, bukan arsip siaran asli.</small></section>
 <section id="schedule"><p className="eyebrow">KLIPING JADWAL</p><h2>Jangan sampai kelewatan.</h2><div className="flex flex-wrap gap-5 my-6"><label>Hari<select value={day} onChange={e=>setDay(e.target.value)}>{["Senin","Selasa","Rabu","Kamis","Jumat","Sabtu","Minggu"].map(d=><option key={d}>{d}</option>)}</select></label><label>Jam<select value={hour} onChange={e=>setHour(e.target.value)}><option value="">Semua jam</option>{Array.from({length:24},(_,h)=><option key={h} value={h}>{time(h*60)}</option>)}</select></label></div><div className="paper overflow-x-auto"><table><caption>Jadwal simulasi Batch 1 — bukan arsip Kompas 1995.</caption><thead><tr><th scope="col">Jam</th><th scope="col">Saluran</th><th scope="col">Acara</th></tr></thead><tbody>{rows.map(s=><tr key={s.id}><td>{time(s.startMinute)}–{time(s.endMinute)}</td><td>{s.station}</td><td>{data.entries.find(e=>e.id===s.entryId)?.title}</td></tr>)}{!rows.length&&<tr><td colSpan="3">Tidak ada contoh acara pada filter ini.</td></tr>}</tbody></table></div></section>
 <section id="collection"><p className="eyebrow">04 / LACI KENANGAN</p><h2>Kliping yang masih disimpan.</h2><label className="block my-6">Cari judul atau topik<input type="search" placeholder="Coba: Doraemon" value={query} onChange={e=>setQuery(e.target.value)}/></label><div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">{filtered.map((e,i)=><article key={e.id} className={"card color-"+i%4}><div className="card-art" aria-hidden="true">{e.type==="tv"?"TV":"☺"}</div><p className="eyebrow">{e.type} / CONTOH</p><h3 className="text-2xl my-4">{e.title}</h3><button className="mt-auto" onClick={()=>open(e)}>Buka kliping</button></article>)}</div>{!filtered.length&&<p role="status">Judul tidak ditemukan.</p>}
 <article ref={detail} tabIndex="-1" className="paper p-6 mt-8"><span className="stamp">CONTOH EDITORIAL</span><h3 className="text-3xl mt-6">{active.title}</h3><p className="my-4">{active.summary}</p><div className="grid md:grid-cols-3 gap-4"><div className="note green"><h4>Fact Box</h4><p>{active.factBox.text}</p><small>Belum terverifikasi</small></div><blockquote className="note pink"><h4>Kutipan Anak 90-an</h4><p>“{active.quoteBox.text}”</p><cite>{active.quoteBox.attribution}</cite></blockquote><div className="note yellow"><h4>{active.priceTag.label}</h4><p>1995: belum terverifikasi<br/>2026: belum terverifikasi</p><small>{active.priceTag.note}</small></div></div></article></section>
 </main><footer>Wisata Masa Lalu: Edisi Tahun 90-an | Web Engine v1.0 | © Kolektor 90an</footer></>;
}
import {useEffect,useMemo,useRef,useState} from 'react';
import bundled from '../shared/assembled-catalog.js';
import {modules,snacks,slang,quizQuestions,assetCredits,gameGuides,objectCabinet} from './content.js';

const BASE=import.meta.env.BASE_URL||'/';
const ASSET=`${BASE}assets/`;
const MEDIA=`${ASSET}media/`;
const time=m=>`${String(Math.floor(m/60)).padStart(2,'0')}:${String(m%60).padStart(2,'0')}`;
const rupiah=n=>new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(n);
const entryAssetSrc=asset=>asset?.path?(asset.path.startsWith('/assets/')?`${BASE}${asset.path.replace(/^\//,'')}`:asset.path):'';

function Picture({src,alt,className=''}) {
 return <img className={className} src={src} alt={alt} loading="lazy" onError={e=>{e.currentTarget.hidden=true}}/>;
}
function Eyebrow({children}) { return <p className="eyebrow">{children}</p>; }
function SourceLink({source}) {
 if(!source?.url)return null;
 return <a className="source-link" href={source.url} target="_blank" rel="noreferrer">Sumber ↗</a>;
}

export default function App(){
 const [data,setData]=useState(bundled);
 const [connection,setConnection]=useState('Katalog lokal · mode aman');
 const [channel,setChannel]=useState('RCTI');
 const [power,setPower]=useState(true);
 const [crt,setCrt]=useState(true);
 const [audio,setAudio]=useState(false);
 const [minute,setMinute]=useState(390);
 const [region,setRegion]=useState('Betawi');
 const [query,setQuery]=useState('');
 const [typeFilter,setTypeFilter]=useState('semua');
 const [visibleCount,setVisibleCount]=useState(12);
 const [active,setActive]=useState(bundled.entries[0]);
 const [snackIndex,setSnackIndex]=useState(0);
 const [qty,setQty]=useState(5);
 const [night,setNight]=useState(true);
 const [slangQuery,setSlangQuery]=useState('');
 const [gameIndex,setGameIndex]=useState(0);
 const [objectIndex,setObjectIndex]=useState(0);
 const [quizStep,setQuizStep]=useState(0);
 const [quizScore,setQuizScore]=useState(0);
 const [quizDone,setQuizDone]=useState(false);
 const [soundError,setSoundError]=useState('');
 const ctx=useRef(null);
 const detail=useRef(null);

 useEffect(()=>{
  const base=import.meta.env.VITE_API_BASE_URL?.trim();
  if(!base)return;
  const controller=new AbortController();
  const timer=setTimeout(()=>controller.abort(),8000);
  let stopped=false;
  setConnection('Menghubungkan arsip Cloudflare…');
  fetch(base.replace(/\/$/,'')+'/api/catalog',{signal:controller.signal})
   .then(r=>{if(!r.ok)throw Error(`HTTP ${r.status}`);return r.json()})
   .then(d=>{
    if(!Array.isArray(d.entries)||!d.entries.length)throw Error('katalog kosong');
    if(stopped)return;
    setData(d);
    setActive(d.entries[0]);
    setConnection(`Arsip Cloudflare v${d.version||'?'} · ${d.entries.length} entri`);
   })
   .catch(()=>{if(!stopped)setConnection('API tidak terjangkau · memakai arsip lokal')})
   .finally(()=>clearTimeout(timer));
  return()=>{stopped=true;clearTimeout(timer);controller.abort()};
 },[]);

 useEffect(()=>()=>{if(ctx.current?.state!=='closed')ctx.current?.close()},[]);
 useEffect(()=>{setVisibleCount(12)},[query,typeFilter]);

 async function click(force=false){
  if(!audio&&!force)return;
  try{
   const AC=window.AudioContext||window.webkitAudioContext;
   if(!AC)throw Error();
   ctx.current??=new AC();
   await ctx.current.resume();
   const c=ctx.current,o=c.createOscillator(),g=c.createGain();
   o.type='square';
   o.frequency.setValueAtTime(430,c.currentTime);
   o.frequency.exponentialRampToValueAtTime(95,c.currentTime+.08);
   g.gain.setValueAtTime(.02,c.currentTime);
   g.gain.exponentialRampToValueAtTime(.001,c.currentTime+.09);
   o.connect(g);g.connect(c.destination);o.start();o.stop(c.currentTime+.1);
   o.onended=()=>{o.disconnect();g.disconnect()};
  }catch{setSoundError('Efek suara tidak tersedia pada perangkat ini.')}
 }
 function openEntry(e){setActive(e);requestAnimationFrame(()=>detail.current?.focus())}
 function answer(i){
  const q=quizQuestions[quizStep];
  const next=quizScore+(i===q[2]?1:0);
  setQuizScore(next);
  if(quizStep===quizQuestions.length-1)setQuizDone(true);
  else setQuizStep(quizStep+1);
 }
 function resetQuiz(){setQuizStep(0);setQuizScore(0);setQuizDone(false)}

 const program=data.entries.find(e=>e.type==='tv'&&e.details?.station===channel);
 const slot=data.schedules?.find(s=>s.day==='Minggu'&&minute>=s.startMinute&&minute<s.endMinute);
 const cartoon=data.entries.find(e=>e.id===slot?.entryId);
 const chosen=data.regions?.find(r=>r.name===region)||data.regions?.[0];
 const typeStats=useMemo(()=>data.entries.reduce((acc,e)=>{acc[e.type]=(acc[e.type]||0)+1;return acc},{}),[data.entries]);
 const entryTypes=useMemo(()=>Object.keys(typeStats).sort((a,b)=>a.localeCompare(b,'id')),[typeStats]);
 const filtered=useMemo(()=>data.entries.filter(e=>{
  const matchesType=typeFilter==='semua'||e.type===typeFilter;
  const haystack=`${e.title} ${(e.tags||[]).join(' ')} ${e.summary} ${e.details?.station||''} ${e.details?.region||''}`.toLocaleLowerCase('id');
  return matchesType&&haystack.includes(query.trim().toLocaleLowerCase('id'));
 }),[data.entries,query,typeFilter]);
 const visibleEntries=filtered.slice(0,visibleCount);
 const filteredSlang=useMemo(()=>slang.filter(x=>(x.term+' '+x.meaning).toLocaleLowerCase('id').includes(slangQuery.toLocaleLowerCase('id'))),[slangQuery]);
 const snack=snacks[snackIndex];
 const game=gameGuides[gameIndex];
 const object=objectCabinet[objectIndex];
 const archive=data.archiveSchedules?.[0];
 const verifiedCount=data.entries.filter(e=>e.status==='verified').length;
 const quizPercent=Math.round(quizScore/quizQuestions.length*100);
 const trackedAssetCount=assetCredits.length;
 const activeVisual=active.assets?.find(asset=>asset.kind==='image'&&asset.path);

 return <div className={night?'app-shell night-ready':'app-shell'}>
  <a className="skip" href="#main">Langsung ke konten</a>
  <header className="site-header"><div className="header-inner">
   <a className="brand" href="#top"><img src={`${ASSET}brand-seal.svg`} alt=""/><span><b>WISATA MASA LALU</b><small>EDISI TAHUN 90-AN</small></span></a>
   <nav aria-label="Navigasi utama"><a href="#tv">TV</a><a href="#games">Kampung</a><a href="#rental">Benda</a><a href="#warung">Warung</a><a href="#ramadan">Ramadhan</a><a href="#quiz">Quiz</a></nav>
   <button className="sound-toggle" aria-pressed={audio} onClick={()=>{if(!audio)click(true);setAudio(!audio)}}>{audio?'SFX ON':'SFX OFF'}</button>
  </div></header>

  <main id="main">
   <section id="top" className="hero editorial-grid">
    <div className="hero-photo"><Picture src={`${MEDIA}jakarta-1991.jpg`} alt="Kawasan Senen, Jakarta pada 1991"/><div className="film-grain"/><span className="hero-credit">ARSIP VISUAL • JAKARTA 1991 • CC BY-SA</span></div>
    <div className="hero-copy"><Eyebrow>ISSUE 04 · 1990—1999 · INDONESIA</Eyebrow><h1>Yang kita rindukan ternyata <em>bukan cuma zamannya.</em></h1><p className="hero-lead">Masuk lewat suara TV ruang tengah, uang receh di saku seragam, permainan sore, komik dan majalah yang berpindah tangan, alat tulis favorit, pager yang berbunyi tiba-tiba, sampai malam Ramadan ketika jalan kampung belum cepat sepi.</p><div className="hero-actions"><a className="primary" href="#index">Buka ensiklopedia</a><a className="text-link" href="#tv">Mulai dari TV tabung ↘</a></div><div className="hero-meta"><span><b>{data.entries.length}</b> entri kurasi</span><span><b>{verifiedCount}</b> terverifikasi</span><span><b>{trackedAssetCount}</b> aset terlacak</span></div></div>
    <aside className="hero-stub"><Eyebrow>BOARDING PASS</Eyebrow><strong>90<br/>AN</strong><dl><div><dt>Gate</dt><dd>Ruang Tamu</dd></div><div><dt>Kursi</dt><dd>Lesehan</dd></div><div><dt>Bagasi</dt><dd>Kenangan</dd></div></dl><div className="barcode"/></aside>
   </section>
   <div className="connection"><span className="pulse"/> {connection}{soundError&&` · ${soundError}`}</div>

   <section id="index" className="index-section wrap"><div className="section-head"><div><Eyebrow>DAFTAR ISI / MEMORY INDEX</Eyebrow><h2>Delapan pintu masuk.</h2></div><p>Setiap bagian memakai bahasa visual berbeda—majalah, katalog warung, blueprint, layar CRT, sampai mixtape—tetapi seluruhnya memakai sumber dan status kurasi yang dapat dilacak.</p></div><div className="module-grid">{modules.map(m=><a key={m.id} className={`module-card ${m.tone}`} href={`#${m.id}`}><span className="module-no">{m.no}</span><span className="module-icon">{m.icon}</span><h3>{m.title}</h3><p>{m.subtitle}</p><span className="module-arrow">↘</span></a>)}</div></section>

   <section id="tv" className="tv-section"><div className="wrap"><div className="section-head light"><div><Eyebrow>01 / VIRTUAL CRT</Eyebrow><h2>Remote-nya di bawah bantal.</h2></div><p>Enam kanal sekarang mempunyai entri kurasi. Layar ini adalah simulasi editorial, bukan streaming ulang siaran berhak cipta.</p></div><div className="tv-layout">
    <div className="tv-set"><div className={crt?'screen crt':'screen'}>{power?<div className="broadcast"><span className="osd">{channel} · CH {String(data.stations.indexOf(channel)+1).padStart(2,'0')}</span><Eyebrow>{program?.status==='verified'?'ARSIP TERVERIFIKASI':'KURASI / PERLU CATATAN'}</Eyebrow><h3>{program?.title||'Semut memenuhi layar.'}</h3><p>{program?.summary||'Belum ada entri utama untuk kanal ini.'}</p>{program&&<div className="broadcast-meta"><span>{program.details?.premiere}</span><span>{program.details?.genre}</span></div>}{program&&<button onClick={()=>openEntry(program)}>Buka kliping acara</button>}</div>:<div className="off">•</div>}</div><div className="tv-label"><span>COLOR TELEVISION</span><span>1990—1999</span></div></div>
    <aside className="remote"><Eyebrow>REMOTE / 6 CHANNEL</Eyebrow><div className="remote-display">{power?channel:'OFF'}</div><button className="power" onClick={()=>{setPower(!power);click()}}>{power?'POWER OFF':'POWER ON'}</button><div className="channel-grid">{data.stations.map((s,i)=><button key={s} disabled={!power} aria-pressed={channel===s} onClick={()=>{setChannel(s);click()}}><small>{i+1}</small>{s}</button>)}</div><label><input type="checkbox" checked={crt} onChange={e=>setCrt(e.target.checked)}/> Scanline CRT</label></aside>
    <div className="tv-object"><Picture src={`${MEDIA}crt.jpg`} alt="Referensi objek televisi CRT retro"/><span>OBJECT STUDY / CRT</span></div>
   </div></div></section>

   <section id="sunday" className="sunday wrap"><div className="magazine-number">06:30</div><div className="sunday-copy"><Eyebrow>02 / MINGGU PAGI</Eyebrow><h2>Jam biologis anak 90-an.</h2><p>Slider di bawah tetap mode simulasi. Di bawahnya ada sampel jadwal 1995 yang dipisahkan secara tegas dari simulasi supaya provenance tidak tercampur.</p><label htmlFor="time">WAKTU SIMULASI <b>{time(minute)}</b></label><input id="time" type="range" min="390" max="720" step="15" value={minute} onChange={e=>setMinute(Number(e.target.value))}/><div className="time-scale"><span>06.30</span><span>09.00</span><span>12.00</span></div><div className="now-card"><span>SIMULASI</span><h3>{cartoon?.title||(minute===720?'Makan siang memanggil.':'Jeda antarprogram.')}</h3>{cartoon&&<><p>{cartoon.summary}</p><button onClick={()=>openEntry(cartoon)}>Buka profil →</button></>}</div></div><div className="sunday-art"><Picture src={`${MEDIA}kelereng.jpg`} alt="Anak-anak bermain kelereng di Indonesia"/><div className="polaroid-caption">SEBELUM / SESUDAH TV<br/><b>SORE TETAP MAIN.</b></div></div>
    {archive&&<article className="archive-schedule"><div className="archive-intro"><Eyebrow>SAMPEL ARSIP KOMUNITAS</Eyebrow><h3>{archive.station} · Minggu, 4 Juni 1995</h3><p>{archive.source.note}</p><SourceLink source={archive.source}/></div><div className="archive-strip">{archive.items.map(item=><div key={`${item.time}-${item.title}`}><time>{item.time}</time><b>{item.title}</b></div>)}</div></article>}
   </section>

   <section id="games" className="games wrap"><div className="section-head"><div><Eyebrow>03 / PERMAINAN KAMPUNG</Eyebrow><h2>Lapangan terbesar adalah halaman rumah.</h2></div><p>Foto berfungsi sebagai dokumentasi budaya. Blueprint memakai aturan dari sumber kebudayaan; variasi lokal tetap mungkin berbeda.</p></div><div className="game-gallery"><figure className="wide"><Picture src={`${MEDIA}permainan-tradisional.jpg`} alt="Anak-anak memainkan permainan tradisional Indonesia"/><figcaption>Dokumentasi permainan tradisional</figcaption></figure><figure><Picture src={`${MEDIA}kelereng.jpg`} alt="Permainan kelereng"/><figcaption>Gundu / kelereng</figcaption></figure><figure><Picture src={`${MEDIA}congklak.jpg`} alt="Permainan tradisional congklak"/><figcaption>Congklak</figcaption></figure></div><div className="region-bar">{data.regions?.map(r=><button key={r.name} aria-pressed={region===r.name} onClick={()=>setRegion(r.name)}>{r.name}</button>)}</div><p className="region-context"><b>{chosen?.name}</b> · indeks penelusuran: {chosen?.games?.join(' · ')}</p>
    <div className="guide-tabs">{gameGuides.map((g,i)=><button key={g.id} aria-pressed={i===gameIndex} onClick={()=>setGameIndex(i)}>{String(i+1).padStart(2,'0')} · {g.name}</button>)}</div><article className="blueprint blueprint-detail"><div className="blueprint-copy"><Eyebrow>BLUEPRINT / {game.region.toUpperCase()}</Eyebrow><h3>{game.name}</h3><p>{game.facts}</p><dl><div><dt>Pemain</dt><dd>{game.players}</dd></div><div><dt>Peralatan</dt><dd>{game.tools}</dd></div></dl><a href={game.source} target="_blank" rel="noreferrer">{game.sourceLabel} ↗</a></div><ol className="blueprint-steps">{game.steps.map((step,i)=><li key={step}><span>{String(i+1).padStart(2,'0')}</span><p>{step}</p></li>)}</ol></article>
   </section>

   <section id="rental" className="object-section"><div className="wrap"><div className="section-head"><div><Eyebrow>04 / RENTAL & OBJECT CABINET</Eyebrow><h2>Benda kecil, memori besar.</h2></div><p>Alih-alih memakai poster atau screenshot berhak cipta, kabinet memakai foto objek public-domain/Creative Commons dan fakta produk dari sumber resmi bila tersedia.</p></div><div className="object-layout"><div className="object-stage"><Picture src={`${MEDIA}${object.image}`} alt={`${object.name}, objek studi nostalgia`}/><span>{object.kicker} · {object.year}</span></div><div className="object-copy"><Eyebrow>OBJECT {String(objectIndex+1).padStart(2,'0')} / {String(objectCabinet.length).padStart(2,'0')}</Eyebrow><h2>{object.name}</h2><p>{object.story}</p><a className="source-link dark" href={object.source} target="_blank" rel="noreferrer">{object.sourceLabel} ↗</a><div className="object-nav">{objectCabinet.map((o,i)=><button key={o.id} aria-label={`Pilih ${o.name}`} aria-pressed={i===objectIndex} onClick={()=>setObjectIndex(i)}><span>{String(i+1).padStart(2,'0')}</span>{o.name}</button>)}</div></div></div></div></section>

   <section id="warung" className="warung"><div className="wrap warung-layout"><div className="warung-photo"><Picture src={`${MEDIA}warung.jpg`} alt="Makanan warung Indonesia sebagai referensi visual"/><span>WARUNG / UANG SAKU / PULANG SEKOLAH</span></div><div className="calculator"><Eyebrow>05 / KALKULATOR JAJANAN</Eyebrow><h2>Uang receh pernah terasa kaya.</h2><p>Simulasi ini dibuat untuk rasa skala, bukan indeks inflasi resmi. Harga berbeda menurut kota, warung, ukuran, dan tahun.</p><label>Jajanan<select value={snackIndex} onChange={e=>setSnackIndex(Number(e.target.value))}>{snacks.map((s,i)=><option key={s.name} value={i}>{s.name}</option>)}</select></label><label>Jumlah<input type="range" min="1" max="20" value={qty} onChange={e=>setQty(Number(e.target.value))}/><b>{qty} buah</b></label><div className="price-compare"><div><span>{snack.year}</span><strong>{rupiah(snack.past*qty)}</strong></div><div className="equals">→</div><div><span>2026</span><strong>{rupiah(snack.present*qty)}</strong></div></div><small>{snack.note}</small></div></div></section>

   <section id="ramadan" className={night?'ramadan night':'ramadan'}><div className="wrap ramadan-grid"><div className="ramadan-copy"><Eyebrow>06 / SPECIAL EMOTIONAL MODULE</Eyebrow><h2>Suara bedug terdengar lebih jauh waktu itu.</h2><p>Dari sahur keliling, ngabuburit, pawai obor, sampai mudik—bagian ini sengaja dibuat lebih lambat, gelap, dan tenang.</p><button className="theme-switch" onClick={()=>setNight(!night)}>{night?'☾ Night Mode aktif':'☀ Nyalakan Night Mode'}</button><div className="ramadan-moments"><span>03:30 <b>Sahur</b></span><span>17:30 <b>Ngabuburit</b></span><span>19:30 <b>Tarawih</b></span><span>Takbiran <b>Obor & gema kampung</b></span></div></div><div className="ramadan-photo"><Picture src={`${MEDIA}ramadan.jpg`} alt="Suasana malam Ramadan di masjid"/><img className="lantern" src={`${ASSET}ramadan-lantern.svg`} alt=""/></div></div></section>

   <section id="music" className="music wrap"><div className="music-player"><img src={`${ASSET}cassette-player.svg`} alt="Ilustrasi pemutar kaset retro"/><Picture src={`${MEDIA}cassette.jpg`} alt="Kaset audio sebagai referensi visual" className="cassette-photo"/></div><div className="dictionary"><Eyebrow>07 / MIXTAPE + KAMUS GAUL</Eyebrow><h2>Rewind pakai pensil.</h2><p>Kaset, radio, poster kamar, dan bahasa tongkrongan membentuk soundtrack keseharian yang berbeda dari hari ini.</p><label>Cari istilah<input type="search" value={slangQuery} onChange={e=>setSlangQuery(e.target.value)} placeholder="Coba: bokap, jayus, kece"/></label><div className="word-list">{filteredSlang.map(x=><article key={x.term}><b>{x.term}</b><p>{x.meaning}</p></article>)}</div></div></section>

   <section id="quiz" className="quiz wrap"><div className="quiz-ticket"><Eyebrow>08 / NOSTALGIA METER</Eyebrow>{quizDone?<><div className="score-ring"><strong>{quizPercent}</strong><span>/100</span></div><h2>{quizPercent>=80?'Anak 90-an garis keras.':quizPercent>=50?'Memorinya masih hangat.':'Kamu tamu kehormatan di mesin waktu.'}</h2><p>Skor dihitung dari 20 pertanyaan ringan tentang kebiasaan sehari-hari era analog.</p><button onClick={resetQuiz}>Ulangi quiz</button></>:<><span className="quiz-progress">PERTANYAAN {quizStep+1} / {quizQuestions.length}</span><h2>{quizQuestions[quizStep][0]}</h2><div className="quiz-options">{quizQuestions[quizStep][1].map((o,i)=><button key={o} onClick={()=>answer(i)}>{String.fromCharCode(65+i)}. {o}</button>)}</div></>}</div><aside><Eyebrow>BOARDING SCORE</Eyebrow><p>Jawaban tidak disimpan ke server.</p><div className="barcode tall"/></aside></section>

   <section id="collection" className="collection wrap"><div className="section-head"><div><Eyebrow>ARSIP / KLIPING</Eyebrow><h2>Buka laci kenangan.</h2></div><label>Cari judul, kanal, daerah, atau topik<input type="search" placeholder="Coba: HAI, pager, Nintendo, RCTI, Bobo" value={query} onChange={e=>setQuery(e.target.value)}/></label></div>
    <div className="type-filter" role="group" aria-label="Filter kategori arsip"><button aria-pressed={typeFilter==='semua'} onClick={()=>setTypeFilter('semua')}>Semua <span>{data.entries.length}</span></button>{entryTypes.map(type=><button key={type} aria-pressed={typeFilter===type} onClick={()=>setTypeFilter(type)}>{type} <span>{typeStats[type]}</span></button>)}</div>
    <p className="collection-count" aria-live="polite">Menampilkan <b>{visibleEntries.length}</b> dari {filtered.length} hasil · total katalog {data.entries.length} · v{data.version}</p>
    <div className="clip-grid">{visibleEntries.map((e,i)=><button className={`clip-card c${i%4}`} key={e.id} onClick={()=>openEntry(e)}><span>{String(i+1).padStart(2,'0')}</span><small>{e.type} · {e.details?.station||e.details?.region||''}</small><h3>{e.title}</h3><p>{e.summary}</p><b>Buka kliping ↗</b></button>)}</div>
    {visibleCount<filtered.length&&<div className="load-more"><button onClick={()=>setVisibleCount(v=>Math.min(v+12,filtered.length))}>Muat 12 lagi <span>{filtered.length-visibleEntries.length} tersisa</span></button></div>}
    {!filtered.length&&<p className="empty-state">Belum ada entri yang cocok dengan filter atau pencarian itu.</p>}
    <article ref={detail} tabIndex="-1" className="feature-story"><div className="story-main"><Eyebrow>FOCUS STORY / {active.type?.toUpperCase()}</Eyebrow><h2>{active.title}</h2>{activeVisual&&<figure className="story-visual"><Picture src={entryAssetSrc(activeVisual)} alt={activeVisual.alt||`Object study ${active.title}`}/><figcaption><span>OBJECT STUDY</span>{activeVisual.credit||'Visual berlisensi · lihat ledger aset'}</figcaption></figure>}<div className="meta-chips"><span>{active.status==='verified'?'✓ VERIFIED':'◌ CURATED'}</span>{active.details?.station&&<span>{active.details.station}</span>}{active.details?.region&&<span>{active.details.region}</span>}{active.details?.premiere&&<span>{active.details.premiere}</span>}{active.details?.genre&&<span>{active.details.genre}</span>}</div><p className="dropcap">{active.summary}</p>{active.details?.context&&<p>{active.details.context}</p>}{active.details?.people&&<p className="people"><b>Tokoh/kredit terpilih:</b> {active.details.people}</p>}<div className="story-sources"><Eyebrow>SUMBER RISET</Eyebrow>{(active.sources||[]).map(s=><a key={s.id} href={s.url} target="_blank" rel="noreferrer"><b>{s.title}</b><small>{s.kind} · dicek {s.checkedAt}</small></a>)}</div></div><div className="story-notes"><section><span>FUN FACT</span><p>{active.factBox?.text}</p></section><section><span>SUARA NOSTALGIA</span><blockquote>“{active.quoteBox?.text}”</blockquote><small>{active.quoteBox?.attribution}</small></section><section><span>PRICE TAG</span><p>{active.priceTag?.note}</p></section></div></article>
   </section>

   <section className="credits wrap"><div><Eyebrow>VISUAL SOURCE LEDGER</Eyebrow><h2>Aset internet tetap punya nama.</h2><p>Foto diunduh saat build dari Wikimedia Commons dan disimpan lokal di folder aset hasil deployment. Tidak ada hotlink runtime ke file foto sumber. Aset vektor dibuat khusus untuk proyek ini. Batch v2.4 dan v2.5 mempunyai ledger provenance tersendiri di folder aset.</p></div><div className="credit-list">{assetCredits.map(c=><a key={c.file} href={c.url} target="_blank" rel="noreferrer"><b>{c.label}</b><span>{c.author} · {c.license}</span></a>)}</div></section>
  </main>
  <footer><img src={`${ASSET}brand-seal.svg`} alt=""/><p>Wisata Masa Lalu: Edisi Tahun 90-an | Web Engine v1.0 | © Kolektor 90an</p></footer>
 </div>;
}
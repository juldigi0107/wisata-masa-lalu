import {useEffect,useMemo,useRef,useState} from 'react';

const looks={
 tops:['Jaket denim','Kaus grafis generik','Kemeja kotak'],
 bottoms:['Jeans high-waist','Celana longgar','Rok denim'],
 extras:['Tas pinggang','Scrunchie','Jam digital generik']
};

function RadioLab(){
 const [dial,setDial]=useState(46);const [status,setStatus]=useState('Putar tuner lalu tekan salah satu cue.');const ctx=useRef(null);
 useEffect(()=>()=>{ctx.current?.close?.()},[]);
 async function audio(){const AC=window.AudioContext||window.webkitAudioContext;if(!AC){setStatus('Web Audio tidak tersedia pada perangkat ini.');return null}ctx.current??=new AC();await ctx.current.resume();return ctx.current}
 async function tone(freq,duration=.12,type='sine',gain=.025){const c=await audio();if(!c)return;const o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.setValueAtTime(freq,c.currentTime);g.gain.setValueAtTime(gain,c.currentTime);g.gain.exponentialRampToValueAtTime(.0001,c.currentTime+duration);o.connect(g);g.connect(c.destination);o.start();o.stop(c.currentTime+duration)}
 async function noise(duration=.28,gain=.016){const c=await audio();if(!c)return;const size=Math.floor(c.sampleRate*duration),buffer=c.createBuffer(1,size,c.sampleRate),data=buffer.getChannelData(0);for(let i=0;i<size;i++)data[i]=(Math.random()*2-1)*(1-i/size);const source=c.createBufferSource(),g=c.createGain();source.buffer=buffer;g.gain.value=gain;source.connect(g);g.connect(c.destination);source.start()}
 async function cue(id){
  if(id==='radio'){await noise(.18,.011);setTimeout(()=>tone(220+dial*5,.16,'sine',.017),90);setStatus('Tuner menangkap cue sintetis. Bukan rekaman stasiun historis.');return}
  if(id==='tv'){await noise(.22,.018);setTimeout(()=>tone(95,.08,'square',.012),70);setStatus('TV static original sintetis.');return}
  if(id==='phone'){await tone(440,.16,'sine',.02);setTimeout(()=>tone(480,.16,'sine',.02),180);setStatus('Ringback sintetis original.');return}
  if(id==='modem'){await tone(620,.1,'square',.018);setTimeout(()=>tone(980,.12,'sawtooth',.015),110);setTimeout(()=>noise(.28,.017),220);setStatus('Handshake-inspired sintetis; bukan sampel modem arsip.');return}
  await tone(880,.06,'square',.02);setTimeout(()=>tone(1320,.08,'square',.018),70);setStatus('Arcade blip original sintetis.');
 }
 const frequency=(88+dial/100*20).toFixed(1);
 return <div className="culture-radio"><div className="radio-face"><small>FM-STYLE / SIMULASI</small><strong>{frequency}</strong><span>MHz · dial visual</span><input aria-label="Tuner radio simulasi" type="range" min="0" max="100" value={dial} onChange={event=>setDial(Number(event.target.value))}/><button onClick={()=>cue('radio')}>SCAN CUE ↗</button></div><div className="soundboard"><p>Soundboard ini dibuat dengan Web Audio saat tombol ditekan. Tidak memakai potongan siaran, jingle merek, atau rekaman berhak cipta.</p><div>{[['tv','TV static'],['phone','Telepon'],['modem','Dial-up inspired'],['arcade','Arcade blip']].map(([id,label])=><button key={id} onClick={()=>cue(id)}>{label}<span>▶</span></button>)}</div><output aria-live="polite">{status}</output></div></div>;
}

function FashionLab(){
 const [top,setTop]=useState(looks.tops[0]);const [bottom,setBottom]=useState(looks.bottoms[0]);const [extra,setExtra]=useState(looks.extras[0]);
 function randomize(){const pick=list=>list[Math.floor(Math.random()*list.length)];setTop(pick(looks.tops));setBottom(pick(looks.bottoms));setExtra(pick(looks.extras))}
 return <div className="fashion-lab"><div className="paper-doll" aria-label={`Look: ${top}, ${bottom}, ${extra}`}><div className="look-head"/><div className="look-top"><span>{top}</span></div><div className="look-bottom"><span>{bottom}</span></div><div className="look-extra"><span>{extra}</span></div></div><div className="look-controls"><p>Ini <b>style lab original-inspired</b>, bukan klaim bahwa kombinasi ini mewakili satu tren nasional. Tujuannya membangun rasa visual 90-an tanpa menyalin katalog atau foto mode berhak cipta.</p><label>Atasan<select value={top} onChange={event=>setTop(event.target.value)}>{looks.tops.map(value=><option key={value}>{value}</option>)}</select></label><label>Bawahan<select value={bottom} onChange={event=>setBottom(event.target.value)}>{looks.bottoms.map(value=><option key={value}>{value}</option>)}</select></label><label>Aksesori<select value={extra} onChange={event=>setExtra(event.target.value)}>{looks.extras.map(value=><option key={value}>{value}</option>)}</select></label><button onClick={randomize}>ACAK LOOK ↻</button></div></div>;
}

function FilmShelf({data,onOpenEntry}){
 const films=useMemo(()=>data.entries.filter(entry=>entry.type==='film').slice(0,8),[data.entries]);
 return <div className="film-shelf"><div className="film-intro"><small>SSOT / FILM</small><h3>Rak film 90-an.</h3><p>Hanya entri bertipe film yang sudah ada di katalog aktif. Status provenance tetap ditampilkan; rak ini tidak membuat judul atau tanggal baru.</p></div>{films.length?<div className="film-card-grid">{films.map((entry,index)=><button key={entry.id} onClick={()=>onOpenEntry(entry)}><span>{String(index+1).padStart(2,'0')}</span><small>{entry.status}</small><h4>{entry.title}</h4><p>{entry.summary}</p><b>Buka dossier ↘</b></button>)}</div>:<p className="culture-empty">Belum ada entri film di SSOT aktif.</p>}</div>;
}

export default function CultureStudioV4({data,onOpenEntry}){
 const [tab,setTab]=useState('radio');
 return <section id="culture-studio" className="culture-studio wrap"><div className="section-head"><div><p className="eyebrow">08A / CULTURE STUDIO</p><h2>Radio, gaya, dan rak film.</h2></div><p>Tiga fitur yang sebelumnya tersebar kini punya ruang sendiri. Radio dan lookbook bersifat simulatif/original; Film Shelf membaca SSOT agar fakta dan provenance tetap satu sumber.</p></div><div className="culture-tabs" role="tablist" aria-label="Culture Studio"><button role="tab" aria-selected={tab==='radio'} onClick={()=>setTab('radio')}>Radio Lab</button><button role="tab" aria-selected={tab==='fashion'} onClick={()=>setTab('fashion')}>Fashion Lookbook</button><button role="tab" aria-selected={tab==='film'} onClick={()=>setTab('film')}>Film Shelf</button></div><div className="culture-stage">{tab==='radio'&&<RadioLab/>}{tab==='fashion'&&<FashionLab/>}{tab==='film'&&<FilmShelf data={data} onOpenEntry={onOpenEntry}/>}</div></section>;
}

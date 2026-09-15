import {useEffect,useRef,useState} from 'react';
import {mechanicFamilyFor} from '../../shared/mechanic-registry.js';
import SpecialMechanic from './SpecialMechanics.jsx';

const clamp=(value,min,max)=>Math.min(max,Math.max(min,value));

function useOnceComplete(onComplete){
 const done=useRef(false);
 return value=>{if(done.current)return;done.current=true;onComplete(value)};
}

function SliderMechanic({onComplete}){
 const complete=useOnceComplete(onComplete);const [value,setValue]=useState(22);const good=value>=44&&value<=60;
 return <div className="mechanic-box"><p>Geser sampai sinyal terasa stabil.</p><input aria-label="Kekuatan sinyal" type="range" min="0" max="100" value={value} onChange={e=>setValue(Number(e.target.value))}/><div className={`meter ${good?'good':''}`} aria-hidden="true"><i style={{width:`${value}%`}}/></div><output>{good?'Zona stabil ditemukan.':`Sinyal ${value}%`}</output><button disabled={!good} onClick={()=>complete(value)}>{good?'Sinyal stabil — simpan':'Cari titik yang stabil'}</button></div>;
}

function TimingMechanic({onComplete}){
 const complete=useOnceComplete(onComplete);const [value,setValue]=useState(0);const [direction,setDirection]=useState(1);const [locked,setLocked]=useState(false);
 useEffect(()=>{if(locked)return;const timer=setInterval(()=>setValue(v=>{const next=v+direction*4;if(next>=100){setDirection(-1);return 100}if(next<=0){setDirection(1);return 0}return next}),45);return()=>clearInterval(timer)},[direction,locked]);
 const score=Math.max(0,Math.round(100-Math.abs(52-value)*1.9));
 function hit(){setLocked(true);if(score>62)complete(score);else setTimeout(()=>setLocked(false),420)}
 return <div className="mechanic-box"><p>Tekan saat indikator masuk zona tengah.</p><div className="timing-track" aria-label={`Posisi indikator ${Math.round(value)} persen`}><i style={{left:`${value}%`}}/></div><button onClick={hit} disabled={locked}>{locked?`Timing ${score}`:'TEKAN'}</button><small>{locked&&score<=62?'Belum pas. Coba lagi saat indikator mendekati tengah.':'Zona terbaik berada di sekitar tengah.'}</small></div>;
}

function ComposeMechanic({onComplete,type='pesan'}){
 const complete=useOnceComplete(onComplete);const [text,setText]=useState('');
 return <div className="mechanic-box"><label>Tulis {type}<textarea maxLength="160" value={text} onChange={e=>setText(e.target.value)} placeholder="Tulis singkat seperti dulu…"/></label><small>{text.length}/160 karakter</small><button disabled={text.trim().length<3} onClick={()=>complete(text.trim())}>Lipat & simpan ↘</button></div>;
}

function ChoiceMechanic({onComplete}){const complete=useOnceComplete(onComplete);return <div className="mechanic-box choice-grid"><button onClick={()=>complete('iya')}>IYA, PERNAH</button><button onClick={()=>complete('tidak')}>TIDAK / LUPA</button></div>}

function FindMechanic({onComplete}){
 const complete=useOnceComplete(onComplete);const [checked,setChecked]=useState([]);const target=3;const spots=['bawah meja','sela sofa','balik majalah','atas lemari'];
 function inspect(index){if(checked.includes(index))return;setChecked(v=>[...v,index]);if(index===target)complete({spot:spots[index],tries:checked.length+1})}
 return <div className="mechanic-box"><p>Cari di empat tempat. Salah satunya menyimpan kejutan.</p><div className="find-grid">{spots.map((spot,index)=><button key={spot} className={checked.includes(index)?'checked':''} disabled={checked.includes(index)} onClick={()=>inspect(index)}>{checked.includes(index)&&index!==target?'Kosong · ':''}{spot}</button>)}</div><small>{checked.length?`${checked.length} tempat sudah dicek.`:'Mulai mencari.'}</small></div>;
}

function DialMechanic({onComplete}){
 const complete=useOnceComplete(onComplete);const [value,setValue]=useState(50);
 return <div className="mechanic-box"><p>Putar dial perlahan.</p><input aria-label="Posisi tuner" className="dial-range" type="range" min="0" max="100" value={value} onChange={e=>setValue(Number(e.target.value))}/><output>{value<30?'noise…':value<65?'hampir dapat…':'jernih ✦'}</output><button disabled={value<65} onClick={()=>complete(value)}>KUNCI FREKUENSI</button></div>;
}

function PhoneMechanic({onComplete}){
 const complete=useOnceComplete(onComplete);const [number,setNumber]=useState('');
 return <div className="mechanic-box phone-mechanic"><div className="phone-display" aria-live="polite">{number||'— — — — — — —'}</div><div className="phone-pad">{['1','2','3','4','5','6','7','8','9','*','0','#'].map(n=><button key={n} aria-label={`Tombol ${n}`} onClick={()=>setNumber(value=>(value+n).slice(0,10))}>{n}</button>)}</div><div className="row-actions"><button disabled={!number} onClick={()=>setNumber(value=>value.slice(0,-1))}>HAPUS</button><button disabled={number.length<5} onClick={()=>complete(number)}>HUBUNGI</button></div></div>;
}

function BillingMechanic({onComplete}){
 const complete=useOnceComplete(onComplete);const [seconds,setSeconds]=useState(0);const [running,setRunning]=useState(false);
 useEffect(()=>{if(!running)return;const timer=setInterval(()=>setSeconds(s=>s+1),1000);return()=>clearInterval(timer)},[running]);
 return <div className="mechanic-box"><div className="billing-screen"><span>DURASI</span><b>{String(Math.floor(seconds/60)).padStart(2,'0')}:{String(seconds%60).padStart(2,'0')}</b><span>BIAYA SIMULASI</span><strong>Rp {(seconds*125).toLocaleString('id-ID')}</strong></div><div className="row-actions"><button onClick={()=>setRunning(true)} disabled={running}>MULAI</button><button onClick={()=>setRunning(false)} disabled={!running}>JEDA</button><button onClick={()=>complete(seconds)} disabled={seconds<3}>SELESAI</button></div></div>;
}

function ChatMechanic({onComplete}){
 const complete=useOnceComplete(onComplete);const [messages,setMessages]=useState([{from:'operator90',text:'halo, baru masuk?'}]);const [text,setText]=useState('');const [sent,setSent]=useState(0);
 function send(){const value=text.trim();if(!value)return;setMessages(m=>[...m,{from:'kamu',text:value},{from:'anak_warnet',text:'hehe iya, salam dari bilik sebelah :D'}]);setText('');setSent(n=>{const next=n+1;if(next>=2)complete('chat');return next})}
 return <div className="mechanic-box chat-box"><div className="chat-log" aria-live="polite">{messages.map((m,i)=><p key={`${m.from}-${i}`}><b>{m.from}:</b> {m.text}</p>)}</div><div className="chat-input"><input aria-label="Pesan chat" value={text} maxLength="80" onChange={e=>setText(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'){e.preventDefault();send()}}}/><button disabled={!text.trim()} onClick={send}>KIRIM</button></div><small>{sent<2?'Kirim dua balasan untuk menyelesaikan memori.':'Percakapan tersimpan sebagai simulasi lokal.'}</small></div>;
}

function RepairMechanic({onComplete}){
 const complete=useOnceComplete(onComplete);const [progress,setProgress]=useState(0);
 return <div className="mechanic-box"><p>Putar perlahan. Jangan terlalu cepat.</p><button className="repair-wheel" aria-label="Putar gulungan kaset" onClick={()=>setProgress(p=>clamp(p+17,0,100))}>↻</button><div className="meter"><i style={{width:`${progress}%`}}/></div><output>{progress}%</output><button disabled={progress<100} onClick={()=>complete(progress)}>RAPIKAN PITA</button></div>;
}

function ArcadeMechanic({onComplete}){
 const complete=useOnceComplete(onComplete);const [score,setScore]=useState(0);const [time,setTime]=useState(8);const [running,setRunning]=useState(false);
 useEffect(()=>{if(!running||time<=0)return;const timer=setTimeout(()=>setTime(t=>t-1),1000);return()=>clearTimeout(timer)},[running,time]);
 useEffect(()=>{if(running&&time===0){setRunning(false);complete(score)}},[running,time,score]);
 function action(){if(!running){setScore(0);setTime(8);setRunning(true)}else setScore(s=>s+125)}
 return <div className="mechanic-box arcade-mechanic"><div aria-live="polite"><span>TIME {time}</span><b>{String(score).padStart(6,'0')}</b></div><button onClick={action}>{running?'HIT!':'INSERT TOKEN'}</button></div>;
}

function BuilderMechanic({onComplete}){
 const complete=useOnceComplete(onComplete);const [parts,setParts]=useState([]);const options=['judul','warna','stiker','counter'];
 return <div className="mechanic-box"><p>Rakit empat bagian kecil.</p><div className="builder-grid">{options.map(part=><button key={part} aria-pressed={parts.includes(part)} className={parts.includes(part)?'selected':''} onClick={()=>setParts(p=>p.includes(part)?p.filter(item=>item!==part):[...p,part])}>{part}</button>)}</div><button disabled={parts.length<4} onClick={()=>complete(parts)}>SIMPAN HASIL</button></div>;
}

function ShopMechanic({onComplete}){
 const complete=useOnceComplete(onComplete);const items=[['es plastik',500],['permen',100],['snack',750],['minuman',600]];const [money,setMoney]=useState(1500);const [bag,setBag]=useState([]);
 return <div className="mechanic-box"><div className="money-line">Uang saku <b>Rp {money.toLocaleString('id-ID')}</b></div><div className="shop-grid">{items.map(([name,price])=><button key={name} disabled={money<price} onClick={()=>{setMoney(m=>m-price);setBag(b=>[...b,name])}}>{name}<small>Rp {price.toLocaleString('id-ID')}</small></button>)}</div><button disabled={!bag.length} onClick={()=>complete({bag,money})}>PULANG DENGAN {bag.length} JAJANAN</button></div>;
}

function CameraMechanic({onComplete}){
 const complete=useOnceComplete(onComplete);const [frames,setFrames]=useState(3);const [shot,setShot]=useState(null);
 function snap(){if(frames<=0)return;setFrames(f=>f-1);setShot(['terlalu gelap','pas!','sedikit blur'][Math.floor(Math.random()*3)])}
 return <div className="mechanic-box camera-mechanic"><div className="camera-view" aria-live="polite"><span>{shot||`SIMULASI FILM · ${frames} FRAME TERSISA`}</span></div><button onClick={snap} disabled={frames<=0}>JEPRET</button><button onClick={()=>complete({shot,frames})} disabled={!shot}>SIMPAN FRAME</button></div>;
}

export default function GenericMechanic({trigger,onComplete}){
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

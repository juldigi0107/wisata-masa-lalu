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
 return <div className="mechanic-box"><p>Geser sampai sinyal terasa stabil.</p><input aria-label="Kekuatan sinyal" type="range" min="0" max="100" value={value} onChange={e=>setValue(Number(e.target.value))}/><div className={`meter ${good?'good':''}`} role="progressbar" aria-label="Kestabilan sinyal" aria-valuemin="0" aria-valuemax="100" aria-valuenow={value}><i style={{width:`${value}%`}}/></div><output>{good?'Zona stabil ditemukan.':`Sinyal ${value}%`}</output><button disabled={!good} onClick={()=>complete(value)}>{good?'Sinyal stabil — simpan':'Cari titik yang stabil'}</button></div>;
}

function TimingMechanic({trigger,onComplete}){
 const complete=useOnceComplete(onComplete);const [value,setValue]=useState(0);const [direction,setDirection]=useState(1);const [locked,setLocked]=useState(false);
 const isAim=trigger.mechanic==='aim';const target=isAim?62:52;const tolerance=isAim?7:12;
 useEffect(()=>{if(locked)return;const timer=setInterval(()=>setValue(v=>{const next=v+direction*4;if(next>=100){setDirection(-1);return 100}if(next<=0){setDirection(1);return 0}return next}),45);return()=>clearInterval(timer)},[direction,locked]);
 const distance=Math.abs(target-value);const score=Math.max(0,Math.round(100-distance*(isAim?3:1.9)));const good=distance<=tolerance;
 function hit(){setLocked(true);if(good)complete(score);else setTimeout(()=>setLocked(false),420)}
 return <div className={`mechanic-box ${isAim?'aim-mechanic':'timing-mechanic'}`}><p>{isAim?'Bidik ketika indikator tepat melewati titik sasaran.':'Tekan saat indikator masuk zona tengah.'}</p><div className="timing-track" role="progressbar" aria-label={isAim?'Arah bidikan':'Posisi indikator'} aria-valuemin="0" aria-valuemax="100" aria-valuenow={Math.round(value)}><i style={{left:`${value}%`}}/></div><button onClick={hit} disabled={locked}>{locked?`${isAim?'Akurasi':'Timing'} ${score}`:isAim?'BIDIK':'TEKAN'}</button><small>{locked&&!good?'Belum pas. Coba lagi ketika indikator mendekati sasaran.':isAim?'Target lebih sempit daripada timing biasa.':'Zona terbaik berada di sekitar tengah.'}</small></div>;
}

function PaceMechanic({trigger,onComplete}){
 const complete=useOnceComplete(onComplete);const [distance,setDistance]=useState(0);const [time,setTime]=useState(7);const [running,setRunning]=useState(false);const [failed,setFailed]=useState(false);
 const boost=trigger.mechanic==='chase'?18:trigger.mechanic==='race'?15:13;const label=trigger.mechanic==='chase'?'KEJAR':trigger.mechanic==='race'?'PACU':'KEMUDIKAN';
 useEffect(()=>{if(!running||time<=0)return;const timer=setTimeout(()=>setTime(t=>t-1),1000);return()=>clearTimeout(timer)},[running,time]);
 useEffect(()=>{if(running&&time===0&&distance<100){setRunning(false);setFailed(true)}},[running,time,distance]);
 function action(){
  if(!running){setDistance(0);setTime(7);setFailed(false);setRunning(true);return}
  const next=clamp(distance+boost,0,100);setDistance(next);
  if(next>=100){setRunning(false);complete({distance:next,timeLeft:time,mode:trigger.mechanic})}
 }
 return <div className="mechanic-box pace-mechanic"><p>{trigger.mechanic==='chase'?'Kejar sebelum target lepas dari pandangan.':trigger.mechanic==='race'?'Bangun ritme tap untuk mencapai garis akhir.':'Jaga laju sampai kendaraan melewati jalur sempit.'}</p><div className="pace-course" role="progressbar" aria-label="Kemajuan lintasan" aria-valuemin="0" aria-valuemax="100" aria-valuenow={distance}><i style={{width:`${distance}%`}}/><span>{distance}%</span></div><div className="pace-readout"><b>{time}s</b><small>{running?'waktu tersisa':failed?'waktu habis':'siap mulai'}</small></div><button onClick={action}>{running?label:failed?'COBA LAGI':'MULAI'}</button></div>;
}

function GestureSequenceMechanic({trigger,onComplete}){
 const complete=useOnceComplete(onComplete);
 const steps=trigger.mechanic==='fold'?['Ratakan kertas','Lipat sisi kiri','Lipat sisi kanan','Tekan garis lipatan']:trigger.mechanic==='wipe'?['Mulai dari kiri','Geser ke kanan','Turun satu baris','Bersihkan sisa kapur']:['Pegang ujungnya','Tarik perlahan','Sesuaikan arah','Selesaikan gerakan'];
 const [index,setIndex]=useState(0);
 function next(){if(index>=steps.length-1)complete({mode:trigger.mechanic,steps});else setIndex(value=>value+1)}
 return <div className="mechanic-box gesture-sequence-mechanic"><p>{trigger.mechanic==='fold'?'Ikuti urutan lipatan, satu tahap setiap kali.':trigger.mechanic==='wipe'?'Bersihkan area secara berurutan agar tidak ada yang tertinggal.':'Lakukan gerakan dengan urutan yang benar.'}</p><ol>{steps.map((step,i)=><li key={step} className={i<index?'done':i===index?'active':''}><span>{i<index?'✓':String(i+1).padStart(2,'0')}</span><b>{step}</b></li>)}</ol><button onClick={next}>{index>=steps.length-1?'SELESAIKAN ✓':`${steps[index]} →`}</button></div>;
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
 function finish(){setRunning(false);complete(seconds)}
 return <div className="mechanic-box"><div className="billing-screen"><span>DURASI</span><b>{String(Math.floor(seconds/60)).padStart(2,'0')}:{String(seconds%60).padStart(2,'0')}</b><span>BIAYA SIMULASI</span><strong>Rp {(seconds*125).toLocaleString('id-ID')}</strong></div><div className="row-actions"><button onClick={()=>setRunning(true)} disabled={running}>MULAI</button><button onClick={()=>setRunning(false)} disabled={!running}>JEDA</button><button onClick={finish} disabled={seconds<3}>SELESAI</button></div></div>;
}

function ChatMechanic({onComplete}){
 const complete=useOnceComplete(onComplete);const [messages,setMessages]=useState([{from:'operator90',text:'halo, baru masuk?'}]);const [text,setText]=useState('');const [sent,setSent]=useState(0);
 function send(){const value=text.trim();if(!value)return;setMessages(m=>[...m,{from:'kamu',text:value},{from:'anak_warnet',text:'hehe iya, salam dari bilik sebelah :D'}]);setText('');setSent(n=>{const next=n+1;if(next>=2)complete('chat');return next})}
 return <div className="mechanic-box chat-box"><div className="chat-log" aria-live="polite">{messages.map((m,i)=><p key={`${m.from}-${i}`}><b>{m.from}:</b> {m.text}</p>)}</div><div className="chat-input"><input aria-label="Pesan chat" value={text} maxLength="80" onChange={e=>setText(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'){e.preventDefault();send()}}}/><button disabled={!text.trim()} onClick={send}>KIRIM</button></div><small>{sent<2?'Kirim dua balasan untuk menyelesaikan memori.':'Percakapan tersimpan sebagai simulasi lokal.'}</small></div>;
}

function RepairMechanic({trigger,onComplete}){
 const complete=useOnceComplete(onComplete);const [progress,setProgress]=useState(0);const label=trigger.mechanic==='disk'?'PULIHKAN DATA':trigger.mechanic==='vhs'?'RAPIKAN PITA VHS':'RAPIKAN PITA';
 return <div className="mechanic-box"><p>{trigger.mechanic==='disk'?'Pulihkan blok perlahan sampai seluruh sektor simulasi terbaca.':'Putar perlahan. Jangan terlalu cepat.'}</p><button className="repair-wheel" aria-label="Putar mekanisme pemulihan" onClick={()=>setProgress(p=>clamp(p+17,0,100))}>↻</button><div className="meter" role="progressbar" aria-label="Kemajuan pemulihan" aria-valuemin="0" aria-valuemax="100" aria-valuenow={progress}><i style={{width:`${progress}%`}}/></div><output>{progress}%</output><button disabled={progress<100} onClick={()=>complete(progress)}>{label}</button></div>;
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
 const complete=useOnceComplete(onComplete);const items=[['es plastik',500],['permen',100],['snack',750],['minuman',600]];const [shop,setShop]=useState({money:1500,bag:[]});
 function buy(name,price){setShop(current=>current.money<price?current:{money:current.money-price,bag:[...current.bag,name]})}
 return <div className="mechanic-box"><div className="money-line">Uang saku <b>Rp {shop.money.toLocaleString('id-ID')}</b></div><div className="shop-grid">{items.map(([name,price])=><button key={name} disabled={shop.money<price} onClick={()=>buy(name,price)}>{name}<small>Rp {price.toLocaleString('id-ID')}</small></button>)}</div><button disabled={!shop.bag.length} onClick={()=>complete(shop)}>PULANG DENGAN {shop.bag.length} JAJANAN</button></div>;
}

function TradeMechanic({onComplete}){
 const complete=useOnceComplete(onComplete);const give=['lembar robot','stiker buah','kertas motif'];const receive=['lembar mobil','stiker bintang','kertas neon'];const [offer,setOffer]=useState('');const [pick,setPick]=useState('');
 return <div className="mechanic-box trade-mechanic"><p>Pilih satu koleksi untuk dilepas dan satu yang ingin diterima.</p><div className="trade-columns"><section><small>KAMU BERI</small>{give.map(item=><button key={item} aria-pressed={offer===item} onClick={()=>setOffer(item)}>{item}</button>)}</section><span>⇄</span><section><small>KAMU TERIMA</small>{receive.map(item=><button key={item} aria-pressed={pick===item} onClick={()=>setPick(item)}>{item}</button>)}</section></div><button disabled={!offer||!pick} onClick={()=>complete({offer,pick})}>SETUJU TUKAR ✓</button></div>;
}

function CollectMechanic({onComplete}){
 const complete=useOnceComplete(onComplete);const packs=[['A','stiker kecil'],['B','kartu angka'],['C','mainan mini']];const [opened,setOpened]=useState([]);
 function open(index){if(opened.includes(index))return;setOpened(value=>[...value,index])}
 return <div className="mechanic-box collection-mechanic"><p>Buka dua paket generik untuk membentuk koleksi kecil.</p><div className="collection-pack-grid">{packs.map(([code,reward],index)=><button key={code} disabled={opened.includes(index)} onClick={()=>open(index)}><b>{opened.includes(index)?reward:'?'}</b><small>PACK {code}</small></button>)}</div><button disabled={opened.length<2} onClick={()=>complete(opened.map(index=>packs[index][1]))}>SIMPAN KOLEKSI</button></div>;
}

function CameraMechanic({onComplete}){
 const complete=useOnceComplete(onComplete);const [frames,setFrames]=useState(3);const [shot,setShot]=useState(null);
 function snap(){if(frames<=0)return;setFrames(f=>f-1);setShot(['terlalu gelap','pas!','sedikit blur'][Math.floor(Math.random()*3)])}
 return <div className="mechanic-box camera-mechanic"><div className="camera-view" aria-live="polite"><span>{shot||`SIMULASI FILM · ${frames} FRAME TERSISA`}</span></div><button onClick={snap} disabled={frames<=0}>JEPRET</button><button onClick={()=>complete({shot,frames})} disabled={!shot}>SIMPAN FRAME</button></div>;
}

function StudioMechanic({onComplete}){
 const complete=useOnceComplete(onComplete);const [backdrop,setBackdrop]=useState('');const [pose,setPose]=useState('');
 return <div className="mechanic-box studio-choice-mechanic"><p>Pilih backdrop dan pose siluet untuk sesi studio.</p><div className="builder-grid">{['biru awan','marmer abu','merah gelap'].map(value=><button key={value} aria-pressed={backdrop===value} onClick={()=>setBackdrop(value)}>{value}</button>)}</div><div className="builder-grid">{['formal','santai','keluarga'].map(value=><button key={value} aria-pressed={pose===value} onClick={()=>setPose(value)}>{value}</button>)}</div><button disabled={!backdrop||!pose} onClick={()=>complete({backdrop,pose})}>AMBIL FOTO STUDIO</button></div>;
}

function AlbumMechanic({onComplete}){
 const complete=useOnceComplete(onComplete);const photos=['ulang tahun','piknik','sekolah','keluarga'];const [slots,setSlots]=useState([]);
 return <div className="mechanic-box album-mechanic"><p>Masukkan tiga foto ke sleeve album plastik.</p><div className="builder-grid">{photos.map(photo=><button key={photo} disabled={slots.includes(photo)||slots.length>=3} onClick={()=>setSlots(value=>[...value,photo])}>{slots.includes(photo)?'✓ ':''}{photo}</button>)}</div><div className="album-slots">{[0,1,2].map(index=><span key={index}>{slots[index]||'SLEEVE KOSONG'}</span>)}</div><button disabled={slots.length<3} onClick={()=>complete(slots)}>TUTUP ALBUM</button></div>;
}

function PrintMechanic({onComplete}){
 const complete=useOnceComplete(onComplete);const [size,setSize]=useState('');const [finish,setFinish]=useState('');
 return <div className="mechanic-box print-choice-mechanic"><p>Pilih ukuran cetak dan permukaan kertas simulasi.</p><div className="builder-grid">{['3R','4R','5R'].map(value=><button key={value} aria-pressed={size===value} onClick={()=>setSize(value)}>{value}</button>)}</div><div className="builder-grid">{['glossy','doff'].map(value=><button key={value} aria-pressed={finish===value} onClick={()=>setFinish(value)}>{value}</button>)}</div><button disabled={!size||!finish} onClick={()=>complete({size,finish})}>KIRIM KE PHOTO LAB</button></div>;
}

export default function GenericMechanic({trigger,onComplete}){
 const family=mechanicFamilyFor(trigger.mechanic);
 if(['race','chase','drive'].includes(trigger.mechanic))return <PaceMechanic trigger={trigger} onComplete={onComplete}/>;
 if(['gesture','fold','wipe'].includes(trigger.mechanic))return <GestureSequenceMechanic trigger={trigger} onComplete={onComplete}/>;
 if(trigger.mechanic==='trade')return <TradeMechanic onComplete={onComplete}/>;
 if(trigger.mechanic==='collection')return <CollectMechanic onComplete={onComplete}/>;
 if(trigger.mechanic==='studio')return <StudioMechanic onComplete={onComplete}/>;
 if(trigger.mechanic==='album')return <AlbumMechanic onComplete={onComplete}/>;
 if(trigger.mechanic==='print')return <PrintMechanic onComplete={onComplete}/>;
 if(family==='slider')return <SliderMechanic onComplete={onComplete}/>;
 if(family==='timing')return <TimingMechanic trigger={trigger} onComplete={onComplete}/>;
 if(family==='compose')return <ComposeMechanic onComplete={onComplete}/>;
 if(family==='choice')return <ChoiceMechanic onComplete={onComplete}/>;
 if(family==='find')return <FindMechanic onComplete={onComplete}/>;
 if(family==='dial')return <DialMechanic onComplete={onComplete}/>;
 if(family==='phone')return <PhoneMechanic onComplete={onComplete}/>;
 if(family==='billing')return <BillingMechanic onComplete={onComplete}/>;
 if(family==='chat')return <ChatMechanic onComplete={onComplete}/>;
 if(family==='repair')return <RepairMechanic trigger={trigger} onComplete={onComplete}/>;
 if(family==='arcade')return <ArcadeMechanic onComplete={onComplete}/>;
 if(family==='builder')return <BuilderMechanic onComplete={onComplete}/>;
 if(family==='shop')return <ShopMechanic onComplete={onComplete}/>;
 if(family==='camera')return <CameraMechanic onComplete={onComplete}/>;
 return <SpecialMechanic family={family} trigger={trigger} onComplete={onComplete}/>;
}

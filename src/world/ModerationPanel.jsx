import {useEffect,useState} from 'react';

const API=(import.meta.env.VITE_API_BASE_URL||'').replace(/\/$/,'');

export default function ModerationPanel({onClose}){
 const [token,setToken]=useState('');const [items,setItems]=useState([]);const [state,setState]=useState(API?'Masukkan token moderator untuk membuka antrean.':'Worker production belum terhubung ke frontend build ini.');const [loading,setLoading]=useState(false);const [notes,setNotes]=useState({});
 async function load(){
  if(!API){setState('API Cloudflare exact-match belum aktif. Moderasi cloud tidak tersedia pada build ini.');return}
  if(!token.trim()){setState('Token moderator diperlukan.');return}
  setLoading(true);setState('Membaca antrean moderasi…');
  try{const response=await fetch(`${API}/api/admin/memories?status=pending&limit=100`,{headers:{Authorization:`Bearer ${token.trim()}`}});const data=await response.json();if(!response.ok)throw Error(data.error||`HTTP ${response.status}`);setItems(Array.isArray(data.entries)?data.entries:[]);setState(`${data.entries?.length||0} memori menunggu keputusan.`)}catch(error){setItems([]);setState(`Antrean tidak dapat dibuka · ${error.message}`)}finally{setLoading(false)}
 }
 useEffect(()=>{const esc=event=>{if(event.key==='Escape')onClose()};window.addEventListener('keydown',esc);return()=>window.removeEventListener('keydown',esc)},[onClose]);
 async function decide(item,status){
  if(!API||!token.trim())return;setLoading(true);setState(`${status==='approved'?'Menyetujui':'Menolak'} memori…`);
  try{const response=await fetch(`${API}/api/admin/memories/${encodeURIComponent(item.id)}`,{method:'PATCH',headers:{'Content-Type':'application/json',Authorization:`Bearer ${token.trim()}`},body:JSON.stringify({status,note:notes[item.id]||''})});const data=await response.json();if(!response.ok)throw Error(data.error||`HTTP ${response.status}`);setItems(current=>current.filter(entry=>entry.id!==item.id));setState(`Memori ${status==='approved'?'disetujui':'ditolak'}. ${Math.max(0,items.length-1)} tersisa.`)}catch(error){setState(`Keputusan gagal · ${error.message}`)}finally{setLoading(false)}
 }
 return <main className="moderation-shell"><header><div><small>PRIVATE MODERATION / MEMORY WALL</small><h1>Ruang Kurator.</h1><p>Hanya memoderasi cerita komunitas. Token tidak disimpan oleh aplikasi.</p></div><button onClick={onClose}>Kembali ke dunia ×</button></header><section className="moderation-auth"><label>Moderator token<input type="password" autoComplete="off" value={token} onChange={e=>setToken(e.target.value)} placeholder="Bearer secret dari Cloudflare"/></label><button onClick={load} disabled={loading||!token.trim()}>Buka antrean</button><output role="status">{state}</output></section><section className="moderation-queue" aria-busy={loading}>{items.map(item=><article key={item.id}><div className="moderation-meta"><span>{item.memory_year||'90-an'}</span><span>{item.category}</span>{item.city&&<span>{item.city}</span>}<time>{String(item.created_at||'').slice(0,10)}</time></div><h2>{item.nickname||'Anonim 90-an'}</h2><p>{item.story}</p><label>Catatan moderator<textarea value={notes[item.id]||''} onChange={e=>setNotes({...notes,[item.id]:e.target.value})} maxLength="240" rows="2" placeholder="Opsional, tidak tampil di dinding publik"/></label><div><button className="approve" onClick={()=>decide(item,'approved')} disabled={loading}>Setujui</button><button className="reject" onClick={()=>decide(item,'rejected')} disabled={loading}>Tolak</button></div></article>)}{!items.length&&!loading&&<p className="moderation-empty">Tidak ada item yang sedang ditampilkan. Masukkan token lalu buka antrean, atau antrean pending memang sudah kosong.</p>}</section></main>;
}

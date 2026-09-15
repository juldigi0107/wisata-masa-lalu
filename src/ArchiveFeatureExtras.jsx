import {useMemo,useState} from 'react';

const verdict=percent=>percent>=80?'Anak 90-an garis keras.':percent>=50?'Memorinya masih hangat.':'Tamu kehormatan mesin waktu.';
const escapeXml=value=>String(value).replace(/[<>&'\"]/g,char=>({'<':'&lt;','>':'&gt;','&':'&amp;',"'":'&apos;','"':'&quot;'}[char]));

function boardingSvg(percent){
 const label=verdict(percent);
 return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675"><rect width="1200" height="675" fill="#161b18"/><rect x="44" y="44" width="1112" height="587" rx="30" fill="#eee3cf"/><path d="M820 44v587" stroke="#171713" stroke-width="3" stroke-dasharray="12 12"/><text x="88" y="105" fill="#457f77" font-family="monospace" font-size="20" font-weight="700" letter-spacing="4">WISATA MASA LALU / NOSTALGIA METER</text><text x="88" y="210" fill="#171713" font-family="Georgia,serif" font-size="72" font-weight="700">BOARDING PASS</text><text x="88" y="315" fill="#171713" font-family="Georgia,serif" font-size="58">${escapeXml(label)}</text><text x="88" y="392" fill="#5a5146" font-family="sans-serif" font-size="26">20 pertanyaan · pengalaman analog Indonesia 90-an</text><text x="88" y="535" fill="#5a5146" font-family="monospace" font-size="18" letter-spacing="3">GATE RUANG TAMU · KURSI LESEHAN · BAGASI KENANGAN</text><text x="872" y="128" fill="#457f77" font-family="monospace" font-size="18" font-weight="700">NOSTALGIA SCORE</text><text x="870" y="320" fill="#171713" font-family="Georgia,serif" font-size="164" font-weight="700">${percent}</text><text x="1032" y="320" fill="#171713" font-family="monospace" font-size="30">/100</text><g transform="translate(874 420)">${Array.from({length:26},(_,i)=>`<rect x="${i*9}" y="0" width="${i%3===0?5:2}" height="118" fill="#171713"/>`).join('')}</g><text x="872" y="580" fill="#5a5146" font-family="monospace" font-size="15">HASIL LOKAL · TIDAK DIKIRIM KE SERVER</text></svg>`;
}
function svgFile(percent){return new File([boardingSvg(percent)],`wisata-masa-lalu-score-${percent}.svg`,{type:'image/svg+xml'})}

export function QuizResultActions({percent}){
 const [status,setStatus]=useState('');
 function download(){const url=URL.createObjectURL(new Blob([boardingSvg(percent)],{type:'image/svg+xml'}));const link=document.createElement('a');link.href=url;link.download=`wisata-masa-lalu-score-${percent}.svg`;document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);setStatus('Boarding pass disimpan sebagai SVG.')}
 async function share(){
  const text=`Nostalgia Meter saya ${percent}/100 — ${verdict(percent)} Wisata Masa Lalu: Edisi Tahun 90-an.`;
  try{
   const file=svgFile(percent);
   if(navigator.share&&navigator.canShare?.({files:[file]})){await navigator.share({title:'Nostalgia Meter 90-an',text,files:[file]});setStatus('Boarding pass dibagikan.');return}
   if(navigator.share){await navigator.share({title:'Nostalgia Meter 90-an',text,url:location.href});setStatus('Hasil dibagikan.');return}
   await navigator.clipboard?.writeText(`${text} ${location.href}`);setStatus('Ringkasan hasil disalin ke clipboard.')
  }catch(error){if(error?.name!=='AbortError')setStatus('Fitur berbagi tidak tersedia; gunakan Simpan Boarding Pass.')}
 }
 return <div className="quiz-result-actions"><button onClick={download}>Simpan boarding pass ↓</button><button onClick={share}>Bagikan hasil ↗</button><small role="status">{status||'Dibuat sepenuhnya di perangkat; jawaban tidak dikirim ke server.'}</small></div>;
}

export function ArchiveFilterTools({query,typeFilter,statusFilter,onReset}){
 const active=Boolean(query.trim())||typeFilter!=='semua'||statusFilter!=='semua';
 if(!active)return null;
 return <div className="archive-filter-tools" role="status"><span>Filter aktif{query.trim()?` · “${query.trim()}”`:''}{typeFilter!=='semua'?` · ${typeFilter}`:''}{statusFilter!=='semua'?` · ${statusFilter}`:''}</span><button onClick={onReset}>Reset pencarian & filter</button></div>;
}

export function StoryPager({entries,active,onOpen}){
 const index=useMemo(()=>entries.findIndex(entry=>entry.id===active?.id),[entries,active?.id]);
 if(index<0||!entries.length)return null;
 const prev=index>0?entries[index-1]:null;const next=index<entries.length-1?entries[index+1]:null;
 return <nav className="story-pager" aria-label="Navigasi entri arsip"><span><b>{index+1}</b> / {entries.length} dalam hasil saat ini</span><div><button disabled={!prev} onClick={()=>prev&&onOpen(prev)}>← {prev?.title||'Sebelumnya'}</button><button disabled={!next} onClick={()=>next&&onOpen(next)}>{next?.title||'Berikutnya'} →</button></div></nav>;
}

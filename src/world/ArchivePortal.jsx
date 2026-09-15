import {useEffect,useRef,useState} from 'react';

const routeLoaders={
 full:()=>import('../ArchiveRoute.jsx'),
 context:()=>import('./ContextualArchiveRoute.jsx')
};

function ArchiveLoading({entry}){
 return <main className="archive-loading" role="status" aria-live="polite"><small>{entry?'DOSSIER / MEMBUKA KLIPING':'ARSIP / MEMBUKA LACI'}</small><h1>{entry?'Menyiapkan dossier terkait…':'Menyiapkan ensiklopedia 90-an…'}</h1><p>Kode dan layout Arsip dimuat hanya saat benar-benar diperlukan. Progress World Engine tetap tersimpan di perangkat.</p><div className="archive-loading-meter" aria-hidden="true"><i/></div></main>;
}

function ArchiveFailure({entry,error,onRetry,onClose}){
 return <main className="archive-loading archive-failure" role="alert"><small>RECOVERY / ARSIP</small><h1>Arsip belum berhasil dibuka.</h1><p>{navigator.onLine===false?'Perangkat sedang offline dan chunk Arsip belum tersimpan pada cache ini. World Engine tetap dapat digunakan.':'Koneksi atau cache browser terputus ketika modul Arsip sedang dimuat. Progress perjalanan tidak terhapus.'}</p><div className="archive-recovery-actions"><button data-autofocus onClick={onRetry}>COBA MUAT LAGI ↻</button><button onClick={()=>window.location.reload()}>MUAT ULANG APLIKASI</button><button onClick={onClose}>KEMBALI KE WORLD</button></div>{error?.message&&<details><summary>Detail teknis</summary><code>{error.message}</code></details>}{entry&&<small>Target dossier tetap: {entry.title}</small>}</main>;
}

function useArchiveModule(entry,retryToken){
 const routeKey=entry?'context':'full';
 const [state,setState]=useState({Component:null,error:null,loading:true});
 useEffect(()=>{
  let cancelled=false;
  setState({Component:null,error:null,loading:true});
  routeLoaders[routeKey]().then(module=>{
   if(cancelled)return;
   if(typeof module.default!=='function')throw Error('Modul Arsip tidak mengekspor komponen yang valid.');
   setState({Component:module.default,error:null,loading:false});
  }).catch(error=>{if(!cancelled)setState({Component:null,error,loading:false})});
  return()=>{cancelled=true};
 },[routeKey,retryToken]);
 return state;
}

export default function ArchivePortal({entry,total,onClose}){
 const returnButton=useRef(null);
 const [retryToken,setRetryToken]=useState(0);
 const {Component,error,loading}=useArchiveModule(entry,retryToken);
 useEffect(()=>{
  returnButton.current?.focus();
  return()=>setTimeout(()=>document.querySelector('.brand-ticket')?.focus(),0);
 },[]);
 return <div className="archive-mode"><div className="archive-return"><button ref={returnButton} aria-label="Kembali dari Arsip ke World Engine" onClick={onClose}>← Kembali ke dunia</button>{entry?<span>Arsip terkait: {entry.title}</span>:<span>Arsip lengkap · {total} entri</span>}</div>{loading&&<ArchiveLoading entry={entry}/>} {!loading&&error&&<ArchiveFailure entry={entry} error={error} onRetry={()=>setRetryToken(value=>value+1)} onClose={onClose}/>} {!loading&&!error&&Component&&(entry?<Component entry={entry}/>:<Component/>)}</div>;
}

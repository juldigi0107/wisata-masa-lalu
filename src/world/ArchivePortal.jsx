import {lazy,Suspense,useEffect,useRef} from 'react';

const FullArchive=lazy(()=>import('../ArchiveRoute.jsx'));
const ContextualArchive=lazy(()=>import('./ContextualArchiveRoute.jsx'));

function ArchiveLoading({entry}){
 return <main className="archive-loading" role="status"><small>{entry?'DOSSIER / MEMBUKA KLIPING':'ARSIP / MEMBUKA LACI'}</small><h1>{entry?'Menyiapkan dossier terkait…':'Menyiapkan ensiklopedia 90-an…'}</h1><p>Kode dan layout Arsip dimuat hanya saat benar-benar diperlukan. Progress World Engine tetap tersimpan di perangkat.</p></main>;
}

export default function ArchivePortal({entry,total,onClose}){
 const returnButton=useRef(null);
 useEffect(()=>{returnButton.current?.focus()},[]);
 return <div className="archive-mode"><div className="archive-return"><button ref={returnButton} onClick={onClose}>← Kembali ke dunia</button>{entry?<span>Arsip terkait: {entry.title}</span>:<span>Arsip lengkap · {total} entri</span>}</div><Suspense fallback={<ArchiveLoading entry={entry}/>}>{entry?<ContextualArchive entry={entry}/>:<FullArchive/>}</Suspense></div>;
}

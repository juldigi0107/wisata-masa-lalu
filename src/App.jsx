import {lazy,Suspense} from 'react';

const ArchiveRoute=lazy(()=>import('./ArchiveRoute.jsx'));

export default function App(){
 return <Suspense fallback={<main className="archive-loading" role="status"><small>ARSIP / MEMBUKA LACI</small><h1>Menyiapkan ensiklopedia 90-an…</h1><p>World Engine tetap aktif; kode dan layout Arsip dimuat hanya saat benar-benar diperlukan.</p></main>}><ArchiveRoute/></Suspense>;
}

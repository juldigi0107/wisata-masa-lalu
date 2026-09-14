import {decadeMoments,provenanceTiers} from './deepDive.js';

export default function DeepDiveSections({data,onOpenEntry}){
 const typeStats=data.entries.reduce((acc,entry)=>{
  acc[entry.type]=(acc[entry.type]||0)+1;
  return acc;
 },{});
 const rows=Object.entries(typeStats).sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0],'id'));
 const max=Math.max(...rows.map(([,count])=>count),1);
 const verified=data.entries.filter(entry=>entry.status==='verified').length;
 const curated=data.entries.filter(entry=>entry.status==='curated').length;
 const sourceIds=new Set(data.entries.flatMap(entry=>(entry.sources||[]).map(source=>source.id)));
 const entryMap=new Map(data.entries.map(entry=>[entry.id,entry]));

 function openMoment(moment){
  const entry=entryMap.get(moment.entryId);
  if(entry)onOpenEntry(entry);
 }

 return <>
  <section id="timeline" className="decade-section">
   <div className="wrap">
    <div className="section-head light decade-head">
     <div><p className="eyebrow">TIMELINE / 1990—1999</p><h2>Dekade bergerak cepat.</h2></div>
     <p>Milestone ini tidak berdiri sebagai fakta baru. Setiap titik menaut kembali ke entri SSOT yang memiliki status dan sumbernya sendiri.</p>
    </div>
    <div className="decade-rail" role="list" aria-label="Milestone 1990-an">
     {decadeMoments.map((moment,index)=>{
      const entry=entryMap.get(moment.entryId);
      return <button key={`${moment.year}-${moment.entryId}`} role="listitem" className="decade-card" onClick={()=>openMoment(moment)} disabled={!entry}>
       <span className="decade-index">{String(index+1).padStart(2,'0')}</span>
       <time>{moment.year}</time>
       <small>{moment.label}</small>
       <h3>{moment.title}</h3>
       <p>{moment.note}</p>
       <b>{entry?'Buka arsip terkait ↘':'Arsip belum tersedia'}</b>
      </button>;
     })}
    </div>
   </div>
  </section>

  <section id="coverage" className="coverage-section wrap">
   <div className="coverage-copy">
    <p className="eyebrow">DATA MAP / EDITORIAL COVERAGE</p>
    <h2>Bukan sekadar banyak. Harus bisa diaudit.</h2>
    <p>Grafik ini menghitung SSOT yang sedang aktif di browser. Tujuannya bukan membuat kategori terlihat seimbang secara palsu, tetapi menunjukkan area mana yang sudah padat dan mana yang masih membutuhkan riset.</p>
    <div className="coverage-kpis">
     <div><strong>{data.entries.length}</strong><span>entri</span></div>
     <div><strong>{verified}</strong><span>verified</span></div>
     <div><strong>{curated}</strong><span>curated</span></div>
     <div><strong>{sourceIds.size}</strong><span>sumber unik</span></div>
    </div>
    <div className="provenance-legend">
     {provenanceTiers.map(tier=><article key={tier.id}><span>{tier.label}</span><p>{tier.meaning}</p></article>)}
    </div>
   </div>
   <div className="coverage-chart" aria-label="Jumlah entri per kategori">
    {rows.map(([type,count])=><div className="coverage-row" key={type}>
     <div><b>{type}</b><span>{count}</span></div>
     <div className="coverage-track"><i style={{width:`${Math.max(7,count/max*100)}%`}}/></div>
    </div>)}
   </div>
  </section>
 </>;
}

import {useMemo,useState} from 'react';
import {decadeMoments,provenanceTiers} from './deepDive.js';
import {auditCatalog,editorialReadiness} from '../shared/editorial-audit.js';

const ISSUE_LABELS={
 'core-metadata':'Metadata inti','missing-source':'Tanpa sumber','invalid-source-url':'URL sumber bermasalah',
 'source-check-date':'Tanggal cek sumber','unresolved-fact-source':'Fact Box → sumber putus','fact-provenance':'Provenance Fact Box',
 'quote-metadata':'Metadata kutipan','price-evidence':'Bukti/konteks harga','no-entry-visual':'Belum punya visual entri',
 'details-context':'Konteks detail','tags':'Tag indeks','layout':'Template editorial','verified-provenance-mismatch':'Verified tidak selaras',
 'no-strong-source':'Belum ada sumber kuat'
};
const READINESS_LABELS={'release-ready':'Release-ready','solid':'Solid','needs-research':'Perlu riset','incomplete':'Belum lengkap'};

export default function DeepDiveSections({data,onOpenEntry}){
 const [readinessFilter,setReadinessFilter]=useState('improvable');
 const [issueFilter,setIssueFilter]=useState('semua');
 const audit=useMemo(()=>auditCatalog(data),[data]);
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
 const issueRows=Object.entries(audit.byIssue).sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0],'id'));
 const maxIssue=Math.max(...issueRows.map(([,count])=>count),1);
 const sourceRows=Object.entries(audit.bySourceKind).sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0],'id'));
 const maxSource=Math.max(...sourceRows.map(([,count])=>count),1);
 const yearRows=Array.from({length:10},(_,index)=>1990+index).map(year=>[year,audit.byYear[year]||0]);
 const maxYear=Math.max(...yearRows.map(([,count])=>count),1);
 const priorityQueue=audit.priorityQueue.filter(item=>{
  const readinessOkay=readinessFilter==='semua'||(readinessFilter==='improvable'?item.readiness!=='release-ready':item.readiness===readinessFilter);
  const issueOkay=issueFilter==='semua'||item.issues.includes(issueFilter);
  return readinessOkay&&issueOkay;
 }).slice(0,12);

 function openMoment(moment){
  const entry=entryMap.get(moment.entryId);
  if(entry)onOpenEntry(entry);
 }
 function openAuditEntry(item){
  const entry=entryMap.get(item.id);
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

  <section id="editorial-audit" className="audit-section">
   <div className="wrap">
    <div className="section-head audit-head">
     <div><p className="eyebrow">RUANG REDAKSI / QUALITY CONTROL</p><h2>Kenangan boleh hangat. Provenance harus dingin.</h2></div>
     <p>Skor mengukur <b>kelengkapan dokumentasi editorial</b>, bukan kebenaran sejarah. Readiness lebih ketat: verified tanpa strong-source tidak boleh disebut release-ready. Saat ini <b>{audit.verifiedNeedingStrongerEvidence}</b> verified entry masih membutuhkan penguatan sumber.</p>
    </div>

    <div className="audit-scoreboard" aria-label="Ringkasan audit editorial">
     <article className="audit-score hero-score"><small>MEAN COMPLETENESS</small><strong>{audit.meanScore}</strong><span>/100</span><p>Rata-rata kesiapan struktur dokumentasi.</p></article>
     <article className="audit-score"><small>RELEASE-READY</small><strong>{audit.releaseReady}</strong><span>entri</span><p>Nol issue terdeteksi dan evidence gate terpenuhi.</p></article>
     <article className="audit-score"><small>SOLID / IMPROVABLE</small><strong>{audit.solidButIncomplete}</strong><span>entri</span><p>Layak ditampilkan, tetapi masih ada gap non-blocking seperti visual.</p></article>
     <article className="audit-score alert"><small>NEEDS RESEARCH</small><strong>{audit.needsAttention}</strong><span>entri</span><p>Prioritas evidence/provenance sebelum disebut matang.</p></article>
    </div>

    <div className="audit-grid">
     <article className="audit-panel research-queue">
      <div className="audit-panel-head"><div><span>01</span><h3>Antrean perbaikan</h3></div><p>Urutan dimulai dari blocker, verified tanpa strong-source, lalu gap non-blocking dan skor terendah.</p></div>
      <div className="audit-controls">
       <label>Kesiapan<select value={readinessFilter} onChange={event=>setReadinessFilter(event.target.value)}><option value="improvable">Semua yang perlu diperbaiki</option><option value="semua">Semua</option><option value="release-ready">Release-ready</option><option value="solid">Solid</option><option value="needs-research">Perlu riset</option><option value="incomplete">Belum lengkap</option></select></label>
       <label>Gap<select value={issueFilter} onChange={event=>setIssueFilter(event.target.value)}><option value="semua">Semua gap</option>{issueRows.map(([issue,count])=><option value={issue} key={issue}>{ISSUE_LABELS[issue]||issue} · {count}</option>)}</select></label>
      </div>
      <div className="queue-list">
       {priorityQueue.length?priorityQueue.map((item,index)=><button className="queue-item" key={item.id} onClick={()=>openAuditEntry(item)}>
        <span className="queue-rank">{String(index+1).padStart(2,'0')}</span>
        <span className="queue-copy"><b>{item.title}</b><small>{item.type} · {item.status} · {READINESS_LABELS[item.readiness]} · {item.strongSourceCount} strong source</small><em>{item.issues.slice(0,3).map(issue=>ISSUE_LABELS[issue]||issue).join(' · ')||'Tidak ada gap terdeteksi'}</em></span>
        <span className={`queue-score ${item.readiness}`}>{item.completenessScore}</span>
       </button>):<p className="audit-empty">Tidak ada entri pada kombinasi filter ini.</p>}
      </div>
     </article>

     <article className="audit-panel issue-map">
      <div className="audit-panel-head"><div><span>02</span><h3>Peta gap editorial</h3></div><p>Semakin panjang bar, semakin banyak entri yang membutuhkan perhatian pada aspek tersebut.</p></div>
      <div className="micro-bars">{issueRows.map(([issue,count])=><div className="micro-row" key={issue}><div><b>{ISSUE_LABELS[issue]||issue}</b><span>{count}</span></div><i><u style={{width:`${Math.max(4,count/maxIssue*100)}%`}}/></i></div>)}</div>
     </article>

     <article className="audit-panel source-map">
      <div className="audit-panel-head"><div><span>03</span><h3>DNA sumber</h3></div><p>Jenis sumber dihitung per entri yang menggunakannya; strong-source membantu readiness tetapi tidak otomatis membuktikan semua klaim.</p></div>
      <div className="micro-bars compact">{sourceRows.map(([kind,count])=><div className="micro-row" key={kind}><div><b>{kind}</b><span>{count}</span></div><i><u style={{width:`${Math.max(5,count/maxSource*100)}%`}}/></i></div>)}</div>
     </article>

     <article className="audit-panel year-map">
      <div className="audit-panel-head"><div><span>04</span><h3>Jejak dekade</h3></div><p>Indeks tahun hanya membaca sinyal tahun eksplisit yang sudah tertulis pada metadata/fact box; bukan klaim kronologi baru.</p></div>
      <div className="year-grid">{yearRows.map(([year,count])=><div className={count?'year-cell active':'year-cell'} key={year}><time>{year}</time><strong>{count}</strong><span>entri</span><i style={{height:`${Math.max(4,count/maxYear*100)}%`}}/></div>)}</div>
     </article>
    </div>

    <p className="audit-disclaimer"><b>Interpretasi readiness:</b> {Object.entries(editorialReadiness).map(([key,value],index)=><span key={key}>{index?' · ':''}<strong>{READINESS_LABELS[key]}</strong> — {value}</span>)}</p>
   </div>
  </section>
 </>;
}

const BASE=import.meta.env.BASE_URL||'/';
const visualSrc=asset=>asset?.path?(asset.path.startsWith('/assets/')?`${BASE}${asset.path.replace(/^\//,'')}`:asset.path):'';
const titleCase=value=>String(value||'').replaceAll(/([A-Z])/g,' $1').replace(/^./,char=>char.toUpperCase());

export default function ContextualArchivePage({entry}){
 const visual=(entry.assets||[]).find(asset=>asset.kind==='image'&&asset.path);
 const details=Object.entries(entry.details||{}).filter(([,value])=>value!==''&&value!==null&&value!==undefined);
 const sources=entry.sources||[];
 const status=String(entry.status||'curated').toLowerCase();
 const factStatus=String(entry.factBox?.status||entry.status||'curated').toLowerCase();
 const sourceKinds=[...new Set(sources.map(source=>source.kind).filter(Boolean))];
 const checkedDates=sources.map(source=>source.checkedAt).filter(Boolean).sort();
 const latestChecked=checkedDates.at(-1)||null;
 return <article className="context-entry-page">
  <header className="context-entry-hero" id="dossier-top">
   <div className="context-entry-copy">
    <p className="world-eyebrow">CONTEXTUAL ENCYCLOPEDIA / {status.toUpperCase()}</p>
    <span className="context-entry-type">{entry.type} · {entry.layout}</span>
    <h1>{entry.title}</h1>
    <p className="context-entry-summary">{entry.summary}</p>
    <div className="context-entry-tags">{(entry.tags||[]).slice(0,8).map(tag=><span key={tag}>{tag}</span>)}</div>
    <div className="context-entry-provenance" aria-label="Ringkasan provenance">
     <span className={`provenance-status status-${status}`}><b>{status}</b><small>status entri</small></span>
     <span><b>{sources.length}</b><small>sumber</small></span>
     <span><b>{sourceKinds.length||'—'}</b><small>jenis sumber</small></span>
     <span><b>{latestChecked||'—'}</b><small>cek terakhir</small></span>
    </div>
   </div>
   <div className={`context-entry-visual ${visual?'has-image':'abstract'}`}>{visual?<img src={visualSrc(visual)} alt={visual.alt||entry.title}/>:<><i/><b>{entry.title.slice(0,2).toUpperCase()}</b><small>VISUAL ARSIP BELUM TERSEDIA<br/>FAKTA TETAP DAPAT DITELUSURI</small></>}</div>
  </header>

  <nav className="context-local-nav" aria-label="Navigasi dossier">
   <a href="#dossier-fact">Fakta</a><a href="#dossier-context">Konteks</a><a href="#dossier-price">Harga</a><a href="#dossier-sources">Sumber</a><a href="#dossier-top">↑ Atas</a>
  </nav>

  <section className="context-entry-body" aria-label="Isi dossier">
   <article className="context-fact" id="dossier-fact"><small>FACT BOX / STATUS {factStatus.toUpperCase()}</small><p>{entry.factBox?.text||entry.summary}</p><span>{factStatus}</span><footer>{entry.factBox?.sourceIds?.length?`${entry.factBox.sourceIds.length} rujukan langsung ditautkan ke Fact Box.`:'Fact Box mengikuti status dan provenance entri; belum ada source ID langsung yang dicantumkan.'}</footer></article>
   <blockquote className="context-quote"><p>“{entry.quoteBox?.text||'Kenangan personal dapat berbeda untuk setiap orang.'}”</p><cite>{entry.quoteBox?.attribution||'Catatan editorial'}</cite>{entry.quoteBox?.kind&&<small>{entry.quoteBox.kind}</small>}</blockquote>
   <div className="context-details" id="dossier-context"><small>DETAIL / KONTEKS</small>{details.length?details.map(([key,value])=><div key={key}><span>{titleCase(key)}</span><b>{String(value)}</b></div>):<p className="context-empty-note">Detail tambahan belum tersedia. Dossier tetap menampilkan fakta inti dan provenance yang ada.</p>}</div>
   <article className="context-price" id="dossier-price"><small>HARGA / CATATAN</small><h3>{entry.priceTag?.label||'Harga nostalgia'}</h3><p>{entry.priceTag?.note||'Tidak ada angka yang ditampilkan tanpa bukti harga yang cukup.'}</p><span>{entry.priceTag?.basis||'unknown'}</span></article>
  </section>

  <section className="context-source-room" id="dossier-sources">
   <div><p className="world-eyebrow">SOURCE ROOM</p><h2>Jejaknya harus bisa diperiksa.</h2><p>Fakta dipisahkan dari interpretasi nostalgia. Status entri tidak berarti semua klaim memiliki kekuatan bukti yang sama; buka sumber untuk membaca konteks aslinya.</p><div className="source-room-summary"><span><b>{sources.length}</b> sumber terdaftar</span><span><b>{sourceKinds.join(' · ')||'jenis belum ditandai'}</b></span>{latestChecked&&<span>cek terbaru <b>{latestChecked}</b></span>}</div></div>
   <div className="context-source-list">{sources.length?sources.map((source,index)=><a key={source.id||source.url} href={source.url} target="_blank" rel="noreferrer"><span>{String(index+1).padStart(2,'0')}</span><b>{source.title}</b><small>{source.kind||'source'} · dicek {source.checkedAt||'—'}</small><i>↗</i></a>):<div className="source-empty"><b>Sumber publik belum terdaftar.</b><p>Entri ini tidak akan diberi kesan terverifikasi lebih kuat daripada metadata yang tersedia.</p></div>}</div>
  </section>
 </article>;
}

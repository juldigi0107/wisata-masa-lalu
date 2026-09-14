const BASE=import.meta.env.BASE_URL||'/';
const visualSrc=asset=>asset?.path?(asset.path.startsWith('/assets/')?`${BASE}${asset.path.replace(/^\//,'')}`:asset.path):'';

export default function ContextualArchivePage({entry}){
 const visual=(entry.assets||[]).find(asset=>asset.kind==='image'&&asset.path);
 const details=Object.entries(entry.details||{}).filter(([,value])=>value!==''&&value!==null&&value!==undefined);
 return <article className="context-entry-page">
  <header className="context-entry-hero">
   <div className="context-entry-copy"><p className="world-eyebrow">CONTEXTUAL ENCYCLOPEDIA / {String(entry.status||'curated').toUpperCase()}</p><span className="context-entry-type">{entry.type} · {entry.layout}</span><h1>{entry.title}</h1><p className="context-entry-summary">{entry.summary}</p><div className="context-entry-tags">{(entry.tags||[]).slice(0,8).map(tag=><span key={tag}>{tag}</span>)}</div></div>
   <div className={`context-entry-visual ${visual?'has-image':'abstract'}`}>{visual?<img src={visualSrc(visual)} alt={visual.alt||entry.title}/>:<><i/><b>{entry.title.slice(0,2).toUpperCase()}</b><small>VISUAL ARSIP BELUM TERSEDIA<br/>FAKTA TETAP DAPAT DITELUSURI</small></>}</div>
  </header>

  <section className="context-entry-body">
   <article className="context-fact"><small>FACT BOX / TERVERIFIKASI SESUAI STATUS SUMBER</small><p>{entry.factBox?.text||entry.summary}</p><span>{entry.factBox?.status||entry.status}</span></article>
   <blockquote className="context-quote"><p>“{entry.quoteBox?.text||'Kenangan personal dapat berbeda untuk setiap orang.'}”</p><cite>{entry.quoteBox?.attribution||'Catatan editorial'}</cite></blockquote>
   <div className="context-details"><small>DETAIL / KONTEKS</small>{details.map(([key,value])=><div key={key}><span>{key.replaceAll(/([A-Z])/g,' $1')}</span><b>{String(value)}</b></div>)}</div>
   <article className="context-price"><small>HARGA / CATATAN</small><h3>{entry.priceTag?.label||'Harga nostalgia'}</h3><p>{entry.priceTag?.note||'Tidak ada angka yang ditampilkan tanpa bukti harga yang cukup.'}</p><span>{entry.priceTag?.basis||'unknown'}</span></article>
  </section>

  <section className="context-source-room"><div><p className="world-eyebrow">SOURCE ROOM</p><h2>Jejaknya harus bisa diperiksa.</h2><p>Fakta dipisahkan dari interpretasi nostalgia. Buka sumber di bawah untuk memeriksa konteks aslinya.</p></div><div className="context-source-list">{(entry.sources||[]).map((source,index)=><a key={source.id||source.url} href={source.url} target="_blank" rel="noreferrer"><span>{String(index+1).padStart(2,'0')}</span><b>{source.title}</b><small>{source.kind||'source'} · dicek {source.checkedAt||'—'}</small><i>↗</i></a>)}</div></section>
 </article>;
}

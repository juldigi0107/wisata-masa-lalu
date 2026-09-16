import {useMemo,useState} from 'react';
import {memoryCities,memoryCityById} from '../../shared/location-memory.js';
import {getTrigger} from '../../shared/memory-triggers.js';

export default function LocationMemoryMap({year,onUseCity}){
 const [activeId,setActiveId]=useState('jakarta');
 const city=memoryCityById(activeId);
 const memories=useMemo(()=>city.triggerIds.map(getTrigger).filter(Boolean),[city]);
 return <section className="location-memory-map" aria-labelledby="location-memory-title">
  <header><div><small>PETA KENANGAN / INDONESIA</small><h3 id="location-memory-title">Tempat adalah pemicu.</h3></div><p>Pilih kota sebagai <b>lensa eksplorasi editorial</b>. Tema di bawah tidak menyatakan semua warga kota itu mengalami hal yang sama pada {year}; ia membantu memulai ingatan tanpa mengarang sejarah lokal.</p></header>
  <div className="memory-map-stage" role="group" aria-label="Pilih kota atau wilayah kenangan">
   <div className="map-islands" aria-hidden="true"><i/><i/><i/><i/><i/></div>
   {memoryCities.map(item=><button key={item.id} className={item.id===activeId?'active':''} style={{'--x':`${item.x}%`,'--y':`${item.y}%`}} aria-pressed={item.id===activeId} onClick={()=>setActiveId(item.id)}><span/><b>{item.name}</b></button>)}
  </div>
  <article className="location-lens">
   <div className="location-title"><small>{city.region} · MEMORY LENS</small><h3>{city.name}</h3><p>{city.mood}</p></div>
   <div className="location-themes">{city.themes.map(theme=><span key={theme}>{theme}</span>)}</div>
   <div className="location-route"><small>COBA MULAI DARI</small>{memories.map((memory,index)=><div key={memory.id}><i>{String(index+1).padStart(2,'0')}</i><span><b>{memory.title}</b><small>{memory.scene} · {memory.category}</small></span></div>)}</div>
   <button className="location-use" onClick={()=>onUseCity(city.name)}>GUNAKAN {city.name.toUpperCase()} UNTUK CERITAKU ↘</button>
  </article>
 </section>;
}

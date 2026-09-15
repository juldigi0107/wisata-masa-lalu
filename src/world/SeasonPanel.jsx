import {seasonalModes} from '../../shared/world-v4-experience.js';
import {DialogSurface} from './FeaturePanelsV2.jsx';

const icon={normal:'○',ramadan:'☾',lebaran:'◇',agustusan:'▥',minggu:'☀','malam-minggu':'◐'};

export default function SeasonPanel({active,onSelect,onClose}){
 const modes=Object.values(seasonalModes);
 return <DialogSurface className="season-panel deep-panel" label="Portal suasana 90-an" onClose={onClose}>
  <button className="panel-close" onClick={onClose} aria-label="Tutup portal suasana">×</button>
  <p className="world-eyebrow">TEMPORAL MOOD / SEASONAL EXPERIENCE</p>
  <h2>Pilih suasana, bukan tema dekoratif.</h2>
  <p className="season-intro">Mode mengubah kurasi memori, random event, ambience visual dan cara dunia memprioritaskan aktivitas. Ia tidak mengarang jadwal sejarah yang tidak punya sumber.</p>
  <div className="season-list" role="list">
   {modes.map(mode=><button key={mode.id} className={active===mode.id?'active':''} aria-pressed={active===mode.id} onClick={()=>onSelect(mode.id)}>
    <span aria-hidden="true">{icon[mode.id]||'○'}</span><div><small>{mode.eyebrow}</small><b>{mode.label}</b><p>{mode.note}</p></div><i>↘</i>
   </button>)}
  </div>
  <small className="season-disclaimer">Semua visual seasonal bersifat interpretasi original. Fakta historis tetap berasal dari SSOT dan sumber di Contextual Archive.</small>
 </DialogSurface>;
}

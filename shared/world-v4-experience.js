import {getTrigger} from './memory-triggers.js';

export const seasonalModes={
 normal:{id:'normal',label:'Mode normal',eyebrow:'MEMORI HARI INI',note:'Kurasi harian lintas tema 90-an.',accent:'neutral',scene:'rumah',triggers:[]},
 ramadan:{id:'ramadan',label:'Ramadan 90-an',eyebrow:'SEASONAL MEMORY / RAMADAN',note:'Kurasi pengalaman untuk suasana Ramadan; bukan rekonstruksi jadwal historis.',accent:'emerald',scene:'kampung',route:['penjual-keliling','magrib','suara-malam','kartu-lebaran','radio-tuner'],triggers:['magrib','kartu-lebaran','suara-malam','penjual-keliling','radio-tuner']},
 lebaran:{id:'lebaran',label:'Lebaran di Kampung',eyebrow:'SEASONAL MEMORY / LEBARAN',note:'Ritual silaturahmi, kartu ucapan, foto keluarga, THR dan perjalanan pulang dalam treatment nostalgia original.',accent:'gold',scene:'rumah',route:['kartu-lebaran','album-keluarga','kamera-36-frame','surat-pos','telepon-rumah'],triggers:['kartu-lebaran','album-keluarga','kamera-36-frame','surat-pos','telepon-rumah']},
 agustusan:{id:'agustusan',label:'Kampung Merdeka',eyebrow:'SEASONAL MEMORY / 17 AGUSTUS',note:'Kurasi permainan dan suasana perayaan; bukan klaim bahwa semua aktivitas terjadi di setiap daerah.',accent:'red',scene:'kampung',route:['upacara','kelereng','gasing','bentengan','pistol-air'],triggers:['upacara','bentengan','kelereng','gasing','pistol-air']},
 minggu:{id:'minggu',label:'Minggu Pagi',eyebrow:'SEASONAL MEMORY / HARI MINGGU',note:'Ritme santai dari TV pagi, main di luar, radio dan jalan sore.',accent:'sky',scene:'rumah',route:['tv-tabung','channel-surfing','radio-tuner','kelereng','album-keluarga'],triggers:['tv-tabung','channel-surfing','radio-tuner','kelereng','album-keluarga']},
 'malam-minggu':{id:'malam-minggu',label:'Malam Minggu',eyebrow:'SEASONAL MEMORY / MALAM MINGGU',note:'Kurasi telepon teman, radio, rental, arcade dan jalan kota—tanpa memaksakan satu gaya hidup untuk semua orang.',accent:'violet',scene:'kota',route:['telepon-rumah','radio-tuner','malam-minggu','mesin-arcade','rumor-cheat-code'],triggers:['malam-minggu','telepon-rumah','radio-tuner','mesin-arcade','rumor-cheat-code']}
};

export const achievementSemantics={
 'anak-kaset-sejati':{description:'Tuntaskan lima ritual kaset dan player portabel.',triggerIds:['tape-recorder','side-a-b','kaset-kusut','pensil-kaset','mixtape-maker','walkman-simulator'],target:5},
 'penguasa-wartel':{description:'Tuntaskan panggilan Wartel dan billing-nya.',triggerIds:['wartel','billing-wartel'],target:2},
 'raja-dingdong':{description:'Kuasai mesin arcade, token, dan papan high score.',triggerIds:['mesin-arcade','token-arcade','high-score'],target:3},
 'pemburu-layangan':{description:'Tuntaskan lima aksi bidik, timing, atau kejar dalam permainan lapangan.',category:'permainan',mechanics:['timing','chase','aim'],target:5},
 'penjelajah-waktu':{description:'Kunjungi seluruh tahun 1990–1999.',kind:'years',target:10},
 'keliling-kota':{description:'Kunjungi lima area utama.',kind:'scenes',target:5}
};

const safeSeed=value=>Math.min(.999999,Math.max(0,Number.isFinite(Number(value))?Number(value):0));
const clamp01=(value,fallback)=>Number.isFinite(Number(value))?Math.min(1,Math.max(0,Number(value))):fallback;

export function sanitizeWorldSettings(raw={}){
 const source=raw&&typeof raw==='object'?raw:{};
 const intensity=['ringan','imersif','total'].includes(source.intensity)?source.intensity:'imersif';
 return {
  master:clamp01(source.master,.7),
  ambience:clamp01(source.ambience,.55),
  ui:clamp01(source.ui,.75),
  mute:Boolean(source.mute),
  intensity
 };
}

export function getSeasonalMemory(mode,seed=.5){
 const config=seasonalModes[mode]||seasonalModes.normal;
 if(!config.triggers.length)return null;
 const ids=config.triggers.filter(id=>Boolean(getTrigger(id)));
 if(!ids.length)return null;
 return getTrigger(ids[Math.floor(safeSeed(seed)*ids.length)])||null;
}

export function getSeasonalRoute(mode){
 const config=seasonalModes[mode]||seasonalModes.normal;
 return (config.route||config.triggers||[]).map(getTrigger).filter(Boolean);
}

export function getSeasonalEvent(mode,seed=Math.random()){
 const config=seasonalModes[mode]||seasonalModes.normal;
 const trigger=getSeasonalMemory(mode,seed);
 if(!trigger)return null;
 return {id:`season-${mode}-${trigger.id}`,label:`${config.label} · ${trigger.title}`,scene:trigger.scene,trigger:trigger.id,seasonal:true};
}

function semanticFor(item){return {...item,...(achievementSemantics[item.id]||{})}}

function countAchievement(item,completedSet,triggers,visitedScenes,visitedYears){
 if(item.kind==='scenes')return new Set(visitedScenes).size;
 if(item.kind==='years')return new Set(visitedYears.map(Number)).size;
 if(Array.isArray(item.triggerIds)&&item.triggerIds.length)return item.triggerIds.filter(id=>completedSet.has(id)).length;
 return triggers.filter(trigger=>{
  if(!completedSet.has(trigger.id))return false;
  if(item.category&&trigger.category!==item.category)return false;
  if(Array.isArray(item.mechanics)&&item.mechanics.length&&!item.mechanics.includes(trigger.mechanic))return false;
  return Boolean(item.category||item.mechanics?.length);
 }).length;
}

export function buildAchievementProgress(achievementList,{completed=[],visitedScenes=[],visitedYears=[]}={}){
 const completedSet=new Set(completed);
 const completedTriggers=completed.map(getTrigger).filter(Boolean);
 return achievementList.map(base=>{
  const item=semanticFor(base);
  const raw=countAchievement(item,completedSet,completedTriggers,visitedScenes,visitedYears);
  const current=Math.min(raw,item.target);
  return {...item,current,remaining:Math.max(0,item.target-current),unlocked:current>=item.target,percent:item.target?Math.round(current/item.target*100):100};
 });
}

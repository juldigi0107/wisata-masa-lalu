import {getTrigger} from './memory-triggers.js';

export const seasonalModes={
 normal:{id:'normal',label:'Mode normal',eyebrow:'MEMORI HARI INI',note:'Kurasi harian lintas tema 90-an.',triggers:[]},
 ramadan:{id:'ramadan',label:'Ramadan 90-an',eyebrow:'SEASONAL MEMORY / RAMADAN',note:'Kurasi pengalaman untuk suasana Ramadan; bukan rekonstruksi jadwal historis.',triggers:['magrib','kartu-lebaran','suara-malam','penjual-keliling','radio-tuner']},
 agustusan:{id:'agustusan',label:'Kampung Merdeka',eyebrow:'SEASONAL MEMORY / AGUSTUSAN',note:'Kurasi permainan dan suasana perayaan; bukan klaim bahwa semua aktivitas terjadi di setiap daerah.',triggers:['upacara','bentengan','kelereng','gasing','pistol-air']}
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

export function getSeasonalEvent(mode,seed=Math.random()){
 const config=seasonalModes[mode]||seasonalModes.normal;
 const trigger=getSeasonalMemory(mode,seed);
 if(!trigger)return null;
 return {id:`season-${mode}-${trigger.id}`,label:`${config.label} · ${trigger.title}`,scene:trigger.scene,trigger:trigger.id,seasonal:true};
}

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
 return achievementList.map(item=>{
  const raw=countAchievement(item,completedSet,completedTriggers,visitedScenes,visitedYears);
  const current=Math.min(raw,item.target);
  return {...item,current,remaining:Math.max(0,item.target-current),unlocked:current>=item.target,percent:item.target?Math.round(current/item.target*100):100};
 });
}

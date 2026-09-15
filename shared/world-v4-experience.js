import {getTrigger} from './memory-triggers.js';

export const seasonalModes={
 normal:{id:'normal',label:'Mode normal',eyebrow:'MEMORI HARI INI',note:'Kurasi harian lintas tema 90-an.',triggers:[]},
 ramadan:{id:'ramadan',label:'Ramadan 90-an',eyebrow:'SEASONAL MEMORY / RAMADAN',note:'Kurasi pengalaman untuk suasana Ramadan; bukan rekonstruksi jadwal historis.',triggers:['magrib','kartu-lebaran','suara-malam','penjual-keliling','radio-tuner']},
 agustusan:{id:'agustusan',label:'Kampung Merdeka',eyebrow:'SEASONAL MEMORY / AGUSTUSAN',note:'Kurasi permainan dan suasana perayaan; bukan klaim bahwa semua aktivitas terjadi di setiap daerah.',triggers:['upacara','bentengan','kelereng','gasing','pistol-air']}
};

const safeSeed=value=>Math.min(.999999,Math.max(0,Number.isFinite(Number(value))?Number(value):0));

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

export function buildAchievementProgress(achievementList,{completed=[],visitedScenes=[],visitedYears=[]}={}){
 const categoryCounts=completed.reduce((acc,id)=>{const trigger=getTrigger(id);if(trigger)acc[trigger.category]=(acc[trigger.category]||0)+1;return acc},{});
 return achievementList.map(item=>{
  let current=0;
  if(item.kind==='scenes')current=new Set(visitedScenes).size;
  else if(item.kind==='years')current=new Set(visitedYears.map(Number)).size;
  else if(item.category)current=categoryCounts[item.category]||0;
  return {...item,current:Math.min(current,item.target),unlocked:current>=item.target};
 });
}

import {scenes} from './world-model.js';

const tiers=[
 {threshold:3,name:'Jejak',message:({object})=>`${object.label} bereaksi lagi. ${object.hint}`},
 {threshold:5,name:'Resonansi',message:({object,scene})=>`Kamu kembali ke ${object.label}. Detail kecil dari ${scene.label} mulai terasa semakin familiar.`},
 {threshold:7,name:'Lapisan Tersembunyi',message:({object})=>`Ada ritual lain di balik ${object.label}. Coba kembali pada waktu atau mode nostalgia yang berbeda.`},
 {threshold:11,name:'Memori Dalam',message:({object,scene})=>`${object.label} menjadi anchor memori di ${scene.label}. Dunia mengingat bahwa kamu berkali-kali kembali ke titik yang sama.`},
 {threshold:17,name:'Arsip Rahasia',message:({object})=>`Secret layer penuh untuk ${object.label} terbuka. Kamu menemukan sesuatu yang hanya muncul setelah benar-benar menjelajah, bukan sekali klik.`}
];

export const easterEggs=Object.values(scenes).flatMap(scene=>scene.objects.flatMap(object=>tiers.map((tier,index)=>({
 id:`${scene.id}-${object.id}-${tier.threshold}`,
 scene:scene.id,
 object:object.id,
 objectLabel:object.label,
 threshold:tier.threshold,
 tier:index+1,
 tierName:tier.name,
 label:`${tier.name} · ${object.label}`,
 message:tier.message({object,scene})
}))));

export const easterEggCount=easterEggs.length;
export const easterEggByKey=new Map(easterEggs.map(item=>[`${item.scene}:${item.object}:${item.threshold}`,item]));
export function easterEggFor(sceneId,objectId,count){return easterEggByKey.get(`${sceneId}:${objectId}:${count}`)||null}
export function objectIdFromLabel(sceneId,label){return scenes[sceneId]?.objects.find(item=>item.label===label)?.id||null}

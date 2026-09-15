import {scenes} from './world-model.js';

const thresholds=[3,5,7];
const messages=[
 'Benda ini rupanya masih ingat sentuhanmu.',
 'Ada lapisan memori lain di balik benda yang sama.',
 'Secret layer terbuka. Kamu terlalu lama hidup di tahun 90-an.'
];

export const easterEggs=Object.values(scenes).flatMap(scene=>scene.objects.flatMap(object=>thresholds.map((threshold,index)=>({
 id:`${scene.id}-${object.id}-${threshold}`,
 scene:scene.id,
 object:object.id,
 objectLabel:object.label,
 threshold,
 tier:index+1,
 label:index===2?`Secret ${object.label}`:`Jejak ${object.label} ${index+1}`,
 message:messages[index]
}))));

export const easterEggCount=easterEggs.length;
export const easterEggByKey=new Map(easterEggs.map(item=>[`${item.scene}:${item.object}:${item.threshold}`,item]));

export function easterEggFor(sceneId,objectId,count){
 return easterEggByKey.get(`${sceneId}:${objectId}:${count}`)||null;
}

export function objectIdFromLabel(sceneId,label){
 return scenes[sceneId]?.objects.find(item=>item.label===label)?.id||null;
}

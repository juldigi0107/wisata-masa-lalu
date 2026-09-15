const normalize=value=>String(value||'').toLocaleLowerCase('id').replace(/[^a-z0-9\s-]/g,' ').replace(/\s+/g,' ').trim();

export const memoryIntents=[
 {id:'es-plastik',phrases:['jajanan plastik yang digigit ujungnya','es plastik digigit','es dalam plastik','es lilin'],terms:['es','plastik','kantin','jajanan']},
 {id:'pensil-kaset',phrases:['kaset diputar pakai pensil','gulung kaset pakai pensil','kaset kusut pensil','pita kaset keluar'],terms:['kaset','pensil','pita','rewind']},
 {id:'dialup-modem',phrases:['internet bunyi aneh sebelum nyambung','internet bunyi kresek','modem bunyi','internet telepon rumah'],terms:['dial up','modem','internet','telepon']},
 {id:'telepon-koin',phrases:['telepon pakai koin','telepon umum koin','masukin koin telepon'],terms:['telepon umum','koin','komunikasi']},
 {id:'remote-hilang',phrases:['remote hilang di sofa','remote bawah bantal','remote nyelip'],terms:['remote','sofa','tv']},
 {id:'tv-semut',phrases:['tv banyak semut','layar semut','televisi tidak ada sinyal','tv noise'],terms:['tv','semut','antena','sinyal']},
 {id:'setting-antena',phrases:['antena diputar','benerin antena tv','pegang antena supaya jernih'],terms:['antena','tv','sinyal']},
 {id:'buku-biodata',phrases:['buku isi biodata teman','buku kenangan sekolah','isi biodata teman'],terms:['biodata','sekolah','teman']},
 {id:'surat-rahasia',phrases:['surat kecil buat teman','surat rahasia di kelas','kertas lipat buat gebetan'],terms:['surat','kelas','teman']},
 {id:'warung-bon',phrases:['ngutang di warung','catat bon warung','bon dulu bayar nanti'],terms:['warung','bon','utang']},
 {id:'layangan-putus',phrases:['ngejar layangan putus','layangan putus dikejar','kejar layangan'],terms:['layangan','lapangan','kampung']},
 {id:'warnet-billing',phrases:['waktu warnet hampir habis','billing warnet','main internet per jam'],terms:['warnet','billing','internet']},
 {id:'chat-room',phrases:['chat pakai nickname','ruang chat internet','kenalan di chat room'],terms:['chat','nickname','internet']},
 {id:'foto-gagal',phrases:['foto baru tahu gagal setelah dicetak','foto gelap setelah dicuci','hasil kamera analog gagal'],terms:['foto','kamera','cetak','analog']},
 {id:'kembalian-permen',phrases:['kembalian dikasih permen','uang kembalian permen','warung kasih permen'],terms:['permen','kembalian','warung']},
 {id:'tukang-jajanan-keliling',phrases:['suara tukang makanan lewat','pedagang lewat bunyi khas','tukang jajanan keliling'],terms:['pedagang','jajanan','kampung','suara']},
 {id:'mati-lampu',phrases:['listrik mati malam malam','mati lampu pakai lilin','listrik turun'],terms:['mati lampu','listrik','rumah']},
 {id:'memory-slideshow',phrases:['album foto keluarga plastik','lihat foto lama keluarga','foto di album plastik'],terms:['album','foto','keluarga']}
];

export function interpretMemoryQuery(query){
 const q=normalize(query);if(!q)return {query:'',triggerIds:[],terms:[],matchedIntents:[]};
 const tokens=new Set(q.split(' ').filter(Boolean));
 const matches=memoryIntents.map(intent=>{
  const phraseScore=intent.phrases.reduce((best,phrase)=>{const p=normalize(phrase);if(q.includes(p)||p.includes(q))return Math.max(best,10);const words=p.split(' ');const overlap=words.filter(word=>tokens.has(word)).length;return Math.max(best,overlap/Math.max(words.length,1)*6)},0);
  const termScore=intent.terms.reduce((score,term)=>score+(q.includes(normalize(term))?2:0),0);
  return {...intent,score:phraseScore+termScore};
 }).filter(item=>item.score>=3).sort((a,b)=>b.score-a.score);
 return {query:q,triggerIds:matches.slice(0,5).map(item=>item.id),terms:[...new Set(matches.slice(0,5).flatMap(item=>item.terms).map(normalize))],matchedIntents:matches.slice(0,5).map(({id,score})=>({id,score}))};
}

export function memoryQueryMatchesTrigger(trigger,query){
 const interpreted=interpretMemoryQuery(query);if(!interpreted.query)return true;
 const haystack=normalize(`${trigger.id} ${trigger.title} ${trigger.category} ${trigger.interaction} ${trigger.scene} ${trigger.object}`);
 return haystack.includes(interpreted.query)||interpreted.triggerIds.includes(trigger.id)||interpreted.terms.some(term=>haystack.includes(term));
}

export function memoryQueryMatchesEntry(entry,query){
 const interpreted=interpretMemoryQuery(query);if(!interpreted.query)return true;
 const haystack=normalize(`${entry.title} ${entry.summary} ${(entry.tags||[]).join(' ')} ${JSON.stringify(entry.details||{})}`);
 return haystack.includes(interpreted.query)||interpreted.terms.some(term=>haystack.includes(term));
}

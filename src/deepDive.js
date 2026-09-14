// Deep-dive presentation data deliberately points back to catalog entries or
// primary/object-study sources. It does not create a second historical SSOT.
export const deepObjectCabinet = [
 {
  id:'discman',name:'Portable CD Player',year:'era CD 1990-an',image:'discman.jpg',
  kicker:'SKIP / REPEAT / ANTI-SHOCK',
  story:'Setelah kaset, pemutar CD portabel membawa ritual baru: memilih track dengan tombol, menjaga permukaan disc, dan berharap musik tidak meloncat saat perangkat terguncang. Foto dipakai sebagai studi objek, bukan bukti model yang paling populer di Indonesia.',
  source:'https://commons.wikimedia.org/wiki/File:Sony_Discman_D_50.jpg',
  sourceLabel:'Wikimedia Commons — Sony Discman object study'
 },
 {
  id:'game-boy-color',name:'Game Boy Color',year:'1998',image:'gameboy-color.jpg',
  kicker:'HANDHELD COLOR',entryId:'game-boy-color',
  story:'Nintendo menempatkan Game Boy Color pada 1998. Di kabinet ini perangkat dibaca sebagai perubahan pengalaman bermain portabel di penghujung dekade, sementara konteks penjualan Indonesia tetap tidak diklaim tanpa arsip distributor lokal.',
  source:'https://www.nintendo.com/en-gb/Hardware/Nintendo-History/Nintendo-History-625945.html',
  sourceLabel:'Nintendo — History'
 },
 {
  id:'pager',name:'Pager / Beeper',year:'awal–tengah 1990-an',image:'pager.jpg',
  kicker:'CALL ME BACK',entryId:'pager-motorola-90an',
  story:'Pager mengubah pesan menjadi isyarat singkat: nomor, teks, atau bunyi yang meminta respons melalui jaringan komunikasi lain. Motorola mencatat pasar paging Asia tumbuh pesat pada 1991 dan memperkenalkan pager dua arah Tango pada 1995.',
  source:'https://www.motorolasolutions.com/newsroom/press-releases/motorola-solutions-celebrates-its-85th-anniversary.html',
  sourceLabel:'Motorola Solutions — historical timeline'
 },
 {
  id:'dr-grip',name:'Pilot Dr. Grip',year:'1991',image:'dr-grip.jpg',
  kicker:'PENCIL CASE STATUS',entryId:'pilot-dr-grip',
  story:'Bodi besar dan grip empuk membuat alat tulis ini terasa berbeda dari pulpen tipis biasa. PILOT mencatat Dr. Grip pertama kali diluncurkan pada 1991 dan versi pensil mekaniknya menyusul pada 1992.',
  source:'https://corp.pilot.co.jp/english/company/history/',
  sourceLabel:'PILOT Corporation — history'
 },
 {
  id:'hi-tec-c',name:'Pilot Hi-Tec-C',year:'1994',image:'pilot-pens.jpg',
  kicker:'MICRO WRITING',entryId:'pilot-hi-tec-c',
  story:'Ujung kecil membuat judul catatan, surat, agenda, dan detail tulisan terasa lebih presisi. Riwayat PILOT mencatat Hi-Tec-C hadir pada 1994 dengan bola 0,3 mm.',
  source:'https://corp.pilot.co.jp/company/history/',
  sourceLabel:'PILOT Corporation Japan — history'
 },
 {
  id:'rollerskates',name:'Sepatu Roda',year:'1991 context',image:'rollerskates.png',
  kicker:'URBAN TEEN ICON',entryId:'olga-dan-sepatu-roda',
  story:'Di aplikasi ini sepatu roda dipakai sebagai object-study untuk membaca budaya remaja urban yang terekam dalam Olga dan Sepatu Roda (1991), tanpa menyalin poster atau frame film berhak cipta.',
  source:'https://www.indonesianfilmcenter.com/filminfo/detail/3229/olga-dan-sepatu-roda',
  sourceLabel:'Indonesian Film Center — film record'
 }
];

export const decadeMoments = [
 {year:1991,entryId:'pilot-dr-grip',label:'Alat tulis',title:'Dr. Grip diluncurkan',note:'PILOT menempatkan peluncuran pertama Dr. Grip pada 1991.'},
 {year:1991,entryId:'olga-dan-sepatu-roda',label:'Film remaja',title:'Olga dan Sepatu Roda',note:'Film 1991 menggabungkan sekolah, radio, dan kultur sepatu roda.'},
 {year:1994,entryId:'pilot-hi-tec-c',label:'Sekolah',title:'Hi-Tec-C hadir',note:'PILOT mencatat Hi-Tec-C 0,3 mm diluncurkan pada 1994.'},
 {year:1995,entryId:'pager-motorola-90an',label:'Komunikasi',title:'Pager dua arah',note:'Motorola memperkenalkan Tango, pager dua arahnya, pada 1995.'},
 {year:1996,entryId:'tamagotchi',label:'Mainan digital',title:'Tamagotchi',note:'Bandai mencatat peluncuran Tamagotchi pada November 1996.'},
 {year:1997,entryId:'hyper-yoyo',label:'Mainan keterampilan',title:'Hyper Yo-Yo',note:'Bandai Namco mencatat Hyper Yo-Yo diluncurkan pada April 1997.'},
 {year:1998,entryId:'game-boy-color',label:'Handheld',title:'Game Boy Color',note:'Nintendo menempatkan Game Boy Color pada 1998.'},
 {year:1998,entryId:'kuldesak-1998',label:'Film Indonesia',title:'Kuldesak',note:'Film omnibus ini menjadi salah satu penanda penting ekosistem film Indonesia akhir 90-an.'}
];

export const provenanceTiers = [
 {id:'verified',label:'Verified',meaning:'Fakta inti memiliki sumber yang dapat dilacak, idealnya sumber resmi, institusi, atau arsip.'},
 {id:'curated',label:'Curated',meaning:'Konteks editorial disusun hati-hati tetapi bukti primer lokal belum cukup untuk menaikkannya menjadi verified.'},
 {id:'simulation',label:'Simulation',meaning:'Interaksi seperti jadwal/slider pengalaman dibuat untuk simulasi dan tidak diklaim sebagai transkripsi arsip primer.'}
];

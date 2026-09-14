const noPrice = note => ({
 label:'Harga nostalgia',currency:'IDR',
 past:{year:1995,amount:null,sourceIds:[]},
 present:{year:2026,amount:null,sourceIds:[]},
 basis:'unknown',note
});

const indonesiaRetroSource = {
 id:'src-kompas-retro-anime',
 title:'Konsep Trivia Retro — anime hari Minggu — Kompas.com',
 url:'https://buku.kompas.com/read/6094/konsep-trivia-retro-paling-seru-untuk-acara-kumpul-komunitas-dan-keluarga',
 kind:'editorial-retrospective',
 checkedAt:'2026-09-14'
};

export const youthEntries = [
 {
  id:'dragon-ball-z',type:'kartun',title:'Dragon Ball Z',
  summary:'Latihan, turnamen, jurus, dan pertarungan lintas planet membuat nama Goku terasa seperti bahasa bersama anak-anak yang tumbuh di era televisi analog.',
  status:'curated',layout:'poster',tags:['kartun','anime','Dragon Ball Z','Goku','Minggu pagi','90-an'],
  factBox:{text:'Toei Animation mencatat Dragon Ball Z tayang di Jepang pada 26 April 1989 sampai 31 Januari 1996 dengan total 291 episode. Penempatan seri ini sebagai nostalgia televisi Indonesia bersifat kurasi retrospektif; aplikasi tidak mengklaim jadwal siaran Indonesia tanpa arsip primer.',status:'curated',sourceIds:['src-dbz-toei','src-kompas-retro-anime']},
  quoteBox:{text:'Kalau ada yang mulai menghitung tenaga sebelum mengeluarkan jurus, satu halaman sekolah bisa langsung ikut paham.',kind:'editorial-fiction',attribution:'Rekaan editorial'},
  priceTag:noPrice('Harga komik, kaset video, dan merchandise lokal berbeda-beda; tidak ditampilkan tanpa katalog harga primer Indonesia.'),
  sources:[
   {id:'src-dbz-toei',title:'Dragon Ball Z — Toei Animation List of Works',url:'https://lineup.toei-anim.co.jp/en/tv/dragonz/',kind:'official',checkedAt:'2026-09-14'},
   indonesiaRetroSource
  ],
  assets:[],details:{genre:'Anime aksi / petualangan',premiere:'26 April 1989 (Jepang)',context:'Tanggal karya asli terverifikasi dari Toei. Konteks nostalgia Indonesia ditampilkan sebagai kurasi, bukan rekonstruksi jadwal siaran.',people:'Akira Toriyama; Toei Animation; Son Goku'}
 },
 {
  id:'sailor-moon',type:'kartun',title:'Sailor Moon',
  summary:'Transformasi, seragam pelaut, persahabatan, dan dunia magis memberi warna berbeda pada blok kartun era 90-an.',
  status:'curated',layout:'poster',tags:['kartun','anime','Sailor Moon','Usagi','Minggu pagi','90-an'],
  factBox:{text:'Toei Animation mencatat seri Sailor Moon pertama memiliki 46 episode dan tayang di Jepang pada 7 Maret 1992 sampai 27 Februari 1993. Hubungannya dengan nostalgia televisi Indonesia ditandai curated sampai arsip jadwal lokal yang lebih kuat tersedia.',status:'curated',sourceIds:['src-sailormoon-toei','src-kompas-retro-anime']},
  quoteBox:{text:'Kalau satu orang hafal pose transformasinya, biasanya yang lain tinggal ikut.',kind:'editorial-fiction',attribution:'Rekaan editorial'},
  priceTag:noPrice('Harga komik dan merchandise Indonesia belum ditampilkan karena memerlukan sumber retail historis yang sebanding.'),
  sources:[
   {id:'src-sailormoon-toei',title:'Sailor Moon — Toei Animation List of Works',url:'https://lineup.toei-anim.co.jp/en/tv/sailor_moon/',kind:'official',checkedAt:'2026-09-14'},
   indonesiaRetroSource
  ],
  assets:[],details:{genre:'Mahou shoujo / aksi',premiere:'7 Maret 1992 (Jepang)',context:'Tanggal seri asli terverifikasi dari Toei; konteks tontonan Indonesia diperlakukan sebagai kurasi retrospektif.',people:'Naoko Takeuchi; Toei Animation; Usagi Tsukino'}
 },
 {
  id:'detective-conan',type:'kartun',title:'Detective Conan',
  summary:'Kasus pembunuhan, petunjuk kecil, dan satu kalimat tentang kebenaran menjadikan serial detektif ini terasa lebih serius daripada kartun pagi biasa.',
  status:'curated',layout:'timeline',tags:['kartun','anime','Detective Conan','Conan','misteri','Minggu pagi'],
  factBox:{text:'TMS Entertainment mencatat Detective Conan mulai ditayangkan di Jepang pada 8 Januari 1996. Kehadirannya dalam memori Minggu pagi Indonesia diberi status curated; tanggal penayangan Indonesia tidak dipaksakan tanpa sumber jadwal lokal yang terverifikasi.',status:'curated',sourceIds:['src-conan-tms','src-kompas-retro-anime']},
  quoteBox:{text:'Begitu musik kasus mulai terasa tegang, sarapan pun bisa ikut berhenti sebentar.',kind:'editorial-fiction',attribution:'Rekaan editorial'},
  priceTag:noPrice('Harga komik lokal belum ditampilkan sampai tersedia katalog harga edisi dan tahun yang spesifik.'),
  sources:[
   {id:'src-conan-tms',title:'Detective Conan — TMS Entertainment',url:'https://www.tms-e.co.jp/global/alltitles/conan/087101.html',kind:'official',checkedAt:'2026-09-14'},
   indonesiaRetroSource
  ],
  assets:[],details:{genre:'Misteri / detektif',premiere:'8 Januari 1996 (Jepang)',context:'Tahun dan tanggal karya asli terverifikasi dari TMS. Rekonstruksi slot Indonesia tetap menunggu arsip lokal.',people:'Gosho Aoyama; TMS Entertainment; Conan Edogawa'}
 },
 {
  id:'crayon-shinchan',type:'kartun',title:'Crayon Shin-chan',
  summary:'Humor keluarga, tingkah nakal, dan cara bicara yang khas membuat Shin-chan mudah sekali ditiru—kadang justru itu yang bikin orang tua ikut mengawasi layar.',
  status:'curated',layout:'scrapbook',tags:['kartun','anime','Crayon Shin-chan','Shinnosuke','komedi','90-an'],
  factBox:{text:'Arsip resmi TV Asahi mencatat episode awal Crayon Shin-chan pada 13 April 1992. Aplikasi hanya memakai tanggal karya asli ini sebagai fakta terverifikasi; konteks siaran Indonesia tetap berstatus curated.',status:'curated',sourceIds:['src-shinchan-tv-asahi','src-kompas-retro-anime']},
  quoteBox:{text:'Satu gaya bicara saja cukup untuk bikin sekelas langsung tahu siapa yang sedang ditirukan.',kind:'editorial-fiction',attribution:'Rekaan editorial'},
  priceTag:noPrice('Harga komik dan merchandise berbeda antaredisi; belum ditampilkan tanpa arsip retail primer.'),
  sources:[
   {id:'src-shinchan-tv-asahi',title:'Crayon Shin-chan Story Log 1992 — TV Asahi',url:'https://www.tv-asahi.co.jp/shinchan/storylog/list/1992.html',kind:'official',checkedAt:'2026-09-14'},
   indonesiaRetroSource
  ],
  assets:[],details:{genre:'Komedi keluarga',premiere:'13 April 1992 (Jepang)',context:'Tanggal episode awal berasal dari arsip resmi TV Asahi; konteks nostalgia Indonesia ditampilkan sebagai kurasi.',people:'Yoshito Usui; TV Asahi; Shinnosuke Nohara'}
 },
 {
  id:'playstation-1',type:'mainan',title:'PlayStation generasi pertama',
  summary:'Kotak abu-abu, CD game, memory card, dan budaya rental membuat konsol ini menjadi salah satu benda paling mudah memanggil kembali suasana akhir 90-an.',
  status:'verified',layout:'catalog',tags:['mainan','game','PlayStation','PS1','Sony','rental'],
  factBox:{text:'Sony mencatat PlayStation pertama dipasarkan di Jepang pada 3 Desember 1994 dengan harga peluncuran 39.800 yen. Fakta produk ini terverifikasi; aplikasi tidak mengubah harga Jepang menjadi klaim harga rental Indonesia.',status:'verified',sourceIds:['src-playstation-sony']},
  quoteBox:{text:'Satu jam rental bisa terasa pendek sekali kalau giliran main dibagi berempat.',kind:'editorial-fiction',attribution:'Rekaan editorial'},
  priceTag:noPrice('Tarif rental dan harga konsol di Indonesia sangat bervariasi menurut kota dan tahun; belum ditampilkan tanpa sumber lokal primer.'),
  sources:[{id:'src-playstation-sony',title:'Sony Group History — The PlayStation',url:'https://www.sony.com/en/SonyInfo/CorporateInfo/History/SonyHistory/2-09.html',kind:'official',checkedAt:'2026-09-14'}],
  assets:[],details:{region:'Global / populer di budaya rental Indonesia',genre:'Konsol permainan 32-bit',premiere:'3 Desember 1994 (Jepang)',tools:'CD-ROM, controller, memory card',context:'Fakta peluncuran berasal dari Sony; budaya rental Indonesia disajikan sebagai konteks editorial nostalgia.',people:'Sony Computer Entertainment'}
 },
 {
  id:'tamagotchi',type:'mainan',title:'Tamagotchi',
  summary:'Benda berbentuk telur yang tiba-tiba membuat urusan memberi makan, membersihkan, dan menjaga makhluk digital terasa seperti tanggung jawab sungguhan.',
  status:'verified',layout:'catalog',tags:['mainan','Tamagotchi','Bandai','digital pet','1996'],
  factBox:{text:'Bandai Namco mencatat Tamagotchi diluncurkan pada November 1996. Dokumen sejarah produk Bandai juga menempatkan kelahirannya pada 1996 sebagai portable nurturing toy.',status:'verified',sourceIds:['src-tamagotchi-bandai']},
  quoteBox:{text:'Bunyinya kecil, tapi cukup membuat satu kelas panik karena takut peliharaannya kelaparan.',kind:'editorial-fiction',attribution:'Rekaan editorial'},
  priceTag:noPrice('Harga pasar Indonesia era 90-an belum ditampilkan tanpa katalog retail lokal yang dapat diverifikasi.'),
  sources:[{id:'src-tamagotchi-bandai',title:'Bandai Namco Group History — Tamagotchi launch',url:'https://www.bandainamco.co.jp/en/about/history/all.html',kind:'official',checkedAt:'2026-09-14'}],
  assets:[],details:{region:'Global',genre:'Digital pet',premiere:'November 1996',tools:'Perangkat elektronik berbentuk telur',context:'Tanggal peluncuran produk berasal dari sejarah resmi Bandai Namco.',people:'Bandai'}
 },
 {
  id:'hyper-yoyo',type:'mainan',title:'Hyper Yo-Yo',
  summary:'Trik sleeper, looping, dan kompetisi kecil antarteman membuat yo-yo bukan lagi sekadar benda yang naik turun.',
  status:'verified',layout:'blueprint',tags:['mainan','yo-yo','Hyper Yo-Yo','Bandai','1997','anak sekolah'],
  factBox:{text:'Riwayat resmi Bandai Namco mencatat Hyper Yo-Yo diluncurkan pada April 1997, satu tahun setelah Tamagotchi.',status:'verified',sourceIds:['src-hyperyoyo-bandai']},
  quoteBox:{text:'Begitu satu orang bisa trik baru, besoknya semua orang ingin membawa yo-yo ke sekolah.',kind:'editorial-fiction',attribution:'Rekaan editorial'},
  priceTag:noPrice('Harga lokal dan merek tiruan sangat bervariasi; aplikasi tidak menampilkan angka tanpa bukti retail spesifik.'),
  sources:[{id:'src-hyperyoyo-bandai',title:'Bandai Namco Group History — Hyper Yo-Yo launch',url:'https://www.bandainamco.co.jp/en/about/history/service.html',kind:'official',checkedAt:'2026-09-14'}],
  assets:[],details:{region:'Global',genre:'Skill toy',premiere:'April 1997',tools:'Yo-yo dan tali',context:'Tanggal peluncuran produk terverifikasi dari sejarah resmi Bandai Namco.',people:'Bandai'}
 },
 {
  id:'game-boy',type:'mainan',title:'Nintendo Game Boy',
  summary:'Layar kecil, empat baterai AA, cartridge, dan Tetris memberi pengalaman bermain yang benar-benar bisa dibawa pergi.',
  status:'verified',layout:'catalog',tags:['mainan','game','Game Boy','Nintendo','handheld','Tetris'],
  factBox:{text:'Nintendo mencatat Game Boy diperkenalkan pada 1989 sebagai sistem permainan handheld portabel; dokumentasi Nintendo UK menyebut peluncurannya di Jepang pada 1989 dan kemudian di Eropa pada 1990.',status:'verified',sourceIds:['src-gameboy-nintendo']},
  quoteBox:{text:'Kalau baterai mulai lemah, kontras layar dan doa biasanya naik bersamaan.',kind:'editorial-fiction',attribution:'Rekaan editorial'},
  priceTag:noPrice('Harga perangkat dan cartridge di Indonesia berbeda-beda serta banyak unit beredar lewat jalur impor; angka historis belum ditampilkan.'),
  sources:[{id:'src-gameboy-nintendo',title:'Nintendo History — Game Boy',url:'https://www.nintendo.com/en-gb/Hardware/Nintendo-History/Game-Boy/Game-Boy-627031.html',kind:'official',checkedAt:'2026-09-14'}],
  assets:[],details:{region:'Global',genre:'Handheld game system',premiere:'1989',tools:'Game Boy, cartridge, baterai AA',context:'Riwayat produk berasal dari Nintendo; pengalaman Indonesia disajikan sebagai konteks nostalgia, bukan data penjualan.',people:'Nintendo'}
 }
];

export const youthVersion = '2.3.0';

const noPrice = note => ({
 label:'Harga nostalgia',currency:'IDR',
 past:{year:1995,amount:null,sourceIds:[]},
 present:{year:2026,amount:null,sourceIds:[]},
 basis:'unknown',note
});

export const popCultureEntries = [
 {
  id:'lorong-waktu',type:'ramadhan',title:'Lorong Waktu',
  summary:'Ramadan, masjid, mesin waktu, dan petualangan moral bertemu dalam satu serial yang lahir tepat di ujung dekade 90-an.',
  status:'verified',layout:'story',tags:['Ramadhan','SCTV','serial religi','1999','Deddy Mizwar'],
  factBox:{text:'Lorong Waktu pertama kali ditayangkan SCTV pada 9 Desember 1999. Serial ciptaan Deddy Mizwar ini menggabungkan tema religi Islam dengan fiksi ilmiah perjalanan waktu.',status:'verified',sourceIds:['src-lorong-waktu']},
  quoteBox:{text:'Ramadan terasa punya dunia sendiri ketika Zidan dan Haji Husin muncul di layar.',kind:'editorial-fiction',attribution:'Rekaan editorial'},
  priceTag:noPrice('Program televisi tidak memiliki harga historis yang setara untuk dibandingkan sebagai barang.'),
  sources:[{id:'src-lorong-waktu',title:'Lorong Waktu (1999 TV series) — Wikipedia',url:'https://en.wikipedia.org/wiki/Lorong_Waktu_(1999_TV_series)',kind:'secondary',checkedAt:'2026-09-14'}],
  assets:[],details:{station:'SCTV',genre:'Religi / fiksi ilmiah',premiere:'9 Desember 1999',context:'Serial religi dengan perangkat perjalanan waktu yang menjadi salah satu tontonan Ramadan Indonesia.',people:'Deddy Mizwar; Jourast Jordy; Hefri Olifian'}
 },
 {
  id:'tersanjung',type:'tv',title:'Tersanjung',
  summary:'Drama panjang dengan pergantian fase hidup dan karakter yang membuat judulnya identik dengan era sinetron prime time akhir 90-an.',
  status:'verified',layout:'clipping',tags:['tv','sinetron','Indosiar','1998','drama'],
  factBox:{text:'Tersanjung, produksi Multivision Plus, ditayangkan perdana di Indosiar pada 10 April 1998 dan kemudian berkembang menjadi serial multi-musim.',status:'verified',sourceIds:['src-tersanjung']},
  quoteBox:{text:'Kalau judulnya sudah muncul, ruang tamu seperti masuk mode drama.',kind:'editorial-fiction',attribution:'Rekaan editorial'},
  priceTag:noPrice('Program televisi tidak diperlakukan sebagai produk dengan harga yang dapat dibandingkan langsung.'),
  sources:[{id:'src-tersanjung',title:'Tersanjung — Ensiklopedia STEKOM',url:'https://p2k.stekom.ac.id/ensiklopedia/Tersanjung',kind:'secondary',checkedAt:'2026-09-14'}],
  assets:[],details:{station:'Indosiar',genre:'Drama romantis',premiere:'10 April 1998',context:'Salah satu sinetron panjang yang melekat pada fase pertumbuhan drama televisi swasta.',people:'Lulu Tobing; Ari Wibowo; Multivision Plus'}
 },
 {
  id:'ngelaba',type:'tv',title:'Ngelaba',
  summary:'Parto, Akri, dan Eko membawa lawakan Patrio ke layar TPI ketika komedi televisi masih terasa seperti panggung yang masuk ke rumah.',
  status:'curated',layout:'poster',tags:['tv','komedi','TPI','Patrio','1995'],
  factBox:{text:'Sejumlah rujukan biografis mencatat Ngelaba tayang di TPI mulai 1995 dan menjadi program yang melambungkan grup lawak Patrio. Tanggal perdana spesifik tidak ditampilkan karena sumber yang tersedia tidak sepenuhnya konsisten.',status:'curated',sourceIds:['src-ngelaba-stekom','src-ngelaba-idn']},
  quoteBox:{text:'Lawakannya selesai di TV, besoknya ditiru lagi di sekolah.',kind:'editorial-fiction',attribution:'Rekaan editorial'},
  priceTag:noPrice('Program komedi televisi tidak mempunyai harga konsumsi yang setara lintas zaman.'),
  sources:[
   {id:'src-ngelaba-stekom',title:'Eko Patrio — Ensiklopedia STEKOM',url:'https://p2k.stekom.ac.id/ensiklopedia/Eko_Patrio',kind:'secondary',checkedAt:'2026-09-14'},
   {id:'src-ngelaba-idn',title:'Biodata dan Profil Eko Patrio — IDN Times',url:'https://www.idntimes.com/hype/entertainment/biodata-dan-profil-eko-patrio-00-19lfc-mcn129/amp',kind:'editorial',checkedAt:'2026-09-14'}
  ],
  assets:[],details:{station:'TPI',genre:'Komedi',premiere:'1995',context:'Program komedi Patrio yang menjadi salah satu ikon komedi televisi TPI.',people:'Parto Patrio; Akri Patrio; Eko Patrio'}
 },
 {
  id:'sheila-on-7',type:'musik',title:'Sheila on 7',
  summary:'Dari panggung pensi Yogyakarta menuju industri rekaman nasional—kisah sebuah band yang datang ketika kaset, radio, dan poster kamar masih menjadi ekosistem utama musik remaja.',
  status:'verified',layout:'poster',tags:['musik','band','Yogyakarta','Sheila on 7','1996','Sony Music'],
  factBox:{text:'Situs resmi Sheila on 7 menetapkan 6 Mei 1996 sebagai hari lahir band. Setelah sekitar dua tahun berkeliling pensi dan festival sekolah, mereka memperoleh kontrak rekaman pertama dengan Sony Music Entertainment Indonesia pada pertengahan 1998.',status:'verified',sourceIds:['src-so7-official']},
  quoteBox:{text:'Lagu di radio belum selesai, tapi satu kamar sudah ikut nyanyi.',kind:'editorial-fiction',attribution:'Rekaan editorial'},
  priceTag:noPrice('Harga kaset dan CD berbeda menurut format, toko, kota, dan tahun; angka belum ditampilkan tanpa katalog harga primer.'),
  sources:[{id:'src-so7-official',title:'History — Sheila on 7 Official Website',url:'https://sheilaon7.com/history',kind:'official',checkedAt:'2026-09-14'}],
  assets:[],details:{genre:'Pop rock',premiere:'6 Mei 1996 (hari lahir band)',context:'Berangkat dari skena sekolah Yogyakarta dan masuk kontrak rekaman nasional menjelang akhir 90-an.',people:'Duta; Eross; Adam; Sakti; Anton'}
 },
 {
  id:'dewa-19',type:'musik',title:'Dewa 19',
  summary:'Surabaya, festival, hijrah ke Jakarta, dan album debut 1992 menjadi awal salah satu perjalanan band paling menonjol dalam musik Indonesia era 90-an.',
  status:'verified',layout:'story',tags:['musik','rock','Surabaya','Dewa 19','1992','Ari Lasso'],
  factBox:{text:'Riwayat Dewa 19 mencatat grup ini berakar di Surabaya dan merilis album pertama pada 1992. Fase 1990-an sangat identik dengan vokal Ari Lasso dan album-album seperti 19, Format Masa Depan, Terbaik Terbaik, dan Pandawa Lima.',status:'verified',sourceIds:['src-dewa-history']},
  quoteBox:{text:'Intro lagu tertentu cukup beberapa detik untuk membuat satu tongkrongan ikut hafal.',kind:'editorial-fiction',attribution:'Rekaan editorial'},
  priceTag:noPrice('Harga album fisik belum ditampilkan sebelum ditemukan katalog penjualan historis yang sebanding.'),
  sources:[{id:'src-dewa-history',title:'Dewa 19 — History',url:'https://dewa19.bms-adminsystem.com/history_dewa19.html',kind:'official-site',checkedAt:'2026-09-14'}],
  assets:[],details:{genre:'Rock / pop rock',premiere:'Album debut 1992',context:'Salah satu band besar Indonesia yang berkembang kuat sepanjang 1990-an.',people:'Ahmad Dhani; Andra Junaidi; Ari Lasso; Erwin Prasetya; Wawan Juniarso'}
 },
 {
  id:'kla-project-yogyakarta',type:'musik',title:'KLa Project — “Yogyakarta”',
  summary:'Sebuah lagu kota dari album 1990 yang ikut menanamkan gambaran Yogyakarta dalam ingatan generasi kaset dan radio.',
  status:'verified',layout:'clipping',tags:['musik','KLa Project','Yogyakarta','1990','album Kedua'],
  factBox:{text:'Situs resmi KLa Project mencatat album kedua mereka, Kedua, dirilis pada 1990 dengan “Yogyakarta” sebagai salah satu hit; lagu tersebut meraih penghargaan BASF Award 1991 dalam beberapa kategori.',status:'verified',sourceIds:['src-kla-discography']},
  quoteBox:{text:'Ada lagu yang membuat nama kota terasa seperti kenangan pribadi.',kind:'editorial-fiction',attribution:'Rekaan editorial'},
  priceTag:noPrice('Harga kaset album belum ditampilkan karena memerlukan katalog penjualan historis yang dapat dibandingkan.'),
  sources:[{id:'src-kla-discography',title:'Diskografi — Official Website of KLa Project',url:'https://www.klaproject.com/2001/diskografi.phtml?rwr=3',kind:'official',checkedAt:'2026-09-14'}],
  assets:[],details:{genre:'Pop',premiere:'Album Kedua — 1990',context:'Lagu “Yogyakarta” menjadi salah satu karya yang paling lekat dengan identitas KLa Project.',people:'KLa Project'}
 },
 {
  id:'tehbotol-sosro',type:'jajanan',title:'Tehbotol Sosro',
  summary:'Botol kaca dingin di warung, meja makan, terminal, dan kantin adalah bagian visual yang terasa sangat akrab sepanjang dekade 90-an.',
  status:'verified',layout:'catalog',tags:['jajanan','minuman','warung','Tehbotol Sosro','botol kaca'],
  factBox:{text:'PT Sinar Sosro mencatat gagasan menjual teh siap minum dalam botol dengan nama Tehbotol Sosro dimulai pada 1969. Desain kemasan mengalami perubahan pada 1969, 1972, dan 1974; format botol beling kemudian menjadi salah satu bentuk produk yang sangat dikenal.',status:'verified',sourceIds:['src-sosro-official']},
  quoteBox:{text:'Suara tutup botol dibuka saja sudah seperti suara makan di luar rumah.',kind:'editorial-fiction',attribution:'Rekaan editorial'},
  priceTag:noPrice('Harga tahun 90-an tidak ditampilkan tanpa daftar harga primer berdasarkan tahun dan ukuran botol yang sama.'),
  sources:[{id:'src-sosro-official',title:'Profil Perusahaan — PT Sinar Sosro',url:'https://sinarsosro.id/profile',kind:'official',checkedAt:'2026-09-14'}],
  assets:[],details:{category:'Minuman teh siap minum',unit:'Botol beling / berbagai kemasan',premiere:'1969',context:'Produk lahir sebelum dekade 90-an, tetapi hadir kuat dalam keseharian warung dan konsumsi Indonesia selama era tersebut.',people:'Keluarga Sosrodjojo / PT Sinar Sosro'}
 },
 {
  id:'nike-ardilla-bintang-kehidupan',type:'musik',title:'Nike Ardilla — Bintang Kehidupan',
  summary:'Suara rock-pop perempuan awal 90-an yang hadir melalui kaset, radio, televisi, dan poster kamar remaja.',
  status:'curated',layout:'poster',tags:['musik','Nike Ardilla','Bintang Kehidupan','1990','pop rock'],
  factBox:{text:'Diskografi yang terdokumentasi menempatkan album Bintang Kehidupan pada 1990, di fase awal dekade ketika karier rekaman Nike Ardilla berkembang sangat kuat.',status:'curated',sourceIds:['src-nike-discography']},
  quoteBox:{text:'Poster di kamar dan kaset di rak bisa sama pentingnya dengan lagunya sendiri.',kind:'editorial-fiction',attribution:'Rekaan editorial'},
  priceTag:noPrice('Harga kaset tidak ditampilkan tanpa bukti katalog retail historis yang spesifik.'),
  sources:[{id:'src-nike-discography',title:'Nike Ardilla — Discography',url:'https://en.wikipedia.org/wiki/Nike_Ardilla',kind:'secondary',checkedAt:'2026-09-14'}],
  assets:[],details:{genre:'Pop rock',premiere:'Bintang Kehidupan — 1990',context:'Salah satu figur musik perempuan yang sangat menonjol dalam budaya populer Indonesia awal hingga pertengahan 90-an.',people:'Nike Ardilla'}
 }
];

export const popCultureVersion = '2.2.0';

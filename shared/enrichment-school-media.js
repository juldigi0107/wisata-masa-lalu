const noPrice = note => ({
 label:'Harga nostalgia',currency:'IDR',
 past:{year:1995,amount:null,sourceIds:[]},
 present:{year:2026,amount:null,sourceIds:[]},
 basis:'unknown',note
});

export const schoolMediaEntries = [
 {
  id:'majalah-hai',type:'bacaan',title:'Majalah HAI',
  summary:'Musik, sekolah, gaya hidup, pop culture, dan bahasa remaja bertemu di satu majalah yang sering berpindah tangan dari meja kelas ke kamar tidur.',
  status:'verified',layout:'clipping',tags:['bacaan','majalah','HAI','remaja','musik','sekolah','1990-an'],
  factBox:{text:'Halaman About resmi HAI mencatat majalah ini pertama terbit pada 1977 sebagai media untuk anak muda usia 15–24 tahun, membahas musik, pop culture, pengembangan diri, dan gaya hidup. HAI kemudian bertransformasi sepenuhnya ke digital pada 2017.',status:'verified',sourceIds:['src-hai-about']},
  quoteBox:{text:'Kalau satu teman beli, yang baca bisa satu kelas—asal majalahnya pulang dalam keadaan utuh.',kind:'editorial-fiction',attribution:'Rekaan editorial'},
  priceTag:noPrice('Harga edisi tertentu tidak ditampilkan sebagai fakta umum karena berbeda menurut tanggal dan nomor terbit.'),
  sources:[{id:'src-hai-about',title:'About Us — HAI',url:'https://hai.grid.id/about',kind:'official',checkedAt:'2026-09-15'}],
  assets:[],details:{region:'Indonesia',genre:'Majalah remaja',premiere:'1977',context:'Entri menyorot HAI sebagai salah satu pintu budaya remaja yang tetap relevan sepanjang dekade 90-an tanpa menggandakan cover berhak cipta.',people:'Redaksi HAI / Kompas Gramedia'}
 },
 {
  id:'pilot-dr-grip',type:'sekolah',title:'Pilot Dr. Grip',
  summary:'Pulpen dan pensil mekanik bertubuh tebal memberi rasa futuristis pada tempat pensil ketika alat tulis masih menjadi bagian penting dari identitas anak sekolah.',
  status:'verified',layout:'catalog',tags:['sekolah','alat tulis','Pilot','Dr. Grip','1991','pensil mekanik','pulpen'],
  factBox:{text:'PILOT mencatat Dr. Grip diluncurkan pada 1991 sebagai pulpen tinta minyak untuk mengurangi beban pada leher, bahu, dan lengan. Versi pensil mekaniknya menyusul pada 1992.',status:'verified',sourceIds:['src-pilot-history','src-drgrip-history']},
  quoteBox:{text:'Ada masa ketika isi tempat pensil bisa terasa seperti koleksi gadget mini.',kind:'editorial-fiction',attribution:'Rekaan editorial'},
  priceTag:noPrice('PILOT mencatat harga awal Jepang 500 yen, tetapi aplikasi tidak mengonversinya menjadi harga Indonesia 90-an tanpa katalog lokal.'),
  sources:[
   {id:'src-pilot-history',title:'History — PILOT Corporation',url:'https://corp.pilot.co.jp/english/company/history/',kind:'official',checkedAt:'2026-09-15'},
   {id:'src-drgrip-history',title:'Dr. Grip 20-year History — PILOT',url:'https://www.pilot.co.jp/promotion/library/016/index.php',kind:'official',checkedAt:'2026-09-15'}
  ],
  assets:[{path:'/assets/media/dr-grip.jpg',alt:'Pilot Dr. Grip sebagai studi objek alat tulis',kind:'image',rights:'public-domain',credit:'Tomo suzuki / Wikimedia Commons'}],
  details:{region:'Global / konteks sekolah Indonesia dikurasi editorial',genre:'Alat tulis',premiere:'1991; mechanical pencil 1992',context:'Tanggal produk berasal dari arsip resmi PILOT. Pengalaman lokal tidak diklaim sebagai data penjualan Indonesia.',people:'PILOT Corporation'}
 },
 {
  id:'pilot-hi-tec-c',type:'sekolah',title:'Pilot Hi-Tec-C',
  summary:'Ujung sangat kecil dan warna tinta membuat kegiatan menulis catatan, judul, atau surat terasa lebih presisi dibanding pulpen biasa.',
  status:'verified',layout:'catalog',tags:['sekolah','alat tulis','Pilot','Hi-Tec-C','1994','gel pen'],
  factBox:{text:'Riwayat resmi PILOT mencatat Hi-Tec-C diluncurkan pada 1994 sebagai pulpen dengan bola 0,3 mm yang sangat halus; pada 1997 PILOT juga meluncurkan G-2 retractable gel ink ballpoint.',status:'verified',sourceIds:['src-pilot-jp-history']},
  quoteBox:{text:'Tulisan belum tentu lebih rapi, tapi pulpen tipis membuat catatan terasa lebih niat.',kind:'editorial-fiction',attribution:'Rekaan editorial'},
  priceTag:noPrice('Tidak ada harga Indonesia 90-an yang ditampilkan tanpa katalog retail lokal yang dapat diverifikasi.'),
  sources:[{id:'src-pilot-jp-history',title:'History — PILOT Corporation Japan',url:'https://corp.pilot.co.jp/company/history/',kind:'official',checkedAt:'2026-09-15'}],
  assets:[{path:'/assets/media/pilot-pens.jpg',alt:'Koleksi pulpen Pilot sebagai studi objek',kind:'image',rights:'wikimedia-commons',credit:'Wikimedia Commons'}],
  details:{region:'Global / konteks sekolah Indonesia dikurasi editorial',genre:'Gel / fine-tip writing instrument',premiere:'1994',context:'Tanggal peluncuran diverifikasi dari histori perusahaan; aplikasi tidak menyamakan popularitas global dengan data pangsa pasar sekolah Indonesia.',people:'PILOT Corporation'}
 },
 {
  id:'game-boy-color',type:'mainan',title:'Game Boy Color',
  summary:'Layar berwarna di telapak tangan membuat handheld gaming terasa masuk generasi baru tepat di penghujung dekade 90-an.',
  status:'verified',layout:'poster',tags:['mainan','game','Nintendo','Game Boy Color','1998','handheld'],
  factBox:{text:'Nintendo mencatat Game Boy Color diperkenalkan pada 1998, bersama Game Boy Camera dan Printer. Arsip Nintendo Jepang menyebut peluncuran Game Boy Color pada Oktober 1998.',status:'verified',sourceIds:['src-nintendo-history','src-nintendo-gbc']},
  quoteBox:{text:'Satu layar kecil cukup untuk membuat perjalanan terasa jauh lebih singkat.',kind:'editorial-fiction',attribution:'Rekaan editorial'},
  priceTag:noPrice('Harga resmi wilayah lain tidak dikonversi menjadi harga Indonesia tanpa arsip distributor lokal.'),
  sources:[
   {id:'src-nintendo-history',title:'Nintendo History — Nintendo UK',url:'https://www.nintendo.com/en-gb/Hardware/Nintendo-History/Nintendo-History-625945.html',kind:'official',checkedAt:'2026-09-15'},
   {id:'src-nintendo-gbc',title:'Iwata Asks / Game Boy Color note — Nintendo',url:'https://www.nintendo.co.jp/3ds/interview/hardware/vol2/index.html',kind:'official',checkedAt:'2026-09-15'}
  ],
  assets:[{path:'/assets/media/gameboy-color.jpg',alt:'Nintendo Game Boy Color sebagai studi objek',kind:'image',rights:'public-domain',credit:'Evan-Amos / Wikimedia Commons'}],
  details:{region:'Global / hadir melalui pasar game Indonesia',genre:'Handheld game console',premiere:'1998',context:'Peluncuran perangkat diverifikasi dari Nintendo. Distribusi dan harga Indonesia memerlukan arsip lokal tambahan.',people:'Nintendo'}
 },
 {
  id:'pager-motorola-90an',type:'teknologi',title:'Pager / Beeper Motorola',
  summary:'Sebelum pesan singkat masuk ke ponsel, bunyi beeper berarti ada nomor atau teks yang menunggu dibaca—dan sering kali harus dibalas lewat telepon lain.',
  status:'verified',layout:'timeline',tags:['teknologi','pager','beeper','Motorola','1990-an','komunikasi'],
  factBox:{text:'Motorola mencatat pasar paging Asia sedang berkembang pesat pada 1991. Pada 1995 perusahaan memperkenalkan Tango, yang disebut sebagai pager dua arah pertama mereka dan memungkinkan penerima membalas dengan respons standar.',status:'verified',sourceIds:['src-motorola-85']},
  quoteBox:{text:'Satu bunyi kecil bisa berarti: cari telepon, sekarang juga.',kind:'editorial-fiction',attribution:'Rekaan editorial'},
  priceTag:noPrice('Biaya perangkat dan layanan berbeda menurut operator serta negara; aplikasi tidak mengarang tarif Indonesia.'),
  sources:[{id:'src-motorola-85',title:'Motorola Solutions Celebrates Its 85th Anniversary',url:'https://www.motorolasolutions.com/newsroom/press-releases/motorola-solutions-celebrates-its-85th-anniversary.html',kind:'official',checkedAt:'2026-09-15'}],
  assets:[{path:'/assets/media/pager.jpg',alt:'Motorola Advisor pager sebagai studi objek',kind:'image',rights:'cc-by-2.0',credit:'rfdigitalwpg / Wikimedia Commons'}],
  details:{region:'Asia / konteks Indonesia perlu arsip operator tambahan',genre:'Personal messaging / paging',premiere:'Pasar Asia kuat 1991; two-way Tango 1995',context:'Sumber resmi membuktikan perkembangan paging regional dan produknya; aplikasi tidak mengklaim angka pelanggan Indonesia tanpa sumber lokal.',people:'Motorola'}
 },
 {
  id:'olga-dan-sepatu-roda',type:'film',title:'Olga dan Sepatu Roda',
  summary:'Pelajar, radio, sepatu roda, dan budaya remaja urban bertemu dalam film yang terasa seperti kapsul gaya hidup awal 90-an.',
  status:'verified',layout:'story',tags:['film','Olga','sepatu roda','1991','Desy Ratnasari','Mandra','remaja'],
  factBox:{text:'Indonesian Film Center mencatat Olga dan Sepatu Roda sebagai film Indonesia tahun 1991 berdurasi 87 menit, disutradarai Achiel Nasrun dan diproduseri Ramesh K. S. Ceritanya mengikuti Olga, pelajar SMA yang gemar sepatu roda dan kemudian menjadi penyiar radio.',status:'verified',sourceIds:['src-olga-ifc']},
  quoteBox:{text:'Radio, sekolah, dan sepatu roda membuat kotanya seperti punya soundtrack sendiri.',kind:'editorial-fiction',attribution:'Rekaan editorial'},
  priceTag:noPrice('Harga tiket bioskop tidak ditampilkan tanpa arsip harga primer yang spesifik lokasi dan tanggal.'),
  sources:[{id:'src-olga-ifc',title:'Olga dan Sepatu Roda (1991) — Indonesian Film Center',url:'https://www.indonesianfilmcenter.com/filminfo/detail/3229/olga-dan-sepatu-roda',kind:'film-database',checkedAt:'2026-09-15'}],
  assets:[{path:'/assets/media/rollerskates.png',alt:'Ilustrasi sepatu roda quad sebagai object study',kind:'image',rights:'cc0',credit:'Europeana Fashion / Wikimedia Commons'}],
  details:{region:'Indonesia',genre:'Comedy / Drama',premiere:'1991',context:'Visual memakai object study sepatu roda bebas lisensi, bukan poster atau frame film berhak cipta.',people:'Desy Ratnasari; Mandra; Achiel Nasrun; Hilman Hariwijaya'}
 },
 {
  id:'kuldesak-1998',type:'film',title:'Kuldesak',
  summary:'Empat segmen dan energi sineas muda membuat film ini berdiri sebagai penanda penting menjelang kebangkitan baru perfilman Indonesia di akhir 90-an.',
  status:'verified',layout:'clipping',tags:['film','Kuldesak','1998','Mira Lesmana','Riri Riza','Nan Achnas','Rizal Mantovani'],
  factBox:{text:'Catatan Indonesian Film Center menyebut Kuldesak dibiayai secara patungan oleh para sutradaranya, dengan dukungan yang kemudian datang antara lain dari RCTI dan Hubert Bals Fund. Film ini juga menerima penghargaan khusus FFB 1999 dan kemudian Anugerah Khusus FFI 2011 atas kontribusinya pada generasi perfilman.',status:'verified',sourceIds:['src-kuldesak-ifc']},
  quoteBox:{text:'Ada karya yang terasa seperti pintu kecil menuju era film Indonesia berikutnya.',kind:'editorial-fiction',attribution:'Rekaan editorial'},
  priceTag:noPrice('Harga tiket dan distribusi tidak disederhanakan menjadi satu angka tanpa arsip bioskop primer.'),
  sources:[{id:'src-kuldesak-ifc',title:'Kuldesak — Indonesian Film Center',url:'https://www.indonesianfilmcenter.com/filminfo/detail/3456/kuldesak',kind:'film-database',checkedAt:'2026-09-15'}],
  assets:[],details:{region:'Indonesia / Jakarta',genre:'Drama / komedi hitam / film omnibus',premiere:'1998',context:'Poster dan still film tidak disalin. Entri berfokus pada sejarah produksi dan posisi film dalam ekosistem akhir 90-an.',people:'Mira Lesmana; Riri Riza; Nan Achnas; Rizal Mantovani'}
 }
];

export const schoolMediaVersion = '2.5.0';

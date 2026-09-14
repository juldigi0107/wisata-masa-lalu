const noPrice = note => ({
 label:'Harga nostalgia',currency:'IDR',
 past:{year:1995,amount:null,sourceIds:[]},
 present:{year:2026,amount:null,sourceIds:[]},
 basis:'unknown',note
});

export const digitalLifeEntries = [
 {
  id:'indonet-internet-komersial-1994',type:'teknologi',title:'IndoNet & Internet Komersial 1994',
  summary:'Bunyi modem dial-up menjadi salah satu penanda perubahan besar: internet mulai bergerak dari jaringan terbatas menuju layanan komersial yang dapat dijangkau pelanggan individual.',
  status:'verified',layout:'timeline',tags:['teknologi','internet','IndoNet','dial-up','1994','1995','ISP','Indonesia'],
  factBox:{text:'Riwayat resmi Indonet mencatat perusahaan berdiri pada 1994 sebagai penyedia jasa internet komersial pertama di Indonesia. Integrated Report Indonet juga menyebut lisensi ISP diperoleh pada 1995, layanan komunikasi data ke pelanggan individu menjadi fokus saat itu, dan akses sub-net diperluas hingga 34 kota.',status:'verified',sourceIds:['src-indonet-about','src-indonet-report']},
  quoteBox:{text:'Masuk internet dulu bukan sekadar klik—ada bunyi modem, kabel telepon, dan rasa was-was kalau sambungan putus.',kind:'editorial-fiction',attribution:'Rekaan editorial'},
  priceTag:noPrice('Tarif dial-up tidak disederhanakan menjadi satu angka karena paket, biaya telepon, kota, dan periode dapat berbeda.'),
  sources:[
   {id:'src-indonet-about',title:'About Indonet — Indonet',url:'https://indonet.id/about-indonet',kind:'official',checkedAt:'2026-09-15'},
   {id:'src-indonet-report',title:'Integrated Report Indonet 2023 — Business Journey',url:'https://indonet.id/wp-content/uploads/2024/12/Integrated-Report-Indonet-2023.pdf',kind:'official',checkedAt:'2026-09-15'}
  ],
  assets:[],details:{region:'Indonesia',genre:'Internet / ISP / dial-up',premiere:'1994; ISP license 1995',context:'Entri membuktikan milestone komersialisasi internet. Ia tidak mengklaim bahwa internet rumah sudah merata di Indonesia pada 1994–1995.',people:'PT Indointernet / Indonet'}
 },
 {
  id:'wartel-1990',type:'teknologi',title:'Wartel: Telepon Publik di Sudut Kota',
  summary:'Sebelum ponsel menjadi barang sehari-hari, warung telekomunikasi memberi ruang semi-publik untuk menelepon keluarga, kantor, atau orang yang tinggal jauh.',
  status:'verified',layout:'clipping',tags:['teknologi','wartel','telepon','1990','Perumtel','Palembang','komunikasi'],
  factBox:{text:'Arsip Harian Neraca tanggal 7 Juni 1990 yang tersimpan di Museum Penerangan/Komdigi mencatat pelatihan 26 tenaga Wartel swasta di Palembang, menyebut beberapa lokasi Wartel yang beroperasi, serta materi pelayanan telepon, telegraf, pendapatan, sistem telekomunikasi, etika pelayanan, dan pelaporan.',status:'verified',sourceIds:['src-komdigi-wartel-1990']},
  quoteBox:{text:'Nomor telepon ditulis di kertas kecil, lalu antre sambil berharap orang di seberang benar-benar ada di rumah.',kind:'editorial-fiction',attribution:'Rekaan editorial'},
  priceTag:noPrice('Tarif Wartel sangat bergantung pada jenis sambungan, durasi, operator, dan lokasi; tidak disajikan tanpa tarif primer yang spesifik.'),
  sources:[{id:'src-komdigi-wartel-1990',title:'Harian Neraca 7 Juni 1990 — Arsip Museum Penerangan Komdigi',url:'https://mpn.komdigi.go.id/arsip/page/81281/sheet',kind:'archive',checkedAt:'2026-09-15'}],
  assets:[],details:{region:'Indonesia / arsip spesifik Palembang',genre:'Telepon publik / layanan telekomunikasi',premiere:'Bukti arsip 1990',context:'Sumber primer menunjukkan Wartel swasta telah beroperasi dan tenaga pelayanan dilatih pada 1990. Entri tidak menggeneralisasi jumlah Wartel nasional dari satu arsip kota.',people:'Perumtel / Witel III / pengelola Wartel swasta'}
 },
 {
  id:'windows-95-indonesia',type:'teknologi',title:'Windows 95 & Meja Komputer 90-an',
  summary:'Start button, taskbar, CD-ROM, buku belajar komputer, dan istilah “Windows” ikut membentuk bahasa baru ketika PC semakin akrab di sekolah, kantor, rental, dan rumah.',
  status:'verified',layout:'blueprint',tags:['teknologi','komputer','Windows 95','Microsoft','1995','Elex Media','Indonesia'],
  factBox:{text:'Microsoft mencatat Windows 95 diluncurkan 24 Agustus 1995 dan memperkenalkan elemen seperti Start button dan taskbar. Riwayat Microsoft 1995 juga mencantumkan PT Microsoft Indonesia sebagai anak perusahaan yang diluncurkan tahun itu. Katalog perpustakaan pemerintah mencatat buku berbahasa Indonesia “Belajar Sendiri Windows 95” karya Lani Sidharta diterbitkan Elex Media Komputindo di Jakarta pada 1995.',status:'verified',sourceIds:['src-ms-win95','src-ms-1995','src-win95-book']},
  quoteBox:{text:'Belajar komputer sering dimulai dari satu pertanyaan sederhana: tombol Start itu buat apa?',kind:'editorial-fiction',attribution:'Rekaan editorial'},
  priceTag:noPrice('Harga PC dan lisensi Windows sangat bervariasi menurut konfigurasi dan kanal penjualan; tidak dipukul rata menjadi “harga 1995”.'),
  sources:[
   {id:'src-ms-win95',title:'Launch of Windows 95 — Microsoft',url:'https://news.microsoft.com/announcement/launch-of-windows-95/',kind:'official',checkedAt:'2026-09-15'},
   {id:'src-ms-1995',title:'The History of Microsoft — 1995',url:'https://learn.microsoft.com/en-us/shows/history/history-of-microsoft-1995',kind:'official',checkedAt:'2026-09-15'},
   {id:'src-win95-book',title:'Belajar Sendiri Windows 95 — Katalog Perpustakaan BBPP Batu',url:'https://kikp-pertanian.id/bbppbatu/opac/detail-opac?id=1211',kind:'library',checkedAt:'2026-09-15'}
  ],
  assets:[{path:'/assets/media/floppy.jpg',alt:'Disket sebagai object study ekosistem komputer personal 1990-an',kind:'image',rights:'wikimedia-commons',credit:'Wikimedia Commons / lihat ledger ATTRIBUTION'}],
  details:{region:'Global + bukti konteks Indonesia',genre:'Personal computing / operating system',premiere:'24 Agustus 1995',context:'Tanggal peluncuran dan fitur berasal dari Microsoft. Bukti lokal berupa keberadaan PT Microsoft Indonesia dan buku belajar Windows 95 terbitan Jakarta pada tahun yang sama; ini bukan klaim pangsa pasar PC nasional.',people:'Microsoft; PT Microsoft Indonesia; Lani Sidharta; Elex Media Komputindo'}
 },
 {
  id:'apjii-1996',type:'teknologi',title:'APJII & Infrastruktur Internet 1996',
  summary:'Ketika internet Indonesia mulai tumbuh sebagai industri, organisasi penyelenggara dan interkoneksi domestik menjadi bagian penting dari fondasi yang jarang terlihat pengguna di layar.',
  status:'verified',layout:'timeline',tags:['teknologi','internet','APJII','IIX','ID-NIC','1996','ISP','Indonesia'],
  factBox:{text:'APJII mencatat asosiasi ini dinyatakan berdiri pada Musyawarah Nasional pertama 15 Mei 1996. Program strategis awalnya mencakup tarif jasa internet, pembentukan ID-NIC, Indonesia Internet Exchange (IIX), negosiasi tarif infrastruktur telekomunikasi, serta usulan jumlah dan jenis provider.',status:'verified',sourceIds:['src-apjii-history']},
  quoteBox:{text:'Di balik layar browser, ada pekerjaan besar soal jaringan, alamat, tarif, dan bagaimana koneksi antarpenyedia bisa bertemu di dalam negeri.',kind:'editorial-fiction',attribution:'Rekaan editorial'},
  priceTag:noPrice('Entri membahas infrastruktur/asosiasi, bukan harga konsumsi.'),
  sources:[{id:'src-apjii-history',title:'Latar Belakang APJII — APJII',url:'https://web.apjii.or.id/pengurus/latar-belakang',kind:'official',checkedAt:'2026-09-15'}],
  assets:[],details:{region:'Indonesia',genre:'Internet infrastructure / industry association',premiere:'15 Mei 1996',context:'Entri berfokus pada pembentukan kelembagaan internet Indonesia dan program awal yang terdokumentasi oleh APJII.',people:'Asosiasi Penyelenggara Jasa Internet Indonesia (APJII)'}
 },
 {
  id:'sony-minidisc-1992',type:'musik',title:'Sony MiniDisc',
  summary:'MiniDisc menawarkan janji yang sangat 90-an: media digital kecil yang bisa direkam seperti kaset, dipilih cepat seperti CD, dan dibawa tanpa terlalu takut musik meloncat saat berjalan.',
  status:'verified',layout:'catalog',tags:['musik','audio','Sony','MiniDisc','MD Walkman','MZ-1','1992','personal audio'],
  factBox:{text:'Sejarah resmi Sony mencatat MZ-1 sebagai MD Walkman pertama pada 1992. Catatan perusahaan menjelaskan model rekam MZ-1, model putar MZ-2P, dan MiniDisc rekam MDW-60 mulai dijual di Jepang pada November 1992; perangkat kemudian dirilis ke luar negeri pada bulan berikutnya.',status:'verified',sourceIds:['src-sony-md-milestone','src-sony-md-history']},
  quoteBox:{text:'Bentuknya kecil, futuristis, dan terasa seperti masa depan musik yang bisa masuk saku.',kind:'editorial-fiction',attribution:'Rekaan editorial'},
  priceTag:noPrice('Harga Jepang atau wilayah lain tidak dikonversi menjadi harga Indonesia tanpa arsip distribusi lokal.'),
  sources:[
   {id:'src-sony-md-milestone',title:'Product & Technology Milestones — Personal Audio — Sony',url:'https://www.sony.com/en/SonyInfo/CorporateInfo/History/sonyhistory-e.html',kind:'official',checkedAt:'2026-09-15'},
   {id:'src-sony-md-history',title:'Digitizing Music — Sony Group History',url:'https://www.sony.com/en/SonyInfo/CorporateInfo/History/SonyHistory/2-07.html',kind:'official',checkedAt:'2026-09-15'}
  ],
  assets:[],details:{region:'Global / konteks kepemilikan Indonesia belum diklaim',genre:'Portable digital audio',premiere:'November 1992 (Jepang)',context:'Fakta perangkat diverifikasi dari Sony. Aplikasi tidak menyamakan sukses Jepang/global dengan popularitas MiniDisc di Indonesia tanpa sumber lokal.',people:'Sony'}
 },
 {
  id:'daun-di-atas-bantal',type:'film',title:'Daun di Atas Bantal',
  summary:'Garin Nugroho membawa kehidupan anak jalanan ke bentuk fiksi yang bersinggungan dekat dengan realitas, menghasilkan salah satu film Indonesia akhir 90-an yang banyak bergerak di festival.',
  status:'curated',layout:'story',tags:['film','Daun di Atas Bantal','Garin Nugroho','Christine Hakim','1997','1998','anak jalanan'],
  factBox:{text:'Indonesian Film Center mencatat Daun di Atas Bantal sebagai film drama Indonesia tahun 1997 berdurasi 81 menit, diproduseri Christine Hakim dan disutradarai Garin Nugroho. Database yang sama mencatat Special Jury Prize Tokyo International Film Festival 1998 dan Best Film Asia Pacific Film Festival 1998.',status:'verified',sourceIds:['src-daun-ifc']},
  quoteBox:{text:'Ada film yang tidak terasa seperti nostalgia manis—ia justru mengingatkan bahwa dekade yang sama juga punya realitas kota yang keras.',kind:'editorial-fiction',attribution:'Rekaan editorial'},
  priceTag:noPrice('Harga tiket bioskop tidak ditampilkan tanpa arsip bioskop primer yang spesifik tanggal dan lokasi.'),
  sources:[{id:'src-daun-ifc',title:'Daun di Atas Bantal — Indonesian Film Center',url:'https://www.indonesianfilmcenter.com/filminfo/detail/3493/daun-di-atas-bantal',kind:'film-database',checkedAt:'2026-09-15'}],
  assets:[],details:{region:'Indonesia',genre:'Drama',premiere:'Database IFC mencatat 1997; penghargaan internasional tercatat 1998',context:'Status entry dibuat curated agar aplikasi tidak menyederhanakan perbedaan tahun yang sering muncul di sumber lain. Poster/still film tidak disalin karena hak cipta.',people:'Garin Nugroho; Christine Hakim; Armantono; Djaduk Ferianto'}
 }
];

export const digitalLifeVersion='2.8.0';

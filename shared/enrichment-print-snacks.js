const noPrice = note => ({
 label:'Harga nostalgia',currency:'IDR',
 past:{year:1995,amount:null,sourceIds:[]},
 present:{year:2026,amount:null,sourceIds:[]},
 basis:'unknown',note
});

export const printSnackEntries = [
 {
  id:'majalah-bobo',type:'bacaan',title:'Majalah Bobo',
  summary:'Hari Kamis, halaman warna, cerita keluarga kelinci, pengetahuan ringan, dan rubrik surat pembaca membuat majalah ini terasa seperti paket kecil yang ditunggu pulang sekolah.',
  status:'verified',layout:'clipping',tags:['bacaan','majalah','Bobo','Kompas Gramedia','anak sekolah','1990-an'],
  factBox:{text:'Bobo versi Indonesia terbit pertama kali pada 14 April 1973. Kompas mencatat pada 1990-an harga majalah ini berada sekitar Rp1.200–Rp1.500, menunjukkan bagaimana ia sudah menjadi bagian mapan dari budaya baca anak sebelum internet rumahan umum.',status:'verified',sourceIds:['src-bobo-kompas','src-bobo-gramedia']},
  quoteBox:{text:'Kalau majalahnya sudah sampai rumah, halaman favorit biasanya dibuka duluan sebelum tugas sekolah.',kind:'editorial-fiction',attribution:'Rekaan editorial'},
  priceTag:noPrice('Kompas menyebut rentang Rp1.200–Rp1.500 pada 1990-an, tetapi tidak mengikat angka itu ke satu tahun/edisi tertentu sehingga aplikasi tidak menampilkan satu harga tunggal.'),
  sources:[
   {id:'src-bobo-kompas',title:'Sejarah Bobo, Majalah Anak-anak Pertama di Indonesia dengan Desain Berwarna — Kompas.com',url:'https://www.kompas.com/tren/read/2023/07/02/130000565/sejarah-bobo-majalah-anak-anak-pertama-di-indonesia-dengan-desain-berwarna?page=all',kind:'secondary',checkedAt:'2026-09-15'},
   {id:'src-bobo-gramedia',title:'Edisi Koleksi 5 Edisi Pertama Majalah Bobo 1973 — Gramedia',url:'https://www.gramedia.com/products/pre-order-edisi-koleksi-5-edisi-pertama-majalah-bobo-1973',kind:'official-retail',checkedAt:'2026-09-15'}
  ],
  assets:[{path:'/assets/media/bobo-logo.png',alt:'Logo Majalah Bobo',kind:'image',rights:'public-domain-textlogo',credit:'Wikimedia Commons'}],
  details:{region:'Indonesia',genre:'Majalah anak',premiere:'14 April 1973',context:'Entri menyorot peran Bobo pada pengalaman membaca anak era 90-an; tahun lahir dan kisaran harga dekade berasal dari sumber yang ditautkan.',people:'P. K. Ojong; Jakob Oetama; tim redaksi Bobo'}
 },
 {
  id:'elex-manga-90an',type:'bacaan',title:'Gelombang Manga Elex Era 90-an',
  summary:'Rak komik sepulang sekolah mempertemukan Doraemon, Dragon Ball, Slam Dunk, Kungfu Boy, dan banyak judul Jepang dengan pembaca Indonesia dalam format buku yang mudah dibawa ke mana-mana.',
  status:'verified',layout:'catalog',tags:['bacaan','manga','Elex Media','Doraemon','Dragon Ball','Slam Dunk','1990-an'],
  factBox:{text:'Elex Media Komputindo menyebut dekade 1990-an sebagai titik balik ketika mereka mulai menghadirkan manga Jepang secara luas dan secara eksplisit menyebut Candy Candy, Doraemon, Dragon Ball, Slam Dunk, serta Kungfu Boy sebagai judul yang melekat pada generasi tersebut.',status:'verified',sourceIds:['src-elex-official']},
  quoteBox:{text:'Satu komik sering pindah tangan lebih cepat daripada jadwal pelajaran hari itu.',kind:'editorial-fiction',attribution:'Rekaan editorial'},
  priceTag:noPrice('Harga komik berbeda menurut judul, cetakan, dan tahun; belum ditampilkan sampai katalog harga primer per edisi tersedia.'),
  sources:[{id:'src-elex-official',title:'About Us — Elex Media Komputindo',url:'https://www.elexmedia.id/about-us',kind:'official',checkedAt:'2026-09-15'}],
  assets:[{path:'/assets/media/gramedia-comics.jpg',alt:'Rak komik di toko buku Gramedia',kind:'image',rights:'cc-by-sa-4.0',credit:'Esther Rossini / Wikimedia Commons'}],
  details:{region:'Indonesia',genre:'Komik / manga terbitan Indonesia',premiere:'Gelombang besar dekade 1990-an',context:'Sumber resmi Elex membedakan fase 1985, 1990-an, dan 2000-an sehingga konteks dekade dapat ditampilkan tanpa menebak tanggal tiap volume.',people:'Elex Media Komputindo; para mangaka dan penerjemah/editor lokal'}
 },
 {
  id:'toko-buku-gramedia',type:'bacaan',title:'Toko Buku Gramedia',
  summary:'Pergi ke toko buku bisa menjadi acara keluarga sendiri: melihat rak komik, alat tulis, buku pelajaran, majalah, lalu berharap ada satu barang yang boleh dibawa pulang.',
  status:'verified',layout:'story',tags:['bacaan','Gramedia','toko buku','alat tulis','komik','sekolah'],
  factBox:{text:'Gramedia mencatat toko pertamanya dibuka pada 2 Februari 1970 di Jalan Gajah Mada, Jakarta Barat, dengan luas awal sekitar 25 meter persegi. Jaringannya kemudian berkembang menjadi salah satu ruang literasi paling dikenal di Indonesia.',status:'verified',sourceIds:['src-gramedia-history']},
  quoteBox:{text:'Masuk niatnya cuma lihat-lihat, keluarnya sambil masih menghitung uang saku.',kind:'editorial-fiction',attribution:'Rekaan editorial'},
  priceTag:noPrice('Tidak ada satu harga yang mewakili pengalaman toko buku; tiap buku, majalah, dan alat tulis memiliki harga berbeda.'),
  sources:[{id:'src-gramedia-history',title:'55 Tahun Gramedia: Merayakan Perjalanan dengan Tumbuh Bersama — Gramedia',url:'https://www.gramedia.com/blog/55-tahun-gramedia-tumbuh-bersama/',kind:'official',checkedAt:'2026-09-15'}],
  assets:[{path:'/assets/media/gramedia-books.jpg',alt:'Rak buku di Toko Buku Gramedia',kind:'image',rights:'cc-by-sa-4.0',credit:'Esther Rossini / Wikimedia Commons'}],
  details:{region:'Indonesia',genre:'Toko buku / budaya baca',premiere:'2 Februari 1970',context:'Entri dipakai sebagai pintu masuk untuk pengalaman membeli komik, majalah, buku pelajaran, dan stationery pada 1990-an.',people:'Gramedia Asri Media / Kompas Gramedia'}
 },
 {
  id:'indomie-mi-goreng',type:'jajanan',title:'Indomie Mi Goreng',
  summary:'Aroma bumbu, kecap, bawang goreng, dan mi kering membuat satu bungkus sederhana terasa seperti makanan cepat yang sangat akrab di rumah, warung, kos, dan perjalanan.',
  status:'verified',layout:'catalog',tags:['jajanan','Indomie','Mi Goreng','warung','mi instan','1982','1990-an'],
  factBox:{text:'Situs resmi Indomie mencatat merek Indomie diluncurkan pada 1972 dan varian Mi Goreng diperkenalkan pada 1982 sebagai varian mi kering tanpa kuah yang terinspirasi dari mi goreng Indonesia.',status:'verified',sourceIds:['src-indomie-official']},
  quoteBox:{text:'Bumbunya belum diaduk rata saja aromanya sudah memanggil orang dari kamar sebelah.',kind:'editorial-fiction',attribution:'Rekaan editorial'},
  priceTag:noPrice('Harga satu bungkus pada 1990-an belum ditampilkan tanpa arsip retail Indonesia yang spesifik menurut tahun dan ukuran.'),
  sources:[{id:'src-indomie-official',title:'Indomie History — Indofood',url:'https://www.indomie.com/page/about-us',kind:'official',checkedAt:'2026-09-15'}],
  assets:[{path:'/assets/media/indomie.jpg',alt:'Indomie Mi Goreng sebagai studi objek kuliner',kind:'image',rights:'wikimedia-commons',credit:'Wikimedia Commons'}],
  details:{region:'Indonesia',category:'Mi instan',unit:'Bungkus',premiere:'1982 (Mi Goreng)',context:'Produk lahir sebelum 1990-an tetapi menjadi benda keseharian yang sangat relevan bagi pengalaman dekade tersebut.',people:'Indofood / Indomie'}
 },
 {
  id:'aqua-90an',type:'jajanan',title:'AQUA: Botol dan Galon di Keseharian',
  summary:'Air minum kemasan berubah dari benda praktis menjadi bagian dari bahasa sehari-hari; botol kecil untuk perjalanan dan galon untuk rumah hadir sebagai latar yang nyaris tak terasa.',
  status:'verified',layout:'story',tags:['jajanan','minuman','AQUA','air minum','1998','Danone'],
  factBox:{text:'Danone mencatat AQUA didirikan pada 1973 sebagai pelopor air minum dalam kemasan di Indonesia dan membentuk kemitraan strategis dengan Danone pada 1998—sebuah tonggak yang berada tepat di penghujung dekade 90-an.',status:'verified',sourceIds:['src-aqua-danone']},
  quoteBox:{text:'Nama mereknya begitu akrab sampai sering ikut menjadi nama benda yang sedang dicari.',kind:'editorial-fiction',attribution:'Rekaan editorial'},
  priceTag:noPrice('Harga historis berbeda menurut ukuran botol/galon, kota, dan saluran penjualan; belum ditampilkan tanpa daftar harga primer.'),
  sources:[{id:'src-aqua-danone',title:'AQUA — Danone Group',url:'https://www.danone.com/brands/waters/aqua.html',kind:'official',checkedAt:'2026-09-15'}],
  assets:[],details:{region:'Indonesia',category:'Air minum dalam kemasan',unit:'Botol / galon',premiere:'1973; kemitraan Danone 1998',context:'Entri menempatkan AQUA sebagai objek keseharian, bukan iklan merek.',people:'AQUA; Danone'}
 },
 {
  id:'walkman-90an',type:'musik',title:'Walkman di Dekade 90-an',
  summary:'Kaset pilihan sendiri, headphone tipis, tombol rewind, dan baterai cadangan membuat musik menjadi pengalaman yang benar-benar personal sebelum streaming.',
  status:'verified',layout:'timeline',tags:['musik','Walkman','Sony','kaset','portable audio','1990-an'],
  factBox:{text:'Sony meluncurkan Walkman pertama pada 1979. Riwayat resminya mencatat model-model penting sepanjang 1990-an, termasuk WM-805 pada 1990, MD Walkman MZ-1 pada 1992, model ulang tahun ke-15 pada 1994, WM-EX5 pada 1996, dan WM-EX9 pada 1998.',status:'verified',sourceIds:['src-sony-walkman']},
  quoteBox:{text:'Playlist-nya bukan daftar lagu di layar; playlist-nya adalah kaset yang kamu bawa hari itu.',kind:'editorial-fiction',attribution:'Rekaan editorial'},
  priceTag:noPrice('Harga perangkat lokal, kaset, baterai, dan headphone sangat bervariasi; angka belum ditampilkan tanpa katalog Indonesia.'),
  sources:[{id:'src-sony-walkman',title:'Product & Technology Milestones — Personal Audio — Sony Group',url:'https://www.sony.com/en/SonyInfo/CorporateInfo/History/sonyhistory-e.html',kind:'official',checkedAt:'2026-09-15'}],
  assets:[{path:'/assets/media/walkman.jpg',alt:'Sony Walkman sebagai studi objek',kind:'image',rights:'cc-by-sa-4.0',credit:'Wikimedia Commons'}],
  details:{region:'Global / hadir dalam budaya audio Indonesia',genre:'Portable cassette / personal audio',premiere:'1979; evolusi kuat sepanjang 1990-an',context:'Fakta model dan tahun berasal dari arsip sejarah Sony; pengalaman lokal disajikan sebagai konteks editorial.',people:'Sony'}
 },
 {
  id:'discman-cd-portable',type:'musik',title:'Discman dan CD Portabel',
  summary:'Ketika kaset mulai berbagi ruang dengan CD, membawa album ke perjalanan terasa lebih futuristis—asal guncangannya tidak membuat lagu melompat.',
  status:'verified',layout:'timeline',tags:['musik','Discman','CD Walkman','Sony','compact disc','1990-an'],
  factBox:{text:'Sony mencatat D-50 sebagai pemutar CD portabel pertama mereka pada 1984. Dalam riwayat Walkman, nama Discman kemudian diubah menjadi CD Walkman untuk lini Jepang yang diluncurkan mulai akhir 1997 hingga awal 1998.',status:'verified',sourceIds:['src-sony-discman']},
  quoteBox:{text:'Membawa CD satu album terasa mewah sampai jalan bergelombang mengingatkan kalau pemutarnya juga punya batas.',kind:'editorial-fiction',attribution:'Rekaan editorial'},
  priceTag:noPrice('Harga pemutar CD portabel dan CD audio Indonesia belum ditampilkan tanpa katalog retail historis.'),
  sources:[{id:'src-sony-discman',title:'Sony Celebrates Walkman 20th Anniversary — Sony Group',url:'https://www.sony.com/en/SonyInfo/News/Press/199907/99-059/',kind:'official',checkedAt:'2026-09-15'}],
  assets:[{path:'/assets/media/discman.jpg',alt:'Sony D-50 Discman sebagai studi objek',kind:'image',rights:'public-domain',credit:'Timo Beil / Wikimedia Commons'}],
  details:{region:'Global / digunakan juga di Indonesia',genre:'Portable CD player',premiere:'1984; nomenklatur CD Walkman 1997–1998',context:'D-50 lahir sebelum 90-an, tetapi transisi kaset-ke-CD adalah bagian penting lanskap audio dekade tersebut.',people:'Sony'}
 }
];

export const printSnackVersion = '2.4.0';

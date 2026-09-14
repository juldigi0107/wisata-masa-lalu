// Batch kurasi tambahan. Digabungkan oleh assembled-catalog.js agar frontend dan API memakai data yang sama.
const noPrice = note => ({
 label:'Harga nostalgia',currency:'IDR',
 past:{year:1995,amount:null,sourceIds:[]},
 present:{year:2026,amount:null,sourceIds:[]},
 basis:'not-applicable',note
});

export const extraEntries = [
 {
  id:'galasin-betawi',type:'mainan',title:'Galasin / Gobak Sodor',
  summary:'Garis kapur, dua regu, dan keputusan sepersekian detik: menerobos sekarang atau menunggu penjaga lengah.',
  status:'verified',layout:'blueprint',tags:['permainan rakyat','galasin','gobak sodor','Betawi','DKI Jakarta'],
  factBox:{text:'Direktorat Warisan dan Diplomasi Budaya mencatat Galasin Betawi sebagai permainan dua grup berisi 3–8 orang per tim. Lapangan dapat berupa bidang sekitar 9 × 4 meter yang dibagi menjadi enam bagian.',status:'verified',sourceIds:['src-galasin-kemdikbud']},
  quoteBox:{text:'Garis kapurnya sederhana, strateginya bisa seramai pertandingan final.',kind:'editorial-fiction',attribution:'Rekaan editorial'},
  priceTag:noPrice('Permainan rakyat tidak diperlakukan sebagai barang dengan harga baku.'),
  sources:[{id:'src-galasin-kemdikbud',title:'Galasin Betawi — Direktorat Warisan dan Diplomasi Budaya',url:'https://kebudayaan.kemdikbud.go.id/ditwdb/galasin-betawi/',kind:'official',checkedAt:'2026-09-14'}],
  assets:[],details:{region:'DKI Jakarta / Betawi',genre:'Permainan rakyat beregu',players:'2 regu; 3–8 orang per regu',tools:'Garis lapangan dan kapur',context:'Satu regu menghadang di garis, regu lain berusaha menembus sampai ujung dan kembali tanpa tersentuh.',people:''}
 },
 {
  id:'congklak-betawi',type:'mainan',title:'Congklak / Dakon',
  summary:'Papan berlubang dan biji-bijian mengubah teras rumah menjadi arena berhitung, membaca langkah, dan menunggu giliran.',
  status:'verified',layout:'blueprint',tags:['permainan rakyat','congklak','dakon','Betawi','Jawa'],
  factBox:{text:'Kemdikbud mencatat congklak dikenal dengan banyak nama: congkak di sebagian Sumatra, dakon/dhakon di Jawa, serta beberapa nama lain di Sulawesi. Biji permainan dapat berupa kerang, biji tumbuhan, atau batu kecil.',status:'verified',sourceIds:['src-congklak-kemdikbud']},
  quoteBox:{text:'Satu lubang kelihatan sepele sampai kamu sadar langkah berikutnya menentukan semuanya.',kind:'editorial-fiction',attribution:'Rekaan editorial'},
  priceTag:noPrice('Papan dan biji congklak memiliki banyak bentuk serta material; tidak ada satu harga historis yang mewakili seluruh daerah.'),
  sources:[{id:'src-congklak-kemdikbud',title:'Congklak Betawi — Direktorat Warisan dan Diplomasi Budaya',url:'https://kebudayaan.kemdikbud.go.id/ditwdb/congklak-betawi/',kind:'official',checkedAt:'2026-09-14'}],
  assets:[],details:{region:'Lintas daerah Indonesia',genre:'Permainan papan tradisional',players:'Umumnya 2 pemain',tools:'Papan congklak dan biji/kerang/batu kecil',context:'Nama dan detail aturan dapat berbeda antardaerah; aplikasi tidak menganggap satu variasi sebagai aturan nasional tunggal.',people:''}
 },
 {
  id:'benteng-bentengan',type:'mainan',title:'Benteng-Bentengan',
  summary:'Dua markas, banyak lari, dan strategi saling pancing membuat halaman luas terasa seperti peta pertempuran versi anak-anak.',
  status:'verified',layout:'blueprint',tags:['permainan rakyat','bentengan','Musi Rawas','strategi','lari'],
  factBox:{text:'Catatan Warisan Budaya Takbenda Musi Rawas menjelaskan benteng-bentengan sebagai permainan tanpa senjata; pemain aman ketika berada dan memegang benteng. Nilai yang disorot antara lain disiplin dan kebersamaan.',status:'verified',sourceIds:['src-benteng-kemdikbud']},
  quoteBox:{text:'Yang paling jauh dari benteng biasanya juga yang paling kencang teriak minta bantuan.',kind:'editorial-fiction',attribution:'Rekaan editorial'},
  priceTag:noPrice('Tidak memerlukan perlengkapan komersial khusus; benteng dapat memakai penanda di lingkungan bermain.'),
  sources:[{id:'src-benteng-kemdikbud',title:'Benteng-Bentengan Musi Rawas — Direktorat Warisan dan Diplomasi Budaya',url:'https://kebudayaan.kemdikbud.go.id/ditwdb/benteng-bentengan-musi-rawas/',kind:'official',checkedAt:'2026-09-14'}],
  assets:[],details:{region:'Musi Rawas, Sumatera Selatan; dikenal pula dalam variasi daerah lain',genre:'Permainan rakyat beregu',players:'Berkelompok',tools:'Penanda benteng',context:'Variasi lokal dapat berbeda. Entri ini merujuk dokumentasi Benteng-Bentengan Musi Rawas.',people:''}
 },
 {
  id:'layang-layang-rakyat',type:'mainan',title:'Layang-Layang / Geulayang',
  summary:'Benang, angin, tanah lapang, dan pandangan terus ke langit—permainan yang sering membuat waktu sore hilang tanpa terasa.',
  status:'verified',layout:'story',tags:['permainan rakyat','layang-layang','geulayang','Aceh','lintas usia'],
  factBox:{text:'Balai Pelestarian Nilai Budaya Aceh menyebut Geulayang sebagai permainan rakyat lintas usia dan mencatat bahwa layang-layang terdapat dalam inventarisasi permainan tradisional di banyak wilayah Indonesia.',status:'verified',sourceIds:['src-layang-kemdikbud']},
  quoteBox:{text:'Kalau benang sudah tinggi, yang dipegang rasanya bukan mainan tapi sepotong langit.',kind:'editorial-fiction',attribution:'Rekaan editorial'},
  priceTag:noPrice('Bahan, bentuk, ukuran, dan tradisi layang-layang sangat beragam sehingga harga historis tunggal tidak representatif.'),
  sources:[{id:'src-layang-kemdikbud',title:'Geulayang: Permainan Rakyat Lintas Usia Sarat Nilai — BPNB Aceh',url:'https://kebudayaan.kemdikbud.go.id/bpnbaceh/geulayang-permainan-rakyat-lintas-usia-sarat-nilai/',kind:'official',checkedAt:'2026-09-14'}],
  assets:[],details:{region:'Aceh dan berbagai wilayah Indonesia',genre:'Permainan rakyat berbasis angin',players:'Perorangan atau bersama-sama',tools:'Layang-layang dan benang',context:'Bentuk dan tradisi permainan bervariasi menurut daerah.',people:''}
 },
 {
  id:'sipak-rago',type:'mainan',title:'Sipak Rago Minangkabau',
  summary:'Bola rotan tidak sekadar dijaga agar tetap di udara; geraknya bertemu dengan kelincahan, kebersamaan, dan unsur Silek.',
  status:'verified',layout:'story',tags:['permainan rakyat','sipak rago','Minangkabau','Sumatera Barat','bola rotan'],
  factBox:{text:'BPNB Sumatera Barat menjelaskan Sipak Rago sebagai permainan rakyat Minangkabau yang dimainkan berkelompok dengan bola rago dan memadukan gerakan Silek; nilai kerja sama dan kekompakan menjadi bagian pentingnya.',status:'verified',sourceIds:['src-sipakrago-kemdikbud']},
  quoteBox:{text:'Kalau bolanya belum menyentuh tanah, lingkaran itu belum selesai bercerita.',kind:'editorial-fiction',attribution:'Rekaan editorial'},
  priceTag:noPrice('Entri berfokus pada praktik budaya, bukan harga perlengkapan.'),
  sources:[{id:'src-sipakrago-kemdikbud',title:'Nilai-Nilai Budaya Permainan Sipak Rago Minangkabau — BPNB Sumatera Barat',url:'https://kebudayaan.kemdikbud.go.id/bpnbsumbar/nilai-nilai-budaya-permainan-sipak-rago-minangkabau/',kind:'official',checkedAt:'2026-09-14'}],
  assets:[],details:{region:'Minangkabau, Sumatera Barat',genre:'Permainan rakyat berkelompok',players:'Berkelompok',tools:'Bola rago/bola rotan',context:'Sumber Kemdikbud mengaitkan permainan ini dengan gerakan Silek serta nilai kerja sama dan kekompakan.',people:''}
 }
];

export const enrichmentVersion = '2.1.0';

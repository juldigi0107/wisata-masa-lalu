const t=(no,category,id,title,scene,object,interaction,mechanic='inspect',points=10)=>({no,category,id,title,scene,object,interaction,mechanic,points});

export const memoryTriggers=[
 t(1,'televisi','tv-tabung','TV tabung simulator','rumah','tv','Nyalakan TV, tunggu glow CRT, lalu pilih siaran.','tv',20),
 t(2,'televisi','remote-hilang','Remote hilang','rumah','sofa','Cari remote di sela sofa sebelum channel dapat diganti dari jauh.','find',15),
 t(3,'televisi','channel-manual','Ganti channel manual','rumah','tv','Putar tombol channel langsung di TV.','dial',10),
 t(4,'televisi','tv-semut','TV semut','rumah','tv','Tangkap sinyal di antara noise analog.','signal',15),
 t(5,'televisi','setting-antena','Setting antena','rumah','antena','Geser antena sampai gambar paling stabil.','signal',20),
 t(6,'televisi','jadwal-tv-koran','Jadwal TV koran','rumah','koran','Buka halaman acara dan cocokkan jam dinding dengan jadwal.','schedule',10),
 t(7,'televisi','channel-surfing','Channel surfing','rumah','tv','Lompat cepat antarsaluran dan temukan acara yang sedang mulai.','tv',10),
 t(8,'televisi','iklan-retro','Iklan retro','rumah','tv','Tonton bumper iklan bergaya original tanpa menyalin materi komersial lama.','vignette',10),
 t(9,'televisi','vhs-player','VHS player','rumah','vcr','Masukkan kaset VHS, tekan rewind lalu play.','vhs',20),
 t(10,'televisi','vhs-tertimpa','Rekaman VHS tertimpa','rumah','vcr','Pilih bagian pita yang akan diselamatkan setelah rekaman baru menimpa acara lama.','choice',15),

 t(11,'musik','tape-recorder','Tape recorder','rumah','tape','Masukkan kaset dan tekan tombol mekanis PLAY.','cassette',20),
 t(12,'musik','side-a-b','Side A / Side B','rumah','kaset','Balik kaset setelah sisi pertama habis.','cassette',10),
 t(13,'musik','kaset-kusut','Kaset kusut','rumah','kaset','Tarik pita perlahan tanpa merusaknya.','repair',20),
 t(14,'musik','pensil-kaset','Pensil pemutar kaset','rumah','pensil','Putar spool kaset dengan pensil sampai pita kembali rapat.','repair',20),
 t(15,'musik','mixtape-maker','Mixtape maker','rumah','tape','Susun daftar lagu fiktif/original dan atur durasi sisi A dan B.','sequence',20),
 t(16,'musik','request-radio','Request lagu radio','rumah','radio','Hubungi studio radio simulasi dan tinggalkan pesan request.','phone',15),
 t(17,'musik','radio-tuner','Radio tuner','rumah','radio','Putar tuner analog untuk mencari stasiun.','dial',15),
 t(18,'musik','walkman-simulator','Walkman simulator','rumah','walkman','Pasang headphone, kaset, lalu berjalan dengan player portabel.','cassette',15),
 t(19,'musik','battery-low','Battery low','rumah','walkman','Ganti dua baterai sebelum audio melambat.','repair',10),
 t(20,'musik','toko-kaset','Toko kaset','kota','toko-kaset','Jelajahi rak berdasarkan genre dan tahun.','browse',15),

 t(21,'komunikasi','telepon-rumah','Telepon rumah','rumah','telepon','Putar/tekan nomor dan dengarkan ringback simulasi.','phone',15),
 t(22,'komunikasi','telepon-paralel','Telepon paralel','rumah','telepon','Angkat ekstensi lain dan sadari percakapan dapat terdengar.','choice',10),
 t(23,'komunikasi','salah-sambung','Salah sambung','rumah','telepon','Respons sopan lalu coba nomor lagi.','phone',10),
 t(24,'komunikasi','wartel','Wartel','kota','wartel','Masuk bilik, masukkan tujuan, dan mulai percakapan simulasi.','phone',20),
 t(25,'komunikasi','billing-wartel','Billing wartel','kota','wartel','Pantau durasi dan biaya simulasi yang terus naik.','billing',20),
 t(26,'komunikasi','telepon-koin','Telepon koin','kampung','telepon-umum','Masukkan koin virtual sebelum nada berakhir.','timing',15),
 t(27,'komunikasi','buku-telepon','Buku telepon','rumah','buku-telepon','Cari nama lewat indeks alfabet tebal.','search',10),
 t(28,'komunikasi','pager','Pager','kota','pager','Terima nomor singkat lalu cari telepon untuk membalas.','sequence',15),
 t(29,'komunikasi','surat-pos','Surat pos','rumah','meja-tulis','Tulis surat, lipat, tempel perangko, lalu masukkan kotak pos.','compose',15),
 t(30,'komunikasi','kartu-lebaran','Kartu Lebaran','rumah','meja-tulis','Pilih kartu original bergaya 90-an dan tulis ucapan.','compose',15),

 t(31,'teknologi','boot-pc','Boot PC','digital','pc','Tekan power dan lalui urutan boot komputer retro-inspired.','boot',20),
 t(32,'teknologi','disket-144','Disket 1.44 MB','digital','floppy','Masukkan disket dan lihat kapasitas yang sangat kecil menurut standar kini.','disk',10),
 t(33,'teknologi','floppy-corrupt','Floppy corrupt','digital','floppy','Pilih file mana yang diselamatkan dari disket bermasalah.','repair',15),
 t(34,'teknologi','printer-dot-matrix','Printer dot matrix','digital','printer','Cetak halaman dan rasakan ritme head printer simulasi.','print',15),
 t(35,'teknologi','dialup-modem','Dial-up modem','digital','modem','Mulai handshake audio sintetis lalu tunggu koneksi.','dialup',25),
 t(36,'teknologi','internet-disconnect','Internet disconnect','digital','modem','Telepon rumah masuk dan koneksi simulasi terputus.','event',15),
 t(37,'teknologi','warnet-billing','Warnet billing','digital','warnet','Mulai sesi dengan timer dan kredit virtual.','billing',20),
 t(38,'teknologi','chat-room','Chat room','digital','pc','Pilih nickname dan kirim pesan ke NPC chat-room lokal.','chat',15),
 t(39,'teknologi','guestbook','Guestbook','digital','pc','Isi buku tamu homepage personal.','compose',10),
 t(40,'teknologi','homepage-pribadi','Homepage pribadi','digital','pc','Rakit homepage dari judul, warna, GIF-inspired icon, dan counter lokal.','builder',25),

 t(41,'sekolah','buku-biodata','Buku biodata','sekolah','binder','Isi profil singkat ala buku teman.','compose',15),
 t(42,'sekolah','binder','Binder','sekolah','binder','Buka koleksi kertas dan pembatas.','browse',10),
 t(43,'sekolah','tukar-binder','Tukar binder','sekolah','binder','Tukar lembar koleksi dengan NPC.','trade',15),
 t(44,'sekolah','surat-rahasia','Surat rahasia','sekolah','meja-kelas','Tulis pesan pendek untuk teman.','compose',10),
 t(45,'sekolah','lipat-surat','Lipat surat','sekolah','meja-kelas','Ikuti pola lipatan surat menjadi bentuk kecil.','fold',15),
 t(46,'sekolah','piket','Piket','sekolah','kelas','Selesaikan tiga tugas sebelum bel masuk.','timing',15),
 t(47,'sekolah','hapus-papan','Hapus papan tulis','sekolah','papan-tulis','Geser penghapus sampai kapur hilang.','wipe',10),
 t(48,'sekolah','bel-sekolah','Bel sekolah','sekolah','bel','Tekan bel simulasi dan ubah fase hari sekolah.','event',10),
 t(49,'sekolah','upacara','Upacara','sekolah','lapangan','Ikuti urutan upacara dalam vignette singkat.','sequence',15),
 t(50,'sekolah','kantin','Kantin','sekolah','kantin','Pilih jajanan dengan uang saku virtual terbatas.','shop',20),

 t(51,'jajanan','uang-receh','Uang receh era tersebut','kampung','warung','Kelola pecahan uang virtual untuk membeli jajanan.','shop',15),
 t(52,'jajanan','kembalian-permen','Kembalian permen','kampung','warung','Pilih menerima receh atau permen dalam simulasi nostalgia.','choice',10),
 t(53,'jajanan','es-plastik','Es plastik','sekolah','kantin','Gigit/sobek ujung kemasan simulasi lalu minum.','gesture',10),
 t(54,'jajanan','snack-remes','Snack remes','sekolah','kantin','Remas kemasan virtual sebelum dibuka.','gesture',10),
 t(55,'jajanan','permen-berhadiah','Permen berhadiah','kampung','warung','Buka bungkus generik dan lihat hadiah random.','random',15),
 t(56,'jajanan','kartu-hadiah-snack','Kartu hadiah snack','kampung','warung','Kumpulkan kartu original generik dari snack.','collection',15),
 t(57,'jajanan','jajanan-gerbang','Jajanan gerbang sekolah','sekolah','gerbang','Pilih pedagang dari kerumunan sepulang sekolah.','shop',15),
 t(58,'jajanan','tukang-jajanan-keliling','Tukang jajanan keliling','kampung','pedagang','Dengarkan panggilan lalu kejar sebelum lewat.','timing',15),
 t(59,'jajanan','warung-bon','Warung bon','kampung','warung','Catat pembelian di buku bon simulasi.','ledger',10),
 t(60,'jajanan','toples-permen','Toples permen','kampung','warung','Pilih permen dari toples kaca berlabel harga.','shop',10),

 t(61,'permainan','kelereng','Kelereng','kampung','lapangan','Bidik kelereng dengan arah dan tenaga.','aim',20),
 t(62,'permainan','adu-gambar','Adu gambar','sekolah','lapangan','Tepuk kartu original generik hingga terbalik.','timing',15),
 t(63,'permainan','koleksi-cakram','Tazos-inspired collectible','sekolah','lapangan','Adu cakram koleksi original tanpa merek berhak cipta.','timing',15),
 t(64,'permainan','gasing','Gasing','kampung','lapangan','Tarik tali pada timing tepat untuk putaran terlama.','timing',20),
 t(65,'permainan','lompat-karet','Lompat karet','kampung','lapangan','Atur timing lompatan saat level karet naik.','timing',20),
 t(66,'permainan','bentengan','Bentengan','kampung','lapangan','Pilih jalur menyerang dan kembali ke benteng.','strategy',25),
 t(67,'permainan','petak-umpet','Petak umpet','kampung','gang','Pilih tempat bersembunyi sebelum hitungan selesai.','find',20),
 t(68,'permainan','layangan-putus','Layangan putus','kampung','lapangan','Kejar layangan yang jatuh sambil menghindari rintangan.','chase',20),
 t(69,'permainan','mobil-kulit-jeruk','Mobil kulit jeruk','kampung','teras','Rakit mobil kecil dari material organik generik.','builder',15),
 t(70,'permainan','kapal-otok-otok','Kapal otok-otok','kampung','teras','Isi air, nyalakan sumber panas aman-simulatif, lalu jalankan perahu.','sequence',15),

 t(71,'mainan','mini-racing','Mini racing car simulator','kota','rental','Balapan top-down singkat dengan mobil mini original.','race',25),
 t(72,'mainan','virtual-pet','Virtual pet retro','rumah','mainan','Beri makan, bersihkan, dan jaga meter mood.','pet',20),
 t(73,'mainan','mobil-kabel','Mobil kabel','kampung','teras','Kendalikan mobil berkabel melewati jalur sempit.','drive',15),
 t(74,'mainan','pistol-air','Pistol air','kampung','halaman','Bidik target benda mati dalam mini-game aman.','aim',15),
 t(75,'mainan','balon-pasta','Balon pasta','kampung','teras','Tiup balon virtual sampai ukuran ideal tanpa pecah.','timing',10),
 t(76,'mainan','mainan-snack','Mainan dalam snack','kampung','warung','Buka paket generik dan kumpulkan mainan kecil original.','collection',15),
 t(77,'mainan','mesin-arcade','Mesin arcade','kota','arcade','Main mini-game skor tinggi bergaya original.','arcade',25),
 t(78,'mainan','token-arcade','Token arcade','kota','arcade','Tukar uang virtual dengan token dan pilih mesin.','shop',10),
 t(79,'mainan','high-score','High score tiga huruf','kota','arcade','Masukkan tiga huruf setelah skor tertinggi lokal.','arcade',15),
 t(80,'mainan','rumor-cheat-code','Rumor cheat code','kota','rental','Dengarkan rumor NPC lalu coba kombinasi tombol fiktif.','secret',15),

 t(81,'kehidupan','hujan-sore','Hujan sore','kampung','gang','Dunia berubah basah, suara genteng naik, aktivitas berpindah ke teras.','ambient',10),
 t(82,'kehidupan','mati-lampu','Mati lampu','rumah','saklar','Lampu padam; cari senter dan tunggu listrik kembali.','event',15),
 t(83,'kehidupan','malam-minggu','Malam Minggu','kota','jalan','Pilih radio, bioskop, mall, atau telepon teman.','choice',15),
 t(84,'kehidupan','penjual-keliling','Penjual keliling','kampung','gang','Kenali penjual dari suara panggilannya.','audio',10),
 t(85,'kehidupan','magrib','Magrib','kampung','mushola','Aktivitas luar mereda dan ambience lingkungan berubah.','ambient',10),
 t(86,'kehidupan','suara-malam','Suara malam kampung','kampung','gang','Dengarkan jangkrik, tokek, motor jauh, dan TV tetangga sintetis.','audio',10),
 t(87,'kehidupan','jam-dinding','Jam dinding','rumah','jam','Putar jarum untuk mempercepat fase hari.','dial',10),
 t(88,'kehidupan','kalender-sobek','Kalender sobek','rumah','kalender','Sobek tanggal dan pindah ke hari berikutnya.','gesture',10),
 t(89,'kehidupan','interior-rumah','Interior rumah','rumah','ruang-tamu','Temukan detail kecil: ubin, taplak, saklar, kipas, gelas, dan rak.','find',15),
 t(90,'kehidupan','album-keluarga','Album keluarga','rumah','album','Balik halaman album dan susun slideshow personal lokal.','album',15),

 t(91,'fotografi','kamera-36-frame','Kamera 36 frame','rumah','kamera','Kelola sisa frame sebelum memotret.','camera',15),
 t(92,'fotografi','foto-gagal','Foto gagal','rumah','kamera','Hasil terlalu gelap/terang muncul sebagai konsekuensi setting.','camera',10),
 t(93,'fotografi','timestamp-foto','Timestamp foto','rumah','kamera','Atur cap tanggal bergaya kamera analog.','camera',10),
 t(94,'fotografi','studio-foto','Studio foto','kota','studio-foto','Pilih backdrop dan pose siluet tanpa memakai wajah pihak nyata.','studio',15),
 t(95,'fotografi','cetak-foto','Cetak foto','kota','photo-lab','Pilih ukuran cetak dan tunggu proses simulasi.','print',15),
 t(96,'fotografi','album-plastik','Album plastik','rumah','album','Geser foto virtual masuk ke sleeve.','album',10),
 t(97,'fotografi','film-negatif','Film negatif','kota','photo-lab','Lihat strip negatif dan cocokkan frame.','inspect',10),
 t(98,'fotografi','photo-lab','Photo lab','kota','photo-lab','Serahkan roll virtual dan ambil amplop cetak.','sequence',15),
 t(99,'fotografi','kamera-disposable','Kamera disposable-inspired','kota','studio-foto','Gunakan kamera sekali-pakai original-inspired dengan frame terbatas.','camera',15),
 t(100,'fotografi','memory-slideshow','Memory slideshow','rumah','album','Gabungkan kartu memori, foto personal, dan koleksi menjadi slideshow lokal.','album',25)
];

export const triggerCategories=[...new Set(memoryTriggers.map(trigger=>trigger.category))];
export const triggersByScene=memoryTriggers.reduce((acc,trigger)=>{
 (acc[trigger.scene]??=[]).push(trigger);
 return acc;
},{});
export const triggerById=new Map(memoryTriggers.map(trigger=>[trigger.id,trigger]));

export function getTrigger(id){return triggerById.get(id)||null;}
export function randomTrigger(scene,random=Math.random){
 const list=triggersByScene[scene]||memoryTriggers;
 return list[Math.floor(random()*list.length)]||memoryTriggers[0];
}

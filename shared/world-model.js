import {memoryTriggers} from './memory-triggers.js';

export const worldVersion='4.0.0';

export const nostalgiaProfiles=[
 {id:'anak-warung',label:'Anak Warung',scene:'kampung',keywords:['jajanan','warung','pedagang'],accent:'amber'},
 {id:'anak-sekolah',label:'Anak Sekolah',scene:'sekolah',keywords:['sekolah','binder','kantin'],accent:'chalk'},
 {id:'anak-radio',label:'Anak Radio Tengah Malam',scene:'rumah',keywords:['musik','radio','kaset'],accent:'violet'},
 {id:'anak-tv',label:'Anak Minggu Pagi',scene:'rumah',keywords:['televisi','tv','kartun'],accent:'cyan'},
 {id:'anak-rental',label:'Anak Rental',scene:'kota',keywords:['rental','vhs','game'],accent:'red'},
 {id:'anak-arcade',label:'Raja Dingdong',scene:'kota',keywords:['arcade','token','high-score'],accent:'magenta'},
 {id:'anak-lapangan',label:'Anak Lapangan',scene:'kampung',keywords:['permainan','lapangan','layangan'],accent:'green'},
 {id:'anak-komik',label:'Anak Komik',scene:'sekolah',keywords:['bacaan','majalah','komik'],accent:'blue'},
 {id:'anak-musik',label:'Anak Kaset',scene:'rumah',keywords:['musik','kaset','walkman'],accent:'orange'},
 {id:'anak-warnet',label:'Anak Warnet',scene:'digital',keywords:['teknologi','internet','chat'],accent:'lime'}
];

export const years=Array.from({length:10},(_,index)=>1990+index);

export const yearWorldState={
 1990:{tech:'telepon rumah + Wartel',media:'TV nasional & kaset',mood:'awal dekade',accent:'#d3a254'},
 1991:{tech:'pager mulai terasa futuristis',media:'radio + film remaja',mood:'urban youth',accent:'#c4865c'},
 1992:{tech:'MiniDisc muncul global',media:'kaset tetap dominan',mood:'audio transition',accent:'#8f9d82'},
 1993:{tech:'PC rumahan/kantor bertambah',media:'TV swasta makin ramai',mood:'transisi',accent:'#6f899c'},
 1994:{tech:'internet komersial Indonesia',media:'TV + kaset + komputer',mood:'online mulai masuk',accent:'#5a8c88'},
 1995:{tech:'Windows 95 + pager',media:'prime time TV & rental',mood:'dekade di puncak',accent:'#d48545'},
 1996:{tech:'APJII + handheld digital',media:'internet tumbuh',mood:'digital curiosity',accent:'#7f7ab8'},
 1997:{tech:'CD-ROM + warnet awal',media:'majalah + radio + TV',mood:'kota makin digital',accent:'#a66f8b'},
 1998:{tech:'handheld color + modem',media:'film/TV/musik beragam',mood:'akhir dekade berubah cepat',accent:'#567ca4'},
 1999:{tech:'chat/homepage personal',media:'internet + TV + CD/kaset',mood:'menjelang milenium',accent:'#4c7f75'}
};

const object=(id,label,x,y,triggerIds,icon,hint)=>({id,label,x,y,triggerIds,icon,hint});

export const scenes={
 rumah:{
  id:'rumah',label:'Rumah 90-an',eyebrow:'AREA 01 / RUMAH',description:'Ruang tamu, kamar, dapur, dan benda-benda kecil yang menyimpan ritual sehari-hari.',
  ambient:['kipas','jam dinding','TV jauh','motor lewat'],
  exits:['kampung','sekolah','kota','digital'],
  objects:[
   object('tv','TV Tabung',20,42,['tv-tabung','channel-manual','tv-semut','jadwal-tv-koran','channel-surfing','iklan-retro'],'▣','Coba nyalakan TV.'),
   object('vcr','VHS / VCR',35,56,['vhs-player','vhs-tertimpa'],'▰','Ada kaset yang belum di-rewind.'),
   object('tape','Tape Recorder',56,52,['tape-recorder','side-a-b','kaset-kusut','mixtape-maker'],'▤','Tekan tombol mekanisnya.'),
   object('radio','Radio',68,39,['request-radio','radio-tuner'],'◉','Putar tuner pelan-pelan.'),
   object('telepon','Telepon Rumah',80,48,['telepon-rumah','telepon-paralel','salah-sambung'],'☎','Nada tunggu masih terdengar.'),
   object('kalender','Kalender Sobek',88,22,['kalender-sobek'],'▧','Tanggalnya bisa kamu sobek.'),
   object('jam','Jam Dinding',72,16,['jam-dinding'],'◷','Jarumnya bisa mempercepat hari.'),
   object('sofa','Sofa',30,72,['remote-hilang','interior-rumah'],'▱','Mungkin remote terselip di sini.'),
   object('album','Album Foto',48,72,['album-keluarga','album-plastik','memory-slideshow'],'▦','Buka perlahan halaman plastiknya.'),
   object('kamera','Kamera Analog',60,70,['kamera-36-frame','foto-gagal','timestamp-foto'],'▣','Masih ada beberapa frame.'),
   object('walkman','Walkman',64,60,['walkman-simulator','battery-low'],'▥','Baterainya mulai lemah.'),
   object('meja-tulis','Meja Tulis',84,70,['surat-pos','kartu-lebaran'],'▤','Ada amplop dan pulpen.'),
   object('saklar','Saklar',92,55,['mati-lampu'],'◫','Kadang listrik suka turun.'),
   object('mainan','Kotak Mainan',15,78,['virtual-pet'],'◈','Ada suara kecil dari dalam.')
  ]
 },
 kampung:{
  id:'kampung',label:'Kampung / Komplek',eyebrow:'AREA 02 / KAMPUNG',description:'Gang, warung, lapangan, mushola, pedagang keliling, dan suara lingkungan yang bergerak sepanjang hari.',
  ambient:['anak bermain','pedagang','burung','motor','suara mushola'],exits:['rumah','sekolah','kota'],
  objects:[
   object('warung','Warung',18,50,['uang-receh','kembalian-permen','permen-berhadiah','kartu-hadiah-snack','warung-bon','toples-permen','mainan-snack'],'▤','Toplesnya penuh benda kecil.'),
   object('lapangan','Lapangan',52,62,['kelereng','gasing','lompat-karet','bentengan','layangan-putus','pistol-air'],'◇','Masih ada anak-anak bermain.'),
   object('gang','Gang',40,32,['petak-umpet','hujan-sore','penjual-keliling','suara-malam'],'╱','Coba jalan sampai ujung.'),
   object('mushola','Mushola',76,28,['magrib'],'△','Suasana berubah menjelang Magrib.'),
   object('telepon-umum','Telepon Umum',82,56,['telepon-koin'],'☎','Siapkan koin.'),
   object('pedagang','Pedagang Keliling',28,72,['tukang-jajanan-keliling'],'♢','Dengar panggilannya.'),
   object('teras','Teras Rumah',66,75,['mobil-kulit-jeruk','kapal-otok-otok','mobil-kabel','balon-pasta'],'▱','Tempat bikin mainan dari apa saja.'),
   object('halaman','Halaman',86,75,['interior-rumah'],'□','Detail kecil sering paling melekat.')
  ]
 },
 sekolah:{
  id:'sekolah',label:'Sekolah',eyebrow:'AREA 03 / SEKOLAH',description:'Kelas, kantin, gerbang, lapangan, binder, surat rahasia, dan ritme jam belajar.',
  ambient:['bel sekolah','murid','kapur','kursi digeser'],exits:['rumah','kampung','kota'],
  objects:[
   object('meja-kelas','Meja Kelas',35,58,['surat-rahasia','lipat-surat'],'▤','Ada kertas kecil di laci.'),
   object('papan-tulis','Papan Tulis',52,30,['hapus-papan'],'▰','Masih penuh tulisan kapur.'),
   object('binder','Binder',20,66,['buku-biodata','binder','tukar-binder'],'▥','Banyak lembar yang bisa ditukar.'),
   object('kelas','Kelas',52,55,['piket'],'▦','Hari ini jadwal piket.'),
   object('bel','Bel Sekolah',86,18,['bel-sekolah'],'◉','Bunyinya mengubah seluruh suasana.'),
   object('lapangan','Lapangan Sekolah',74,68,['upacara','adu-gambar','koleksi-cakram'],'◇','Pagi untuk upacara, siang untuk permainan.'),
   object('kantin','Kantin',16,32,['kantin','es-plastik','snack-remes'],'▤','Uang sakumu terbatas.'),
   object('gerbang','Gerbang',88,62,['jajanan-gerbang'],'Π','Pedagang sudah menunggu saat pulang.')
  ]
 },
 kota:{
  id:'kota',label:'Pusat Kota',eyebrow:'AREA 04 / KOTA',description:'Wartel, arcade, rental, toko kaset, studio foto, mall, bioskop, dan terminal dalam satu distrik nostalgia.',
  ambient:['bus','klakson','toko','orang berlalu-lalang'],exits:['rumah','kampung','sekolah','digital'],
  objects:[
   object('wartel','Wartel',18,40,['wartel','billing-wartel'],'▥','Bilik kosong, billing siap.'),
   object('arcade','Arcade',40,62,['mesin-arcade','token-arcade','high-score'],'▣','Masih ada satu token.'),
   object('rental','Rental',62,62,['mini-racing','rumor-cheat-code'],'▤','Ada rumor cheat code baru.'),
   object('toko-kaset','Toko Kaset',38,28,['toko-kaset'],'▦','Rak genre 90-an memenuhi dinding.'),
   object('pager','Pager',72,48,['pager'],'▥','Ada nomor masuk.'),
   object('studio-foto','Studio Foto',80,24,['studio-foto','kamera-disposable'],'▣','Backdrop sudah dipasang.'),
   object('photo-lab','Photo Lab',84,70,['cetak-foto','film-negatif','photo-lab'],'▤','Amplop cetak belum diambil.'),
   object('jalan','Jalan Kota',54,16,['malam-minggu'],'═','Malam Minggu mengubah pilihan tujuan.')
  ]
 },
 digital:{
  id:'digital',label:'Dunia Digital Akhir 90-an',eyebrow:'AREA 05 / DIGITAL',description:'Desktop retro-inspired, modem, floppy, dot matrix, chat room, guestbook, dan warnet.',
  ambient:['kipas PC','hard disk','printer','modem'],exits:['rumah','kota'],
  objects:[
   object('pc','PC Desktop',46,42,['boot-pc','chat-room','guestbook','homepage-pribadi'],'▣','Tekan tombol power.'),
   object('floppy','Floppy Drive',28,60,['disket-144','floppy-corrupt'],'▱','Disket belum dikeluarkan.'),
   object('printer','Dot Matrix',72,58,['printer-dot-matrix'],'▤','Kertas continuous form masih terpasang.'),
   object('modem','Modem',68,34,['dialup-modem','internet-disconnect'],'◫','Sambungkan ke jalur telepon.'),
   object('warnet','Warnet Desk',22,30,['warnet-billing'],'▦','Timer billing belum dimulai.')
  ]
 }
};

export const dayCampaign=[
 {time:'06:00',phase:'Bangun',scene:'rumah',prompt:'Jam dinding berdetak. Rumah masih pelan.',trigger:'jam-dinding'},
 {time:'06:15',phase:'Sarapan',scene:'rumah',prompt:'TV dan radio mulai terdengar dari ruang keluarga.',trigger:'radio-tuner'},
 {time:'06:45',phase:'Berangkat sekolah',scene:'kampung',prompt:'Gang mulai ramai, pedagang lewat.',trigger:'penjual-keliling'},
 {time:'07:00',phase:'Kelas / upacara',scene:'sekolah',prompt:'Bel berbunyi. Hari sekolah dimulai.',trigger:'upacara'},
 {time:'09:30',phase:'Istirahat',scene:'sekolah',prompt:'Kantin dan halaman penuh suara.',trigger:'kantin'},
 {time:'12:30',phase:'Pulang',scene:'sekolah',prompt:'Gerbang sekolah menjadi pusat jajanan.',trigger:'jajanan-gerbang'},
 {time:'13:00',phase:'Makan siang',scene:'rumah',prompt:'TV menyala pelan di ruang keluarga.',trigger:'channel-surfing'},
 {time:'14:00',phase:'Main',scene:'kampung',prompt:'Lapangan adalah pusat dunia sore.',trigger:'kelereng'},
 {time:'16:30',phase:'Jajan',scene:'kampung',prompt:'Warung dan pedagang keliling kembali ramai.',trigger:'toples-permen'},
 {time:'17:30',phase:'Magrib',scene:'kampung',prompt:'Permainan berhenti. Suasana berubah.',trigger:'magrib'},
 {time:'18:30',phase:'Belajar',scene:'rumah',prompt:'Meja tulis, buku, dan radio pelan.',trigger:'surat-pos'},
 {time:'19:30',phase:'TV keluarga',scene:'rumah',prompt:'Ruang keluarga menjadi pusat malam.',trigger:'tv-tabung'},
 {time:'21:00',phase:'Radio / telepon teman',scene:'rumah',prompt:'Suara malam terasa dekat.',trigger:'telepon-rumah'},
 {time:'22:00',phase:'Tidur',scene:'rumah',prompt:'TV tetangga dan jangkrik masih terdengar.',trigger:'suara-malam'}
];

export const randomMemoryEvents=[
 {id:'pedagang-lewat',label:'Pedagang lewat',scene:'kampung',trigger:'tukang-jajanan-keliling',weight:10},
 {id:'mati-lampu',label:'Mati lampu',scene:'rumah',trigger:'mati-lampu',weight:4},
 {id:'hujan',label:'Hujan sore',scene:'kampung',trigger:'hujan-sore',weight:7},
 {id:'telepon',label:'Telepon berbunyi',scene:'rumah',trigger:'telepon-rumah',weight:6},
 {id:'radio',label:'Radio menemukan lagu',scene:'rumah',trigger:'radio-tuner',weight:8},
 {id:'tetangga',label:'Tetangga datang',scene:'kampung',trigger:'interior-rumah',weight:4},
 {id:'tv-static',label:'TV berubah semut',scene:'rumah',trigger:'tv-semut',weight:5},
 {id:'kaset-kusut',label:'Kaset kusut',scene:'rumah',trigger:'kaset-kusut',weight:5},
 {id:'teman-main',label:'Teman mengajak main',scene:'kampung',trigger:'bentengan',weight:7},
 {id:'layangan',label:'Layangan putus',scene:'kampung',trigger:'layangan-putus',weight:4},
 {id:'magrib',label:'Suara Magrib',scene:'kampung',trigger:'magrib',weight:5},
 {id:'modem-putus',label:'Internet terputus',scene:'digital',trigger:'internet-disconnect',weight:5},
 {id:'billing',label:'Billing hampir habis',scene:'digital',trigger:'warnet-billing',weight:4},
 {id:'arcade-highscore',label:'Skor baru di arcade',scene:'kota',trigger:'high-score',weight:3}
];

export const collections=[
 {id:'phone-card',label:'Kartu telepon',icon:'▣'},
 {id:'cinema-ticket',label:'Tiket bioskop',icon:'▱'},
 {id:'snack-wrapper',label:'Bungkus snack original',icon:'▤'},
 {id:'sticker',label:'Stiker',icon:'◇'},
 {id:'cassette',label:'Kaset',icon:'▥'},
 {id:'cd',label:'CD',icon:'◉'},
 {id:'magazine',label:'Majalah',icon:'▦'},
 {id:'poster',label:'Poster original',icon:'▧'},
 {id:'game-card',label:'Kartu permainan',icon:'♢'},
 {id:'photo',label:'Foto',icon:'▣'},
 {id:'bus-ticket',label:'Tiket bus',icon:'═'},
 {id:'old-money',label:'Uang lama',icon:'○'},
 {id:'stamp',label:'Perangko',icon:'▧'}
];

export const achievements=[
 {id:'anak-kaset-sejati',label:'Anak Kaset Sejati',description:'Selesaikan lima ritual kaset: play, balik sisi, merapikan pita, memutar dengan pensil, dan membuat mixtape.',triggerIds:['tape-recorder','side-a-b','kaset-kusut','pensil-kaset','mixtape-maker'],target:5},
 {id:'penguasa-wartel',label:'Penguasa Wartel',description:'Selesaikan pengalaman menelepon dan memantau billing di bilik Wartel.',triggerIds:['wartel','billing-wartel'],target:2},
 {id:'raja-dingdong',label:'Raja Dingdong',description:'Kuasai mesin, token, dan papan high score arcade.',triggerIds:['mesin-arcade','token-arcade','high-score'],target:3},
 {id:'pemburu-layangan',label:'Pemburu Layangan',description:'Selesaikan lima permainan lapangan yang mengandalkan timing, chase, atau bidikan.',category:'permainan',mechanics:['timing','chase','aim'],target:5},
 {id:'penjelajah-waktu',label:'Penjelajah Waktu',description:'Kunjungi seluruh tahun 1990–1999.',kind:'years',target:10},
 {id:'keliling-kota',label:'Keliling Dunia 90-an',description:'Kunjungi lima area utama.',kind:'scenes',target:5}
];

export const onboardingChoices=nostalgiaProfiles.map(profile=>({id:profile.id,label:profile.label,scene:profile.scene}));

export function getScene(id){return scenes[id]||scenes.rumah;}
export function getWorldTrigger(id){return memoryTriggers.find(trigger=>trigger.id===id)||null;}
export function weightedRandomEvent(scene,random=Math.random){
 const eligible=randomMemoryEvents.filter(event=>event.scene===scene||event.scene==='global');
 const total=eligible.reduce((sum,event)=>sum+event.weight,0);
 let cursor=random()*total;
 for(const event of eligible){cursor-=event.weight;if(cursor<=0)return event;}
 return eligible[0]||randomMemoryEvents[0];
}

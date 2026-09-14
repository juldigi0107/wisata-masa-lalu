// Satu sumber data untuk frontend dan API.
export default {
  "version": "1.0.0",
  "notice": "Data contoh editorial. Jadwal bukan arsip siaran asli.",
  "stations": [
    "TVRI",
    "RCTI",
    "SCTV",
    "TPI",
    "ANTV",
    "Indosiar"
  ],
  "entries": [
    {
      "id": "si-doel",
      "type": "tv",
      "title": "Si Doel Anak Sekolahan",
      "summary": "Kursi sudah ditarik mendekat. Cerita keluarga mengisi ruang tamu.",
      "status": "mock",
      "layout": "clipping",
      "tags": [
        "tv",
        "nostalgia"
      ],
      "factBox": {
        "text": "Catatan riset Si Doel Anak Sekolahan: tahun penayangan, jadwal lokal, dan riwayat produksi masih perlu sumber arsip.",
        "status": "unverified",
        "sourceIds": []
      },
      "quoteBox": {
        "text": "Dulu gue sudah duduk manis sebelum acara mulai.",
        "kind": "editorial-fiction",
        "attribution": "Rekaan editorial"
      },
      "priceTag": {
        "label": "Biaya menonton",
        "currency": "IDR",
        "past": {
          "year": 1995,
          "amount": null,
          "sourceIds": []
        },
        "present": {
          "year": 2026,
          "amount": null,
          "sourceIds": []
        },
        "basis": "not-applicable",
        "note": "Belum ada bukti harga untuk perbandingan yang sebanding."
      },
      "sources": [],
      "assets": [],
      "details": {
        "station": "RCTI",
        "genre": "Drama keluarga"
      }
    },
    {
      "id": "keluarga-cemara",
      "type": "tv",
      "title": "Keluarga Cemara",
      "summary": "Buka lagi kliping tontonan keluarga yang disimpan di laci.",
      "status": "mock",
      "layout": "scrapbook",
      "tags": [
        "tv",
        "nostalgia"
      ],
      "factBox": {
        "text": "Catatan riset Keluarga Cemara: tahun penayangan, jadwal lokal, dan riwayat produksi masih perlu sumber arsip.",
        "status": "unverified",
        "sourceIds": []
      },
      "quoteBox": {
        "text": "Dulu gue nonton bareng sampai lupa rebutan tempat duduk.",
        "kind": "editorial-fiction",
        "attribution": "Rekaan editorial"
      },
      "priceTag": {
        "label": "Biaya menonton",
        "currency": "IDR",
        "past": {
          "year": 1995,
          "amount": null,
          "sourceIds": []
        },
        "present": {
          "year": 2026,
          "amount": null,
          "sourceIds": []
        },
        "basis": "not-applicable",
        "note": "Belum ada bukti harga untuk perbandingan yang sebanding."
      },
      "sources": [],
      "assets": [],
      "details": {
        "station": "RCTI",
        "genre": "Drama keluarga"
      }
    },
    {
      "id": "doraemon",
      "type": "kartun",
      "title": "Doraemon",
      "summary": "Bantal di lantai, sarapan di dekat TV. Minggu pagi terasa panjang.",
      "status": "mock",
      "layout": "poster",
      "tags": [
        "kartun",
        "nostalgia"
      ],
      "factBox": {
        "text": "Catatan riset Doraemon: tahun penayangan, jadwal lokal, dan riwayat produksi masih perlu sumber arsip.",
        "status": "unverified",
        "sourceIds": []
      },
      "quoteBox": {
        "text": "Dulu gue berharap punya pintu ke mana saja buat berangkat sekolah.",
        "kind": "editorial-fiction",
        "attribution": "Rekaan editorial"
      },
      "priceTag": {
        "label": "Komik pendamping",
        "currency": "IDR",
        "past": {
          "year": 1995,
          "amount": null,
          "sourceIds": []
        },
        "present": {
          "year": 2026,
          "amount": null,
          "sourceIds": []
        },
        "basis": "unknown",
        "note": "Belum ada bukti harga untuk perbandingan yang sebanding."
      },
      "sources": [],
      "assets": [],
      "details": {
        "voiceActors": []
      }
    },
    {
      "id": "detective-conan",
      "type": "kartun",
      "title": "Detective Conan",
      "summary": "Menebak petunjuk sambil menunggu misteri terungkap.",
      "status": "mock",
      "layout": "timeline",
      "tags": [
        "kartun",
        "nostalgia"
      ],
      "factBox": {
        "text": "Catatan riset Detective Conan: tahun penayangan, jadwal lokal, dan riwayat produksi masih perlu sumber arsip.",
        "status": "unverified",
        "sourceIds": []
      },
      "quoteBox": {
        "text": "Dulu gue sok jadi detektif setiap sandal di rumah hilang.",
        "kind": "editorial-fiction",
        "attribution": "Rekaan editorial"
      },
      "priceTag": {
        "label": "Komik pendamping",
        "currency": "IDR",
        "past": {
          "year": 1995,
          "amount": null,
          "sourceIds": []
        },
        "present": {
          "year": 2026,
          "amount": null,
          "sourceIds": []
        },
        "basis": "unknown",
        "note": "Belum ada bukti harga untuk perbandingan yang sebanding."
      },
      "sources": [],
      "assets": [],
      "details": {
        "voiceActors": []
      }
    }
  ],
  "schedules": [
    {
      "id": "s1",
      "entryId": "doraemon",
      "station": "RCTI",
      "day": "Minggu",
      "startMinute": 390,
      "endMinute": 450,
      "status": "simulation"
    },
    {
      "id": "s2",
      "entryId": "detective-conan",
      "station": "Indosiar",
      "day": "Minggu",
      "startMinute": 660,
      "endMinute": 720,
      "status": "simulation"
    },
    {
      "id": "s3",
      "entryId": "si-doel",
      "station": "RCTI",
      "day": "Senin",
      "startMinute": 1140,
      "endMinute": 1200,
      "status": "simulation"
    },
    {
      "id": "s4",
      "entryId": "keluarga-cemara",
      "station": "RCTI",
      "day": "Selasa",
      "startMinute": 1080,
      "endMinute": 1140,
      "status": "simulation"
    }
  ],
  "regions": [
    {
      "name": "Betawi",
      "lon": 106.8,
      "lat": -6.2,
      "games": [
        "Galasin",
        "Gundu"
      ]
    },
    {
      "name": "Jawa",
      "lon": 110.4,
      "lat": -7.8,
      "games": [
        "Gobak sodor",
        "Engklek"
      ]
    },
    {
      "name": "Sunda",
      "lon": 107.6,
      "lat": -6.9,
      "games": [
        "Oray-orayan",
        "Congklak"
      ]
    },
    {
      "name": "Medan",
      "lon": 98.7,
      "lat": 3.6,
      "games": [
        "Gasing",
        "Layang-layang"
      ]
    },
    {
      "name": "Makassar",
      "lon": 119.4,
      "lat": -5.1,
      "games": [
        "Kelereng",
        "Gasing"
      ]
    }
  ]
};

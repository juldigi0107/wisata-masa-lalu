# Wisata Masa Lalu — Edisi Tahun 90-an

Retro interactive nostalgia web platform / Webpedia Indonesia 1990–1999 dengan pendekatan premium editorial, provenance per entri, dan quality-control yang bisa diaudit.

## Arsitektur
- Frontend: React + Vite, dipublikasikan ke GitHub Pages.
- Backend: Cloudflare Workers API.
- SSOT: `shared/assembled-catalog.js` — saat ini **v2.7.0 / 46 entri**.
- Editorial intelligence: `shared/editorial-audit.js`, digunakan bersama oleh browser, test, dan Worker.
- Visual lokal: `public/assets/`.
- Foto berlisensi: diunduh saat build oleh `scripts/fetch-assets.mjs` ke `public/assets/media/`; halaman produksi tidak hotlink ke sumber eksternal.
- Ledger lisensi: `public/assets/ATTRIBUTION*.md`.

## Pengalaman editorial
Aplikasi menggabungkan Virtual CRT TV, Minggu Pagi, Permainan Kampung, Rental & Object Cabinet, timeline 1990–1999, Warung SD + kalkulator, Ramadhan 90-an, Kaset + Kamus Gaul, Nostalgia Meter 20 pertanyaan, katalog arsip progresif, serta **Ruang Redaksi / Editorial QA**.

Ruang Redaksi menampilkan:
- mean dan median editorial completeness,
- release-ready vs needs-attention,
- antrean riset per entri,
- peta gap provenance/visual/harga/metadata,
- DNA jenis sumber,
- jejak tahun 1990–1999 yang sudah muncul eksplisit di SSOT.

`completenessScore` **bukan truth score**. Nilai tersebut hanya mengukur kesiapan dokumentasi editorial. Kebenaran historis tetap bergantung pada mutu dan relevansi sumber.

## API v2.7
Endpoint utama:
- `/api/health`
- `/api/catalog`
- `/api/entries`
- `/api/facets`
- `/api/audit`
- `/api/sources`
- `/api/stats`
- `/api/schedules`
- `/api/archive-schedules`

`/api/entries` mendukung pencarian/pagination dan filter historis (`type`, `station`, `status`, `region`) serta filter editorial (`readiness`, `issue`, `minScore`, `maxScore`).

## Development
```bash
npm install
node scripts/fetch-assets.mjs
npm test
npm run dev
```

## Quality gates
`npm test` saat ini mencakup 18 test: kontrak API, provenance, pagination skala 500+, CORS, visual ledger, timeline, quiz, editorial audit, quality filters, year indexing, dan semantic separation antara verified/curated/simulation.

## Deployment
Push ke `main` memicu GitHub Pages. Sebelum `VITE_API_BASE_URL` diaktifkan, workflow Pages membandingkan Worker live dengan SSOT lokal: CORS, mode API, versi, jumlah entri, duplicate ID, dan exact set ID harus cocok. Jika tidak cocok, frontend dibangun dengan katalog lokal agar Worker lama tidak menurunkan isi aplikasi.

Cloudflare Worker menggunakan workflow `.github/workflows/worker.yml`. Auto-deploy dari GitHub Actions membutuhkan repository secrets `CLOUDFLARE_API_TOKEN` dan `CLOUDFLARE_ACCOUNT_ID`. Setelah deploy, `scripts/verify-worker.mjs` memverifikasi `/api/health`, `/api/catalog`, exact entry IDs, `/api/audit`, dan CORS sebelum Worker dianggap sinkron.

Lihat `DEPLOYMENT.md` untuk prosedur dan status detail.

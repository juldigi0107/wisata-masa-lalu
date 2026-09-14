# Wisata Masa Lalu — Edisi Tahun 90-an

Retro interactive nostalgia web platform / Webpedia Indonesia 1990–1999.

## Arsitektur
- Frontend: React + Vite + Tailwind CSS, GitHub Pages.
- Backend: Cloudflare Workers API.
- Data inti: `shared/catalog.js`, dipakai bersama frontend dan Worker.
- Visual lokal: `public/assets/`.
- Foto berlisensi: diunduh saat build oleh `scripts/fetch-assets.mjs` ke `public/assets/media/` sehingga halaman hasil deployment tidak bergantung pada hotlink.
- Ledger lisensi: `public/assets/ATTRIBUTION.md`.

## Premium editorial experience
Build sekarang memiliki 8 pengalaman: Virtual CRT TV, Minggu Pagi, Permainan Kampung, Rental & Game, Warung SD + kalkulator, Ramadhan 90-an, Kaset + Kamus Gaul, dan Nostalgia Meter 20 pertanyaan.

Aset vektor proyek dibuat khusus untuk aplikasi dan dipisahkan dari source code UI. Foto eksternal yang dipakai berasal dari sumber yang mengizinkan penggunaan kembali dan kreditnya dipertahankan.

## Development
```bash
npm install
node scripts/fetch-assets.mjs
npm run dev
```

## Deployment
Push ke `main` memicu GitHub Pages. API Cloudflare memakai workflow terpisah di `.github/workflows/worker.yml`.

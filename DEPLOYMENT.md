# Deployment — Wisata Masa Lalu

## Status arsitektur

- Frontend publik: `https://juldigi0107.github.io/wisata-masa-lalu/`
- Backend target: `https://wisata-masa-lalu.juldigi.workers.dev`
- Frontend: React + Vite + GitHub Pages.
- Backend source: Cloudflare Worker di `worker/index.js`.
- SSOT: `shared/assembled-catalog.js`.
- Versi SSOT repository: **v2.8.0 / 52 entri**.
- World Engine: **3.1.0 / 5 environment / 100 memory triggers**.
- Editorial audit: `shared/editorial-audit.js`.

### Status live Worker terakhir

Pada audit build **15 September 2026**, endpoint live masih melaporkan **v1.0.0 / mode `static-editorial-batch-1` / 4 entri**. Source repository sendiri sudah memakai `assembled-catalog.js` v2.8.0.

Karena itu workflow Pages **tidak mengaktifkan `VITE_API_BASE_URL`** untuk Worker tersebut dan membangun frontend memakai bundled SSOT. Ini disengaja: Worker lama tidak boleh menurunkan isi frontend produksi.

Jangan menganggap source GitHub yang lebih baru berarti Worker live otomatis sudah ikut berubah. Sinkronisasi baru dianggap selesai setelah exact verification lulus.

## Frontend GitHub Pages

Repository → Settings → Pages → Build and deployment → Source: **GitHub Actions**.

Push ke `main` menjalankan `.github/workflows/pages.yml`:

1. checkout + Node 22,
2. `npm install`,
3. `npm test`,
4. editorial intelligence report,
5. probe `/api/health` dan `/api/catalog` Worker,
6. validasi CORS, API mode, versi, entry count, duplicate IDs, dan exact ID set,
7. bind `VITE_API_BASE_URL` **hanya** bila Worker identik dengan SSOT,
8. restore cache visual,
9. fetch/recover 25 aset editorial berlisensi,
10. `npm run build`,
11. `node scripts/check-build-budget.mjs`,
12. upload Pages artifact hanya jika seluruh gate sebelumnya lulus,
13. deploy GitHub Pages.

### Performance budget

Production artifact ditolak bila melewati salah satu batas berikut:

- setiap JS chunk > **500 KiB**;
- CSS total > **180 KiB**;
- scene SVG > **100 KiB** per file;
- core JS + CSS > **850 KiB**.

Lima scene original saat ini berukuran sekitar 7–11 KB per file, jauh di bawah budget scene.

## Backend Cloudflare Worker

Konfigurasi Wrangler: `wrangler.jsonc`  
Entry point: `worker/index.js`

Worker source mengimpor:

- `shared/assembled-catalog.js`,
- `shared/editorial-audit.js`.

Health contract source menggunakan mode `curated-static-v2` dan harus melaporkan versi/jumlah entri yang sama dengan assembled SSOT.

### GitHub Actions deployment

Workflow: `.github/workflows/worker.yml`.

Deployment otomatis membutuhkan repository **Actions secrets**:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

Lokasi:

`GitHub repository → Settings → Secrets and variables → Actions → New repository secret`

Jangan menaruh token di source code, commit, issue publik, screenshot, atau chat.

Jika kedua secret tersedia, workflow:

1. install dependency,
2. menjalankan test kontrak,
3. membuat editorial report,
4. menjalankan `npm run deploy:worker`,
5. menjalankan `scripts/verify-worker.mjs`,
6. baru menganggap Worker sinkron bila health/catalog/audit/CORS dan exact IDs lulus.

Jika secret tidak tersedia, deploy dilewati. Probe live bersifat non-blocking dan hanya merekam apakah integrasi Cloudflare lain sudah menyinkronkan Worker.

## API v2.8 source contract

Endpoint utama:

- `GET /api/health`
- `GET /api/catalog`
- `GET /api/entries`
- `GET /api/facets`
- `GET /api/audit`
- `GET /api/sources`
- `GET /api/stats`
- `GET /api/schedules`
- `GET /api/archive-schedules`

`/api/entries` mendukung `q`, `type`, `station`, `status`, `region`, `readiness`, `issue`, `minScore`, `maxScore`, `limit`, dan `offset`. `limit` maksimal 100.

`completenessScore` adalah **documentation-readiness metric, bukan historical truth score**.

## PWA / offline

- Manifest: `public/manifest.webmanifest`.
- Service worker: `public/sw.js`.
- Current shell cache generation: `wml-time-machine-v3-4`.
- Core offline shell memasukkan brand art dan kelima scene.
- Memory Pack dapat menyimpan aset pilihan Rumah, Sekolah, atau Digital.
- `id`, `scope`, `start_url`, dan shortcuts manifest memakai URL relatif agar dapat dipindahkan dari GitHub Pages ke custom domain.

Ketika core scene artwork berubah, version cache harus dinaikkan agar install yang sudah ada tidak bertahan pada visual lama.

## Visual production pipeline

### Original immersive assets

`public/assets/world/` berisi visual original proyek:

- `brand-orbit.svg`
- `portal-grid.svg`
- `scenes/rumah-90.svg`
- `scenes/kampung-90.svg`
- `scenes/sekolah-90.svg`
- `scenes/kota-90.svg`
- `scenes/digital-90.svg`

Semua scene memakai canvas 1600×900, tanpa embedded base64. Mereka adalah ilustrasi stylized dan tidak dipresentasikan sebagai arsip fotografis.

### Licensed editorial assets

`scripts/fetch-assets.mjs` membangun aset ke `public/assets/media/`. GitHub Actions cache digunakan agar sumber eksternal tidak menjadi single point of failure pada setiap build.

Ledger atribusi: `public/assets/ATTRIBUTION*.md`.

## Mobile production contract

Mobile mempunyai layout tersendiri, bukan desktop yang dikecilkan:

- safe-area notch/home-indicator;
- compact horizontal HUD yang tetap mempertahankan semua action utama;
- horizontal spatial exit rail;
- touch target besar;
- bottom-sheet object interaction;
- bottom-sheet settings/search/time/collection;
- archive mendapatkan scroll surface sendiri ketika body world dikunci;
- profile strip tidak memenuhi layar utama;
- portrait **Focus Pan** menggeser scene 16:9 ke anchor benda aktif tanpa men-stretch artwork;
- reduced motion mematikan motion Focus Pan.

CI menghitung jumlah Focus Pan selector per scene dan membandingkannya dengan jumlah object World Engine untuk mencegah mapping visual tertinggal.

## Resilience

`src/main.jsx` membungkus World Engine dengan production error boundary. Render failure menampilkan recovery surface dan reload action, bukan blank page. Recovery **tidak menghapus local progress**.

Service worker menyediakan navigation fallback ke shell yang sudah dicache saat offline.

## Quality gates sebelum Pages publish

Gate saat ini mencakup:

1. API, CORS, search, pagination, facets dan audit contract;
2. provenance dan pemisahan `verified / curated / simulation`;
3. Fact Box source resolution;
4. editorial readiness dan explicit year indexing;
5. semantic duplicate checks;
6. Nostalgia Meter 20 pertanyaan;
7. visual ledger;
8. tepat 100 unique memory triggers bernomor 1–100;
9. seluruh scene object, exit, campaign step dan random event resolve;
10. achievement mempunyai unlock route yang didukung;
11. mechanic registry mencakup mechanic trigger;
12. tidak ada placeholder/prototype language pada World Engine;
13. lima scene SVG valid, 16:9, ringan, dan tanpa embedded base64;
14. anti-dashboard spatial layout contract;
15. reduced-motion/high-contrast/touch behavior;
16. mobile feature reachability dan archive scrolling;
17. Focus Pan coverage terhadap seluruh interactive object;
18. custom-domain asset portability;
19. PWA scope + shortcut portability;
20. Memory Pack contract;
21. branded render recovery;
22. Vite production build;
23. performance budget;
24. exact Worker/SSOT safety guard;
25. Pages artifact upload dan deploy.

## Arah ekspansi katalog

SSOT saat ini **52 entri**, bukan 500+. Fondasi sudah mendukung ekspansi bertahap melalui pagination, facets, progressive rendering, audit queue, provenance gaps, source-kind coverage, dan year indexing.

Penambahan entri sebaiknya berbasis evidence batch-by-batch. Jangan mengisi jadwal, harga, tokoh, atau fakta historis hanya untuk mengejar jumlah entri.

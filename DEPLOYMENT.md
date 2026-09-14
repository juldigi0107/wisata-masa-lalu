# Deployment — Wisata Masa Lalu

## Status arsitektur

- Frontend: GitHub Pages — `https://juldigi0107.github.io/wisata-masa-lalu/`
- Backend target: Cloudflare Worker — `https://wisata-masa-lalu.juldigi.workers.dev`
- Katalog lokal/SSOT aplikasi: `shared/assembled-catalog.js`
- Versi katalog saat ini: **v2.1.0**
- Frontend memiliki **safe fallback**: Worker hanya dipakai saat versi dan jumlah entrinya sama persis dengan katalog lokal. Worker yang tertinggal tidak boleh menurunkan isi aplikasi.

## Frontend GitHub Pages

Settings → Pages → Build and deployment → Source: **GitHub Actions**.

Setiap push ke `main` menjalankan workflow `.github/workflows/pages.yml`. Workflow:

1. memasang dependency,
2. menjalankan seluruh API/data test,
3. membandingkan versi katalog lokal dengan Worker live,
4. mengunduh aset visual berlisensi ke `public/assets/media/`,
5. membangun Vite production bundle,
6. memublikasikan artifact ke GitHub Pages.

Jika Worker live tidak identik dengan katalog lokal, build tetap dilanjutkan memakai bundled catalog. Ini disengaja untuk mencegah runtime downgrade.

## Backend Cloudflare Worker

Konfigurasi Wrangler berada di `wrangler.jsonc` dan entry point Worker adalah `worker/index.js`.

Worker menggunakan `shared/assembled-catalog.js` sehingga frontend dan backend mempunyai struktur data yang sama. Database eksternal belum diperlukan untuk katalog kurasi statis saat ini.

### Opsi A — Cloudflare Git integration

Di dashboard Cloudflare, hubungkan repository ini dan gunakan project/Worker yang mengarah ke root repository. Perintah deployment adalah:

```text
npx wrangler deploy
```

Pastikan integrasi Cloudflare benar-benar mengikuti branch `main` dan bukan snapshot lama.

### Opsi B — GitHub Actions

Repository membutuhkan dua **Actions secrets** berikut:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

Lokasi: GitHub repository → Settings → Secrets and variables → Actions → New repository secret.

Jangan menyimpan token di source code, file `.env` yang di-commit, issue, atau chat.

Workflow `.github/workflows/worker.yml` selalu menjalankan test. Langkah deploy hanya berjalan jika kedua secret tersedia; jika tidak, workflow tetap melaporkan validasi kode berhasil tetapi deployment dilewati.

## Endpoint API v2.1

- `GET /api/health`
- `GET /api/catalog`
- `GET /api/entries?q=doraemon&type=kartun`
- `GET /api/entries?type=mainan`
- `GET /api/entries?station=RCTI&type=tv`
- `GET /api/schedules?day=Minggu`
- `GET /api/archive-schedules?date=1995-06-04&station=RCTI`
- `GET /api/sources`
- `GET /api/stats`

`/api/health` harus melaporkan versi yang sama dengan katalog lokal sebelum frontend mengaktifkan runtime binding ke Worker.

## Aset visual

Aset eksternal diambil dari sumber berlisensi melalui `scripts/fetch-assets.mjs`. Downloader memiliki retry/backoff untuk HTTP 429/5xx dan build menolak hasil yang terlalu tidak lengkap.

Sumber, kreator, dan lisensi dicatat di `public/assets/ATTRIBUTION.md`.

Aset vektor orisinal proyek berada di `public/assets/`.

## Data dan provenance

- Fakta historis menggunakan `status: verified` atau `status: curated`.
- `verified` wajib mempunyai sumber.
- Kutipan nostalgia rekaan selalu diberi label editorial.
- Jadwal simulasi dipisahkan dari `archiveSchedules`.
- Sampel jadwal komunitas tidak diklaim sebagai scan koran primer.
- Harga jajanan yang belum memiliki sumber historis tetap diberi disclaimer dan tidak diperlakukan sebagai indeks inflasi resmi.

## Verifikasi minimum sebelum rilis

1. `npm test` lulus.
2. `npm run build` lulus.
3. Semua ID entri unik.
4. Semua `sourceIds` dapat diselesaikan ke daftar sumber entri.
5. Entri `verified` mempunyai sumber.
6. Semua enam stasiun TV memiliki sedikitnya satu entri kurasi.
7. Artifact visual berhasil diambil atau memenuhi minimum build.
8. Pages publish berhasil.
9. Worker `/api/health` diperiksa versinya secara eksplisit.

## Cakupan saat ini

Aplikasi bukan lagi Batch 1. Katalog v2.1 menggabungkan kurasi TV/kartun dengan batch permainan rakyat bersumber resmi, sementara UI sudah mempunyai CRT simulator, arsip Minggu pagi, blueprint permainan, object cabinet, kalkulator warung, Ramadhan experience, kaset/kamus gaul, quiz 20 pertanyaan, pencarian arsip, dan source ledger.

Target jangka lanjut tetap **500+ entri**. Penambahan dilakukan per batch terkurasi melalui file enrichment agar data lama tidak rusak.

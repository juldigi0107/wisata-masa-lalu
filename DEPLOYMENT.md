# Deployment — Wisata Masa Lalu

## Status arsitektur

- Frontend: GitHub Pages — `https://juldigi0107.github.io/wisata-masa-lalu/`
- Backend target: Cloudflare Worker — `https://wisata-masa-lalu.juldigi.workers.dev`
- Katalog lokal/SSOT aplikasi: `shared/assembled-catalog.js`
- Versi katalog saat ini: **v2.4.0**
- Jumlah katalog teruji: **39 entri** lintas TV, kartun/anime, permainan, benda/game, musik/personal audio, Ramadhan, budaya warung, makanan/minuman, dan budaya baca.
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

## Endpoint API — kontrak skala 500+

- `GET /api/health`
- `GET /api/catalog`
- `GET /api/entries?q=doraemon&type=kartun`
- `GET /api/entries?type=mainan&limit=24&offset=0`
- `GET /api/entries?station=RCTI&type=tv`
- `GET /api/entries?status=verified`
- `GET /api/entries?region=betawi`
- `GET /api/facets`
- `GET /api/schedules?day=Minggu`
- `GET /api/archive-schedules?date=1995-06-04&station=RCTI`
- `GET /api/sources`
- `GET /api/stats`

`/api/entries` mendukung filter `q`, `type`, `station`, `status`, dan `region`. Pagination memakai `limit` dan `offset`; `limit` dibatasi maksimal 100. Respons mengembalikan `total`, `offset`, `limit`, dan `nextOffset` agar client tidak perlu memuat seluruh katalog sekaligus.

`/api/facets` mengembalikan agregasi `byType`, `byStatus`, `byStation`, dan `byRegion` sehingga navigasi kategori dapat dibangun tanpa mengambil semua record.

`/api/health` harus melaporkan versi yang sama dengan katalog lokal sebelum frontend mengaktifkan runtime binding ke Worker.

## Aset visual

Aset eksternal diambil dari sumber berlisensi melalui `scripts/fetch-assets.mjs`. Downloader memiliki retry/backoff untuk HTTP 429/5xx dan build menolak hasil yang terlalu tidak lengkap.

Sumber, kreator, dan lisensi awal dicatat di `public/assets/ATTRIBUTION.md`. Tambahan batch v2.4 dicatat di `public/assets/ATTRIBUTION-v2.4.md`.

Aset vektor orisinal proyek berada di `public/assets/`.

Pipeline v2.4 menargetkan **20 aset visual lokal** dan mensyaratkan minimal 18 berhasil diunduh agar build boleh diteruskan.

## Data dan provenance

- Fakta historis menggunakan `status: verified` atau `status: curated`.
- `verified` wajib mempunyai sumber.
- Kutipan nostalgia rekaan selalu diberi label editorial.
- Tanggal karya asli anime dapat terverifikasi dari studio/pemegang hak, tetapi konteks penayangan Indonesia tetap `curated` bila arsip jadwal lokal belum cukup kuat.
- Jadwal simulasi dipisahkan dari `archiveSchedules`.
- Sampel jadwal komunitas tidak diklaim sebagai scan koran primer.
- Harga jajanan dan barang yang belum memiliki sumber historis tetap kosong/disclaimer; tidak diubah menjadi angka perkiraan seolah fakta.
- Batch budaya baca, makanan/minuman, dan personal audio v2.4 memakai sumber penerbit/produsen resmi bila tersedia; sumber sekunder tetap diberi jenis sumber secara eksplisit.

## Verifikasi minimum sebelum rilis

1. `npm test` lulus.
2. `npm run build` lulus.
3. Semua ID entri unik.
4. Semua `sourceIds` dapat diselesaikan ke daftar sumber entri.
5. Entri `verified` mempunyai sumber.
6. Semua enam stasiun TV memiliki sedikitnya satu entri kurasi.
7. Pagination, filter, facets, CORS, dan error path API lulus test.
8. Artifact visual berhasil diambil atau memenuhi minimum build.
9. Pages publish berhasil.
10. Worker `/api/health` diperiksa versinya secara eksplisit.

## Cakupan saat ini

Aplikasi bukan lagi Batch 1. Katalog v2.4 berisi 39 entri terkurasi dan UI mempunyai CRT simulator, arsip Minggu pagi, blueprint permainan, object cabinet, kalkulator warung, Ramadhan experience, kaset/kamus gaul, quiz 20 pertanyaan, pencarian + filter kategori arsip, progressive loading 12 entri per batch, detail provenance, dan source ledger.

Batch v2.4 menambahkan budaya baca (Majalah Bobo, gelombang manga Elex, Toko Buku Gramedia), makanan/minuman (Indomie Mi Goreng dan AQUA), serta personal audio (Walkman dan Discman/CD portable). API dan rendering arsip sudah disiapkan untuk pertumbuhan ke **500+ entri** melalui pagination, facets, progressive rendering, dan `content-visibility` pada kartu off-screen.

Penambahan konten tetap dilakukan per batch enrichment supaya data lama tidak rusak dan setiap fakta baru mempunyai provenance yang jelas.

# Deployment — Wisata Masa Lalu

## Status arsitektur

- Frontend publik: `https://juldigi0107.github.io/wisata-masa-lalu/`
- Backend target: `https://wisata-masa-lalu.juldigi.workers.dev`
- SSOT: `shared/assembled-catalog.js`
- Versi SSOT saat ini: **v2.7.0**
- Katalog teruji: **46 entri** lintas TV, kartun/anime, permainan, benda/game, musik/personal audio, Ramadhan, budaya warung, makanan/minuman, budaya baca, sekolah/alat tulis, teknologi komunikasi, dan film.
- Editorial intelligence: `shared/editorial-audit.js`.
- Production frontend menggunakan **safe fallback**: Worker hanya di-bind bila CORS, API mode, versi, jumlah entri, duplicate check, dan exact set ID cocok dengan SSOT lokal.

> Catatan status nyata: source Worker v2.7 dan seluruh test sudah valid, tetapi deployment GitHub Actions membutuhkan `CLOUDFLARE_API_TOKEN` dan `CLOUDFLARE_ACCOUNT_ID`. Jika kedua secret belum tersedia, workflow Worker melakukan test + probe saja dan **tidak** mengklaim telah mendeploy backend.

## Frontend GitHub Pages

Settings → Pages → Build and deployment → Source: **GitHub Actions**.

Setiap push ke `main` menjalankan `.github/workflows/pages.yml`:

1. memasang dependency,
2. menjalankan seluruh test,
3. memeriksa Worker live,
4. membandingkan `health.version`, `mode`, jumlah entri, CORS, duplicate ID, dan exact ID set terhadap SSOT,
5. hanya jika identik: menulis `VITE_API_BASE_URL` untuk build,
6. jika tidak identik: tetap build dengan bundled catalog,
7. merestore cache aset visual,
8. mengunduh/recover aset berlisensi,
9. membangun Vite production bundle,
10. mengunggah dan memublikasikan artifact Pages.

Dengan mekanisme ini, Worker lama tidak dapat menurunkan katalog frontend produksi walaupun endpoint Worker masih online.

## Backend Cloudflare Worker

Konfigurasi Wrangler: `wrangler.jsonc`  
Entry point: `worker/index.js`

Worker memakai `shared/assembled-catalog.js` dan `shared/editorial-audit.js`, sehingga API historis dan audit editorial memakai SSOT yang sama dengan frontend.

### GitHub Actions deployment

Repository membutuhkan dua **Actions secrets**:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

Lokasi:

`GitHub repository → Settings → Secrets and variables → Actions → New repository secret`

Jangan pernah menaruh token di source code, `.env` yang di-commit, issue publik, screenshot, atau chat.

Workflow `.github/workflows/worker.yml`:

1. `npm install`,
2. `npm test`,
3. deploy `npm run deploy:worker` hanya bila kedua secret ada,
4. sesudah deploy menjalankan `scripts/verify-worker.mjs`,
5. deployment dianggap sinkron hanya bila health/catalog/audit/CORS cocok dengan SSOT.

Jika secret tidak ada, deploy dan strict live-verification dilewati; workflow menjalankan satu probe non-blocking untuk merekam apakah Cloudflare Git integration lain sudah memperbarui Worker.

### Alternatif: Cloudflare Git integration

Cloudflare dapat dihubungkan langsung ke repository `main`. Perintah deployment:

```text
npx wrangler deploy
```

Pastikan integrasi mengikuti branch `main` terbaru. Setelah deployment, jalankan/verifikasi endpoint live; jangan menganggap source GitHub otomatis berarti Worker telah berubah.

## Endpoint API v2.7

### Katalog dan discovery

- `GET /api/health`
- `GET /api/catalog`
- `GET /api/entries?q=doraemon&type=kartun`
- `GET /api/entries?type=mainan&limit=24&offset=0`
- `GET /api/entries?station=RCTI&type=tv`
- `GET /api/entries?status=verified`
- `GET /api/entries?region=betawi`

### Editorial intelligence

- `GET /api/audit`
- `GET /api/audit?readiness=needs-research&limit=24`
- `GET /api/audit?issue=no-strong-source&type=tv`
- `GET /api/entries?readiness=solid`
- `GET /api/entries?issue=no-entry-visual`
- `GET /api/entries?minScore=70&maxScore=85`
- `GET /api/facets`
- `GET /api/stats`

### Sumber dan jadwal

- `GET /api/sources`
- `GET /api/schedules?day=Minggu`
- `GET /api/archive-schedules?date=1995-06-04&station=RCTI`

`/api/entries` mendukung `q`, `type`, `station`, `status`, `region`, `readiness`, `issue`, `minScore`, `maxScore`, `limit`, dan `offset`. `limit` dibatasi maksimal 100.

`/api/facets` mengembalikan agregasi historis (`byType`, `byStatus`, `byStation`, `byRegion`) dan editorial (`byReadiness`, `byIssue`, `bySourceKind`, `byYear`).

`/api/audit` mengembalikan mean/median completeness, release-ready, needs-attention, verified-with-issues, facets editorial, dan research priority queue.

**Completeness score bukan truth score.** Skor hanya mengukur seberapa lengkap sebuah entri terdokumentasi secara editorial. Mutu fakta tetap bergantung pada sumber.

## Provenance dan editorial policy

- Fakta historis menggunakan `status: verified` atau `status: curated`.
- `verified` harus mempunyai sumber yang dapat dilacak.
- Fact Box menyimpan `sourceIds`; ID tersebut harus resolve ke sumber pada entri yang sama.
- Kutipan nostalgia rekaan selalu diberi metadata `editorial-fiction`.
- `simulation` dipakai untuk pengalaman interaktif yang tidak diklaim sebagai transkripsi arsip.
- Jadwal simulasi dipisahkan dari `archiveSchedules`.
- Sampel komunitas tidak dipresentasikan sebagai scan koran primer.
- Harga historis yang belum memiliki bukti tetap kosong/disclaimer dan tidak diubah menjadi angka perkiraan yang terlihat faktual.
- Fakta produk global dipisahkan dari klaim popularitas/distribusi Indonesia bila data lokal belum tersedia.
- Poster, still film, cover majalah, dan visual lain yang hak pakainya tidak cukup jelas tidak disalin ke aset publik.

## Editorial Audit v2.7

`shared/editorial-audit.js` menghitung diagnostic non-historis untuk tiap entri:

- kelengkapan metadata inti,
- keberadaan/validitas URL sumber,
- `checkedAt` sumber,
- source-kind mix,
- resolusi Fact Box → sumber,
- metadata kutipan editorial,
- konteks/evidence price tag,
- keberadaan visual entri,
- detail/tags/layout,
- alignment entri `verified` dengan provenance,
- explicit year signals 1990–1999.

Readiness bucket:

- `release-ready`
- `solid`
- `needs-research`
- `incomplete`

Research queue memprioritaskan entri `verified` yang masih memiliki gap, kemudian completeness score terendah.

## Aset visual

Aset eksternal diambil melalui `scripts/fetch-assets.mjs`, dengan retry/backoff dan recovery untuk sumber opsional. Cache GitHub Actions mencegah Wikimedia Commons menjadi single point of failure pada setiap build.

Ledger sumber/kreator/lisensi berada di `public/assets/ATTRIBUTION*.md`.

Pipeline menargetkan **25 aset visual lokal** dan build mengharuskan minimum aset inti tersedia. Object-study tambahan boleh gagal sementara bila source throttling terjadi; cache/recovery akan digunakan.

## Quality gates minimum sebelum rilis

1. `npm test` lulus — saat ini **18 test**.
2. Semua ID entri unik.
3. Semua `sourceIds` Fact Box resolve.
4. Entri `verified` mempunyai provenance.
5. Semua enam stasiun TV memiliki entry coverage.
6. Search, pagination, facets, quality filters, CORS, error path lulus.
7. Audit engine mencakup seluruh SSOT dan tidak memakai vocabulary “truth score”.
8. Timeline linked milestone resolve ke entry SSOT.
9. Visual ledger unik dan mencakup object cabinet.
10. Asset fetch/recovery memenuhi minimum build.
11. `npm run build` lulus.
12. Pages hanya bind ke Worker jika exact SSOT match.
13. Pages publish berhasil.
14. Jika Worker dideploy: `/api/health`, `/api/catalog`, exact IDs, `/api/audit`, dan CORS harus lulus `verify-worker.mjs`.

## Cakupan saat ini dan arah 500+

v2.7 tetap menggunakan **46 entri kurasi** tetapi fondasi telah disiapkan untuk 500+ melalui:

- pagination,
- facets,
- progressive rendering,
- `content-visibility` untuk kartu off-screen,
- research priority queue,
- explicit editorial gaps,
- source-kind coverage,
- year indexing,
- quality-aware API filtering.

Ekspansi berikutnya sebaiknya dilakukan per batch enrichment, dengan target memperbaiki gap yang terlihat di Ruang Redaksi terlebih dahulu sebelum mengejar kuantitas katalog.

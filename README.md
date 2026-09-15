# Wisata Masa Lalu — Indonesia 90-an

**Immersive nostalgia world / ensiklopedia interaktif Indonesia 1990–1999.**

Aplikasi ini tidak memakai pola dashboard sebagai pengalaman utama. Pengguna masuk ke dunia spatial 90-an, menyentuh benda yang familiar, memainkan interaksi kecil, lalu membuka fakta dan provenance melalui *Contextual Archive Lens*. Arsip editorial besar tetap tersedia sebagai lapisan kedua.

## World Engine 3.1

Pengalaman utama terdiri dari lima environment original:

- **Rumah 90-an** — CRT, VCR, tape recorder, radio, telepon rumah, album, kamera, Walkman, kalender, meja tulis, dan benda kecil ruang keluarga.
- **Kampung / Komplek** — warung, lapangan, gang, mushola, telepon umum, pedagang keliling, teras, dan halaman rumah.
- **Sekolah** — kelas, papan tulis, binder, meja, bel, kantin, lapangan, dan gerbang.
- **Pusat Kota** — Wartel, arcade, rental game, toko kaset, pager, studio foto, photo lab, dan suasana malam minggu.
- **Dunia Digital Akhir 90-an** — PC desktop, floppy disk, dot-matrix printer, modem dial-up, chat room, homepage personal, dan warnet.

Environment dibuat sebagai SVG original 1600×900 dan sengaja stylized; aplikasi tidak menyajikannya sebagai foto arsip. Pada portrait mobile, *Focus Pan* menggeser scene ke anchor visual benda yang sedang dipilih tanpa merusak proporsi 16:9.

## 100 Memory Triggers

World Engine mempunyai **tepat 100 trigger interaktif**. CI memvalidasi nomor 1–100, ID unik, scene, object binding, campaign harian, random event, mechanic renderer, dan jalur achievement.

Mechanic yang tersedia antara lain TV/signal tuning, rotary/phone, billing Wartel, cassette/VHS repair, arcade, camera, shop, timing/aim, compose, chat room, builder, boot PC, dial-up handshake, strategy, virtual pet, ambient listening, negative/contact-sheet inspection, dan lain-lain. Mechanic baru tidak boleh diam-diam jatuh ke tombol generik tanpa renderer yang terdaftar.

## Contextual Encyclopedia

Alur utamanya:

**benda → interaksi → memori → Contextual Archive Lens → fakta → sumber**

Jika tidak ada evidence historis yang cukup, UI menyatakan kekurangannya dan tidak mengarang fakta. Label seperti `verified`, `curated`, `simulation`, dan readiness editorial dijaga terpisah.

## Arsitektur

- Frontend: **React + Vite**, dipublikasikan ke GitHub Pages.
- Backend source: **Cloudflare Workers API**.
- SSOT: `shared/assembled-catalog.js` — **v2.8.0 / 52 entri**.
- Immersive model: `shared/world-model.js`.
- 100 trigger: `shared/memory-triggers.js`.
- Mechanic contract: `shared/mechanic-registry.js`.
- Editorial intelligence: `shared/editorial-audit.js`.
- Original world art: `public/assets/world/`.
- Licensed editorial media: `public/assets/media/`, dibangun oleh `scripts/fetch-assets.mjs`.
- Attribution ledger: `public/assets/ATTRIBUTION*.md`.
- PWA/offline shell: `public/sw.js` + `public/manifest.webmanifest`.

Foto editorial yang diperbolehkan diunduh saat build ke asset lokal; runtime tidak bergantung pada hotlink media eksternal. Materi TV/musik berhak cipta tidak direplikasi sebagai stream atau screenshot tanpa izin.

## UI/UX principles

- scene-first, bukan card/dashboard-first;
- diegetic temporal HUD;
- progressive disclosure;
- desktop spatial navigation;
- dedicated mobile composition, bukan desktop yang dikecilkan;
- safe-area support untuk perangkat ber-notch;
- touch target besar pada pointer coarse;
- keyboard Escape untuk menutup interaction/overlay;
- `prefers-reduced-motion` dan high-contrast escape hatches;
- branded render-error recovery agar pengguna tidak mendapat blank page;
- progress perjalanan tetap lokal di perangkat dan tidak dihapus oleh recovery screen.

Panel quality-control editorial tidak ditempatkan sebagai pengalaman nostalgia publik. Audit/readiness tetap hidup di test/API/tooling untuk editor.

## PWA & offline Memory Pack

Service worker menyimpan application shell dan lima scene utama. Dari Settings pengguna dapat menyimpan paket offline tertentu, misalnya Rumah, Sekolah, atau Digital. Manifest, scope, dan shortcut memakai URL relatif sehingga tidak terikat pada nama repository dan tetap portable ke custom domain.

## API v2.8

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

`/api/entries` mendukung pencarian/pagination, filter historis (`type`, `station`, `status`, `region`), dan filter editorial (`readiness`, `issue`, `minScore`, `maxScore`).

`completenessScore` adalah **documentation-readiness metric, bukan historical truth score**. Status release-ready juga mensyaratkan tidak ada issue yang terdeteksi dan evidence yang cukup kuat.

## Quality gates

`npm test` memvalidasi antara lain:

- API contract, CORS, search, pagination, stats dan audit;
- provenance dan semantic separation `verified / curated / simulation`;
- editorial readiness dan year indexing;
- 100 memory triggers dan semua spatial object binding;
- mechanic registry;
- PWA shell dan Memory Pack message contract;
- lima SVG scene original, 16:9, tanpa embedded base64;
- anti-dashboard spatial CSS;
- mobile safe-area, feature reachability, archive scrolling, dan Focus Pan coverage;
- custom-domain portability;
- crash-recovery boundary;
- urutan performance budget sebelum Pages artifact dipublikasikan.

Production build juga menjalankan `scripts/check-build-budget.mjs`. Batas saat ini:

- setiap JS chunk ≤ 500 KiB;
- CSS total ≤ 180 KiB;
- setiap scene SVG ≤ 100 KiB;
- core JS + CSS ≤ 850 KiB.

## Development

```bash
npm install
node scripts/fetch-assets.mjs
npm test
npm run build
npm run dev
```

## Deployment safety

Push ke `main` memicu GitHub Pages. Sebelum runtime Cloudflare URL dimasukkan ke build, workflow membandingkan Worker live dengan SSOT lokal: CORS, mode API, versi, jumlah entri, duplicate IDs, dan exact set IDs harus cocok. Jika Worker tertinggal, frontend otomatis memakai bundled SSOT sehingga backend lama tidak dapat menurunkan isi aplikasi.

Cloudflare Worker memakai `.github/workflows/worker.yml`. Deployment dari GitHub Actions memerlukan repository Actions secrets `CLOUDFLARE_API_TOKEN` dan `CLOUDFLARE_ACCOUNT_ID`. Secret tidak boleh ditulis di source code atau dikirim melalui chat. Setelah deploy, `scripts/verify-worker.mjs` memeriksa `/api/health`, `/api/catalog`, exact entry IDs, audit contract, dan CORS.

Lihat `DEPLOYMENT.md` untuk prosedur operasional lebih rinci.

---

**Wisata Masa Lalu: Edisi Tahun 90-an | Web Engine v1.0 | © Kolektor 90an**

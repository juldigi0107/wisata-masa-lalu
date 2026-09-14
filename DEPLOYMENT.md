# Deployment
## Frontend
Settings → Pages → Build and deployment → Source: GitHub Actions.
Push main memulai workflow Pages. Jika pengaturan baru diaktifkan, jalankan ulang workflow melalui Actions.
Alamat yang diharapkan: https://juldigi0107.github.io/wisata-masa-lalu/ (baru aktif setelah deployment berhasil).
## Backend: dashboard Cloudflare
Workers & Pages → buat Worker dengan import repositori ini.
Nama Worker: wisata-masa-lalu-api. Root directory: /. Build command: npm test. Deploy command: npx wrangler deploy.
Konfigurasi wrangler.jsonc menunjuk worker/index.js; API menggunakan katalog JSON yang dibundel sebagai modul JS, tanpa database tambahan.
Alternatif: set repository Actions secrets CLOUDFLARE_API_TOKEN dan CLOUDFLARE_ACCOUNT_ID lalu jalankan workflow Deploy Cloudflare Workers API.
Simpan token hanya dalam pengaturan secret, bukan source code atau chat.
## Hubungkan
Set repository Actions variable VITE_API_BASE_URL ke origin HTTPS Worker yang benar dari hasil deployment (tanpa /api di akhir).
Jalankan ulang workflow Pages. Tanpa variable ini, aplikasi menggunakan katalog bawaan dengan status yang terlihat.
Jika domain frontend diubah, perbarui ALLOWED_ORIGIN pada wrangler.jsonc.
## Endpoint
GET /api/health
GET /api/catalog
GET /api/entries?q=doraemon&type=kartun
GET /api/schedules?day=Minggu
## Verifikasi
Workflow menjalankan API tests dan build frontend. Pengujian browser manual: daya TV, 6 saluran, CRT, audio setelah klik, slider, filter hari/jam, pencarian, detail, navigasi wilayah, layar mobile.
Belum ada browser runner pada sesi pembuatan; jangan menganggap UI sudah diuji.
## Cakupan
Fondasi Batch 1: 4 entri editorial contoh, jadwal simulasi, harga belum terverifikasi. Belum merupakan 500 entri atau aplikasi lengkap 8 modul.
Aset foto, radio berlisensi, 10 renderer layout, kuis, mini-game, dan CMS belum diimplementasi.
Font Cooper memakai fallback Georgia bila font lokal tidak tersedia.
## Referensi
https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages
https://developers.cloudflare.com/workers/wrangler/configuration/

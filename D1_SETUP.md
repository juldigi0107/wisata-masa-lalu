# Cloudflare D1 — Memory Wall & Moderation

Source code sudah memiliki schema dan endpoint untuk Memory Wall kolektif. Deployment publik saat ini tetap aman bila D1 belum dipasang: endpoint social mengembalikan `503 D1_NOT_CONFIGURED` dan frontend otomatis memakai mode pribadi/lokal.

## 1. Buat database D1

Jalankan dari root repository pada environment yang sudah login Cloudflare:

```bash
npx wrangler d1 create wisata-masa-lalu
```

Salin `database_id` yang dikembalikan Cloudflare.

## 2. Tambahkan binding ke `wrangler.jsonc`

Tambahkan properti berikut setelah `vars`:

```jsonc
"d1_databases": [
  {
    "binding": "DB",
    "database_name": "wisata-masa-lalu",
    "database_id": "<DATABASE_ID_DARI_CLOUDFLARE>",
    "migrations_dir": "migrations"
  }
]
```

Jangan memasukkan token API ke repository.

## 3. Terapkan migration

```bash
npx wrangler d1 migrations apply wisata-masa-lalu --remote
```

Migration awal: `migrations/0001_social_memory.sql`.

Tabel yang dibuat:

- `memory_posts` — cerita pengguna, default `pending`.
- `memory_votes` — satu vote per perangkat lokal dan per post.
- `moderation_log` — histori approve/reject/restore.

Tidak ada kolom email, nomor telepon, alamat IP, atau identifier langsung lain.

## 4. Tambahkan secret moderasi

```bash
npx wrangler secret put ADMIN_TOKEN
```

Gunakan token panjang/random dan jangan simpan nilainya di source code.

Endpoint admin membutuhkan:

```http
Authorization: Bearer <ADMIN_TOKEN>
```

## 5. Deploy Worker

Workflow GitHub sudah menunggu dua Repository Actions secrets:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

Atau deploy langsung dari environment Cloudflare yang sudah login:

```bash
npx wrangler deploy
```

## 6. Contract API

### Public

- `GET /api/memories`
- `POST /api/memories`
- `POST /api/memories/:id/vote`

Posting baru selalu masuk sebagai `pending` dan tidak muncul di dinding publik sebelum di-approve.

### Moderation

- `GET /api/admin/memories?status=pending`
- `PATCH /api/admin/memories/:id`

Payload moderation:

```json
{
  "status": "approved",
  "note": "Aman dipublikasikan"
}
```

Status valid: `pending`, `approved`, `rejected`.

## 7. Frontend fallback

`SocialMemoryPanel` bersifat functional walau D1 belum tersedia:

- cerita disimpan privat di `localStorage`,
- foto/time capsule disimpan lokal di IndexedDB,
- tidak ada upload foto ke server,
- saat Worker exact-match + D1 tersedia, Memory Wall publik otomatis digunakan.

Dengan desain ini frontend tidak pernah menampilkan tombol mati atau berpura-pura bahwa sinkronisasi cloud berhasil.

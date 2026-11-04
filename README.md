# Sistem Absensi Sekolah

Aplikasi manajemen absensi sekolah berbasis Next.js App Router, TypeScript, Prisma ORM 7, dan MySQL. Repository ini sedang dalam tahap pemulihan; fitur QR attendance, CRUD, dan laporan belum boleh dianggap production-ready sampai implementasi dan pengujian modulnya selesai.

## Stack

- Next.js 16 / React 19
- TypeScript
- Tailwind CSS 4
- Prisma ORM 7 dengan MariaDB driver adapter
- MySQL 8 / MariaDB
- JWT session cookie dan bcrypt password hashing

## Persyaratan

- Node.js 20.9 atau lebih baru
- npm
- MySQL 8 atau MariaDB yang dapat diakses aplikasi

## Setup lokal

1. Install dependency:

   ```bash
   npm install
   ```

2. Salin `.env.example` menjadi `.env` dan isi `DATABASE_URL`, `JWT_SECRET`, `ADMIN_EMAIL`, serta `ADMIN_PASSWORD`. Gunakan JWT secret acak minimal 32 karakter dan password admin minimal 12 karakter.

3. Generate Prisma Client dan jalankan migrasi:

   ```bash
   npm run db:generate
   npm run db:migrate
   ```

4. Buat akun administrator pertama:

   ```bash
   npm run db:seed
   ```

   Seed hanya membuat akun bila email tersebut belum ada. Seed tidak mereset password akun yang sudah ada.

5. Jalankan aplikasi:

   ```bash
   npm run dev
   ```

   Buka http://localhost:3000.

## Perintah

- `npm run dev` — development server
- `npm run build` — generate Prisma Client dan production build
- `npm run lint` — ESLint
- `npm run typecheck` — TypeScript check
- `npm run db:generate` — generate Prisma Client
- `npm run db:migrate` — deploy migration yang sudah ada
- `npm run db:seed` — buat administrator awal

## Status modul

| Modul | Status |
|---|---|
| Landing page dan navigasi dashboard | Kerangka awal tersedia |
| Login / logout / session | Implementasi dasar tersedia |
| Provisioning admin awal | Seed tersedia |
| Pendaftaran publik | Dinonaktifkan |
| Manajemen siswa dan kelas | Belum selesai |
| Sesi QR dan pemindaian absensi | Belum selesai |
| Laporan dan ekspor | Belum selesai |

## Catatan keamanan

- Jangan commit file `.env` atau kredensial database.
- Jangan gunakan password contoh di lingkungan produksi.
- Buat akun guru melalui proses provisioning administrator yang terkontrol.
- QR attendance harus memakai token acak bertanda tangan, masa berlaku pendek, validasi sesi di server, dan unique constraint database untuk mencegah duplikasi.
- Jalankan lint, typecheck, production build, serta pengujian integrasi dengan database sebelum deployment.

## Lisensi

MIT

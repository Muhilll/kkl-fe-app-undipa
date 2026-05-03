# Diseminasi App

Frontend aplikasi laporan kegiatan diseminasi informasi pertanian berbasis `SolidJS + Vite`.

Project ini dipakai untuk:
- autentikasi user
- manajemen master data
- manajemen menu dan role permission
- input data dissemination dan dissemination detail
- input absensi
- export laporan dissemination ke `PDF` dan `DOCX`

## Tech Stack

- `SolidJS`
- `Vite`
- `TypeScript`
- `@solidjs/router`
- `html2pdf.js`
- `docx`

## Prasyarat

Sebelum menjalankan project ini, pastikan sudah tersedia:

- `Node.js` 18+ atau versi yang lebih baru
- `npm` atau package manager lain
- backend API yang berjalan dan bisa diakses frontend

## Install

Clone project lalu install dependency:

```bash
npm install
```

Atau jika memakai package manager lain:

```bash
pnpm install
```

```bash
yarn install
```

## Environment

Buat file `.env` di root project.

Contoh:

```env
VITE_APP_TOKEN=my-app-for-supporting-my-dad
VITE_API_URL=http://localhost:4000/api
```

Keterangan:

- `VITE_API_URL`
  URL backend API Laravel/Express/dll yang dipakai frontend
- `VITE_APP_TOKEN`
  app token tambahan untuk endpoint yang membutuhkan header `X-App-Token`

Jika frontend diakses dari device lain dalam satu jaringan, jangan gunakan `localhost`.

Contoh:

```env
VITE_API_URL=http://192.168.1.10:4000/api
```

## Menjalankan Project

Jalankan development server:

```bash
npm run dev
```

Secara default project berjalan di:

```txt
http://localhost:5000
```

Saat root domain `/` diakses, aplikasi akan redirect ke:

```txt
/login
```

## Build Production

Untuk build production:

```bash
npm run build
```

Untuk preview hasil build:

```bash
npm run serve
```

## Struktur Singkat

Struktur module utama saat ini mengikuti pola:

```txt
src/app/<module>/
├── pages/
├── hook/
├── service/
├── type/
└── route.tsx
```

Contoh module:

- `src/app/master-data/user`
- `src/app/master-data/role`
- `src/app/master-data/grade`
- `src/app/master-data/position`
- `src/app/web-management/menu`
- `src/app/web-management/role-permission`
- `src/app/dissemination`
- `src/app/absensi`

## Fitur Utama

### Authentication

- login user dengan email dan password
- penyimpanan token ke local storage
- route root redirect ke `/login`

### Permission Frontend

- navigation disesuaikan dengan menu yang boleh diakses user
- route manual di browser akan diblok jika user tidak punya akses
- tombol seperti `Add`, `Edit`, dan `Delete` hanya muncul jika permission tersedia

Catatan:

- validasi permission di frontend hanya untuk UX
- tetap disarankan menambahkan middleware permission di backend

### Dissemination Report Export

Halaman detail dissemination mendukung export:

- `PDF`
- `DOCX`

Laporan mencakup:

- sampul
- halaman isi berdasarkan dissemination details
- lampiran dokumentasi

## Dependensi Backend yang Diharapkan

Frontend ini mengandalkan backend API untuk:

- login
- master data
- role permission
- dissemination
- dissemination details
- absensi

Beberapa endpoint yang digunakan antara lain:

- `/users/login`
- `/users`
- `/roles`
- `/grades`
- `/positions`
- `/menus`
- `/role-permissions`
- `/disseminations`
- `/dissemination-details`
- `/absensis`

## Catatan Penggunaan

- Upload gambar pada `absensi` dan `dissemination detail` menggunakan `multipart/form-data`
- Export PDF dan DOCX membutuhkan data dissemination dan dissemination details yang valid
- Jika API backend belum aktif, aplikasi tetap bisa terbuka tetapi data tidak akan termuat

## Troubleshooting

### 1. Frontend berhasil jalan tapi login gagal

Periksa:

- nilai `VITE_API_URL`
- backend benar-benar aktif
- endpoint login tersedia di `${VITE_API_URL}/users/login`

### 2. Tidak bisa diakses dari HP / device lain

Gunakan IP LAN, bukan `localhost`.

Contoh:

```env
VITE_API_URL=http://10.42.133.21:4000/api
```

Lalu jalankan dev server dengan host yang sesuai bila diperlukan.

### 3. Upload image tidak masuk

Pastikan backend menerima request `multipart/form-data` untuk:

- `image` pada dissemination detail
- `gambar` pada absensi

## Script

```bash
npm run dev
```

Menjalankan app dalam mode development.

```bash
npm run build
```

Build app untuk production ke folder `dist`.

```bash
npm run serve
```

Preview hasil build production.

## License

MIT

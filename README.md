# BelajarKUY

BelajarKUY adalah aplikasi web marketplace kursus daring (e-learning) bergaya Udemy yang ditujukan untuk pasar Indonesia. Aplikasi ini dikembangkan sebagai proyek Tugas Besar perkuliahan dan menyediakan tiga peran pengguna (Student, Instructor, Admin), alur belanja lengkap (keranjang, checkout, pembayaran Midtrans, hingga pendaftaran kelas otomatis), pemutar kursus dengan pelacakan progres, serta panel administrasi untuk pengelolaan platform.

## Deskripsi Proyek

Tujuan proyek ini adalah membangun platform pembelajaran daring yang fungsional dengan biaya operasional minimal (memanfaatkan layanan dengan tingkat gratis), sekaligus menjadi sarana pembelajaran rekayasa perangkat lunak berbasis kerangka kerja modern.

Lapisan presentasi aplikasi sedang dimigrasikan dari Blade + Alpine.js menjadi **React.js melalui Inertia.js** (lihat `BelajarKUY_docs/02_architecture/ADR/ADR-008-frontend-react-inertia.md`). Selama masa transisi, kedua lapisan berjalan berdampingan: halaman yang telah dimigrasikan dirender melalui Inertia, sedangkan sisanya masih menggunakan Blade. Lapisan backend (model, route, controller, skema basis data, dan middleware peran) dipertahankan tanpa perubahan selama migrasi.

## Daftar Isi

- [Fitur Utama](#fitur-utama)
- [Teknologi yang Digunakan](#teknologi-yang-digunakan)
- [Struktur Repositori](#struktur-repositori)
- [Prasyarat](#prasyarat)
- [Instalasi dan Konfigurasi](#instalasi-dan-konfigurasi)
- [Menjalankan Aplikasi](#menjalankan-aplikasi)
- [Akun Default](#akun-default)
- [Skema Basis Data](#skema-basis-data)
- [Dokumentasi Proyek](#dokumentasi-proyek)
- [Status Pengembangan](#status-pengembangan)
- [Tim Pengembang](#tim-pengembang)
- [Lisensi](#lisensi)

## Fitur Utama

- Autentikasi multi-peran (Student, Instructor, Admin) dengan Laravel Breeze dan login Google (Socialite).
- Katalog kursus, halaman detail kursus, serta pencarian dengan Meilisearch (Laravel Scout).
- Keranjang belanja, daftar keinginan (wishlist), dan sistem kupon diskon.
- Pembayaran melalui Midtrans Snap (mode sandbox) dengan pendaftaran kelas otomatis setelah transaksi berhasil.
- Pemutar kursus (course player) beserta pelacakan penyelesaian materi (lecture completion).
- Panel instruktur untuk pengelolaan kursus, bagian (section), dan materi (lecture).
- Panel administrasi untuk moderasi kursus dan ulasan, pengelolaan kategori, pengguna, pesanan, serta pengaturan situs.
- Notifikasi surel dan pembaruan waktu nyata (real-time) melalui Laravel Reverb.

Catatan: sebagian fitur masih dalam pengembangan. Lihat bagian [Status Pengembangan](#status-pengembangan).

## Teknologi yang Digunakan

| Lapisan | Teknologi | Versi |
|---|---|---|
| Kerangka kerja backend | Laravel | `^13.7` |
| Bahasa | PHP | `^8.3` |
| Lapisan presentasi | React via Inertia.js | `react ^19.2.6`, `@inertiajs/react ^3.3.0`, `inertiajs/inertia-laravel ^3.1` |
| Styling | Tailwind CSS | `tailwindcss ^3.1.0` (paket inti) dan `@tailwindcss/vite ^4.0.0` (plugin Vite) |
| Build tool | Vite | `^8.0.0` (`@vitejs/plugin-react ^6.0.2`) |
| Basis data | MySQL (produksi) / SQLite (pengembangan) | 8.x / 3.x |
| Pembayaran | Midtrans Snap (sandbox) | `midtrans/midtrans-php ^2.6` |
| Penyimpanan media | Cloudinary | `cloudinary/cloudinary_php ^3.1` |
| Mesin pencari | Meilisearch + Laravel Scout | `^1.16` / `^11.1` |
| Real-time (WebSocket) | Laravel Reverb | `^1.10` |
| Autentikasi | Laravel Breeze + Socialite | `^2.4` / `^5.27` |

Nilai versi di atas dikutip dari `BelajarKUY/composer.json` dan `BelajarKUY/package.json`. Catatan: proyek ini tidak menggunakan Filament; panel administrasi dibangun sebagai halaman React + Inertia.

## Struktur Repositori

```text
.
├── BelajarKUY/                 Aplikasi Laravel (kode sumber utama)
│   ├── app/                    Model, Controller, Middleware, Service
│   ├── routes/                 Definisi route (web.php, auth.php)
│   ├── resources/js/           Lapisan presentasi React + Inertia (Pages, Components, Layouts)
│   ├── resources/views/        Root view Inertia (app.blade.php) dan view Blade lama
│   └── database/               Migrations, factories, seeders
├── BelajarKUY_docs/            Dokumentasi proyek (panduan, arsitektur, ADR, fitur, prompt, laporan)
├── BelajarKuy_Design_Revisi/   Aset desain hasil ekspor Google Stitch
└── README.md
```

## Prasyarat

Pastikan perangkat lunak berikut telah terpasang:

- PHP `8.3` atau lebih baru beserta ekstensi yang dibutuhkan Laravel
- Composer `2.x`
- Node.js `20` atau lebih baru dan NPM `10` atau lebih baru
- MySQL `8.x` (opsional; SQLite dapat digunakan untuk pengembangan)
- Meilisearch `1.x` (untuk fitur pencarian)
- Git

## Instalasi dan Konfigurasi

Seluruh perintah berikut dijalankan dari direktori aplikasi Laravel, yaitu `BelajarKUY/`.

1. Klona repositori dan masuk ke direktori aplikasi.

   ```bash
   git clone https://github.com/yopalll/bjrkuy.git
   cd bjrkuy/BelajarKUY
   ```

2. Pasang dependensi backend dan frontend.

   ```bash
   composer install
   npm install
   ```

3. Siapkan berkas environment dan kunci aplikasi.

   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

4. Konfigurasikan `.env` (basis data, Midtrans sandbox, Google OAuth, Cloudinary, Meilisearch, Reverb). Rincian variabel tersedia pada `BelajarKUY_docs/01_guides/SETUP_GUIDE.md`.

5. Jalankan migrasi dan seeder.

   ```bash
   php artisan migrate --seed
   ```

6. Tautkan storage dan bangun aset frontend.

   ```bash
   php artisan storage:link
   npm run build
   ```

## Menjalankan Aplikasi

Untuk pengembangan, jalankan proses berikut (disarankan pada terminal terpisah):

```bash
# Terminal 1: server pengembangan Vite (hot reload React/Inertia)
npm run dev

# Terminal 2: server aplikasi Laravel
php artisan serve

# Terminal 3: mesin pencari Meilisearch
meilisearch --master-key="masterKey"

# Terminal 4: server WebSocket Laravel Reverb
php artisan reverb:start
```

Aplikasi dapat diakses pada `http://localhost:8000`. Untuk mengindeks data kursus ke Meilisearch setelah seeding:

```bash
php artisan scout:import "App\Models\Course"
```

## Akun Default

Setelah seeder dijalankan, kata sandi seluruh akun adalah `password`.

| Peran | Surel |
|---|---|
| Admin | `admin@belajarkuy.test` |
| Instructor | `ray@belajarkuy.test` |
| Student | `student@belajarkuy.test` |

## Skema Basis Data

BelajarKUY menggunakan **15 tabel utama** dengan relasi sebagai berikut.

### Daftar Tabel

| Tabel | Deskripsi |
|---|---|
| `users` | Pengguna platform — role: `user`, `instructor`, `admin` |
| `categories` | Kategori kursus (contoh: Pemrograman, Desain) |
| `sub_categories` | Sub-kategori, turunan dari `categories` |
| `courses` | Kursus yang dibuat instruktur |
| `course_goals` | Tujuan pembelajaran per kursus |
| `course_sections` | Bagian (section/bab) dalam sebuah kursus |
| `course_lectures` | Materi (lecture/video) dalam sebuah section |
| `wishlists` | Daftar keinginan siswa |
| `carts` | Keranjang belanja siswa |
| `coupons` | Kupon diskon yang dibuat instruktur |
| `payments` | Data transaksi Midtrans |
| `orders` | Pesanan yang terhubung ke payment |
| `enrollments` | Pendaftaran siswa ke kursus setelah bayar |
| `lecture_completions` | Pelacakan materi yang sudah diselesaikan siswa |
| `reviews` | Ulasan dan rating kursus dari siswa |

### Relasi Antar Tabel

```
users ──< courses              (instructor_id)   — instruktur memiliki banyak kursus
users ──< wishlists            (user_id)         — siswa punya banyak wishlist
users ──< carts                (user_id)         — siswa punya banyak item cart
users ──< coupons              (instructor_id)   — instruktur membuat kupon
users ──< payments             (user_id)
users ──< orders               (user_id, instructor_id)
users ──< enrollments          (user_id)
users ──< lecture_completions  (user_id)
users ──< reviews              (user_id)

categories ──< sub_categories  (category_id)
categories ──< courses         (category_id)
sub_categories ──< courses     (subcategory_id)

courses ──< course_goals       (course_id)
courses ──< course_sections    (course_id)
courses ──< wishlists          (course_id)
courses ──< carts              (course_id)
courses ──< coupons            (course_id, nullable)
courses ──< orders             (course_id)
courses ──< enrollments        (course_id)
courses ──< reviews            (course_id)

course_sections ──< course_lectures     (section_id)
course_lectures ──< lecture_completions (lecture_id)

payments ──< orders    (payment_id)
orders   ──< enrollments (order_id)
coupons  ──< orders    (coupon_id, nullable)
```

**Unique constraints:** `wishlists(user_id, course_id)` · `carts(user_id, course_id)` · `enrollments(user_id, course_id)` · `lecture_completions(user_id, lecture_id)` · `reviews(user_id, course_id)`

---

## Dokumentasi Proyek

Dokumentasi lengkap berada pada direktori `BelajarKUY_docs/`. Berkas yang disarankan untuk dibaca terlebih dahulu:

- `BelajarKUY_docs/00_INDEX.md` — indeks utama dokumentasi.
- `BelajarKUY_docs/01_guides/SETUP_GUIDE.md` — panduan pemasangan terperinci.
- `BelajarKUY_docs/02_architecture/TECH_STACK.md` — rincian tumpukan teknologi.
- `BelajarKUY_docs/02_architecture/ADR/` — catatan keputusan arsitektur (Architecture Decision Records).
- `BelajarKUY_docs/04_plans/MASTER_PLAN_REACT_INERTIA.md` — rencana migrasi frontend ke React + Inertia.
- `BelajarKUY_docs/04_plans/MIGRATION_SCHEDULE_REACT_INERTIA.md` — jadwal pengerjaan dan pembagian tugas.

## Status Pengembangan

Proyek berada pada tahap pengembangan aktif. Ringkasan terkini tersedia pada `BelajarKUY_docs/06_reports/PROGRESS_TRACKER.md`. Secara umum:

- Selesai: penyiapan proyek, basis data, sistem autentikasi, panel administrasi (Blade), serta halaman publik dan panel student (Blade).
- Dalam pengerjaan: migrasi lapisan presentasi ke React + Inertia (Fase 1 telah dirintis).
- Belum selesai: keranjang dan wishlist, integrasi pembayaran menyeluruh, sistem kupon, panel instruktur, pemutar kursus, dan notifikasi.

## Tim Pengembang

| No | Nama | NIM | Peran |
|---|---|---|---|
| 1 | Yosua Valentino Gulo | 251402055 | Project Manager & Arsitektur |
| 2 | Albariqi Deanda Tarigan | 251402037 | Backend Developer (Autentikasi & Kurikulum) |
| 3 | Ray Nathan Geereno Saragih | 251402046 | Backend Developer (Commerce & Pembayaran) |
| 4 | Vascha Uli Lumbantoruan | 251402125 | Frontend Developer (Halaman Publik & Student) |
| 5 | Quinsha Ilmi Azzahra | 251402137 | UI/UX Developer (Panel Administrasi) |

Aset desain (Google Stitch) dikerjakan oleh Vascha Uli Lumbantoruan dan Quinsha Ilmi Azzahra.

## Lisensi

Proyek ini dikembangkan untuk keperluan akademik (Tugas Besar perkuliahan). Kerangka kerja Laravel yang menjadi basis aplikasi dirilis di bawah lisensi MIT.

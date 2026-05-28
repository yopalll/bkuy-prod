# 📄 PRD — BelajarKUY (Product Requirements Document)

> **Produk:** BelajarKUY — Platform E-Learning Indonesia (Udemy-style marketplace kursus)
> **Versi PRD:** 1.1
> **Disusun:** 28 Mei 2026 | **Terakhir diupdate:** 28 Mei 2026
> **Sumber kebenaran:** Disarikan dari `BelajarKUY_docs/` (00_INDEX, 01_guides, 02_architecture, 03_features, 04_plans) + implementasi aktual di `app/` & `resources/views/`.
> **Status proyek:** Tugas Besar Kuliah — 5 anggota tim. Phase 1 (Foundation) selesai, Phase 2+ berjalan.

---

## 1. Ringkasan Eksekutif

**BelajarKUY** adalah marketplace kursus online (LMS) bergaya Udemy untuk pasar Indonesia. Platform menghubungkan **Instruktur** (pembuat & penjual kursus) dengan **Siswa** (pembeli & pembelajar), dengan **Admin** sebagai pengelola platform. Seluruh antarmuka berbahasa Indonesia, pembayaran memakai **Midtrans Snap (Sandbox)**, dan media disimpan di **Cloudinary**.

### Masalah yang Dipecahkan
- Calon pembelajar butuh satu tempat untuk menemukan, membeli, dan mempelajari kursus tech/bisnis/desain berbahasa Indonesia.
- Instruktur butuh kanal untuk membuat kursus berstruktur (section → lecture), menetapkan harga & diskon, serta memantau penjualan.
- Admin butuh kontrol untuk mengelola katalog, kategori, transaksi, dan konten landing page.

### Solusi
Aplikasi web SSR (Laravel 12 + Blade + TailwindCSS v4 + Alpine.js) dengan tiga panel berbasis peran, alur belanja lengkap (cart → checkout → Midtrans → enrollment otomatis), course player dengan pelacakan progres, serta panel admin untuk manajemen platform.

### Nilai Inti
- **Cepat & ringan** (stack TALL, tanpa SPA berat).
- **Indonesia-first** (locale `id`, Rupiah, copy Bahasa Indonesia).
- **Bebas biaya untuk dibangun** (semua layanan eksternal punya free tier / sandbox).

---

## 2. Tujuan & Metrik Keberhasilan

| Tujuan | Metrik / Definition of Done |
|--------|------------------------------|
| Siswa dapat menemukan & membeli kursus | Alur landing → detail → cart → checkout → bayar berhasil end-to-end di sandbox |
| Akses kursus otomatis setelah bayar | Setelah callback Midtrans `settlement`, row `enrollments` terbuat tanpa intervensi manual |
| Siswa dapat belajar & melacak progres | Course Player menampilkan video + kurikulum + persentase progres yang update saat "Tandai Selesai" |
| Instruktur dapat mengelola kursus | CRUD course + section + lecture + goal + coupon berfungsi |
| Admin dapat mengelola platform | CRUD kategori, slider, info box, partner, site settings + moderasi course & review |
| Kualitas | Mengikuti `TESTING_STRATEGY.md`, `SECURITY_GUIDELINES.md`, `CODING_STANDARDS.md` |

> Catatan akademik: tidak ada target bisnis kuantitatif (GMV, MAU). Keberhasilan diukur dari kelengkapan & kebenaran fungsional fitur MVP.

---

## 3. Persona & Peran

Sistem memakai **satu tabel `users`** dengan kolom `role` enum: `user | instructor | admin`. (Lihat ADR-007 — dualitas penamaan "user/student".)

| Peran | Enum DB | Istilah UI | Kemampuan utama |
|-------|---------|------------|-----------------|
| **Siswa** | `user` | "Siswa" / "Student" | Jelajah katalog, cart, wishlist, checkout, belajar (course player), review, kelola profil |
| **Instruktur** | `instructor` | "Instruktur" | Buat & kelola kursus/section/lecture/goal/coupon, lihat penjualan & statistik. **Auto-aktif tanpa approval** (ADR-006) |
| **Admin** | `admin` | "Admin" | Kelola kategori, slider, info box, partner, site settings; moderasi course & review; lihat user, instruktur, order |

**Aturan penting peran (dari GLOSSARY & ADR):**
- Instruktur langsung aktif saat register; yang di-approve admin adalah **course**-nya, bukan instrukturnya.
- "Block user" **tidak** masuk MVP.
- Cek hak menonton lecture **selalu** via tabel `enrollments`, bukan `orders`/`payments`.

---

## 4. Lingkup Produk

### 4.1 In Scope (MVP)
- F01 Auth: register/login (email + Google OAuth), multi-role, verifikasi email, reset password, halaman login admin terpisah.
- F02 Landing page: hero slider, info boxes, kategori populer, kursus unggulan & terlaris, partner.
- F03 Course management (instruktur): CRUD course, section, lecture, goal.
- F04 Category system: kategori & sub-kategori (admin).
- F05 Cart & Wishlist.
- F06 Payment: Midtrans Snap + auto-enrollment + pembuatan order.
- F07 Admin panel: dashboard, CRUD konten, moderasi.
- F08 Instructor panel: dashboard, manajemen kursus, coupon, riwayat penjualan.
- F09 Student panel: dashboard, my courses, wishlist, profil, settings.
- F10 Review & rating (1–5 + komentar).
- F11 Coupon system (global / per-course, batas pemakaian).
- F12 Site settings (DB-backed).
- F13 Course player (watch page) + progress tracking.
- F14 Notifications: email (Resend/Mailtrap) + real-time (Reverb) + flash/toast.

### 4.2 Out of Scope (didokumentasikan di ADR)
| Hal | Alasan |
|-----|--------|
| **Midtrans production** — sandbox saja, `is_production` hardcoded | ADR-004 |
| **Payout / revenue split ke instruktur** — simulasi murni, tidak ada uang real | ADR-005 |
| **Approval/registrasi instruktur** — instruktur auto-aktif | ADR-006 |
| **Block/unblock user** | GLOSSARY (Admin Actions) |
| **API key Midtrans di database** — wajib di `.env` | DB Schema v2 (tabel `midtrans_configs` dihapus) |
| **Upload media ke `public/uploads/`** — wajib Cloudinary | Aturan 00_INDEX #5 |
| Video resume per-detik, notes/bookmark, Q&A per lecture, download materi, auto-play | F13 "Future Enhancements" |

---

## 5. Tech Stack (ringkas)

| Lapisan | Teknologi |
|---------|-----------|
| Framework | Laravel 12.x (PHP 8.3+) |
| Database | MySQL 8.x (default dev: SQLite) |
| Frontend | Blade + TailwindCSS v4 + Alpine.js v3 (TALL, tanpa Livewire — ADR-002) |
| **Admin Panel** | **Filament v5.x** (Livewire-based admin panel builder) |
| Build | Vite |
| Pembayaran | Midtrans Snap v2 (sandbox — ADR-001, ADR-004) |
| Media | Cloudinary (CDN, auto-compress) |
| Video | YouTube unlisted (embed via `course_lectures.url`) |
| Search | Meilisearch + Laravel Scout |
| Real-time | Laravel Reverb (WebSocket) + Laravel Echo |
| Email | Resend (prod) / Mailtrap (dev) |
| Auth | Laravel Breeze + Socialite (Google) |
| UI utils | SweetAlert2 (toast/konfirmasi), Lucide & Heroicons (ikon) |

> Detail versi & env vars: `02_architecture/TECH_STACK.md`.
>
> **Catatan:** Filament menggunakan Livewire secara internal untuk admin panel, tapi halaman publik tetap menggunakan Blade + Alpine.js (ADR-002).

---

## 6. Arsitektur Informasi & Peta Halaman

URL utama berasal dari `routes/web.php`, F08, dan F13. **Dualitas peran:** prefix route siswa memakai `/user/*` (legacy, match DB) atau `/student/*`; folder/controller memakai "Student".

### 6.1 Publik (tanpa login)
| Halaman | Route (name) | Sumber data |
|---------|--------------|-------------|
| Landing / Beranda | `home` (`/home`) | sliders, infoBoxes, categories, featured & bestseller courses, partners |
| Katalog / Hasil pencarian & filter | `home` + query `?search=`/`?category=` | courses terfilter |
| Detail Course | `course.detail` (`/courses/{slug}`) | course + goals, sections.lectures, instructor, reviews, related |

### 6.2 Autentikasi
| Halaman | Route |
|---------|-------|
| Login | `login` |
| Register | `register` |
| Lupa password | `password.request` |
| Reset password | `password.reset` |
| Verifikasi email | `verification.notice` |
| Konfirmasi password | `password.confirm` |
| Login Admin (terpisah) | `admin.login.page` (`/admin/login`) |
| Google OAuth | `auth.google`, `auth.google.callback` |

### 6.3 Commerce (login)
| Halaman | Route |
|---------|-------|
| Cart | `cart.index`, `cart.add` |
| Wishlist toggle | `wishlist.add`, `student.wishlist.remove` |
| Checkout | `checkout`, `checkout.process` |
| Pembayaran berhasil | `payment.success` |
| Pembayaran gagal | `payment.failed` |

### 6.4 Panel Siswa (`role:user`, prefix `/student`)
| Halaman | Route |
|---------|-------|
| Dashboard | `student.dashboard` (universal `/dashboard` redirect per role) |
| Kursus Saya | `student.my-courses` |
| Wishlist | `student.wishlist` |
| Profil | `student.profile` |
| Setting (ganti password) | `student.setting` |
| **Course Player (watch)** | `user.course.watch.entry`, `user.course.watch`, `user.lecture.complete` (F13) |

### 6.5 Panel Instruktur (`role:instructor`, prefix `/instructor`)
| Halaman | Route |
|---------|-------|
| Dashboard (stats) | `instructor.dashboard` |
| My Courses | `/instructor/course` |
| Create / Edit Course | `/instructor/course/create`, `/instructor/course/{id}/edit` |
| Sections | `/instructor/section` |
| Lectures | `/instructor/lecture` |
| Coupons | `/instructor/coupon` |
| My Orders (sales) | `/instructor/orders` |
| Profile / Settings | `/instructor/profile`, `/instructor/setting` |

### 6.6 Panel Admin — Filament (`role:admin`, prefix `/admin`)

> **Implementasi:** Panel admin dibangun menggunakan **Filament v5** sebagai admin panel builder. Filament menyediakan UI modern dengan fitur CRUD otomatis, form builder, table builder, dan dashboard widgets. Akses dikontrol via `FilamentUser` interface pada model `User` (`canAccessPanel()` mengecek `role === 'admin'`).

| Halaman | Route | Implementasi |
|---------|-------|--------------|
| Dashboard | `/admin` | Filament Dashboard (auto-generated) |
| Login Admin | `/admin/login` | Filament Login Page (built-in) |
| User Management (CRUD) | `/admin/users/*` | `UserResource` (Filament Resource) |
| Product Management (CRUD) | `/admin/products/*` | `ProductResource` (Filament Resource) |
| Categories (CRUD) | `admin.categories.*` | Custom Blade / Filament Resource (TBD) |
| Sub Categories (CRUD) | `admin.sub-categories.*` | Custom Blade / Filament Resource (TBD) |
| Sliders (CRUD) | `admin.sliders.*` | Custom Blade / Filament Resource (TBD) |
| Info Boxes (CRUD) | `admin.info-boxes.*` | Custom Blade / Filament Resource (TBD) |
| Partners (CRUD) | `admin.partners.*` | Custom Blade / Filament Resource (TBD) |
| Course Management (lihat + ubah status) | `admin.courses.index/show`, `admin.courses.update-status` | Custom Blade / Filament Resource (TBD) |
| Instructors (lihat) | `admin.instructors.index/show` | Custom Blade / Filament Resource (TBD) |
| Order Management (lihat) | `admin.orders.index/show` | Custom Blade / Filament Resource (TBD) |
| Reviews (moderasi) | `admin.reviews.index`, `admin.reviews.update-status` | Custom Blade / Filament Resource (TBD) |
| Site Settings | `admin.settings.index/update` | Custom Blade / Filament Resource (TBD) |

---

## 7. Functional Requirements per Fitur

Format: user story + kriteria penerimaan ringkas. Spesifikasi penuh ada di `03_features/FNN_*.md`.

### F01 — Auth System
- Sebagai pengunjung, saya bisa **register** (nama, email, password) dan **login** via email atau **Google**.
- Mendukung **multi-role**; akses panel dibatasi `RoleMiddleware` (`role:admin|instructor|user`).
- Verifikasi email (`verified` middleware) sebelum akses dashboard.
- Reset password via email; halaman **login admin terpisah** (`/admin/login`).
- **Acceptance:** Google login membuat/menemukan user; user tanpa verifikasi tidak bisa masuk area `verified`; admin diarahkan ke `admin.dashboard`.

### F02 — Landing Page
- Hero slider (auto-rotate), info boxes, grid kategori populer, grid kursus unggulan (`featured`), kursus terlaris (`bestseller`), logo partner.
- Search bar (Meilisearch live search) + filter via `?search`/`?category`.
- **Acceptance:** semua section hanya tampil bila ada data; gambar dari URL Cloudinary; empty state pencarian tersedia.

### F03 — Course Management (Instruktur)
- CRUD course (judul, slug, deskripsi, harga, diskon %, thumbnail, video preview, durasi, kategori/subkategori, flag bestseller/featured, status `draft|pending_review|active|inactive`).
- CRUD **section** (judul, sort_order) dan **lecture** (judul, url, content, durasi, sort_order) serta **goal**.
- **Acceptance:** kursus baru default `draft`; submit untuk review → `pending_review`; thumbnail & video via Cloudinary/YouTube.

### F04 — Category System (Admin)
- CRUD kategori (nama, slug, image, status) & sub-kategori (parent category, nama, slug).
- **Acceptance:** slug unik; menonaktifkan kategori menyembunyikannya dari frontend.

### F05 — Cart & Wishlist
- Tambah/hapus course ke cart & wishlist (UNIQUE `(user_id, course_id)` — tak ada duplikat).
- Cart **tidak menyimpan harga/instruktur** — dihitung real-time dari `courses`.
- **Acceptance:** badge count di navbar update; harga & diskon dihitung saat render.

### F06 — Payment (Midtrans)
- Checkout → buat `payment` (status `pending`) → Midtrans Snap → callback webhook.
- Saat `settlement/capture`: buat `order(s)` (`completed`) + `enrollment(s)` (atomik) + kosongkan cart.
- Dukungan **coupon** (potongan) tersimpan sebagai snapshot di order (`original_price`, `discount_amount`, `final_price`).
- **Acceptance:** akses kursus = ada row `enrollments`; halaman success/failed sesuai hasil; sandbox only.

### F07 — Admin Panel (Filament v5)
- **Dibangun menggunakan Filament v5** sebagai panel builder — menyediakan UI admin modern, form builder, table builder, dan dashboard widgets out-of-the-box.
- Akses panel dikontrol via `FilamentUser` interface: hanya `role='admin'` yang bisa masuk (`canAccessPanel()`).
- **Filament Resources** sudah dibuat: `UserResource` (CRUD user) dan `ProductResource` (CRUD product) dengan halaman List, Create, Edit, dan View.
- Dashboard statistik platform; CRUD konten (kategori, slider, info box, partner, settings) — akan di-migrate ke Filament Resources.
- Moderasi: **approve/reject course** (`pending_review`→`active`/`inactive`), **approve/reject review** (`status` boolean).
- View-only: user, instruktur, order.
- **Acceptance:** aksi status mengubah DB & memberi flash message; tidak ada fitur block user / payout; panel admin accessible di `/admin`.

### F08 — Instructor Panel
- Dashboard: total courses, total students, revenue (gross). Manajemen course/section/lecture/coupon; riwayat penjualan (`/instructor/orders`).
- **Acceptance:** instruktur hanya melihat data miliknya; revenue = `payments` settlement/capture (tanpa payout).

### F09 — Student Panel
- Dashboard ringkas; **Kursus Saya** (enrolled); **Wishlist**; **Profil**; **Setting** (ganti password).
- Dari My Courses → tombol "Lanjut Belajar" menuju Course Player.
- **Acceptance:** hanya kursus yang ber-`enrollment` muncul di My Courses.

### F10 — Review & Rating
- Siswa **enrolled** dapat memberi rating 1–5 + komentar (UNIQUE `(user_id, course_id)`).
- Review tampil di detail course bila `status = true`; admin bisa reject.
- **Acceptance:** rata-rata rating tampil di card & detail; satu siswa satu review per kursus.

### F11 — Coupon System
- Coupon milik instruktur; global atau per-course; `discount_percent`, `valid_until`, `max_usage`/`used_count`, `status`.
- Diterapkan di checkout; menambah `used_count`.
- **Acceptance:** coupon kedaluwarsa/melebihi `max_usage`/nonaktif ditolak.

### F12 — Site Settings
- Pasangan key–value di `site_infos` (site_name, about_us, address, email, phone, copyright, social links, dll) dipakai navbar/footer.
- **Acceptance:** perubahan settings langsung tercermin di frontend.

### F13 — Course Player (Watch Page)
- Layout 2 kolom: **kiri** video (YouTube embed) + info lecture + tombol "Tandai Selesai" + tab (Deskripsi/Catatan/Tanya); **kanan** progress bar + kurikulum accordion (status ✅/▶/⭕).
- Entry route auto-redirect ke lecture pertama yang belum selesai; mark complete idempotent (AJAX) + recalculate progress + next lecture.
- Akses: `auth` + `verified` + role siswa + **harus enrolled** (else 403).
- **Acceptance:** progress = completions/total ×100; semua lecture selesai → banner selamat.

### F14 — Notifications
- Email transaksional (welcome, pembayaran) via Resend/Mailtrap; event real-time via Reverb; flash message + SweetAlert2 toast.
- **Acceptance:** toast sukses/error muncul setelah aksi; email terkirim di lingkungan dev (Mailtrap).

---

## 8. Model Data (ringkas, Schema v2 — 19 tabel)

> Canonical & final: `02_architecture/DATABASE_SCHEMA.md`. Jangan ubah tanpa persetujuan PM.

**Identitas & katalog:** `users` (role enum), `categories`, `sub_categories`, `courses` (price, discount, status, bestseller, featured), `course_goals`, `course_sections`, `course_lectures`.

**Commerce:** `wishlists`, `carts` (tanpa price/instructor), `coupons` (code, discount_percent, valid_until, max_usage/used_count), `payments` (midtrans_order_id, status 8-enum, json response), `orders` (snapshot harga + `instructor_id` denormalized + `coupon_id`), `enrollments` (akses cepat), `lecture_completions` (progress).

**Konten & ulasan:** `reviews` (rating 1–5, status), `sliders`, `info_boxes`, `partners`, `site_infos` (key–value).

**Relasi inti:**
```
Course ── CourseGoal (1:N)
Course ── CourseSection (1:N) ── CourseLecture (1:N) ── LectureCompletion (per user)
User(instructor) ── Course (1:N)
Payment (1) ── Order (1:N) ── Enrollment (1:1 via order)
Category ── SubCategory ── Course
```

**Invariant penting:**
- UNIQUE `(user_id, course_id)` pada `carts`, `wishlists`, `enrollments`, `reviews`.
- UNIQUE `(user_id, lecture_id)` pada `lecture_completions`.
- Order menyimpan **snapshot harga** (harga course bisa berubah).

---

## 9. Alur Utama

### 9.1 Beli → Akses → Belajar (state: Paid → Purchased → Enrolled)
```
Siswa klik Bayar
  → Payment (pending)
  → Midtrans Snap memproses
  → Webhook callback → payments.status = settlement/capture   [Paid]
  → handleSuccess(): Order (completed)                          [Purchased]
  → (transaksi atomik) Enrollment dibuat                        [Enrolled]
  → Cart dikosongkan
  → Siswa buka Course Player (akses dicek via Enrollment)
```

### 9.2 Auth
```
Register/Login (email atau Google) → verifikasi email → /dashboard
  → match(role): admin→admin.dashboard | instructor→instructor.dashboard | default→student.dashboard
```

### 9.3 Moderasi Course
```
Instruktur submit course → status pending_review
  → Admin approve → active (tampil publik)  |  reject → inactive
```

---

## 10. Kebutuhan Non-Fungsional

| Aspek | Ketentuan |
|-------|-----------|
| **Keamanan** | API key di `.env` (bukan DB); CSRF di semua form; validasi via FormRequest; otorisasi via RoleMiddleware + cek Enrollment; ikuti `SECURITY_GUIDELINES.md` |
| **Performa** | Composite index sesuai schema; eager loading (`with`) untuk hindari N+1; query landing pakai index `(status, featured)`/`(status, bestseller)` |
| **Pengujian** | Testing pyramid (`TESTING_STRATEGY.md`); fokus alur kritis: auth, payment callback, enrollment, progress |
| **Aksesibilitas & i18n** | Locale `id`; copy Bahasa Indonesia; label `aria-*` pada tombol ikon |
| **Responsif** | Mobile-first; navbar punya hamburger; grid breakpoint sm/md/lg |
| **Media** | Semua media via Cloudinary URL; video via YouTube embed; jangan hardcode/local upload |
| **Kode** | PSR-12 via Pint; Conventional Commits; feature branch + PR (no direct push ke `main`) |

---

## 11. Terminologi Kunci (lihat GLOSSARY)

- **User** = baris di `users`; **Student/Siswa** = `role='user'` (istilah bisnis/UI).
- **Paid** (`payments.status` settlement/capture) ≠ **Purchased** (`orders.status='completed'`) ≠ **Enrolled** (ada row `enrollments`). Cek akses selalu via **Enrolled**.
- **Course → Section → Lecture → Completion**; **Progress** dihitung on-the-fly.
- Jangan pakai istilah deprecated: "Member", `coupons.name`, `orders.price`, `courses.order` (pakai `code`, snapshot harga, `sort_order`).

---

## 12. Status & Roadmap

| Phase | Cakupan | Status (per docs) |
|-------|---------|-------------------|
| P0 Setup | Laravel 12 + Tailwind + Vite | ✅ Done |
| P1 Database | 19 migrations + 19 models | ✅ Done |
| P1b Seeders/Factories | ~896 records | ✅ Done |
| P2 Auth + Frontend base | Breeze + Role + Google + landing/detail | 🔄 Berjalan (UI sudah ada di repo) |
| P3 Commerce | Cart, wishlist, Midtrans, coupon | 🔜 Sebagian placeholder route |
| P4 Panels & Player | Student/Instructor/Admin + Course Player | 🔄 Berjalan — **Admin panel: Filament v5 terinstall** (User & Product Resources sudah di-generate). Student & Instructor panel sebagian. |
| P5 Polish | Review, settings, testing, deploy | 🔴 Pending |

> Tracking aktual: `06_reports/PROGRESS_TRACKER.md`.

---

## 13. Risiko & Asumsi
- **Sandbox-only Midtrans**: tidak ada transaksi uang nyata; cocok untuk demo akademik.
- **Tanpa payout**: instruktur tidak menerima uang — murni simulasi reporting.
- **Ketergantungan free tier** (Cloudinary 25 kredit/bln, Resend 3k email/bln, Meilisearch) — cukup untuk skala tugas.
- **Konsistensi penamaan peran** (`user` vs `student`) harus dijaga sesuai GLOSSARY agar tidak ambigu.

---

*PRD ini merangkum dokumentasi BelajarKUY untuk keperluan perencanaan & redesign. Untuk detail teknis, selalu rujuk file sumber di `BelajarKUY_docs/`.*

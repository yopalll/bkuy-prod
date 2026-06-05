# 📜 BelajarKUY Docs — Changelog

> Log perubahan struktur & konten dokumentasi BelajarKUY.
> Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), versioning by date.

---

## [2026-06-05] — L11 Albariqi · Email Notifikasi (F14)

Implementasi sistem email notifikasi untuk kursus — 3 Mailable baru beserta template HTML yang dikirim via queue database.

### ➕ Added

- **`app/Mail/CourseApprovedMail.php`** — Mailable+ShouldQueue; email ke instruktur saat admin menyetujui kursus (status → active); membawa relasi `Course` + `instructor`.
- **`app/Mail/CourseRejectedMail.php`** — Mailable+ShouldQueue; email ke instruktur saat admin menolak kursus dari `pending_review`; membawa alasan opsional (`?string $reason`).
- **`app/Mail/NewSaleMail.php`** — Mailable+ShouldQueue; email ke instruktur per-order saat checkout berhasil (settlement/capture via Midtrans callback); membawa relasi `Order` + `course`, `user`, `instructor`.
- **`resources/views/emails/course-approved.blade.php`** — Template email branded purple (Konteks_A gradient #300033→#A855F7); inline CSS; detail kursus, harga, tombol CTA.
- **`resources/views/emails/course-rejected.blade.php`** — Template email merah; kotak catatan reviewer (alasan opsional / fallback teks); 3 langkah perbaikan; CTA ke panel instruktur.
- **`resources/views/emails/new-sale.blade.php`** — Template email hijau; detail pembeli (nama+email), kursus terjual, pendapatan instruktur (setelah diskon), tanggal transaksi; CTA ke dashboard.

### 🔧 Changed

- **`app/Http/Controllers/Admin/AdminCourseController.php`** — `updateStatus()` diperluas:
  - Validasi tambah field `reason` (nullable, max 1000 char).
  - Hook email: status → `active` (dari non-active) → queue `CourseApprovedMail`; status → `inactive` (dari `pending_review`) → queue `CourseRejectedMail($course, $reason)`.
  - Guard: hanya kirim email jika instruktur punya email.
- **`app/Http/Controllers/Frontend/CheckoutController.php`** — `handleSuccess()` diperluas:
  - Setelah setiap `Enrollment::firstOrCreate()`, load relasi order dan queue `NewSaleMail` ke instruktur pemilik kursus.
  - Guard: hanya kirim jika instruktur punya email.
- **`04_plans/URUTAN_KERJA_TIM_REACT_INERTIA.md`** — L11 ditandai ✅ SELESAI dengan hasil implementasi lengkap.

### ✅ Verified

- `npm run build` PASS ✅ — 2399 modules, 0 error.
- Queue driver: `database` (tabel `jobs` sudah ada dari migration awal). Worker: `php artisan queue:work`.
- Email ditulis ke `storage/logs/laravel.log` (MAIL_MAILER=log di dev) — tidak perlu SMTP.

---

## [2026-06-05] — L10 Albariqi · Course Player (F13)

Implementasi Course Player — halaman inti LMS di mana student ter-enroll menonton materi (video YouTube embed), menandai lecture selesai, dan melacak progress belajar. Termasuk wiring route dan penyesuaian link student panel.

### ➕ Added

- **`Frontend/CoursePlayerController.php`** — controller lengkap: `index()` auto-redirect ke first uncompleted lecture; `show()` render `Inertia::render('Courses/Player')` dengan data kurikulum, completed IDs, progress %, navigasi prev/next; `markComplete()` idempotent `firstOrCreate` LectureCompletion + recalculate progress (JSON). Guard: `abort_unless(isEnrolled)`.
- **`Pages/Courses/Player.jsx`** — halaman React fullscreen 2-kolom: video YouTube embed (kiri) + sidebar kurikulum accordion (kanan); tombol "Tandai Selesai" → AJAX POST → update local state tanpa reload; progress bar gradient (#300033→#ffb145); navigasi prev/next; mobile sidebar overlay; navbar branded dengan progress counter.
- **Route Group L10** di `routes/web.php`:
  - `GET /student/learn/{slug}` → `CoursePlayerController@index` (auto-redirect; name `student.learn`)
  - `GET /student/learn/{slug}/{lecture}` → `CoursePlayerController@show` (player; name `student.learn.show`)
  - `POST /student/lecture/{lecture}/complete` → `CoursePlayerController@markComplete` (JSON; name `student.lecture.complete`)

### 🔧 Changed

- **`Pages/Student/MyCourses.jsx`** — tombol "Lanjutkan/Mulai Belajar" mengarah ke `/student/learn/{slug}` (Course Player) alih-alih `/courses/{slug}` (detail kursus).
- **`Pages/Student/Dashboard.jsx`** — tombol "Lanjut" di section "Lanjutkan Belajar" mengarah ke Course Player.
- **`04_plans/URUTAN_KERJA_TIM_REACT_INERTIA.md`** — L10 ditandai ✅ SELESAI dengan hasil implementasi.

### ✅ Verified

- `npm run build` PASS ✅ — 2399 modules, 0 error (`Player-3KhjOmi9.js` terbuild).

---

## [2026-06-04] — L7 Albariqi · Section & Lecture CRUD (Kurikulum Instruktur)

Implementasi pengelolaan kurikulum kursus instruktur: accordion section + lecture CRUD, inline editing, dan alur submit-for-review dari halaman Kurikulum.

### ➕ Added

- **`SectionController.php`** (`Backend/Instructor/`) — CRUD section: `store`, `update`, `destroy`, `reorder`; diproteksi `instructor_id === auth()->id()`.
- **`LectureController.php`** (`Backend/Instructor/`) — CRUD lecture nested di dalam section: `store`, `update`, `destroy`, `reorder`; validasi kepemilikan course→section→lecture.
- **`Pages/Instructor/Courses/Curriculum.jsx`** — Halaman React kurikulum: accordion section, list lecture per section, inline edit title section, inline edit detail lecture (judul/URL/durasi/catatan), form tambah section & lecture, tombol "Ajukan ke Review" (draft → pending_review), sidebar ringkasan (total section/lecture/durasi), tips panel.
- **Route Group L7** di `routes/web.php`:
  - `GET instructor/courses/{course}/curriculum` → `CourseController@curriculum` (menggantikan placeholder redirect)
  - `POST/PATCH/DELETE instructor/courses/{course}/sections/{section?}` → `SectionController`
  - `POST instructor/courses/{course}/sections/reorder` → `SectionController@reorder`
  - `POST/PATCH/DELETE instructor/courses/{course}/sections/{section}/lectures/{lecture?}` → `LectureController`
  - `POST instructor/courses/{course}/sections/{section}/lectures/reorder` → `LectureController@reorder`

### 🔧 Changed

- **`CourseController.php`** — Tambah method `curriculum()`: load sections + lectures terurut via `sort_order`, render `Inertia::render('Instructor/Courses/Curriculum')`.
- **`BasicInfo.jsx`** — Tab "Kurikulum" kini mengarah ke halaman Curriculum.jsx yang sesungguhnya (route `instructor.courses.curriculum` sudah nyata).

### ✅ Verified

- `npm run build` PASS ✅ — 2393 modules, 0 error (`Curriculum-ntylBPUk.js` terbuild).

---

## [2026-06-02] — React Error Pages & Auth React

Penyelesaian Fase 2 (bagian Auth) dan porting halaman error (404, 500, dll) dari Blade ke React.

### ➕ Added

- **Auth React (L2)**: Porting halaman Breeze ke React+Inertia (Login, Register, Forgot Password, Reset Password) dengan role selection untuk Register.
- **GuestLayout.jsx**: Layout baru untuk otentikasi (split panel).
- **Error Pages**: Pembuatan halaman error React (`Pages/Errors/404.jsx`, dsb.).

### ➖ Removed

- **Legacy Blade Error Views**: Penghapusan view error bawaan Blade/Laravel yang tergantikan oleh komponen React.

---

## [2026-05-31] — Adopsi React + Inertia (Lapisan Frontend)

Penyelarasan dokumentasi terhadap `Kode_Nyata`: lapisan presentasi resmi adalah **React via Inertia** (bukan Blade + Alpine.js), dan **Filament tidak terpasang** pada `composer.json`.

### ➕ Added

- **`02_architecture/ADR/ADR-008-frontend-react-inertia.md`** — ADR adopsi React + Inertia, **men-supersede ADR-002**.
- **`04_plans/MASTER_PLAN_REACT_INERTIA.md`** — Master plan migrasi frontend Blade → React+Inertia (fase, risiko, rollback).
- **`02_architecture/REACT_INERTIA_BENEFITS.md`** — Dokumen keunggulan adopsi React + Inertia.
- **`04_plans/DOCS_UPDATE_PLAN_REACT_INERTIA.md`** — Registry pembaruan seluruh `Set_Dokumentasi`.
- **`04_plans/SCREEN_MAPPING_STITCH_REACT.md`** — Peta 41 layar Stitch → halaman/komponen React.

### 🔧 Changed

- **Tech stack** → React `^19.2.6` + `@inertiajs/react ^3.3.0` + `inertiajs/inertia-laravel ^3.1`; Laravel `^12.0` → `^13.7`; `tailwindcss ^3.1.0` (+ `@tailwindcss/vite ^4.0.0`); Alpine.js diturunkan dari lapisan presentasi utama. (`TECH_STACK.md`, `PRD_BelajarKUY.md`, `00_INDEX.md`, `UI_UX_GUIDELINES.md`, `TECH_STACK_EXTRAS.md`, prompt `05_prompts/*`.)
- **`02_architecture/ADR/ADR-002-...md`** — Status → `Superseded by ADR-008`.
- **`02_architecture/ADR/README.md`** — Tambah baris indeks ADR-008; status ADR-002 → Superseded.
- **`03_features/F07_ADMIN_PANEL.md`** — Filament → halaman admin React + Inertia (`Pages/Admin/*`).

### ⚠️ Corrected

- **Filament dihapus dari tech stack** — `composer.json` `Kode_Nyata` **tidak** memuat paket `filament/*`. Klaim "Filament v5 terinstall" pada entri [2026-05-28] di bawah **tidak akurat** terhadap kode; admin panel dibangun sebagai halaman React+Inertia.
- **Paket Cloudinary** — dokumen lama menyebut `cloudinary-labs/cloudinary-laravel ^2.0`; nilai `Kode_Nyata` adalah `cloudinary/cloudinary_php ^3.1`.

---

## [2026-05-28] — Filament v5 Admin Panel Integration

> ⚠️ **Koreksi (2026-05-31):** Entri di bawah **tidak akurat** terhadap `Kode_Nyata` — `composer.json` tidak memuat paket `filament/*`, dan berkas `app/Filament/**`, `app/Providers/Filament/AdminPanelProvider.php`, interface `FilamentUser` tidak ada. Lihat entri [2026-05-31] di atas. Entri ini dipertahankan sebagai catatan historis.

Instalasi **Filament v5.6.6** sebagai admin panel builder untuk menggantikan custom Blade admin panel.

### ➕ Added

- **`filament/filament` v5.6.6** — Admin panel builder (Composer package + dependencies: Livewire, blade-heroicons, spatie packages, dll)
- **`app/Providers/Filament/AdminPanelProvider.php`** — Konfigurasi panel admin (path: `/admin`, login page, warna Amber)
- **`app/Filament/Resources/Users/UserResource.php`** — CRUD Resource untuk User (List, Create, Edit, View pages)
- **`app/Filament/Resources/Products/ProductResource.php`** — CRUD Resource untuk Product (List, Create, Edit, View pages)
- **`public/js/filament/`**, **`public/css/filament/`**, **`public/fonts/filament/`** — Published Filament assets
- `bootstrap/providers.php` — `AdminPanelProvider` auto-registered

### 🔧 Changed

- **`app/Models/User.php`** — Implements `FilamentUser` interface, menambah method `canAccessPanel(Panel $panel)` yang mengecek `role === 'admin'`
- **`PRD_BelajarKUY.md`** — Versi 1.1: Tech stack tambah Filament, F07 updated, routes admin updated, roadmap P4 updated
- **`02_architecture/TECH_STACK.md`** — Tambah Filament v5 di Core Stack dan Composer Packages
- **`03_features/F07_ADMIN_PANEL.md`** — Rewrite: arsitektur Filament, akses kontrol, resource list, file structure, UI design updated

---

## [2026-05-14] — Documentation Cleanup (Audit Remediation)

Mayor cleanup berdasarkan audit di `07_extras/AUDIT_DOCS_REVIEW.md`.

### ➕ Added

- **`01_guides/GLOSSARY.md`** — Kamus terminologi resmi (student/user, paid/purchased/enrolled, dll)
- **`01_guides/SECURITY_GUIDELINES.md`** — Security checklist per layer
- **`01_guides/TESTING_STRATEGY.md`** — Testing pyramid + templates
- **`02_architecture/ADR/`** folder — 7 Architecture Decision Records:
  - ADR-001: Midtrans payment gateway
  - ADR-002: Blade (not Livewire/Inertia)
  - ADR-003: Denormalized `instructor_id` in orders
  - ADR-004: Sandbox-only Midtrans
  - ADR-005: Payout out of scope
  - ADR-006: Instructor auto-active
  - ADR-007: Role naming duality (user/student)
- **`03_features/F13_COURSE_PLAYER.md`** — Watch page + progress tracking spec
- **`03_features/F14_NOTIFICATIONS.md`** — Mail + real-time event mapping
- **`CHANGELOG.md`** — File ini

### 🔧 Changed

- **`01_guides/AGENT_GUIDELINES.md`** — Version 2.0:
  - Section 5.3 fix: Enrollment check pakai `Enrollment` table (bukan Order)
  - Section 5.4 hapus: 70/30 payout split (ADR-005)
  - Tambah section 5.6 Instructor Lifecycle (ADR-006)
  - Tambah strict constraint tentang Cloudinary, enrollment, payout
  - Tambah section 4.6 Media Upload Rule
  - Tambah mandatory reading section di atas
- **`03_features/F05_CART_WISHLIST.md`** — AJAX contract disinkronkan Schema v2 (no price/instructor_id fields)
- **`03_features/F11_COUPON_SYSTEM.md`** — Code examples pakai field v2 (`code`, `discount_percent`, `valid_until`)
- **`03_features/F06_PAYMENT_MIDTRANS.md`** — `handleSuccess()` lengkap dengan Enrollment + mail + broadcast
- **`03_features/F07_ADMIN_PANEL.md`** — Hapus halaman Mail/Midtrans/Google/Cloudinary settings UI; Instructor view-only (ADR-006)
- **`03_features/F01_AUTH_SYSTEM.md`** — Welcome email reference, Cloudinary profile photo
- **`03_features/F09_STUDENT_PANEL.md`** — Tambah link ke Course Player (F13), enrollment query
- **`03_features/F03_COURSE_MANAGEMENT.md`** — Thumbnail upload ke Cloudinary (bukan public/uploads/)
- **`02_architecture/API_ROUTES.md`** — Route summary updated, admin settings routes removed, Course Player routes added, `role:student` alias explained
- **`02_architecture/FOLDER_STRUCTURE.md`** — Clarify no `public/uploads/` (Cloudinary)
- **`02_architecture/TECH_STACK.md`** — Env: `APP_LOCALE=id`, SQLite default dev, remove `MIDTRANS_IS_PRODUCTION`
- **`01_guides/GIT_WORKFLOW.md`** — Simplified (no `develop` branch), Conventional Commits style
- **`01_guides/SETUP_GUIDE.md`** — Demo accounts pakai `.test` domain, password info
- **`04_plans/MASTER_ROADMAP.md`** — Relative days (Day N) bukan tanggal absolut, Phase 4 tambah Course Player
- **`05_prompts/PROMPT_SETUP_PROJECT.md`** — APP_LOCALE=id, timezone, no `MIDTRANS_IS_PRODUCTION`
- **`05_prompts/PROMPT_AUTH.md`** — Cloudinary upload (bukan public/uploads)
- **`05_prompts/PROMPT_ADMIN_PANEL.md`** — Hapus mail/midtrans/google settings pages
- **`.env.example`** — Full rewrite: locale=id, timezone Jakarta, SQLite default, Cloudinary/Meilisearch/Reverb sections, no MIDTRANS_IS_PRODUCTION
- **`07_extras/MODERN_TECH_STACK_RECOMMENDATIONS.md`** → Renamed to **`TECH_STACK_EXTRAS.md`**
- **`00_INDEX.md`** — Rewritten: reflect new structure, quick navigation

### ➖ Removed

- **`02_architecture/DATABASE_MIGRATIONS_PROMPT.md`** — Duplikat outdated (Schema v1). `05_prompts/PROMPT_MIGRATIONS.md` adalah source of truth.

---

## [2026-05-13] — Session 3 (Kiro)

### ➕ Added
- 19 database migration files (Schema v2) di `BelajarKUY/database/migrations/`
- 19 Eloquent models di `BelajarKUY/app/Models/`
- `07_extras/ERD_BelajarKUY.html` — Visual ERD
- `06_reports/REPORT_2026-05-13_DATABASE_LAYER.md`

### 🔧 Changed
- `05_prompts/PROMPT_MIGRATIONS.md` — Align ke Schema v2
- `05_prompts/PROMPT_MODELS.md` — Align ke Schema v2
- `06_reports/PROGRESS_TRACKER.md` — Phase 1 database 100%

---

## [2026-05-14] — Session 4 (Kiro)

### ➕ Added
- 19 model factories di `BelajarKUY/database/factories/`
- 5 seeders orchestrated: `UserSeeder`, `CategorySeeder`, `CourseSeeder`, `TransactionSeeder`, `CmsSeeder`
- `06_reports/REPORT_2026-05-14_SEEDERS_FACTORIES.md`

### ✅ Verified
- `php artisan migrate:fresh --seed` on SQLite → 22 migrations + 5 seeders PASS, 896 records

---

## [2026-05-13] — Session 2 (Antigravity)

### ➕ Added
- `01_guides/UI_UX_GUIDELINES.md` — Design workflow

---

## [2026-05-12] — Session 1 (Yosua) — Initial Setup

### ➕ Added
- Initial `BelajarKUY_docs/` structure
- All baseline documentation (INDEX, guides, architecture, features, plans, prompts)
- Laravel 12 project initialized
- TailwindCSS + Vite setup

---

*Format konvensi: `### ➕ Added | 🔧 Changed | ➖ Removed | ✅ Verified | 🐛 Fixed`*

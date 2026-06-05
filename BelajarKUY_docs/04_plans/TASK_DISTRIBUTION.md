# 👥 BelajarKUY — Task Distribution

> Pembagian tugas per anggota tim.

---

## Summary Per Anggota

| Anggota | Role | Area Lead | Collaborator Role |
|---------|------|-----------|-------------------|
| **Yosua Valentino** | PM & Architect | Setup, DB, integrasi, code review, testing oversight | — |
| **Albariqi Tarigan** | Backend Lead (Auth + Course) | Auth, Course CRUD, Instructor panel, Course Player (backend) | — |
| **Ray Nathan** | Backend Lead (Commerce) | Cart, Wishlist, Payment (Midtrans), Coupon | — |
| **Vascha U** | Frontend Lead | Landing page, course detail, student panel, Course Player (frontend) | Admin panel UI |
| **Quinsha Ilmi** | UI/UX Lead (Admin) | Admin panel, admin dashboard, admin CRUD | Frontend components |

> **Aset Redesign (Google Stitch):** `BelajarKuy_Design_Revisi.zip` dibuat berdua oleh **Vascha** & **Quinsha** — 2 folder ekspor per orang (Vascha = ekspor (5) & (7) / Konteks_A; Quinsha = ekspor (6) & (8) / Konteks_B). Detail: `04_plans/SCREEN_MAPPING_STITCH_REACT.md` §1.0.
>
> **Jadwal pengerjaan & rencana push per bagian:** lihat `04_plans/MIGRATION_SCHEDULE_REACT_INERTIA.md`.

### Konvensi "Lead vs Collaborator"

- **Lead** = owner fitur. Decision-maker, pastikan spec terpenuhi, buat PR utama.
- **Collaborator** = membantu lead saat diminta. Bukan owner, tidak perlu hadir setiap meeting fitur tsb.

---

## Detail Per Anggota

### 1. Yosua Valentino (PM)

```
☐ Init Laravel ^13.7 project
☐ Setup TailwindCSS + Vite config + React/Inertia (app.jsx, @vitejs/plugin-react)
☐ Create ALL database migrations (~20 files)
☐ Create ALL Eloquent models (~18 models)
☐ Create database seeders (admin, categories, demo courses)
☐ Setup config/midtrans.php
☐ Create MidtransService.php
☐ Setup .env.example with all variables
☐ Code review semua PR
☐ Performance optimization & bug fix final
```

### 2. Albariqi Tarigan (Backend Lead — Auth & Course)

```
Lead:
✅ Install Laravel Breeze (sudah terinstall + scaffolded — verified Session 7)
✅ Customize registration (add role selection — Siswa/Instruktur radio card)
✅ Implement RoleMiddleware (alias 'role' di bootstrap/app.php)
✅ Setup Google OAuth (Socialite — Session 6, GoogleController.php)
✅ Post-login redirect logic by role (match() → admin/instructor/student dashboard)
✅ Post-register redirect logic by role
✅ Dashboard Controllers (Admin, Instructor, Student — placeholder)
✅ Dashboard Views (backend/admin|instructor|student/dashboard.blade.php)
✅ Create separate login pages (admin/login, instructor/login) — NEXT
☐ Course CRUD controller (instructor)
☐ Course form + validation (StoreCourseRequest) — Cloudinary upload
☐ Dynamic subcategory loading (AJAX)
☐ Course Section CRUD
☐ Course Lecture CRUD
☐ Instructor dashboard + profile (detail — expand existing placeholder)
☐ Submit for review flow (draft → pending_review)
☐ Course Player backend (F13)
☐ Lecture completion tracking
☐ Email integrations (Welcome, Course Approved, Course Rejected)
```

### 3. Ray Nathan (Backend — Commerce)

```
Lead:
✅ Wishlist add/remove — WishlistController toggle (JSON), route wishlist.add → L3
✅ Wishlist page UI — Pages/Student/Wishlist.jsx (React+Inertia, grid kartu, empty state) — L3
✅ Cart system — CartController add/remove/move-to-wishlist/count + cek Enrollment — L4
✅ Cart page UI with pricing — Pages/Cart/Index.jsx (subtotal real-time, hapus, pindah ke wishlist) — L4
✅ Checkout page — Pages/Checkout/Index.jsx (desain checkout_pesanan, Konteks_A) — L9
✅ Midtrans Snap integration (frontend JS) — Pages/Checkout/Process.jsx auto-trigger snap.pay() — L9
✅ Payment controller (create snap token) — CheckoutController@process → Inertia::render — L9
✅ Payment callback handler (notification URL) — CheckoutController@callback CSRF-exempt — L9
✅ Order creation after successful payment — handleSuccess() di CheckoutController — L9
✅ Coupon CRUD (instructor) — Pages/Instructor/Coupons/Index.jsx + InstructorCouponController — L8
✅ Coupon apply logic at checkout — CouponPanel aktif di Cart + FrontendCouponController — L8
```

### 4. Vascha U (Frontend Lead)

```
Lead (React + Inertia — ADR-008):
✅ Root view Inertia (app.blade.php) + entry app.jsx (oleh Yosua, L0)
✅ Layout React: AppLayout.jsx (oleh Yosua, L0; footer diperbaiki di L1)
✅ Navbar component — AppHeader.jsx (responsive, cart badge, user menu) — L1 (i18n)
✅ Footer component — AppFooter.jsx reusable + i18n — L1 Vascha
✅ Category card component (via Home.jsx section kategori) — L1
✅ Course card component — CourseCard.jsx (oleh Yosua L0; dipakai di Show.jsx L1)
✅ Featured & Bestseller courses section (Home.jsx) — L1
✅ Course detail page — Pages/Courses/Show.jsx (Inertia::render, data dinamis) — L1 Vascha
✅ Komponen reusable: Badge.jsx, EmptyState.jsx — L1 Vascha
✅ Setup i18n (react-i18next, id.json, en.json) — L1 Vascha
✅ Security fix: Object.hasOwn() di Badge.jsx (prototype pollution) — L1 Vascha
☐ Cart & Checkout page UI (`Pages/Cart/Index.jsx`, `Pages/Checkout/Index.jsx`) — L5+
✅ Student dashboard (`Pages/Student/Dashboard.jsx`) — L5 Vascha (4 Jun 2026)
✅ Student enrolled courses page (`Pages/Student/MyCourses.jsx` — progress bars) — L5 Vascha (4 Jun 2026)
☐ Course Player frontend (F13) — `Pages/Courses/Player.jsx` — L10
☐ Live search component (Meilisearch + React state) — post-L1
☐ Toast/notification listener (Reverb events; konsumsi shared prop `flash`) — post-L1
```

### 5. Quinsha Ilmi (UI/UX Lead — Admin & Frontend)

```
Lead:
☐ Admin layout (sidebar, topbar, content area)
☐ Admin dashboard (stats + recent activity)
☐ Category CRUD (admin) + image upload (Cloudinary)
☐ SubCategory CRUD (admin)
☐ Admin course management (approve/reject flow) — ADR-006
☐ Admin instructor LIST (view-only, no approve/block) — ADR-006
☐ Admin order management (list + detail + filter)
☐ Admin user list (view-only)
☐ Slider CRUD (admin) — Cloudinary
☐ Info Box CRUD (admin)
☐ Partner CRUD (admin) — Cloudinary
☐ Site Settings CRUD (key-value pairs)
☐ Admin review management (approve/reject)

Collaborator (with Vascha):
☐ Review & Rating system backend logic
☐ Course card component polish
```

---

## 🚀 Alokasi Tugas Migrasi Frontend React + Inertia (ADR-008)

> Selaras dengan fase di `MASTER_PLAN_REACT_INERTIA.md` & `MASTER_ROADMAP.md` (Phase 6). Backend tidak berubah.

```
Fase 1 — Fondasi & Publik (Vascha & Quinsha + Yosua)
✅ Scaffolding Inertia: app.blade.php (root view 'app') + resources/js/app.jsx — L0 Yosua
✅ Port halaman publik ke Pages/ (Welcome, Home) — controller view() → Inertia::render() — L0 Yosua
✅ Komponen reusable awal: AppHeader, CourseCard, FlashToast — L0 Yosua
✅ Port Courses/Show ke Pages/Courses/Show.jsx — Inertia::render, data dinamis — L1 Vascha
✅ Komponen baru: AppFooter, Badge, EmptyState — L1 Vascha
✅ Setup i18n: react-i18next, id.json, en.json — L1 Vascha
🔄 Fase 1 selesai untuk Vascha. Menunggu Albariqi L2 (Auth React) sebelum L5 Student panel.

Fase 2 — Auth & Student (Albariqi + Vascha)
✅ Halaman auth React (Pages/Auth/*) via Breeze + Inertia — L2 Albariqi
✅ Panel Student ke Pages/Student/* (Dashboard, MyCourses, Wishlist, Profile, Notifications) — L5 Vascha (4 Jun 2026)

Fase 3 — Instructor & Admin (Albariqi + Quinsha & Vascha)
☐ Panel Instructor ke Pages/Instructor/*
☐ Panel Admin ke Pages/Admin/* (tanpa Filament; akses via RoleMiddleware role:admin)
☐ Deaktivasi & arsip view Blade lama sesuai deactivation sequence
```

---

## Task Status Legend

```
☐  = Belum dikerjakan
🔄 = Sedang dikerjakan
✅ = Selesai
❌ = Blocked / bermasalah
```

---

## Aturan Kolaborasi

1. **Sebelum mulai task baru** → Pull latest dari `develop`
2. **Setelah selesai task** → Push, buat PR, update `PROGRESS_TRACKER.md`
3. **Jika blocked** → Tulis di PROGRESS_TRACKER dan notify PM (Yosua)
4. **Jika perlu modifikasi file orang lain** → Koordinasi dulu via chat
5. **Jika menggunakan AI agent** → Pastikan agent membaca `AGENT_GUIDELINES.md` terlebih dahulu

---

## ⚠️ WAJIB Setelah Setiap Sesi Kerja

> Aturan ini berlaku untuk **semua anggota tim** dan **semua AI agent**.

Setelah selesai mengerjakan task, WAJIB melakukan hal berikut **sebelum push**:

### A. Update `TASK_DISTRIBUTION.md` (file ini)

Ganti status checkbox task yang diselesaikan:
```
☐ Task yang belum dikerjakan
→ ✅ Task yang selesai (tambahkan catatan singkat jika perlu)
```

### B. Update `PROGRESS_TRACKER.md`

1. Update timestamp di baris pertama: `> **Update terakhir:** DD Mei YYYY — HH:MM WIB oleh [NAMA]`
2. Update persentase modul di tabel Summary
3. Centang checkbox di section Phase yang sesuai: `- [ ]` → `- [x]`
4. Pindahkan item yang selesai ke section `## 🟢 SELESAI` jika modul penuh selesai
5. Tambahkan entry baru di `## 📝 Session Logs` dengan format:
   ```
   ### Session N — DD Mei YYYY (Nama/Inisial)
   - Created/Updated: [daftar file yang dibuat/dimodifikasi]
   - Branch: [nama branch]
   - Status: [ringkasan status]
   - Next: [task berikutnya]
   - Report: [link ke daily report jika ada]
   ```

### C. Buat Daily Report

Jika menyelesaikan milestone besar (1 feature atau lebih), buat file:
```
BelajarKUY_docs/06_reports/REPORT_YYYY-MM-DD_TOPIK.md
```
Lihat format di `AGENT_GUIDELINES.md` section 8 atau contoh di `06_reports/`.

### D. Commit & Push

Gunakan Conventional Commits:
```
feat(auth): implement role middleware and dashboard controllers
docs: update progress tracker and task distribution session 7
```

---

*Pembagian tugas ini bisa berubah sesuai progress. Update jika ada perubahan.*
*Last updated: 5 Juni 2026 — 21:40 WIB — Session 14 — Antigravity (AI Agent) untuk Yosua Valentino (Ray co-author) — L9 Checkout + Midtrans + Enrollment Selesai*

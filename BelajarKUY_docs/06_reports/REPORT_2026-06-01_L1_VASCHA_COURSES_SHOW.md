# 📋 Session 10 Report — 1 Juni 2026
# L1 Vascha — Courses/Show React+Inertia + i18n + Security

> **Author:** Vascha U (vaschau@students.usu.ac.id)  
> **Branch:** `feature/public-react`  
> **Commits:** `44c9edb`, `f9f6848`  
> **Push target:** https://github.com/yopalll/BelajarKUY  
> **npm run build:** ✅ sukses — 2366 modules, ~850ms

---

## Ringkasan

Sesi ini menyelesaikan **L1 (Vascha's task)** dari `URUTAN_KERJA_TIM_REACT_INERTIA.md` secara penuh.  
Ini adalah kontribusi pertama Vascha ke branch `feature/public-react` dalam rangka migrasi frontend ke React + Inertia (ADR-008).

---

## File yang Dibuat

| File | Keterangan |
|------|-----------|
| `resources/js/Pages/Courses/Show.jsx` | Port penuh `course-detail.blade.php` ke React. Fitur: hero banner, accordion kurikulum, profil instruktur, rating breakdown, form review bintang, sticky purchase card (harga/diskon/wishlist/cart), kursus terkait. |
| `resources/js/Components/AppFooter.jsx` | Footer reusable dengan 4 grup link, sosial media icon, copyright dinamis. Fully i18n. |
| `resources/js/Components/Badge.jsx` | Badge reusable dengan 8 varian warna + 3 ukuran. Security fix: `Object.hasOwn()`. |
| `resources/js/Components/EmptyState.jsx` | Komponen empty state reusable dengan icon, judul, deskripsi, dan action button opsional. |
| `resources/js/i18n/index.js` | Konfigurasi `i18next` — default `id` (Bahasa Indonesia), fallback `en`. |
| `resources/js/i18n/locales/id.json` | Semua string UI dalam Bahasa Indonesia (nav, footer, home, welcome, course, badge). |
| `resources/js/i18n/locales/en.json` | Terjemahan Bahasa Inggris sebagai fallback locale. |

---

## File yang Dimodifikasi

| File | Perubahan |
|------|-----------|
| `app/Http/Controllers/Frontend/CourseDetailController.php` | Ganti `view('frontend.course-detail', ...)` → `Inertia::render('Courses/Show', ...)`. Tambah `use Inertia\Inertia;`. |
| `routes/web.php` | Route `course.detail` dari closure placeholder → `[CourseDetailController::class, 'show']`. |
| `resources/js/Layouts/AppLayout.jsx` | Import dan pakai `AppFooter` (ganti inline footer). |
| `resources/js/Components/AppHeader.jsx` | Tambah `useTranslation()` — semua string UI kini via `t()`. Fix i18n scanner finding. |
| `resources/js/Pages/Home.jsx` | Refactor dengan `useTranslation()`, tambah seksi kategori. |
| `resources/js/Pages/Welcome.jsx` | Refactor dengan `useTranslation()`, hero section baru. |
| `resources/js/app.jsx` | Tambah `import './i18n';` agar i18next diinisialisasi di entry point. |
| `package.json` + `package-lock.json` | Tambah `i18next` + `react-i18next`. |

---

## Security Fixes

### 1. JSX Not Internationalized (`AppHeader.jsx`, `AppFooter.jsx`, `Home.jsx`, `Welcome.jsx`, `Show.jsx`)
- **Rule:** `jsx-not-internationalized` (Semgrep)
- **Fix:** Semua hardcoded string UI diganti dengan `t()` dari `react-i18next`.
- **Locale files:** `id.json` (default) + `en.json` (fallback).

### 2. Prototype Pollution via Bracket Notation (`Badge.jsx:L26`)
- **Rule:** Bracket object notation with user input
- **Risiko:** `variants["__proto__"]`, `variants["constructor"]` tidak `undefined` — bisa akses prototype chain.
- **Fix:**
  ```js
  // Sebelum (rentan):
  ${variants[variant] ?? variants.indigo}

  // Sesudah (aman):
  const variantClass = Object.hasOwn(variants, variant) ? variants[variant] : variants.indigo;
  ```
- `Object.hasOwn()` hanya mengecek own properties, **tidak naik ke prototype chain**.

---

## Checklist DoD L1

| Item | Status |
|------|--------|
| `Pages/Courses/Show.jsx` port dari Blade | ✅ |
| `Components/AppFooter.jsx` | ✅ |
| `Components/Badge.jsx` | ✅ |
| `Components/EmptyState.jsx` | ✅ |
| `CourseDetailController` → `Inertia::render()` | ✅ |
| `routes/web.php` route `course.detail` pakai controller | ✅ |
| `AppLayout` pakai `AppFooter` | ✅ |
| i18n setup (`react-i18next`, `id.json`, `en.json`) | ✅ |
| Security: `jsx-not-internationalized` fixed | ✅ |
| Security: prototype pollution `Badge.jsx` fixed | ✅ |
| `npm run build` sukses | ✅ |
| Commit di `feature/public-react` sebagai Vascha U | ✅ |

---

## Next Steps

| Langkah | PIC | Dependensi |
|---------|-----|-----------|
| **L2** — Auth React (`Pages/Auth/*` via Breeze+Inertia) | Albariqi | Tidak ada |
| **L3** — Wishlist React (pakai `CourseCard`) | Ray | L1 ✅ |
| **L4** — Cart React | Ray | L1 ✅ |
| **L5** — Student Panel React (`Pages/Student/*`) | Vascha | L2 Albariqi |

> **Vascha:** Setelah L2 (Albariqi) selesai, lanjut ke L5 (Student Panel).

---

*Report dibuat oleh Antigravity (AI Agent) untuk Vascha U — 1 Juni 2026 — 23:38 WIB*

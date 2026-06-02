# REPORT — L2 Albariqi: Auth Pages React+Inertia

**Tanggal:** 2026-06-02  
**Branch:** `feature/auth-react`  
**PIC:** Albariqi (dikerjakan via Antigravity AI)  
**Dokumen referensi:** `URUTAN_KERJA_TIM_REACT_INERTIA.md` → Langkah 2

---

## ✅ Status: SELESAI

`npm run build` PASS — 2371 modules transformed, 0 error.

---

## Apa yang Dikerjakan

### Langkah L2 — Port Auth Breeze ke React+Inertia

#### File Baru (React Pages & Layout)

| File | Deskripsi |
|------|-----------|
| `resources/js/Layouts/GuestLayout.jsx` | Layout dua panel: branding kiri (gradient indigo-purple + stats), form kanan |
| `resources/js/Pages/Auth/Login.jsx` | Halaman login: email/password, Google OAuth, remember me, show/hide password, link forgot/register |
| `resources/js/Pages/Auth/Register.jsx` | Halaman register: role selector kartu (Siswa 🎓 / Instruktur 📖), semua field, show/hide password |
| `resources/js/Pages/Auth/ForgotPassword.jsx` | Kirim email reset: info box + status sukses |
| `resources/js/Pages/Auth/ResetPassword.jsx` | Reset password: token dari URL, email readonly, password strength hints |

#### Controller yang Diubah (Blade → Inertia::render)

| Controller | Method | Sebelum | Sesudah |
|------------|--------|---------|---------|
| `AuthenticatedSessionController` | `create()` | `view('auth.login')` | `Inertia::render('Auth/Login', ['canResetPassword', 'status'])` |
| `RegisteredUserController` | `create()` | `view('auth.register')` | `Inertia::render('Auth/Register')` |
| `PasswordResetLinkController` | `create()` | `view('auth.forgot-password')` | `Inertia::render('Auth/ForgotPassword', ['status'])` |
| `NewPasswordController` | `create()` | `view('auth.reset-password')` | `Inertia::render('Auth/ResetPassword', ['token', 'email'])` |

---

## Detail Teknis

### GuestLayout
- **Dua panel**: kiri branding (gradient + grid pattern + stats), kanan form
- **Responsive**: panel kiri hidden di mobile, logo tampil ulang di atas form
- **Menggunakan**: `FlashToast` (dari fondasi Yosua), font Plus Jakarta Sans

### Login
- **Google OAuth**: tombol `<a href={route('auth.google')}>` → tidak pakai `router.post`
- **Show/Hide password**: toggle ikon mata dengan `useState`
- **Remember me**: checkbox terhubung ke `useForm`
- **Validasi**: error per field dari Inertia `errors`, styling conditional
- **Spinner**: loading state saat `processing`

### Register
- **Role selector**: dua kartu radio dengan state visual aktif (border + background indigo)
- **Default role**: `'user'` (Siswa) sesuai backend `RegisteredUserController`
- **Koeksistensi**: tidak mengubah logika backend, hanya port tampilan

### ForgotPassword
- **Props**: `status` dari `session('status')` (dikembalikan setelah link dikirim)
- **Info box**: penjelasan proses sebelum form

### ResetPassword
- **Props**: `token` (dari route param), `email` (dari query string)
- **Email readonly**: field email non-editable jika sudah terisi dari URL
- **Strength hints**: box kuning berisi tips password kuat
- **Token error**: ditampilkan jika token sudah expired

---

## DoD Checklist (dari URUTAN_KERJA_TIM_REACT_INERTIA.md)

- [x] Login via React jalan (form POST ke `/login`)
- [x] Register via React jalan (form POST ke `/register`, role selector)
- [x] Logout: tetap via route `logout` (Inertia router.post)
- [x] Redirect per role tetap benar (dikontrol backend `AuthenticatedSessionController@store`)
- [x] Google OAuth: tombol link ke `route('auth.google')` (tidak diubah)
- [x] `npm run build` sukses ✅
- [x] Koeksistensi tidak rusak (halaman lain masih berjalan via Blade/app.js)
- [x] Blade views lama (`auth/*.blade.php`) tidak dihapus (sesuai instruksi)

---

## PR Checklist (sebelum buka PR ke `develop`)

- [x] `npm run build` sukses, tidak ada error console
- [x] Halaman lama yang belum diport masih jalan (koeksistensi tidak rusak)
- [x] Tidak mengubah skema DB / integrasi (Midtrans/Cloudinary/Reverb/Meilisearch/Socialite)
- [ ] Update `PROGRESS_TRACKER.md` (jika ada)
- [x] Pesan commit pakai Conventional Commits: `feat(auth): ...`

---

## Catatan untuk Tim

- **Vascha (L5)** sekarang bisa lanjut Student panel — L2 (auth React) sudah selesai ✅
- **Route** tidak berubah, semua masih via `routes/auth.php` yang sama
- **Admin login** (`/admin/login`) tetap pakai Blade (`view('auth.admin-login')`) — tidak diubah, sudah benar
- **Blade auth views** lama tetap ada di `resources/views/auth/` — akan diarsip di Langkah 16 (Yosua)

# Plan: Admin Panel — Gap Analysis & Implementation

**Tanggal audit:** 2026-06-08  
**Status sistem saat ini:** ~90% sudah diimplementasi  
**Prioritas:** Fix dulu yang sudah ada tapi salah, baru tambah yang baru

---

## Status Aktual (Sudah Ada)

Asumsi bahwa admin belum ada adalah **keliru**. Berikut yang sudah terimplementasi:

| Komponen | File | Status |
|---|---|---|
| DB role enum (`user`/`instructor`/`admin`) | `migrations/2026_05_13_000001_add_fields_to_users_table.php` | ✅ |
| Helper methods `isAdmin()`, `isInstructor()`, scopes | `app/Models/User.php` | ✅ |
| `RoleMiddleware` (alias `role:admin`) | `app/Http/Middleware/RoleMiddleware.php` | ✅ |
| Routes `/admin/*` + middleware guard | `routes/web.php` baris 65–86 | ✅ |
| Halaman login admin (`/admin/login`) | `resources/js/Pages/Auth/AdminLogin.jsx` | ✅ |
| `AdminLayout` — sidebar + topbar + mobile | `resources/js/Layouts/AdminLayout.jsx` | ✅ (ada bug icon) |
| 11 admin controllers | `app/Http/Controllers/Admin/` | ✅ |
| 15 halaman React admin | `resources/js/Pages/Admin/` | ✅ (ada bug icon) |
| Seeder `admin@belajarkuy.test` / `password` | `database/seeders/UserSeeder.php` | ✅ |
| Dashboard stats (siswa, instruktur, kursus, revenue) | `app/Http/Controllers/Backend/Admin/DashboardController.php` | ✅ |

---

## Gap Yang Perlu Dikerjakan

### Gap 1 — AdminLayout & halaman admin pakai Lucide (bukan Material Symbols)

**Prioritas: TINGGI** — melanggar design system proyek

`AdminLayout.jsx` mengimport ikon dari `lucide-react` di baris 2–9:
```js
import { LayoutDashboard, BookOpen, Star, Tag, Layers, Users,
    ShoppingCart, UserCircle, Image, Info, Handshake, Settings,
    LogOut, Menu, X, Bell, Search } from 'lucide-react';
```

`Users/Index.jsx` juga pakai `ChevronLeft`, `ChevronRight` dari Lucide.

**Aturan proyek:** Semua ikon wajib `<span className="material-symbols-outlined">nama_ikon</span>`. Ikon filled pakai `style={{ fontVariationSettings: "'FILL' 1" }}`.

**Pemetaan ikon Lucide → Material Symbols:**

| Lucide | Material Symbol |
|---|---|
| `LayoutDashboard` | `dashboard` |
| `BookOpen` | `menu_book` |
| `Star` | `star` |
| `Tag` | `label` |
| `Layers` | `layers` |
| `Users` | `group` |
| `ShoppingCart` | `shopping_cart` |
| `UserCircle` | `manage_accounts` |
| `Image` | `image` |
| `Info` | `info` |
| `Handshake` | `handshake` |
| `Settings` | `settings` |
| `LogOut` | `logout` |
| `Menu` | `menu` |
| `X` | `close` |
| `Bell` | `notifications` |
| `Search` | `search` |
| `ChevronLeft` | `chevron_left` |
| `ChevronRight` | `chevron_right` |

**File yang diubah:**
- `resources/js/Layouts/AdminLayout.jsx` — ganti semua `<Icon className="..." />` dengan `<span className="material-symbols-outlined">`
- `resources/js/Pages/Admin/Users/Index.jsx` — ganti ChevronLeft/ChevronRight
- Audit semua `resources/js/Pages/Admin/**/*.jsx` untuk sisa import Lucide

---

### Gap 2 — User Management hanya view-only

**Prioritas: MENENGAH**

`AdminUserController` hanya punya `index()`. Halaman `Admin/Users/Index.jsx` tidak ada tombol aksi — admin tidak bisa mengubah role atau menonaktifkan akun user.

**Implementasi:**

**A. Controller** — `app/Http/Controllers/Admin/AdminUserController.php`

Tambah method:
```php
public function updateRole(Request $request, User $user): RedirectResponse
{
    $request->validate(['role' => 'required|in:user,instructor,admin']);

    // Cegah admin ubah role dirinya sendiri
    if ($user->id === auth()->id()) {
        return back()->with('error', 'Tidak bisa mengubah role akun sendiri.');
    }

    $user->update(['role' => $request->role]);
    return back()->with('success', "Role {$user->name} diubah ke {$request->role}.");
}
```

**B. Route** — `routes/web.php` (dalam grup admin)
```php
Route::patch('users/{user}/role', [AdminUserController::class, 'updateRole'])->name('users.update-role');
```

**C. UI** — `resources/js/Pages/Admin/Users/Index.jsx`

Tambah kolom "Aksi" di tabel dengan dropdown select role per baris. Gunakan `router.patch()` dari Inertia saat role dipilih. Tambah konfirmasi sebelum submit.

---

### Gap 3 — Tidak ada manajemen Kupon Global (Admin)

**Prioritas: RENDAH** — opsional, bisa ditunda

Instruktur bisa CRUD kupon untuk kursus mereka sendiri via `/instructor/coupons`. Admin tidak bisa membuat **kupon global** (`course_id = NULL`) yang berlaku untuk semua kursus.

**Implementasi:**

**A. Controller** — buat `app/Http/Controllers/Admin/AdminCouponController.php`
- `index()` — daftar semua kupon (global + per-kursus) dengan filter
- `store()` — buat kupon global (validasi: `course_id` wajib null untuk admin)
- `update()` — edit kupon
- `destroy()` — hapus kupon
- `toggle()` — aktifkan/nonaktifkan kupon

**B. Route** — `routes/web.php` (dalam grup admin)
```php
Route::resource('coupons', AdminCouponController::class)->except(['show', 'create', 'edit']);
Route::patch('coupons/{coupon}/toggle', [AdminCouponController::class, 'toggle'])->name('coupons.toggle');
```

**C. UI** — buat `resources/js/Pages/Admin/Coupons/Index.jsx`
- Tabel: kode, diskon%, tipe (global/kursus), kursus, expired_at, status, aksi
- Form inline atau modal untuk buat/edit kupon global
- Toggle switch untuk aktif/nonaktif

**D. Sidebar** — tambah entri "Kupon" di `NAV_ITEMS` di `AdminLayout.jsx`
```js
{ label: 'Kupon', href: '/admin/coupons', icon: 'confirmation_number', route: 'admin.coupons.index' },
```

---

## Urutan Pengerjaan

```
Gap 1 (fix Lucide)
  └─ AdminLayout.jsx           ← ganti semua ikon
  └─ Users/Index.jsx           ← ganti ChevronLeft/Right
  └─ Audit 13 halaman Admin lain ← cek sisa import lucide
  └─ npm run build

Gap 2 (user management)
  └─ AdminUserController.php   ← tambah updateRole()
  └─ routes/web.php            ← tambah route PATCH
  └─ Users/Index.jsx           ← tambah kolom aksi + dropdown role
  └─ npm run build

Gap 3 (kupon global) [opsional]
  └─ AdminCouponController.php ← buat dari nol
  └─ routes/web.php            ← daftarkan resource
  └─ Coupons/Index.jsx         ← buat halaman baru
  └─ AdminLayout.jsx           ← tambah nav item
  └─ npm run build
```

---

## Catatan Penting

- **Jangan** gunakan Lucide icons di komponen manapun — proyek ini wajib Material Symbols Outlined
- **Jangan** tambah kolom baru ke tabel `users` tanpa migration; kalau perlu `is_active`, buat migration terpisah
- **WAJIB** `npm run build` setiap kali ada perubahan di `resources/js/Pages/*.jsx`
- Admin coupon (Gap 3) tidak boleh set `course_id` — harus selalu `NULL` agar berlaku global
- Cegah admin hapus atau ubah role akun admin lain yang sedang aktif (safety guard)

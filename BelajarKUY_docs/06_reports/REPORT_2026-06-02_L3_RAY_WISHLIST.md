# 📊 Report — L3 Ray Nathan · Wishlist React+Inertia (2026-06-02)

> **PIC:** Ray Nathan (Backend — Commerce)
> **Branch:** `feature/wishlist`
> **Tanggal:** 2 Juni 2026
> **Referensi:** `F05_CART_WISHLIST.md` · `PROMPT_COMMERCE.md` · `URUTAN_KERJA_TIM_REACT_INERTIA.md` §L3

---

## 🎯 Tujuan

Mengimplementasikan fitur **Wishlist** (L3 dalam urutan kerja tim):
- Toggle add/remove wishlist dari `CourseCard` (bukan lagi placeholder `back()->`).
- Halaman daftar wishlist siswa via React+Inertia (`Pages/Student/Wishlist.jsx`).
- Ganti route placeholder `wishlist.add` dengan controller nyata.

---

## 📁 File yang Diubah / Dibuat

### [NEW] `app/Http/Controllers/Frontend/WishlistController.php`

Controller baru dengan empat method:

| Method | Route | Keterangan |
|---|---|---|
| `toggle(Request, Course)` | `POST /wishlist/{course}` → `wishlist.add` | Toggle add/remove, return JSON `{success, action, wishlist_count}` |
| `index()` | `GET /student/wishlist` → `student.wishlist` | Halaman React Inertia, return props `wishlists` + `wishlist_ids` |
| `remove(int)` | `DELETE /student/wishlist/{id}` → `student.wishlist.remove` | Hapus item, redirect back dengan flash |
| `count()` | `GET /wishlist/count` → `wishlist.count` | Badge count untuk navbar |

Pola eager-load pada `index()`:
```php
Wishlist::where('user_id', $user->id)
    ->with(['course' => fn($q) => $q
        ->with(['instructor:id,name,photo', 'category:id,name'])
        ->withCount(['reviews' => fn($q) => $q->where('status', true)])
        ->withAvg(['reviews' => fn($q) => $q->where('status', true)], 'rating')
    ])
    ->latest()
    ->get()
```

### [NEW] `resources/js/Pages/Student/Wishlist.jsx`

Halaman React+Inertia:
- **Layout:** `AppLayout` (header + footer publik Konteks_A).
- **Hero strip** gradient indigo/purple dengan judul + counter.
- **Grid responsif** 1→2→3→4 kolom dengan `WishlistCourseCard` (komponen lokal).
- **Empty state** via `EmptyState` + tombol "Jelajahi Kursus".
- **Hapus item** via `router.delete('/student/wishlist/{id}', { preserveScroll: true })`.

### [MODIFIED] `resources/js/Components/CourseCard.jsx`

Tombol wishlist kini fungsional:
- Props baru: `isWishlisted` (boolean, default `false`) dan `onWishlistChange` (callback opsional).
- State lokal `wishlisted` + `loading` (visual feedback saat request in-flight).
- Fetch `POST /wishlist/{course.id}` dengan CSRF token dari cookie `XSRF-TOKEN`.
- Redirect guest ke `/login` secara otomatis.
- Ikon ❤️ merah (filled) jika di-wishlist, abu (outline) jika tidak.

### [MODIFIED] `resources/js/Components/AppHeader.jsx`

Link ikon hati di navbar berubah dari `href="#"` → `href="/student/wishlist"`.

### [MODIFIED] `routes/web.php`

| Route | Sebelum | Sesudah |
|---|---|---|
| `GET /student/wishlist` | `StudentDashboardController@wishlist` (return Blade view) | `WishlistController@index` (Inertia::render) |
| `DELETE /student/wishlist/{id}` | `StudentDashboardController@wishlistRemove` | `WishlistController@remove` |
| `POST /wishlist/{course}` | closure placeholder `back()->'Belum tersedia'` | `WishlistController@toggle` |
| `GET /wishlist/count` | *(tidak ada)* | `WishlistController@count` (baru) |

---

## ✅ Definition of Done (DoD) — semua terpenuhi

- [x] Siswa bisa add/remove wishlist dari `CourseCard` (bukan placeholder)
- [x] Data tersimpan di tabel `wishlists` (toggle idempoten)
- [x] Halaman `/student/wishlist` tampil React dengan data asli
- [x] Empty state tampil bila wishlist kosong
- [x] Skema DB tidak berubah (hanya controller/view/route)
- [x] Koeksistensi halaman Blade lama tidak rusak (prinsip ADR-008)
- [x] `npm run build` sukses ✅ — **2384 modules**

---

## ⚠️ Catatan Ketergantungan

- Halaman wishlist menggunakan middleware `role:user` — hanya student yang bisa akses `/student/wishlist`.
- Guest yang klik tombol wishlist di `CourseCard` akan diarahkan ke `/login` secara otomatis.
- `wishlist.count` endpoint tersedia untuk navbar badge (akan dipakai L5 Vascha / siapa yang mengerjakan navbar enhancement).

---

## 🔜 Next Step

**L4 Ray — Cart** (`feature/cart`):
- `CartController` (index, add, remove)
- `Pages/Cart/Index.jsx` (Konteks_A, daftar item + subtotal + empty state)
- Ganti placeholder `cart.add` + `cart.index`

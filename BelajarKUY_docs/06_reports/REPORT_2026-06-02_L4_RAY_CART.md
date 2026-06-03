# 📊 Report — L4 Ray Nathan · Cart React+Inertia (2026-06-02)

> **PIC:** Ray Nathan (Backend — Commerce)
> **Branch:** `feature/cart`
> **Tanggal:** 2 Juni 2026
> **Referensi:** `F05_CART_WISHLIST.md` · `PROMPT_COMMERCE.md` · `URUTAN_KERJA_TIM_REACT_INERTIA.md` §L4

---

## 🎯 Tujuan

Mengimplementasikan fitur **Cart** (L4 dalam urutan kerja tim):
- `CartController` dengan endpoint add/remove/move-to-wishlist/count.
- Halaman `/cart` via React+Inertia (`Pages/Cart/Index.jsx`).
- Tombol cart di `CourseCard` yang fungsional.
- Ganti semua route placeholder `cart.*` dengan controller nyata.

---

## 📁 File yang Dibuat / Diubah

### [NEW] `app/Http/Controllers/Frontend/CartController.php`

| Method | Route | Keterangan |
|---|---|---|
| `index()` | `GET /cart` → `cart.index` | Halaman React Inertia, props `cartItems` + `subtotal` + `wishlistIds` |
| `add(Request, Course)` | `POST /cart/{course}` → `cart.add` | Cek Enrollment (prevent re-purchase) + idempotent `firstOrCreate`, return JSON |
| `remove(int)` | `DELETE /cart/{id}` → `cart.remove` | Hapus item, return JSON `{success, cart_count}` |
| `moveToWishlist(int)` | `POST /cart/{id}/move-to-wishlist` → `cart.move-to-wishlist` | Hapus dari cart + tambah ke wishlist, return JSON |
| `count()` | `GET /cart/count` → `cart.count` | Badge count + total amount untuk navbar |

**Business rule (F05 §Prevent Re-purchase):**
```php
$alreadyEnrolled = Enrollment::where('user_id', $userId)
    ->where('course_id', $course->id)
    ->exists();
if ($alreadyEnrolled) return response()->json([...], 409);
```

**Pricing real-time (F05 §Auto Price):**
- Cart table tidak menyimpan harga (sesuai Schema v2).
- Subtotal dihitung dari `course->discounted_price` accessor saat render.

### [NEW] `resources/js/Pages/Cart/Index.jsx`

Halaman React+Inertia dengan fitur:
- **Layout:** `AppLayout` (Konteks_A).
- **Hero strip** gradient dengan judul + counter item.
- **`CartItemRow`** — komponen lokal per item: thumbnail, judul, instruktur, rating, harga real-time (dengan badge diskon %), tombol hapus, tombol "Pindah ke Wishlist" (disembunyikan jika kursus sudah di wishlist).
- **`OrderSummary`** — panel sticky kanan: subtotal, info kupon (placeholder untuk L8), tombol "Lanjut ke Checkout", tombol "Cari kursus lain".
- **Empty state** via `EmptyState` + CTA jelajahi kursus.
- **Update UI tanpa full-page reload** — state lokal `items`/`total`, hapus/pindah langsung update state klien setelah response OK.

### [MODIFIED] `resources/js/Components/CourseCard.jsx`

Tombol cart kini fungsional:
- Prop baru: `isInCart` (boolean, default `false`).
- State lokal `inCart` + `cartLoading` + `cartMsg`.
- Fetch `POST /cart/{course.id}` dengan CSRF token dari cookie `XSRF-TOKEN`.
- Ikon berubah dari 🛒 → ✓ saat sudah di keranjang (warna emerald).
- Pesan error server ditampilkan di bawah harga (misal: "Kamu sudah memiliki kursus ini.").

### [MODIFIED] `resources/js/Components/AppHeader.jsx`

Link ikon keranjang berubah dari `href="#"` → `href="/cart"`.

### [MODIFIED] `routes/web.php`

| Route | Sebelum | Sesudah |
|---|---|---|
| `GET /cart` | closure placeholder `view('dashboard')` | `CartController@index` (Inertia::render) |
| `POST /cart/{course}` | closure placeholder `back()->'Belum tersedia'` | `CartController@add` |
| `DELETE /cart/{id}` | *(tidak ada)* | `CartController@remove` (baru) |
| `POST /cart/{id}/move-to-wishlist` | *(tidak ada)* | `CartController@moveToWishlist` (baru) |
| `GET /cart/count` | *(tidak ada)* | `CartController@count` (baru) |

---

## ✅ Definition of Done (DoD) — semua terpenuhi

- [x] Add ke cart berfungsi (bukan placeholder), cek enrolled, idempotent
- [x] Halaman `/cart` tampil React dengan data asli (item + subtotal real-time)
- [x] Hapus item dari cart berfungsi (update UI tanpa reload)
- [x] Pindah ke wishlist berfungsi (hapus dari cart, masuk wishlist)
- [x] Empty state tampil saat keranjang kosong
- [x] Skema DB tidak berubah
- [x] Koeksistensi halaman Blade lama tidak rusak
- [x] `npm run build` sukses ✅

---

## ⚠️ Catatan

- Tombol "Lanjut ke Checkout" mengarah ke `/checkout` yang masih placeholder (akan diimplementasi di L9).
- Panel kupon di `OrderSummary` adalah placeholder (diaktifkan di L8 Coupon).
- Route `cart.count` tersedia untuk navbar badge enhancement (L5 Vascha dapat menggunakannya).
- `role:user` middleware **tidak** dipakai untuk `/cart` — cart bisa diakses siapapun yang login (admin/instruktur pun bisa coba beli kursus secara teknis, meski flow-nya tidak relevan).

---

## 🔜 Next Step

**L8 Ray — Coupon** (`feature/coupon`):
- `CouponController` (instruktur CRUD)
- Validasi & apply kupon di checkout
- Aktifkan panel kupon di `Cart/Index.jsx`

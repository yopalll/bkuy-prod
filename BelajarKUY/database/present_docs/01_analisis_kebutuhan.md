# 01 — Analisis Kebutuhan Data

> **Tujuan:** Mengidentifikasi data apa saja yang harus disimpan sistem, siapa penggunanya, dan apa yang ingin dilakukan terhadap data tersebut.

---

## 1. Latar Belakang Sistem

**BelajarKUY** adalah platform e-learning marketplace di mana:
- **Instruktur** menjual kursus (dengan video, materi, kuis).
- **Pelajar** membeli & menonton kursus, lalu memberi review.
- **Admin** mengelola kategori dan tampilan website (CMS).

Setiap aktivitas (pembelian, progres tontonan, review) harus tersimpan & dapat ditelusuri.

---

## 2. Identifikasi Aktor (Stakeholder)

| Aktor | Aktivitas Utama | Data yang Dihasilkan |
| --- | --- | --- |
| **Student / User** | Daftar, beli kursus, nonton, kasih review | profil, cart, wishlist, order, review, lecture progress |
| **Instructor** | Buat kursus, set harga, buat kupon, lihat penjualan | course, section, lecture, coupon, dashboard penjualan |
| **Admin** | Kelola kategori, slider, partner, moderasi review | category, sub_category, slider, info_box, partner, site_info |
| **Sistem Pembayaran (Midtrans)** | Verifikasi pembayaran via webhook | payment record + JSON response |

---

## 3. Kebutuhan Fungsional (Functional Requirements)

### FR-01 — Manajemen Pengguna
- Sistem **harus** menyimpan data user dengan role berbeda (`user`, `instructor`, `admin`).
- Sistem **harus** menyimpan profil tambahan (foto, telepon, alamat, bio, website).
- Sistem **harus** mendukung reset password & session login.

### FR-02 — Katalog Kursus
- Setiap kursus **harus** punya: judul, deskripsi, harga, thumbnail, video preview, durasi, status (`draft`, `pending_review`, `active`, `inactive`).
- Kursus **harus** dikategorikan (kategori + sub-kategori).
- Kursus **harus** dimiliki oleh seorang instruktur.
- Kursus **boleh** ditandai sebagai `bestseller` atau `featured`.

### FR-03 — Struktur Materi
- Kursus terdiri dari beberapa **section**, setiap section punya beberapa **lecture**.
- Kursus punya daftar **goal** (apa yang akan dipelajari).
- Setiap lecture punya video URL, durasi, content.

### FR-04 — Interaksi Pra-pembelian
- User dapat menyimpan kursus ke **wishlist** & **cart**.
- Satu user tidak boleh punya 1 kursus 2× di cart/wishlist (UNIQUE constraint).

### FR-05 — Transaksi
- User checkout → buat **payment** (terhubung Midtrans).
- 1 payment dapat berisi beberapa **order** (multi-kursus).
- User dapat menggunakan **coupon** untuk diskon.
- Setelah pembayaran berhasil, sistem **harus otomatis** membuat **enrollment**.

### FR-06 — Tracking Belajar
- Sistem mencatat **lecture_completion** setiap kali user selesai menonton 1 materi.
- Sistem dapat menghitung progres % kursus per user.

### FR-07 — Review & Rating
- User yang sudah enroll dapat memberi review (rating 1–5 + komentar).
- 1 user hanya boleh me-review 1 kursus 1×.
- Admin memoderasi review (`pending` / `approved` / `rejected`).

### FR-08 — Content Management (CMS)
- Admin mengelola: slider banner homepage, info box (USP), partner logo, key-value config (site_infos).

---

## 4. Kebutuhan Non-Fungsional (Non-Functional Requirements)

| Kategori | Kebutuhan |
| --- | --- |
| **Integritas** | Foreign key constraint dengan `ON DELETE CASCADE` di relasi kuat, `SET NULL` untuk relasi opsional |
| **Performa** | Composite index pada (`status`, `featured`), (`status`, `bestseller`), (`user_id`, `status`) untuk query filter homepage & dashboard |
| **Keunikan** | `email` unik, `slug` unik (kursus & kategori), `code` kupon unik, `midtrans_order_id` unik |
| **Audit** | Setiap tabel transaksional punya `created_at` & `updated_at` |
| **Skalabilitas** | Foto user/kursus disimpan di **Cloudinary** (`image_url` + `image_public_id`), bukan di server lokal |
| **Keamanan** | Password di-hash (bcrypt Laravel), data Midtrans response disimpan sebagai JSON untuk audit |

---

## 5. Daftar Entitas Data (hasil identifikasi)

Setelah analisa di atas, sistem memerlukan **19 entitas** yang dikelompokkan menjadi:

```
┌─────────────────────────────────────────────────────────┐
│  USER MANAGEMENT                                        │
│  • users   • password_reset_tokens   • sessions         │
├─────────────────────────────────────────────────────────┤
│  KATALOG                                                │
│  • categories   • sub_categories                        │
│  • courses   • course_goals                             │
│  • course_sections   • course_lectures                  │
├─────────────────────────────────────────────────────────┤
│  INTERAKSI USER ↔ KURSUS                                │
│  • wishlists   • carts   • reviews                      │
├─────────────────────────────────────────────────────────┤
│  TRANSAKSI                                              │
│  • coupons   • payments   • orders   • enrollments      │
├─────────────────────────────────────────────────────────┤
│  PROGRESS BELAJAR                                       │
│  • lecture_completions                                  │
├─────────────────────────────────────────────────────────┤
│  CMS / KONTEN HALAMAN                                   │
│  • sliders   • info_boxes   • partners   • site_infos   │
└─────────────────────────────────────────────────────────┘
```

---

## 6. Aturan Bisnis (Business Rules) Penting

| Kode | Aturan |
| --- | --- |
| BR-01 | User dengan role `instructor` saja yang boleh membuat kursus |
| BR-02 | User tidak bisa membeli kursus miliknya sendiri |
| BR-03 | 1 user hanya boleh enroll 1× ke kursus yang sama (UNIQUE `user_id`+`course_id`) |
| BR-04 | Kupon hanya valid sampai `valid_until` & tidak melebihi `max_usage` |
| BR-05 | Review hanya dapat ditulis oleh user yang sudah enroll |
| BR-06 | Penghapusan `category` akan men-cascade ke `courses` & `sub_categories` |
| BR-07 | Penghapusan `payment` akan men-cascade ke `orders` (audit trail penuh) |
| BR-08 | Status payment mengikuti standar Midtrans: `pending`, `settlement`, `capture`, `deny`, `cancel`, `expire`, `failure`, `refund` |

---

## ✅ Kesimpulan Analisis

Sistem ini membutuhkan database **relasional** karena:
1. Data sangat **terstruktur** (skema jelas).
2. Banyak **relasi antar entitas** (user ↔ course ↔ order ↔ enrollment).
3. Butuh **integritas transaksional** (pembayaran tidak boleh hilang/duplikat).
4. Membutuhkan **query kompleks** (agregasi penjualan, ranking instruktur).

→ Pilihan database: **MySQL 8** (dengan engine InnoDB untuk dukungan foreign key & transaksi ACID).

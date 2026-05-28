# 04 — Normalisasi Database

> **Tujuan:** Membuktikan bahwa skema BelajarKUY sudah memenuhi **3NF (Third Normal Form)** dengan menelusuri proses normalisasi dari bentuk "buruk" ke bentuk yang baik.

---

## 🎯 Bentuk Akhir yang Dicapai: **3NF**

| Bentuk Normal | Status | Bukti Singkat |
| --- | --- | --- |
| **1NF** | ✅ Tercapai | Semua atribut atomik (1 nilai per kolom), tidak ada array/multi-value |
| **2NF** | ✅ Tercapai | Semua atribut non-key bergantung penuh pada PRIMARY KEY (tidak ada partial dependency) |
| **3NF** | ✅ Tercapai | Tidak ada transitive dependency (atribut non-key tidak bergantung ke atribut non-key lain) |

---

## 1. Studi Kasus: Tabel "Order" Sebelum Normalisasi

Bayangkan tanpa normalisasi, satu tabel `transaksi` menyimpan SEMUA data:

### ❌ Tabel `transaksi` (UNNORMALIZED — buruk)

| id | user_name | user_email | course1_title | course1_price | course2_title | course2_price | instructor_name | instructor_email | total | midtrans_id |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Yopa | yopa@x.com | Laravel | 200000 | React | 150000 | Budi | budi@x.com | 350000 | OD-001 |
| 2 | Andre | a@x.com | Laravel | 200000 | NULL | NULL | Budi | budi@x.com | 200000 | OD-002 |

### 🔴 Masalah yang Muncul

1. **Multi-value kolom** → `course1_*`, `course2_*` (tidak atomik) ❌
2. **Redundansi** → nama instruktur "Budi" diulang setiap transaksi ❌
3. **Update anomaly** → kalau Budi ganti email, harus update banyak baris ❌
4. **Insert anomaly** → tidak bisa daftarkan instruktur baru tanpa transaksi ❌
5. **Delete anomaly** → hapus transaksi terakhir Budi → data instruktur hilang ❌

---

## 2. Tahap 1NF — Hilangkan Multi-Value & Buat Atomik

**Aturan 1NF:**
- Setiap kolom hanya menyimpan **1 nilai atomik**.
- Tidak ada kolom berulang (`course1`, `course2`, dst).
- Setiap baris unik (ada PRIMARY KEY).

### ✅ Hasil setelah 1NF

`transaksi` dipecah → satu baris = satu kursus per transaksi:

| id | user_name | user_email | course_title | course_price | instructor_name | instructor_email | midtrans_id |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Yopa | yopa@x.com | Laravel | 200000 | Budi | budi@x.com | OD-001 |
| 2 | Yopa | yopa@x.com | React | 150000 | Andi | andi@x.com | OD-001 |
| 3 | Andre | a@x.com | Laravel | 200000 | Budi | budi@x.com | OD-002 |

**Sudah atomik**, tapi masih redundan → lanjut ke 2NF.

---

## 3. Tahap 2NF — Hilangkan Partial Dependency

**Aturan 2NF:**
- Sudah 1NF.
- Setiap atribut non-key **bergantung PENUH** pada primary key.
- (Berlaku kalau primary key composite. Karena kita pakai surrogate `id`, partial dependency dideteksi via candidate key.)

### 🔍 Analisis Dependensi

- `user_email` bergantung pada `user` → bukan pada `id transaksi`
- `course_price` bergantung pada `course` → bukan pada `id transaksi`
- `instructor_email` bergantung pada `instructor` → bukan pada `id transaksi`

### ✅ Hasil setelah 2NF — Pisah jadi beberapa tabel

```
users (id, name, email)
courses (id, title, price, instructor_id)
orders (id, user_id, course_id, midtrans_id)
```

Sekarang setiap kolom non-key bergantung penuh pada PK tabelnya.

---

## 4. Tahap 3NF — Hilangkan Transitive Dependency

**Aturan 3NF:**
- Sudah 2NF.
- Tidak ada atribut non-key yang bergantung ke atribut non-key lain.
- (Atribut non-key hanya boleh bergantung ke PRIMARY KEY.)

### 🔍 Contoh Transitive Dependency yang Diperbaiki

Sebelum 3NF — di `courses`:

```
courses (id, title, category_name, category_description)
```

`category_description` bergantung pada `category_name`, bukan pada `id course`. → **Transitive dependency!**

### ✅ Hasil setelah 3NF — Buat tabel `categories` terpisah

```
categories (id, name, slug, description, image_url)
courses (id, title, category_id, ...)
        FOREIGN KEY (category_id) → categories(id)
```

---

## 5. Penerapan 3NF di Skema BelajarKUY

| Bagian | Bagaimana 3NF Diterapkan |
| --- | --- |
| **Kategori** | `categories` ← `sub_categories` ← `courses`. Tidak ada nama kategori yang diduplikasi di kursus. |
| **Instruktur** | Disimpan sebagai `users.id` dengan `role='instructor'`. Di `courses` hanya simpan `instructor_id`, bukan duplikasi nama/email. |
| **Order** | `payments` (header) ← `orders` (line item) → `courses`. Tidak ada title kursus yang diduplikasi di order. |
| **Coupon** | `orders.coupon_id` saja yang disimpan; `discount_percent` & `code` ada di `coupons`. |
| **Lecture & Section** | `course_lectures.section_id` → `course_sections.course_id` → `courses.id`. Hierarki bersih, tidak ada redundansi. |
| **Snapshot Harga** | Di `orders`, `original_price` & `final_price` **memang disimpan** (bukan duplikasi!), karena harga kursus bisa berubah. Ini disebut **historical denormalization** yang **diperbolehkan** untuk audit trail. |

---

## 6. Tabel Verifikasi 3NF — Per Tabel Inti

| Tabel | Primary Key | Atribut Non-Key | Cek 3NF |
| --- | --- | --- | --- |
| `users` | id | name, email, role, photo, phone, address, bio, website | ✅ semua bergantung pada `id` |
| `categories` | id | name, slug, image_url, description, status | ✅ |
| `sub_categories` | id | category_id, name, slug | ✅ (`category_id` FK, bukan transitive) |
| `courses` | id | title, slug, price, category_id, subcategory_id, instructor_id, ... | ✅ semua FK & atribut langsung |
| `course_sections` | id | course_id, title, sort_order | ✅ |
| `course_lectures` | id | section_id, title, url, content, duration | ✅ |
| `payments` | id | user_id, midtrans_order_id, total_amount, status | ✅ |
| `orders` | id | payment_id, user_id, course_id, instructor_id, coupon_id, original_price, final_price, status | ✅ (harga = snapshot, diperbolehkan) |
| `enrollments` | id | user_id, course_id, order_id, enrolled_at | ✅ |
| `reviews` | id | user_id, course_id, rating, comment, status | ✅ |

---

## 7. Pengecualian: Denormalisasi yang Disengaja

Kadang kita SENGAJA tidak mengikuti 3NF demi performa/audit:

| Kolom | Alasan Disimpan (meski "redundan") |
| --- | --- |
| `orders.original_price` | Snapshot harga saat transaksi (kursus bisa naik harga) |
| `orders.final_price` | Snapshot harga setelah diskon (untuk laporan keuangan) |
| `payments.midtrans_response` (JSON) | Audit trail respon Midtrans untuk dispute |
| `coupons.used_count` | Counter ter-cache, lebih cepat dari `COUNT()` ke `orders` |

Ini disebut **controlled denormalization** dan **TIDAK melanggar 3NF** karena kolom-kolom ini secara semantik **berbeda** dari kolom asalnya (mereka "snapshot in time", bukan duplikat).

---

## ✅ Kesimpulan Normalisasi

```
   UNNORMALIZED (1 tabel besar berisi segala)
        │
        ▼  [pecah kolom berulang, buat atomik]
       1NF
        │
        ▼  [pisah berdasarkan dependensi penuh]
       2NF
        │
        ▼  [pisah tabel referensi (category, instructor, ...)]
       3NF  ← BelajarKUY berada di level ini ✅
```

Database BelajarKUY = **3NF** dengan **controlled denormalization** pada kolom-kolom snapshot historis. Ini adalah praktik yang **direkomendasikan** untuk sistem produksi karena menyeimbangkan **integritas data** dan **performa query**.

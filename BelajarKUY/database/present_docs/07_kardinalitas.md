# 07 — Kardinalitas & Hubungan Antar Tabel

> **Tujuan:** Menjelaskan **jenis relasi** (1:1, 1:N, M:N) antar tabel dan **kardinalitas detailnya** untuk setiap pasangan tabel di BelajarKUY.

---

## 📚 Notasi yang Dipakai

| Notasi | Arti |
| --- | --- |
| **1:1** | One-to-One |
| **1:N** | One-to-Many |
| **M:N** | Many-to-Many (selalu butuh tabel perantara/junction) |
| `(1, 1)` | Wajib & tepat 1 |
| `(0, 1)` | Opsional & paling banyak 1 |
| `(1, N)` | Wajib & boleh banyak |
| `(0, N)` | Opsional & boleh banyak |

---

## 1. Peta Relasi (Helicopter View)

```
                       ┌──────────────┐
                       │    users     │── role: user/instructor/admin
                       └──────┬───────┘
                              │
        ┌───────────┬─────────┼──────────┬─────────────┬────────────┐
        │ 1:N       │ 1:N     │ 1:N      │ 1:N         │ 1:N        │ 1:N
        ▼           ▼         ▼          ▼             ▼            ▼
   wishlists    carts     reviews    payments      coupons       courses
        │           │         │          │             │            │
        ▼           ▼         ▼          ▼ 1:N         ▼            │
     courses     courses   courses     orders ◄──── coupons         │
                                       ┃ 1:N                        │
                                       ┃                            │
                                  enrollments                       │
                                       ▲                            │
                                       │                            │
        ┌──────────────┐               │                            ▼
        │  categories  │── 1:N ─►  courses  ◄── 1:N ── sub_categories
        └──────────────┘                                            │
                                                                    │
                                                                    ▼ 1:N
                                                          course_sections
                                                                    │ 1:N
                                                                    ▼
                                                          course_lectures
                                                                    │ 1:N
                                                                    ▼
                                                       lecture_completions
                                                                    ▲ 1:N
                                                                    │
                                                                  users

  Standalone (tidak relasi ke tabel lain):
    sliders   info_boxes   partners   site_infos
```

---

## 2. Detail Kardinalitas per Relasi

### 🔹 A. Kategori & Sub-Kategori

| Relasi | Tipe | Kardinalitas |
| --- | --- | --- |
| `categories` → `sub_categories` | **1:N** | 1 kategori memiliki `(0..N)` sub-kategori. 1 sub-kategori HARUS milik tepat 1 kategori. |
| `categories` → `courses` | **1:N** | 1 kategori bisa punya banyak kursus. 1 kursus WAJIB milik 1 kategori. |
| `sub_categories` → `courses` | **1:N** (opsional) | 1 sub-kategori bisa punya banyak kursus. 1 kursus boleh tanpa sub-kategori (`NULL`). |

```
categories  (1) ─────► (0..N) sub_categories
categories  (1) ─────► (0..N) courses
sub_categories (0..1) ◄────── (0..N) courses
```

---

### 🔹 B. Users & Courses

| Relasi | Tipe | Kardinalitas |
| --- | --- | --- |
| `users` → `courses` (sebagai instruktur) | **1:N** | 1 instruktur bisa membuat banyak kursus. 1 kursus dimiliki tepat 1 instruktur. |
| `users` ↔ `courses` via `wishlists` | **M:N** | 1 user menyimpan banyak kursus di wishlist; 1 kursus disimpan banyak user. |
| `users` ↔ `courses` via `carts` | **M:N** | Sama seperti wishlist. |
| `users` ↔ `courses` via `enrollments` | **M:N** | 1 user belajar banyak kursus; 1 kursus diikuti banyak user. UNIQUE per pasangan. |
| `users` ↔ `courses` via `reviews` | **M:N** | 1 user me-review banyak kursus; 1 kursus di-review banyak user. UNIQUE per pasangan. |

```
users (1) ────────────► (0..N) courses           [as instructor_id]

users (M) ◄── wishlists ──► (N) courses          [tabel junction]
users (M) ◄── carts ──────► (N) courses
users (M) ◄── enrollments ► (N) courses
users (M) ◄── reviews ────► (N) courses
```

---

### 🔹 C. Struktur Kursus Internal

| Relasi | Tipe | Kardinalitas |
| --- | --- | --- |
| `courses` → `course_goals` | **1:N** | 1 kursus punya banyak goal pembelajaran. |
| `courses` → `course_sections` | **1:N** | 1 kursus punya banyak section. |
| `course_sections` → `course_lectures` | **1:N** | 1 section punya banyak lecture. |

```
courses (1) ──► (1..N) course_goals
courses (1) ──► (1..N) course_sections
course_sections (1) ──► (1..N) course_lectures
```

---

### 🔹 D. Lecture Completion

| Relasi | Tipe | Kardinalitas |
| --- | --- | --- |
| `users` ↔ `course_lectures` via `lecture_completions` | **M:N** | 1 user menyelesaikan banyak lecture; 1 lecture diselesaikan banyak user. UNIQUE per pasangan. |

```
users (M) ◄── lecture_completions ──► (N) course_lectures
```

---

### 🔹 E. Transaksi (Payment ↔ Orders ↔ Enrollment)

| Relasi | Tipe | Kardinalitas |
| --- | --- | --- |
| `users` → `payments` | **1:N** | 1 user melakukan banyak pembayaran (lifetime). 1 payment milik 1 user. |
| `payments` → `orders` | **1:N** | 1 payment bisa terdiri dari banyak order (multi-kursus). 1 order milik 1 payment. |
| `users` → `orders` | **1:N** | 1 user punya banyak order. 1 order milik 1 pembeli. |
| `courses` → `orders` | **1:N** | 1 kursus terjual banyak kali. 1 order = 1 kursus. |
| `users` → `orders` (sebagai instruktur) | **1:N** | 1 instruktur dapat banyak order (komisi). |
| `coupons` → `orders` | **1:N** (opsional) | 1 kupon dipakai di banyak order (sampai `max_usage`). 1 order boleh tanpa kupon. |
| `orders` → `enrollments` | **1:1** | 1 order yang sukses → menghasilkan tepat 1 enrollment. |
| `users` → `enrollments` | **1:N** | 1 user enroll ke banyak kursus. |
| `courses` → `enrollments` | **1:N** | 1 kursus di-enroll banyak user. |

```
users (1) ──► (0..N) payments
payments (1) ─► (1..N) orders
orders (1) ──► (1..1) enrollments   ← 1:1 (1 order = 1 enrollment)
coupons (0..1) ◄──── (0..N) orders  ← opsional
```

---

### 🔹 F. Coupon

| Relasi | Tipe | Kardinalitas |
| --- | --- | --- |
| `users` → `coupons` (sebagai instruktur pemilik) | **1:N** | 1 instruktur bikin banyak kupon. |
| `courses` → `coupons` | **1:N** (opsional) | Kupon boleh terbatas ke 1 kursus, atau berlaku untuk semua kursus instruktur (`NULL`). |
| `coupons` → `orders` | **1:N** (opsional) | Lihat tabel E. |

---

### 🔹 G. CMS (Standalone)

`sliders`, `info_boxes`, `partners`, `site_infos` adalah tabel **mandiri** — tidak punya foreign key keluar/masuk. Mereka berdiri sendiri untuk kebutuhan tampilan homepage.

---

## 3. Ringkasan Matriks Relasi

| Tabel Sumber | Tabel Tujuan | Tipe | Wajib? | Cascade |
| --- | --- | --- | --- | --- |
| sub_categories | categories | N:1 | YA | ON DELETE CASCADE |
| courses | categories | N:1 | YA | ON DELETE CASCADE |
| courses | sub_categories | N:1 | TIDAK | ON DELETE SET NULL |
| courses | users (instructor) | N:1 | YA | ON DELETE CASCADE |
| course_goals | courses | N:1 | YA | ON DELETE CASCADE |
| course_sections | courses | N:1 | YA | ON DELETE CASCADE |
| course_lectures | course_sections | N:1 | YA | ON DELETE CASCADE |
| wishlists | users | N:1 | YA | ON DELETE CASCADE |
| wishlists | courses | N:1 | YA | ON DELETE CASCADE |
| carts | users | N:1 | YA | ON DELETE CASCADE |
| carts | courses | N:1 | YA | ON DELETE CASCADE |
| reviews | users | N:1 | YA | ON DELETE CASCADE |
| reviews | courses | N:1 | YA | ON DELETE CASCADE |
| coupons | users (instructor) | N:1 | YA | ON DELETE CASCADE |
| coupons | courses | N:1 | TIDAK | ON DELETE SET NULL |
| payments | users | N:1 | YA | ON DELETE CASCADE |
| orders | payments | N:1 | YA | ON DELETE CASCADE |
| orders | users (pembeli) | N:1 | YA | ON DELETE CASCADE |
| orders | courses | N:1 | YA | ON DELETE CASCADE |
| orders | users (instructor) | N:1 | YA | ON DELETE CASCADE |
| orders | coupons | N:1 | TIDAK | ON DELETE SET NULL |
| enrollments | users | N:1 | YA | ON DELETE CASCADE |
| enrollments | courses | N:1 | YA | ON DELETE CASCADE |
| enrollments | orders | N:1 | YA | ON DELETE CASCADE |
| lecture_completions | users | N:1 | YA | ON DELETE CASCADE |
| lecture_completions | course_lectures | N:1 | YA | ON DELETE CASCADE |

**Total relasi (foreign key): 22**

---

## 4. Tabel Junction (M:N) — Penting Diketahui

Setiap relasi M:N selalu dipecah menjadi 2 relasi 1:N via **tabel junction**:

| Tabel Junction | Menghubungkan | Atribut Khusus | Unique |
| --- | --- | --- | --- |
| `wishlists` | users ↔ courses | created_at | `(user_id, course_id)` |
| `carts` | users ↔ courses | created_at | `(user_id, course_id)` |
| `enrollments` | users ↔ courses | order_id, enrolled_at | `(user_id, course_id)` |
| `reviews` | users ↔ courses | rating, comment, status | `(user_id, course_id)` |
| `lecture_completions` | users ↔ course_lectures | completed_at | `(user_id, lecture_id)` |
| `orders` | payments + users + courses | harga snapshot, status | (tidak unique karena banyak order per payment) |

---

## 5. Contoh Pembacaan Relasi (untuk Presentasi)

> "Setiap **user** dapat memiliki banyak **payment** (1:N).
> Setiap **payment** terdiri dari satu atau lebih **order** (1:N) — karena user bisa beli beberapa kursus sekaligus.
> Setiap **order yang completed** menghasilkan tepat satu **enrollment** (1:1).
> Setiap **enrollment** memberi akses ke satu **course** (N:1).
> User dapat menyelesaikan setiap **lecture** dalam course tersebut, yang dicatat di **lecture_completions** (M:N antara user dan lecture)."

---

## ✅ Kesimpulan Kardinalitas

Database BelajarKUY memiliki:
- **22 relasi foreign key**
- **5 tabel junction (M:N)**: wishlists, carts, enrollments, reviews, lecture_completions
- **1 relasi 1:1** (orders → enrollments, dijaga via UNIQUE)
- **Sisanya 1:N** (hubungan parent-child)
- **0 tabel orphan** kecuali CMS (yang memang by-design standalone)

Hubungan ini **menjamin integritas data**: tidak ada order tanpa payment, tidak ada enrollment tanpa order, tidak ada review dari user yang tidak terdaftar — semua diatur via FK constraint.

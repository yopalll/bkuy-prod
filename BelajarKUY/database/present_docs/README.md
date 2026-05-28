# Presentasi Sistem Basis Data — BelajarKUY

> Dokumentasi presentasi mata kuliah **Sistem Basis Data**
> Studi kasus: **BelajarKUY** — Platform Marketplace Kursus Online

---

## 📌 Ringkasan Proyek

**BelajarKUY** adalah platform marketplace kursus online yang menghubungkan tiga aktor utama:

| Aktor | Peran |
| --- | --- |
| **Student (user)** | Membeli & mengikuti kursus, memberi review, melacak progres belajar |
| **Instructor** | Membuat & menjual kursus, membuat kupon diskon, melihat penjualan |
| **Admin** | Mengelola kategori, CMS (slider/partner/info box), moderasi review |

Sistem ini menangani end-to-end: katalog kursus → keranjang/wishlist → pembayaran Midtrans → enrollment otomatis → tracking penyelesaian materi → review.

**Tech stack:** Laravel 11 · MySQL/SQLite · Midtrans · Cloudinary

---

## 📂 Daftar Dokumen Presentasi

Urutkan slide presentasi mengikuti nomor file berikut:

| # | File | Materi yang Dijawab |
| --- | --- | --- |
| 01 | [01_analisis_kebutuhan.md](01_analisis_kebutuhan.md) | Menganalisis kebutuhan data suatu sistem |
| 02 | [02_perancangan_database.md](02_perancangan_database.md) | Membuat perancangan basis data yang baik |
| 03 | [03_erd.md](03_erd.md) | Membuat ERD (lengkap dengan script ChartDB) |
| 04 | [04_normalisasi.md](04_normalisasi.md) | Melakukan normalisasi (1NF → 2NF → 3NF) |
| 05 | [05_implementasi_mysql.md](05_implementasi_mysql.md) | Mengimplementasikan database di MySQL |
| 06 | [06_query.md](06_query.md) | Membuat query SQL (CRUD, JOIN, agregasi) |
| 07 | [07_kardinalitas.md](07_kardinalitas.md) | Menjelaskan hubungan antar tabel |
| 08 | [08_masalah_nyata.md](08_masalah_nyata.md) | Menyelesaikan masalah nyata menggunakan database |

---

## 🎯 Statistik Database

- **Total tabel inti:** 19 tabel
- **Total relasi (foreign key):** 22 relasi
- **Bentuk normal yang dicapai:** **3NF (Third Normal Form)**
- **Engine:** InnoDB · **Charset:** utf8mb4_unicode_ci

### Pengelompokan tabel

```
┌─ User Management ──── users, password_reset_tokens, sessions
├─ Katalog Kursus ───── categories, sub_categories, courses,
│                        course_goals, course_sections, course_lectures
├─ Interaksi User ───── wishlists, carts, reviews
├─ Transaksi ────────── coupons, payments, orders, enrollments
├─ Progress Belajar ─── lecture_completions
└─ CMS / Konten ─────── sliders, info_boxes, partners, site_infos
```

---

## 🚀 Cara Membuat ERD di ChartDB.io

1. Buka <https://app.chartdb.io>
2. Klik **New Diagram** → **Import your Database**
3. Pilih **MySQL** edition: **Regular** (atau langsung gunakan tab **DBML** kalau ingin lebih cepat)
4. Pilih tab **SQL Script** atau **DBML**
5. **Copy seluruh isi script** dari file [03_erd.md](03_erd.md) (bagian "Script untuk ChartDB")
6. Paste ke kolom **Smart Query Output** (atau langsung ke DBML editor)
7. Klik **Import** → ERD akan otomatis ter-generate dengan semua tabel & relasi
8. Atur layout (drag-drop), lalu **Export → PNG/SVG** untuk slide presentasi

---

## 🗣️ Tips Presentasi (durasi ±15 menit)

| Menit | Slide | Fokus pembicaraan |
| --- | --- | --- |
| 0–2 | README + 01 | Perkenalan sistem, siapa user-nya, masalah yang diselesaikan |
| 2–4 | 02 | Tunjukkan keputusan desain (kenapa pisah `payments` & `orders`, kenapa ada `enrollments`) |
| 4–7 | 03 | Tampilkan ERD dari ChartDB (full-screen), jelaskan cluster tabel |
| 7–9 | 04 | Contoh kasus normalisasi (sebelum vs sesudah) |
| 9–11 | 05 | Tunjukkan migration Laravel = DDL MySQL siap pakai |
| 11–13 | 06 | Demo 2–3 query (top-selling course, revenue per instructor) |
| 13–14 | 07 | Diagram kardinalitas (1:1, 1:N, M:N) |
| 14–15 | 08 | Closing: kasus nyata "user beli kursus" jadi end-to-end demo |

Selamat presentasi! 🎓

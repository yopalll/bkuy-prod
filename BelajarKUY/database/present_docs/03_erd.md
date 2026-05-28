# 03 — Entity Relationship Diagram (ERD)

> **Tujuan:** Memvisualisasikan **entitas, atribut, dan relasi** dalam database BelajarKUY.

---

## 1. Cara Membuat ERD di [app.chartdb.io](https://app.chartdb.io)

Karena database lokal kalian masih menggunakan **SQLite**, kalian tidak perlu menjalankan script "Smart Query" milik ChartDB yang minta koneksi langsung ke MySQL. Cukup ikuti langkah berikut:

### 🎯 Langkah Mudah (Pakai DBML — RECOMMENDED)

1. Buka <https://app.chartdb.io>
2. Klik **New Diagram** → pilih **Import your Database**
3. Database Edition: pilih **MySQL → Regular**
4. Pada bagian "**How would you like to import?**", klik tab **`<> DBML`**
5. **Copy SELURUH script DBML** di section [§ 2 Script DBML](#2-script-dbml-untuk-chartdb) di bawah
6. Paste ke editor DBML ChartDB
7. Klik tombol **Import** (pojok kanan bawah)
8. Tunggu ±2 detik → ERD muncul otomatis dengan semua tabel + relasi
9. Atur layout (drag-drop tabel agar rapi)
10. Klik **Actions → Export** → pilih **PNG** atau **SVG** untuk dimasukkan ke slide

### 🎯 Alternatif: Pakai SQL Script

1. Lakukan langkah 1–3 di atas
2. Pada langkah 4, pilih tab **`📄 SQL Script`**
3. Paste script di section [§ 3 Script SQL DDL](#3-script-sql-ddl-untuk-chartdb)
4. Lanjutkan langkah 7–10

---

## 2. Script DBML untuk ChartDB

> 📋 Copy mulai dari `// ===` di bawah sampai akhir blok, lalu paste ke tab DBML di ChartDB.

```dbml
// ============================================================
// BelajarKUY — Database Diagram
// ============================================================
Project BelajarKUY {
  database_type: 'MySQL'
  Note: 'Marketplace kursus online dengan peran user, instructor, admin.'
}

// ─── USER MANAGEMENT ────────────────────────────────────────
Table users {
  id bigint [pk, increment]
  name varchar(255) [not null]
  email varchar(255) [unique, not null]
  email_verified_at timestamp
  password varchar(255) [not null]
  role enum('user','instructor','admin') [default: 'user', not null]
  photo varchar(255)
  phone varchar(20)
  address text
  bio text
  website varchar(255)
  remember_token varchar(100)
  created_at timestamp
  updated_at timestamp

  Indexes {
    role
  }
}

Table password_reset_tokens {
  email varchar(255) [pk]
  token varchar(255) [not null]
  created_at timestamp
}

Table sessions {
  id varchar(255) [pk]
  user_id bigint [ref: > users.id]
  ip_address varchar(45)
  user_agent text
  payload longtext [not null]
  last_activity int [not null]
}

// ─── KATEGORI ───────────────────────────────────────────────
Table categories {
  id bigint [pk, increment]
  name varchar(255) [not null]
  slug varchar(255) [unique, not null]
  image_url varchar(255)
  image_public_id varchar(255)
  description text
  status boolean [default: true]
  created_at timestamp
  updated_at timestamp
}

Table sub_categories {
  id bigint [pk, increment]
  category_id bigint [not null, ref: > categories.id]
  name varchar(255) [not null]
  slug varchar(255) [unique, not null]
  created_at timestamp
  updated_at timestamp
}

// ─── KURSUS ─────────────────────────────────────────────────
Table courses {
  id bigint [pk, increment]
  category_id bigint [not null, ref: > categories.id]
  subcategory_id bigint [ref: > sub_categories.id]
  instructor_id bigint [not null, ref: > users.id]
  title varchar(255) [not null]
  slug varchar(255) [unique, not null]
  description text
  price decimal(12,2) [default: 0]
  discount tinyint [default: 0]
  thumbnail varchar(255)
  video_url varchar(255)
  duration varchar(50)
  bestseller boolean [default: false]
  featured boolean [default: false]
  status enum('draft','pending_review','active','inactive') [default: 'draft']
  created_at timestamp
  updated_at timestamp

  Indexes {
    (status, featured)
    (status, bestseller)
  }
}

Table course_goals {
  id bigint [pk, increment]
  course_id bigint [not null, ref: > courses.id]
  goal varchar(255) [not null]
  created_at timestamp
  updated_at timestamp
}

Table course_sections {
  id bigint [pk, increment]
  course_id bigint [not null, ref: > courses.id]
  title varchar(255) [not null]
  sort_order int [default: 0]
  created_at timestamp
  updated_at timestamp
}

Table course_lectures {
  id bigint [pk, increment]
  section_id bigint [not null, ref: > course_sections.id]
  title varchar(255) [not null]
  url varchar(500)
  content text
  duration varchar(50)
  sort_order int [default: 0]
  created_at timestamp
  updated_at timestamp
}

// ─── INTERAKSI USER ↔ KURSUS ────────────────────────────────
Table wishlists {
  id bigint [pk, increment]
  user_id bigint [not null, ref: > users.id]
  course_id bigint [not null, ref: > courses.id]
  created_at timestamp
  updated_at timestamp

  Indexes {
    (user_id, course_id) [unique]
  }
}

Table carts {
  id bigint [pk, increment]
  user_id bigint [not null, ref: > users.id]
  course_id bigint [not null, ref: > courses.id]
  created_at timestamp
  updated_at timestamp

  Indexes {
    (user_id, course_id) [unique]
  }
}

Table reviews {
  id bigint [pk, increment]
  user_id bigint [not null, ref: > users.id]
  course_id bigint [not null, ref: > courses.id]
  rating tinyint [not null, note: '1..5']
  comment text
  status varchar(255) [default: 'pending']
  created_at timestamp
  updated_at timestamp

  Indexes {
    (user_id, course_id) [unique]
  }
}

// ─── TRANSAKSI ──────────────────────────────────────────────
Table coupons {
  id bigint [pk, increment]
  instructor_id bigint [not null, ref: > users.id]
  course_id bigint [ref: > courses.id]
  code varchar(255) [unique, not null]
  discount_percent int [not null]
  valid_until date [not null]
  max_usage int
  used_count int [default: 0]
  status boolean [default: true]
  created_at timestamp
  updated_at timestamp
}

Table payments {
  id bigint [pk, increment]
  user_id bigint [not null, ref: > users.id]
  midtrans_order_id varchar(255) [unique, not null]
  midtrans_transaction_id varchar(255)
  payment_type varchar(50)
  total_amount decimal(12,2) [not null]
  status enum('pending','settlement','capture','deny','cancel','expire','failure','refund') [default: 'pending']
  midtrans_response json
  created_at timestamp
  updated_at timestamp

  Indexes {
    (user_id, status)
  }
}

Table orders {
  id bigint [pk, increment]
  payment_id bigint [not null, ref: > payments.id]
  user_id bigint [not null, ref: > users.id]
  course_id bigint [not null, ref: > courses.id]
  instructor_id bigint [not null, ref: > users.id]
  coupon_id bigint [ref: > coupons.id]
  original_price decimal(12,2) [not null]
  discount_amount decimal(12,2) [default: 0]
  final_price decimal(12,2) [not null]
  status enum('pending','completed','cancelled','refunded') [default: 'pending']
  created_at timestamp
  updated_at timestamp

  Indexes {
    (user_id, status)
    (instructor_id, status)
  }
}

Table enrollments {
  id bigint [pk, increment]
  user_id bigint [not null, ref: > users.id]
  course_id bigint [not null, ref: > courses.id]
  order_id bigint [not null, ref: > orders.id]
  enrolled_at timestamp

  Indexes {
    (user_id, course_id) [unique]
  }
}

// ─── PROGRESS BELAJAR ───────────────────────────────────────
Table lecture_completions {
  id bigint [pk, increment]
  user_id bigint [not null, ref: > users.id]
  lecture_id bigint [not null, ref: > course_lectures.id]
  completed_at timestamp

  Indexes {
    (user_id, lecture_id) [unique]
  }
}

// ─── CMS / KONTEN HALAMAN ───────────────────────────────────
Table sliders {
  id bigint [pk, increment]
  title varchar(255)
  sub_title varchar(255)
  link varchar(255)
  image_url text [not null]
  image_public_id varchar(255) [not null]
  status boolean [default: true]
  order_position int [default: 0]
  created_at timestamp
  updated_at timestamp
}

Table info_boxes {
  id bigint [pk, increment]
  title varchar(255) [not null]
  description text
  icon varchar(255)
  order_position int [default: 0]
  created_at timestamp
  updated_at timestamp
}

Table partners {
  id bigint [pk, increment]
  name varchar(255) [not null]
  link varchar(255)
  logo_url text [not null]
  logo_public_id varchar(255) [not null]
  order_position int [default: 0]
  created_at timestamp
  updated_at timestamp
}

Table site_infos {
  id bigint [pk, increment]
  key varchar(255) [unique, not null]
  value text
  created_at timestamp
  updated_at timestamp
}
```

---

## 3. Script SQL DDL untuk ChartDB

> 📋 Gunakan ini kalau kalian memilih tab **`📄 SQL Script`** di ChartDB. Script ini juga **bisa langsung dijalankan di MySQL Workbench / phpMyAdmin** untuk membuat database asli.

```sql
-- ============================================================
-- BelajarKUY — Database Schema (MySQL 8.0+)
-- ============================================================
SET FOREIGN_KEY_CHECKS=0;

-- ─── USERS ──────────────────────────────────────────────────
CREATE TABLE users (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  email_verified_at TIMESTAMP NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('user','instructor','admin') NOT NULL DEFAULT 'user',
  photo VARCHAR(255) NULL,
  phone VARCHAR(20) NULL,
  address TEXT NULL,
  bio TEXT NULL,
  website VARCHAR(255) NULL,
  remember_token VARCHAR(100) NULL,
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL,
  INDEX users_role_index (role)
);

CREATE TABLE password_reset_tokens (
  email VARCHAR(255) PRIMARY KEY,
  token VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NULL
);

CREATE TABLE sessions (
  id VARCHAR(255) PRIMARY KEY,
  user_id BIGINT UNSIGNED NULL,
  ip_address VARCHAR(45) NULL,
  user_agent TEXT NULL,
  payload LONGTEXT NOT NULL,
  last_activity INT NOT NULL,
  INDEX sessions_user_id_index (user_id),
  INDEX sessions_last_activity_index (last_activity)
);

-- ─── CATEGORIES ─────────────────────────────────────────────
CREATE TABLE categories (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  image_url VARCHAR(255) NULL,
  image_public_id VARCHAR(255) NULL,
  description TEXT NULL,
  status TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL
);

CREATE TABLE sub_categories (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  category_id BIGINT UNSIGNED NOT NULL,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- ─── COURSES ────────────────────────────────────────────────
CREATE TABLE courses (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  category_id BIGINT UNSIGNED NOT NULL,
  subcategory_id BIGINT UNSIGNED NULL,
  instructor_id BIGINT UNSIGNED NOT NULL,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT NULL,
  price DECIMAL(12,2) NOT NULL DEFAULT 0,
  discount TINYINT UNSIGNED NOT NULL DEFAULT 0,
  thumbnail VARCHAR(255) NULL,
  video_url VARCHAR(255) NULL,
  duration VARCHAR(50) NULL,
  bestseller TINYINT(1) NOT NULL DEFAULT 0,
  featured TINYINT(1) NOT NULL DEFAULT 0,
  status ENUM('draft','pending_review','active','inactive') NOT NULL DEFAULT 'draft',
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL,
  INDEX courses_status_featured_index (status, featured),
  INDEX courses_status_bestseller_index (status, bestseller),
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
  FOREIGN KEY (subcategory_id) REFERENCES sub_categories(id) ON DELETE SET NULL,
  FOREIGN KEY (instructor_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE course_goals (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  course_id BIGINT UNSIGNED NOT NULL,
  goal VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

CREATE TABLE course_sections (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  course_id BIGINT UNSIGNED NOT NULL,
  title VARCHAR(255) NOT NULL,
  sort_order INT UNSIGNED NOT NULL DEFAULT 0,
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

CREATE TABLE course_lectures (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  section_id BIGINT UNSIGNED NOT NULL,
  title VARCHAR(255) NOT NULL,
  url VARCHAR(500) NULL,
  content TEXT NULL,
  duration VARCHAR(50) NULL,
  sort_order INT UNSIGNED NOT NULL DEFAULT 0,
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL,
  FOREIGN KEY (section_id) REFERENCES course_sections(id) ON DELETE CASCADE
);

-- ─── WISHLIST / CART / REVIEWS ──────────────────────────────
CREATE TABLE wishlists (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  course_id BIGINT UNSIGNED NOT NULL,
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL,
  UNIQUE KEY wishlists_user_course_unique (user_id, course_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

CREATE TABLE carts (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  course_id BIGINT UNSIGNED NOT NULL,
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL,
  UNIQUE KEY carts_user_course_unique (user_id, course_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

CREATE TABLE reviews (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  course_id BIGINT UNSIGNED NOT NULL,
  rating TINYINT UNSIGNED NOT NULL,
  comment TEXT NULL,
  status VARCHAR(255) NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL,
  UNIQUE KEY reviews_user_course_unique (user_id, course_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- ─── COUPONS / PAYMENTS / ORDERS / ENROLLMENTS ──────────────
CREATE TABLE coupons (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  instructor_id BIGINT UNSIGNED NOT NULL,
  course_id BIGINT UNSIGNED NULL,
  code VARCHAR(255) NOT NULL UNIQUE,
  discount_percent INT UNSIGNED NOT NULL,
  valid_until DATE NOT NULL,
  max_usage INT UNSIGNED NULL,
  used_count INT UNSIGNED NOT NULL DEFAULT 0,
  status TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL,
  FOREIGN KEY (instructor_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE SET NULL
);

CREATE TABLE payments (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  midtrans_order_id VARCHAR(255) NOT NULL UNIQUE,
  midtrans_transaction_id VARCHAR(255) NULL,
  payment_type VARCHAR(50) NULL,
  total_amount DECIMAL(12,2) NOT NULL,
  status ENUM('pending','settlement','capture','deny','cancel','expire','failure','refund') NOT NULL DEFAULT 'pending',
  midtrans_response JSON NULL,
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL,
  INDEX payments_user_status_index (user_id, status),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE orders (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  payment_id BIGINT UNSIGNED NOT NULL,
  user_id BIGINT UNSIGNED NOT NULL,
  course_id BIGINT UNSIGNED NOT NULL,
  instructor_id BIGINT UNSIGNED NOT NULL,
  coupon_id BIGINT UNSIGNED NULL,
  original_price DECIMAL(12,2) NOT NULL,
  discount_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
  final_price DECIMAL(12,2) NOT NULL,
  status ENUM('pending','completed','cancelled','refunded') NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL,
  INDEX orders_user_status_index (user_id, status),
  INDEX orders_instructor_status_index (instructor_id, status),
  FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  FOREIGN KEY (instructor_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE SET NULL
);

CREATE TABLE enrollments (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  course_id BIGINT UNSIGNED NOT NULL,
  order_id BIGINT UNSIGNED NOT NULL,
  enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY enrollments_user_course_unique (user_id, course_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

CREATE TABLE lecture_completions (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  lecture_id BIGINT UNSIGNED NOT NULL,
  completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY lecture_completions_user_lecture_unique (user_id, lecture_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (lecture_id) REFERENCES course_lectures(id) ON DELETE CASCADE
);

-- ─── CMS ────────────────────────────────────────────────────
CREATE TABLE sliders (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NULL,
  sub_title VARCHAR(255) NULL,
  link VARCHAR(255) NULL,
  image_url TEXT NOT NULL,
  image_public_id VARCHAR(255) NOT NULL,
  status TINYINT(1) NOT NULL DEFAULT 1,
  order_position INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL
);

CREATE TABLE info_boxes (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NULL,
  icon VARCHAR(255) NULL,
  order_position INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL
);

CREATE TABLE partners (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  link VARCHAR(255) NULL,
  logo_url TEXT NOT NULL,
  logo_public_id VARCHAR(255) NOT NULL,
  order_position INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL
);

CREATE TABLE site_infos (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `key` VARCHAR(255) NOT NULL UNIQUE,
  value TEXT NULL,
  created_at TIMESTAMP NULL,
  updated_at TIMESTAMP NULL
);

SET FOREIGN_KEY_CHECKS=1;
```

---

## 4. Gambaran ERD (Text Representation)

```
                       ┌──────────────┐
                       │   users      │◄─── role: user/instructor/admin
                       └──────┬───────┘
          ┌─────────┬─────────┼─────────┬──────────┬──────────┐
          │         │         │         │          │          │
          ▼         ▼         ▼         ▼          ▼          ▼
      wishlists  carts    reviews   payments   coupons    courses (as instructor)
          │         │         │         │          │          │
          │         │         │         ▼          ▼          ▼
          │         │         │      orders ◄─── coupons    course_goals
          │         │         │       │  │                    course_sections
          │         │         │       ▼  ▼                    └─► course_lectures
          ▼         ▼         ▼   enrollments                          │
       courses  courses   courses                                       ▼
                                                              lecture_completions
                                                                       ▲
                                                                       │ user_id
                                                                       │
                       ┌──────────────┐    ┌────────────────┐
                       │  categories  │◄───│ sub_categories │
                       └──────┬───────┘    └────────────────┘
                              │
                              ▼
                          courses

  CMS (standalone):  sliders   info_boxes   partners   site_infos
```

---

## 5. Catatan untuk Slide

- Setelah ERD ter-render di ChartDB, **screenshot** atau **export PNG/SVG**.
- Simpan hasil ekspor di folder ini sebagai `erd_chartdb.png`.
- Saat presentasi, **zoom ke cluster tabel** satu per satu (User → Course → Order → CMS) agar audience tidak bingung melihat full diagram langsung.

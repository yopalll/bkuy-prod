# 05 — Implementasi Database di MySQL

> **Tujuan:** Menunjukkan bahwa rancangan database **sudah bisa dieksekusi** di MySQL/MariaDB, baik via **migration Laravel** maupun **SQL DDL manual**.

---

## 1. Dua Cara Implementasi

| Cara | Cocok untuk | Tool |
| --- | --- | --- |
| **A. Migration Laravel** | Developer Laravel — version-controlled, dapat rollback | `php artisan migrate` |
| **B. SQL DDL Manual** | Mata kuliah basis data, DBA, atau import ke MySQL Workbench / phpMyAdmin | `mysql < schema.sql` |

---

## 2. Cara A — Migration Laravel (yang dipakai project ini)

Project BelajarKUY menggunakan **Laravel Migration** yang setara dengan SQL DDL. Setiap file di `database/migrations/` = satu perintah `CREATE TABLE` atau `ALTER TABLE`.

### 📁 Daftar Migration

```
database/migrations/
├── 0001_01_01_000000_create_users_table.php
├── 0001_01_01_000001_create_cache_table.php
├── 0001_01_01_000002_create_jobs_table.php
├── 2026_05_16_144829_create_categories_table.php
├── 2026_05_16_144829_create_sub_categories_table.php
├── 2026_05_16_144830_create_sliders_table.php
├── 2026_05_16_144831_create_info_boxes_table.php
├── 2026_05_16_144832_create_partners_table.php
├── 2026_05_16_144833_create_courses_table.php
├── 2026_05_16_144833_create_site_infos_table.php
├── 2026_05_16_144834_create_course_goals_table.php
├── 2026_05_16_144835_create_course_sections_table.php
├── 2026_05_16_144836_create_course_lectures_table.php
├── 2026_05_16_144837_create_wishlists_table.php
├── 2026_05_16_144838_create_carts_table.php
├── 2026_05_16_144839_create_coupons_table.php
├── 2026_05_16_144839_create_payments_table.php
├── 2026_05_16_144840_create_orders_table.php
├── 2026_05_16_144841_create_reviews_table.php
├── 2026_05_16_144842_create_enrollments_table.php
├── 2026_05_16_144843_create_lecture_completions_table.php
├── 2026_05_16_144857_add_columns_to_users_table.php
├── 2026_05_18_095356_add_cloudinary_fields_to_categories_table.php
├── 2026_05_18_123000_add_description_to_categories_table.php
├── 2026_05_18_150640_alter_sliders_table_for_cloudinary.php
├── 2026_05_18_151228_alter_info_boxes_table_for_pm.php
├── 2026_05_18_151230_alter_partners_table_for_pm.php
└── 2026_05_18_152310_alter_status_on_reviews_table.php
```

### 🔧 Contoh: Migration `courses` (mirror DDL MySQL)

```php
Schema::create('courses', function (Blueprint $table) {
    $table->id();                                                    // BIGINT UNSIGNED AUTO_INCREMENT PK
    $table->foreignId('category_id')->constrained('categories')      // FK ON DELETE CASCADE
          ->cascadeOnDelete();
    $table->foreignId('subcategory_id')->nullable()
          ->constrained('sub_categories')->nullOnDelete();           // FK ON DELETE SET NULL
    $table->foreignId('instructor_id')->constrained('users')
          ->cascadeOnDelete();
    $table->string('title');
    $table->string('slug')->unique();
    $table->text('description')->nullable();
    $table->decimal('price', 12, 2)->default(0);                     // DECIMAL(12,2)
    $table->unsignedTinyInteger('discount')->default(0);
    $table->string('thumbnail')->nullable();
    $table->string('video_url')->nullable();
    $table->string('duration', 50)->nullable();
    $table->boolean('bestseller')->default(false);
    $table->boolean('featured')->default(false);
    $table->enum('status', ['draft','pending_review','active','inactive'])
          ->default('draft');
    $table->timestamps();

    $table->index(['status', 'featured']);
    $table->index(['status', 'bestseller']);
});
```

### 🚀 Cara Menjalankan

```bash
# 1. Setup .env untuk MySQL
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=belajarkuy
DB_USERNAME=root
DB_PASSWORD=

# 2. Buat database
mysql -u root -e "CREATE DATABASE belajarkuy;"

# 3. Jalankan migration
php artisan migrate

# 4. Isi data dummy (optional)
php artisan db:seed
```

---

## 3. Cara B — SQL DDL Manual

> File DDL lengkap ada di [03_erd.md § 3 Script SQL DDL](03_erd.md#3-script-sql-ddl-untuk-chartdb).
> Bisa langsung di-import ke **MySQL Workbench**, **phpMyAdmin**, atau via command-line.

### 🚀 Cara Menjalankan

```bash
# 1. Buat database
mysql -u root -p
> CREATE DATABASE belajarkuy CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
> USE belajarkuy;

# 2. Jalankan script DDL (copy dari 03_erd.md)
# ... paste seluruh CREATE TABLE statement

# 3. Verifikasi
> SHOW TABLES;
+----------------------+
| Tables_in_belajarkuy |
+----------------------+
| carts                |
| categories           |
| course_goals         |
| course_lectures      |
| course_sections      |
| courses              |
| coupons              |
| enrollments          |
| info_boxes           |
| lecture_completions  |
| orders               |
| partners             |
| password_reset_tokens|
| payments             |
| reviews              |
| sessions             |
| site_infos           |
| sliders              |
| sub_categories       |
| users                |
+----------------------+
```

---

## 4. Konfigurasi MySQL yang Dipakai

| Setting | Nilai | Alasan |
| --- | --- | --- |
| **Engine** | `InnoDB` | Mendukung Foreign Key & transaksi ACID |
| **Charset** | `utf8mb4` | Bisa simpan emoji & karakter Unicode (mis. nama "I'lham") |
| **Collation** | `utf8mb4_unicode_ci` | Sorting/perbandingan case-insensitive |
| **SQL Mode** | `STRICT_TRANS_TABLES` | Tolak insert data yang melanggar tipe (mis. string ke kolom int) |
| **Timezone** | `Asia/Jakarta` (`+07:00`) | Sesuai waktu Indonesia |

### 🛠️ Contoh `my.cnf` / `my.ini`

```ini
[mysqld]
default-storage-engine = InnoDB
character-set-server = utf8mb4
collation-server = utf8mb4_unicode_ci
default-time-zone = '+07:00'
sql_mode = STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION
```

---

## 5. Sample DATA (Seeder)

Project punya beberapa seeder untuk testing:

| Seeder | Fungsi |
| --- | --- |
| `UserSeeder` | Buat admin + dummy instructor + dummy user |
| `CategorySeeder` | Buat kategori + sub-kategori |
| `CourseSeeder` | Buat kursus dengan section, lecture, goal |
| `CmsSeeder` | Isi slider, info_box, partner |
| `TransactionSeeder` | Buat payment + order + enrollment lengkap |
| `DatabaseSeeder` | Master — panggil semua seeder di atas |

```bash
# Jalankan semua seeder
php artisan db:seed

# Atau seeder tertentu
php artisan db:seed --class=CourseSeeder
```

---

## 6. Verifikasi Implementasi

Setelah migrasi sukses, jalankan query verifikasi:

```sql
-- 1. Cek jumlah tabel
SELECT COUNT(*) AS total_tabel
FROM information_schema.tables
WHERE table_schema = 'belajarkuy';
-- Expected: 20+ tabel (termasuk migrations, cache, jobs)

-- 2. Cek foreign key constraint
SELECT
  table_name, column_name, constraint_name,
  referenced_table_name, referenced_column_name
FROM information_schema.key_column_usage
WHERE referenced_table_schema = 'belajarkuy'
ORDER BY table_name;
-- Expected: 22 foreign key

-- 3. Cek index
SHOW INDEX FROM courses;
-- Expected: PRIMARY, courses_slug_unique, courses_status_featured_index,
--           courses_status_bestseller_index, dan FK index
```

---

## 7. Backup & Restore

```bash
# Backup
mysqldump -u root -p belajarkuy > belajarkuy_backup.sql

# Restore
mysql -u root -p belajarkuy < belajarkuy_backup.sql
```

---

## ✅ Kesimpulan Implementasi

Database BelajarKUY berhasil diimplementasi di MySQL dengan:
- ✅ **19 tabel inti** + 3 tabel Laravel system (migrations, cache, jobs)
- ✅ **22 foreign key** dengan policy `CASCADE`/`SET NULL` yang tepat
- ✅ **15+ index** (PRIMARY, UNIQUE, composite) untuk performa query
- ✅ **Migrasi version-controlled** — dapat di-rollback dengan `php artisan migrate:rollback`
- ✅ **Seeder lengkap** untuk data dummy testing

Hasil = database **siap digunakan production** dengan integritas data terjaga.

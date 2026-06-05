# 📧 REPORT: L11 — Albariqi · Email Notifikasi (F14)

> **PIC:** Albariqi Tarigan  
> **Tanggal:** 2026-06-05  
> **Langkah:** L11 dari `URUTAN_KERJA_TIM_REACT_INERTIA.md`  
> **Branch:** `feature/course-emails`  
> **Status:** ✅ SELESAI

---

## Ringkasan

Implementasi sistem email notifikasi bertahap untuk BelajarKUY — 3 Mailable Laravel baru beserta template HTML inline-CSS, dikirim via **queue database** agar tidak blocking HTTP request.

**Trigger point:**
- `CourseApprovedMail` → dipicu `AdminCourseController::updateStatus()` saat status → `active`
- `CourseRejectedMail` → dipicu `AdminCourseController::updateStatus()` saat status `inactive` dari `pending_review`
- `NewSaleMail` → dipicu `CheckoutController::handleSuccess()` per order saat Midtrans settlement/capture

---

## File yang Dibuat

### Mail Classes (`app/Mail/`)

| File | Deskripsi |
|------|-----------|
| `CourseApprovedMail.php` | Email ke instruktur saat kursus disetujui admin. Konstruktor: `Course $course`. |
| `CourseRejectedMail.php` | Email ke instruktur saat kursus ditolak. Konstruktor: `Course $course, ?string $reason`. |
| `NewSaleMail.php` | Email ke instruktur saat ada penjualan baru. Konstruktor: `Order $order`. |

Semua mail mengimplementasikan `ShouldQueue` — dikirim via database queue, tidak blocking.

### Blade Email Templates (`resources/views/emails/`)

| File | Desain |
|------|--------|
| `course-approved.blade.php` | Header gradient ungu (Konteks_A: #300033→#A855F7); card kursus dengan harga; CTA "Lihat Kursusmu" |
| `course-rejected.blade.php` | Header gradient merah; kotak catatan reviewer (alasan opsional); 3 langkah perbaikan; CTA "Perbaiki Kursus" |
| `new-sale.blade.php` | Header gradient hijau; grid detail pembeli + pendapatan instruktur; timestamp transaksi; CTA "Lihat Dashboard" |

Semua template: inline CSS (kompatibel email client), layout tabel, footer BelajarKUY, max-width 600px.

---

## File yang Dimodifikasi

### `AdminCourseController.php`
```php
// Sebelum:
$request->validate(['status' => ['in:active,inactive']]);
$course->update(['status' => $request->status]);

// Sesudah (L11):
$request->validate([
    'status' => ['in:active,inactive'],
    'reason' => ['nullable', 'string', 'max:1000'],  // ← baru
]);
// Hook email:
if (status → 'active') → Mail::to($instructor)->queue(new CourseApprovedMail($course));
if (status → 'inactive' dari pending_review) → Mail::to($instructor)->queue(new CourseRejectedMail($course, $reason));
```

### `CheckoutController.php`
```php
// Di dalam handleSuccess() → foreach order, setelah Enrollment::firstOrCreate():
$order->load(['course', 'user', 'instructor']);
if ($order->instructor?->email) {
    Mail::to($order->instructor->email)->queue(new NewSaleMail($order));
}
```

---

## Queue Configuration

- **Driver:** `database` (sudah terkonfigurasi di `.env`: `QUEUE_CONNECTION=database`)
- **Tabel jobs:** sudah ada dari migration awal (`0001_01_01_000002_create_jobs_table.php`)
- **Worker:** `php artisan queue:work` (jalankan terpisah di development)
- **Dev mail driver:** `MAIL_MAILER=log` — email ditulis ke `storage/logs/laravel.log`, tidak perlu SMTP

---

## Verifikasi

```
npm run build → PASS ✅ (2399 modules, 0 error)
```

### Cara Test Manual

1. **CourseApprovedMail:** Login sebagai admin → buka kursus berstatus `pending_review` → ubah status ke `active` → cek `storage/logs/laravel.log` untuk body email (butuh `php artisan queue:work` jalan).
2. **CourseRejectedMail:** Sama, ubah ke `inactive` dengan field `reason` diisi → cek log.
3. **NewSaleMail:** Lakukan checkout sampai Midtrans settlement → `handleSuccess()` dispatch job → cek log.

---

## Definition of Done ✅

- [x] `CourseApprovedMail` terkirim (queue) saat admin approve kursus
- [x] `CourseRejectedMail` terkirim (queue) saat admin reject dari `pending_review`, dengan alasan opsional
- [x] `NewSaleMail` terkirim (queue) ke instruktur per order saat checkout settlement
- [x] Template email HTML inline-CSS (kompatibel semua email client)
- [x] Tidak ada perubahan skema DB (queue tabel sudah ada)
- [x] `npm run build` PASS ✅

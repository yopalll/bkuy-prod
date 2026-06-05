# 📋 Report Session 14 — L9: Checkout + Midtrans + Enrollment

**Tanggal:** 5 Juni 2026  
**Dikerjakan oleh:** Yosua Valentino (guloyosua@gmail.com)  
**Co-author:** Ray Nathan  
**Branch:** `feature/payment-midtrans`  
**Status:** ✅ SELESAI — TONGGAK KUNCI L9 terpenuhi

---

## Ringkasan

L9 adalah milestone kritis yang membuka dua pekerjaan paralel Albariqi: **L10 Course Player** (butuh Enrollment) dan **L11 Email notifikasi** (dipicu callback Midtrans). Seluruh alur checkout end-to-end selesai hari ini.

---

## File yang Diubah/Dibuat

### Backend (Diubah)

| File | Perubahan |
|------|-----------|
| `app/Http/Controllers/Frontend/CheckoutController.php` | Ganti semua `view()` → `Inertia::render()`. Method: `index()`, `process()`, `success()`, `failed()`. `success()` juga load orders dengan course. |
| `bootstrap/app.php` | CSRF exclusion `/payment/callback` via `validateCsrfTokens(except: [...])` |
| `routes/web.php` | Import `CheckoutController`. Ganti 4 closure placeholder checkout/payment → controller. Tambah `POST /payment/callback` → `CheckoutController@callback` (tanpa auth). |

### Frontend React (Baru)

| File | Deskripsi |
|------|-----------|
| `resources/js/Pages/Checkout/Index.jsx` | Halaman checkout full. Header transaksional (brand + secure lock). Layout 12-col: kiri (akun info + order summary + coupon input), kanan sticky (payment methods info + total + tombol bayar). Desain dari `checkout_pesanan/code.html` (Vascha, Konteks_A). |
| `resources/js/Pages/Checkout/Process.jsx` | Halaman perantara. Load Midtrans Snap JS sandbox via `useEffect`. Auto-trigger `snap.pay(token)`. Callbacks: success/pending → `/payment/success`, error → `/payment/failed`, close → `/checkout`. Tampilan loading spinner branded. |
| `resources/js/Pages/Payment/Success.jsx` | Halaman sukses. Animasi ping + CheckCircle icon. Glassmorphism card. Blur blob dekoratif. Order details (nomor, metode, total). Daftar kursus dibeli. CTA: "Mulai Belajar" → `/student/my-courses`, "Dashboard" → `/student/dashboard`. Desain dari `pembayaran_berhasil/code.html` (Quinsha). |
| `resources/js/Pages/Payment/Failed.jsx` | Halaman gagal. Red accent bar di top card. XCircle icon di error-container background. Penjelasan kemungkinan gagal. CTA: "Coba Lagi" → `/checkout`, "Kembali ke Keranjang" → `/cart`. Desain dari `pembayaran_gagal/code.html` (Quinsha). |

---

## Alur Pembayaran (End-to-End)

```
Pengguna klik "Lanjut ke Checkout" di Cart
    ↓
GET /checkout → CheckoutController@index → Inertia::render('Checkout/Index')
    ↓
Pengguna klik "Bayar Sekarang"
    ↓
POST /checkout/process → CheckoutController@process
    - Buat Payment record (status: pending)
    - Minta Snap token via MidtransService
    - Inertia::render('Checkout/Process', {snapToken, clientKey})
    ↓
Checkout/Process.jsx auto-load snap.js + panggil snap.pay(token)
    ↓
Midtrans Snap popup muncul
    ↓
Pengguna bayar (GoPay/VA/CC/dll)
    ↓
Snap onSuccess/onPending → redirect /payment/success?order_id=BKUY-xxx
Snap onError → redirect /payment/failed
Snap onClose → redirect /checkout
    ↓
Midtrans server kirim POST /payment/callback (webhook, CSRF-exempt)
    ↓
CheckoutController@callback:
    - Parse Notification via MidtransService
    - Update Payment status
    - Jika settlement/capture+accept → handleSuccess():
        - Update Payment status 'settlement'
        - Buat Order per kursus
        - Buat Enrollment (firstOrCreate — idempoten)
        - Increment coupon used_count
        - Clear Cart
    - Return JSON 200
    ↓
Payment/Success.jsx tampil dengan order details + kursus dibeli
```

---

## Design Tokens yang Dipakai

| Token | Nilai | Penggunaan |
|-------|-------|------------|
| `primary` | `#300033` | Teks heading, border aktif |
| `secondary-container` | `#ffb145` | Tombol "Bayar Sekarang" |
| `success` | `#2D8A56` | Icon success, text diskon |
| `error` | `#D91E18` | Accent bar failed page, icon error |
| `surface` | `#FFFFFF` | Card background |
| `background` | `#fcf9f8` | Page background |
| Font | `Plus Jakarta Sans` | Semua teks |

---

## Build Result

```
✓ 2398 modules transformed
✓ built in 1.52s
✓ 0 errors
```

---

## DoD Checklist

- [x] Checkout page tampil React dengan data asli (cart items + kupon)
- [x] Klik "Bayar Sekarang" → POST checkout/process → Snap popup
- [x] Snap onSuccess → redirect /payment/success
- [x] Snap onError/onClose → redirect /payment/failed atau kembali ke checkout
- [x] POST /payment/callback → handler update status + create Order + Enrollment
- [x] Idempoten: `Enrollment::firstOrCreate` mencegah duplikasi
- [x] is_production = false (ADR-004) — hardcoded di MidtransService
- [x] CSRF exclusion `/payment/callback` — Midtrans tidak bisa kirim CSRF token
- [x] Skema DB tidak berubah
- [x] npm run build sukses (0 error)
- [x] Design mengikuti BelajarKuy_Design_Revisi (bukan desain baru)

---

## Next Steps untuk Tim

> **Kabari Albariqi:** L9 ✅ SELESAI. Albariqi bisa mulai:
> - **L10 Course Player** — butuh tabel `enrollments` untuk guard akses
> - **L11 Email notifikasi** — `NewSale` dipicu saat `handleSuccess()` di callback

> **Testing lokal:** Pasang ngrok untuk expose `/payment/callback` ke Midtrans sandbox. Set Notification URL di [Midtrans Dashboard Sandbox](https://dashboard.sandbox.midtrans.com) → Settings → Configuration.

---

*Report dibuat oleh Antigravity (AI Agent) untuk Yosua Valentino*

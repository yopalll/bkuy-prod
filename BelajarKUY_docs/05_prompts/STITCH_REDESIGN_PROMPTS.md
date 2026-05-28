# 🎨 Google Stitch — Naskah Prompt Redesign Total BelajarKUY

> Tujuan dokumen: kumpulan **prompt siap-tempel** untuk [Google Stitch](https://stitch.withgoogle.com) yang mendesain ulang (redesign total) seluruh halaman BelajarKUY.
> **Prinsip utama:** output desain Stitch **wajib selaras dengan atribut nyata proyek** — token warna Tailwind, font, komponen, struktur data (field DB), penamaan peran, dan copy Bahasa Indonesia.
> **Sumber atribut:** `tailwind.config.js`, `resources/views/**`, `02_architecture/DATABASE_SCHEMA.md`, `01_guides/UI_UX_GUIDELINES.md`, `PRD_BelajarKUY.md`.
> **Versi:** 1.0 | **Dibuat:** 28 Mei 2026

---

## 0. Cara Pakai Dokumen Ini

Google Stitch mendesain **satu layar per prompt** (mode Standard untuk iterasi cepat, Experimental untuk hasil lebih kaya). Alur kerja:

1. **Tempel dulu "PROMPT FONDASI" (Bagian 2)** sebagai pesan pertama / project context. Ini mengunci design system (warna, font, komponen, bahasa). Stitch akan mengingatnya dalam sesi.
2. Untuk tiap layar, **tempel prompt layar terkait** dari Bagian 4. Setiap prompt sudah self-contained (menyebut warna, layout, konten data nyata, state, responsif).
3. Iterasi dengan kalimat singkat ("buat hero lebih tinggi", "ganti grid jadi 3 kolom", "tambah dark mode").
4. **Export** → "Copy code" / "Paste to Figma". Lalu konversi ke Blade + Tailwind sesuai `UI_UX_GUIDELINES.md` (Layouts → Components → utility classes → Alpine.js untuk interaktif).

> ⚠️ Stitch tidak terhubung ke DB. Semua angka/teks di mockup hanya placeholder; saat implementasi, ganti dengan data dari model (Cloudinary URL, Eloquent). Jangan hardcode gambar di Blade.

> 💡 Tips kualitas: sebut **platform**, **bahasa**, **warna hex**, **nama font**, **gaya komponen (radius, shadow)**, dan **konten konkret** di tiap prompt. Stitch lebih akurat saat diberi detail spesifik daripada instruksi umum.

---

## 1. Dua Konteks Desain (PENTING)

Proyek punya **dua bahasa desain** yang harus dipertahankan terpisah:

| Konteks | Dipakai di | Identitas visual |
|---------|-----------|------------------|
| **A. Frontend & Student** (terang, energik) | Landing, katalog, detail, cart, checkout, auth, panel siswa, course player | Gradien **Indigo→Purple**, aksen **Amber/Orange**, font **Poppins**, kartu `rounded-3xl`, navbar glassmorphism, ikon Heroicons (outline) |
| **B. Panel Admin** (hangat, tenang, profesional) | Semua halaman `/admin/*` | Palet **krem + slate-blue** (`brand-*`), font **Inter**, sidebar terang, ikon Lucide, "KUY" oranye |

Gunakan **Bagian 2** untuk Konteks A dan **Bagian 3** untuk Konteks B sebagai fondasi sebelum mendesain layar di konteks tersebut.

---

## 2. PROMPT FONDASI — Konteks A (Frontend & Student)

```
Kamu adalah desainer UI senior. Buat design system untuk "BelajarKUY", sebuah marketplace kursus online (LMS) gaya Udemy untuk pasar INDONESIA. SEMUA teks UI dalam BAHASA INDONESIA. Mata uang Rupiah (format "Rp 1.299.000").

IDENTITAS VISUAL (wajib dipatuhi di semua layar):
- Warna primer: Indigo #4F46E5 (dan #2563EB), sering sebagai gradien dari Indigo-600 ke Purple-600 (#7C3AED). Logo "BelajarKUY" memakai teks gradien indigo→purple, kata "KUY" lebih tebal.
- Warna aksen / CTA sekunder: gradien Amber #F59E0B → Orange #F97316 (untuk badge "Bestseller" & highlight).
- Warna status: sukses/gratis Emerald #059669; wishlist/danger Red #EF4444; rating bintang Amber-400 #FBBF24.
- Netral: teks gray-900, sekunder gray-500/600, garis gray-100, latar putih + section gray-50. Section gelap memakai gray-950 (#030712) dengan teks terang.
- Font: "Poppins" (heading & body). Fallback sans-serif.
- Bentuk: kartu sangat membulat (border-radius 24px / rounded-3xl), tombol CTA pill (rounded-full), tombol ikon rounded-2xl. Border tipis abu (1px gray-100).
- Bayangan: lembut & halus (shadow-sm → hover shadow-xl). Hover kartu naik sedikit (translateY -6px) + thumbnail zoom halus.
- Ikon: gaya outline stroke 2px (Heroicons). Avatar bulat.
- Navbar: sticky, putih transparan dengan backdrop-blur (glassmorphism), tinggi 80px, border bawah tipis.
- Spasi lega, container max-width ~1280px (max-w-7xl), padding section besar.
- Animasi halus: transition 200–300ms, fade/scale untuk dropdown & modal.

GAYA: modern, bersih, ramah, profesional, terinspirasi Udemy tapi lebih membulat & lembut. Mobile-first & fully responsive (sertakan layout mobile dengan hamburger menu).

Konfirmasi kamu memahami design system ini. Selanjutnya aku akan minta desain layar satu per satu.
```

---

## 3. PROMPT FONDASI — Konteks B (Panel Admin)

```
Kamu adalah desainer UI senior. Buat design system untuk PANEL ADMIN "BelajarKUY" (dashboard internal pengelola platform LMS). Teks UI campuran Bahasa Indonesia + istilah teknis Inggris (mis. "Course Management", "Order Management"). Mata uang Rupiah.

IDENTITAS VISUAL (wajib):
- Palet HANGAT & TENANG (bukan indigo terang seperti frontend):
  - Latar halaman: abu kebiruan lembut #E2E8ED.
  - Kartu konten / topbar: krem #FDF6ED.
  - Sidebar: krem terang #F9F6F0.
  - Teks utama & ikon brand: slate gelap #2B3A4A.
  - Aksen aktif (menu terpilih, fokus): slate-blue #3B5973 (teks putih di atasnya).
  - Logo: "Belajar" slate gelap + "KUY" ORANYE (#EA580C). Subjudul "Admin Panel".
  - Status: emerald #10B981 (ok), rose #F43F5E (notifikasi), gradien amber→orange untuk kartu status.
- Font: "Inter".
- Bentuk: kartu rounded-3xl, item menu & input rounded-2xl. Border slate-200 tipis.
- Layout: SIDEBAR kiri tetap (lebar ~270px) + TOPBAR (tinggi 80px, search + bell + mail + profil) + area konten.
- Ikon: gaya Lucide (line icons).
- Item menu aktif: latar slate-blue #3B5973, teks putih, shadow lembut; non-aktif: teks slate gelap, hover bg slate-100.

GAYA: profesional, kalem, mudah dipindai, data-dense tapi rapi. Desktop-first (panel admin), tetap responsif.

Konfirmasi pemahaman. Aku akan minta desain layar admin satu per satu.
```

---

## 4. Prompt Per Layar

> Tempel fondasi yang sesuai (Bagian 2 untuk frontend/student, Bagian 3 untuk admin) **sebelum** prompt-prompt di bawah.

### 4.1 Landing Page / Beranda  *(Konteks A)*
```
Desain halaman LANDING "Beranda" BelajarKUY (desktop + mobile). Section dari atas ke bawah:
1) Navbar sticky glassmorphism: kiri logo "BelajarKUY" (ikon buku + teks gradien indigo→purple); tengah menu "Beranda", "Kategori" (dropdown), "Kursus" + search bar pill ("Cari kursus pemrograman, bisnis, desain..."); kanan ikon Wishlist (hati, badge merah), ikon Cart (badge indigo), tombol "Masuk" (teks) & "Daftar" (pill indigo). Mobile: hamburger.
2) HERO SLIDER: banner besar rounded-[2rem], rasio ~21:8, gambar gelap dengan overlay gradien gelap dari kiri, judul besar putih (gradien putih→indigo-100), deskripsi, tombol CTA pill indigo dengan panah, dot indicator di bawah.
3) INFO BOXES: 3 kartu putih rounded-3xl sejajar, tiap kartu ikon dalam kotak indigo-50 (academic-cap / user-group / clock), judul tebal + deskripsi pendek ("Materi Berkualitas", "Komunitas Aktif", "Akses Selamanya").
4) KATEGORI TERPOPULER: judul tengah "Kategori Terpopuler"; grid 4 kolom kartu kategori rounded-3xl tinggi ~176px, ikon dalam kotak indigo, nama kategori + "X Kursus", gambar latar samar.
5) KURSUS UNGGULAN: label pill "Pilihan Terbaik", judul "Kursus Unggulan"; grid 4 kolom Course Card.
6) KURSUS TERLARIS: label pill amber "Sangat Populer", judul "Kursus Terlaris"; grid 4 kolom Course Card.
7) PARTNER: baris logo partner grayscale.
8) FOOTER gelap (gray-950): 4 kolom (Brand+sosial media, Kategori Terpopuler, Navigasi Cepat, Hubungi Kami), garis bawah copyright + "Syarat & Ketentuan / Kebijakan Privasi".
Pakai palet & gaya dari design system. Bahasa Indonesia.
```

### 4.2 Course Card (komponen)  *(Konteks A)*
```
Desain KOMPONEN "Course Card" untuk BelajarKUY (tampilkan beberapa varian dalam grid). Struktur satu kartu (putih, rounded-3xl, border gray-100, hover naik + shadow-xl):
- Thumbnail rasio 16:9 di atas (zoom halus saat hover).
- Overlay kiri-atas: badge "Bestseller" (gradien amber→orange) dan/atau "Featured" (gradien indigo→purple), bentuk pill.
- Overlay kanan-atas: tombol bulat putih ikon hati (wishlist), hover jadi merah.
- Body (padding 24px): badge kategori kecil (teks indigo, bg indigo-50, uppercase) → judul kursus 2 baris (clamp) → baris instruktur (avatar bulat kecil + nama) → baris rating (5 bintang amber, angka rata-rata, "(jumlah) ulasan") → garis tipis → baris bawah: harga (jika diskon: harga asli dicoret + harga diskon indigo tebal; jika 0: "Gratis" hijau) di kiri, tombol ikon keranjang (kotak rounded-2xl indigo-50, hover jadi indigo penuh) di kanan.
Tampilkan 3 varian: (a) ada diskon + bestseller, (b) harga normal + featured, (c) Gratis. Bahasa Indonesia, Rupiah.
```

### 4.3 Katalog / Hasil Pencarian & Filter  *(Konteks A)*
```
Desain halaman KATALOG KURSUS / hasil pencarian BelajarKUY. Layout:
- Navbar sama seperti landing.
- Header hasil: judul 'Hasil Pencarian: "laravel"' (kata kunci indigo) atau 'Kategori: "Pemrograman"', subteks "Ditemukan 24 kursus yang cocok", + tombol pill "Kembali ke Beranda".
- SIDEBAR FILTER kiri (kartu putih rounded-3xl, sticky): Kategori (checkbox list), Rentang Harga (Gratis / Berbayar / slider), Rating minimum (bintang), Level. Tombol "Terapkan" & "Reset".
- KONTEN kanan: bar urutan ("Urutkan: Terpopuler / Terbaru / Harga"), grid Course Card 3 kolom (responsive 1/2/3), pagination pill di bawah.
- Sertakan EMPTY STATE: ikon wajah sedih dalam lingkaran indigo-50, judul "Maaf, Kursus Tidak Ditemukan", saran, tombol "Lihat Semua Kursus".
Palet & gaya design system. Bahasa Indonesia.
```

### 4.4 Detail Course  *(Konteks A)*
```
Desain halaman DETAIL COURSE BelajarKUY. Layout 2 kolom di desktop, 1 kolom di mobile:
- HERO atas (latar gelap/indigo gradien): breadcrumb, judul kursus besar, deskripsi singkat, baris meta (rating bintang + "(X ulasan)", "1.240 siswa", badge bestseller), baris instruktur (avatar + nama + "Instruktur").
- KOLOM KIRI (utama): video preview (player rounded-2xl). Lalu TAB: "Deskripsi", "Kurikulum", "Ulasan".
  - Tab "Apa yang akan kamu pelajari" (course goals): grid 2 kolom dengan ikon centang indigo.
  - Tab Kurikulum: accordion section (judul + jumlah lecture + durasi), expand → list lecture (ikon play, judul, durasi, tag "Preview" untuk yang gratis).
  - Tab Ulasan: ringkasan rating (angka besar + distribusi bintang) + daftar review (avatar, nama, bintang, tanggal, komentar) + form review (jika eligible).
- KOLOM KANAN (sticky card putih rounded-3xl, shadow): thumbnail/preview, harga (diskon dicoret + harga akhir indigo, badge "% OFF" oranye, hitung mundur opsional), tombol besar "Beli Sekarang" (pill indigo) & "Tambah ke Keranjang" (outline), tombol "Tambah ke Wishlist", lalu daftar fitur ("Akses selamanya", "Sertifikat", "X jam video", "Akses mobile") dengan ikon.
- Section bawah: "Kursus Terkait" grid Course Card.
Bahasa Indonesia, Rupiah. Gaya design system.
```

### 4.5 Keranjang (Cart)  *(Konteks A)*
```
Desain halaman KERANJANG (Cart) BelajarKUY. Layout 2 kolom:
- Kiri: judul "Keranjang Belanja" + "3 kursus", lalu daftar item. Tiap item kartu putih rounded-3xl: thumbnail kecil, judul kursus + instruktur + rating, harga (diskon), tombol "Hapus" (teks merah) & "Pindah ke Wishlist".
- Kanan: kartu ringkasan sticky "Ringkasan Pesanan": subtotal, input kode kupon (field + tombol "Terapkan"), diskon (jika ada, hijau), total besar indigo, tombol "Lanjut ke Pembayaran" (pill indigo full width), badge keamanan pembayaran (logo Midtrans/metode).
- Sertakan EMPTY STATE keranjang kosong: ilustrasi keranjang, "Keranjangmu masih kosong", tombol "Jelajahi Kursus".
Bahasa Indonesia, Rupiah. Gaya design system.
```

### 4.6 Checkout  *(Konteks A)*
```
Desain halaman CHECKOUT BelajarKUY. Layout 2 kolom:
- Kiri: "Detail Pembeli" (nama, email read-only dari akun), "Metode Pembayaran" via Midtrans Snap (kartu pilihan: Kartu Kredit, GoPay, Transfer Bank/VA, QRIS — tiap opsi ikon + radio, rounded-2xl).
- Kanan: "Ringkasan Pesanan" — daftar kursus ringkas (thumbnail + judul + harga), baris kupon diterapkan, subtotal, diskon, TOTAL besar, tombol "Bayar Sekarang" (pill indigo), catatan "Pembayaran aman diproses oleh Midtrans (Sandbox)".
- Tampilkan state loading kecil pada tombol.
Bahasa Indonesia, Rupiah. Gaya design system.
```

### 4.7 Pembayaran Berhasil & Gagal  *(Konteks A)*
```
Desain DUA layar hasil pembayaran BelajarKUY (tampilkan berdampingan):
A) BERHASIL: kartu tengah, ikon centang besar dalam lingkaran emerald, judul "Pembayaran Berhasil!", subteks "Kamu sudah terdaftar di kursus ini", ringkasan order (ID order, kursus, total), tombol "Mulai Belajar" (pill indigo) & "Lihat Kursus Saya".
B) GAGAL: ikon silang dalam lingkaran merah, judul "Pembayaran Gagal", subteks alasan, tombol "Coba Lagi" & "Kembali ke Keranjang".
Latar bersih, konfeti halus pada layar sukses (opsional). Bahasa Indonesia, Rupiah. Gaya design system.
```

### 4.8 Login & Register  *(Konteks A)*
```
Desain layar LOGIN dan REGISTER BelajarKUY (tampilkan keduanya). Layout split-screen di desktop:
- Panel kiri: ilustrasi/gradien indigo→purple dengan logo "BelajarKUY", tagline "Kuasai Skill Tech Masa Depanmu", beberapa highlight bullet.
- Panel kanan (kartu putih rounded-3xl): 
  - LOGIN: tombol besar "Masuk dengan Google" (putih, border, logo Google warna) di atas → divider "atau masuk dengan email" → field Email, Password, checkbox "Ingat saya" + link "Lupa password?", tombol "Masuk" (pill indigo), footer "Belum punya akun? Daftar sekarang".
  - REGISTER: tombol Google, divider, field Nama, Email, Password, Konfirmasi Password, (opsional pilih peran Siswa/Instruktur), tombol "Daftar", footer "Sudah punya akun? Masuk".
Bahasa Indonesia. Gaya design system. Mobile: satu kolom, ilustrasi jadi header kecil.
```

### 4.9 Lupa & Reset Password + Verifikasi Email  *(Konteks A)*
```
Desain 3 layar autentikasi pendukung BelajarKUY (kartu tengah, gaya konsisten dengan login):
1) "Lupa Password": teks instruksi, field Email, tombol "Kirim Tautan Reset".
2) "Reset Password": field Password baru + Konfirmasi, tombol "Setel Ulang Password".
3) "Verifikasi Email": ikon amplop, teks "Cek email untuk verifikasi", tombol "Kirim Ulang Email Verifikasi" + link logout.
Bahasa Indonesia. Gaya design system.
```

### 4.10 Login Admin (terpisah)  *(Konteks B)*
```
Desain halaman LOGIN ADMIN BelajarKUY (terpisah dari login user). Pakai palet ADMIN (krem + slate-blue, font Inter). Kartu login tengah di atas latar abu kebiruan #E2E8ED: logo "Belajar" + "KUY" oranye + label "Admin Panel", field Email & Password, tombol "Masuk sebagai Admin" (slate-blue #3B5973), catatan keamanan kecil. Profesional & kalem. Bahasa: campuran ID/EN.
```

### 4.11 Dashboard Siswa  *(Konteks A)*
```
Desain DASHBOARD SISWA BelajarKUY. Layout: navbar atas + 2 kolom (sidebar kiri + konten kanan).
- SIDEBAR kiri (kartu): kartu profil ringkas (foto bulat dengan ring gradien indigo→purple berputar pelan, nama, email, badge "Siswa BelajarKUY"), lalu menu rounded-2xl: Dashboard, Kursus Saya, Daftar Keinginan, Ubah Profil, Ubah Kata Sandi, Keluar (merah). Item aktif = bg indigo penuh teks putih.
- KONTEN: sapaan "Halo, {Nama} 👋", baris stat cards (Kursus Diikuti, Selesai, Jam Belajar, Sertifikat) rounded-3xl dengan ikon; "Lanjutkan Belajar" (kartu kursus dengan progress bar indigo + tombol "Lanjut"); "Rekomendasi untukmu" grid Course Card.
Bahasa Indonesia. Gaya design system.
```

### 4.12 Kursus Saya (My Courses)  *(Konteks A)*
```
Desain halaman "Kursus Saya" BelajarKUY (sidebar siswa + konten). Konten: judul "Kursus Saya", tab/filter ("Semua", "Sedang Berjalan", "Selesai"), grid kartu kursus-enrolled: thumbnail, judul, instruktur, PROGRESS BAR indigo + "{n}% selesai", tombol "Lanjut Belajar" (pill indigo). Sertakan empty state "Belum ada kursus — Jelajahi Kursus". Bahasa Indonesia. Gaya design system.
```

### 4.13 Wishlist (Daftar Keinginan)  *(Konteks A)*
```
Desain halaman "Daftar Keinginan" BelajarKUY (sidebar siswa + konten). Grid Course Card dengan tombol "Hapus dari Wishlist" (ikon hati terisi merah) dan "Tambah ke Keranjang". Empty state "Wishlist kosong". Bahasa Indonesia, Rupiah. Gaya design system.
```

### 4.14 Profil & Setting (Siswa)  *(Konteks A)*
```
Desain 2 layar pengaturan akun siswa BelajarKUY (sidebar siswa + konten):
1) "Ubah Profil": kartu form — foto profil (preview + tombol unggah ke Cloudinary), Nama, Email, No. Telepon, Alamat, Bio, Website; tombol "Simpan Perubahan" (indigo).
2) "Ubah Kata Sandi": Password lama, Password baru, Konfirmasi; tombol "Perbarui Password". Sertakan zona bahaya "Hapus Akun" (kartu border merah).
Bahasa Indonesia. Gaya design system.
```

### 4.15 Course Player (Watch Page) — CORE  *(Konteks A)*
```
Desain halaman COURSE PLAYER (halaman belajar) BelajarKUY — ini fitur inti LMS. Layout 2 kolom full-height:
- TOPBAR ramping: logo BelajarKUY + judul kursus + tombol kembali ke "Kursus Saya".
- KIRI (utama, lebar): VIDEO PLAYER besar (embed YouTube, rasio 16:9, rounded-2xl, latar hitam). Di bawahnya: judul lecture + durasi ("Lecture 3: Laravel Routing • 15:24"), tombol "✓ Tandai Selesai" (full width; indigo jika belum, hijau "Sudah Selesai" jika sudah). Lalu TAB: "Deskripsi", "Catatan", "Tanya". Isi tab deskripsi = teks materi.
- KANAN (sidebar, lebar ~384px, border kiri): blok progress (judul "Progress Belajar" + "{45}%" indigo + progress bar) lalu KURIKULUM accordion: tiap Section (judul, bisa expand) berisi list Lecture dengan ikon status — ✅ selesai (hijau), ▶ sedang diputar (indigo, baris ter-highlight bg indigo-50 + border kiri indigo), ⭕ belum (abu). Tiap lecture tampil judul + durasi.
- Sertakan state "Selamat, kamu sudah menyelesaikan kursus!" sebagai banner di atas video (varian opsional).
Fokus, bersih, minim distraksi. Bahasa Indonesia. Gaya design system.
```

### 4.16 Dashboard Instruktur  *(Konteks A — boleh varian lebih netral)*
```
Desain DASHBOARD INSTRUKTUR BelajarKUY. Layout: sidebar instruktur (menu: Dashboard, Kursus Saya, Sections, Lectures, Kupon, Penjualan, Profil, Setting) + konten.
- KONTEN: judul "Dashboard Instruktur", baris stat cards rounded-3xl (Total Kursus, Total Siswa, Pendapatan/Gross Revenue Rp, Rata-rata Rating) dengan ikon & tren kecil; grafik garis "Penjualan 30 Hari" (kartu); tabel "Kursus Terlaris" (thumbnail, judul, siswa, pendapatan, rating); daftar "Order Terbaru".
Catatan: TIDAK ADA fitur payout/penarikan dana (revenue hanya simulasi/reporting). Bahasa Indonesia, Rupiah. Gaya design system.
```

### 4.17 Instruktur — Buat/Edit Course (+ Section & Lecture)  *(Konteks A)*
```
Desain halaman BUAT/EDIT COURSE untuk instruktur BelajarKUY (form panjang, multi-section, sidebar instruktur). Bagian:
1) "Informasi Dasar": Judul, Slug (auto), Kategori (dropdown), Sub-kategori (dropdown), Deskripsi (rich text), Level, Bahasa.
2) "Harga & Promo": Harga (Rp), Diskon (%), toggle "Featured" & "Bestseller", Durasi total.
3) "Media": unggah Thumbnail (drag-drop ke Cloudinary, preview) + URL Video Preview (YouTube).
4) "Apa yang dipelajari" (Course Goals): list input dinamis (tambah/hapus baris).
5) "Kurikulum": daftar SECTION (kartu rounded-2xl, judul + drag handle + sort) yang berisi LECTURE (judul, URL video YouTube, durasi, konten teks, tombol hapus); tombol "Tambah Section" & "Tambah Lecture".
6) Bar bawah sticky: status kursus (Draft / Kirim untuk Review) + tombol "Simpan" (indigo) & "Pratinjau".
Form interaktif (Alpine.js style). Bahasa Indonesia, Rupiah. Gaya design system.
```

### 4.18 Instruktur — Kupon  *(Konteks A)*
```
Desain halaman KUPON instruktur BelajarKUY. Konten: tombol "Buat Kupon" + tabel kupon (Kode, Diskon %, Berlaku untuk (Semua/kursus tertentu), Berlaku sampai (tanggal), Terpakai/Maks, Status toggle aktif, aksi Edit/Hapus). Sertakan modal "Buat/Edit Kupon": field Kode, Diskon %, pilih Course (opsional = global), Valid sampai (date), Maks pemakaian (kosong = unlimited), toggle Status. Bahasa Indonesia. Gaya design system.
```

### 4.19 Dashboard Admin  *(Konteks B)*
```
Desain DASHBOARD ADMIN BelajarKUY dengan PALET ADMIN (krem + slate-blue, font Inter, ikon Lucide). Layout:
- SIDEBAR kiri 270px (krem #F9F6F0): logo "Belajar"+"KUY" oranye + "Admin Panel"; grup "Overview" dengan menu: Dashboard, Categories, Sub Categories, Sliders, Info Boxes, Partners, Course Management, Instructors, Order Management, User Management, Ulasan, Site Settings (item aktif = bg slate-blue #3B5973 teks putih, rounded-2xl). Di bawah: kartu "Platform Status" (gradien amber→orange, titik hijau "All systems running smoothly").
- TOPBAR (krem #FDF6ED, 80px): search "Search courses, users, orders..." rounded-2xl, ikon bell (titik rose), mail, profil (avatar inisial "Q" kotak rounded-2xl + "Quinsha / Administrator").
- KONTEN (latar #E2E8ED): baris stat cards rounded-3xl (Total Users, Total Courses, Total Orders, Gross Revenue Rp) dengan ikon Lucide; grafik "Transaksi" + "Pengguna Baru"; tabel "Order Terbaru" & "Course Menunggu Review" (dengan tombol Approve/Reject).
Profesional, kalem. Bahasa campuran ID/EN, Rupiah.
```

### 4.20 Admin — Tabel Manajemen Data (template CRUD)  *(Konteks B)*
```
Desain TEMPLATE halaman tabel CRUD untuk panel Admin BelajarKUY (palet admin krem + slate-blue, Inter, Lucide). Elemen umum:
- Header: judul halaman + breadcrumb + tombol primer "Tambah Baru" (slate-blue).
- Toolbar: search, filter dropdown, jumlah data.
- TABEL kartu rounded-3xl (bg krem): header kolom, baris zebra halus, kolom aksi (Edit ikon pensil, Hapus ikon trash rose), badge status (aktif=emerald, nonaktif=slate), pagination.
- Modal/Drawer "Tambah/Edit" dengan field & tombol "Simpan".
Tampilkan template ini terisi contoh untuk "Categories" (Nama, Slug, Gambar, Status, Jumlah Course, Aksi). Bahasa campuran ID/EN.
```

### 4.21 Admin — Manajemen Course / Order / Review / User (varian tabel)  *(Konteks B)*
```
Berdasarkan template tabel admin, desain 4 varian halaman BelajarKUY (palet admin):
1) "Course Management": kolom Thumbnail, Judul, Instruktur, Kategori, Harga, Status (draft/pending_review/active/inactive sebagai badge warna), Aksi (Lihat + ubah status Approve/Reject).
2) "Order Management": kolom ID Order (BKUY-...), Siswa, Kursus, Total (Rp), Metode, Status pembayaran (pending/settlement/.. badge), Tanggal, Lihat detail.
3) "Ulasan": kolom Siswa, Kursus, Rating (bintang), Komentar (truncate), Status (tampil/disembunyikan), Aksi Approve/Reject.
4) "User Management": kolom Avatar+Nama, Email, Role (badge), Tgl Daftar, Lihat (read-only — tidak ada block user).
Bahasa campuran ID/EN, Rupiah. Gaya admin.
```

### 4.22 Admin — Site Settings  *(Konteks B)*
```
Desain halaman SITE SETTINGS admin BelajarKUY (palet admin). Form berbasis tab/section: 
- "Identitas Situs": Nama Situs, Tentang Kami, Logo (unggah), copyright.
- "Kontak": Email, Telepon, Alamat.
- "Media Sosial": Facebook, Instagram, YouTube (URL).
Data berbentuk key–value (site_infos). Tombol "Simpan Pengaturan" (slate-blue). Bahasa campuran ID/EN. Gaya admin.
```

---

## 5. Checklist Konsistensi (sebelum approve hasil Stitch)

Validasi tiap mockup terhadap atribut proyek:

- [ ] **Warna** sesuai token: frontend = indigo #4F46E5/#2563EB + purple #7C3AED + aksen amber/orange; admin = krem #FDF6ED/#F9F6F0 + slate-blue #3B5973 + slate #2B3A4A.
- [ ] **Font** benar: frontend Poppins, admin Inter.
- [ ] **Radius & shadow**: kartu rounded-3xl, tombol pill/rounded-2xl, shadow lembut.
- [ ] **Bahasa**: copy frontend/student 100% Bahasa Indonesia; admin boleh campuran. Mata uang "Rp 1.234.567".
- [ ] **Logo** "BelajarKUY" (KUY ditebalkan / oranye di admin).
- [ ] **Komponen data nyata** muncul: Course Card punya kategori, instruktur, rating+jumlah ulasan, harga diskon dicoret, badge bestseller/featured.
- [ ] **Peran benar**: istilah "Siswa/Instruktur/Admin"; tidak menampilkan fitur out-of-scope (payout, block user, Midtrans production).
- [ ] **Course Player** memakai status lecture ✅/▶/⭕ + progress bar + accordion section.
- [ ] **Responsif**: ada layout mobile (navbar hamburger, grid menyusut).
- [ ] **Media**: placeholder gambar diposisikan untuk URL Cloudinary; video = embed YouTube.

---

## 6. Setelah Export dari Stitch → Implementasi Laravel

Ikuti `01_guides/UI_UX_GUIDELINES.md`:
1. Pecah jadi **Layout** (`layouts/app.blade.php`, `layouts/admin.blade.php`) + **Components** (`<x-navbar/>`, `<x-footer/>`, `<x-course-card/>`).
2. Terjemahkan ke **utility class Tailwind** (hindari custom CSS). Pastikan token di `tailwind.config.js` (`primary`, `secondary`, `brand-*`) dipakai, tambahkan token baru bila perlu agar warna Stitch match.
3. Interaktivitas (dropdown, accordion, modal, tab, slider, mark-complete) pakai **Alpine.js**, notifikasi pakai **SweetAlert2** — bukan jQuery.
4. Ganti semua data dummy dengan data Eloquent; gambar dari Cloudinary; video dari `course_lectures.url`.
5. Jaga **dua konteks desain** tetap konsisten dengan layout masing-masing (app vs admin).

---

*Naskah ini dirancang agar output Google Stitch langsung selaras dengan identitas & struktur data BelajarKUY, sehingga konversi ke Blade + Tailwind minim penyesuaian.*

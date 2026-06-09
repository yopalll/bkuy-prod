<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kursusmu Telah Disetujui — BelajarKUY</title>
</head>
<body style="margin:0; padding:0; background:#f4f1ee; font-family:'Segoe UI',Arial,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f1ee; padding: 40px 20px;">
    <tr>
        <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 24px rgba(0,0,0,0.08);">

                {{-- Header --}}
                <tr>
                    <td style="background: linear-gradient(135deg, #300033 0%, #6B21A8 60%, #A855F7 100%); padding: 40px 40px 32px;">
                        <p style="margin:0 0 8px; color:#F3E8FF; font-size:13px; letter-spacing:2px; text-transform:uppercase; font-weight:600;">BelajarKUY</p>
                        <h1 style="margin:0; color:#ffffff; font-size:26px; font-weight:700; line-height:1.3;">
                            🎉 Kursusmu Telah Disetujui!
                        </h1>
                        <p style="margin:12px 0 0; color:#E9D5FF; font-size:15px;">
                            Selamat, kursusmu kini sudah aktif dan dapat diakses siswa.
                        </p>
                    </td>
                </tr>

                {{-- Body --}}
                <tr>
                    <td style="padding: 36px 40px;">

                        <p style="margin:0 0 20px; color:#374151; font-size:15px; line-height:1.7;">
                            Halo <strong>{{ $instructor->name }}</strong>,
                        </p>

                        <p style="margin:0 0 24px; color:#374151; font-size:15px; line-height:1.7;">
                            Tim BelajarKUY telah meninjau dan <strong style="color:#7C3AED;">menyetujui</strong> kursusmu. Kursusmu kini berstatus <strong>Aktif</strong> dan dapat ditemukan oleh siswa di katalog.
                        </p>

                        {{-- Course Card --}}
                        <table width="100%" cellpadding="0" cellspacing="0" style="background:#F9F5FF; border:1px solid #E9D5FF; border-radius:10px; overflow:hidden; margin-bottom:28px;">
                            <tr>
                                <td style="padding: 20px 24px;">
                                    <p style="margin:0 0 6px; color:#6B7280; font-size:12px; letter-spacing:1px; text-transform:uppercase; font-weight:600;">Kursus yang Disetujui</p>
                                    <h2 style="margin:0 0 8px; color:#1F2937; font-size:18px; font-weight:700;">{{ $course->title }}</h2>
                                    <p style="margin:0 0 12px; color:#6B7280; font-size:13px;">
                                        Kategori: {{ $course->category?->name ?? '—' }}
                                    </p>
                                    @if($course->price > 0)
                                    <p style="margin:0; color:#7C3AED; font-size:15px; font-weight:600;">
                                        Harga: Rp {{ number_format($course->discounted_price, 0, ',', '.') }}
                                        @if($course->discount > 0)
                                            <span style="color:#9CA3AF; font-size:13px; font-weight:400; text-decoration:line-through; margin-left:6px;">
                                                Rp {{ number_format($course->price, 0, ',', '.') }}
                                            </span>
                                        @endif
                                    </p>
                                    @else
                                    <p style="margin:0; color:#059669; font-size:14px; font-weight:600;">Gratis</p>
                                    @endif
                                </td>
                            </tr>
                        </table>

                        <p style="margin:0 0 28px; color:#374151; font-size:15px; line-height:1.7;">
                            Pastikan kamu terus memperbarui konten kursus agar siswa mendapatkan pengalaman belajar terbaik. Semakin berkualitas kursusmu, semakin banyak siswa yang mendaftar! 🚀
                        </p>

                        {{-- CTA Button --}}
                        <table cellpadding="0" cellspacing="0" style="margin-bottom: 32px;">
                            <tr>
                                <td style="border-radius: 8px; background: linear-gradient(135deg, #300033, #7C3AED);">
                                    <a href="{{ url('/instructor/courses') }}"
                                       style="display:inline-block; padding:14px 28px; color:#ffffff; font-weight:600; font-size:15px; text-decoration:none; border-radius:8px;">
                                        Lihat Kursusmu →
                                    </a>
                                </td>
                            </tr>
                        </table>

                        <p style="margin:0; color:#6B7280; font-size:14px; line-height:1.7;">
                            Terima kasih telah berkontribusi untuk ekosistem belajar Indonesia! Jika ada pertanyaan, balas email ini atau hubungi kami di <a href="mailto:halo@belajarkuy.id" style="color:#7C3AED;">halo@belajarkuy.id</a>.
                        </p>
                    </td>
                </tr>

                {{-- Footer --}}
                <tr>
                    <td style="background:#F9FAFB; padding:24px 40px; border-top:1px solid #F3F4F6;">
                        <p style="margin:0; color:#9CA3AF; font-size:12px; text-align:center; line-height:1.6;">
                            Email ini dikirim otomatis oleh <strong>BelajarKUY</strong>.<br>
                            &copy; {{ date('Y') }} BelajarKUY. Platform Belajar Online Indonesia.
                        </p>
                    </td>
                </tr>

            </table>
        </td>
    </tr>
</table>

</body>
</html>

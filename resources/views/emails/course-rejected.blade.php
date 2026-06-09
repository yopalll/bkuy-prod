<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kursusmu Memerlukan Perbaikan — BelajarKUY</title>
</head>
<body style="margin:0; padding:0; background:#f4f1ee; font-family:'Segoe UI',Arial,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f1ee; padding: 40px 20px;">
    <tr>
        <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 24px rgba(0,0,0,0.08);">

                {{-- Header --}}
                <tr>
                    <td style="background: linear-gradient(135deg, #7F1D1D 0%, #B91C1C 60%, #EF4444 100%); padding: 40px 40px 32px;">
                        <p style="margin:0 0 8px; color:#FEE2E2; font-size:13px; letter-spacing:2px; text-transform:uppercase; font-weight:600;">BelajarKUY</p>
                        <h1 style="margin:0; color:#ffffff; font-size:26px; font-weight:700; line-height:1.3;">
                            ⚠️ Kursusmu Memerlukan Perbaikan
                        </h1>
                        <p style="margin:12px 0 0; color:#FECACA; font-size:15px;">
                            Tim reviewer telah meninjau dan memberikan catatan untuk kursusmu.
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
                            Setelah ditinjau oleh tim BelajarKUY, kursusmu saat ini <strong style="color:#B91C1C;">belum dapat kami setujui</strong>. Kami mendorongmu untuk melakukan perbaikan dan mengajukannya kembali untuk ditinjau.
                        </p>

                        {{-- Course Card --}}
                        <table width="100%" cellpadding="0" cellspacing="0" style="background:#FFF5F5; border:1px solid #FECACA; border-radius:10px; overflow:hidden; margin-bottom:24px;">
                            <tr>
                                <td style="padding: 20px 24px;">
                                    <p style="margin:0 0 6px; color:#6B7280; font-size:12px; letter-spacing:1px; text-transform:uppercase; font-weight:600;">Kursus yang Ditinjau</p>
                                    <h2 style="margin:0 0 8px; color:#1F2937; font-size:18px; font-weight:700;">{{ $course->title }}</h2>
                                    <p style="margin:0; color:#6B7280; font-size:13px;">
                                        Kategori: {{ $course->category?->name ?? '—' }}
                                    </p>
                                </td>
                            </tr>
                        </table>

                        {{-- Reason Box --}}
                        @if($reason)
                        <table width="100%" cellpadding="0" cellspacing="0" style="background:#FEF2F2; border-left:4px solid #EF4444; border-radius:0 8px 8px 0; margin-bottom:28px;">
                            <tr>
                                <td style="padding: 16px 20px;">
                                    <p style="margin:0 0 6px; color:#B91C1C; font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:1px;">Catatan dari Reviewer</p>
                                    <p style="margin:0; color:#374151; font-size:14px; line-height:1.7;">{{ $reason }}</p>
                                </td>
                            </tr>
                        </table>
                        @else
                        <table width="100%" cellpadding="0" cellspacing="0" style="background:#FEF2F2; border-left:4px solid #EF4444; border-radius:0 8px 8px 0; margin-bottom:28px;">
                            <tr>
                                <td style="padding: 16px 20px;">
                                    <p style="margin:0 0 6px; color:#B91C1C; font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:1px;">Catatan dari Reviewer</p>
                                    <p style="margin:0; color:#374151; font-size:14px; line-height:1.7;">
                                        Kursusmu belum memenuhi standar kualitas BelajarKUY. Silakan tinjau kembali konten, deskripsi, dan kelengkapan kurikulum, kemudian ajukan ulang.
                                    </p>
                                </td>
                            </tr>
                        </table>
                        @endif

                        {{-- Steps --}}
                        <p style="margin:0 0 12px; color:#374151; font-size:15px; font-weight:600;">Langkah selanjutnya:</p>
                        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                            <tr>
                                <td style="padding: 6px 0; color:#374151; font-size:14px; line-height:1.7;">
                                    <span style="color:#7C3AED; font-weight:700;">1.</span> Masuk ke panel instruktur dan buka kursus yang bersangkutan.
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 6px 0; color:#374151; font-size:14px; line-height:1.7;">
                                    <span style="color:#7C3AED; font-weight:700;">2.</span> Lakukan perbaikan berdasarkan catatan reviewer di atas.
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 6px 0; color:#374151; font-size:14px; line-height:1.7;">
                                    <span style="color:#7C3AED; font-weight:700;">3.</span> Klik <em>"Ajukan untuk Review"</em> kembali setelah perbaikan selesai.
                                </td>
                            </tr>
                        </table>

                        {{-- CTA Button --}}
                        <table cellpadding="0" cellspacing="0" style="margin-bottom: 32px;">
                            <tr>
                                <td style="border-radius: 8px; background: linear-gradient(135deg, #7F1D1D, #B91C1C);">
                                    <a href="{{ url('/instructor/courses') }}"
                                       style="display:inline-block; padding:14px 28px; color:#ffffff; font-weight:600; font-size:15px; text-decoration:none; border-radius:8px;">
                                        Perbaiki Kursus →
                                    </a>
                                </td>
                            </tr>
                        </table>

                        <p style="margin:0; color:#6B7280; font-size:14px; line-height:1.7;">
                            Jika ada pertanyaan atau keberatan mengenai keputusan ini, balas email ini atau hubungi kami di <a href="mailto:halo@belajarkuy.id" style="color:#7C3AED;">halo@belajarkuy.id</a>.
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

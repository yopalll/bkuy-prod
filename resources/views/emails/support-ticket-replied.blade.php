<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Balasan Tiket Bantuan — BelajarKUY</title>
</head>
<body style="margin:0; padding:0; background:#f4f1ee; font-family:'Segoe UI',Arial,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f1ee; padding: 40px 20px;">
    <tr>
        <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 24px rgba(0,0,0,0.08);">

                {{-- Header --}}
                <tr>
                    <td style="background: linear-gradient(135deg, #300033 0%, #4a154b 60%, #7C3AED 100%); padding: 40px 40px 32px;">
                        <p style="margin:0 0 8px; color:#E9D5FF; font-size:13px; letter-spacing:2px; text-transform:uppercase; font-weight:600;">BelajarKUY · Pusat Bantuan</p>
                        <h1 style="margin:0; color:#ffffff; font-size:24px; font-weight:700; line-height:1.3;">
                            💬 Tim kami sudah membalas tiketmu
                        </h1>
                        <p style="margin:12px 0 0; color:#F3E8FF; font-size:15px;">
                            Tiket #{{ $ticket->id }} · {{ $ticket->subject }}
                        </p>
                    </td>
                </tr>

                {{-- Body --}}
                <tr>
                    <td style="padding: 36px 40px;">

                        <p style="margin:0 0 20px; color:#374151; font-size:15px; line-height:1.7;">
                            Halo <strong>{{ $ticket->user->name ?? 'Pengguna' }}</strong>,
                        </p>

                        <p style="margin:0 0 24px; color:#374151; font-size:15px; line-height:1.7;">
                            Ada balasan baru dari tim BelajarKUY untuk tiket bantuanmu:
                        </p>

                        {{-- Reply Box --}}
                        <table width="100%" cellpadding="0" cellspacing="0" style="background:#FAF5FF; border-left:4px solid #7C3AED; border-radius:0 8px 8px 0; margin-bottom:28px;">
                            <tr>
                                <td style="padding: 18px 22px;">
                                    <p style="margin:0 0 8px; color:#7C3AED; font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:1px;">Balasan Admin</p>
                                    <p style="margin:0; color:#374151; font-size:15px; line-height:1.7; white-space:pre-wrap;">{{ $reply->body }}</p>
                                </td>
                            </tr>
                        </table>

                        {{-- CTA Button --}}
                        <table cellpadding="0" cellspacing="0" style="margin-bottom: 28px;">
                            <tr>
                                <td style="border-radius: 8px; background: linear-gradient(135deg, #300033, #7C3AED);">
                                    <a href="{{ $url }}"
                                       style="display:inline-block; padding:14px 28px; color:#ffffff; font-weight:600; font-size:15px; text-decoration:none; border-radius:8px;">
                                        Lihat & Balas di Web →
                                    </a>
                                </td>
                            </tr>
                        </table>

                        <p style="margin:0; color:#6B7280; font-size:14px; line-height:1.7;">
                            Untuk membalas, silakan buka tiket lewat tombol di atas. Jika masalahmu sudah selesai, kamu bisa menutup tiket dari halaman tersebut.
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

<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Penjualan Baru — BelajarKUY</title>
</head>
<body style="margin:0; padding:0; background:#f4f1ee; font-family:'Segoe UI',Arial,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f1ee; padding: 40px 20px;">
    <tr>
        <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 24px rgba(0,0,0,0.08);">

                {{-- Header --}}
                <tr>
                    <td style="background: linear-gradient(135deg, #064E3B 0%, #059669 60%, #34D399 100%); padding: 40px 40px 32px;">
                        <p style="margin:0 0 8px; color:#D1FAE5; font-size:13px; letter-spacing:2px; text-transform:uppercase; font-weight:600;">BelajarKUY</p>
                        <h1 style="margin:0; color:#ffffff; font-size:26px; font-weight:700; line-height:1.3;">
                            💰 Penjualan Baru!
                        </h1>
                        <p style="margin:12px 0 0; color:#A7F3D0; font-size:15px;">
                            Ada siswa baru yang mendaftar ke kursusmu.
                        </p>
                    </td>
                </tr>

                {{-- Body --}}
                <tr>
                    <td style="padding: 36px 40px;">

                        <p style="margin:0 0 20px; color:#374151; font-size:15px; line-height:1.7;">
                            Halo <strong>{{ $instructor->name }}</strong>,
                        </p>

                        <p style="margin:0 0 28px; color:#374151; font-size:15px; line-height:1.7;">
                            Kabar baik! Seseorang baru saja membeli kursusmu. Berikut ringkasan transaksinya:
                        </p>

                        {{-- Order Summary --}}
                        <table width="100%" cellpadding="0" cellspacing="0" style="background:#F0FDF4; border:1px solid #BBF7D0; border-radius:10px; overflow:hidden; margin-bottom:24px;">
                            <tr>
                                <td style="padding: 20px 24px; border-bottom: 1px solid #D1FAE5;">
                                    <p style="margin:0 0 4px; color:#6B7280; font-size:11px; text-transform:uppercase; letter-spacing:1px; font-weight:600;">Kursus Terjual</p>
                                    <p style="margin:0; color:#1F2937; font-size:17px; font-weight:700;">{{ $course->title }}</p>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 0;">
                                    <table width="100%" cellpadding="0" cellspacing="0">
                                        <tr>
                                            <td style="padding: 14px 24px; border-right: 1px solid #D1FAE5; border-bottom: 1px solid #D1FAE5; width:50%;">
                                                <p style="margin:0 0 4px; color:#6B7280; font-size:11px; text-transform:uppercase; letter-spacing:1px; font-weight:600;">Pembeli</p>
                                                <p style="margin:0; color:#1F2937; font-size:14px; font-weight:600;">{{ $buyer->name }}</p>
                                                <p style="margin:2px 0 0; color:#6B7280; font-size:12px;">{{ $buyer->email }}</p>
                                            </td>
                                            <td style="padding: 14px 24px; border-bottom: 1px solid #D1FAE5;">
                                                <p style="margin:0 0 4px; color:#6B7280; font-size:11px; text-transform:uppercase; letter-spacing:1px; font-weight:600;">Pendapatan Kamu</p>
                                                <p style="margin:0; color:#059669; font-size:18px; font-weight:700;">
                                                    Rp {{ number_format($order->final_price, 0, ',', '.') }}
                                                </p>
                                                @if($order->discount_amount > 0)
                                                <p style="margin:2px 0 0; color:#9CA3AF; font-size:12px;">
                                                    Diskon: Rp {{ number_format($order->discount_amount, 0, ',', '.') }}
                                                </p>
                                                @endif
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 14px 24px;" colspan="2">
                                                <p style="margin:0 0 4px; color:#6B7280; font-size:11px; text-transform:uppercase; letter-spacing:1px; font-weight:600;">Tanggal Transaksi</p>
                                                <p style="margin:0; color:#1F2937; font-size:14px; font-weight:600;">
                                                    {{ $order->created_at->format('d F Y, H:i') }} WIB
                                                </p>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>

                        <p style="margin:0 0 28px; color:#374151; font-size:15px; line-height:1.7;">
                            Siswa ini sudah mendapatkan akses ke kursusmu. Pastikan kamu terus menyempurnakan materi agar mereka mendapatkan pengalaman belajar terbaik! ✨
                        </p>

                        {{-- CTA Button --}}
                        <table cellpadding="0" cellspacing="0" style="margin-bottom: 32px;">
                            <tr>
                                <td style="border-radius: 8px; background: linear-gradient(135deg, #064E3B, #059669);">
                                    <a href="{{ url('/instructor/dashboard') }}"
                                       style="display:inline-block; padding:14px 28px; color:#ffffff; font-weight:600; font-size:15px; text-decoration:none; border-radius:8px;">
                                        Lihat Dashboard →
                                    </a>
                                </td>
                            </tr>
                        </table>

                        <p style="margin:0; color:#6B7280; font-size:14px; line-height:1.7;">
                            Terus semangat mengajar! Jika ada pertanyaan, hubungi kami di <a href="mailto:halo@belajarkuy.id" style="color:#059669;">halo@belajarkuy.id</a>.
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

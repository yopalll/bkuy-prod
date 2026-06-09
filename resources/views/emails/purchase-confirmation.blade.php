<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pembayaran Berhasil — BelajarKUY</title>
</head>
<body style="margin:0; padding:0; background:#f4f1ee; font-family:'Segoe UI',Arial,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f1ee; padding: 40px 20px;">
    <tr>
        <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 24px rgba(0,0,0,0.08);">

                {{-- Header --}}
                <tr>
                    <td style="background: linear-gradient(135deg, #300033 0%, #5c0066 60%, #8b00a0 100%); padding: 40px 40px 32px;">
                        <p style="margin:0 0 8px; color:#e8b4f0; font-size:13px; letter-spacing:2px; text-transform:uppercase; font-weight:600;">BelajarKUY</p>
                        <h1 style="margin:0; color:#ffffff; font-size:26px; font-weight:700; line-height:1.3;">
                            ✅ Pembayaran Berhasil!
                        </h1>
                        <p style="margin:12px 0 0; color:#e8b4f0; font-size:15px;">
                            Terima kasih telah belajar bersama BelajarKUY.
                        </p>
                    </td>
                </tr>

                {{-- Body --}}
                <tr>
                    <td style="padding: 36px 40px;">

                        <p style="margin:0 0 20px; color:#374151; font-size:15px; line-height:1.7;">
                            Halo <strong>{{ $buyer->name }}</strong>,
                        </p>

                        <p style="margin:0 0 28px; color:#374151; font-size:15px; line-height:1.7;">
                            Pembayaran kamu telah dikonfirmasi dan kamu sudah mendapatkan akses ke kursus berikut:
                        </p>

                        {{-- Course List --}}
                        @foreach($orders as $order)
                        <table width="100%" cellpadding="0" cellspacing="0" style="background:#FAF5FF; border:1px solid #E9D5FF; border-radius:10px; overflow:hidden; margin-bottom:16px;">
                            <tr>
                                <td style="padding: 18px 20px;">
                                    <table width="100%" cellpadding="0" cellspacing="0">
                                        <tr>
                                            <td style="vertical-align:top;">
                                                <p style="margin:0 0 4px; color:#6B7280; font-size:11px; text-transform:uppercase; letter-spacing:1px; font-weight:600;">Kursus</p>
                                                <p style="margin:0 0 6px; color:#1F2937; font-size:16px; font-weight:700; line-height:1.4;">{{ $order->course->title }}</p>
                                                <p style="margin:0; color:#6B7280; font-size:13px;">oleh {{ $order->instructor->name ?? '-' }}</p>
                                            </td>
                                            <td style="vertical-align:top; text-align:right; white-space:nowrap; padding-left:16px;">
                                                @if($order->discount_amount > 0)
                                                <p style="margin:0 0 2px; color:#9CA3AF; font-size:12px; text-decoration:line-through;">
                                                    Rp {{ number_format($order->original_price, 0, ',', '.') }}
                                                </p>
                                                @endif
                                                <p style="margin:0; color:#5c0066; font-size:17px; font-weight:700;">
                                                    @if($order->final_price == 0)
                                                        Gratis
                                                    @else
                                                        Rp {{ number_format($order->final_price, 0, ',', '.') }}
                                                    @endif
                                                </p>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                        @endforeach

                        {{-- Invoice Summary --}}
                        <table width="100%" cellpadding="0" cellspacing="0" style="background:#F9FAFB; border:1px solid #E5E7EB; border-radius:10px; margin-top:8px; margin-bottom:28px;">
                            <tr>
                                <td style="padding: 16px 20px; border-bottom:1px solid #E5E7EB;">
                                    <table width="100%" cellpadding="0" cellspacing="0">
                                        <tr>
                                            <td><p style="margin:0; color:#6B7280; font-size:13px;">Nomor Pesanan</p></td>
                                            <td style="text-align:right;"><p style="margin:0; color:#1F2937; font-size:13px; font-weight:600; font-family:monospace;">{{ $payment->midtrans_order_id }}</p></td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 16px 20px; border-bottom:1px solid #E5E7EB;">
                                    <table width="100%" cellpadding="0" cellspacing="0">
                                        <tr>
                                            <td><p style="margin:0; color:#6B7280; font-size:13px;">Tanggal Pembayaran</p></td>
                                            <td style="text-align:right;"><p style="margin:0; color:#1F2937; font-size:13px; font-weight:600;">{{ $payment->updated_at->format('d F Y, H:i') }} WIB</p></td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            @if($payment->payment_type)
                            <tr>
                                <td style="padding: 16px 20px; border-bottom:1px solid #E5E7EB;">
                                    <table width="100%" cellpadding="0" cellspacing="0">
                                        <tr>
                                            <td><p style="margin:0; color:#6B7280; font-size:13px;">Metode Pembayaran</p></td>
                                            <td style="text-align:right;"><p style="margin:0; color:#1F2937; font-size:13px; font-weight:600; text-transform:capitalize;">{{ str_replace('_', ' ', $payment->payment_type) }}</p></td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            @endif
                            <tr>
                                <td style="padding: 16px 20px; background:#5c0066; border-radius:0 0 10px 10px;">
                                    <table width="100%" cellpadding="0" cellspacing="0">
                                        <tr>
                                            <td><p style="margin:0; color:#E9D5FF; font-size:14px; font-weight:600;">Total Dibayar</p></td>
                                            <td style="text-align:right;">
                                                <p style="margin:0; color:#ffffff; font-size:20px; font-weight:700;">
                                                    @if($payment->total_amount == 0)
                                                        Gratis
                                                    @else
                                                        Rp {{ number_format($payment->total_amount, 0, ',', '.') }}
                                                    @endif
                                                </p>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>

                        <p style="margin:0 0 28px; color:#374151; font-size:15px; line-height:1.7;">
                            Kamu sudah bisa langsung mulai belajar sekarang! Akses semua kursusmu dari halaman <strong>Kursus Saya</strong>.
                        </p>

                        {{-- CTA Button --}}
                        <table cellpadding="0" cellspacing="0" style="margin-bottom: 32px;">
                            <tr>
                                <td style="border-radius: 8px; background: linear-gradient(135deg, #300033, #5c0066);">
                                    <a href="{{ url('/student/my-courses') }}"
                                       style="display:inline-block; padding:14px 28px; color:#ffffff; font-weight:600; font-size:15px; text-decoration:none; border-radius:8px;">
                                        Mulai Belajar →
                                    </a>
                                </td>
                            </tr>
                        </table>

                        <p style="margin:0; color:#6B7280; font-size:14px; line-height:1.7;">
                            Ada pertanyaan? Hubungi kami di <a href="mailto:halo@belajarkuy.id" style="color:#5c0066;">halo@belajarkuy.id</a>.
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

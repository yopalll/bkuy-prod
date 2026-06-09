<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Selamat Datang di BelajarKUY!</title>
</head>
<body style="margin:0;padding:0;background-color:#fcf9f8;font-family:'Plus Jakarta Sans',Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#fcf9f8;padding:40px 0;">
        <tr>
            <td align="center">
                <table width="480" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 8px 40px rgba(48,0,51,0.10);">

                    {{-- Header brand --}}
                    <tr>
                        <td style="background:#300033;padding:28px 32px;text-align:center;">
                            <span style="font-size:26px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">
                                Belajar<span style="color:#ffb145;">KUY</span>
                            </span>
                        </td>
                    </tr>

                    {{-- Hero banner --}}
                    <tr>
                        <td style="background:linear-gradient(135deg,#3d0040 0%,#5a0060 100%);padding:32px;text-align:center;">
                            <p style="margin:0 0 8px;font-size:32px;">🎉</p>
                            <p style="margin:0;font-size:22px;font-weight:800;color:#ffffff;">Selamat Datang!</p>
                            <p style="margin:6px 0 0;font-size:14px;color:#e0c8ff;">Akun kamu sudah aktif di BelajarKUY</p>
                        </td>
                    </tr>

                    {{-- Body --}}
                    <tr>
                        <td style="padding:36px 32px;">
                            <p style="margin:0 0 16px;font-size:15px;color:#4f434c;line-height:1.7;">
                                Halo! Kami senang kamu bergabung bersama ribuan pelajar di BelajarKUY — platform belajar online terbaik Indonesia.
                            </p>

                            <p style="margin:0 0 24px;font-size:15px;color:#4f434c;line-height:1.7;">
                                Mulailah perjalanan belajarmu sekarang dan tingkatkan skillmu bersama instruktur terbaik.
                            </p>

                            {{-- CTA Button --}}
                            <div style="text-align:center;margin:0 0 28px;">
                                <a href="{{ config('app.url') }}/home"
                                   style="display:inline-block;background:#300033;color:#ffffff;font-size:14px;font-weight:700;padding:14px 32px;border-radius:12px;text-decoration:none;letter-spacing:0.01em;">
                                    Jelajahi Kursus →
                                </a>
                            </div>

                            {{-- Features highlight --}}
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                                <tr>
                                    <td width="33%" style="text-align:center;padding:12px 8px;">
                                        <p style="margin:0 0 4px;font-size:20px;">📚</p>
                                        <p style="margin:0;font-size:12px;font-weight:700;color:#300033;">Kursus Berkualitas</p>
                                    </td>
                                    <td width="33%" style="text-align:center;padding:12px 8px;">
                                        <p style="margin:0 0 4px;font-size:20px;">🏆</p>
                                        <p style="margin:0;font-size:12px;font-weight:700;color:#300033;">Sertifikat Resmi</p>
                                    </td>
                                    <td width="33%" style="text-align:center;padding:12px 8px;">
                                        <p style="margin:0 0 4px;font-size:20px;">💡</p>
                                        <p style="margin:0;font-size:12px;font-weight:700;color:#300033;">Belajar Kapan Saja</p>
                                    </td>
                                </tr>
                            </table>

                            <p style="margin:0;font-size:13px;color:#80737d;line-height:1.6;">
                                Butuh bantuan? Balas email ini atau hubungi tim support kami.<br>
                                Kami selalu siap membantu perjalanan belajarmu.
                            </p>
                        </td>
                    </tr>

                    {{-- Footer --}}
                    <tr>
                        <td style="background:#f6f3f2;border-top:1px solid #e5e2e1;padding:18px 32px;text-align:center;">
                            <p style="margin:0;font-size:12px;color:#80737d;">
                                © {{ date('Y') }} BelajarKUY — Platform Belajar Indonesia
                            </p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>

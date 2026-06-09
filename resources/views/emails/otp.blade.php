<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Verifikasi Email — BelajarKUY</title>
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

                    {{-- Body --}}
                    <tr>
                        <td style="padding:36px 32px;">
                            <p style="margin:0 0 8px;font-size:20px;font-weight:700;color:#1b1b1c;">
                                Halo, {{ $user->name }}!
                            </p>
                            <p style="margin:0 0 28px;font-size:15px;color:#4f434c;line-height:1.6;">
                                Gunakan kode berikut untuk memverifikasi alamat email kamu.
                                Kode berlaku selama <strong>{{ $ttl }} menit</strong>.
                            </p>

                            {{-- OTP box --}}
                            <div style="background:#fdf0fd;border:2px solid #f6afef;border-radius:12px;padding:24px;text-align:center;margin:0 0 28px;">
                                <p style="margin:0 0 6px;font-size:12px;font-weight:600;color:#693168;letter-spacing:0.08em;text-transform:uppercase;">Kode Verifikasi</p>
                                <p style="margin:0;font-size:38px;font-weight:800;letter-spacing:10px;color:#300033;font-family:monospace;">{{ $code }}</p>
                            </div>

                            <p style="margin:0;font-size:13px;color:#80737d;line-height:1.6;">
                                Abaikan email ini jika kamu tidak mendaftar di BelajarKUY.<br>
                                Jangan bagikan kode ini kepada siapapun.
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

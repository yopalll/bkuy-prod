<?php

namespace App\Services;

use App\Mail\OtpMail;
use App\Models\EmailOtp;
use App\Models\User;
use Illuminate\Auth\Events\Verified;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;

class OtpService
{
    const TTL_MINUTES  = 10;
    const MAX_ATTEMPTS = 5;

    public function sendTo(User $user): void
    {
        // Invalidasi OTP aktif sebelumnya
        EmailOtp::where('user_id', $user->id)->whereNull('consumed_at')->delete();

        $code = (string) random_int(100000, 999999);

        EmailOtp::create([
            'user_id'    => $user->id,
            'code_hash'  => Hash::make($code),
            'expires_at' => now()->addMinutes(self::TTL_MINUTES),
        ]);

        // Sinkron (tanpa worker queue); ganti ->queue() jika queue:work hidup
        Mail::to($user->email)->send(new OtpMail($user, $code, self::TTL_MINUTES));
    }

    /** @return array{ok: bool, message: string} */
    public function verify(User $user, string $code): array
    {
        $otp = EmailOtp::where('user_id', $user->id)
            ->whereNull('consumed_at')
            ->latest()
            ->first();

        if (!$otp) {
            return ['ok' => false, 'message' => 'Kode tidak ditemukan. Minta kode baru.'];
        }

        if ($otp->isExpired()) {
            return ['ok' => false, 'message' => 'Kode sudah kedaluwarsa. Minta kode baru.'];
        }

        if ($otp->attempts >= self::MAX_ATTEMPTS) {
            return ['ok' => false, 'message' => 'Terlalu banyak percobaan. Minta kode baru.'];
        }

        if (!Hash::check($code, $otp->code_hash)) {
            $otp->increment('attempts');
            $sisa = self::MAX_ATTEMPTS - $otp->attempts;
            return ['ok' => false, 'message' => "Kode salah. Sisa percobaan: {$sisa}."];
        }

        $otp->update(['consumed_at' => now()]);

        if (!$user->hasVerifiedEmail()) {
            $user->forceFill(['email_verified_at' => now()])->save();
            event(new Verified($user));
        }

        return ['ok' => true, 'message' => 'Email berhasil diverifikasi.'];
    }
}

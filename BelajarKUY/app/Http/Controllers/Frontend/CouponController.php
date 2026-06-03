<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Coupon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * CouponController (Frontend) — apply kupon di halaman cart/checkout.
 *
 * Endpoint: POST /coupon/apply  (auth required)
 * Validasi 4 layer (F11: active scope): kode exists, status, valid_until, max_usage.
 * used_count TIDAK di-increment di sini — hanya di-increment saat payment settlement (L9).
 */
class CouponController extends Controller
{
    /**
     * Validasi kode kupon dan kembalikan info diskon.
     * POST /coupon/apply
     *
     * Body: { coupon_code: string, course_ids: int[], subtotal: number }
     * Response 200: { success, coupon_id, coupon_code, discount_percent, discount_amount, final_price }
     * Response 404: { success: false, message: string }
     */
    public function apply(Request $request): JsonResponse
    {
        $data = $request->validate([
            'coupon_code' => 'required|string|max:50',
            'course_ids'  => 'required|array|min:1',
            'course_ids.*'=> 'integer|exists:courses,id',
            'subtotal'    => 'required|numeric|min:0',
        ]);

        $code = strtoupper(trim($data['coupon_code']));

        // Scope active() encapsulates: status=true AND valid_until >= today AND (max_usage NULL OR used_count < max_usage)
        $coupon = Coupon::active()
            ->where('code', $code)
            ->where(function ($q) use ($data) {
                // Global coupon (course_id NULL) ATAU course-specific yang match salah satu course di cart
                $q->whereNull('course_id')
                  ->orWhereIn('course_id', $data['course_ids']);
            })
            ->first();

        if (! $coupon) {
            // Cek apakah kode ada tapi tidak valid, untuk pesan yang lebih spesifik
            $exists = Coupon::where('code', $code)->first();

            if (! $exists) {
                $message = 'Kode kupon tidak ditemukan.';
            } elseif (! $exists->status) {
                $message = 'Kupon sudah dinonaktifkan oleh instruktur.';
            } elseif ($exists->valid_until && $exists->valid_until->isPast()) {
                $message = 'Kupon sudah kedaluwarsa.';
            } elseif ($exists->max_usage !== null && $exists->used_count >= $exists->max_usage) {
                $message = 'Kupon sudah mencapai batas pemakaian.';
            } elseif ($exists->course_id !== null && ! in_array($exists->course_id, $data['course_ids'])) {
                $message = 'Kupon hanya berlaku untuk kursus tertentu yang tidak ada di keranjang kamu.';
            } else {
                $message = 'Kupon tidak valid atau sudah expired.';
            }

            return response()->json([
                'success' => false,
                'message' => $message,
            ], 404);
        }

        $subtotal       = (float) $data['subtotal'];
        $discountAmount = round($subtotal * $coupon->discount_percent / 100, 2);
        $finalPrice     = max(0, $subtotal - $discountAmount);

        return response()->json([
            'success'          => true,
            'coupon_id'        => $coupon->id,
            'coupon_code'      => $coupon->code,
            'discount_percent' => $coupon->discount_percent,
            'discount_amount'  => $discountAmount,
            'final_price'      => $finalPrice,
        ]);
    }

    /**
     * Batalkan kupon yang sudah diterapkan (clear sesi kupon).
     * POST /coupon/remove  — hanya mengembalikan subtotal asli.
     * Tidak ada state di server saat "apply" — cukup clear di frontend.
     */
    public function remove(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'Kupon dibatalkan.',
        ]);
    }
}

<?php

namespace App\Http\Controllers\Backend\Instructor;

use App\Http\Controllers\Controller;
use App\Http\Requests\Instructor\StoreCouponRequest;
use App\Models\Coupon;
use App\Models\Course;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class CouponController extends Controller
{
    /**
     * Daftar semua kupon milik instructor yang login.
     * GET /instructor/coupons
     */
    public function index(): Response
    {
        $instructor = Auth::user();

        // Kursus milik instructor untuk dropdown "berlaku untuk kursus"
        $courses = Course::where('instructor_id', $instructor->id)
            ->whereIn('status', ['active', 'pending_review', 'draft'])
            ->get(['id', 'title', 'slug']);

        $coupons = Coupon::where('instructor_id', $instructor->id)
            ->with('course:id,title,slug')
            ->latest()
            ->get()
            ->map(fn($c) => [
                'id'               => $c->id,
                'code'             => $c->code,
                'discount_percent' => $c->discount_percent,
                'valid_until'      => $c->valid_until?->format('Y-m-d'),
                'valid_until_fmt'  => $c->valid_until?->format('d M Y'),
                'max_usage'        => $c->max_usage,
                'used_count'       => $c->used_count,
                'status'           => $c->status,
                'is_expired'       => $c->valid_until && $c->valid_until->isPast(),
                'is_quota_full'    => $c->max_usage !== null && $c->used_count >= $c->max_usage,
                'course'           => $c->course ? [
                    'id'    => $c->course->id,
                    'title' => $c->course->title,
                    'slug'  => $c->course->slug,
                ] : null,
            ]);

        return Inertia::render('Instructor/Coupons/Index', [
            'coupons' => $coupons,
            'courses' => $courses,
        ]);
    }

    /**
     * Buat kupon baru.
     * POST /instructor/coupons
     */
    public function store(StoreCouponRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $data['instructor_id'] = Auth::id();
        $data['code']          = strtoupper($data['code']);
        $data['status']        = $data['status'] ?? true;
        $data['used_count']    = 0;

        Coupon::create($data);

        return redirect()
            ->route('instructor.coupons.index')
            ->with('success', 'Kupon berhasil dibuat!');
    }

    /**
     * Update kupon.
     * PUT/PATCH /instructor/coupons/{coupon}
     */
    public function update(StoreCouponRequest $request, Coupon $coupon): RedirectResponse
    {
        // Pastikan hanya milik instructor sendiri
        abort_unless($coupon->instructor_id === Auth::id(), 403);

        $data = $request->validated();
        $data['code'] = strtoupper($data['code']);

        $coupon->update($data);

        return redirect()
            ->route('instructor.coupons.index')
            ->with('success', 'Kupon berhasil diperbarui!');
    }

    /**
     * Hapus kupon.
     * DELETE /instructor/coupons/{coupon}
     */
    public function destroy(Coupon $coupon): RedirectResponse
    {
        abort_unless($coupon->instructor_id === Auth::id(), 403);

        $coupon->delete();

        return redirect()
            ->route('instructor.coupons.index')
            ->with('success', 'Kupon berhasil dihapus.');
    }

    /**
     * Toggle status aktif/nonaktif kupon — JSON response.
     * PATCH /instructor/coupons/{coupon}/toggle
     */
    public function toggle(Coupon $coupon): JsonResponse
    {
        abort_unless($coupon->instructor_id === Auth::id(), 403);

        $coupon->update(['status' => !$coupon->status]);

        return response()->json([
            'success' => true,
            'status'  => $coupon->fresh()->status,
            'message' => $coupon->status ? 'Kupon diaktifkan.' : 'Kupon dinonaktifkan.',
        ]);
    }

    /**
     * Auto-generate kode kupon unik (opsional helper).
     * GET /instructor/coupons/generate-code  → JSON
     */
    public function generateCode(): JsonResponse
    {
        do {
            $code = strtoupper(Str::random(8));
        } while (Coupon::where('code', $code)->exists());

        return response()->json(['code' => $code]);
    }
}

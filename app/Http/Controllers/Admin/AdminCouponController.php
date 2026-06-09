<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Coupon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class AdminCouponController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Coupon::with(['instructor:id,name', 'course:id,title'])
            ->latest();

        if ($search = $request->search) {
            $query->where('code', 'like', "%{$search}%");
        }

        if ($request->scope === 'global') {
            $query->whereNull('course_id');
        } elseif ($request->scope === 'course') {
            $query->whereNotNull('course_id');
        }

        if ($request->status !== null && $request->status !== '') {
            $query->where('status', $request->status === '1');
        }

        $coupons = $query->paginate(15)->withQueryString();

        $coupons->getCollection()->transform(fn($c) => [
            'id'               => $c->id,
            'code'             => $c->code,
            'discount_percent' => $c->discount_percent,
            'valid_until'      => $c->valid_until?->format('Y-m-d'),
            'valid_until_fmt'  => $c->valid_until?->format('d M Y'),
            'max_usage'        => $c->max_usage,
            'used_count'       => $c->used_count,
            'status'           => $c->status,
            'is_expired'       => $c->valid_until && $c->valid_until->isPast(),
            'is_global'        => $c->course_id === null,
            'instructor'       => $c->instructor ? ['id' => $c->instructor->id, 'name' => $c->instructor->name] : null,
            'course'           => $c->course ? ['id' => $c->course->id, 'title' => $c->course->title] : null,
        ]);

        return Inertia::render('Admin/Coupons/Index', [
            'coupons' => $coupons,
            'filters' => $request->only('search', 'scope', 'status'),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'code'             => 'required|string|max:50|unique:coupons,code',
            'discount_percent' => 'required|integer|min:1|max:100',
            'valid_until'      => 'required|date|after:today',
            'max_usage'        => 'nullable|integer|min:1',
        ]);

        Coupon::create([
            'instructor_id'    => auth()->id(),
            'course_id'        => null,
            'code'             => strtoupper($validated['code']),
            'discount_percent' => $validated['discount_percent'],
            'valid_until'      => $validated['valid_until'],
            'max_usage'        => $validated['max_usage'] ?? null,
            'used_count'       => 0,
            'status'           => true,
        ]);

        return back()->with('success', 'Kupon global berhasil dibuat!');
    }

    public function update(Request $request, Coupon $coupon): RedirectResponse
    {
        $validated = $request->validate([
            'code'             => "required|string|max:50|unique:coupons,code,{$coupon->id}",
            'discount_percent' => 'required|integer|min:1|max:100',
            'valid_until'      => 'required|date',
            'max_usage'        => 'nullable|integer|min:1',
        ]);

        $coupon->update([
            'code'             => strtoupper($validated['code']),
            'discount_percent' => $validated['discount_percent'],
            'valid_until'      => $validated['valid_until'],
            'max_usage'        => $validated['max_usage'] ?? null,
        ]);

        return back()->with('success', 'Kupon berhasil diperbarui!');
    }

    public function destroy(Coupon $coupon): RedirectResponse
    {
        $coupon->delete();
        return back()->with('success', 'Kupon berhasil dihapus.');
    }

    public function toggle(Coupon $coupon): RedirectResponse
    {
        $coupon->update(['status' => !$coupon->status]);
        $label = $coupon->fresh()->status ? 'diaktifkan' : 'dinonaktifkan';
        return back()->with('success', "Kupon berhasil {$label}.");
    }

    public function generateCode(): \Illuminate\Http\JsonResponse
    {
        do {
            $code = strtoupper(Str::random(8));
        } while (Coupon::where('code', $code)->exists());

        return response()->json(['code' => $code]);
    }
}

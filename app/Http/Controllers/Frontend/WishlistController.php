<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Course;
use App\Models\Wishlist;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WishlistController extends Controller
{
    /**
     * Toggle add/remove wishlist (POST /wishlist/{course}).
     * Returns JSON (dipakai oleh CourseCard via fetch).
     */
    public function toggle(Request $request, Course $course): JsonResponse
    {
        $userId = auth()->id();

        $existing = Wishlist::where('user_id', $userId)
            ->where('course_id', $course->id)
            ->first();

        if ($existing) {
            $existing->delete();
            $action = 'removed';
        } else {
            Wishlist::create([
                'user_id'   => $userId,
                'course_id' => $course->id,
            ]);
            $action = 'added';
        }

        $wishlistCount = Wishlist::where('user_id', $userId)->count();

        return response()->json([
            'success'        => true,
            'action'         => $action,
            'wishlist_count' => $wishlistCount,
        ]);
    }

    /**
     * Halaman daftar wishlist siswa — GET /student/wishlist (Inertia).
     */
    public function index(): Response
    {
        $user = auth()->user();

        $wishlists = Wishlist::where('user_id', $user->id)
            ->with(['course' => function ($q) {
                $q->with(['instructor:id,name,photo', 'category:id,name'])
                  ->withCount(['reviews' => fn($q) => $q->where('status', 'approved')])
                  ->withAvg(['reviews' => fn($q) => $q->where('status', 'approved')], 'rating');
            }])
            ->latest()
            ->get()
            ->map(function ($item) {
                $course = $item->course;
                return [
                    'id'     => $item->id,
                    'course' => [
                        'id'               => $course->id,
                        'title'            => $course->title,
                        'slug'             => $course->slug,
                        'thumbnail'        => $course->thumbnail,
                        'price'            => $course->price,
                        'discount'         => $course->discount,
                        'discounted_price' => $course->discounted_price,
                        'bestseller'       => $course->bestseller,
                        'featured'         => $course->featured,
                        'average_rating'   => (float) ($course->reviews_avg_rating ?? 0),
                        'reviews_count'    => $course->reviews_count ?? 0,
                        'instructor'       => $course->instructor ? [
                            'id'    => $course->instructor->id,
                            'name'  => $course->instructor->name,
                            'photo' => $course->instructor->photo,
                        ] : null,
                        'category'         => $course->category ? [
                            'id'   => $course->category->id,
                            'name' => $course->category->name,
                        ] : null,
                    ],
                ];
            });

        $wishlistIds = $wishlists->pluck('course.id')->toArray();

        return Inertia::render('Student/Wishlist', [
            'wishlists'    => $wishlists,
            'wishlist_ids' => $wishlistIds,
        ]);
    }

    /**
     * Halaman wishlist frontend (AppLayout) — GET /wishlist.
     * Diakses dari konteks katalog/cart, bukan student dashboard.
     */
    public function frontendIndex(): Response
    {
        $user = auth()->user();

        $wishlists = Wishlist::where('user_id', $user->id)
            ->with(['course' => function ($q) {
                $q->with(['instructor:id,name,photo', 'category:id,name'])
                  ->withCount(['reviews' => fn($q) => $q->where('status', 'approved')])
                  ->withAvg(['reviews' => fn($q) => $q->where('status', 'approved')], 'rating');
            }])
            ->latest()
            ->get()
            ->map(function ($item) {
                $course = $item->course;
                return [
                    'id'     => $item->id,
                    'course' => [
                        'id'               => $course->id,
                        'title'            => $course->title,
                        'slug'             => $course->slug,
                        'thumbnail'        => $course->thumbnail,
                        'price'            => $course->price,
                        'discount'         => $course->discount,
                        'discounted_price' => $course->discounted_price,
                        'bestseller'       => $course->bestseller,
                        'featured'         => $course->featured,
                        'average_rating'   => (float) ($course->reviews_avg_rating ?? 0),
                        'reviews_count'    => $course->reviews_count ?? 0,
                        'instructor'       => $course->instructor ? [
                            'id'    => $course->instructor->id,
                            'name'  => $course->instructor->name,
                            'photo' => $course->instructor->photo,
                        ] : null,
                        'category'         => $course->category ? [
                            'id'   => $course->category->id,
                            'name' => $course->category->name,
                        ] : null,
                    ],
                ];
            });

        // ID kursus yang sudah ada di cart (untuk tampilkan tombol "Di Keranjang")
        $cartIds = Cart::where('user_id', $user->id)->pluck('course_id')->toArray();

        return Inertia::render('Wishlist/Index', [
            'wishlists' => $wishlists,
            'cartIds'   => $cartIds,
        ]);
    }

    /**
     * Hapus item wishlist — DELETE /student/wishlist/{id}.
     */
    public function remove(int $id)
    {
        $wishlist = Wishlist::where('user_id', auth()->id())
            ->where('id', $id)
            ->firstOrFail();

        $wishlist->delete();

        return redirect()->back()->with('success', 'Kursus berhasil dihapus dari wishlist.');
    }

    /**
     * Ambil jumlah wishlist (untuk navbar badge).
     */
    public function count(): JsonResponse
    {
        return response()->json([
            'wishlist_count' => Wishlist::where('user_id', auth()->id())->count(),
        ]);
    }
}

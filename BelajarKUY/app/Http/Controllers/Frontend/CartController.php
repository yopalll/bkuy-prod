<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Wishlist;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CartController extends Controller
{
    /**
     * Halaman keranjang — GET /cart (Inertia).
     */
    public function index(): Response
    {
        $user = auth()->user();

        $cartItems = Cart::where('user_id', $user->id)
            ->with(['course' => function ($q) {
                $q->with(['instructor:id,name,photo', 'category:id,name'])
                  ->withCount(['reviews' => fn($q) => $q->where('status', true)])
                  ->withAvg(['reviews' => fn($q) => $q->where('status', true)], 'rating');
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

        // Hitung subtotal real-time dari discounted_price (F05: harga tidak disimpan di cart)
        $subtotal = $cartItems->sum(fn($item) => (float) $item['course']['discounted_price']);

        // Daftar wishlist user untuk tombol "Pindah ke Wishlist"
        $wishlistIds = Wishlist::where('user_id', $user->id)->pluck('course_id')->toArray();

        return Inertia::render('Cart/Index', [
            'cartItems'   => $cartItems,
            'subtotal'    => $subtotal,
            'wishlistIds' => $wishlistIds,
        ]);
    }

    /**
     * Tambah ke cart — POST /cart/{course}.
     * Cek enrollment (F05 Business Rules: prevent re-purchase) + idempotent firstOrCreate.
     */
    public function add(Request $request, Course $course): JsonResponse
    {
        $userId = auth()->id();

        // ✅ BENAR — cek enrolled via tabel enrollments (ADR / F05 Business Rules)
        $alreadyEnrolled = Enrollment::where('user_id', $userId)
            ->where('course_id', $course->id)
            ->exists();

        if ($alreadyEnrolled) {
            return response()->json([
                'success' => false,
                'message' => 'Kamu sudah memiliki kursus ini.',
            ], 409);
        }

        // Idempotent: firstOrCreate (hindari duplikat UNIQUE constraint)
        Cart::firstOrCreate([
            'user_id'   => $userId,
            'course_id' => $course->id,
        ]);

        $cartCount = Cart::where('user_id', $userId)->count();

        return response()->json([
            'success'    => true,
            'cart_count' => $cartCount,
            'message'    => 'Kursus ditambahkan ke keranjang.',
        ]);
    }

    /**
     * Hapus item dari cart — DELETE /cart/{cartItem}.
     */
    public function remove(int $id): JsonResponse
    {
        $userId = auth()->id();

        $cartItem = Cart::where('user_id', $userId)
            ->where('id', $id)
            ->firstOrFail();

        $cartItem->delete();

        $cartCount = Cart::where('user_id', $userId)->count();

        return response()->json([
            'success'    => true,
            'cart_count' => $cartCount,
        ]);
    }

    /**
     * Pindahkan item cart ke wishlist — POST /cart/{cartItem}/move-to-wishlist.
     */
    public function moveToWishlist(int $id): JsonResponse
    {
        $userId = auth()->id();

        $cartItem = Cart::where('user_id', $userId)
            ->where('id', $id)
            ->with('course')
            ->firstOrFail();

        $courseId = $cartItem->course_id;

        // Hapus dari cart
        $cartItem->delete();

        // Tambah ke wishlist (idempotent)
        Wishlist::firstOrCreate([
            'user_id'   => $userId,
            'course_id' => $courseId,
        ]);

        $cartCount    = Cart::where('user_id', $userId)->count();
        $wishlistCount = Wishlist::where('user_id', $userId)->count();

        return response()->json([
            'success'        => true,
            'cart_count'     => $cartCount,
            'wishlist_count' => $wishlistCount,
            'message'        => 'Kursus dipindahkan ke wishlist.',
        ]);
    }

    /**
     * Ambil jumlah cart + total untuk navbar badge — GET /cart/count.
     */
    public function count(): JsonResponse
    {
        $userId = auth()->id();

        $cartItems = Cart::where('user_id', $userId)
            ->with('course')
            ->get();

        $cartCount    = $cartItems->count();
        $totalAmount  = $cartItems->sum(fn($item) => (float) ($item->course?->discounted_price ?? 0));

        return response()->json([
            'cart_count'   => $cartCount,
            'total_amount' => $totalAmount,
        ]);
    }
}

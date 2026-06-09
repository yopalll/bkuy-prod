<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Course;
use App\Models\CourseReport;
use App\Models\Enrollment;
use App\Models\Wishlist;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CourseDetailController extends Controller
{
    public function show($slug)
    {
        $course = Course::where('slug', $slug)
            ->active()
            ->with([
                'category',
                'subCategory',
                'instructor',
                'sections.lectures',
                'goals',
                'reviews' => function ($q) {
                    $q->where('status', 'approved')->latest();
                },
                'reviews.user',
            ])
            ->withCount('enrollments')
            ->firstOrFail();

        $relatedCourses = Course::active()
            ->where('category_id', $course->category_id)
            ->where('id', '!=', $course->id)
            ->with(['category', 'instructor', 'reviews'])
            ->take(4)
            ->get();

        $showReviewForm   = false;
        $hasPendingReview = false;
        $hasReported      = false;
        $inCart           = false;
        $isWishlisted     = false;
        $isEnrolled       = false;

        if (auth()->check()) {
            $uid = auth()->id();

            $canReview = \App\Models\Order::where('user_id', $uid)
                ->where('course_id', $course->id)
                ->where('status', 'completed')
                ->exists();

            $existingReview   = \App\Models\Review::where('user_id', $uid)->where('course_id', $course->id)->first();
            $hasPendingReview = $existingReview && $existingReview->status === 'pending';
            $showReviewForm   = $canReview && !$existingReview;

            $hasReported  = CourseReport::where('user_id', $uid)->where('course_id', $course->id)->exists();
            $inCart       = Cart::where('user_id', $uid)->where('course_id', $course->id)->exists();
            $isWishlisted = Wishlist::where('user_id', $uid)->where('course_id', $course->id)->exists();
            $isEnrolled   = Enrollment::where('user_id', $uid)->where('course_id', $course->id)->exists();
        }

        return Inertia::render('Courses/Show', compact(
            'course', 'relatedCourses', 'showReviewForm', 'hasPendingReview',
            'inCart', 'isWishlisted', 'isEnrolled', 'hasReported',
        ));
    }

    public function storeReview(Request $request, Course $course)
    {
        $request->validate([
            'rating'  => ['required', 'integer', 'min:1', 'max:5'],
            'comment' => ['nullable', 'string', 'max:1000'],
        ]);

        $canReview = \App\Models\Order::where('user_id', auth()->id())
            ->where('course_id', $course->id)
            ->where('status', 'completed')
            ->exists();

        if (!$canReview) {
            return redirect()->back()->with('error', 'Anda harus membeli kursus ini terlebih dahulu sebelum memberikan ulasan.');
        }

        if (\App\Models\Review::where('user_id', auth()->id())->where('course_id', $course->id)->exists()) {
            return redirect()->back()->with('error', 'Anda sudah memberikan ulasan untuk kursus ini.');
        }

        \App\Models\Review::create([
            'user_id'  => auth()->id(),
            'course_id' => $course->id,
            'rating'   => $request->rating,
            'comment'  => $request->comment,
            'status'   => 'approved', // auto-approve; admin moderasi jika ada laporan
        ]);

        return redirect()->back()->with('success', 'Ulasan Anda berhasil ditambahkan!');
    }

    public function reportReview(Request $request, \App\Models\Review $review)
    {
        $request->validate([
            'reason' => ['required', 'string', 'max:500'],
        ]);

        $review->update([
            'report_reason' => $request->reason,
            'reported_at'   => now(),
            'report_count'  => $review->report_count + 1,
        ]);

        return redirect()->back()->with('success', 'Laporan ulasan berhasil dikirim.');
    }
}

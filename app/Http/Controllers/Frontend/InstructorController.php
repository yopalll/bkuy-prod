<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Course;
use Inertia\Inertia;

class InstructorController extends Controller
{
    public function show(User $user)
    {
        abort_if($user->role !== 'instructor', 404);

        $courses = Course::where('instructor_id', $user->id)
            ->where('status', 'active')
            ->with(['category', 'reviews'])
            ->withCount('enrollments')
            ->latest()
            ->get();

        $totalStudents = $courses->sum('enrollments_count');
        $totalReviews  = $courses->sum(fn ($c) => $c->reviews->count());
        $avgRating     = $courses->count() > 0
            ? round($courses->avg('average_rating'), 1)
            : 0;

        return Inertia::render('Instructors/Show', [
            'instructor' => [
                'id'      => $user->id,
                'name'    => $user->name,
                'photo'   => $user->photo,
                'bio'     => $user->bio,
                'website' => $user->website,
            ],
            'stats' => [
                'total_students' => $totalStudents,
                'total_courses'  => $courses->count(),
                'total_reviews'  => $totalReviews,
                'avg_rating'     => $avgRating,
            ],
            'courses' => $courses->map(fn ($c) => [
                'id'               => $c->id,
                'title'            => $c->title,
                'slug'             => $c->slug,
                'thumbnail'        => $c->thumbnail,
                'price'            => $c->price,
                'discount'         => $c->discount,
                'discounted_price' => $c->discounted_price,
                'average_rating'   => $c->average_rating,
                'reviews_count'    => $c->reviews->count(),
                'enrollments_count'=> $c->enrollments_count,
                'bestseller'       => $c->bestseller,
                'featured'         => $c->featured,
                'category'         => $c->category ? ['name' => $c->category->name] : null,
                'instructor'       => ['name' => $user->name, 'photo' => $user->photo],
            ]),
        ]);
    }
}

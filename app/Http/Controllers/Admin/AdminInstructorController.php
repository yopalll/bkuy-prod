<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Inertia\Inertia;

class AdminInstructorController extends Controller
{
    /**
     * Display a listing of instructors.
     */
    public function index()
    {
        $instructors = User::instructors()
            ->withCount(['courses', 'coupons'])
            ->latest()
            ->paginate(15);

        return Inertia::render('Admin/Instructors/Index', compact('instructors'));
    }

    /**
     * Display the specified instructor details.
     */
    public function show(User $instructor)
    {
        abort_if(!$instructor->isInstructor(), 404);

        $instructor->loadCount(['courses', 'coupons']);

        $courses = $instructor->courses()->with('category')->latest()->paginate(10);

        return Inertia::render('Admin/Instructors/Show', compact('instructor', 'courses'));
    }
}

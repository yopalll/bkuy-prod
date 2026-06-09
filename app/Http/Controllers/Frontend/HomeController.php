<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Course;
use App\Models\InfoBox;
use App\Models\Partner;
use App\Models\Slider;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    /**
     * Display the landing / home page.
     * Provides all variables required by frontend/home.blade.php.
     */
    public function index(Request $request)
    {
        $sliders   = Slider::active()->get();
        $infoBoxes = InfoBox::orderBy('order_position')->get();
        $partners  = Partner::orderBy('order_position')->get();
        $categories = Category::where('status', true)
            ->withCount(['courses' => fn($q) => $q->where('status', 'active')])
            ->orderByDesc('courses_count')
            ->take(8)
            ->get();

        $isSearchingOrFiltering = $request->filled('search') || $request->filled('category');

        if ($isSearchingOrFiltering) {
            $filteredCourses = Course::where('status', 'active')
                ->with(['instructor', 'category', 'reviews'])
                ->when($request->search, fn($q) => $q
                    // cocok judul kursus ATAU nama instruktur
                    ->where(fn($sub) => $sub
                        ->where('title', 'like', "%{$request->search}%")
                        ->orWhereHas('instructor', fn($i) => $i->where('name', 'like', "%{$request->search}%"))
                    )
                )
                ->when($request->category, fn($q) => $q->whereHas('category', fn($c) => $c->where('slug', $request->category)))
                ->latest()
                ->get();

            // Cari instruktur yang namanya cocok dengan keyword
            $matchedInstructors = $request->search
                ? User::where('role', 'instructor')
                    ->where('name', 'like', "%{$request->search}%")
                    ->withCount(['courses' => fn($q) => $q->where('status', 'active')])
                    ->get()
                    ->map(fn($u) => [
                        'id'              => $u->id,
                        'name'            => $u->name,
                        'photo'           => $u->photo,
                        'bio'             => $u->bio,
                        'website'         => $u->website,
                        'courses_count'   => $u->courses_count,
                    ])
                : collect();

            $featuredCourses   = collect();
            $bestsellerCourses = collect();
        } else {
            $matchedInstructors = collect();
            $filteredCourses   = collect();
            $featuredCourses   = Course::where('status', 'active')
                ->where('featured', true)
                ->with(['instructor', 'category', 'reviews'])
                ->latest()
                ->take(8)
                ->get();
            $bestsellerCourses = Course::where('status', 'active')
                ->where('bestseller', true)
                ->withCount('enrollments')
                ->with(['instructor', 'category', 'reviews'])
                ->orderByDesc('enrollments_count')
                ->take(8)
                ->get();
        }

        // Fase 1 migrasi React+Inertia (ADR-008): logika data dipertahankan;
        // hanya respons presentasi yang berubah dari view() ke Inertia::render().
        return Inertia::render('Home', compact(
            'sliders',
            'infoBoxes',
            'partners',
            'categories',
            'featuredCourses',
            'bestsellerCourses',
            'filteredCourses',
            'matchedInstructors',
            'isSearchingOrFiltering'
        ));
    }
}

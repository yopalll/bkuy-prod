<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Auth\GoogleController;
use App\Http\Controllers\Backend\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Backend\Instructor\DashboardController as InstructorDashboardController;
use App\Http\Controllers\Backend\Student\DashboardController as StudentDashboardController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\SubCategoryController;
use App\Http\Controllers\Admin\AdminCourseController;
use App\Http\Controllers\Admin\AdminInstructorController;
use App\Http\Controllers\Admin\AdminOrderController;
use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\Admin\AdminSliderController;
use App\Http\Controllers\Admin\AdminInfoBoxController;
use App\Http\Controllers\Admin\AdminPartnerController;
use App\Http\Controllers\Admin\AdminSiteSettingController;
use App\Http\Controllers\Admin\AdminReviewController;
use App\Http\Controllers\Frontend\HomeController;
use App\Http\Controllers\Frontend\WishlistController;
use Inertia\Inertia;

// --- Public Routes ---
// Landing page via React+Inertia (desain Vascha & Quinsha)
Route::get('/', function () {
    return Inertia::render('Welcome');
});

// Universal Dashboard: tampilkan konten sesuai role, URL tetap /dashboard
Route::get('/dashboard', function () {
    $user = Auth::user();
    return match($user->role) {
        'admin'      => app(AdminDashboardController::class)->index(),
        'instructor' => app(InstructorDashboardController::class)->index(),
        default      => app(StudentDashboardController::class)->index(),
    };
})->middleware(['auth', 'verified'])->name('dashboard');

// --- Profile (Breeze default) ---
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// --- Admin Login Page (terpisah dari login biasa) ---
Route::get('/admin/login', function () {
    if (Auth::check() && Auth::user()->role === 'admin') {
        return redirect()->route('admin.dashboard');
    }
    return view('auth.admin-login');
})->name('admin.login.page')->middleware('guest');

// --- Admin Panel (dilindungi auth + verified + role:admin) ---
Route::middleware(['auth', 'verified', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');

    Route::resource('categories', CategoryController::class)->except(['show']);
    Route::resource('sub-categories', SubCategoryController::class)->except(['show']);

    Route::resource('courses', AdminCourseController::class)->only(['index', 'show']);
    Route::patch('courses/{course}/status', [AdminCourseController::class, 'updateStatus'])->name('courses.update-status');

    Route::resource('instructors', AdminInstructorController::class)->only(['index', 'show']);
    Route::resource('orders', AdminOrderController::class)->only(['index', 'show']);
    Route::resource('users', AdminUserController::class)->only(['index']);
    Route::resource('sliders', AdminSliderController::class)->except(['show']);
    Route::resource('info-boxes', AdminInfoBoxController::class)->except(['show']);
    Route::resource('partners', AdminPartnerController::class)->except(['show']);

    Route::get('reviews', [AdminReviewController::class, 'index'])->name('reviews.index');
    Route::patch('reviews/{review}/status', [AdminReviewController::class, 'updateStatus'])->name('reviews.update-status');

    Route::get('settings', [AdminSiteSettingController::class, 'index'])->name('settings.index');
    Route::put('settings', [AdminSiteSettingController::class, 'update'])->name('settings.update');
});

// --- Instructor Panel (dilindungi auth + verified + role:instructor) ---
Route::middleware(['auth', 'verified', 'role:instructor'])->prefix('instructor')->name('instructor.')->group(function () {
    Route::get('/dashboard', [InstructorDashboardController::class, 'index'])->name('dashboard');
});

// --- Student Panel (dilindungi auth + verified + role:user) ---
Route::middleware(['auth', 'verified', 'role:user'])->prefix('student')->name('student.')->group(function () {
    Route::get('/dashboard', [StudentDashboardController::class, 'index'])->name('dashboard');
    Route::get('/my-courses', [StudentDashboardController::class, 'myCourses'])->name('my-courses');
    // L3 Ray: wishlist halaman React (Inertia) + hapus item
    Route::get('/wishlist', [WishlistController::class, 'index'])->name('wishlist');
    Route::delete('/wishlist/{id}', [WishlistController::class, 'remove'])->name('wishlist.remove');
    Route::get('/profile', [StudentDashboardController::class, 'profile'])->name('profile');
    Route::post('/profile', [StudentDashboardController::class, 'profileUpdate'])->name('profile.update');
    Route::get('/setting', [StudentDashboardController::class, 'setting'])->name('setting');
    Route::post('/setting', [StudentDashboardController::class, 'settingUpdate'])->name('setting.update');
});

// --- Google OAuth ---
Route::get('/auth/google', [GoogleController::class, 'redirect'])->name('auth.google');
Route::get('/auth/google-callback', [GoogleController::class, 'callback'])->name('auth.google.callback');

// =============================================================================
// FRONTEND ROUTES — Phase 2 & 3 (Placeholder — akan diimplementasi nanti)
// Route-route ini didaftarkan agar views tidak throw RouteNotFoundException
// =============================================================================

// Landing page & katalog kursus (Phase 2)
Route::get('/home', [HomeController::class, 'index'])->name('home');

// Course detail page — Fase 1 migrasi React+Inertia (ADR-008)
use App\Http\Controllers\Frontend\CourseDetailController;
Route::get('/courses/{slug}', [CourseDetailController::class, 'show'])->name('course.detail');

// Cart (Phase 3)
Route::get('/cart', function () {
    return view('dashboard'); // placeholder
})->middleware('auth')->name('cart.index');

Route::post('/cart/{course}', function () {
    return back()->with('info', 'Fitur cart belum tersedia.');
})->middleware('auth')->name('cart.add');

// Checkout (Phase 3)
Route::get('/checkout', function () {
    return view('frontend.checkout');
})->middleware('auth')->name('checkout');

Route::post('/checkout/process', function () {
    return view('frontend.checkout-process');
})->middleware('auth')->name('checkout.process');

// Payment result pages (Phase 3)
Route::get('/payment/success', function () {
    return view('frontend.payment-success');
})->middleware('auth')->name('payment.success');

Route::get('/payment/failed', function () {
    return view('frontend.payment-failed');
})->middleware('auth')->name('payment.failed');

// Reviews (Phase 5)
Route::post('/courses/{course}/reviews', function () {
    return back()->with('info', 'Fitur review belum tersedia.');
})->middleware('auth')->name('course.review.store');

// L3 Ray: Wishlist toggle (add/remove) — JSON response untuk CourseCard
Route::post('/wishlist/{course}', [WishlistController::class, 'toggle'])->middleware('auth')->name('wishlist.add');
// Badge count untuk navbar
Route::get('/wishlist/count', [WishlistController::class, 'count'])->middleware('auth')->name('wishlist.count');

// Admin review actions (alias untuk update-status)
Route::middleware(['auth', 'verified', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::patch('reviews/{review}/approve', function ($id) {
        \App\Models\Review::findOrFail($id)->update(['status' => 'approved']);
        return back()->with('success', 'Review disetujui.');
    })->name('reviews.approve');

    Route::patch('reviews/{review}/reject', function ($id) {
        \App\Models\Review::findOrFail($id)->update(['status' => 'rejected']);
        return back()->with('success', 'Review ditolak.');
    })->name('reviews.reject');
});

require __DIR__.'/auth.php';



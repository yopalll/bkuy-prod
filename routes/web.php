<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Auth\GoogleController;
use App\Http\Controllers\Backend\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Backend\Instructor\DashboardController as InstructorDashboardController;
use App\Http\Controllers\Backend\Instructor\CourseController as InstructorCourseController;
use App\Http\Controllers\Backend\Instructor\SectionController as InstructorSectionController;
use App\Http\Controllers\Backend\Instructor\LectureController as InstructorLectureController;
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
use App\Http\Controllers\Admin\AdminCouponController;
use App\Http\Controllers\Frontend\HomeController;
use App\Http\Controllers\Frontend\InstructorController as PublicInstructorController;
use App\Http\Controllers\Frontend\WishlistController;
use App\Http\Controllers\Frontend\CartController;
use App\Http\Controllers\Frontend\CouponController as FrontendCouponController;
use App\Http\Controllers\Frontend\CheckoutController;
use App\Http\Controllers\Backend\Instructor\CouponController as InstructorCouponController;
use App\Http\Controllers\Frontend\CoursePlayerController;
use App\Http\Controllers\Frontend\CertificateController;
use Inertia\Inertia;

// --- Public Routes ---
// Landing page: guest → Welcome marketing page, auth → langsung katalog
Route::get('/', function () {
    if (Auth::check()) {
        return redirect()->route('home');
    }
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
    return Inertia::render('Auth/AdminLogin');
})->name('admin.login.page')->middleware('guest');

// --- Admin Panel (dilindungi auth + verified + role:admin) ---
Route::middleware(['auth', 'verified', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');

    Route::resource('categories', CategoryController::class)->except(['show']);
    Route::patch('categories/{category}/toggle', [CategoryController::class, 'toggle'])->name('categories.toggle');
    Route::resource('sub-categories', SubCategoryController::class)->except(['show']);

    Route::resource('courses', AdminCourseController::class)->only(['index', 'show']);
    Route::patch('courses/{course}/status', [AdminCourseController::class, 'updateStatus'])->name('courses.update-status');

    Route::resource('instructors', AdminInstructorController::class)->only(['index', 'show']);
    Route::resource('orders', AdminOrderController::class)->only(['index', 'show']);
    Route::resource('users', AdminUserController::class)->only(['index']);
    Route::patch('users/{user}/role', [AdminUserController::class, 'updateRole'])->name('users.update-role');
    Route::resource('sliders', AdminSliderController::class)->except(['show']);
    Route::patch('sliders/{slider}/toggle', [AdminSliderController::class, 'toggle'])->name('sliders.toggle');
    Route::resource('info-boxes', AdminInfoBoxController::class)->except(['show']);
    Route::resource('partners', AdminPartnerController::class)->except(['show']);

    Route::resource('coupons', AdminCouponController::class)->except(['show', 'create', 'edit']);
    Route::patch('coupons/{coupon}/toggle', [AdminCouponController::class, 'toggle'])->name('coupons.toggle');
    Route::get('coupons/generate-code', [AdminCouponController::class, 'generateCode'])->name('coupons.generate-code');

    Route::get('reviews', [AdminReviewController::class, 'index'])->name('reviews.index');
    Route::patch('reviews/{review}/status', [AdminReviewController::class, 'updateStatus'])->name('reviews.update-status');

    Route::get('settings', [AdminSiteSettingController::class, 'index'])->name('settings.index');
    Route::put('settings', [AdminSiteSettingController::class, 'update'])->name('settings.update');
});

// --- Instructor Panel (dilindungi auth + verified + role:instructor) ---
Route::middleware(['auth', 'verified', 'role:instructor'])->prefix('instructor')->name('instructor.')->group(function () {
    Route::get('/dashboard', [InstructorDashboardController::class, 'index'])->name('dashboard');

    // Course CRUD
    Route::resource('courses', InstructorCourseController::class)->except(['show']);

    // Submit course untuk ditinjau admin (draft → pending_review)
    Route::post('courses/{course}/submit', [InstructorCourseController::class, 'submit'])->name('courses.submit');

    // L7 — Kurikulum (Section & Lecture CRUD)
    Route::get('courses/{course}/curriculum', [InstructorCourseController::class, 'curriculum'])->name('courses.curriculum');

    // Section CRUD (nested dalam course)
    Route::post('courses/{course}/sections', [InstructorSectionController::class, 'store'])->name('courses.sections.store');
    Route::patch('courses/{course}/sections/{section}', [InstructorSectionController::class, 'update'])->name('courses.sections.update');
    Route::delete('courses/{course}/sections/{section}', [InstructorSectionController::class, 'destroy'])->name('courses.sections.destroy');
    Route::post('courses/{course}/sections/reorder', [InstructorSectionController::class, 'reorder'])->name('courses.sections.reorder');

    // Lecture CRUD (nested dalam course > section)
    Route::post('courses/{course}/sections/{section}/lectures', [InstructorLectureController::class, 'store'])->name('courses.sections.lectures.store');
    Route::patch('courses/{course}/sections/{section}/lectures/{lecture}', [InstructorLectureController::class, 'update'])->name('courses.sections.lectures.update');
    Route::delete('courses/{course}/sections/{section}/lectures/{lecture}', [InstructorLectureController::class, 'destroy'])->name('courses.sections.lectures.destroy');
    Route::post('courses/{course}/sections/{section}/lectures/reorder', [InstructorLectureController::class, 'reorder'])->name('courses.sections.lectures.reorder');

    // L8 Ray: Coupon CRUD (instruktur)
    Route::get('coupons/generate-code', [InstructorCouponController::class, 'generateCode'])->name('coupons.generate-code');
    Route::resource('coupons', InstructorCouponController::class)->except(['show', 'create', 'edit']);
    Route::patch('coupons/{coupon}/toggle', [InstructorCouponController::class, 'toggle'])->name('coupons.toggle');

    // Profil & Pengaturan instruktur
    Route::get('profile',  [InstructorDashboardController::class, 'profile'])->name('profile');
    Route::post('profile', [InstructorDashboardController::class, 'profileUpdate'])->name('profile.update');
    Route::get('setting',  [InstructorDashboardController::class, 'setting'])->name('setting');
    Route::post('setting', [InstructorDashboardController::class, 'settingUpdate'])->name('setting.update');
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
    Route::get('/notifications', [StudentDashboardController::class, 'notifications'])->name('notifications');
    Route::post('/notifications/{id}/read', [StudentDashboardController::class, 'markNotificationRead'])->name('notifications.read');
    Route::post('/notifications/read-all', [StudentDashboardController::class, 'markAllNotificationsRead'])->name('notifications.read-all');
    Route::get('/transactions', [StudentDashboardController::class, 'transactions'])->name('transactions');
    Route::get('/transactions/{payment}', [StudentDashboardController::class, 'transactionDetail'])->name('transactions.show');

    // L10 Albariqi: Course Player (butuh Enrollment dari L9)
    Route::get('/learn/{slug}', [CoursePlayerController::class, 'index'])->name('learn');
    Route::get('/learn/{slug}/{lecture}', [CoursePlayerController::class, 'show'])->name('learn.show');
    Route::post('/lecture/{lecture}/complete', [CoursePlayerController::class, 'markComplete'])->name('lecture.complete');
    // §3: GCS Signed URL — dipanggil frontend tepat sebelum play video GCS
    Route::get('/lecture/{lecture}/signed-url', [CoursePlayerController::class, 'signedUrl'])->name('lecture.signed-url');
    // Sertifikat — hanya pemilik yang bisa akses
    Route::get('/certificate/{code}', [CertificateController::class, 'show'])->name('student.certificate.show');
});

// Verifikasi sertifikat — publik, tanpa login
Route::get('/certificate/verify/{code}', [CertificateController::class, 'verify'])->name('certificate.verify');

// --- Google OAuth ---
Route::get('/auth/google', [GoogleController::class, 'redirect'])->name('auth.google');
Route::get('/auth/google-callback', [GoogleController::class, 'callback'])->name('auth.google.callback');

// =============================================================================
// FRONTEND ROUTES — Phase 2 & 3 (Placeholder — akan diimplementasi nanti)
// Route-route ini didaftarkan agar views tidak throw RouteNotFoundException
// =============================================================================

// Landing page & katalog kursus (Phase 2)
Route::get('/home', [HomeController::class, 'index'])->name('home');

// Profil publik instruktur
Route::get('/instructors/{user}', [PublicInstructorController::class, 'show'])->name('instructors.show');

// Course detail page — Fase 1 migrasi React+Inertia (ADR-008)
use App\Http\Controllers\Frontend\CourseDetailController;
Route::get('/courses/{slug}', [CourseDetailController::class, 'show'])->name('course.detail');

// L4 Ray: Cart — halaman React + add/remove/move-to-wishlist/count
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
    Route::post('/cart/{course}', [CartController::class, 'add'])->middleware('can.purchase')->name('cart.add');
    Route::delete('/cart/{id}', [CartController::class, 'remove'])->name('cart.remove');
    Route::post('/cart/{id}/move-to-wishlist', [CartController::class, 'moveToWishlist'])->name('cart.move-to-wishlist');
    Route::get('/cart/count', [CartController::class, 'count'])->name('cart.count');

    // L8 Ray: Apply / remove kupon di halaman cart
    Route::post('/coupon/apply', [FrontendCouponController::class, 'apply'])->name('coupon.apply');
    Route::post('/coupon/remove', [FrontendCouponController::class, 'remove'])->name('coupon.remove');
});

// L9 Yosua/Ray: Checkout + Midtrans + Enrollment (React + Inertia)
Route::middleware(['auth', 'verified', 'can.purchase'])->group(function () {
    Route::get('/checkout', [CheckoutController::class, 'index'])->name('checkout');
    Route::post('/checkout/process', [CheckoutController::class, 'process'])->name('checkout.process');
    Route::get('/checkout/process', fn() => redirect()->route('checkout'));
    Route::get('/payment/success', [CheckoutController::class, 'success'])->name('payment.success');
    Route::get('/payment/failed', [CheckoutController::class, 'failed'])->name('payment.failed');
});

// Midtrans Webhook (tanpa auth — Midtrans server call langsung; CSRF sudah di-exclude di bootstrap/app.php)
Route::post('/payment/callback', [CheckoutController::class, 'callback'])->name('payment.callback');

// Reviews — wired ke CourseDetailController@storeReview (sebelumnya placeholder mati)
Route::post('/courses/{course}/reviews', [CourseDetailController::class, 'storeReview'])
    ->middleware('auth')->name('course.review.store');

// L3 Ray: Wishlist toggle (add/remove) — JSON response untuk CourseCard
Route::post('/wishlist/{course}', [WishlistController::class, 'toggle'])->middleware(['auth', 'verified'])->name('wishlist.add');
// Badge count untuk navbar
Route::get('/wishlist/count', [WishlistController::class, 'count'])->middleware(['auth', 'verified'])->name('wishlist.count');

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



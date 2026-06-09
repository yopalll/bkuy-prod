<?php

namespace App\Http\Controllers\Backend\Student;

use App\Http\Controllers\Controller;
use App\Models\Enrollment;
use App\Models\Payment;
use App\Models\Wishlist;
use App\Models\Review;
use App\Models\LectureCompletion;
use Illuminate\Support\Str;
use App\Services\CloudinaryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        $enrollmentsCount = Enrollment::where('user_id', $user->id)->count();
        $wishlistCount    = Wishlist::where('user_id', $user->id)->count();
        $reviewsCount     = Review::where('user_id', $user->id)->count();

        $enrollments = Enrollment::where('user_id', $user->id)
            ->with(['course.instructor', 'course.sections.lectures'])
            ->latest('enrolled_at')
            ->take(3)
            ->get();

        $enrolledCoursesData    = [];
        $totalCompletedLectures = 0;
        $totalLectures          = 0;

        foreach ($enrollments as $enrollment) {
            $course = $enrollment->course;
            if (!$course) continue;

            $lectures           = $course->sections->flatMap(fn ($s) => $s->lectures);
            $courseLectureCount = $lectures->count();
            $totalLectures     += $courseLectureCount;

            $completedCount = 0;
            if ($courseLectureCount > 0) {
                $completedCount = LectureCompletion::where('user_id', $user->id)
                    ->whereIn('lecture_id', $lectures->pluck('id'))
                    ->count();
                $totalCompletedLectures += $completedCount;
            }

            $progress = $courseLectureCount > 0
                ? round(($completedCount / $courseLectureCount) * 100)
                : 0;

            $enrolledCoursesData[] = [
                'course'          => [
                    'id'        => $course->id,
                    'title'     => $course->title,
                    'slug'      => $course->slug,
                    'thumbnail' => $course->thumbnail,
                    'instructor' => $course->instructor ? ['name' => $course->instructor->name] : null,
                ],
                'progress'        => $progress,
                'lectures_count'  => $courseLectureCount,
                'completed_count' => $completedCount,
                'enrolled_at'     => $enrollment->enrolled_at,
            ];
        }

        $overallProgress = $totalLectures > 0
            ? round(($totalCompletedLectures / $totalLectures) * 100)
            : 0;

        return Inertia::render('Student/Dashboard', [
            'enrollmentsCount'   => $enrollmentsCount,
            'wishlistCount'      => $wishlistCount,
            'reviewsCount'       => $reviewsCount,
            'enrolledCoursesData'=> $enrolledCoursesData,
            'overallProgress'    => $overallProgress,
        ]);
    }

    public function myCourses()
    {
        $user        = auth()->user();
        $enrollments = Enrollment::where('user_id', $user->id)
            ->with(['course.instructor', 'course.category', 'course.sections.lectures'])
            ->latest('enrolled_at')
            ->get();

        $enrolledCoursesData = [];

        foreach ($enrollments as $enrollment) {
            $course = $enrollment->course;
            if (!$course) continue;

            $lectures           = $course->sections->flatMap(fn ($s) => $s->lectures);
            $courseLectureCount = $lectures->count();

            $completedCount = 0;
            if ($courseLectureCount > 0) {
                $completedCount = LectureCompletion::where('user_id', $user->id)
                    ->whereIn('lecture_id', $lectures->pluck('id'))
                    ->count();
            }

            $progress = $courseLectureCount > 0
                ? round(($completedCount / $courseLectureCount) * 100)
                : 0;

            // Auto-generate sertifikat untuk kursus yang sudah 100% tapi belum punya kode
            if ($progress === 100 && $courseLectureCount > 0 && !$enrollment->certificate_code) {
                $code = strtoupper(Str::random(8)) . '-' . strtoupper(Str::random(8)) . '-' . strtoupper(Str::random(8));
                $enrollment->update(['certificate_code' => $code, 'issued_at' => now()]);
            }

            $enrolledCoursesData[] = [
                'course' => [
                    'id'        => $course->id,
                    'title'     => $course->title,
                    'slug'      => $course->slug,
                    'thumbnail' => $course->thumbnail,
                    'category'  => $course->category ? ['name' => $course->category->name] : null,
                    'instructor'=> $course->instructor ? ['name' => $course->instructor->name] : null,
                ],
                'progress'         => $progress,
                'lectures_count'   => $courseLectureCount,
                'completed_count'  => $completedCount,
                'enrolled_at'      => $enrollment->enrolled_at,
                'certificate_code' => $enrollment->certificate_code,
            ];
        }

        return Inertia::render('Student/MyCourses', [
            'enrolledCoursesData' => $enrolledCoursesData,
        ]);
    }

    public function profile()
    {
        $user = auth()->user();

        return Inertia::render('Student/Profile', [
            'profileUser' => [
                'id'      => $user->id,
                'name'    => $user->name,
                'email'   => $user->email,
                'phone'   => $user->phone   ?? '',
                'address' => $user->address ?? '',
                'bio'     => $user->bio      ?? '',
                'photo'   => $user->photo    ?? null,
            ],
            'defaultTab' => 'profile',
        ]);
    }

    public function profileUpdate(Request $request)
    {
        $user = auth()->user();

        $request->validate([
            'name'    => ['required', 'string', 'max:255'],
            'phone'   => ['nullable', 'string', 'max:20'],
            'address' => ['nullable', 'string'],
            'bio'     => ['nullable', 'string'],
            'photo'   => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif,svg', 'max:2048'],
        ]);

        $data = $request->only(['name', 'phone', 'address', 'bio']);

        if ($request->hasFile('photo')) {
            $cloudinary = app(CloudinaryService::class);

            // Hapus foto lama dari Cloudinary jika URL Cloudinary
            if ($user->photo && str_contains($user->photo, 'cloudinary.com')) {
                // Ekstrak public_id dari URL: .../upload/v{ver}/{folder}/{name}.{ext}
                if (preg_match('/\/upload\/(?:v\d+\/)?(.+?)(?:\.\w+)?$/', $user->photo, $m)) {
                    $cloudinary->deleteImage($m[1]);
                }
            }

            $result = $cloudinary->uploadImage($request->file('photo'), 'belajarkuy/profiles');
            $data['photo'] = $result['url'];
        }

        $user->update($data);

        return redirect()->route('student.profile')->with('success', 'Profil berhasil diperbarui.');
    }

    public function setting()
    {
        $user = auth()->user();

        return Inertia::render('Student/Profile', [
            'profileUser' => [
                'id'      => $user->id,
                'name'    => $user->name,
                'email'   => $user->email,
                'phone'   => $user->phone   ?? '',
                'address' => $user->address ?? '',
                'bio'     => $user->bio      ?? '',
                'photo'   => $user->photo    ?? null,
            ],
            'defaultTab' => 'security',
        ]);
    }

    public function settingUpdate(Request $request)
    {
        $request->validate([
            'current_password' => ['required', 'current_password'],
            'password'         => ['required', Password::defaults(), 'confirmed'],
        ]);

        $request->user()->update([
            'password' => Hash::make($request->password),
        ]);

        return redirect()->route('student.setting')->with('success', 'Kata sandi berhasil diperbarui.');
    }

    public function notifications()
    {
        $user  = auth()->user();
        $items = $user->notifications()
            ->latest()
            ->take(50)
            ->get()
            ->map(fn ($n) => [
                'id'           => $n->id,
                'type'         => $n->data['type']         ?? 'system',
                'title'        => $n->data['title']        ?? '',
                'body'         => $n->data['body']         ?? '',
                'icon'         => $n->data['icon']         ?? 'notifications',
                'url'          => $n->data['url']          ?? null,
                'action_label' => $n->data['action_label'] ?? null,
                'action_url'   => $n->data['action_url']   ?? null,
                'read_at'      => $n->read_at,
                'time_ago'     => $n->created_at->diffForHumans(),
            ]);

        return Inertia::render('Student/Notifications', [
            'notifications' => $items,
        ]);
    }

    public function markNotificationRead(string $id): JsonResponse
    {
        $notif = auth()->user()->notifications()->findOrFail($id);
        $notif->markAsRead();
        return response()->json(['ok' => true]);
    }

    public function markAllNotificationsRead(): JsonResponse
    {
        auth()->user()->unreadNotifications->markAsRead();
        return response()->json(['ok' => true]);
    }

    public function transactions()
    {
        $payments = Payment::where('user_id', auth()->id())
            ->with(['orders.course:id,title,thumbnail,slug', 'coupon:id,code,discount_percent'])
            ->latest()
            ->paginate(15);

        $payments->through(fn ($p) => [
            'id'                => $p->id,
            'midtrans_order_id' => $p->midtrans_order_id,
            'status'            => $p->status,
            'total_amount'      => $p->total_amount,
            'payment_type'      => $p->payment_type,
            'coupon_code'       => $p->coupon?->code,
            'created_at_human'  => $p->created_at->format('d M Y, H:i'),
            'orders'            => $p->orders->map(fn ($o) => [
                'id'          => $o->id,
                'final_price' => $o->final_price,
                'course'      => $o->course ? [
                    'title'     => $o->course->title,
                    'thumbnail' => $o->course->thumbnail,
                    'slug'      => $o->course->slug,
                ] : null,
            ]),
        ]);

        return Inertia::render('Student/Transactions', [
            'payments' => $payments,
        ]);
    }

    public function transactionDetail(Payment $payment)
    {
        abort_unless($payment->user_id === auth()->id(), 403);

        $payment->load(['orders.course:id,title,thumbnail,slug', 'coupon:id,code,discount_percent']);

        return Inertia::render('Student/TransactionDetail', [
            'payment' => [
                'id'                => $payment->id,
                'midtrans_order_id' => $payment->midtrans_order_id,
                'status'            => $payment->status,
                'total_amount'      => $payment->total_amount,
                'payment_type'      => $payment->payment_type,
                'coupon_code'       => $payment->coupon?->code,
                'coupon_discount'   => $payment->coupon?->discount_percent,
                'created_at_human'  => $payment->created_at->format('d M Y, H:i'),
                'orders'            => $payment->orders->map(fn ($o) => [
                    'id'              => $o->id,
                    'original_price'  => $o->original_price,
                    'discount_amount' => $o->discount_amount,
                    'final_price'     => $o->final_price,
                    'course'          => $o->course ? [
                        'title'     => $o->course->title,
                        'thumbnail' => $o->course->thumbnail,
                        'slug'      => $o->course->slug,
                    ] : null,
                ]),
            ],
        ]);
    }
}

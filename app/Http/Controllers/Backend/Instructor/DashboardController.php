<?php

namespace App\Http\Controllers\Backend\Instructor;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\Order;
use App\Services\CloudinaryService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the Instructor dashboard.
     * Shows instructor-specific stats: their courses, enrollments, gross revenue.
     */
    public function index(): Response
    {
        $instructor = Auth::user();

        $courses = Course::where('instructor_id', $instructor->id)->withCount('enrollments')->get();

        $stats = [
            'total_courses'     => $courses->count(),
            'total_enrollments' => $courses->sum('enrollments_count'),
            // Gross revenue — ADR-005: no payout split
            'gross_revenue'     => Order::whereIn('course_id', $courses->pluck('id'))
                                        ->where('status', 'completed')
                                        ->sum('final_price'),
        ];

        return Inertia::render('Instructor/Dashboard', [
            'stats'   => $stats,
            'courses' => $courses->map(fn ($c) => [
                'id'                => $c->id,
                'title'             => $c->title,
                'slug'              => $c->slug,
                'status'            => $c->status,
                'thumbnail'         => $c->thumbnail,
                'enrollments_count' => $c->enrollments_count,
                'price'             => $c->price,
                'discount'          => $c->discount,
                'discounted_price'  => $c->discounted_price,
            ]),
        ]);
    }

    public function profile(): Response
    {
        $user = Auth::user();
        return Inertia::render('Instructor/Profile', [
            'profileUser' => [
                'id'      => $user->id,
                'name'    => $user->name,
                'email'   => $user->email,
                'phone'   => $user->phone   ?? '',
                'address' => $user->address ?? '',
                'bio'     => $user->bio     ?? '',
                'website' => $user->website ?? '',
                'photo'   => $user->photo   ?? null,
            ],
            'defaultTab' => 'profile',
        ]);
    }

    public function profileUpdate(Request $request)
    {
        $user = Auth::user();

        $request->validate([
            'name'    => ['required', 'string', 'max:255'],
            'phone'   => ['nullable', 'string', 'max:20'],
            'address' => ['nullable', 'string'],
            'bio'     => ['nullable', 'string'],
            'website' => ['nullable', 'url', 'max:255'],
            'photo'   => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif,svg', 'max:2048'],
        ]);

        $data = $request->only(['name', 'phone', 'address', 'bio', 'website']);

        if ($request->hasFile('photo')) {
            $cloudinary = app(CloudinaryService::class);
            if ($user->photo && str_contains($user->photo, 'cloudinary.com')) {
                if (preg_match('/\/upload\/(?:v\d+\/)?(.+?)(?:\.\w+)?$/', $user->photo, $m)) {
                    $cloudinary->deleteImage($m[1]);
                }
            }
            $result = $cloudinary->uploadImage($request->file('photo'), 'belajarkuy/profiles');
            $data['photo'] = $result['url'];
        }

        $user->update($data);

        return redirect()->route('instructor.profile')->with('success', 'Profil berhasil diperbarui.');
    }

    public function setting(): Response
    {
        $user = Auth::user();
        return Inertia::render('Instructor/Profile', [
            'profileUser' => [
                'id'      => $user->id,
                'name'    => $user->name,
                'email'   => $user->email,
                'phone'   => $user->phone   ?? '',
                'address' => $user->address ?? '',
                'bio'     => $user->bio     ?? '',
                'website' => $user->website ?? '',
                'photo'   => $user->photo   ?? null,
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

        return redirect()->route('instructor.setting')->with('success', 'Kata sandi berhasil diperbarui.');
    }
}

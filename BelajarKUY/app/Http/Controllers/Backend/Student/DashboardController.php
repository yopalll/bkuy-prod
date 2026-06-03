<?php

namespace App\Http\Controllers\Backend\Student;

use App\Http\Controllers\Controller;
use App\Models\Enrollment;
use App\Models\Wishlist;
use App\Models\Review;
use App\Models\LectureCompletion;
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

            $enrolledCoursesData[] = [
                'course' => [
                    'id'        => $course->id,
                    'title'     => $course->title,
                    'slug'      => $course->slug,
                    'thumbnail' => $course->thumbnail,
                    'category'  => $course->category ? ['name' => $course->category->name] : null,
                    'instructor'=> $course->instructor ? ['name' => $course->instructor->name] : null,
                ],
                'progress'        => $progress,
                'lectures_count'  => $courseLectureCount,
                'completed_count' => $completedCount,
                'enrolled_at'     => $enrollment->enrolled_at,
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
            $file     = $request->file('photo');
            $filename = 'profile_' . $user->id . '_' . time() . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('uploads/profile'), $filename);

            if ($user->photo && !str_starts_with($user->photo, 'http')) {
                $old = public_path($user->photo);
                if (file_exists($old)) @unlink($old);
            }

            $data['photo'] = 'uploads/profile/' . $filename;
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
        return Inertia::render('Student/Notifications', [
            'notifications' => [],
        ]);
    }
}

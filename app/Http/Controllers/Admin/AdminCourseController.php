<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Mail\CourseApprovedMail;
use App\Mail\CourseRejectedMail;
use App\Models\Course;
use App\Models\CourseLecture;
use App\Notifications\CourseStatusNotification;
use App\Services\GcsVideoService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class AdminCourseController extends Controller
{
    public function index()
    {
        $courses = Course::with(['instructor', 'category'])
            ->latest()
            ->paginate(15);

        return Inertia::render('Admin/Courses/Index', compact('courses'));
    }

    public function show(Course $course)
    {
        $course->load([
            'instructor',
            'category',
            'subCategory',
            'goals',
            'sections.lectures',
        ]);

        $sections = $course->sections
            ->sortBy('sort_order')
            ->values()
            ->map(function ($section) {
                return [
                    'id'       => $section->id,
                    'title'    => $section->title,
                    'lectures' => $section->lectures
                        ->sortBy('sort_order')
                        ->values()
                        ->map(fn ($lecture) => $this->serializeLecture($lecture)),
                ];
            });

        return Inertia::render('Admin/Courses/Show', [
            'course' => [
                'id'            => $course->id,
                'title'         => $course->title,
                'slug'          => $course->slug,
                'description'   => $course->description,
                'status'        => $course->status,
                'price'         => $course->price,
                'thumbnail_url' => $course->thumbnail_url,
                'instructor'    => $course->instructor?->only('id', 'name', 'email'),
                'category'      => $course->category?->only('id', 'name'),
                'goals'         => $course->goals->map(fn ($g) => ['id' => $g->id, 'goal' => $g->goal])->values(),
                'sections'      => $sections,
            ],
        ]);
    }

    private function serializeLecture(CourseLecture $lecture): array
    {
        $type = $this->resolveLectureType($lecture);

        return [
            'id'          => $lecture->id,
            'title'       => $lecture->title,
            'source_type' => $type,
            'duration'    => $lecture->duration,
            'content'     => $type === 'text' ? $lecture->content : null,
            'youtube_url' => $type === 'youtube' ? ($lecture->video_path ?: $lecture->url) : null,
            'has_video'   => $type === 'gcs' && ! empty($lecture->video_path),
        ];
    }

    private function resolveLectureType(CourseLecture $lecture): string
    {
        $isYoutube = $lecture->source_type === 'youtube'
            || $lecture->video_type === 'youtube'
            || str_contains((string) $lecture->video_path, 'youtube.com');

        if ($isYoutube) return 'youtube';
        if (! empty($lecture->video_path)) return 'gcs';
        return 'text';
    }

    public function previewUrl(Course $course, CourseLecture $lecture): JsonResponse
    {
        abort_unless(
            $lecture->section()->where('course_id', $course->id)->exists(),
            404
        );
        abort_unless($this->resolveLectureType($lecture) === 'gcs' && $lecture->video_path, 404);

        if (! GcsVideoService::isConfigured()) {
            return response()->json(['error' => 'GCS belum dikonfigurasi.'], 503);
        }

        return response()->json(['url' => app(GcsVideoService::class)->signedUrl($lecture->video_path)]);
    }

    public function updateStatus(Request $request, Course $course)
    {
        $validated = $request->validate([
            'status'     => ['required', 'string', 'in:active,inactive'],
            'reason'     => ['nullable', 'string', 'max:2000'],
            'suggestion' => ['nullable', 'string', 'max:2000'],
        ]);

        $oldStatus = $course->status;

        if ($validated['status'] === 'active') {
            $course->update([
                'status'               => 'active',
                'rejection_reason'     => null,
                'rejection_suggestion' => null,
                'reviewed_at'          => now(),
            ]);
        } else {
            $course->update([
                'status'               => 'inactive',
                'rejection_reason'     => $validated['reason'] ?? null,
                'rejection_suggestion' => $validated['suggestion'] ?? null,
                'reviewed_at'          => now(),
            ]);
        }

        $course->load('instructor', 'category');

        if ($validated['status'] === 'active' && $oldStatus !== 'active') {
            if ($course->instructor?->email) {
                Mail::to($course->instructor->email)->queue(new CourseApprovedMail($course));
            }
            $course->instructor?->notify(new CourseStatusNotification($course, 'active'));

        } elseif ($validated['status'] === 'inactive' && $oldStatus !== 'inactive') {
            $feedback = $this->composeFeedback($validated['reason'] ?? null, $validated['suggestion'] ?? null);
            if ($course->instructor?->email) {
                Mail::to($course->instructor->email)->queue(new CourseRejectedMail($course, $feedback));
            }
            $course->instructor?->notify(new CourseStatusNotification($course, 'inactive', $feedback));
        }

        return redirect()->back()->with('success', 'Status kursus berhasil diperbarui menjadi ' . ucfirst($validated['status']) . '.');
    }

    private function composeFeedback(?string $reason, ?string $suggestion): ?string
    {
        $parts = array_filter([
            $reason    ? trim($reason)    : null,
            $suggestion ? 'Saran perbaikan: ' . trim($suggestion) : null,
        ]);

        return $parts ? implode(' — ', $parts) : null;
    }
}

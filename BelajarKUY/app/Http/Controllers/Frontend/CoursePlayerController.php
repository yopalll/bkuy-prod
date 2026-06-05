<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\CourseLecture;
use App\Models\Enrollment;
use App\Models\LectureCompletion;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

/**
 * CoursePlayerController (L10 — Albariqi)
 *
 * Guard: hanya user yang sudah ter-enroll di kursus tsb.
 * URL: GET /student/learn/{slug}         → auto-redirect ke first uncompleted lecture
 *      GET /student/learn/{slug}/{lecture} → tampilkan lecture (Inertia Player)
 *      POST /student/lecture/{lecture}/complete → toggle LectureCompletion (JSON)
 */
class CoursePlayerController extends Controller
{
    /**
     * Entry point — auto-redirect ke lecture pertama yang belum selesai.
     */
    public function index(string $slug): RedirectResponse
    {
        $course = Course::where('slug', $slug)
            ->with(['sections' => fn ($q) => $q->orderBy('sort_order'), 'sections.lectures'])
            ->firstOrFail();

        abort_unless($this->isEnrolled($course->id), 403, 'Anda belum terdaftar di kursus ini.');

        $first = $this->findNextLecture($course);

        if (!$first) {
            // Semua lecture selesai — redirect ke lecture terakhir
            $last = $course->sections->flatMap->lectures->last();
            if (!$last) {
                return redirect()->route('student.my-courses')
                    ->with('info', 'Kursus ini belum memiliki materi.');
            }
            return redirect()->route('student.learn.show', ['slug' => $slug, 'lecture' => $last->id]);
        }

        return redirect()->route('student.learn.show', ['slug' => $slug, 'lecture' => $first->id]);
    }

    /**
     * Tampilkan lecture tertentu di Course Player.
     */
    public function show(string $slug, int $lectureId): InertiaResponse|RedirectResponse
    {
        $course = Course::where('slug', $slug)
            ->with([
                'instructor:id,name',
                'sections' => fn ($q) => $q->orderBy('sort_order'),
                'sections.lectures' => fn ($q) => $q->orderBy('sort_order'),
            ])
            ->firstOrFail();

        abort_unless($this->isEnrolled($course->id), 403, 'Anda belum terdaftar di kursus ini.');

        // Validasi lecture milik course ini
        $currentLecture = CourseLecture::whereHas(
            'section',
            fn ($q) => $q->where('course_id', $course->id)
        )->findOrFail($lectureId);

        // Semua lecture ID di kursus ini
        $allLectureIds = $course->sections->flatMap->lectures->pluck('id');

        // Lecture yang sudah selesai oleh user ini
        $completedIds = LectureCompletion::where('user_id', auth()->id())
            ->whereIn('lecture_id', $allLectureIds)
            ->pluck('lecture_id')
            ->toArray();

        // Hitung progress
        $totalLectures   = $allLectureIds->count();
        $completedCount  = count($completedIds);
        $progress        = $totalLectures > 0
            ? round(($completedCount / $totalLectures) * 100, 1)
            : 0;

        // Tentukan apakah semua selesai
        $allCompleted = ($totalLectures > 0 && $completedCount >= $totalLectures);

        // Navigasi prev/next
        $flat = $course->sections->flatMap->lectures->values();
        $currentIndex = $flat->search(fn ($l) => $l->id === $currentLecture->id);
        $prevLecture  = $currentIndex > 0 ? $flat[$currentIndex - 1] : null;
        $nextLecture  = ($currentIndex !== false && $currentIndex < $flat->count() - 1)
            ? $flat[$currentIndex + 1]
            : null;

        return Inertia::render('Courses/Player', [
            'course'          => [
                'id'         => $course->id,
                'title'      => $course->title,
                'slug'       => $course->slug,
                'thumbnail'  => $course->thumbnail,
                'instructor' => $course->instructor,
                'sections'   => $course->sections->map(fn ($section) => [
                    'id'       => $section->id,
                    'title'    => $section->title,
                    'lectures' => $section->lectures->map(fn ($lecture) => [
                        'id'       => $lecture->id,
                        'title'    => $lecture->title,
                        'url'      => $lecture->url,
                        'duration' => $lecture->duration,
                        'content'  => $lecture->content,
                    ]),
                ]),
            ],
            'currentLecture'  => [
                'id'       => $currentLecture->id,
                'title'    => $currentLecture->title,
                'url'      => $currentLecture->url,
                'duration' => $currentLecture->duration,
                'content'  => $currentLecture->content,
            ],
            'completedIds'    => $completedIds,
            'progress'        => $progress,
            'completedCount'  => $completedCount,
            'totalLectures'   => $totalLectures,
            'allCompleted'    => $allCompleted,
            'prevLectureId'   => $prevLecture?->id,
            'nextLectureId'   => $nextLecture?->id,
        ]);
    }

    /**
     * Toggle LectureCompletion — idempotent firstOrCreate.
     * Returns JSON: { completed, progress, completed_count, total_lectures, next_lecture_id }
     */
    public function markComplete(int $lectureId): JsonResponse
    {
        $lecture  = CourseLecture::with('section.course')->findOrFail($lectureId);
        $courseId = $lecture->section->course->id;

        abort_unless($this->isEnrolled($courseId), 403, 'Anda belum terdaftar di kursus ini.');

        LectureCompletion::firstOrCreate(
            ['user_id' => auth()->id(), 'lecture_id' => $lectureId],
            ['completed_at' => now()]
        );

        // Recalculate
        $allLectureIds  = CourseLecture::whereHas('section', fn ($q) => $q->where('course_id', $courseId))->pluck('id');
        $totalLectures  = $allLectureIds->count();
        $completedCount = LectureCompletion::where('user_id', auth()->id())
            ->whereIn('lecture_id', $allLectureIds)
            ->count();
        $progress = $totalLectures > 0 ? round(($completedCount / $totalLectures) * 100, 1) : 0;

        // Cari next lecture
        $course     = Course::with([
            'sections' => fn ($q) => $q->orderBy('sort_order'),
            'sections.lectures' => fn ($q) => $q->orderBy('sort_order'),
        ])->find($courseId);
        $nextLecture = $this->findNextLecture($course);

        return response()->json([
            'completed'       => true,
            'progress'        => $progress,
            'completed_count' => $completedCount,
            'total_lectures'  => $totalLectures,
            'next_lecture_id' => $nextLecture?->id,
        ]);
    }

    // ─────────────────────── Helpers ──────────────────────────

    private function isEnrolled(int $courseId): bool
    {
        return Enrollment::where('user_id', auth()->id())
            ->where('course_id', $courseId)
            ->exists();
    }

    /**
     * Cari lecture pertama yang belum selesai (urut section + lecture sort_order).
     */
    private function findNextLecture(Course $course): ?CourseLecture
    {
        $completedIds = LectureCompletion::where('user_id', auth()->id())->pluck('lecture_id');

        foreach ($course->sections as $section) {
            foreach ($section->lectures as $lecture) {
                if (!$completedIds->contains($lecture->id)) {
                    return $lecture;
                }
            }
        }

        return null; // semua selesai
    }
}

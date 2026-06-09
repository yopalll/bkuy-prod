<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\CourseLecture;
use App\Models\Enrollment;
use App\Models\LectureCompletion;
use App\Services\GcsVideoService;
use Illuminate\Support\Str;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;

/**
 * CoursePlayerController (L10 — Albariqi)
 *
 * Guard: hanya user yang sudah ter-enroll di kursus tsb.
 * URL: GET /student/learn/{slug}         → auto-redirect ke first uncompleted lecture
 *      GET /student/learn/{slug}/{lecture} → tampilkan lecture (Inertia Player)
 *      GET /student/lecture/{lecture}/signed-url → generate GCS Signed URL (JSON)
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
            ->with([
                'sections' => fn ($q) => $q->orderBy('sort_order'),
                'sections.lectures' => fn ($q) => $q->orderBy('sort_order'),
            ])
            ->firstOrFail();

        abort_unless($this->isEnrolled($course->id), 403, 'Anda belum terdaftar di kursus ini.');

        $first = $this->findNextLecture($course);

        if (!$first) {
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

        $currentLecture = CourseLecture::whereHas(
            'section',
            fn ($q) => $q->where('course_id', $course->id)
        )->findOrFail($lectureId);

        $allLectureIds = $course->sections->flatMap->lectures->pluck('id');

        $completedIds = LectureCompletion::where('user_id', auth()->id())
            ->whereIn('lecture_id', $allLectureIds)
            ->pluck('lecture_id')
            ->toArray();

        $totalLectures  = $allLectureIds->count();
        $completedCount = count($completedIds);
        $progress       = $totalLectures > 0
            ? round(($completedCount / $totalLectures) * 100, 1)
            : 0;

        $allCompleted = ($totalLectures > 0 && $completedCount >= $totalLectures);

        // Ambil / generate certificate_code jika kursus sudah 100% selesai
        $enrollment = Enrollment::where('user_id', auth()->id())->where('course_id', $course->id)->first();
        if ($allCompleted && $enrollment && !$enrollment->certificate_code) {
            $code = strtoupper(Str::random(8)) . '-' . strtoupper(Str::random(8)) . '-' . strtoupper(Str::random(8));
            $enrollment->update(['certificate_code' => $code, 'issued_at' => now()]);
            $enrollment->refresh();
        }
        $certificateCode = $enrollment?->certificate_code;

        $flat         = $course->sections->flatMap->lectures->values();
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
                        'id'          => $lecture->id,
                        'title'       => $lecture->title,
                        'source_type' => $lecture->source_type ?? 'youtube',
                        'duration'    => $lecture->duration,
                    ]),
                ]),
            ],
            'currentLecture'  => $this->buildLecturePayload($currentLecture),
            'completedIds'    => $completedIds,
            'progress'        => $progress,
            'completedCount'  => $completedCount,
            'totalLectures'   => $totalLectures,
            'allCompleted'    => $allCompleted,
            'prevLectureId'   => $prevLecture?->id,
            'nextLectureId'   => $nextLecture?->id,
            'certificateCode' => $certificateCode,
        ]);
    }

    /**
     * Generate GCS Signed URL (1 jam) untuk lecture ber-source_type gcs.
     * Dipanggil frontend tepat sebelum play.
     */
    public function signedUrl(int $lectureId): JsonResponse
    {
        $lecture  = CourseLecture::with('section.course')->findOrFail($lectureId);
        $courseId = $lecture->section->course->id;

        abort_unless($this->isEnrolled($courseId), 403, 'Anda belum terdaftar di kursus ini.');
        abort_unless($lecture->source_type === 'gcs' && $lecture->video_path, 404, 'Lecture ini bukan video GCS.');

        if (!GcsVideoService::isConfigured()) {
            return response()->json(['error' => 'GCS belum dikonfigurasi.'], 503);
        }

        $url = app(GcsVideoService::class)->signedUrl($lecture->video_path);

        return response()->json([
            'url'        => $url,
            'expires_in' => 3600,
        ]);
    }

    /**
     * Toggle LectureCompletion — idempotent firstOrCreate.
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

        $allLectureIds  = CourseLecture::whereHas('section', fn ($q) => $q->where('course_id', $courseId))->pluck('id');
        $totalLectures  = $allLectureIds->count();
        $completedCount = LectureCompletion::where('user_id', auth()->id())
            ->whereIn('lecture_id', $allLectureIds)
            ->count();
        $progress = $totalLectures > 0 ? round(($completedCount / $totalLectures) * 100, 1) : 0;

        $course      = Course::with([
            'sections' => fn ($q) => $q->orderBy('sort_order'),
            'sections.lectures' => fn ($q) => $q->orderBy('sort_order'),
        ])->find($courseId);
        $nextLecture = $this->findNextLecture($course);

        // Auto-generate sertifikat saat semua lecture selesai
        $certificateCode = null;
        if ($completedCount >= $totalLectures) {
            $enrollment = Enrollment::where('user_id', auth()->id())
                ->where('course_id', $courseId)
                ->first();

            if ($enrollment && !$enrollment->certificate_code) {
                $code = strtoupper(Str::random(8)) . '-' . strtoupper(Str::random(8)) . '-' . strtoupper(Str::random(8));
                $enrollment->update([
                    'certificate_code' => $code,
                    'issued_at'        => now(),
                ]);
            }

            $certificateCode = $enrollment?->certificate_code;
        }

        return response()->json([
            'completed'        => true,
            'progress'         => $progress,
            'completed_count'  => $completedCount,
            'total_lectures'   => $totalLectures,
            'next_lecture_id'  => $nextLecture?->id,
            'certificate_code' => $certificateCode,
        ]);
    }

    // ─────────────────────── Helpers ──────────────────────────

    private function isEnrolled(int $courseId): bool
    {
        return Enrollment::where('user_id', auth()->id())
            ->where('course_id', $courseId)
            ->exists();
    }

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

        return null;
    }

    /**
     * Buat payload lecture untuk Inertia.
     * GCS: jangan bocorkan video_path — frontend akan minta signed URL terpisah.
     * YouTube: kirim video_path (embed URL) langsung.
     */
    private function buildLecturePayload(CourseLecture $lecture): array
    {
        $payload = [
            'id'          => $lecture->id,
            'title'       => $lecture->title,
            'source_type' => $lecture->source_type ?? 'youtube',
            'duration'    => $lecture->duration,
            'content'     => $lecture->content,
        ];

        if (($lecture->source_type ?? 'youtube') === 'youtube') {
            $payload['video_path'] = $lecture->video_path;
        }
        // GCS: tidak ada video_path di payload (hindari bocor URL GCS mentah)

        return $payload;
    }
}

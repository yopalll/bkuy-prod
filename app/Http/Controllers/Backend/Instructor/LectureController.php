<?php

namespace App\Http\Controllers\Backend\Instructor;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\CourseLecture;
use App\Models\CourseSection;
use App\Services\GcsVideoService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LectureController extends Controller
{
    private function authorizedCourse(int $courseId): Course
    {
        return Course::where('id', $courseId)
            ->where('instructor_id', Auth::id())
            ->firstOrFail();
    }

    private function authorizedSection(Course $course, int $sectionId): CourseSection
    {
        return CourseSection::where('id', $sectionId)
            ->where('course_id', $course->id)
            ->firstOrFail();
    }

    /**
     * Normalisasi URL YouTube ke format embed https://www.youtube.com/embed/{id}.
     * Mengembalikan null jika URL bukan YouTube yang valid.
     */
    private function normalizeYoutubeUrl(string $url): ?string
    {
        $url = trim($url);

        if (empty($url)) {
            return null;
        }

        // ID 11-karakter polos
        if (preg_match('/^([\w-]{11})$/', $url, $m)) {
            return 'https://www.youtube.com/embed/' . $m[1];
        }

        // Berbagai format YouTube URL
        if (preg_match(
            '/(?:youtu\.be\/|youtube\.com\/(?:embed\/|watch\?(?:[^#]*&)?v=|v\/|shorts\/))([\w-]{11})/',
            $url,
            $m
        )) {
            return 'https://www.youtube.com/embed/' . $m[1];
        }

        return null;
    }

    public function store(Request $request, Course $course, CourseSection $section): RedirectResponse
    {
        $this->authorizedCourse($course->id);
        $this->authorizedSection($course, $section->id);

        $validated = $request->validate([
            'title'        => 'required|string|max:255',
            'source_type'  => 'required|in:youtube,gcs',
            'youtube_url'  => 'nullable|string|max:1000',
            'video_file'   => 'nullable|file|mimes:mp4,webm,ogg,mov|max:512000',
            'content'      => 'nullable|string',
            'duration'     => 'nullable|integer|min:0',
        ]);

        $sourceType = $validated['source_type'];
        $videoPath  = null;

        if ($sourceType === 'youtube') {
            $videoPath = $this->normalizeYoutubeUrl($validated['youtube_url'] ?? '');
            if (!$videoPath) {
                return back()->withErrors(['youtube_url' => 'URL YouTube tidak valid.'])->withInput();
            }
        } elseif ($sourceType === 'gcs' && $request->hasFile('video_file')) {
            if (!GcsVideoService::isConfigured()) {
                return back()->withErrors(['video_file' => 'GCS belum dikonfigurasi. Hubungi administrator.'])->withInput();
            }
            $gcs = app(GcsVideoService::class);
            try {
                $videoPath = $gcs->upload($request->file('video_file'), $course->id);
            } catch (\Throwable $e) {
                return back()->withErrors(['video_file' => 'Gagal mengunggah video: ' . $e->getMessage()])->withInput();
            }
        }

        $section->lectures()->create([
            'title'       => $validated['title'],
            'source_type' => $sourceType,
            'video_path'  => $videoPath,
            'content'     => $validated['content'] ?? null,
            'duration'    => $validated['duration'] ?? 0,
            'sort_order'  => $section->lectures()->count() + 1,
        ]);

        return back()->with('success', 'Lecture berhasil ditambahkan.');
    }

    public function update(Request $request, Course $course, CourseSection $section, CourseLecture $lecture): RedirectResponse
    {
        $this->authorizedCourse($course->id);
        abort_unless($lecture->section_id === $section->id, 403);
        abort_unless($section->course_id === $course->id, 403);

        $validated = $request->validate([
            'title'        => 'required|string|max:255',
            'source_type'  => 'required|in:youtube,gcs',
            'youtube_url'  => 'nullable|string|max:1000',
            'video_file'   => 'nullable|file|mimes:mp4,webm,ogg,mov|max:512000',
            'content'      => 'nullable|string',
            'duration'     => 'nullable|integer|min:0',
        ]);

        $sourceType = $validated['source_type'];
        $videoPath  = $lecture->video_path; // pertahankan path lama by default

        if ($sourceType === 'youtube') {
            // Hanya update video_path jika ada URL baru dikirim
            if (!empty($validated['youtube_url'])) {
                $newPath = $this->normalizeYoutubeUrl($validated['youtube_url']);
                if (!$newPath) {
                    return back()->withErrors(['youtube_url' => 'URL YouTube tidak valid.'])->withInput();
                }
                // Jika sebelumnya GCS, hapus objek lama
                if ($lecture->source_type === 'gcs' && $lecture->video_path) {
                    if (GcsVideoService::isConfigured()) {
                        app(GcsVideoService::class)->delete($lecture->video_path);
                    }
                }
                $videoPath = $newPath;
            } elseif ($lecture->source_type !== 'youtube') {
                // Ganti sumber tapi tidak ada URL baru → tahan path kosong, minta URL
                return back()->withErrors(['youtube_url' => 'URL YouTube wajib diisi.'])->withInput();
            }
        } elseif ($sourceType === 'gcs') {
            if ($request->hasFile('video_file')) {
                if (!GcsVideoService::isConfigured()) {
                    return back()->withErrors(['video_file' => 'GCS belum dikonfigurasi. Hubungi administrator.'])->withInput();
                }
                $gcs = app(GcsVideoService::class);
                try {
                    $videoPath = $gcs->upload($request->file('video_file'), $course->id);
                } catch (\Throwable $e) {
                    return back()->withErrors(['video_file' => 'Gagal mengunggah video: ' . $e->getMessage()])->withInput();
                }
                // Hapus file GCS lama hanya setelah upload baru sukses
                if ($lecture->source_type === 'gcs' && $lecture->video_path) {
                    $gcs->delete($lecture->video_path);
                }
            }
            // Tidak ada file baru → pertahankan path lama (video_path tetap)
        }

        $lecture->update([
            'title'       => $validated['title'],
            'source_type' => $sourceType,
            'video_path'  => $videoPath,
            'content'     => $validated['content'] ?? null,
            'duration'    => $validated['duration'] ?? 0,
        ]);

        return back()->with('success', 'Lecture berhasil diperbarui.');
    }

    public function destroy(Course $course, CourseSection $section, CourseLecture $lecture): RedirectResponse
    {
        $this->authorizedCourse($course->id);
        abort_unless($lecture->section_id === $section->id, 403);
        abort_unless($section->course_id === $course->id, 403);

        // Hapus file GCS jika ada
        if ($lecture->source_type === 'gcs' && $lecture->video_path) {
            if (GcsVideoService::isConfigured()) {
                app(GcsVideoService::class)->delete($lecture->video_path);
            }
        }

        $lecture->delete();

        $section->lectures()->orderBy('sort_order')->get()
            ->each(fn ($l, $i) => $l->update(['sort_order' => $i + 1]));

        return back()->with('success', 'Lecture berhasil dihapus.');
    }

    public function reorder(Request $request, Course $course, CourseSection $section): RedirectResponse
    {
        $this->authorizedCourse($course->id);
        abort_unless($section->course_id === $course->id, 403);

        $validated = $request->validate([
            'ordered_ids'   => 'required|array',
            'ordered_ids.*' => 'integer|exists:course_lectures,id',
        ]);

        foreach ($validated['ordered_ids'] as $index => $id) {
            CourseLecture::where('id', $id)
                ->where('section_id', $section->id)
                ->update(['sort_order' => $index + 1]);
        }

        return back()->with('success', 'Urutan lecture diperbarui.');
    }
}

<?php

namespace App\Http\Controllers\Backend\Instructor;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\CourseLecture;
use App\Models\CourseSection;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LectureController extends Controller
{
    /**
     * Pastikan kursus milik instructor yang sedang login.
     */
    private function authorizedCourse(int $courseId): Course
    {
        return Course::where('id', $courseId)
            ->where('instructor_id', Auth::id())
            ->firstOrFail();
    }

    /**
     * Pastikan section milik kursus yang benar.
     */
    private function authorizedSection(Course $course, int $sectionId): CourseSection
    {
        return CourseSection::where('id', $sectionId)
            ->where('course_id', $course->id)
            ->firstOrFail();
    }

    /**
     * Tambah lecture baru ke dalam section.
     */
    public function store(Request $request, Course $course, CourseSection $section): RedirectResponse
    {
        $this->authorizedCourse($course->id);
        $this->authorizedSection($course, $section->id);

        $validated = $request->validate([
            'title'    => 'required|string|max:255',
            'url'      => 'nullable|url|max:500',
            'content'  => 'nullable|string',
            'duration' => 'nullable|integer|min:0',
        ]);

        $sortOrder = $section->lectures()->count() + 1;

        $section->lectures()->create([
            'title'      => $validated['title'],
            'url'        => $validated['url'] ?? null,
            'content'    => $validated['content'] ?? null,
            'duration'   => $validated['duration'] ?? 0,
            'sort_order' => $sortOrder,
        ]);

        return back()->with('success', 'Lecture berhasil ditambahkan.');
    }

    /**
     * Update data lecture.
     */
    public function update(Request $request, Course $course, CourseSection $section, CourseLecture $lecture): RedirectResponse
    {
        $this->authorizedCourse($course->id);
        abort_unless($lecture->section_id === $section->id, 403);
        abort_unless($section->course_id === $course->id, 403);

        $validated = $request->validate([
            'title'    => 'required|string|max:255',
            'url'      => 'nullable|url|max:500',
            'content'  => 'nullable|string',
            'duration' => 'nullable|integer|min:0',
        ]);

        $lecture->update($validated);

        return back()->with('success', 'Lecture berhasil diperbarui.');
    }

    /**
     * Hapus lecture.
     */
    public function destroy(Course $course, CourseSection $section, CourseLecture $lecture): RedirectResponse
    {
        $this->authorizedCourse($course->id);
        abort_unless($lecture->section_id === $section->id, 403);
        abort_unless($section->course_id === $course->id, 403);

        $lecture->delete();

        // Re-index sort_order dalam section yang sama
        $section->lectures()->orderBy('sort_order')->get()
            ->each(fn ($l, $i) => $l->update(['sort_order' => $i + 1]));

        return back()->with('success', 'Lecture berhasil dihapus.');
    }

    /**
     * Reorder lectures dalam satu section.
     * Body: { ordered_ids: [1, 3, 2, ...] }
     */
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

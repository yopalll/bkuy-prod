<?php

namespace App\Http\Controllers\Backend\Instructor;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\CourseSection;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SectionController extends Controller
{
    /**
     * Pastikan kursus milik instructor yang sedang login.
     */
    private function authorizedCourse(int $courseId): Course
    {
        $course = Course::where('id', $courseId)
            ->where('instructor_id', Auth::id())
            ->firstOrFail();

        return $course;
    }

    /**
     * Tambah section baru ke dalam kursus.
     */
    public function store(Request $request, Course $course): RedirectResponse
    {
        $this->authorizedCourse($course->id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
        ]);

        // sort_order = jumlah section yang sudah ada + 1
        $sortOrder = $course->sections()->count() + 1;

        $course->sections()->create([
            'title'      => $validated['title'],
            'sort_order' => $sortOrder,
        ]);

        return back()->with('success', 'Section berhasil ditambahkan.');
    }

    /**
     * Update judul section.
     */
    public function update(Request $request, Course $course, CourseSection $section): RedirectResponse
    {
        $this->authorizedCourse($course->id);
        abort_unless($section->course_id === $course->id, 403);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
        ]);

        $section->update(['title' => $validated['title']]);

        return back()->with('success', 'Section berhasil diperbarui.');
    }

    /**
     * Hapus section beserta seluruh lecture di dalamnya.
     */
    public function destroy(Course $course, CourseSection $section): RedirectResponse
    {
        $this->authorizedCourse($course->id);
        abort_unless($section->course_id === $course->id, 403);

        $section->lectures()->delete();
        $section->delete();

        // Re-index sort_order agar tetap berurutan
        $course->sections()->orderBy('sort_order')->get()
            ->each(fn ($s, $i) => $s->update(['sort_order' => $i + 1]));

        return back()->with('success', 'Section berhasil dihapus.');
    }

    /**
     * Reorder sections (drag & drop).
     * Body: { ordered_ids: [1, 3, 2, ...] }
     */
    public function reorder(Request $request, Course $course): RedirectResponse
    {
        $this->authorizedCourse($course->id);

        $validated = $request->validate([
            'ordered_ids'   => 'required|array',
            'ordered_ids.*' => 'integer|exists:course_sections,id',
        ]);

        foreach ($validated['ordered_ids'] as $index => $id) {
            CourseSection::where('id', $id)
                ->where('course_id', $course->id)
                ->update(['sort_order' => $index + 1]);
        }

        return back()->with('success', 'Urutan section diperbarui.');
    }
}

<?php

namespace App\Http\Controllers\Backend\Instructor;

use App\Http\Controllers\Controller;
use App\Http\Requests\Instructor\StoreCourseRequest;
use App\Http\Requests\Instructor\UpdateCourseRequest;
use App\Models\Category;
use App\Models\Course;
use App\Models\SubCategory;
use App\Services\CloudinaryService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class CourseController extends Controller
{
    public function __construct(protected CloudinaryService $cloudinary) {}

    /**
     * Daftar kursus milik instructor yang sedang login.
     */
    public function index(): Response
    {
        $instructor = Auth::user();

        $courses = Course::where('instructor_id', $instructor->id)
            ->with(['category', 'subCategory'])
            ->withCount('enrollments')
            ->latest()
            ->get()
            ->map(fn ($c) => [
                'id'               => $c->id,
                'title'            => $c->title,
                'slug'             => $c->slug,
                'thumbnail'        => $c->thumbnail,
                'status'           => $c->status,
                'price'            => $c->price,
                'discounted_price' => $c->discounted_price,
                'discount'         => $c->discount,
                'featured'         => $c->featured,
                'bestseller'       => $c->bestseller,
                'category'         => $c->category?->only('id', 'name'),
                'enrollments_count'=> $c->enrollments_count,
                'created_at'       => $c->created_at?->format('d M Y'),
            ]);

        return Inertia::render('Instructor/Courses/Index', [
            'courses' => $courses,
        ]);
    }

    /**
     * Form buat kursus baru.
     */
    public function create(): Response
    {
        return Inertia::render('Instructor/Courses/BasicInfo', [
            'categories'    => Category::active()->with('subCategories')->get(['id', 'name']),
            'subcategories' => SubCategory::all(['id', 'category_id', 'name']),
            'course'        => null,
        ]);
    }

    /**
     * Simpan kursus baru ke DB.
     */
    public function store(StoreCourseRequest $request): RedirectResponse
    {
        $data = $request->validated();

        // Upload thumbnail ke Cloudinary jika ada
        if ($request->hasFile('thumbnail')) {
            $upload = $this->cloudinary->uploadImage($request->file('thumbnail'), 'belajarkuy/courses');
            $data['thumbnail'] = $upload['url'];
        }

        $data['instructor_id'] = Auth::id();
        $data['status']        = 'draft';
        $data['slug']          = Str::slug($data['title']);

        $course = Course::create($data);

        return redirect()
            ->route('instructor.courses.edit', $course)
            ->with('success', 'Kursus berhasil dibuat! Lengkapi informasi lainnya.');
    }

    /**
     * Form edit kursus (hanya milik instructor sendiri).
     */
    public function edit(Course $course): Response
    {
        abort_unless($course->instructor_id === Auth::id(), 403);

        return Inertia::render('Instructor/Courses/BasicInfo', [
            'categories'    => Category::active()->with('subCategories')->get(['id', 'name']),
            'subcategories' => SubCategory::all(['id', 'category_id', 'name']),
            'course'        => [
                'id'             => $course->id,
                'title'          => $course->title,
                'slug'           => $course->slug,
                'description'    => $course->description,
                'category_id'    => $course->category_id,
                'subcategory_id' => $course->subcategory_id,
                'price'          => $course->price,
                'discount'       => $course->discount ?? 0,
                'featured'       => (bool) $course->featured,
                'bestseller'     => (bool) $course->bestseller,
                'thumbnail'      => $course->thumbnail,
                'status'         => $course->status,
            ],
        ]);
    }

    /**
     * Update data kursus.
     */
    public function update(UpdateCourseRequest $request, Course $course): RedirectResponse
    {
        $data = $request->validated();

        // Upload / ganti thumbnail di Cloudinary
        if ($request->hasFile('thumbnail')) {
            $upload = $this->cloudinary->uploadImage($request->file('thumbnail'), 'belajarkuy/courses');
            $data['thumbnail'] = $upload['url'];
        } else {
            unset($data['thumbnail']); // Jangan hapus thumbnail lama
        }

        $course->update($data);

        return back()->with('success', 'Kursus berhasil diperbarui.');
    }

    /**
     * Hapus kursus (hanya draft/inactive yang boleh dihapus).
     */
    public function destroy(Course $course): RedirectResponse
    {
        abort_unless($course->instructor_id === Auth::id(), 403);
        abort_if(
            in_array($course->status, ['active', 'pending_review']),
            403,
            'Kursus aktif atau sedang ditinjau tidak dapat dihapus.'
        );

        $course->delete();

        return redirect()
            ->route('instructor.courses.index')
            ->with('success', 'Kursus berhasil dihapus.');
    }

    /**
     * Halaman Kurikulum — kelola Section & Lecture.
     */
    public function curriculum(Course $course): Response
    {
        abort_unless($course->instructor_id === Auth::id(), 403);

        $sections = $course->sections()
            ->orderBy('sort_order')
            ->with(['lectures' => fn ($q) => $q->orderBy('sort_order')])
            ->get()
            ->map(fn ($s) => [
                'id'         => $s->id,
                'title'      => $s->title,
                'sort_order' => $s->sort_order,
                'lectures'   => $s->lectures->map(fn ($l) => [
                    'id'          => $l->id,
                    'title'       => $l->title,
                    'source_type' => $l->source_type ?? ($l->video_type === 'youtube' ? 'youtube' : 'gcs'),
                    // Untuk GCS, jangan bocorkan nama objek privat ke browser —
                    // cukup flag has_video agar UI tahu video sudah ada.
                    'video_path'  => $l->source_type === 'gcs' ? null : $l->video_path,
                    'has_video'   => ! empty($l->video_path),
                    'content'     => $l->content,
                    'duration'    => $l->duration,
                    'sort_order'  => $l->sort_order,
                ]),
            ]);

        return Inertia::render('Instructor/Courses/Curriculum', [
            'course'   => [
                'id'     => $course->id,
                'title'  => $course->title,
                'slug'   => $course->slug,
                'status' => $course->status,
            ],
            'sections' => $sections,
        ]);
    }

    /**
     * Kirim kursus untuk ditinjau admin (draft → pending_review).
     */
    public function submit(Course $course): RedirectResponse
    {
        abort_unless($course->instructor_id === Auth::id(), 403);
        abort_unless($course->status === 'draft', 422, 'Hanya kursus berstatus draft yang dapat diajukan review.');

        $course->update(['status' => 'pending_review']);

        return back()->with('success', 'Kursus berhasil diajukan untuk ditinjau admin.');
    }
}

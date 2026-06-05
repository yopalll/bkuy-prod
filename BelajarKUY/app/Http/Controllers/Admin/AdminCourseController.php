<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Mail\CourseApprovedMail;
use App\Mail\CourseRejectedMail;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class AdminCourseController extends Controller
{
    /**
     * Display a listing of courses for admin review/management.
     */
    public function index()
    {
        $courses = Course::with(['instructor', 'category'])
            ->latest()
            ->paginate(15);
            
        return view('admin.courses.index', compact('courses'));
    }

    /**
     * Display the specified course details.
     */
    public function show(Course $course)
    {
        $course->load(['instructor', 'category', 'subCategory']);
        
        return view('admin.courses.show', compact('course'));
    }

    /**
     * Update the course status (approve / reject).
     * L11 Albariqi: kirim email notifikasi ke instruktur via queue.
     */
    public function updateStatus(Request $request, Course $course)
    {
        $request->validate([
            'status' => ['required', 'string', 'in:active,inactive'],
            'reason' => ['nullable', 'string', 'max:1000'],
        ]);

        $oldStatus = $course->status;

        $course->update([
            'status' => $request->status,
        ]);

        // Load instructor relation untuk email
        $course->load('instructor', 'category');

        // Kirim email hanya jika ada perubahan status yang relevan
        if ($request->status === 'active' && $oldStatus !== 'active') {
            // Kursus disetujui → email approval ke instruktur
            if ($course->instructor && $course->instructor->email) {
                Mail::to($course->instructor->email)
                    ->queue(new CourseApprovedMail($course));
            }
        } elseif ($request->status === 'inactive' && $oldStatus === 'pending_review') {
            // Kursus ditolak dari pending_review → email rejection ke instruktur
            if ($course->instructor && $course->instructor->email) {
                Mail::to($course->instructor->email)
                    ->queue(new CourseRejectedMail($course, $request->reason));
            }
        }

        return redirect()->back()->with('success', 'Status kursus berhasil diperbarui menjadi ' . ucfirst($request->status) . '.');
    }
}

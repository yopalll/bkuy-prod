<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\CourseReport;
use Illuminate\Http\Request;

class CourseReportController extends Controller
{
    public function store(Request $request, Course $course)
    {
        $request->validate([
            'reason' => ['required', 'string', 'max:100'],
            'detail' => ['nullable', 'string', 'max:1000'],
        ]);

        $existing = CourseReport::where('user_id', auth()->id())
            ->where('course_id', $course->id)
            ->first();

        if ($existing) {
            return redirect()->back()->with('error', 'Anda sudah melaporkan kursus ini sebelumnya.');
        }

        CourseReport::create([
            'user_id'  => auth()->id(),
            'course_id' => $course->id,
            'reason'   => $request->reason,
            'detail'   => $request->detail,
            'status'   => 'pending',
        ]);

        return redirect()->back()->with('success', 'Laporan Anda berhasil dikirim dan akan ditinjau oleh tim kami.');
    }
}

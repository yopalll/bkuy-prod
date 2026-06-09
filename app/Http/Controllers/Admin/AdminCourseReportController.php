<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CourseReport;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminCourseReportController extends Controller
{
    public function index()
    {
        $reports = CourseReport::with(['user:id,name,email', 'course:id,title,slug'])
            ->latest()
            ->paginate(20);

        return Inertia::render('Admin/CourseReports/Index', compact('reports'));
    }

    public function update(Request $request, CourseReport $report)
    {
        $request->validate([
            'status'     => ['required', 'in:pending,reviewed,dismissed'],
            'admin_note' => ['nullable', 'string', 'max:1000'],
        ]);

        $report->update([
            'status'      => $request->status,
            'admin_note'  => $request->admin_note,
            'reviewed_at' => now(),
        ]);

        return redirect()->back()->with('success', 'Laporan berhasil diperbarui.');
    }
}

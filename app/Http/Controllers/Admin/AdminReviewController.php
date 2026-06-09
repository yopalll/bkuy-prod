<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminReviewController extends Controller
{
    public function index()
    {
        $filter = request('filter', 'all');

        $query = Review::with(['user:id,name,photo', 'course:id,title,slug'])->latest();

        if ($filter === 'reported') {
            $query->whereNotNull('reported_at');
        }

        $reviews = $query->paginate(15)->withQueryString();

        return Inertia::render('Admin/Reviews/Index', compact('reviews', 'filter'));
    }

    public function updateStatus(Request $request, Review $review)
    {
        $request->validate([
            'status' => 'required|in:pending,approved,rejected',
        ]);

        $review->update(['status' => $request->status]);

        return redirect()->back()->with('success', 'Status ulasan berhasil diperbarui.');
    }

    public function clearReport(Review $review)
    {
        $review->update([
            'report_reason' => null,
            'reported_at'   => null,
            'report_count'  => 0,
        ]);

        return redirect()->back()->with('success', 'Laporan ulasan berhasil dibersihkan.');
    }
}

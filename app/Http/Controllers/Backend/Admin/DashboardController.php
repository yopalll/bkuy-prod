<?php

namespace App\Http\Controllers\Backend\Admin;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Order;
use App\Models\User;
use App\Models\Review;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display the Admin dashboard.
     * Shows platform-wide stats: users, courses, orders, revenue.
     */
    public function index(): \Inertia\Response
    {
        $stats = [
            'total_students'    => User::students()->count(),
            'total_instructors' => User::instructors()->count(),
            'total_courses'     => Course::count(),
            'active_courses'    => Course::where('status', 'active')->count(),
            'total_orders'      => Order::where('status', 'completed')->count(),
            'total_revenue'     => Order::where('status', 'completed')->sum('final_price'),
            'pending_courses'   => Course::where('status', 'pending_review')->count(),
            'pending_reviews'   => Review::where('status', 'pending')->count(),
        ];

        $recentOrders = Order::with(['user', 'course'])
            ->latest()
            ->limit(5)
            ->get();

        return Inertia::render('Admin/Dashboard', [
            'stats'        => $stats,
            'recentOrders' => $recentOrders,
        ]);
    }
}


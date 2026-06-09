<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\SupportTicket;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SupportTicketController extends Controller
{
    public function index(): Response
    {
        $tickets = SupportTicket::where('user_id', auth()->id())
            ->latest()
            ->get(['id', 'subject', 'category', 'status', 'admin_response', 'responded_at', 'created_at']);

        return Inertia::render('Help/Index', [
            'tickets' => $tickets,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'subject'  => ['required', 'string', 'max:200'],
            'message'  => ['required', 'string', 'max:3000'],
            'category' => ['required', 'in:general,billing,technical,course'],
        ]);

        SupportTicket::create([
            'user_id'  => auth()->id(),
            'subject'  => $request->subject,
            'message'  => $request->message,
            'category' => $request->category,
            'status'   => 'open',
        ]);

        return redirect()->route('help.index')->with('success', 'Tiket bantuan Anda berhasil dikirim! Kami akan merespons dalam 1-2 hari kerja.');
    }
}

<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SupportTicket;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminSupportTicketController extends Controller
{
    public function index()
    {
        $tickets = SupportTicket::with('user:id,name,email')
            ->latest()
            ->paginate(20);

        return Inertia::render('Admin/SupportTickets/Index', compact('tickets'));
    }

    public function update(Request $request, SupportTicket $ticket)
    {
        $request->validate([
            'status'         => ['required', 'in:open,in_progress,resolved,closed'],
            'admin_response' => ['nullable', 'string', 'max:3000'],
        ]);

        $ticket->update([
            'status'         => $request->status,
            'admin_response' => $request->admin_response,
            'responded_at'   => $request->admin_response ? now() : $ticket->responded_at,
        ]);

        return redirect()->back()->with('success', 'Tiket berhasil diperbarui.');
    }
}

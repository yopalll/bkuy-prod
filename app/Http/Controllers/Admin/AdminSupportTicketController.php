<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Mail\SupportTicketRepliedMail;
use App\Models\SupportTicket;
use App\Models\SupportTicketMessage;
use App\Services\CloudinaryService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class AdminSupportTicketController extends Controller
{
    public function __construct(protected CloudinaryService $cloudinary) {}

    public function index(Request $request)
    {
        $status = $request->query('status');

        $tickets = SupportTicket::with('user:id,name,email')
            ->when(in_array($status, ['open', 'in_progress', 'resolved', 'closed']), fn ($q) => $q->where('status', $status))
            ->orderByDesc('admin_unread')
            ->orderByDesc('last_reply_at')
            ->orderByDesc('created_at')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Admin/SupportTickets/Index', [
            'tickets'      => $tickets,
            'filterStatus' => $status,
            'counts'       => [
                'open'        => SupportTicket::where('status', 'open')->count(),
                'in_progress' => SupportTicket::where('status', 'in_progress')->count(),
                'unread'      => SupportTicket::where('admin_unread', true)->count(),
            ],
        ]);
    }

    public function show(SupportTicket $ticket)
    {
        $ticket->load(['user:id,name,email', 'messages.attachments', 'messages.user:id,name']);

        if ($ticket->admin_unread) {
            $ticket->update(['admin_unread' => false]);
        }

        return Inertia::render('Admin/SupportTickets/Show', [
            'ticket' => [
                'id'         => $ticket->id,
                'subject'    => $ticket->subject,
                'category'   => $ticket->category,
                'status'     => $ticket->status,
                'created_at' => $ticket->created_at,
                'user'       => $ticket->user,
                'messages'   => $ticket->messages->map(fn ($m) => [
                    'id'          => $m->id,
                    'author_role' => $m->author_role,
                    'author_name' => $m->author_role === 'admin' ? 'Tim BelajarKUY' : ($m->user->name ?? $ticket->user->name ?? 'Pengguna'),
                    'body'        => $m->body,
                    'created_at'  => $m->created_at,
                    'attachments' => $m->attachments->map(fn ($a) => [
                        'id'        => $a->id,
                        'url'       => $a->url,
                        'file_name' => $a->file_name,
                    ]),
                ]),
            ],
        ]);
    }

    public function reply(Request $request, SupportTicket $ticket)
    {
        $validated = $request->validate([
            'message'       => ['required', 'string', 'max:3000'],
            'status'        => ['required', 'in:open,in_progress,resolved,closed'],
            'notify_email'  => ['boolean'],
            'attachments'   => ['nullable', 'array', 'max:5'],
            'attachments.*' => ['file', 'image', 'mimes:jpg,jpeg,png,webp,gif', 'max:4096'],
        ]);

        $message = DB::transaction(function () use ($request, $ticket, $validated) {
            $message = $ticket->messages()->create([
                'user_id'     => auth()->id(),
                'author_role' => 'admin',
                'body'        => $validated['message'],
            ]);

            if ($request->hasFile('attachments')) {
                foreach ($request->file('attachments') as $file) {
                    $upload = $this->cloudinary->uploadImage($file, 'support_tickets');
                    $message->attachments()->create([
                        'url'       => $upload['url'],
                        'public_id' => $upload['public_id'],
                        'file_name' => $file->getClientOriginalName(),
                        'mime_type' => $file->getClientMimeType(),
                        'size'      => $file->getSize(),
                    ]);
                }
            }

            $ticket->update([
                'status'          => $validated['status'],
                'admin_response'  => $validated['message'], // simpan respons terakhir utk kompatibilitas
                'responded_at'    => now(),
                'last_reply_at'   => now(),
                'last_reply_role' => 'admin',
                'user_unread'     => true,
            ]);

            return $message;
        });

        if (($validated['notify_email'] ?? false) && $ticket->user?->email) {
            Mail::to($ticket->user->email)->queue(new SupportTicketRepliedMail($ticket->fresh('user'), $message));
        }

        return redirect()->route('admin.support-tickets.show', $ticket->id)->with('success', 'Balasan terkirim.');
    }

    public function updateStatus(Request $request, SupportTicket $ticket)
    {
        $validated = $request->validate([
            'status' => ['required', 'in:open,in_progress,resolved,closed'],
        ]);

        $ticket->update(['status' => $validated['status']]);

        return redirect()->back()->with('success', 'Status tiket diperbarui.');
    }
}

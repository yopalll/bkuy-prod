<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\SupportTicket;
use App\Models\SupportTicketMessage;
use App\Services\CloudinaryService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class SupportTicketController extends Controller
{
    public function __construct(protected CloudinaryService $cloudinary) {}

    public function index(): Response
    {
        $tickets = SupportTicket::where('user_id', auth()->id())
            ->orderByDesc('last_reply_at')
            ->orderByDesc('created_at')
            ->get(['id', 'subject', 'category', 'status', 'last_reply_at', 'last_reply_role', 'user_unread', 'created_at']);

        return Inertia::render('Help/Index', [
            'tickets' => $tickets,
        ]);
    }

    public function show(SupportTicket $ticket): Response
    {
        abort_unless($ticket->user_id === auth()->id(), 403);

        $ticket->load(['messages.attachments', 'messages.user:id,name']);

        // Tandai sudah dibaca oleh user
        if ($ticket->user_unread) {
            $ticket->update(['user_unread' => false]);
        }

        return Inertia::render('Help/Show', [
            'ticket' => [
                'id'        => $ticket->id,
                'subject'   => $ticket->subject,
                'category'  => $ticket->category,
                'status'    => $ticket->status,
                'created_at' => $ticket->created_at,
                'messages'  => $ticket->messages->map(fn ($m) => [
                    'id'          => $m->id,
                    'author_role' => $m->author_role,
                    'author_name' => $m->author_role === 'admin' ? 'Tim BelajarKUY' : ($m->user->name ?? 'Kamu'),
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

    public function store(Request $request)
    {
        $validated = $request->validate([
            'subject'        => ['required', 'string', 'max:200'],
            'message'        => ['required', 'string', 'max:3000'],
            'category'       => ['required', 'in:general,billing,technical,course'],
            'attachments'    => ['nullable', 'array', 'max:5'],
            'attachments.*'  => ['file', 'image', 'mimes:jpg,jpeg,png,webp,gif', 'max:4096'],
        ]);

        $ticket = DB::transaction(function () use ($request, $validated) {
            $ticket = SupportTicket::create([
                'user_id'         => auth()->id(),
                'subject'         => $validated['subject'],
                'message'         => $validated['message'],
                'category'        => $validated['category'],
                'status'          => 'open',
                'last_reply_at'   => now(),
                'last_reply_role' => 'user',
                'user_unread'     => false,
                'admin_unread'    => true,
            ]);

            $message = $ticket->messages()->create([
                'user_id'     => auth()->id(),
                'author_role' => 'user',
                'body'        => $validated['message'],
            ]);

            $this->storeAttachments($request, $message);

            return $ticket;
        });

        return redirect()->route('help.show', $ticket->id)
            ->with('success', 'Tiket bantuan Anda berhasil dikirim! Kami akan merespons dalam 1-2 hari kerja.');
    }

    public function reply(Request $request, SupportTicket $ticket)
    {
        abort_unless($ticket->user_id === auth()->id(), 403);

        if ($ticket->status === 'closed') {
            return redirect()->back()->with('error', 'Tiket ini sudah ditutup. Buat tiket baru bila masih ada kendala.');
        }

        $validated = $request->validate([
            'message'       => ['required', 'string', 'max:3000'],
            'attachments'   => ['nullable', 'array', 'max:5'],
            'attachments.*' => ['file', 'image', 'mimes:jpg,jpeg,png,webp,gif', 'max:4096'],
        ]);

        DB::transaction(function () use ($request, $ticket, $validated) {
            $message = $ticket->messages()->create([
                'user_id'     => auth()->id(),
                'author_role' => 'user',
                'body'        => $validated['message'],
            ]);

            $this->storeAttachments($request, $message);

            $ticket->update([
                'status'          => $ticket->status === 'resolved' ? 'in_progress' : $ticket->status,
                'last_reply_at'   => now(),
                'last_reply_role' => 'user',
                'admin_unread'    => true,
            ]);
        });

        return redirect()->route('help.show', $ticket->id)->with('success', 'Balasan terkirim.');
    }

    public function close(SupportTicket $ticket)
    {
        abort_unless($ticket->user_id === auth()->id(), 403);

        $ticket->update(['status' => 'closed']);

        return redirect()->back()->with('success', 'Tiket ditutup. Terima kasih!');
    }

    /**
     * Unggah lampiran gambar ke Cloudinary dan kaitkan ke pesan.
     */
    private function storeAttachments(Request $request, SupportTicketMessage $message): void
    {
        if (! $request->hasFile('attachments')) {
            return;
        }

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
}

<?php

namespace App\Mail;

use App\Models\SupportTicket;
use App\Models\SupportTicketMessage;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

/**
 * Email ke user saat admin membalas tiket bantuannya.
 * Dipicu dari AdminSupportTicketController::reply() bila admin mencentang
 * "kirim balasan via email".
 */
class SupportTicketRepliedMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(
        public SupportTicket $ticket,
        public SupportTicketMessage $reply,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: '💬 Balasan untuk tiket bantuanmu #' . $this->ticket->id . ' — BelajarKUY',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.support-ticket-replied',
            with: [
                'ticket' => $this->ticket,
                'reply'  => $this->reply,
                'url'    => url('/bantuan/' . $this->ticket->id),
            ],
        );
    }

    public function attachments(): array
    {
        return [];
    }
}

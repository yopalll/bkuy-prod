<?php

namespace App\Mail;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

/**
 * L11 Albariqi — email ke instruktur saat ada penjualan baru kursusnya.
 * Dipicu dari: CheckoutController::handleSuccess() per order → per instruktur.
 */
class NewSaleMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    /**
     * @param Order $order Order yang baru terjadi (dengan relasi course, user, instructor di-load)
     */
    public function __construct(public Order $order) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: '💰 Penjualan Baru — BelajarKUY',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.new-sale',
            with: [
                'order'      => $this->order,
                'course'     => $this->order->course,
                'buyer'      => $this->order->user,
                'instructor' => $this->order->instructor,
            ],
        );
    }

    public function attachments(): array
    {
        return [];
    }
}

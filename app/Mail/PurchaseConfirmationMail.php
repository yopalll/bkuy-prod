<?php

namespace App\Mail;

use App\Models\Payment;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Collection;

class PurchaseConfirmationMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    /**
     * @param Payment    $payment Payment yang sudah settlement
     * @param Collection $orders  Order items (dengan relasi course di-load)
     */
    public function __construct(
        public Payment    $payment,
        public Collection $orders,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: '✅ Pembayaran Berhasil — BelajarKUY',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.purchase-confirmation',
            with: [
                'payment' => $this->payment,
                'orders'  => $this->orders,
                'buyer'   => $this->payment->user,
            ],
        );
    }

    public function attachments(): array
    {
        return [];
    }
}

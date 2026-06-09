<?php

namespace App\Notifications;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class CoursePurchasedNotification extends Notification
{
    use Queueable;

    public function __construct(public Order $order) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toDatabase(object $notifiable): array
    {
        return [
            'type'         => 'transaction',
            'title'        => 'Pembelian Kursus Berhasil!',
            'body'         => 'Kamu berhasil mendaftar ke kursus "' . $this->order->course->title . '".',
            'icon'         => 'check_circle',
            'url'          => '/student/learn/' . $this->order->course->slug,
            'action_label' => 'Mulai Belajar',
            'action_url'   => '/student/learn/' . $this->order->course->slug,
        ];
    }
}

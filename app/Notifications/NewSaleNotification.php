<?php

namespace App\Notifications;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class NewSaleNotification extends Notification
{
    use Queueable;

    public function __construct(public Order $order) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toDatabase(object $notifiable): array
    {
        $buyer = $this->order->user->name ?? 'Seseorang';
        return [
            'type'         => 'transaction',
            'title'        => 'Kursus Terjual!',
            'body'         => "{$buyer} baru saja membeli kursus \"{$this->order->course->title}\".",
            'icon'         => 'sell',
            'url'          => '/instructor/dashboard',
            'action_label' => 'Lihat Dashboard',
            'action_url'   => '/instructor/dashboard',
        ];
    }
}

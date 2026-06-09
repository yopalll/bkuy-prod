<?php

namespace App\Notifications;

use App\Models\Course;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class CourseStatusNotification extends Notification
{
    use Queueable;

    public function __construct(
        public Course $course,
        public string $status,   // 'active' | 'inactive'
        public ?string $reason = null
    ) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toDatabase(object $notifiable): array
    {
        if ($this->status === 'active') {
            return [
                'type'         => 'learning',
                'title'        => 'Kursus Disetujui!',
                'body'         => "Kursus \"{$this->course->title}\" telah disetujui dan dipublikasikan.",
                'icon'         => 'verified',
                'url'          => '/instructor/courses/' . $this->course->id,
                'action_label' => 'Lihat Kursus',
                'action_url'   => '/instructor/courses/' . $this->course->id,
            ];
        }

        return [
            'type'         => 'system',
            'title'        => 'Kursus Ditolak',
            'body'         => "Kursus \"{$this->course->title}\" tidak disetujui." . ($this->reason ? " Alasan: {$this->reason}" : ''),
            'icon'         => 'cancel',
            'url'          => '/instructor/courses/' . $this->course->id . '/edit',
            'action_label' => 'Edit Kursus',
            'action_url'   => '/instructor/courses/' . $this->course->id . '/edit',
        ];
    }
}

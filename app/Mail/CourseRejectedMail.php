<?php

namespace App\Mail;

use App\Models\Course;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

/**
 * L11 Albariqi — email ke instruktur saat admin menolak kursus.
 * Dipicu dari: AdminCourseController::updateStatus() saat status → 'inactive'.
 */
class CourseRejectedMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    /**
     * @param Course $course Kursus yang ditolak (dengan relasi instructor di-load)
     * @param string|null $reason Alasan penolakan dari admin
     */
    public function __construct(
        public Course $course,
        public ?string $reason = null,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: '⚠️ Kursusmu Memerlukan Perbaikan — BelajarKUY',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.course-rejected',
            with: [
                'course'     => $this->course,
                'instructor' => $this->course->instructor,
                'reason'     => $this->reason,
            ],
        );
    }

    public function attachments(): array
    {
        return [];
    }
}

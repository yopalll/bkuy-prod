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
 * L11 Albariqi — email ke instruktur saat admin menyetujui kursus.
 * Dipicu dari: AdminCourseController::updateStatus() saat status → 'active'.
 */
class CourseApprovedMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    /**
     * @param Course $course Kursus yang baru disetujui (dengan relasi instructor di-load)
     */
    public function __construct(public Course $course) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: '🎉 Kursusmu Telah Disetujui — BelajarKUY',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.course-approved',
            with: [
                'course'     => $this->course,
                'instructor' => $this->course->instructor,
            ],
        );
    }

    public function attachments(): array
    {
        return [];
    }
}

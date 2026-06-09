<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Enrollment;
use Inertia\Inertia;
use Inertia\Response;

class CertificateController extends Controller
{
    /**
     * Tampilkan sertifikat milik user yang sedang login.
     * URL: GET /student/certificate/{code}
     */
    public function show(string $code): Response
    {
        $enrollment = Enrollment::where('certificate_code', $code)
            ->with(['user', 'course', 'course.instructor', 'course.category'])
            ->firstOrFail();

        // Hanya pemilik sertifikat yang boleh akses halaman ini
        abort_unless($enrollment->user_id === auth()->id(), 403, 'Sertifikat ini bukan milikmu.');

        return Inertia::render('Student/Certificate', [
            'certificate' => [
                'code'             => $enrollment->certificate_code,
                'issued_at'        => $enrollment->issued_at?->format('d F Y'),
                'student_name'     => $enrollment->user->name,
                'course_title'     => $enrollment->course->title,
                'instructor_name'  => $enrollment->course->instructor->name,
                'category'         => $enrollment->course->category?->name,
            ],
            'verify_url' => route('certificate.verify', $code),
        ]);
    }

    /**
     * Verifikasi sertifikat secara publik (tanpa login).
     * URL: GET /certificate/verify/{code}
     */
    public function verify(string $code): Response
    {
        $enrollment = Enrollment::where('certificate_code', $code)
            ->with(['user', 'course', 'course.instructor'])
            ->first();

        return Inertia::render('Certificate/Verify', [
            'valid'       => (bool) $enrollment,
            'certificate' => $enrollment ? [
                'code'            => $enrollment->certificate_code,
                'issued_at'       => $enrollment->issued_at?->format('d F Y'),
                'student_name'    => $enrollment->user->name,
                'course_title'    => $enrollment->course->title,
                'instructor_name' => $enrollment->course->instructor->name,
            ] : null,
        ]);
    }
}

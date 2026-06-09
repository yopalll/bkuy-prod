<?php

namespace Database\Seeders;

use App\Models\Cart;
use App\Models\Coupon;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\LectureCompletion;
use App\Models\Order;
use App\Models\Payment;
use App\Models\Review;
use App\Models\User;
use App\Models\Wishlist;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class TransactionSeeder extends Seeder
{
    /**
     * Seed transaksi end-to-end dengan data yang masuk akal (tanpa faker):
     *   - Kupon dengan kode & diskon yang ditulis manual
     *   - Wishlist & cart per student
     *   - Payment -> Order -> Enrollment (sebagian memakai kupon)
     *   - Beberapa pembayaran gagal/pending
     *   - Lecture completion (progress belajar)
     *   - Review dengan komentar yang ditulis manual sesuai rating
     */
    public function run(): void
    {
        $students = User::where('role', 'user')->get();
        $courses = Course::all();

        if ($students->isEmpty() || $courses->isEmpty()) {
            $this->command->warn('UserSeeder & CourseSeeder harus dijalankan terlebih dahulu.');

            return;
        }

        $courseBySlug = $courses->keyBy('slug');

        // --- Kupon (kode & diskon ditulis manual) ---
        $coupons = $this->seedCoupons($courseBySlug);

        // --- Wishlist & Cart per student ---
        foreach ($students as $i => $student) {
            // Tiap student mewishlist 2-3 course dan menaruh 1-2 di cart,
            // dipilih bergiliran agar tersebar merata tanpa faker.
            $wishlist = $courses->slice($i % $courses->count())->concat($courses)->take(2 + ($i % 2));
            foreach ($wishlist as $course) {
                Wishlist::firstOrCreate([
                    'user_id' => $student->id,
                    'course_id' => $course->id,
                ]);
            }

            $cart = $courses->slice(($i + 3) % $courses->count())->concat($courses)->take(1 + ($i % 2));
            foreach ($cart as $course) {
                Cart::firstOrCreate([
                    'user_id' => $student->id,
                    'course_id' => $course->id,
                ]);
            }
        }

        // --- Payment -> Order -> Enrollment ---
        $paymentTypes = ['gopay', 'bank_transfer', 'credit_card', 'qris', 'shopeepay'];
        $seq = 0;

        foreach ($students as $i => $student) {
            // Tiap student membeli 1-3 course unik (dipilih bergiliran).
            $purchaseCount = 1 + ($i % 3);
            $purchased = $courses->slice(($i * 2) % $courses->count())
                ->concat($courses)
                ->unique('id')
                ->take($purchaseCount);

            foreach ($purchased as $course) {
                $seq++;

                // Diskon bawaan kursus (courses.discount) SELALU diperhitungkan,
                // persis seperti CheckoutController::handleSuccess().
                $originalPrice = (int) $course->price;
                $finalPrice = (int) round($course->discounted_price);
                $discountAmount = $originalPrice - $finalPrice;

                // Kupon hanya dipakai bila benar-benar valid untuk kursus ini:
                // kupon khusus kursus tsb, ATAU kupon global milik instrukturnya.
                // Diskon kupon ditumpuk di atas harga yang sudah didiskon bawaan.
                $coupon = ($seq % 3 === 0) ? $this->eligibleCoupon($coupons, $course) : null;
                if ($coupon) {
                    $couponDiscount = (int) round($finalPrice * $coupon->discount_percent / 100);
                    $discountAmount += $couponDiscount;
                    $finalPrice -= $couponDiscount;
                }

                $purchasedAt = Carbon::now()->subDays(($seq * 7) % 210)->subHours($seq % 24);

                $payment = Payment::create([
                    'user_id' => $student->id,
                    'midtrans_order_id' => 'BKUY-'.$purchasedAt->format('ymd').'-'.$student->id.'-'.$seq,
                    'midtrans_transaction_id' => sprintf('TRX-%06d-%04d', $student->id, $seq),
                    'payment_type' => $paymentTypes[$seq % count($paymentTypes)],
                    'total_amount' => $finalPrice,
                    'status' => 'settlement',
                    'midtrans_response' => [
                        'status_code' => '200',
                        'status_message' => 'Success, transaction is found',
                        'fraud_status' => 'accept',
                    ],
                    'created_at' => $purchasedAt,
                    'updated_at' => $purchasedAt,
                ]);

                $order = Order::create([
                    'payment_id' => $payment->id,
                    'user_id' => $student->id,
                    'course_id' => $course->id,
                    'instructor_id' => $course->instructor_id,
                    'coupon_id' => $coupon?->id,
                    'original_price' => $originalPrice,
                    'discount_amount' => $discountAmount,
                    'final_price' => $finalPrice,
                    'status' => 'completed',
                    'created_at' => $purchasedAt,
                    'updated_at' => $purchasedAt,
                ]);

                Enrollment::firstOrCreate(
                    [
                        'user_id' => $student->id,
                        'course_id' => $course->id,
                    ],
                    [
                        'order_id' => $order->id,
                        'enrolled_at' => $purchasedAt,
                    ]
                );
            }
        }

        // --- Beberapa pembayaran gagal/pending (tanpa order & enrollment) ---
        $failStatuses = ['pending', 'expire', 'cancel', 'deny'];
        foreach ($students->take(8) as $i => $student) {
            $seq++;
            $failedAt = Carbon::now()->subDays(($i + 1) * 9);
            $course = $courses[$i % $courses->count()];

            Payment::create([
                'user_id' => $student->id,
                'midtrans_order_id' => 'BKUY-'.$failedAt->format('ymd').'-'.$student->id.'-F'.$seq,
                'midtrans_transaction_id' => sprintf('TRX-%06d-%04d', $student->id, $seq),
                'payment_type' => $paymentTypes[$seq % count($paymentTypes)],
                'total_amount' => (int) $course->price,
                'status' => $failStatuses[$i % count($failStatuses)],
                'midtrans_response' => [
                    'status_code' => '407',
                    'status_message' => 'Transaction is not completed',
                    'fraud_status' => 'accept',
                ],
                'created_at' => $failedAt,
                'updated_at' => $failedAt,
            ]);
        }

        // --- Lecture completion untuk course yang sudah di-enroll ---
        foreach (Enrollment::with('course.sections.lectures')->get() as $e => $enrollment) {
            $lectures = $enrollment->course->sections->flatMap->lectures->values();
            if ($lectures->isEmpty()) {
                continue;
            }

            // Progress 40-100% (bergiliran) agar terlihat realistis.
            $ratios = [0.4, 0.6, 0.75, 1.0];
            $count = (int) ceil($lectures->count() * $ratios[$e % count($ratios)]);

            // Sebar waktu penyelesaian antara tanggal enroll dan sekarang —
            // berurutan per lecture, BUKAN semuanya di detik yang sama.
            $start = Carbon::parse($enrollment->enrolled_at);
            $gapSeconds = max(3600, $start->diffInSeconds(Carbon::now()));
            $slots = $lectures->count() + 1;

            foreach ($lectures->take($count) as $idx => $lecture) {
                $completedAt = $start->copy()->addSeconds((int) ($gapSeconds * ($idx + 1) / $slots));

                LectureCompletion::firstOrCreate(
                    [
                        'user_id' => $enrollment->user_id,
                        'lecture_id' => $lecture->id,
                    ],
                    ['completed_at' => $completedAt]
                );
            }
        }

        // --- Review dengan komentar manual sesuai rating ---
        $this->seedReviews();
    }

    /**
     * Cari kupon yang benar-benar valid untuk sebuah kursus:
     *   - kupon khusus kursus tsb (course_id == course.id), ATAU
     *   - kupon global (course_id null) milik instruktur kursus tsb.
     * Mengembalikan null jika tidak ada kupon yang relevan.
     */
    private function eligibleCoupon($coupons, Course $course): ?Coupon
    {
        return $coupons->first(function (Coupon $coupon) use ($course) {
            if ($coupon->course_id) {
                return $coupon->course_id == $course->id;
            }

            return $coupon->instructor_id == $course->instructor_id;
        });
    }

    /**
     * Buat kupon dengan kode & diskon yang ditulis manual.
     */
    private function seedCoupons($courseBySlug)
    {
        $instructors = User::where('role', 'instructor')->get()->keyBy('email');

        $definitions = [
            ['email' => 'ray@belajarkuy.test', 'code' => 'BELAJARHEMAT', 'percent' => 15, 'slug' => null, 'days' => 30, 'max' => 200, 'used' => 42],
            ['email' => 'ray@belajarkuy.test', 'code' => 'LARAVEL25', 'percent' => 25, 'slug' => 'laravel-12-untuk-pemula', 'days' => 14, 'max' => 50, 'used' => 18],
            ['email' => 'yosua@belajarkuy.test', 'code' => 'DESIGNDISKON', 'percent' => 20, 'slug' => null, 'days' => 21, 'max' => 100, 'used' => 27],
            ['email' => 'dewi@belajarkuy.test', 'code' => 'PYTHONPEMULA', 'percent' => 10, 'slug' => 'dasar-pemrograman-python', 'days' => 30, 'max' => 150, 'used' => 65],
            ['email' => 'budi@belajarkuy.test', 'code' => 'DEVOPS30', 'percent' => 30, 'slug' => null, 'days' => 10, 'max' => 30, 'used' => 9],
            ['email' => 'sari@belajarkuy.test', 'code' => 'MARKETINGYUK', 'percent' => 15, 'slug' => null, 'days' => 45, 'max' => null, 'used' => 12],
        ];

        foreach ($definitions as $d) {
            $instructor = $instructors->get($d['email']);
            if (! $instructor) {
                continue;
            }

            Coupon::firstOrCreate(
                ['code' => $d['code']],
                [
                    'instructor_id' => $instructor->id,
                    'course_id' => $d['slug'] ? $courseBySlug->get($d['slug'])?->id : null,
                    'discount_percent' => $d['percent'],
                    'valid_until' => Carbon::now()->addDays($d['days'])->toDateString(),
                    'max_usage' => $d['max'],
                    'used_count' => $d['used'],
                    'status' => true,
                ]
            );
        }

        return Coupon::all();
    }

    /**
     * Buat review dengan komentar yang ditulis manual sesuai rating.
     */
    private function seedReviews(): void
    {
        $comments = [
            5 => [
                'Materinya lengkap dan penjelasan instrukturnya sangat mudah dipahami. Sangat direkomendasikan!',
                'Salah satu kursus terbaik yang pernah saya ikuti. Langsung praktik dan aplikatif.',
                'Worth it banget! Dari nol sekarang saya sudah bisa membuat project sendiri.',
                'Penjelasan runtut dari dasar, sangat cocok untuk pemula seperti saya.',
                'Instruktur sabar menjelaskan dan studi kasusnya relevan dengan dunia kerja.',
            ],
            4 => [
                'Materi bagus dan terstruktur, hanya saja kualitas audio beberapa video kurang jernih.',
                'Secara keseluruhan memuaskan, semoga ke depan ada update materi terbaru.',
                'Penjelasannya jelas, tapi beberapa bagian terasa sedikit terlalu cepat.',
                'Bagus untuk pemula, cuma butuh lebih banyak contoh latihan.',
            ],
            3 => [
                'Materi cukup membantu, namun beberapa topik kurang dibahas secara mendalam.',
                'Lumayan untuk pengenalan, tapi perlu belajar tambahan dari sumber lain.',
                'Isinya oke, sayang ada beberapa video yang terasa sudah agak usang.',
            ],
        ];

        // Sekitar 65% enrollment menghasilkan review (bergiliran, deterministik).
        foreach (Enrollment::all()->values() as $i => $enrollment) {
            if ($i % 3 === 2) {
                continue; // 1 dari 3 tidak memberi review
            }

            // Rating berkisar 3-5, mayoritas 4-5.
            $rating = [5, 4, 5, 4, 3][$i % 5];
            $pool = $comments[$rating];

            Review::firstOrCreate(
                [
                    'user_id' => $enrollment->user_id,
                    'course_id' => $enrollment->course_id,
                ],
                [
                    'rating' => $rating,
                    'comment' => $pool[$i % count($pool)],
                    'status' => true,
                ]
            );
        }
    }
}

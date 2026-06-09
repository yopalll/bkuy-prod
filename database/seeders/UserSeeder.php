<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Seed akun: 1 admin, 6 instruktur, 18 student.
     * Semua data ditulis manual agar masuk akal (bukan faker).
     * Password default untuk semua akun: `password`.
     */
    public function run(): void
    {
        // --- Admin ---
        User::factory()->admin()->create([
            'name' => 'Admin BelajarKUY',
            'email' => 'admin@belajarkuy.test',
            'password' => Hash::make('password'),
            'phone' => '+62 811 0000 0001',
            'address' => 'Jakarta Selatan, DKI Jakarta',
            'bio' => 'Pengelola platform BelajarKUY.',
            'website' => 'https://belajarkuy.id',
        ]);

        // --- Instructors ---
        $instructors = [
            [
                'name' => 'Ray Nathan',
                'email' => 'ray@belajarkuy.test',
                'bio' => 'Senior Full-Stack Developer dengan pengalaman 10+ tahun membangun aplikasi web skala besar menggunakan Laravel dan Vue.',
                'website' => 'https://raynathan.dev',
                'phone' => '+62 812 1111 2222',
                'address' => 'Bandung, Jawa Barat',
            ],
            [
                'name' => 'Yosua Valentino',
                'email' => 'yosua@belajarkuy.test',
                'bio' => 'UI/UX Designer & Frontend Engineer. Fokus pada desain antarmuka yang ramah pengguna dan pengembangan dengan React.',
                'website' => 'https://yosua.design',
                'phone' => '+62 813 3333 4444',
                'address' => 'Surabaya, Jawa Timur',
            ],
            [
                'name' => 'Dewi Lestari',
                'email' => 'dewi@belajarkuy.test',
                'bio' => 'Data Scientist di sebuah startup fintech. Berpengalaman mengajar Python dan machine learning untuk pemula.',
                'website' => 'https://dewilestari.id',
                'phone' => '+62 814 5555 6666',
                'address' => 'Yogyakarta, DI Yogyakarta',
            ],
            [
                'name' => 'Budi Santoso',
                'email' => 'budi@belajarkuy.test',
                'bio' => 'DevOps Engineer yang terbiasa mengelola infrastruktur container dengan Docker dan Kubernetes di lingkungan produksi.',
                'website' => 'https://budisantoso.tech',
                'phone' => '+62 815 7777 8888',
                'address' => 'Jakarta Barat, DKI Jakarta',
            ],
            [
                'name' => 'Andi Pratama',
                'email' => 'andi@belajarkuy.test',
                'bio' => 'Mobile Developer spesialis Flutter. Telah merilis belasan aplikasi ke Play Store dan App Store.',
                'website' => 'https://andipratama.app',
                'phone' => '+62 816 9999 0000',
                'address' => 'Semarang, Jawa Tengah',
            ],
            [
                'name' => 'Sari Wulandari',
                'email' => 'sari@belajarkuy.test',
                'bio' => 'Digital Marketing Specialist dengan keahlian SEO, content marketing, dan iklan berbayar untuk UMKM.',
                'website' => 'https://sariwulandari.com',
                'phone' => '+62 817 2468 1357',
                'address' => 'Denpasar, Bali',
            ],
        ];

        foreach ($instructors as $data) {
            User::factory()->instructor()->create(array_merge($data, [
                'password' => Hash::make('password'),
            ]));
        }

        // --- Students ---
        // Akun demo utama untuk testing.
        User::factory()->student()->create([
            'name' => 'Test Student',
            'email' => 'student@belajarkuy.test',
            'password' => Hash::make('password'),
            'phone' => '+62 812 0000 1111',
            'address' => 'Depok, Jawa Barat',
        ]);

        $students = [
            'Ahmad Fauzi', 'Siti Nurhaliza', 'Rizki Ramadhan', 'Putri Anggraini',
            'Bagus Setiawan', 'Nadia Safitri', 'Fajar Nugroho', 'Intan Permata',
            'Dimas Aditya', 'Kirana Maharani', 'Galih Prakoso', 'Wulan Sari',
            'Hendra Wijaya', 'Mega Puspita', 'Yoga Saputra', 'Citra Dewanti',
            'Bayu Firmansyah',
        ];

        foreach ($students as $name) {
            $email = str(strtolower($name))->replace(' ', '.')->append('@example.com')->value();

            User::factory()->student()->create([
                'name' => $name,
                'email' => $email,
                'password' => Hash::make('password'),
                'phone' => null,
                'address' => null,
            ]);
        }
    }
}

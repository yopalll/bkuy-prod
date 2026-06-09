<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\SubCategory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    /**
     * Seed kategori utama + sub-kategori untuk platform BelajarKUY.
     *
     * PENTING: nama kategori harus PERSIS sama dengan yang direferensikan
     * di CourseSeeder (Web Development, Mobile Development, Data Science,
     * UI/UX Design, DevOps, Bisnis & Marketing).
     */
    public function run(): void
    {
        foreach ($this->categories() as $data) {
            $category = Category::create([
                'name'             => $data['name'],
                'slug'             => Str::slug($data['name']),
                'description'      => $data['description'],
                'image_url'        => null,
                'image_public_id'  => null,
                'status'           => true,
            ]);

            foreach ($data['subs'] as $sub) {
                SubCategory::create([
                    'category_id' => $category->id,
                    'name'        => $sub,
                    'slug'        => Str::slug($sub) . '-' . $category->id,
                ]);
            }
        }
    }

    private function categories(): array
    {
        return [
            // ── 1. Web Development ──────────────────────────────────────────────
            [
                'name'        => 'Web Development',
                'description' => 'Kuasai teknologi membangun website dan aplikasi web, dari frontend hingga backend dan arsitektur full-stack.',
                'subs'        => [
                    'Laravel',
                    'React',
                    'Vue.js',
                    'Next.js',
                    'Node.js',
                    'Django & Python Web',
                    'WordPress',
                    'HTML & CSS Dasar',
                    'TypeScript',
                    'REST API & GraphQL',
                ],
            ],

            // ── 2. Mobile Development ────────────────────────────────────────────
            [
                'name'        => 'Mobile Development',
                'description' => 'Bangun aplikasi mobile untuk Android dan iOS menggunakan berbagai framework modern maupun native.',
                'subs'        => [
                    'Flutter',
                    'React Native',
                    'Android (Kotlin)',
                    'iOS (Swift)',
                    'Jetpack Compose',
                    'Firebase untuk Mobile',
                ],
            ],

            // ── 3. Data Science ──────────────────────────────────────────────────
            [
                'name'        => 'Data Science',
                'description' => 'Pelajari analisis data, machine learning, dan kecerdasan buatan untuk mengambil keputusan berbasis data.',
                'subs'        => [
                    'Python',
                    'Machine Learning',
                    'Deep Learning',
                    'Data Analysis',
                    'SQL untuk Data',
                    'Visualisasi Data',
                    'Statistik & Matematika',
                    'NLP & Computer Vision',
                ],
            ],

            // ── 4. UI/UX Design ──────────────────────────────────────────────────
            [
                'name'        => 'UI/UX Design',
                'description' => 'Rancang antarmuka yang indah dan pengalaman pengguna yang intuitif dengan tools dan metodologi desain terkini.',
                'subs'        => [
                    'Figma',
                    'Adobe XD',
                    'Design Thinking',
                    'Prototyping',
                    'User Research',
                    'Design System',
                    'Aksesibilitas & Inklusi',
                ],
            ],

            // ── 5. Desain Grafis ─────────────────────────────────────────────────
            [
                'name'        => 'Desain Grafis',
                'description' => 'Ekspresikan kreativitasmu lewat desain visual, ilustrasi, branding, dan produksi konten digital maupun cetak.',
                'subs'        => [
                    'Adobe Photoshop',
                    'Adobe Illustrator',
                    'Canva',
                    'Branding & Identitas Visual',
                    'Desain Poster & Infografis',
                    'Motion Graphics & Animasi',
                    'Video Editing (Premiere Pro)',
                ],
            ],

            // ── 6. DevOps & Cloud ────────────────────────────────────────────────
            [
                'name'        => 'DevOps',
                'description' => 'Otomatiskan pipeline development, kelola infrastruktur cloud, dan tingkatkan keandalan sistem produksi.',
                'subs'        => [
                    'Docker',
                    'Kubernetes',
                    'CI/CD',
                    'AWS',
                    'Google Cloud Platform',
                    'Linux & Shell Scripting',
                    'Terraform & IaC',
                    'Monitoring & Observability',
                ],
            ],

            // ── 7. Keamanan Siber ────────────────────────────────────────────────
            [
                'name'        => 'Keamanan Siber',
                'description' => 'Lindungi sistem digital dari ancaman dengan keahlian ethical hacking, keamanan jaringan, dan kriptografi.',
                'subs'        => [
                    'Ethical Hacking',
                    'Keamanan Jaringan',
                    'Keamanan Aplikasi Web',
                    'Kriptografi',
                    'OSINT & Recon',
                    'Forensik Digital',
                ],
            ],

            // ── 8. Bisnis & Marketing ────────────────────────────────────────────
            [
                'name'        => 'Bisnis & Marketing',
                'description' => 'Kembangkan bisnis dan brand-mu dengan strategi pemasaran digital, kewirausahaan, dan manajemen yang efektif.',
                'subs'        => [
                    'Digital Marketing',
                    'SEO',
                    'Copywriting',
                    'Content Marketing',
                    'Social Media Marketing',
                    'Google Ads & Meta Ads',
                    'Kewirausahaan',
                    'Manajemen Produk',
                ],
            ],

            // ── 9. Keuangan & Investasi ──────────────────────────────────────────
            [
                'name'        => 'Keuangan & Investasi',
                'description' => 'Kelola keuangan pribadi dan bisnis dengan bijak, pahami investasi saham, reksa dana, dan perencanaan finansial.',
                'subs'        => [
                    'Keuangan Pribadi',
                    'Saham & Analisis Fundamental',
                    'Reksa Dana & ETF',
                    'Akuntansi Dasar',
                    'Perencanaan Pajak',
                    'Kripto & Blockchain',
                ],
            ],

            // ── 10. Bahasa & Komunikasi ──────────────────────────────────────────
            [
                'name'        => 'Bahasa & Komunikasi',
                'description' => 'Tingkatkan kemampuan berbahasa dan berkomunikasi untuk karier global dan kehidupan sehari-hari.',
                'subs'        => [
                    'Bahasa Inggris Bisnis',
                    'TOEFL & IELTS',
                    'Bahasa Jepang',
                    'Bahasa Mandarin',
                    'Bahasa Korea',
                    'Menulis Kreatif',
                    'Public Speaking',
                ],
            ],

            // ── 11. Pengembangan Diri ────────────────────────────────────────────
            [
                'name'        => 'Pengembangan Diri',
                'description' => 'Bangun karakter, kepemimpinan, dan kebiasaan positif untuk meningkatkan kualitas hidup dan performa kerja.',
                'subs'        => [
                    'Kepemimpinan & Manajemen',
                    'Manajemen Waktu & Produktivitas',
                    'Mindset & Motivasi',
                    'Kecerdasan Emosional',
                    'Negosiasi & Persuasi',
                    'Kesehatan Mental & Mindfulness',
                ],
            ],

            // ── 12. Lainnya ──────────────────────────────────────────────────────
            [
                'name'        => 'Lainnya',
                'description' => 'Kursus pilihan dari berbagai topik menarik — dari hobi, seni, memasak, hingga gaya hidup sehat.',
                'subs'        => [
                    'Fotografi & Videografi',
                    'Musik & Instrumen',
                    'Memasak & Kuliner',
                    'Olahraga & Kebugaran',
                    'Parenting & Keluarga',
                    'Seni & Kerajinan Tangan',
                ],
            ],
        ];
    }
}

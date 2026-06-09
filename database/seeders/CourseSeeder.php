<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Course;
use App\Models\CourseGoal;
use App\Models\CourseLecture;
use App\Models\CourseSection;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CourseSeeder extends Seeder
{
    /**
     * Seed 8 kursus dengan kurikulum yang ditulis manual (judul, deskripsi,
     * goals, section, dan lecture semuanya masuk akal — bukan faker).
     */
    public function run(): void
    {
        $instructors = User::where('role', 'instructor')->get()->keyBy('email');
        $categories = Category::with('subCategories')->get();

        if ($instructors->isEmpty() || $categories->isEmpty()) {
            $this->command->warn('UserSeeder dan CategorySeeder harus dijalankan terlebih dahulu.');

            return;
        }

        // Pool placeholder agar URL & durasi tetap variatif tanpa faker.
        $videoIds = ['aqz-KE-bpKQ', 'rfscVS0vtbw', 'SqcY0GlETPk', 'w7ejDZ8SWv8', 'ysz5S6PUMU', 'PkZNo7MtFUM', 'hdI2bqOjy3c', 'BBAyRBTfsOU'];
        $durations = [6, 8, 10, 5, 12, 7, 9, 11, 4, 13, 14, 6];
        $vid = 0;
        $dur = 0;

        foreach ($this->courses() as $data) {
            $category = $categories->firstWhere('name', $data['category']);
            $subCategory = $category?->subCategories->firstWhere('name', $data['subcategory']);
            $instructor = $instructors->get($data['instructor']);

            $course = Course::create([
                'category_id' => $category?->id ?? $categories->first()->id,
                'subcategory_id' => $subCategory?->id,
                'instructor_id' => $instructor?->id ?? $instructors->first()->id,
                'title' => $data['title'],
                'slug' => Str::slug($data['title']),
                'description' => $data['description'],
                'price' => $data['price'],
                'discount' => $data['discount'],
                // Placeholder URL nyata (path relatif lama 'courses/*.jpg' tidak ada filenya → 404)
                'thumbnail' => 'https://placehold.co/600x340/300033/ffffff?text='.urlencode($data['title']),
                'video_url' => 'https://youtu.be/'.$videoIds[$vid++ % count($videoIds)],
                'duration' => $data['duration'],
                'bestseller' => $data['bestseller'],
                'featured' => $data['featured'],
                'status' => 'active',
            ]);

            foreach ($data['goals'] as $goal) {
                CourseGoal::create([
                    'course_id' => $course->id,
                    'goal' => $goal,
                ]);
            }

            $sortSection = 1;
            foreach ($data['sections'] as $sectionTitle => $lectures) {
                $section = CourseSection::create([
                    'course_id' => $course->id,
                    'title' => $sectionTitle,
                    'sort_order' => $sortSection++,
                ]);

                $sortLecture = 1;
                foreach ($lectures as [$lectureTitle, $content]) {
                    CourseLecture::create([
                        'section_id'  => $section->id,
                        'title'       => $lectureTitle,
                        'source_type' => 'youtube',
                        'video_path'  => 'https://www.youtube.com/embed/'.$videoIds[$vid++ % count($videoIds)],
                        'content'     => $content,
                        'duration'    => $durations[$dur++ % count($durations)],
                        'sort_order'  => $sortLecture++,
                    ]);
                }
            }
        }
    }

    /**
     * Definisi kursus lengkap dengan kurikulum manual.
     */
    private function courses(): array
    {
        return [
            [
                'instructor' => 'ray@belajarkuy.test',
                'category' => 'Web Development',
                'subcategory' => 'Laravel',
                'title' => 'Laravel 12 untuk Pemula',
                'description' => 'Pelajari framework PHP paling populer di Indonesia dari nol. Mulai dari instalasi, routing, Blade templating, Eloquent ORM, hingga membangun aplikasi CRUD lengkap dengan sistem autentikasi. Cocok untuk pemula yang sudah memahami dasar PHP dan ingin serius menekuni web development.',
                'price' => 299000,
                'discount' => 20,
                'duration' => '14 jam',
                'bestseller' => true,
                'featured' => true,
                'goals' => [
                    'Memahami konsep MVC dan struktur project Laravel',
                    'Menguasai routing, controller, dan Blade templating',
                    'Mengelola database dengan Eloquent ORM dan migration',
                    'Membangun sistem autentikasi dan otorisasi',
                    'Membuat aplikasi CRUD yang siap dipakai',
                ],
                'sections' => [
                    'Pengenalan & Persiapan' => [
                        ['Apa itu Laravel dan Kenapa Memilihnya', 'Mengenal Laravel sebagai framework PHP dan keunggulannya dibanding menulis PHP murni.'],
                        ['Instalasi Laravel dengan Composer', 'Langkah memasang Composer dan membuat project Laravel baru di komputer lokal.'],
                        ['Memahami Struktur Folder Project', 'Penjelasan fungsi tiap folder penting seperti app, routes, resources, dan config.'],
                        ['Menjalankan Server dengan Artisan', 'Menggunakan perintah artisan serve dan mengenal CLI bawaan Laravel.'],
                    ],
                    'Routing & Controller' => [
                        ['Dasar Routing di Laravel', 'Membuat route sederhana dan memahami HTTP method GET dan POST.'],
                        ['Membuat Controller Pertama', 'Memisahkan logika dari route dengan membuat dan memanggil controller.'],
                        ['Route Parameter dan Named Route', 'Mengirim parameter lewat URL dan memberi nama route agar mudah dipanggil.'],
                        ['Mengenal Middleware', 'Menyaring request menggunakan middleware sebelum masuk ke controller.'],
                    ],
                    'Blade Templating' => [
                        ['Sintaks Dasar Blade', 'Menampilkan data, perulangan, dan percabangan menggunakan sintaks Blade.'],
                        ['Layout dan Komponen Blade', 'Membuat layout induk dan komponen agar tampilan dapat digunakan ulang.'],
                        ['Menampilkan Data ke View', 'Mengirim data dari controller ke view dan menampilkannya dengan aman.'],
                    ],
                    'Database & Eloquent' => [
                        ['Konfigurasi Database dan Migration', 'Mengatur koneksi database dan membuat tabel lewat migration.'],
                        ['Membuat Model dan Eloquent Basics', 'Mengambil dan menyimpan data menggunakan Eloquent ORM.'],
                        ['Relasi One to Many', 'Menghubungkan dua tabel dengan relasi hasMany dan belongsTo.'],
                        ['Seeder dan Factory untuk Data Dummy', 'Mengisi database dengan data contoh menggunakan seeder dan factory.'],
                    ],
                    'Autentikasi & Studi Kasus' => [
                        ['Membuat Sistem Login dan Register', 'Membangun fitur pendaftaran dan login pengguna dari awal.'],
                        ['Proteksi Route dengan Auth', 'Membatasi akses halaman hanya untuk pengguna yang sudah login.'],
                        ['Studi Kasus: Aplikasi Manajemen Tugas', 'Menggabungkan semua materi menjadi aplikasi to-do list sederhana.'],
                    ],
                ],
            ],
            [
                'instructor' => 'yosua@belajarkuy.test',
                'category' => 'Web Development',
                'subcategory' => 'React',
                'title' => 'React + TypeScript dari Nol',
                'description' => 'Kuasai React modern dengan TypeScript untuk membangun antarmuka web yang scalable dan type-safe. Materi mencakup komponen, hooks, state management, hingga konsumsi REST API. Ideal untuk frontend developer yang ingin menulis kode lebih rapi dan bebas bug.',
                'price' => 349000,
                'discount' => 15,
                'duration' => '12 jam',
                'bestseller' => true,
                'featured' => false,
                'goals' => [
                    'Memahami konsep komponen dan JSX',
                    'Mengelola state dengan useState dan useEffect',
                    'Menambahkan type safety dengan TypeScript',
                    'Mengonsumsi REST API menggunakan fetch atau axios',
                    'Membangun aplikasi React yang siap di-deploy',
                ],
                'sections' => [
                    'Fondasi React' => [
                        ['Setup Project dengan Vite', 'Membuat project React baru yang cepat menggunakan Vite.'],
                        ['Memahami Komponen dan JSX', 'Menulis komponen pertama dan memahami sintaks JSX.'],
                        ['Props dan Komposisi Komponen', 'Mengirim data antar komponen melalui props.'],
                    ],
                    'Hooks Esensial' => [
                        ['State dengan useState', 'Menyimpan dan memperbarui data lokal komponen.'],
                        ['Efek Samping dengan useEffect', 'Menjalankan kode saat komponen dirender atau berubah.'],
                        ['Membuat Custom Hook', 'Mengekstrak logika berulang menjadi hook buatan sendiri.'],
                    ],
                    'TypeScript di React' => [
                        ['Typing Props dan State', 'Menambahkan tipe data pada props dan state agar lebih aman.'],
                        ['Interface dan Type Alias', 'Mendefinisikan bentuk objek dengan interface dan type.'],
                        ['Generic pada Komponen', 'Membuat komponen fleksibel yang mendukung berbagai tipe data.'],
                    ],
                    'Integrasi API' => [
                        ['Fetch Data dari REST API', 'Mengambil data dari server dan menampilkannya di layar.'],
                        ['Menangani Loading dan Error', 'Memberi umpan balik saat data dimuat atau gagal dimuat.'],
                        ['Studi Kasus: Aplikasi Daftar Produk', 'Membangun halaman katalog produk yang mengambil data dari API.'],
                    ],
                ],
            ],
            [
                'instructor' => 'yosua@belajarkuy.test',
                'category' => 'UI/UX Design',
                'subcategory' => 'Figma',
                'title' => 'UI/UX Design dengan Figma',
                'description' => 'Belajar merancang antarmuka aplikasi yang menarik dan ramah pengguna menggunakan Figma. Dari riset pengguna, wireframing, desain visual, hingga prototyping interaktif. Tidak perlu pengalaman desain sebelumnya untuk mengikuti kursus ini.',
                'price' => 249000,
                'discount' => 0,
                'duration' => '9 jam',
                'bestseller' => false,
                'featured' => true,
                'goals' => [
                    'Memahami prinsip dasar UI dan UX',
                    'Membuat wireframe dan user flow',
                    'Mendesain antarmuka dengan komponen Figma',
                    'Membangun design system sederhana',
                    'Membuat prototype interaktif yang bisa diklik',
                ],
                'sections' => [
                    'Dasar UI/UX' => [
                        ['Perbedaan UI dan UX', 'Memahami batasan dan keterkaitan antara desain UI dan UX.'],
                        ['Prinsip Desain yang Baik', 'Mengenal prinsip konsistensi, hierarki, dan keterbacaan.'],
                        ['Mengenal Antarmuka Figma', 'Tur singkat fitur utama Figma untuk mulai mendesain.'],
                    ],
                    'Riset & Wireframe' => [
                        ['User Persona dan User Flow', 'Memetakan siapa pengguna dan alur yang mereka lalui.'],
                        ['Membuat Wireframe Low-Fidelity', 'Menyusun kerangka tampilan sebelum masuk ke desain detail.'],
                    ],
                    'Desain Visual' => [
                        ['Warna, Tipografi, dan Spacing', 'Memilih palet warna, font, dan jarak yang harmonis.'],
                        ['Komponen dan Auto Layout', 'Membuat elemen yang reusable dan responsif di Figma.'],
                        ['Membuat Design System Sederhana', 'Menyusun kumpulan style dan komponen yang konsisten.'],
                    ],
                    'Prototyping' => [
                        ['Menghubungkan Antar Frame', 'Membuat alur navigasi antar halaman desain.'],
                        ['Menambahkan Animasi dan Transisi', 'Memberi efek perpindahan agar prototype terasa nyata.'],
                        ['Studi Kasus: Prototype Aplikasi Mobile', 'Merancang prototype lengkap sebuah aplikasi mobile.'],
                    ],
                ],
            ],
            [
                'instructor' => 'dewi@belajarkuy.test',
                'category' => 'Data Science',
                'subcategory' => 'Python',
                'title' => 'Dasar Pemrograman Python',
                'description' => 'Mulai perjalanan programmingmu dengan Python, bahasa yang mudah dipelajari dan banyak digunakan di dunia kerja. Materi meliputi sintaks dasar, struktur data, fungsi, hingga pemrograman berorientasi objek, lengkap dengan latihan praktis.',
                'price' => 199000,
                'discount' => 10,
                'duration' => '10 jam',
                'bestseller' => true,
                'featured' => false,
                'goals' => [
                    'Memahami sintaks dasar Python',
                    'Menguasai struktur data list, tuple, dan dictionary',
                    'Membuat fungsi dan modul yang reusable',
                    'Memahami konsep OOP di Python',
                    'Menyelesaikan studi kasus program sederhana',
                ],
                'sections' => [
                    'Mengenal Python' => [
                        ['Instalasi Python dan Editor', 'Memasang Python dan menyiapkan editor kode seperti VS Code.'],
                        ['Variabel dan Tipe Data', 'Mengenal angka, teks, dan boolean serta cara menyimpannya.'],
                        ['Operator dan Input/Output', 'Melakukan operasi dasar dan menerima masukan dari pengguna.'],
                    ],
                    'Kontrol Alur Program' => [
                        ['Percabangan if-elif-else', 'Membuat program mengambil keputusan berdasarkan kondisi.'],
                        ['Perulangan for dan while', 'Mengulang proses secara efisien dengan loop.'],
                    ],
                    'Struktur Data' => [
                        ['List dan Tuple', 'Menyimpan kumpulan data secara berurutan.'],
                        ['Dictionary dan Set', 'Menyimpan data dalam bentuk pasangan kunci-nilai.'],
                    ],
                    'Fungsi & OOP' => [
                        ['Membuat dan Memanggil Fungsi', 'Memecah program menjadi bagian yang lebih terkelola.'],
                        ['Mengenal Class dan Object', 'Memahami dasar pemrograman berorientasi objek.'],
                        ['Studi Kasus: Kalkulator Sederhana', 'Membuat program kalkulator menggunakan fungsi dan kondisi.'],
                    ],
                ],
            ],
            [
                'instructor' => 'dewi@belajarkuy.test',
                'category' => 'Data Science',
                'subcategory' => 'Machine Learning',
                'title' => 'Machine Learning untuk Pemula',
                'description' => 'Pahami konsep machine learning dari dasar dengan pendekatan praktis menggunakan Python dan scikit-learn. Pelajari cara menyiapkan data, membangun model regresi dan klasifikasi, serta mengevaluasinya tanpa terjebak rumus matematika yang rumit.',
                'price' => 399000,
                'discount' => 25,
                'duration' => '11 jam',
                'bestseller' => false,
                'featured' => false,
                'goals' => [
                    'Memahami konsep dasar machine learning',
                    'Menyiapkan dan membersihkan data',
                    'Membangun model regresi dan klasifikasi',
                    'Mengevaluasi performa model dengan metrik yang tepat',
                    'Menerapkan machine learning pada dataset nyata',
                ],
                'sections' => [
                    'Pengantar Machine Learning' => [
                        ['Apa itu Machine Learning', 'Memahami definisi dan contoh penerapan ML sehari-hari.'],
                        ['Supervised vs Unsupervised', 'Membedakan dua pendekatan utama dalam machine learning.'],
                        ['Tools dan Library yang Dipakai', 'Mengenal NumPy, Pandas, dan scikit-learn.'],
                    ],
                    'Persiapan Data' => [
                        ['Memuat Data dengan Pandas', 'Membaca dataset dari file CSV ke dalam DataFrame.'],
                        ['Membersihkan dan Normalisasi Data', 'Menangani data kosong dan menyeragamkan skala fitur.'],
                    ],
                    'Model Supervised' => [
                        ['Regresi Linear', 'Memprediksi nilai kontinu dengan model regresi.'],
                        ['Klasifikasi dengan Decision Tree', 'Mengelompokkan data ke dalam kategori.'],
                        ['Evaluasi Model', 'Mengukur akurasi model dengan metrik yang sesuai.'],
                    ],
                    'Proyek Akhir' => [
                        ['Studi Kasus: Prediksi Harga Rumah', 'Membangun model prediksi harga rumah dari dataset nyata.'],
                    ],
                ],
            ],
            [
                'instructor' => 'andi@belajarkuy.test',
                'category' => 'Mobile Development',
                'subcategory' => 'Flutter',
                'title' => 'Flutter: Membangun Aplikasi Mobile Pertama',
                'description' => 'Bangun aplikasi mobile untuk Android dan iOS sekaligus dengan satu basis kode menggunakan Flutter. Materi dimulai dari widget dasar, layout, navigasi, state management, hingga integrasi API dan menyiapkan aplikasi untuk dirilis.',
                'price' => 329000,
                'discount' => 0,
                'duration' => '13 jam',
                'bestseller' => false,
                'featured' => false,
                'goals' => [
                    'Memahami konsep widget di Flutter',
                    'Membuat layout yang responsif',
                    'Mengelola navigasi antar halaman',
                    'Mengelola state aplikasi',
                    'Mengintegrasikan API dan menampilkan data',
                ],
                'sections' => [
                    'Dasar Flutter' => [
                        ['Instalasi Flutter dan Setup', 'Memasang Flutter SDK dan menyiapkan emulator.'],
                        ['Memahami Konsep Widget', 'Mengenal widget sebagai blok pembangun antarmuka.'],
                        ['Stateless vs Stateful Widget', 'Membedakan widget yang statis dan yang menyimpan state.'],
                    ],
                    'Layout & Navigasi' => [
                        ['Layout dengan Row dan Column', 'Menyusun elemen secara horizontal dan vertikal.'],
                        ['Navigasi Antar Halaman', 'Berpindah halaman menggunakan Navigator.'],
                    ],
                    'State & Data' => [
                        ['Mengelola State dengan setState', 'Memperbarui tampilan saat data berubah.'],
                        ['Integrasi REST API', 'Mengambil data dari server dan menampilkannya.'],
                    ],
                    'Finalisasi Aplikasi' => [
                        ['Styling dan Tema Aplikasi', 'Menyeragamkan tampilan dengan tema kustom.'],
                        ['Studi Kasus: Aplikasi Catatan', 'Membuat aplikasi catatan sederhana dari awal.'],
                    ],
                ],
            ],
            [
                'instructor' => 'budi@belajarkuy.test',
                'category' => 'DevOps',
                'subcategory' => 'Docker',
                'title' => 'Docker & Kubernetes untuk Developer',
                'description' => 'Pelajari cara mengemas, menjalankan, dan men-deploy aplikasi menggunakan Docker dan Kubernetes. Kursus ini cocok untuk developer yang ingin memahami containerization dan orkestrasi sebagai bagian dari alur kerja modern.',
                'price' => 449000,
                'discount' => 30,
                'duration' => '12 jam',
                'bestseller' => false,
                'featured' => false,
                'goals' => [
                    'Memahami konsep container dan image',
                    'Membuat dan menjalankan container Docker',
                    'Menulis Dockerfile dan docker-compose',
                    'Memahami dasar orkestrasi Kubernetes',
                    'Men-deploy aplikasi ke dalam cluster',
                ],
                'sections' => [
                    'Dasar Docker' => [
                        ['Apa itu Container dan Docker', 'Memahami masalah yang diselesaikan oleh container.'],
                        ['Menjalankan Container Pertama', 'Menjalankan image dari Docker Hub di lokal.'],
                        ['Membuat Image dengan Dockerfile', 'Menulis Dockerfile untuk mengemas aplikasi sendiri.'],
                    ],
                    'Docker Compose' => [
                        ['Multi-Container dengan Compose', 'Menjalankan beberapa service sekaligus dengan satu file.'],
                        ['Volume dan Networking', 'Menyimpan data persisten dan menghubungkan antar container.'],
                    ],
                    'Pengantar Kubernetes' => [
                        ['Arsitektur Kubernetes', 'Mengenal komponen master dan worker node.'],
                        ['Pod, Deployment, dan Service', 'Memahami objek inti untuk menjalankan aplikasi.'],
                    ],
                    'Deployment' => [
                        ['Deploy Aplikasi ke Cluster', 'Menerapkan aplikasi ke dalam cluster Kubernetes.'],
                        ['Studi Kasus: Deploy API Node.js', 'Men-deploy sebuah REST API dari Docker ke Kubernetes.'],
                    ],
                ],
            ],
            [
                'instructor' => 'sari@belajarkuy.test',
                'category' => 'Bisnis & Marketing',
                'subcategory' => 'Digital Marketing',
                'title' => 'Digital Marketing & SEO Fundamental',
                'description' => 'Pelajari strategi pemasaran digital yang efektif untuk meningkatkan brand dan penjualan. Mulai dari SEO, media sosial, content marketing, hingga iklan berbayar dan analisis performa kampanye. Cocok untuk pemilik UMKM maupun calon marketer.',
                'price' => 179000,
                'discount' => 10,
                'duration' => '8 jam',
                'bestseller' => false,
                'featured' => false,
                'goals' => [
                    'Memahami pilar utama digital marketing',
                    'Mengoptimasi website dengan teknik SEO',
                    'Menyusun strategi konten dan media sosial',
                    'Menjalankan iklan berbayar dasar',
                    'Menganalisis performa kampanye',
                ],
                'sections' => [
                    'Fondasi Digital Marketing' => [
                        ['Pilar Digital Marketing', 'Mengenal kanal-kanal utama pemasaran digital.'],
                        ['Memahami Target Audiens', 'Menentukan siapa yang ingin dijangkau dan kebutuhannya.'],
                    ],
                    'SEO Dasar' => [
                        ['Cara Kerja Mesin Pencari', 'Memahami bagaimana Google mengindeks dan memeringkat halaman.'],
                        ['Riset Kata Kunci', 'Menemukan kata kunci yang dicari calon pelanggan.'],
                        ['On-Page dan Off-Page SEO', 'Mengoptimasi konten dan membangun reputasi situs.'],
                    ],
                    'Konten & Media Sosial' => [
                        ['Strategi Content Marketing', 'Membuat konten yang menarik dan bernilai bagi audiens.'],
                        ['Mengelola Media Sosial', 'Menyusun jadwal dan jenis konten untuk media sosial.'],
                    ],
                    'Iklan & Analisis' => [
                        ['Pengantar Google Ads', 'Membuat kampanye iklan berbayar pertama.'],
                        ['Analisis dengan Google Analytics', 'Mengukur dan memahami performa kampanye.'],
                    ],
                ],
            ],
        ];
    }
}

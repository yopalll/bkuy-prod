import AppLayout from '@/Layouts/AppLayout';
import { Head } from '@inertiajs/react';

const SECTIONS = [
    {
        icon: 'info',
        title: '1. Informasi yang Kami Kumpulkan',
        content: [
            {
                subtitle: 'Data yang Anda Berikan Langsung',
                text: 'Saat mendaftar, kami mengumpulkan nama lengkap, alamat email, dan kata sandi. Saat melakukan pembelian, kami menyimpan informasi transaksi Anda (tidak termasuk data kartu kredit — dikelola oleh Midtrans). Saat menggunakan fitur kursus, kami menyimpan progres belajar dan ulasan yang Anda buat.',
            },
            {
                subtitle: 'Data yang Dikumpulkan Otomatis',
                text: 'Kami mengumpulkan log akses, alamat IP, jenis browser, dan halaman yang dikunjungi untuk keamanan dan analitik. Cookie digunakan untuk menjaga sesi login dan preferensi pengguna.',
            },
        ],
    },
    {
        icon: 'manage_accounts',
        title: '2. Cara Kami Menggunakan Data Anda',
        content: [
            {
                text: 'Data Anda digunakan untuk: (a) menyediakan layanan platform BelajarKUY, (b) memproses transaksi dan mengirimkan bukti pembayaran, (c) mengirim notifikasi terkait kursus dan aktivitas akun, (d) meningkatkan kualitas layanan dan pengalaman pengguna, (e) mencegah penipuan dan pelanggaran kebijakan, serta (f) memenuhi kewajiban hukum yang berlaku.',
            },
        ],
    },
    {
        icon: 'share',
        title: '3. Berbagi Data dengan Pihak Ketiga',
        content: [
            {
                text: 'Kami tidak menjual data pribadi Anda. Kami hanya berbagi data dengan pihak ketiga dalam situasi berikut:',
            },
            {
                subtitle: 'Penyedia Layanan Pembayaran',
                text: 'Midtrans memproses pembayaran. Data yang dikirimkan hanya yang diperlukan untuk otorisasi transaksi.',
            },
            {
                subtitle: 'Penyedia Cloud',
                text: 'Cloudinary (penyimpanan media) dan Google Cloud Storage (penyimpanan video) digunakan sesuai kebijakan privasi masing-masing.',
            },
            {
                subtitle: 'Kewajiban Hukum',
                text: 'Kami dapat mengungkapkan data jika diwajibkan oleh hukum atau perintah pengadilan.',
            },
        ],
    },
    {
        icon: 'lock',
        title: '4. Keamanan Data',
        content: [
            {
                text: 'Kami menerapkan langkah-langkah keamanan standar industri: enkripsi HTTPS/TLS untuk semua transmisi data, kata sandi disimpan menggunakan hashing bcrypt, akses database dibatasi dan dimonitor, serta audit keamanan dilakukan secara berkala.',
            },
            {
                text: 'Meski demikian, tidak ada sistem yang 100% aman. Kami mendorong Anda untuk menggunakan kata sandi yang kuat dan tidak membagikan kredensial akun kepada siapa pun.',
            },
        ],
    },
    {
        icon: 'person',
        title: '5. Hak-Hak Anda',
        content: [
            {
                text: 'Sebagai pengguna BelajarKUY, Anda memiliki hak untuk:',
            },
            {
                subtitle: 'Akses & Portabilitas',
                text: 'Meminta salinan data pribadi yang kami miliki tentang Anda.',
            },
            {
                subtitle: 'Koreksi',
                text: 'Memperbarui atau memperbaiki data pribadi Anda melalui halaman Pengaturan Profil.',
            },
            {
                subtitle: 'Penghapusan',
                text: 'Meminta penghapusan akun dan data pribadi Anda, kecuali data yang wajib disimpan untuk tujuan hukum atau akuntansi.',
            },
            {
                subtitle: 'Penarikan Persetujuan',
                text: 'Menarik persetujuan penggunaan data kapan saja, namun ini mungkin mempengaruhi kemampuan Anda menggunakan layanan.',
            },
        ],
    },
    {
        icon: 'cookie',
        title: '6. Cookie dan Teknologi Pelacak',
        content: [
            {
                text: 'Kami menggunakan cookie untuk menjaga sesi login, menyimpan preferensi bahasa, dan menganalisis penggunaan platform (Google Analytics). Anda dapat menonaktifkan cookie melalui pengaturan browser, namun beberapa fitur platform mungkin tidak berfungsi optimal.',
            },
        ],
    },
    {
        icon: 'child_care',
        title: '7. Perlindungan Anak',
        content: [
            {
                text: 'Layanan BelajarKUY tidak ditujukan untuk anak di bawah usia 13 tahun. Kami tidak sengaja mengumpulkan data pribadi dari anak di bawah usia tersebut. Jika Anda mengetahui bahwa anak Anda telah memberikan data pribadi, harap hubungi kami segera.',
            },
        ],
    },
    {
        icon: 'update',
        title: '8. Perubahan Kebijakan',
        content: [
            {
                text: 'Kami dapat memperbarui kebijakan privasi ini dari waktu ke waktu. Perubahan signifikan akan diberitahukan melalui email atau notifikasi di platform. Penggunaan layanan yang berkelanjutan setelah perubahan dianggap sebagai persetujuan terhadap kebijakan yang diperbarui.',
            },
        ],
    },
];

export default function Privacy() {
    return (
        <AppLayout>
            <Head title="Kebijakan Privasi — BelajarKUY" />

            {/* Hero */}
            <section className="bg-primary text-on-primary py-14 px-margin-mobile md:px-margin-desktop">
                <div className="max-w-3xl mx-auto text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 mb-5">
                        <span className="material-symbols-outlined text-[32px]">privacy_tip</span>
                    </div>
                    <h1 className="font-headline-lg text-headline-lg font-bold mb-3">Kebijakan Privasi</h1>
                    <p className="font-body-lg text-body-lg opacity-80">
                        Terakhir diperbarui: Juni 2026
                    </p>
                </div>
            </section>

            <div className="max-w-3xl mx-auto px-margin-mobile md:px-margin-desktop py-xl">
                {/* Intro */}
                <div className="bg-primary-fixed/20 border border-primary/10 rounded-2xl p-5 mb-xl">
                    <p className="text-sm text-on-surface leading-relaxed">
                        BelajarKUY ("kami", "platform") berkomitmen melindungi privasi pengguna. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi pribadi Anda saat menggunakan layanan kami di <strong>belajarkuy.id</strong>.
                    </p>
                </div>

                {/* Sections */}
                <div className="space-y-xl">
                    {SECTIONS.map(({ icon, title, content }) => (
                        <section key={title}>
                            <div className="flex items-center gap-3 mb-md">
                                <div className="w-9 h-9 rounded-xl bg-primary-fixed/30 flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-primary text-[18px]">{icon}</span>
                                </div>
                                <h2 className="font-title-lg text-title-lg font-bold text-on-surface">{title}</h2>
                            </div>
                            <div className="pl-12 space-y-3">
                                {content.map(({ subtitle, text }, i) => (
                                    <div key={i}>
                                        {subtitle && <p className="font-semibold text-on-surface text-sm mb-1">{subtitle}</p>}
                                        <p className="text-sm text-on-surface-variant leading-relaxed">{text}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    ))}
                </div>

                {/* Contact CTA */}
                <div className="mt-xl p-6 bg-surface border border-outline-variant rounded-3xl text-center">
                    <span className="material-symbols-outlined text-primary text-[32px] mb-3 block">contact_support</span>
                    <h3 className="font-title-md text-title-md font-bold text-on-surface mb-2">Pertanyaan tentang privasi?</h3>
                    <p className="text-sm text-on-surface-variant mb-4">Hubungi kami melalui halaman Kontak atau kirim email ke <strong>privacy@belajarkuy.id</strong></p>
                    <a href="/hubungi-kami"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-on-primary font-semibold text-sm hover:opacity-90 transition-opacity">
                        <span className="material-symbols-outlined text-[16px]">mail</span>
                        Hubungi Kami
                    </a>
                </div>
            </div>
        </AppLayout>
    );
}

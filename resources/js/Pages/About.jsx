import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';

const TEAM = [
    {
        name: 'Yosua Valentino',
        role: 'Project Manager & Full-Stack Developer',
        initials: 'YV',
        color: 'bg-primary',
        tasks: ['Koordinasi tim & manajemen sprint', 'Integrasi Midtrans (checkout & enrollment)', 'Email notifikasi & sertifikat', 'Deployment VPS + Docker'],
    },
    {
        name: 'Albariqi Tarigan',
        role: 'Backend Developer — Auth & Player',
        initials: 'AT',
        color: 'bg-secondary',
        tasks: ['Sistem autentikasi (email + Google OAuth)', 'Course Player & tracking progres', 'Manajemen sesi & keamanan akun'],
    },
    {
        name: 'Ray Nathan',
        role: 'Backend Developer — Commerce',
        initials: 'RN',
        color: 'bg-success',
        tasks: ['Sistem keranjang belanja & wishlist', 'Manajemen kupon diskon', 'Alur transaksi & riwayat pesanan'],
    },
    {
        name: 'Vascha U',
        role: 'Frontend Developer — UI/UX',
        initials: 'VU',
        color: 'bg-warning',
        tasks: ['Desain sistem & brand identity BelajarKUY', 'Landing page & halaman publik', 'Komponen UI yang konsisten'],
    },
    {
        name: 'Quinsha Ilmi',
        role: 'Frontend Developer — Admin Panel',
        initials: 'QI',
        color: 'bg-tertiary',
        tasks: ['Panel admin manajemen kursus & pengguna', 'Migrasi blade → React Inertia', 'Dashboard analitik instruktur'],
    },
];

const VALUES = [
    { icon: 'lightbulb',    title: 'Inovasi',       desc: 'Kami terus berinovasi untuk menghadirkan pengalaman belajar yang lebih baik.' },
    { icon: 'favorite',     title: 'Inklusivitas',  desc: 'Pendidikan berkualitas harus dapat diakses oleh semua orang, tanpa terkecuali.' },
    { icon: 'verified',     title: 'Kualitas',       desc: 'Setiap kursus dikurasi untuk memastikan nilai pembelajaran yang maksimal.' },
    { icon: 'group',        title: 'Komunitas',     desc: 'Membangun ekosistem belajar yang saling mendukung antar pelajar dan instruktur.' },
];

export default function About() {
    return (
        <AppLayout>
            <Head title="Tentang Kami — BelajarKUY" />

            {/* Hero */}
            <section className="bg-primary text-on-primary py-16 px-margin-mobile md:px-margin-desktop">
                <div className="max-w-3xl mx-auto text-center">
                    <p className="text-sm font-bold uppercase tracking-widest opacity-70 mb-3">Tugas Besar Pemrograman Web</p>
                    <h1 className="font-headline-lg text-headline-lg font-bold mb-4">Tentang BelajarKUY</h1>
                    <p className="font-body-lg text-body-lg opacity-80 leading-relaxed">
                        Platform e-learning karya mahasiswa Indonesia yang dirancang untuk mendemokratisasi akses pendidikan digital berkualitas.
                    </p>
                </div>
            </section>

            {/* Story */}
            <section className="max-w-3xl mx-auto px-margin-mobile md:px-margin-desktop py-xl">
                <div className="text-center mb-xl">
                    <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-4">Cerita Kami</h2>
                    <p className="text-base text-on-surface-variant leading-relaxed">
                        BelajarKUY lahir dari semangat 5 mahasiswa yang ingin membuktikan bahwa proyek akademik bisa setara dengan produk nyata. Kami membangun platform marketplace e-learning berbasis teknologi modern — mulai dari autentikasi, sistem pembayaran, hingga course player berbasis video — dalam satu semester penuh.
                    </p>
                    <p className="text-base text-on-surface-variant leading-relaxed mt-4">
                        Nama "BelajarKUY" mencerminkan semangat kami: <em>yuk belajar!</em> — mengajak siapa saja untuk terus bertumbuh dengan cara yang menyenangkan dan terjangkau.
                    </p>
                </div>
            </section>

            {/* Values */}
            <section className="bg-surface-container-low py-xl px-margin-mobile md:px-margin-desktop">
                <div className="max-w-4xl mx-auto">
                    <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface text-center mb-xl">Nilai-Nilai Kami</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-gutter">
                        {VALUES.map(({ icon, title, desc }) => (
                            <div key={title} className="bg-surface rounded-2xl p-5 text-center border border-outline-variant">
                                <div className="w-12 h-12 rounded-2xl bg-primary-fixed/30 flex items-center justify-center mx-auto mb-3">
                                    <span className="material-symbols-outlined text-primary text-[24px]">{icon}</span>
                                </div>
                                <h3 className="font-bold text-on-surface mb-2">{title}</h3>
                                <p className="text-xs text-on-surface-variant leading-relaxed">{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team */}
            <section className="max-w-5xl mx-auto px-margin-mobile md:px-margin-desktop py-xl">
                <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface text-center mb-xl">Tim Pengembang</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-gutter">
                    {TEAM.map(({ name, role, initials, color, tasks }) => (
                        <div key={name} className="bg-surface border border-outline-variant rounded-3xl p-6 flex flex-col gap-4">
                            <div className="flex items-center gap-4">
                                <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center shrink-0`}>
                                    <span className="text-lg font-extrabold text-white">{initials}</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-on-surface">{name}</h3>
                                    <p className="text-xs text-on-surface-variant mt-0.5">{role}</p>
                                </div>
                            </div>
                            <ul className="space-y-1.5">
                                {tasks.map((t) => (
                                    <li key={t} className="flex gap-2 items-start">
                                        <span className="material-symbols-outlined text-success text-[14px] mt-0.5 shrink-0">check_circle</span>
                                        <span className="text-xs text-on-surface-variant">{t}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="bg-primary text-on-primary py-12 px-margin-mobile md:px-margin-desktop text-center">
                <h2 className="font-headline-sm text-headline-sm font-bold mb-3">Bergabunglah Bersama Kami</h2>
                <p className="opacity-80 mb-6 max-w-xl mx-auto">Mulai perjalanan belajarmu hari ini dan jadilah bagian dari komunitas pelajar BelajarKUY.</p>
                <Link href="/home" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-warning text-white font-bold hover:opacity-90 transition-opacity">
                    <span className="material-symbols-outlined text-[18px]">rocket_launch</span>
                    Jelajahi Kursus
                </Link>
            </section>
        </AppLayout>
    );
}

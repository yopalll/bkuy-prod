import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';

const TECH_STACK = [
    {
        category: 'Backend',
        icon: 'dns',
        color: 'bg-primary-fixed/30 text-primary',
        items: [
            { name: 'Laravel 12', desc: 'Framework PHP modern — routing, middleware, Eloquent ORM, Queue, Mail' },
            { name: 'PHP 8.3', desc: 'Fitur terbaru: named arguments, readonly properties, match expressions' },
            { name: 'MySQL 8', desc: 'Basis data relasional — mendukung transaksi ACID dan full-text search' },
            { name: 'Laravel Sanctum', desc: 'Autentikasi token-based untuk SPA berbasis Inertia.js' },
            { name: 'Laravel Queue', desc: 'Antrian job untuk email konfirmasi dan notifikasi asinkron' },
        ],
    },
    {
        category: 'Frontend',
        icon: 'brush',
        color: 'bg-secondary-fixed/40 text-secondary',
        items: [
            { name: 'React 19', desc: 'Library UI berbasis komponen dengan hooks dan concurrent rendering' },
            { name: 'Inertia.js', desc: 'Jembatan Laravel ↔ React — SPA-like tanpa REST API terpisah' },
            { name: 'Tailwind CSS 4', desc: 'Utility-first CSS dengan design tokens BelajarKUY custom' },
            { name: 'Vite 6', desc: 'Build tool modern — HMR instan dan bundling untuk produksi' },
            { name: 'react-i18next', desc: 'Internasionalisasi UI: dukungan Bahasa Indonesia dan Inggris' },
        ],
    },
    {
        category: 'Infrastructure',
        icon: 'cloud',
        color: 'bg-success/10 text-success',
        items: [
            { name: 'Docker + Docker Compose', desc: 'Kontainerisasi multi-stage: app (PHP-FPM), web (Nginx), assets (Node)' },
            { name: 'Google Cloud Platform VPS', desc: 'Hosting produksi di Compute Engine — e2-medium, Jakarta region' },
            { name: 'Nginx', desc: 'Web server reverse-proxy ke PHP-FPM, static file serving' },
            { name: 'Google Cloud Storage', desc: 'Penyimpanan video kursus dengan signed URL untuk akses aman' },
        ],
    },
    {
        category: 'Layanan Eksternal',
        icon: 'hub',
        color: 'bg-warning/10 text-warning',
        items: [
            { name: 'Midtrans', desc: 'Payment gateway — Virtual Account, GoPay, OVO, kartu kredit/debit' },
            { name: 'Cloudinary', desc: 'CDN untuk thumbnail kursus, foto profil, dan aset gambar' },
            { name: 'Meilisearch', desc: 'Full-text search engine — pencarian kursus instan dan relevan' },
            { name: 'Laravel Reverb', desc: 'WebSocket server untuk notifikasi real-time' },
            { name: 'Resend', desc: 'Email transaksional — konfirmasi pembayaran dan enrollment' },
            { name: 'Google OAuth 2.0', desc: 'Login dengan akun Google — via Laravel Socialite' },
        ],
    },
];

const FEATURES = [
    { icon: 'school',         title: 'Marketplace Kursus',   desc: 'Instruktur dapat membuat dan menjual kursus; siswa dapat menelusuri dan membeli.' },
    { icon: 'play_circle',    title: 'Course Player',         desc: 'Video streaming aman via Google Cloud Storage dengan tracking progres per lecture.' },
    { icon: 'workspace_premium', title: 'Sertifikat Digital', desc: 'Sertifikat berverifikasi otomatis diterbitkan saat 100% kursus selesai.' },
    { icon: 'payments',       title: 'Pembayaran Terintegrasi', desc: 'Checkout seamless dengan Midtrans Snap — berbagai metode pembayaran.' },
    { icon: 'sell',           title: 'Sistem Kupon',           desc: 'Instruktur dapat membuat kupon diskon spesifik per kursus.' },
    { icon: 'search',         title: 'Search Canggih',         desc: 'Pencarian kursus berbasis Meilisearch — fuzzy matching dan filter kategori.' },
    { icon: 'notifications',  title: 'Notifikasi Real-time',   desc: 'Notifikasi WebSocket via Laravel Reverb untuk event penting.' },
    { icon: 'admin_panel_settings', title: 'Panel Admin Lengkap', desc: 'Manajemen kursus, pengguna, pesanan, slider, dan pengaturan situs.' },
];

export default function AboutApp() {
    return (
        <AppLayout>
            <Head title="Tentang BelajarKUY — Platform" />

            {/* Hero */}
            <section className="bg-primary text-on-primary py-16 px-margin-mobile md:px-margin-desktop">
                <div className="max-w-3xl mx-auto text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 mb-5">
                        <span className="material-symbols-outlined text-[32px]">rocket_launch</span>
                    </div>
                    <h1 className="font-headline-lg text-headline-lg font-bold mb-4">Tentang BelajarKUY</h1>
                    <p className="font-body-lg text-body-lg opacity-80">
                        Dokumentasi platform e-learning — stack teknologi, arsitektur, dan fitur lengkap.
                    </p>
                </div>
            </section>

            {/* Deskripsi Platform */}
            <section className="max-w-3xl mx-auto px-margin-mobile md:px-margin-desktop py-xl">
                <div className="bg-surface border border-outline-variant rounded-3xl p-6 md:p-8">
                    <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-4">Apa itu BelajarKUY?</h2>
                    <p className="text-base text-on-surface-variant leading-relaxed mb-4">
                        BelajarKUY adalah platform marketplace e-learning berbasis web yang mempertemukan instruktur dan pelajar. Platform ini dibangun sebagai Tugas Besar mata kuliah Pemrograman Web oleh 5 mahasiswa, dengan standar pengembangan yang mendekati aplikasi produksi nyata.
                    </p>
                    <p className="text-base text-on-surface-variant leading-relaxed">
                        Dibangun dengan arsitektur modern: <strong>monolith Laravel + React via Inertia.js</strong> yang dijalankan dalam kontainer Docker di atas VPS Google Cloud Platform. Platform ini mendukung alur lengkap dari pendaftaran instruktur, pembuatan kursus, pembayaran, hingga penerbitan sertifikat.
                    </p>
                </div>
            </section>

            {/* Fitur Utama */}
            <section className="bg-surface-container-low py-xl px-margin-mobile md:px-margin-desktop">
                <div className="max-w-5xl mx-auto">
                    <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface text-center mb-xl">Fitur Utama</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-gutter">
                        {FEATURES.map(({ icon, title, desc }) => (
                            <div key={title} className="bg-surface rounded-2xl p-5 border border-outline-variant">
                                <div className="w-10 h-10 rounded-xl bg-primary-fixed/30 flex items-center justify-center mb-3">
                                    <span className="material-symbols-outlined text-primary text-[20px]">{icon}</span>
                                </div>
                                <h3 className="font-bold text-on-surface text-sm mb-1">{title}</h3>
                                <p className="text-xs text-on-surface-variant leading-relaxed">{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Tech Stack */}
            <section className="max-w-5xl mx-auto px-margin-mobile md:px-margin-desktop py-xl">
                <h2 className="font-headline-sm text-headline-sm font-bold text-on-surface text-center mb-xl">Stack Teknologi</h2>
                <div className="space-y-xl">
                    {TECH_STACK.map(({ category, icon, color, items }) => (
                        <div key={category}>
                            <div className="flex items-center gap-3 mb-md">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
                                    <span className="material-symbols-outlined text-[20px]">{icon}</span>
                                </div>
                                <h3 className="font-title-lg text-title-lg font-bold text-on-surface">{category}</h3>
                            </div>
                            <div className="grid md:grid-cols-2 gap-sm pl-2">
                                {items.map(({ name, desc }) => (
                                    <div key={name} className="flex gap-3 items-start p-4 bg-surface border border-outline-variant rounded-2xl">
                                        <span className="material-symbols-outlined text-on-surface-variant text-[16px] mt-0.5 shrink-0">check</span>
                                        <div>
                                            <p className="font-bold text-sm text-on-surface">{name}</p>
                                            <p className="text-xs text-on-surface-variant mt-0.5 leading-relaxed">{desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Arsitektur */}
            <section className="bg-tertiary py-xl px-margin-mobile md:px-margin-desktop">
                <div className="max-w-3xl mx-auto">
                    <h2 className="font-headline-sm text-headline-sm font-bold text-tertiary-fixed text-center mb-xl">Arsitektur Deployment</h2>
                    <div className="space-y-sm">
                        {[
                            { step: 'Browser', desc: 'Pengguna mengakses via HTTPS', icon: 'language' },
                            { step: 'Nginx (Web Container)', desc: 'Reverse proxy — static assets, SSL termination', icon: 'swap_horiz' },
                            { step: 'PHP-FPM (App Container)', desc: 'Laravel memproses request — auth, route, controller', icon: 'settings' },
                            { step: 'MySQL / SQLite', desc: 'Basis data — model & relasi Eloquent', icon: 'storage' },
                            { step: 'GCS / Cloudinary / Midtrans', desc: 'Layanan eksternal via HTTP API', icon: 'cloud' },
                        ].map(({ step, desc, icon }, i) => (
                            <div key={step} className="flex items-center gap-4">
                                <div className="w-9 h-9 rounded-xl bg-tertiary-container flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-tertiary-fixed-dim text-[18px]">{icon}</span>
                                </div>
                                <div className="flex-1 bg-tertiary-container rounded-xl px-4 py-3">
                                    <p className="font-bold text-sm text-tertiary-fixed">{step}</p>
                                    <p className="text-xs text-tertiary-fixed-dim">{desc}</p>
                                </div>
                                {i < 4 && <span className="material-symbols-outlined text-tertiary-fixed-dim text-[18px]">arrow_downward</span>}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="max-w-3xl mx-auto px-margin-mobile md:px-margin-desktop py-xl text-center">
                <p className="text-on-surface-variant mb-4">Tertarik dengan BelajarKUY?</p>
                <div className="flex flex-wrap gap-3 justify-center">
                    <Link href="/home" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-primary text-on-primary font-bold text-sm hover:opacity-90">
                        <span className="material-symbols-outlined text-[16px]">explore</span>
                        Jelajahi Kursus
                    </Link>
                    <Link href="/tentang-kami" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-outline-variant text-on-surface font-bold text-sm hover:bg-surface-container-low">
                        <span className="material-symbols-outlined text-[16px]">group</span>
                        Kenali Tim
                    </Link>
                </div>
            </section>
        </AppLayout>
    );
}

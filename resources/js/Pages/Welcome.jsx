import { Head, Link, usePage } from '@inertiajs/react';
import BrandLogo from '@/Components/BrandLogo';

// Aturan navigasi di halaman ini:
// - <Link> hanya untuk Inertia pages: /login, /register
// - <a href> untuk Blade routes: /home, /dashboard (supaya tidak "page dalam page")

// Konversi langsung dari landing_page_welcome/code.html (desain Vascha & Quinsha)
export default function Welcome() {
    const { auth } = usePage().props;
    const user = auth?.user;

    return (
        <>
            <Head title="BelajarKUY — Belajar Skill Baru" />

            <div
                className="text-on-background font-body-md antialiased min-h-screen flex flex-col"
                style={{ backgroundColor: '#FCF8F1' }}
            >
                {/* ===== TopNavBar ===== */}
                <header className="bg-surface shadow-sm sticky top-0 z-50">
                    <div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop py-md max-w-7xl mx-auto">
                        {/* Brand */}
                        <a href="/home">
                            <BrandLogo size="lg" />
                        </a>

                        {/* Navigation Links (Desktop) */}
                        <nav className="hidden md:flex gap-lg">
                            <a href="/home" className="text-on-surface-variant hover:text-primary-container transition-colors font-label-md text-label-md py-2">Kategori</a>
                            <a href="/home" className="text-on-surface-variant hover:text-primary-container transition-colors font-label-md text-label-md py-2">Kursus Saya</a>
                            <a href="/home" className="text-on-surface-variant hover:text-primary-container transition-colors font-label-md text-label-md py-2">Instruktur</a>
                            <a href="/home" className="text-on-surface-variant hover:text-primary-container transition-colors font-label-md text-label-md py-2">Jadilah Instruktur</a>
                        </nav>

                        {/* Actions */}
                        <div className="flex items-center gap-sm">
                            {user ? (
                                <a
                                    href="/dashboard"
                                    className="font-label-md text-label-md text-on-primary bg-primary hover:opacity-90 px-4 py-2 rounded-lg transition-colors shadow-sm"
                                >
                                    Dashboard
                                </a>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        className="hidden md:block font-label-md text-label-md text-primary bg-surface border-2 border-primary hover:bg-surface-variant px-4 py-2 rounded-lg transition-colors"
                                    >
                                        Masuk
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="font-label-md text-label-md text-on-primary bg-primary hover:opacity-90 px-4 py-2 rounded-lg transition-colors shadow-sm"
                                    >
                                        Daftar
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                {/* ===== Main ===== */}
                <main className="flex-grow">

                    {/* Hero Section */}
                    <section className="relative pt-xxl pb-margin-desktop px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto overflow-hidden">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-xxl items-center">

                            {/* Left column */}
                            <div className="flex flex-col gap-lg z-10">
                                {/* Badge */}
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-fixed rounded-full w-fit">
                                    <span
                                        className="material-symbols-outlined text-primary text-sm"
                                        style={{ fontVariationSettings: "'FILL' 1" }}
                                    >
                                        local_fire_department
                                    </span>
                                    <span className="font-label-md text-label-md text-primary">Platform Belajar #1</span>
                                </div>

                                {/* Headline */}
                                <h1 className="font-display-lg text-display-lg text-primary">
                                    Belajar skill baru,{' '}
                                    <span className="text-secondary-container">KUY!</span>
                                </h1>

                                <p className="font-body-lg text-body-lg text-on-surface-variant max-w-lg">
                                    Platform marketplace kursus terbaik untuk meningkatkan karirmu.
                                    Belajar dari para ahli, kapan saja, di mana saja.
                                </p>

                                {/* CTA Buttons */}
                                <div className="flex flex-wrap gap-4 mt-sm">
                                    <a
                                        href="/home"
                                        className="bg-secondary-container text-primary font-label-md text-label-md px-6 py-3 rounded-lg hover:opacity-90 transition-opacity shadow-md"
                                    >
                                        Mulai Belajar
                                    </a>
                                    <a
                                        href="/home"
                                        className="bg-surface text-primary border border-primary font-label-md text-label-md px-6 py-3 rounded-lg hover:bg-surface-variant transition-colors"
                                    >
                                        Lihat Katalog
                                    </a>
                                </div>

                                {/* Social proof */}
                                <div className="flex items-center gap-4 mt-lg pt-lg border-t border-outline-variant/30">
                                    <div className="flex -space-x-3">
                                        <img
                                            alt="User 1"
                                            className="w-10 h-10 rounded-full border-2 border-surface object-cover"
                                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC87D6i3aTkx6x1otO5QZ2E9rKK6dKUmPieqaS4dWAYODfGpcJyepNMWV4QL01hIysBQQcbNsXNVbwNYKDgVI42q7VB3W6ZVAI937DwM9h06oyRb0XfhDZM6cDLIONSNjjonEPaAOyoyhPgnVfhDANI0Lg4LBZ3cPs_BqcoEnjnC9eWnw74b8LaaoOyLZVc6nYzfVZWbrtpL5zbp--F_TM6kFx_e4s_bDgm6nJ-SVbJG4pGjGGyeWqzre9aBrvuWnMnTGyefy95gQ"
                                        />
                                        <img
                                            alt="User 2"
                                            className="w-10 h-10 rounded-full border-2 border-surface object-cover"
                                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDWKTxE9CykUjdbxYhtaa804Br01zPQBJJL69_Ge6c6of2UGsVsgShldDAQ2zq5TR3_dzs6YCHy53x-3Heb8NydC1O9_Iua0q7jJCJvv3bNd_ycHl9EVKsgvQp5tM08YqMjyEAZkodoJljDf0dmYDkdOPlDznnHfRPuHmlRO1yRAtzSmrSo_zNqH_mnZrqcbn12UqLkxQ_rk0iAr3kUeo7gb9FBotkbl8FpKCCsrRYHV2aeMmlo_ZZN8jaUUil0unUMuYV-pnJ60Q"
                                        />
                                        <img
                                            alt="User 3"
                                            className="w-10 h-10 rounded-full border-2 border-surface object-cover"
                                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBeEhY9-MMf4LELg2AxgjDzhd8omxl8wr7olESAwJH17bC4Tz41Vbxr288d0FTjbU_idVnmhdArwTL3mgiY6Y_UCz2HleY__7X8h_uLChKsh0JJ5iL6-GsB-KS4U7nc3ox6to6p18wcA6tgmLl6FHKUd7819cc_h2Yv7hjwCm5jf4FaQyeSWTVXPVKhnfpDjtb676Fe28FJf8AoQyCd8G3L9lyEagVzDKafFd7-8LKJW6wwMzqwybwltMJZWHLxr4Q7xGeeCepXPg"
                                        />
                                    </div>
                                    <div className="font-caption text-caption text-on-surface-variant">
                                        Bergabung dengan{' '}
                                        <strong className="text-primary">10,000+</strong>{' '}
                                        pelajar lainnya
                                    </div>
                                </div>
                            </div>

                            {/* Right column — hero image */}
                            <div className="relative z-10">
                                <div className="absolute inset-0 bg-primary/5 rounded-[40px] transform rotate-3 scale-105" />
                                <img
                                    alt="Students learning"
                                    className="rounded-[40px] shadow-xl w-full h-auto object-cover border-4 border-surface"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDONbMMN-MmDw731VaJJYysnpiuuadK4a1moZj3hxH2y-ffbatjyjTSpvXVjmkszEdVf-sWU8NXWtXfZkizoFp-V8TDxQNmsD5FLPbYwS-ZV14cfAgDR8G-TKJldLycTHx3Zg1BWWtQkfNRNrhFduqXk73lkjYbRAykEliQLgkf-W3B8GlBcepCAE6VIAeJWuxKCKUPJ3JtBcqF19DxEgZZiaIVs8E3uHlb9bJwMSZrII15XEfvlBYNU9Eh864kQPEUIWMGUTQGYA"
                                />
                                {/* Floating Badge */}
                                <div
                                    className="absolute -bottom-6 -left-6 p-4 rounded-xl flex items-center gap-3 animate-bounce"
                                    style={{
                                        animationDuration: '3s',
                                        background: 'rgba(255,255,255,0.9)',
                                        backdropFilter: 'blur(10px)',
                                        border: '1px solid rgba(48,0,51,0.1)',
                                        boxShadow: '0 4px 24px rgba(48,0,51,0.08)',
                                    }}
                                >
                                    <div className="w-12 h-12 bg-secondary-container rounded-full flex items-center justify-center">
                                        <span
                                            className="material-symbols-outlined text-primary"
                                            style={{ fontVariationSettings: "'FILL' 1" }}
                                        >
                                            trending_up
                                        </span>
                                    </div>
                                    <div>
                                        <div className="font-label-md text-label-md text-primary">Tingkatkan Karir</div>
                                        <div className="font-caption text-caption text-on-surface-variant">+85% Success Rate</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Benefits Section */}
                    <section className="py-margin-desktop px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto">
                        <div className="text-center mb-xl">
                            <h2 className="font-headline-lg text-headline-lg text-primary mb-sm">Mengapa Memilih Kami?</h2>
                            <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mx-auto">
                                Keunggulan platform kami untuk memastikan pengalaman belajarmu maksimal.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
                            {/* Card 1 */}
                            <div className="bg-surface rounded-2xl p-lg shadow-sm border border-outline-variant/20 hover:shadow-md transition-shadow">
                                <div className="w-14 h-14 bg-primary-fixed rounded-xl flex items-center justify-center mb-md">
                                    <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>security</span>
                                </div>
                                <h3 className="font-headline-md text-headline-md text-primary mb-xs">Reliable Transaction</h3>
                                <p className="font-body-md text-body-md text-on-surface-variant">Sistem pembayaran yang aman dan transparan untuk setiap pembelian kursus.</p>
                            </div>
                            {/* Card 2 */}
                            <div className="bg-surface rounded-2xl p-lg shadow-sm border border-outline-variant/20 hover:shadow-md transition-shadow">
                                <div className="w-14 h-14 bg-secondary-fixed rounded-xl flex items-center justify-center mb-md">
                                    <span className="material-symbols-outlined text-secondary-container text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>monitoring</span>
                                </div>
                                <h3 className="font-headline-md text-headline-md text-primary mb-xs">Progress Tracking</h3>
                                <p className="font-body-md text-body-md text-on-surface-variant">Pantau perkembangan belajarmu dengan visualisasi data yang mudah dipahami.</p>
                            </div>
                            {/* Card 3 */}
                            <div className="bg-surface rounded-2xl p-lg shadow-sm border border-outline-variant/20 hover:shadow-md transition-shadow">
                                <div className="w-14 h-14 bg-primary-fixed rounded-xl flex items-center justify-center mb-md">
                                    <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>lock_open</span>
                                </div>
                                <h3 className="font-headline-md text-headline-md text-primary mb-xs">Secure Access</h3>
                                <p className="font-body-md text-body-md text-on-surface-variant">Akses materi selamanya setelah pembelian dengan tingkat keamanan tinggi.</p>
                            </div>
                        </div>
                    </section>

                    {/* Categories Section */}
                    <section className="py-margin-desktop bg-surface-container-low px-margin-mobile md:px-margin-desktop">
                        <div className="max-w-7xl mx-auto">
                            <div className="flex justify-between items-end mb-xl">
                                <div>
                                    <h2 className="font-headline-lg text-headline-lg text-primary mb-sm">Kategori Populer</h2>
                                    <p className="font-body-md text-body-md text-on-surface-variant">Pilih dari berbagai kategori keahlian in-demand.</p>
                                </div>
                                <a
                                    href="/home"
                                    className="hidden md:flex items-center gap-1 font-label-md text-label-md text-primary hover:text-primary-container transition-colors"
                                >
                                    Lihat Semua{' '}
                                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                </a>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-gutter">
                                <a href="/home?category=web-development" className="bg-surface p-md rounded-2xl flex flex-col items-center justify-center gap-3 hover:bg-primary-fixed hover:-translate-y-1 transition-all border border-outline-variant/20 shadow-sm text-center">
                                    <span className="material-symbols-outlined text-primary text-4xl" style={{ fontVariationSettings: "'FILL' 0" }}>code</span>
                                    <span className="font-label-md text-label-md text-primary">Web Development</span>
                                </a>
                                <a href="/home?category=ui-ux-design" className="bg-surface p-md rounded-2xl flex flex-col items-center justify-center gap-3 hover:bg-secondary-fixed hover:-translate-y-1 transition-all border border-outline-variant/20 shadow-sm text-center">
                                    <span className="material-symbols-outlined text-secondary-container text-4xl" style={{ fontVariationSettings: "'FILL' 0" }}>brush</span>
                                    <span className="font-label-md text-label-md text-primary">UI/UX Design</span>
                                </a>
                                <a href="/home?category=data-science" className="bg-surface p-md rounded-2xl flex flex-col items-center justify-center gap-3 hover:bg-primary-fixed hover:-translate-y-1 transition-all border border-outline-variant/20 shadow-sm text-center">
                                    <span className="material-symbols-outlined text-primary text-4xl" style={{ fontVariationSettings: "'FILL' 0" }}>database</span>
                                    <span className="font-label-md text-label-md text-primary">Data Science</span>
                                </a>
                                <a href="/home?category=digital-marketing" className="bg-surface p-md rounded-2xl flex flex-col items-center justify-center gap-3 hover:bg-secondary-fixed hover:-translate-y-1 transition-all border border-outline-variant/20 shadow-sm text-center">
                                    <span className="material-symbols-outlined text-secondary-container text-4xl" style={{ fontVariationSettings: "'FILL' 0" }}>campaign</span>
                                    <span className="font-label-md text-label-md text-primary">Digital Marketing</span>
                                </a>
                            </div>
                            <a
                                href="/home"
                                className="mt-md md:hidden flex items-center justify-center gap-1 font-label-md text-label-md text-primary p-2 w-full border border-primary rounded-lg"
                            >
                                Lihat Semua{' '}
                                <span className="material-symbols-outlined text-sm">arrow_forward</span>
                            </a>
                        </div>
                    </section>
                </main>

                {/* ===== Footer ===== */}
                <footer className="bg-tertiary text-tertiary-fixed font-body-md text-body-md border-t border-outline-variant">
                    <div className="w-full py-xl px-margin-mobile md:px-margin-desktop grid grid-cols-1 md:grid-cols-4 gap-gutter max-w-7xl mx-auto">
                        <div className="flex flex-col gap-sm col-span-1">
                            <div className="flex items-center gap-2">
                                <img
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAT3KH1r1c7ZmumLRrzMRaea-4Nub7I_QpCPtNqeNeBIi2383fGN4Fas2Sr8Q5gyyTLWAYvu6nBaUKyA_JUp7iND1keVnFigeLE2lL9sK2pR-4nQPAOA-jKhXnt4aez_iN1DdO89SSgF3iERm47auSmMMH8mdBw9-TuXaeGpQL6WKefcdzQFOxfjSiYNBLbn_rT3ENy7qVrVFSx3LLE6eTrawoLg85uqnIflQScuqw9XX55A70eqkI2WB7WC3rkFuD4WvQYQ--FYw"
                                    alt="BelajarKUY Logo"
                                    className="h-8 w-auto brightness-0 invert"
                                />
                            </div>
                            <p className="text-tertiary-fixed-dim opacity-80 mt-2">
                                © {new Date().getFullYear()} BelajarKUY. Belajar skill baru, KUY!
                            </p>
                        </div>
                        <div className="flex flex-col gap-sm">
                            <h4 className="font-label-md text-label-md text-secondary-container font-bold mb-2">Company</h4>
                            <a href="#" className="text-tertiary-fixed-dim opacity-80 hover:text-secondary-fixed transition-colors">About Us</a>
                            <a href="#" className="text-tertiary-fixed-dim opacity-80 hover:text-secondary-fixed transition-colors">Contact</a>
                        </div>
                        <div className="flex flex-col gap-sm">
                            <h4 className="font-label-md text-label-md text-secondary-container font-bold mb-2">Explore</h4>
                            <a href="/home" className="text-tertiary-fixed-dim opacity-80 hover:text-secondary-fixed transition-colors">Kategori</a>
                            <a href="#" className="text-tertiary-fixed-dim opacity-80 hover:text-secondary-fixed transition-colors">Jadilah Instruktur</a>
                        </div>
                        <div className="flex flex-col gap-sm">
                            <h4 className="font-label-md text-label-md text-secondary-container font-bold mb-2">Legal</h4>
                            <a href="#" className="text-tertiary-fixed-dim opacity-80 hover:text-secondary-fixed transition-colors">Kebijakan Privasi</a>
                            <a href="#" className="text-tertiary-fixed-dim opacity-80 hover:text-secondary-fixed transition-colors">Syarat &amp; Ketentuan</a>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}

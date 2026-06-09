import { Head } from '@inertiajs/react';
import BrandLogo from '@/Components/BrandLogo';

// Desain: error_404_minimalist_no_illustration (Vascha & Quinsha)
export default function Error404() {
    return (
        <>
            <Head title="404 - Halaman Tidak Ditemukan | BelajarKUY" />
            <div className="bg-background text-on-background font-body-md min-h-screen flex flex-col overflow-hidden">

                <header className="w-full px-margin-desktop py-4 sticky top-0 z-50 flex justify-between items-center bg-transparent">
                    <a href="/"><BrandLogo size="md" /></a>
                </header>

                <main className="flex-grow flex items-center justify-center relative z-10 px-margin-mobile md:px-margin-desktop py-xxl">
                    <div className="text-center max-w-2xl w-full">
                        <h1 className="text-[120px] md:text-[180px] font-extrabold text-primary leading-none tracking-tight mb-md">404</h1>
                        <h2 className="font-headline-lg text-headline-lg text-on-surface mb-sm">Halaman tidak ditemukan</h2>
                        <p className="font-body-lg text-body-lg text-on-surface-variant mb-xl max-w-lg mx-auto">
                            Sepertinya halaman yang kamu cari sudah pindah atau tidak pernah ada. Jangan khawatir, perjalanan belajarmu tetap berlanjut!
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-md">
                            <a href="/" className="w-full sm:w-auto px-lg py-3 bg-primary text-on-primary font-label-md text-label-md rounded-lg shadow-sm hover:opacity-90 transition-all duration-200 active:scale-95 flex items-center justify-center gap-2">
                                <span className="material-symbols-outlined text-[20px]">home</span>
                                Kembali ke Beranda
                            </a>
                            <a href="/home" className="w-full sm:w-auto px-lg py-3 bg-surface text-primary border-2 border-primary font-label-md text-label-md rounded-lg hover:opacity-90 transition-all duration-200 active:scale-95 flex items-center justify-center gap-2">
                                <span className="material-symbols-outlined text-[20px]">search</span>
                                Cari Kursus
                            </a>
                        </div>
                    </div>
                </main>

                <footer className="w-full py-xl px-margin-desktop bg-tertiary text-on-tertiary flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-md">
                    <BrandLogo size="sm" dark />
                    <p className="font-caption text-caption text-on-tertiary-container">© {new Date().getFullYear()} BelajarKUY. Launch your career with us.</p>
                </footer>

            </div>
        </>
    );
}

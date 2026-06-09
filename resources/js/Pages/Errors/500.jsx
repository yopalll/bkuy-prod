import { Head } from '@inertiajs/react';

// Desain: error_500_minimalist_no_illustration (Vascha & Quinsha)
export default function Error500() {
    return (
        <>
            <Head title="Error 500 - Ada Masalah di Sisi Kami | BelajarKUY" />
            <div className="bg-background text-on-background min-h-screen flex flex-col font-body-md overflow-x-hidden relative">

                <main className="flex-grow flex items-center justify-center relative px-margin-mobile md:px-margin-desktop py-xxl z-10">
                    {/* Background decorative */}
                    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(#4a154b 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-error/5 rounded-full blur-[100px]" />
                    </div>

                    <div className="max-w-2xl w-full flex flex-col items-center text-center relative z-10">
                        <div className="mb-xl mx-auto">
                            <div className="text-[120px] md:text-[180px] font-bold text-error select-none tracking-tighter leading-none">500</div>
                        </div>
                        <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary mb-md">
                            Ada masalah di sisi kami
                        </h1>
                        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-lg mx-auto mb-xl">
                            Maaf, terjadi kesalahan tak terduga. Tim kami sudah diberi tahu. Coba muat ulang beberapa saat lagi agar perjalanan belajar Anda tidak terhambat.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
                            <button
                                onClick={() => window.location.reload()}
                                className="bg-primary hover:opacity-90 text-on-primary font-label-md text-label-md py-3 px-8 rounded-lg shadow-sm transition-all active:scale-95 flex items-center justify-center gap-2 group"
                            >
                                <span className="material-symbols-outlined group-hover:-rotate-180 transition-transform duration-500">refresh</span>
                                Muat Ulang Halaman
                            </button>
                            <a href="/" className="bg-surface hover:bg-surface-variant text-primary border-2 border-primary font-label-md text-label-md py-3 px-8 rounded-lg transition-all active:scale-95 flex items-center justify-center gap-2">
                                <span className="material-symbols-outlined">home</span>
                                Kembali ke Beranda
                            </a>
                        </div>
                    </div>
                </main>

            </div>
        </>
    );
}

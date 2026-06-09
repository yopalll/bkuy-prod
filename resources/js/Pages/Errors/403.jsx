import { Head } from '@inertiajs/react';

// Desain: error_403_minimalist_no_illustration (Vascha & Quinsha)
export default function Error403() {
    return (
        <>
            <Head title="403 Forbidden - BelajarKUY" />
            <div className="bg-background text-on-background min-h-screen flex flex-col items-center justify-center overflow-hidden">

                <main className="w-full max-w-2xl px-margin-mobile md:px-margin-desktop py-xxl flex flex-col items-center text-center">
                    <div className="mb-md">
                        <h1 className="text-[120px] md:text-[180px] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-warning to-error drop-shadow-sm flex items-center justify-center gap-4">
                            <span className="material-symbols-outlined text-[100px] md:text-[140px] text-error" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
                            403
                        </h1>
                    </div>
                    <div className="max-w-md mx-auto mb-xl">
                        <h2 className="font-headline-lg text-headline-lg text-primary mb-md">Akses Ditolak</h2>
                        <p className="font-body-lg text-body-lg text-on-surface-variant">
                            Kamu tidak punya izin untuk membuka halaman ini. Jika ini sebuah kekeliruan, silakan hubungi admin.
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-md w-full max-w-sm sm:max-w-none">
                        <a href="/dashboard" className="w-full sm:w-auto px-lg py-3 bg-primary text-on-primary font-label-md text-label-md rounded-lg shadow-md hover:opacity-90 transition-colors duration-200 flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined text-[20px]">dashboard</span>
                            Kembali ke Dashboard
                        </a>
                        <a href="/" className="w-full sm:w-auto px-lg py-3 bg-surface border-2 border-primary text-primary font-label-md text-label-md rounded-lg hover:bg-surface-container-low transition-colors duration-200 flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined text-[20px]">home</span>
                            Kembali ke Beranda
                        </a>
                    </div>
                    <div className="mt-xl">
                        <a href="mailto:support@belajarkuy.com" className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center gap-1">
                            <span className="material-symbols-outlined text-[16px]">help</span>
                            Butuh bantuan? Hubungi Dukungan
                        </a>
                    </div>
                </main>

            </div>
        </>
    );
}

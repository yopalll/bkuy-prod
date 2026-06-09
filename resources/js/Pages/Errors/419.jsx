import { Head } from '@inertiajs/react';

// Desain: error_419_minimalist_no_illustration (Vascha & Quinsha)
export default function Error419() {
    return (
        <>
            <Head title="BelajarKUY - Sesi Halaman Kedaluwarsa" />
            <div className="text-on-background min-h-screen flex flex-col overflow-hidden" style={{ backgroundColor: '#FCF8F1' }}>

                <main className="flex-grow flex items-center justify-center p-margin-mobile md:p-margin-desktop">
                    <div className="max-w-2xl w-full text-center">
                        <div
                            className="rounded-[24px] p-8 md:p-12 flex flex-col items-center gap-8"
                            style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(48,0,51,0.1)', boxShadow: '0 8px 32px rgba(48,0,51,0.12)' }}
                        >
                            <div className="flex items-center justify-center py-4">
                                <span className="text-[120px] md:text-[160px] font-extrabold text-warning leading-none tracking-tighter">419</span>
                            </div>
                            <div className="space-y-4 max-w-lg mx-auto mt-2">
                                <h1 className="font-display-lg text-display-lg text-primary tracking-tight">Sesi halaman kedaluwarsa</h1>
                                <p className="font-body-lg text-body-lg text-on-surface-variant">Demi keamanan, halaman ini kedaluwarsa karena terbuka terlalu lama. Muat ulang lalu coba lagi.</p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4 mt-6 w-full sm:w-auto">
                                <button
                                    onClick={() => window.location.reload()}
                                    className="bg-primary text-on-primary font-label-md text-label-md px-8 py-4 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 w-full sm:w-auto shadow-md"
                                >
                                    <span className="material-symbols-outlined text-[20px]">refresh</span>
                                    Muat Ulang &amp; Coba Lagi
                                </button>
                                <a href="/" className="bg-surface text-primary border border-primary font-label-md text-label-md px-8 py-4 rounded-lg hover:bg-surface-container-low transition-colors flex items-center justify-center gap-2 w-full sm:w-auto">
                                    <span className="material-symbols-outlined text-[20px]">home</span>
                                    Kembali ke Beranda
                                </a>
                            </div>
                        </div>
                    </div>
                </main>

            </div>
        </>
    );
}

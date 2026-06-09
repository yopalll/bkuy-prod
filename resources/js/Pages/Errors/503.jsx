import { Head } from '@inertiajs/react';

// Desain: error_503_minimalist_no_illustration (Vascha & Quinsha)
export default function Error503() {
    return (
        <>
            <Head title="503 - Dalam Pemeliharaan | BelajarKUY" />
            <div className="bg-background min-h-screen flex flex-col items-center justify-center overflow-hidden">

                <main className="w-full max-w-2xl px-margin-mobile md:px-margin-desktop py-xxl flex flex-col items-center text-center">
                    <div className="font-display-lg text-[120px] md:text-[160px] font-extrabold text-primary/10 leading-none mb-md tracking-tighter">503</div>
                    <h1 className="font-display-lg text-display-lg text-on-surface mb-md">Pusat Pemeliharaan</h1>
                    <p className="font-body-lg text-body-lg text-on-surface-variant max-w-lg mb-xl">
                        Kami sedang melakukan perbaikan singkat untuk pengalaman belajar yang lebih baik. Kami akan segera kembali!
                    </p>
                    <div className="w-full max-w-sm mb-lg">
                        <div className="flex justify-between items-end mb-sm">
                            <span className="font-caption text-caption text-on-surface-variant">Status Update</span>
                            <span className="font-label-md text-label-md text-primary">Perkiraan kembali: ~10 menit</span>
                        </div>
                        <div className="h-2 w-full bg-surface-container-high rounded-full overflow-hidden relative">
                            <div
                                className="absolute top-0 left-0 h-full w-full rounded-full"
                                style={{
                                    background: 'linear-gradient(90deg, #300033 0%, #E67E22 100%)',
                                    animation: 'loading 2s infinite linear',
                                }}
                            />
                        </div>
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        className="group bg-primary text-on-primary font-label-md text-label-md px-xl py-md rounded-lg shadow-[0_4px_12px_rgba(48,0,51,0.2)] hover:bg-primary-container hover:shadow-[0_6px_16px_rgba(48,0,51,0.3)] transition-all duration-300 flex items-center gap-sm active:scale-95"
                    >
                        <span className="material-symbols-outlined group-hover:rotate-180 transition-transform duration-500">refresh</span>
                        Muat Ulang
                    </button>
                </main>

                <style>{`
                    @keyframes loading {
                        0%  { transform: translateX(-100%); }
                        100%{ transform: translateX(100%); }
                    }
                `}</style>
            </div>
        </>
    );
}

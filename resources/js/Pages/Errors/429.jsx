import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';

// Desain: error_429_minimalist_no_illustration (Vascha & Quinsha)
export default function Error429() {
    const [seconds, setSeconds] = useState(60);

    useEffect(() => {
        const t = setInterval(() => {
            setSeconds((s) => {
                if (s <= 1) { clearInterval(t); return 0; }
                return s - 1;
            });
        }, 1000);
        return () => clearInterval(t);
    }, []);

    const pad = (n) => String(n).padStart(2, '0');
    const display = `${pad(Math.floor(seconds / 60))}:${pad(seconds % 60)}`;

    return (
        <>
            <Head title="429 - Terlalu Banyak Percobaan | BelajarKUY" />
            <div className="bg-background text-on-surface font-body-md min-h-screen flex flex-col overflow-x-hidden">

                <main className="flex-grow flex items-center justify-center p-margin-mobile md:p-margin-desktop">
                    <div className="w-full max-w-[800px] flex flex-col items-center text-center">
                        <div className="mb-8">
                            <h1 className="text-[120px] md:text-[200px] font-extrabold tracking-tighter text-warning leading-none w-full text-center">429</h1>
                        </div>
                        <div className="bg-surface/80 backdrop-blur-md rounded-3xl p-8 md:p-12 shadow-lg border border-surface-variant max-w-2xl">
                            <div className="inline-flex items-center gap-2 bg-secondary-container/20 text-on-secondary-container px-4 py-2 rounded-full mb-6">
                                <span className="material-symbols-outlined text-[20px]">speed</span>
                                <span className="font-label-md text-label-md">Terlalu Cepat!</span>
                            </div>
                            <h2 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-primary mb-4">
                                Terlalu banyak percobaan
                            </h2>
                            <p className="font-body-lg text-body-lg text-on-surface-variant mb-8 max-w-lg mx-auto">
                                Untuk keamanan, kamu perlu menunggu sebentar sebelum mencoba lagi.
                            </p>
                            <div className="bg-surface-container rounded-2xl p-6 mb-8 flex flex-col items-center justify-center border border-outline-variant/30">
                                <span className="font-label-md text-label-md text-on-surface-variant mb-2">Coba lagi dalam</span>
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-secondary"
                                          style={{ animation: seconds > 0 ? 'pulse 2s infinite' : 'none' }}>
                                        hourglass_empty
                                    </span>
                                    <span className="font-headline-md text-headline-md text-secondary font-mono tracking-widest">
                                        {display}
                                    </span>
                                </div>
                            </div>
                            <a href="/" className="inline-flex items-center gap-2 font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors">
                                <span className="material-symbols-outlined text-[20px]">home</span>
                                Kembali ke Beranda
                            </a>
                        </div>
                    </div>
                </main>

            </div>
        </>
    );
}

import { Head, Link } from '@inertiajs/react';
import BrandLogo from '@/Components/BrandLogo';

export default function Verify({ valid, certificate }) {
    return (
        <>
            <Head title="Verifikasi Sertifikat | BelajarKUY" />

            <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#FCF8F1', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {/* Navbar */}
                <header className="bg-surface border-b border-outline-variant py-md px-margin-desktop flex items-center justify-between shadow-sm">
                    <a href="/">
                        <BrandLogo size="md" />
                    </a>
                    <Link
                        href="/home"
                        className="font-label-md text-label-md px-4 py-2 rounded-lg bg-primary text-on-primary hover:opacity-90 transition-opacity"
                    >
                        Jelajahi Kursus
                    </Link>
                </header>

                {/* Main */}
                <main className="flex-1 flex items-center justify-center p-xl">
                    <div className="w-full max-w-lg">
                        {valid ? <ValidCard certificate={certificate} /> : <InvalidCard />}
                    </div>
                </main>

                {/* Footer */}
                <footer className="py-lg px-margin-desktop text-center border-t border-outline-variant">
                    <p className="font-caption text-caption text-on-surface-variant">
                        © {new Date().getFullYear()} BelajarKUY — Platform Belajar Online Terbaik Indonesia
                    </p>
                </footer>
            </div>
        </>
    );
}

function ValidCard({ certificate }) {
    return (
        <div className="bg-surface rounded-2xl shadow-lg border border-success/20 overflow-hidden">
            {/* Green top bar */}
            <div className="h-2 w-full" style={{ background: 'linear-gradient(90deg, #22c55e 0%, #16a34a 100%)' }} />

            <div className="p-xl text-center">
                {/* Valid badge */}
                <div
                    className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-lg"
                    style={{ background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)', border: '3px solid #22c55e' }}
                >
                    <span className="material-symbols-outlined text-[44px] text-success" style={{ fontVariationSettings: "'FILL' 1" }}>
                        verified
                    </span>
                </div>

                <h1 className="font-headline-md text-headline-md font-bold text-success mb-xs">
                    Sertifikat Valid
                </h1>
                <p className="font-body-md text-body-md text-on-surface-variant mb-xl">
                    Sertifikat ini asli dan diterbitkan oleh BelajarKUY.
                </p>

                {/* Certificate details */}
                <div className="bg-surface-container-low rounded-xl p-lg text-left space-y-md border border-outline-variant/40">
                    <DetailRow icon="person" label="Penerima" value={certificate.student_name} />
                    <DetailRow icon="school" label="Kursus" value={certificate.course_title} />
                    <DetailRow icon="badge" label="Instruktur" value={certificate.instructor_name} />
                    <DetailRow icon="calendar_today" label="Diterbitkan" value={certificate.issued_at} />
                    <DetailRow
                        icon="fingerprint"
                        label="ID Sertifikat"
                        value={<span className="font-mono text-sm tracking-wider">{certificate.code?.toUpperCase()}</span>}
                    />
                </div>

                <div className="mt-xl pt-lg border-t border-outline-variant/30">
                    <div className="flex items-center justify-center gap-sm text-on-surface-variant">
                        <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>security</span>
                        <span className="font-caption text-caption">Diverifikasi oleh sistem BelajarKUY</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

function InvalidCard() {
    return (
        <div className="bg-surface rounded-2xl shadow-lg border border-error/20 overflow-hidden">
            {/* Red top bar */}
            <div className="h-2 w-full" style={{ background: 'linear-gradient(90deg, #ef4444 0%, #dc2626 100%)' }} />

            <div className="p-xl text-center">
                <div
                    className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-lg"
                    style={{ background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)', border: '3px solid #ef4444' }}
                >
                    <span className="material-symbols-outlined text-[44px] text-error" style={{ fontVariationSettings: "'FILL' 1" }}>
                        gpp_bad
                    </span>
                </div>

                <h1 className="font-headline-md text-headline-md font-bold text-error mb-xs">
                    Sertifikat Tidak Valid
                </h1>
                <p className="font-body-md text-body-md text-on-surface-variant mb-xl">
                    Kode sertifikat tidak ditemukan atau sudah tidak berlaku. Pastikan kamu memasukkan kode yang benar.
                </p>

                <a
                    href="/"
                    className="inline-flex items-center gap-xs px-lg py-2 rounded-lg font-label-md text-label-md text-on-primary transition-all hover:opacity-90"
                    style={{ background: 'linear-gradient(135deg, #300033 0%, #5a1a5e 100%)' }}
                >
                    <span className="material-symbols-outlined text-[18px]">home</span>
                    Kembali ke Beranda
                </a>
            </div>
        </div>
    );
}

function DetailRow({ icon, label, value }) {
    return (
        <div className="flex items-start gap-md">
            <span className="material-symbols-outlined text-[18px] text-primary mt-px flex-shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>
                {icon}
            </span>
            <div className="min-w-0">
                <p className="font-caption text-caption text-on-surface-variant">{label}</p>
                <p className="font-label-md text-label-md text-on-surface font-semibold">{value}</p>
            </div>
        </div>
    );
}

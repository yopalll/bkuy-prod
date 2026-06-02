import { Link } from '@inertiajs/react';
import FlashToast from '@/Components/FlashToast';

/**
 * GuestLayout — layout untuk halaman auth (Login, Register, ForgotPassword, ResetPassword).
 * Desain dua panel: kiri ilustrasi/branding, kanan form.
 * Koeksistensi: hanya dipakai oleh Pages/Auth/*. Tidak mengganggu Blade lama.
 */
export default function GuestLayout({ children, title, subtitle }) {
    return (
        <div className="min-h-screen flex font-sans" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            <FlashToast />

            {/* Panel Kiri — Branding */}
            <div className="hidden lg:flex lg:w-5/12 xl:w-1/2 flex-col justify-between p-12 relative overflow-hidden"
                style={{
                    background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 50%, #A855F7 100%)',
                }}>
                {/* Pattern background */}
                <div className="absolute inset-0 opacity-10">
                    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>
                </div>

                {/* Logo */}
                <Link href="/" className="relative z-10 text-3xl font-extrabold tracking-tight text-white" aria-label="BelajarKUY">
                    Belajar<span className="text-yellow-300">KUY</span>
                </Link>

                {/* Ilustrasi tengah */}
                <div className="relative z-10 space-y-6">
                    <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-5xl shadow-xl">
                        🎓
                    </div>
                    <h2 className="text-3xl xl:text-4xl font-bold text-white leading-snug">
                        Belajar tanpa batas,<br />
                        <span className="text-yellow-300">kapan & di mana saja.</span>
                    </h2>
                    <p className="text-white/70 text-base leading-relaxed max-w-sm">
                        Bergabung dengan ribuan pelajar dan instruktur terbaik di platform kursus online terpercaya Indonesia.
                    </p>
                    {/* Stats */}
                    <div className="flex gap-8 pt-2">
                        {[
                            { label: 'Kursus', value: '500+' },
                            { label: 'Pelajar', value: '12K+' },
                            { label: 'Instruktur', value: '150+' },
                        ].map(({ label, value }) => (
                            <div key={label}>
                                <p className="text-2xl font-extrabold text-white">{value}</p>
                                <p className="text-white/60 text-sm">{label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom quote */}
                <p className="relative z-10 text-white/40 text-xs">
                    © {new Date().getFullYear()} BelajarKUY. Semua hak dilindungi.
                </p>

                {/* Decorative circles */}
                <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-white/5" />
                <div className="absolute -top-16 -left-16 w-56 h-56 rounded-full bg-white/5" />
            </div>

            {/* Panel Kanan — Form */}
            <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-16 xl:px-20 py-12 bg-white">
                {/* Mobile logo */}
                <div className="lg:hidden mb-8">
                    <Link href="/" className="text-2xl font-extrabold tracking-tight">
                        <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Belajar</span>
                        <span className="text-indigo-700 font-black">KUY</span>
                    </Link>
                </div>

                <div className="w-full max-w-md mx-auto">
                    {/* Header form */}
                    {(title || subtitle) && (
                        <div className="mb-8">
                            {title && (
                                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{title}</h1>
                            )}
                            {subtitle && (
                                <p className="mt-2 text-sm text-gray-500">{subtitle}</p>
                            )}
                        </div>
                    )}

                    {children}
                </div>
            </div>
        </div>
    );
}

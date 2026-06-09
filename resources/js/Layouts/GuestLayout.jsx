import { Link } from '@inertiajs/react';
import FlashToast from '@/Components/FlashToast';

// Layout auth — desain Vascha & Quinsha (login_registrasi_belajarkuy/code.html)
export default function GuestLayout({ children, panelTitle, panelSubtitle }) {
    return (
        <div
            className="min-h-screen flex items-center justify-center p-md md:p-margin-desktop antialiased"
            style={{ backgroundColor: '#fcf9f8', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
            <FlashToast />

            {/* Card container: split layout */}
            <div
                className="w-full max-w-6xl bg-surface rounded-[24px] flex flex-col md:flex-row overflow-hidden border"
                style={{
                    boxShadow: '0 12px 40px rgba(48, 0, 51, 0.08)',
                    borderColor: 'rgba(48,0,51,0.05)',
                    minHeight: '600px',
                }}
            >
                {/* ===== Panel Kiri: Branding (tersembunyi di mobile) ===== */}
                <div className="hidden md:flex md:w-5/12 lg:w-1/2 relative bg-primary-container p-xl flex-col justify-between overflow-hidden group">
                    {/* Background image + overlay */}
                    <div className="absolute inset-0 z-0">
                        <img
                            alt="Students collaborating"
                            className="w-full h-full object-cover opacity-30 mix-blend-luminosity group-hover:scale-105 transition-transform duration-1000 ease-in-out"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuA4gmdY1CBcOzbn0Ybh1dIDswEnFg9g8GceaFud-ORhYBBfgpwIjnGsvQPB7yy9chmIOXDQ66Dt2RAVrUH9xj8HXctfpxpUtqDDCFExbKBaGqgrtoLdkN-UNmNh7dUzfopENhxCU7truzQtjgYdaXAlVoDKcrA26GmPzBKkLiueAEP8zbuxt5ZWxc2xYMcPXVwEJAKF8ovHysL9D-8wbpJSv4DjV6_ivVm9iWUjN29X65_Gs4GBvVxw6oGYF4clo0Yrlh2KcIrPXA"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-primary-container via-primary-container/80 to-transparent z-10" />
                    </div>

                    {/* Konten overlay */}
                    <div className="relative z-20 flex flex-col h-full justify-between">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-sm">
                            <span
                                className="material-symbols-outlined text-secondary-container"
                                style={{ fontVariationSettings: "'FILL' 1", fontSize: '32px' }}
                            >
                                rocket_launch
                            </span>
                            <span className="font-headline-md text-headline-md text-surface tracking-tight">
                                Belajar<span className="text-secondary-container">KUY</span>
                            </span>
                        </Link>

                        {/* Welcome text */}
                        <div className="mt-auto mb-xl">
                            <h1 className="font-headline-lg text-headline-lg text-surface mb-sm leading-tight">
                                {panelTitle ?? 'Selamat Datang Kembali!'}
                            </h1>
                            <p className="font-body-lg text-body-lg text-primary-fixed-dim max-w-sm">
                                {panelSubtitle ?? 'Lanjutkan perjalanan belajarmu hari ini. Ada banyak skill baru yang siap menantimu untuk dikuasai.'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* ===== Panel Kanan: Form ===== */}
                <div className="w-full md:w-7/12 lg:w-1/2 p-xl lg:p-xxl flex flex-col justify-center bg-surface relative">
                    {/* Logo mobile */}
                    <div className="md:hidden flex items-center justify-center gap-sm mb-xl">
                        <span
                            className="material-symbols-outlined text-secondary-container"
                            style={{ fontVariationSettings: "'FILL' 1", fontSize: '28px' }}
                        >
                            rocket_launch
                        </span>
                        <span className="font-headline-md text-headline-md text-primary tracking-tight">
                            Belajar<span className="text-secondary-container">KUY</span>
                        </span>
                    </div>

                    <div className="w-full max-w-md mx-auto">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}

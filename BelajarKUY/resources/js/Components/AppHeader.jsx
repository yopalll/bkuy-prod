import { Link, usePage } from '@inertiajs/react';
import { ShoppingCart, Heart, Search, Menu } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

// Navbar publik (Konteks_A). Mengonsumsi shared prop auth.user.
export default function AppHeader() {
    const { auth } = usePage().props;
    const user = auth?.user;
    const [open, setOpen] = useState(false);
    const { t } = useTranslation();

    return (
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
                {/* Logo */}
                <Link href="/home" className="text-2xl font-extrabold tracking-tight shrink-0" aria-label={t('nav.logo')}>
                    <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{t('nav.logo_part1')}</span>
                    <span className="text-indigo-700 font-black">{t('nav.logo_part2')}</span>
                </Link>

                {/* Search (desktop) */}
                <div className="hidden md:flex flex-1 max-w-md">
                    <div className="relative w-full">
                        <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="search"
                            placeholder={t('nav.search_placeholder')}
                            className="w-full rounded-full border border-gray-200 bg-gray-50 pl-11 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                </div>

                {/* Right actions */}
                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                    <Link href="/student/wishlist" className="p-2 rounded-full text-gray-500 hover:text-red-500 hover:bg-gray-50" aria-label={t('nav.wishlist')}>
                        <Heart className="w-5 h-5" />
                    </Link>
                    <Link href="/cart" className="p-2 rounded-full text-gray-500 hover:text-indigo-600 hover:bg-gray-50" aria-label={t('nav.cart')}>
                        <ShoppingCart className="w-5 h-5" />
                    </Link>

                    {user ? (
                        <Link
                            href="/dashboard"
                            className="hidden sm:inline-flex items-center rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                        >
                            {user.name?.split(' ')[0] ?? t('nav.dashboard')}
                        </Link>
                    ) : (
                        <>
                            <Link href="/login" className="hidden sm:inline-flex px-3 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600">
                                {t('nav.login')}
                            </Link>
                            <Link href="/register" className="inline-flex rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">
                                {t('nav.register')}
                            </Link>
                        </>
                    )}

                    <button onClick={() => setOpen(!open)} className="md:hidden p-2 text-gray-600" aria-label="Menu">
                        <Menu className="w-6 h-6" />
                    </button>
                </div>
            </nav>
        </header>
    );
}

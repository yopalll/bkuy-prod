import { Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import BrandLogo from '@/Components/BrandLogo';

export default function AppHeader() {
    const { auth } = usePage().props;
    const user = auth?.user;
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const { t } = useTranslation();

    function handleSearch(e) {
        e.preventDefault();
        router.get('/home', search ? { search } : {}, { preserveState: true });
    }

    return (
        <header className="sticky top-0 z-50 bg-surface shadow-sm border-b border-outline-variant">
            <nav className="max-w-7xl mx-auto px-md md:px-margin-desktop py-md flex items-center justify-between gap-lg">
                {/* Logo + Search */}
                <div className="flex items-center gap-lg flex-1">
                    <Link href="/home" className="shrink-0" aria-label="BelajarKUY">
                        <BrandLogo size="md" />
                    </Link>

                    {/* Search bar (desktop) */}
                    <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md">
                        <div className="relative w-full flex items-center bg-surface-container-low border-2 border-transparent focus-within:border-primary rounded-full transition-colors">
                            <span className="material-symbols-outlined absolute left-3 text-outline select-none text-[20px]">search</span>
                            <input
                                type="search"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder={t('nav.search_placeholder')}
                                className="w-full bg-transparent border-none focus:ring-0 rounded-full py-2 pl-10 pr-4 font-body-md text-body-md text-on-surface placeholder:text-outline outline-none"
                            />
                        </div>
                    </form>
                </div>

                {/* Desktop nav */}
                <div className="hidden md:flex items-center gap-gutter">
                    <ul className="flex gap-lg">
                        <li>
                            <Link href="/home" className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors">
                                Katalog
                            </Link>
                        </li>
                        {user && (
                            <li>
                                <Link href="/student/my-courses" className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors">
                                    Pembelajaran Saya
                                </Link>
                            </li>
                        )}
                    </ul>

                    <div className="flex items-center gap-sm">
                        {user ? (
                            <>
                                <Link
                                    href="/student/wishlist"
                                    className="p-2 text-on-surface-variant hover:text-primary transition-colors rounded-full hover:bg-primary-fixed/20"
                                    aria-label={t('nav.wishlist')}
                                >
                                    <span className="material-symbols-outlined">favorite</span>
                                </Link>
                                <Link
                                    href="/cart"
                                    className="p-2 text-on-surface-variant hover:text-primary transition-colors rounded-full hover:bg-primary-fixed/20"
                                    aria-label={t('nav.cart')}
                                >
                                    <span className="material-symbols-outlined">shopping_cart</span>
                                </Link>
                                <Link
                                    href="/dashboard"
                                    className="font-label-md text-label-md px-4 py-2 rounded-lg bg-primary text-on-primary hover:opacity-90 transition-opacity"
                                >
                                    {user.name?.split(' ')[0] ?? t('nav.dashboard')}
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="font-label-md text-label-md px-4 py-2 rounded-lg bg-surface border-2 border-primary text-primary hover:bg-surface-container-low transition-colors"
                                >
                                    {t('nav.login')}
                                </Link>
                                <Link
                                    href="/register"
                                    className="font-label-md text-label-md px-4 py-2 rounded-lg bg-primary text-on-primary hover:opacity-90 transition-opacity"
                                >
                                    {t('nav.register')}
                                </Link>
                            </>
                        )}
                    </div>
                </div>

                {/* Mobile: cart icon + hamburger */}
                <div className="flex md:hidden items-center gap-xs">
                    {user && (
                        <Link href="/cart" className="p-2 text-on-surface-variant hover:text-primary" aria-label={t('nav.cart')}>
                            <span className="material-symbols-outlined">shopping_cart</span>
                        </Link>
                    )}
                    <button onClick={() => setOpen(!open)} className="p-2 text-primary" aria-label="Menu">
                        <span className="material-symbols-outlined">{open ? 'close' : 'menu'}</span>
                    </button>
                </div>
            </nav>

            {/* Mobile dropdown */}
            {open && (
                <div className="md:hidden bg-surface border-t border-outline-variant px-md pb-lg flex flex-col gap-md">
                    <form onSubmit={handleSearch} className="relative mt-md">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline select-none text-[20px]">search</span>
                        <input
                            type="search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder={t('nav.search_placeholder')}
                            className="w-full bg-surface-container-low border-2 border-transparent focus:border-primary rounded-full py-2 pl-10 pr-4 font-body-md text-body-md outline-none"
                        />
                    </form>

                    <Link href="/home" className="font-label-md text-label-md text-on-surface-variant py-sm border-b border-surface-variant" onClick={() => setOpen(false)}>
                        Katalog Kursus
                    </Link>
                    {user && (
                        <>
                            <Link href="/student/my-courses" className="font-label-md text-label-md text-on-surface-variant py-sm border-b border-surface-variant" onClick={() => setOpen(false)}>
                                Pembelajaran Saya
                            </Link>
                            <Link href="/student/wishlist" className="font-label-md text-label-md text-on-surface-variant py-sm border-b border-surface-variant" onClick={() => setOpen(false)}>
                                {t('nav.wishlist')}
                            </Link>
                        </>
                    )}

                    {user ? (
                        <Link
                            href="/dashboard"
                            className="text-center font-label-md text-label-md px-4 py-2 rounded-lg bg-primary text-on-primary mt-sm"
                            onClick={() => setOpen(false)}
                        >
                            Dashboard
                        </Link>
                    ) : (
                        <div className="flex gap-sm mt-sm">
                            <Link
                                href="/login"
                                className="flex-1 text-center font-label-md text-label-md px-4 py-2 rounded-lg border-2 border-primary text-primary"
                                onClick={() => setOpen(false)}
                            >
                                {t('nav.login')}
                            </Link>
                            <Link
                                href="/register"
                                className="flex-1 text-center font-label-md text-label-md px-4 py-2 rounded-lg bg-primary text-on-primary"
                                onClick={() => setOpen(false)}
                            >
                                {t('nav.register')}
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </header>
    );
}

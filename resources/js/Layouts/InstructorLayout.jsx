import { Link, usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import FlashToast from '@/Components/FlashToast';
import BrandLogo from '@/Components/BrandLogo';

const NAV_ITEMS = [
    { href: '/instructor/dashboard', icon: 'dashboard',        label: 'Dashboard',        route: 'instructor.dashboard' },
    { href: '/instructor/courses',   icon: 'school',           label: 'Kursus Saya',      route: 'instructor.courses.index' },
    { href: '/instructor/coupons',            icon: 'confirmation_number', label: 'Kupon',            route: 'instructor.coupons.index' },
    { href: '/instructor/content-guidelines', icon: 'menu_book',           label: 'Ketentuan Konten', route: 'instructor.content-guidelines' },
    { href: '/home',                          icon: 'explore',             label: 'Jelajahi Kursus',  route: null },
    { href: '/instructor/profile',   icon: 'person',           label: 'Profil',           route: 'instructor.profile' },
    { href: '/instructor/setting',   icon: 'settings',         label: 'Pengaturan',       route: 'instructor.setting' },
];

function UserAvatar({ user, className = '' }) {
    const src = user?.photo
        ? (user.photo.startsWith('http') ? user.photo : `/${user.photo}`)
        : null;
    const initials = (user?.name ?? 'IN')
        .split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();

    if (src) {
        return (
            <img src={src} alt={user?.name ?? 'Avatar'} className={`rounded-full object-cover ${className}`} />
        );
    }
    return (
        <div className={`rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-sm ${className}`}>
            {initials}
        </div>
    );
}

function SidebarContent({ user, url, onNavClick }) {
    function handleLogout() {
        router.post('/logout');
    }

    function isActive(item) {
        if (item.href === '/home') return url === '/home';
        return url.startsWith(item.href);
    }

    return (
        <>
            {/* Logo */}
            <div className="px-lg mb-xl flex-shrink-0">
                <BrandLogo size="md" />
            </div>

            {/* User Profile */}
            <div className="px-lg mb-lg flex items-center gap-md flex-shrink-0">
                <UserAvatar user={user} className="w-12 h-12 border-2 border-primary-container flex-shrink-0" />
                <div className="min-w-0">
                    <p className="font-label-md text-label-md text-on-surface font-bold truncate">
                        {user?.name ?? 'Instruktur'}
                    </p>
                    <span className="inline-block font-caption text-[10px] text-primary bg-primary/10 px-xs rounded-full capitalize">
                        Instruktur
                    </span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-sm overflow-y-auto">
                {NAV_ITEMS.map(item => {
                    const active = isActive(item);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={onNavClick}
                            className={`rounded-lg mx-2 my-1 px-4 py-3 flex items-center gap-3 transition-all duration-150 ${
                                active
                                    ? 'bg-primary/5 text-primary font-bold border-r-4 border-primary'
                                    : 'text-on-surface-variant hover:text-primary hover:bg-background-subtle'
                            }`}
                        >
                            <span
                                className="material-symbols-outlined text-[22px] shrink-0"
                                style={active ? { fontVariationSettings: "'FILL' 1" } : undefined}
                            >
                                {item.icon}
                            </span>
                            <span className="font-label-md text-label-md">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom: Logout */}
            <div className="p-lg mt-auto flex-shrink-0 border-t border-outline-variant/30">
                <button
                    onClick={handleLogout}
                    className="w-full text-on-surface-variant hover:text-error hover:bg-error-container rounded-lg px-4 py-3 flex items-center gap-3 transition-all font-label-md text-label-md"
                >
                    <span className="material-symbols-outlined text-[22px]">logout</span>
                    Keluar
                </button>
            </div>
        </>
    );
}

export default function InstructorLayout({ children }) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const { url } = usePage();
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <div className="bg-background text-on-background min-h-screen flex font-sans antialiased">
            <FlashToast />

            {/* Desktop Sidebar */}
            <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full w-64 bg-surface border-r border-surface-variant z-40 pt-xxl">
                <SidebarContent user={user} url={url} onNavClick={undefined} />
            </aside>

            {/* Mobile Top Header */}
            <header className="md:hidden bg-surface border-b border-surface-variant fixed top-0 left-0 w-full z-40 px-margin-mobile py-md flex justify-between items-center">
                <div className="flex items-center gap-sm">
                    <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                        rocket_launch
                    </span>
                    <span className="font-headline-md text-headline-md text-primary tracking-tight">
                        Belajar<span className="text-secondary-container">KUY!</span>
                    </span>
                </div>
                <button
                    onClick={() => setMobileOpen(true)}
                    className="text-on-surface p-sm rounded-lg hover:bg-surface-container transition-colors"
                    aria-label="Buka menu"
                >
                    <span className="material-symbols-outlined">menu</span>
                </button>
            </header>

            {/* Mobile Sidebar Overlay */}
            {mobileOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/50 z-50 flex"
                    onClick={() => setMobileOpen(false)}
                >
                    <aside
                        className="flex flex-col bg-surface w-64 h-full pt-xxl shadow-xl overflow-y-auto"
                        onClick={e => e.stopPropagation()}
                    >
                        <SidebarContent
                            user={user}
                            url={url}
                            onNavClick={() => setMobileOpen(false)}
                        />
                    </aside>
                </div>
            )}

            {/* Main Content */}
            <main className="flex-1 md:ml-64 min-h-screen flex flex-col">
                <div className="flex-1 pt-[60px] md:pt-0">
                    {children}
                </div>
            </main>

            {/* Mobile Bottom Nav */}
            <nav className="md:hidden fixed bottom-0 w-full bg-surface border-t border-outline-variant flex justify-around items-center py-2 z-40">
                {[
                    { href: '/instructor/dashboard', icon: 'dashboard',  label: 'Dashboard' },
                    { href: '/instructor/courses',   icon: 'school',     label: 'Kursus' },
                    { href: '/home',                 icon: 'explore',    label: 'Jelajahi' },
                    { href: '/instructor/profile',   icon: 'person',     label: 'Profil' },
                ].map(item => {
                    const active = item.href === '/home' ? url === '/home' : url.startsWith(item.href);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center p-2 transition-colors ${
                                active ? 'text-primary' : 'text-on-surface-variant opacity-70'
                            }`}
                        >
                            <span
                                className="material-symbols-outlined text-[22px]"
                                style={active ? { fontVariationSettings: "'FILL' 1" } : undefined}
                            >
                                {item.icon}
                            </span>
                            <span className="font-caption text-caption mt-[2px]">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}

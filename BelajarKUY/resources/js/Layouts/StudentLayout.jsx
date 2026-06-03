import { Link, usePage, router } from '@inertiajs/react';
import { useState } from 'react';

const NAV_ITEMS = [
    { href: '/student/dashboard',      icon: 'dashboard',     label: 'Dashboard' },
    { href: '/student/my-courses',     icon: 'school',        label: 'Kursus Saya' },
    { href: '/student/wishlist',       icon: 'favorite',      label: 'Wishlist' },
    { href: '/student/notifications',  icon: 'notifications', label: 'Notifikasi' },
    { href: '/student/profile',        icon: 'person',        label: 'Profil' },
    { href: '/student/setting',        icon: 'settings',      label: 'Pengaturan' },
];

function UserAvatar({ user, className = '' }) {
    const src = user?.photo
        ? (user.photo.startsWith('http') ? user.photo : `/${user.photo}`)
        : null;
    const initials = (user?.name ?? 'BK')
        .split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();

    if (src) {
        return (
            <img
                src={src}
                alt={user?.name ?? 'Avatar'}
                className={`rounded-full object-cover ${className}`}
            />
        );
    }
    return (
        <div className={`rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-sm ${className}`}>
            {initials}
        </div>
    );
}

function NavLink({ item, active, onClick }) {
    return (
        <Link
            href={item.href}
            onClick={onClick}
            className={`rounded-lg mx-2 my-1 px-4 py-3 flex items-center gap-3 transition-all duration-150 ${
                active
                    ? 'bg-primary-container text-on-primary-container scale-[0.98]'
                    : 'text-on-surface-variant hover:bg-surface-container-high'
            }`}
        >
            <span
                className="material-symbols-outlined text-[22px]"
                style={active ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
                {item.icon}
            </span>
            <span className="font-label-md text-label-md">{item.label}</span>
        </Link>
    );
}

function SidebarContent({ user, url, onNavClick }) {
    function handleLogout() {
        router.post('/logout');
    }

    return (
        <>
            {/* Logo */}
            <div className="px-lg mb-xl flex items-center gap-sm flex-shrink-0">
                <span className="material-symbols-outlined text-primary text-[32px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}>
                    rocket_launch
                </span>
                <h1 className="font-headline-md text-headline-md text-primary tracking-tight">
                    Belajar<span className="text-secondary-container">KUY!</span>
                </h1>
            </div>

            {/* User Profile */}
            <div className="px-lg mb-lg flex items-center gap-md flex-shrink-0">
                <UserAvatar user={user} className="w-12 h-12 border-2 border-primary-container flex-shrink-0" />
                <div className="min-w-0">
                    <p className="font-label-md text-label-md text-on-surface font-bold truncate">
                        {user?.name ?? 'Pengguna'}
                    </p>
                    <p className="font-caption text-caption text-on-surface-variant">Active Learner</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-sm overflow-y-auto">
                {NAV_ITEMS.map(item => (
                    <NavLink
                        key={item.href}
                        item={item}
                        active={url === item.href}
                        onClick={onNavClick}
                    />
                ))}
            </nav>

            {/* Bottom */}
            <div className="p-lg mt-auto flex-shrink-0 border-t border-outline-variant/30 space-y-xs">
                <button
                    onClick={handleLogout}
                    className="w-full text-on-surface-variant hover:bg-surface-container-high rounded-lg px-4 py-3 flex items-center gap-3 transition-all font-label-md text-label-md"
                >
                    <span className="material-symbols-outlined text-[22px]">logout</span>
                    Keluar
                </button>
            </div>
        </>
    );
}

export default function StudentLayout({ children }) {
    const { auth, flash } = usePage().props;
    const user = auth?.user;
    const { url } = usePage();
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <div className="bg-background text-on-background min-h-screen flex">

            {/* ── Desktop Sidebar ── */}
            <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full w-64 bg-surface shadow-md z-40 pt-xxl">
                <SidebarContent user={user} url={url} onNavClick={undefined} />
            </aside>

            {/* ── Mobile Top Header ── */}
            <header className="md:hidden bg-surface shadow-sm fixed top-0 left-0 w-full z-40 px-margin-mobile py-md flex justify-between items-center">
                <div className="flex items-center gap-sm">
                    <span className="material-symbols-outlined text-primary"
                        style={{ fontVariationSettings: "'FILL' 1" }}>
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

            {/* ── Mobile Sidebar Overlay ── */}
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

            {/* ── Main Content ── */}
            <main className="flex-1 md:ml-64 min-h-screen flex flex-col">
                {/* Flash Messages */}
                {flash?.success && (
                    <div className="mx-margin-mobile md:mx-margin-desktop mt-lg bg-success/10 border border-success/30 text-success rounded-xl px-lg py-md flex items-center gap-sm font-label-md text-label-md">
                        <span className="material-symbols-outlined text-[20px]"
                            style={{ fontVariationSettings: "'FILL' 1" }}>
                            check_circle
                        </span>
                        {flash.success}
                    </div>
                )}
                {flash?.error && (
                    <div className="mx-margin-mobile md:mx-margin-desktop mt-lg bg-error/10 border border-error/30 text-error rounded-xl px-lg py-md flex items-center gap-sm font-label-md text-label-md">
                        <span className="material-symbols-outlined text-[20px]"
                            style={{ fontVariationSettings: "'FILL' 1" }}>
                            error
                        </span>
                        {flash.error}
                    </div>
                )}

                {/* Page Content (has top padding for mobile header) */}
                <div className="flex-1 pt-[60px] md:pt-0">
                    {children}
                </div>
            </main>

            {/* ── Mobile Bottom Nav ── */}
            <nav className="md:hidden fixed bottom-0 w-full bg-surface border-t border-outline-variant flex justify-around items-center py-2 z-40">
                {[
                    { href: '/student/dashboard',  icon: 'dashboard', label: 'Dashboard' },
                    { href: '/student/my-courses', icon: 'school',    label: 'Kursus' },
                    { href: '/student/wishlist',   icon: 'favorite',  label: 'Wishlist' },
                    { href: '/student/profile',    icon: 'person',    label: 'Profil' },
                ].map(item => {
                    const active = url === item.href;
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

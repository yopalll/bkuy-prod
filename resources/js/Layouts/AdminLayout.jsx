import { Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import FlashToast from '@/Components/FlashToast';
import BrandLogo from '@/Components/BrandLogo';

const NAV_ITEMS = [
    { label: 'Dashboard',        href: '/admin/dashboard',     icon: 'dashboard',           route: 'admin.dashboard' },
    { label: 'Kursus',           href: '/admin/courses',        icon: 'school',              route: 'admin.courses.index' },
    { label: 'Moderasi Review',  href: '/admin/reviews',          icon: 'rate_review',         route: 'admin.reviews.index' },
    { label: 'Laporan Kursus',   href: '/admin/course-reports',   icon: 'flag',                route: 'admin.course-reports.index' },
    { label: 'Tiket Bantuan',    href: '/admin/support-tickets',  icon: 'support_agent',       route: 'admin.support-tickets.index' },
    { label: 'Kategori',         href: '/admin/categories',       icon: 'category',            route: 'admin.categories.index' },
    { label: 'Sub-Kategori',     href: '/admin/sub-categories', icon: 'account_tree',        route: 'admin.sub-categories.index' },
    { label: 'Instruktur',       href: '/admin/instructors',    icon: 'manage_accounts',     route: 'admin.instructors.index' },
    { label: 'Order',            href: '/admin/orders',         icon: 'shopping_cart',       route: 'admin.orders.index' },
    { label: 'Pengguna',         href: '/admin/users',          icon: 'group',               route: 'admin.users.index' },
    { label: 'Kupon',            href: '/admin/coupons',        icon: 'confirmation_number', route: 'admin.coupons.index' },
    { label: 'Slider',           href: '/admin/sliders',        icon: 'image',               route: 'admin.sliders.index' },
    { label: 'Info Box',         href: '/admin/info-boxes',     icon: 'info',                route: 'admin.info-boxes.index' },
    { label: 'Partner',          href: '/admin/partners',       icon: 'handshake',           route: 'admin.partners.index' },
    { label: 'Pengaturan Situs', href: '/admin/settings',       icon: 'settings',            route: 'admin.settings.index' },
];

function AdminSidebar({ open, onClose }) {
    const { url } = usePage();
    const { auth } = usePage().props;

    function isActive(href) {
        return url.startsWith(href);
    }

    function handleLogout(e) {
        e.preventDefault();
        router.post('/logout');
    }

    return (
        <>
            {open && (
                <div
                    className="fixed inset-0 bg-black/40 z-30 lg:hidden"
                    onClick={onClose}
                />
            )}
            <aside
                className={`fixed left-0 top-0 h-full w-64 bg-surface border-r border-surface-variant flex flex-col py-md px-sm z-40 transition-transform duration-200 ease-in-out
                    ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
            >
                {/* Brand */}
                <div className="mb-xl px-md flex items-center gap-sm">
                    <div>
                        <BrandLogo size="md" />
                        <p className="font-caption text-caption text-on-surface-variant mt-0.5">Admin Console</p>
                    </div>
                    <button
                        className="ml-auto lg:hidden text-on-surface-variant p-1 hover:bg-surface-variant rounded"
                        onClick={onClose}
                    >
                        <span className="material-symbols-outlined text-[20px]">close</span>
                    </button>
                </div>

                {/* Nav items */}
                <nav className="flex-1 space-y-xs overflow-y-auto pr-sm">
                    {NAV_ITEMS.map((item) => {
                        const active = isActive(item.href);
                        return (
                            <Link
                                key={item.route}
                                href={item.href}
                                className={`flex items-center gap-md px-md py-sm rounded-lg font-label-md text-label-md transition-colors
                                    ${active
                                        ? 'bg-primary/5 text-primary font-bold border-r-4 border-primary'
                                        : 'text-on-surface-variant hover:text-primary hover:bg-background-subtle'
                                    }`}
                            >
                                <span
                                    className="material-symbols-outlined text-[20px] shrink-0"
                                    style={active ? { fontVariationSettings: "'FILL' 1" } : {}}
                                >
                                    {item.icon}
                                </span>
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer: help + logout + user */}
                <div className="mt-auto pt-md border-t border-surface-variant space-y-xs">
                    <a
                        href="#"
                        className="flex items-center gap-md px-md py-sm rounded-lg text-on-surface-variant hover:text-primary hover:bg-background-subtle transition-colors font-label-md text-label-md"
                    >
                        <span className="material-symbols-outlined text-[20px]">help</span>
                        <span>Bantuan</span>
                    </a>
                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-md px-md py-sm rounded-lg text-error hover:bg-error-container transition-colors font-label-md text-label-md"
                    >
                        <span className="material-symbols-outlined text-[20px]">logout</span>
                        <span>Logout</span>
                    </button>
                    {auth?.user && (
                        <div className="px-md pt-sm flex items-center gap-md">
                            <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-xs shrink-0">
                                {auth.user.name?.charAt(0)?.toUpperCase() ?? 'A'}
                            </div>
                            <div className="min-w-0">
                                <p className="font-label-md text-label-md font-bold text-on-surface truncate">{auth.user.name}</p>
                                <p className="font-caption text-caption text-on-surface-variant truncate">{auth.user.email}</p>
                            </div>
                        </div>
                    )}
                </div>
            </aside>
        </>
    );
}

export default function AdminLayout({ children, title = 'Admin Portal' }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { auth } = usePage().props;

    return (
        <div className="min-h-screen bg-background text-on-background font-sans antialiased flex">
            <FlashToast />
            <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="flex-1 flex flex-col lg:ml-64 min-h-screen">
                {/* TopBar */}
                <header className="bg-surface border-b border-surface-variant flex justify-between items-center h-16 px-lg sticky top-0 z-20">
                    <div className="flex items-center gap-md">
                        <button
                            className="lg:hidden p-sm text-on-surface-variant hover:bg-surface-variant rounded-full"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <span className="material-symbols-outlined text-[20px]">menu</span>
                        </button>
                        <h2 className="font-headline-md text-headline-md font-black text-primary hidden md:block tracking-tight">
                            {title}
                        </h2>
                    </div>
                    {auth?.user && (
                        <div className="flex items-center gap-sm">
                            <div className="hidden sm:block text-right">
                                <p className="font-label-md text-label-md font-bold text-on-surface leading-tight">{auth.user.name}</p>
                                <p className="font-caption text-[10px] text-primary bg-primary/10 px-xs rounded-full text-center capitalize">{auth.user.role}</p>
                            </div>
                            <div className="w-9 h-9 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-sm shrink-0 ring-2 ring-primary/20">
                                {auth.user.name?.charAt(0)?.toUpperCase() ?? 'A'}
                            </div>
                        </div>
                    )}
                </header>

                {/* Page content */}
                <main className="flex-1 overflow-y-auto p-margin-mobile md:p-gutter bg-background">
                    <div className="max-w-[1400px] mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}

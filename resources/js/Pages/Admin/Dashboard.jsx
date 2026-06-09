import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

function formatRupiah(amount) {
    if (!amount) return 'Rp 0';
    if (amount >= 1_000_000_000) return `Rp ${(amount / 1_000_000_000).toFixed(1)}M`;
    if (amount >= 1_000_000) return `Rp ${(amount / 1_000_000).toFixed(1)}jt`;
    return `Rp ${Number(amount).toLocaleString('id-ID')}`;
}

const STATUS_BADGE = {
    completed: 'bg-success/10 text-success',
    pending:   'bg-warning/10 text-warning',
    cancelled: 'bg-error/10 text-error',
    refunded:  'bg-surface-variant text-on-surface-variant',
};

function StatusBadge({ status }) {
    return (
        <span className={`inline-flex items-center px-2 py-1 rounded-full font-caption text-caption capitalize ${STATUS_BADGE[status] ?? 'bg-surface-variant text-on-surface-variant'}`}>
            {status}
        </span>
    );
}

export default function Dashboard({ stats = {}, recentOrders = [] }) {
    const initials = (name) => name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) ?? '??';

    const METRICS = [
        {
            label: 'Total Siswa',
            value: stats.total_students?.toLocaleString('id-ID') ?? '—',
            icon: 'group',
            bg: 'bg-primary-container',
            iconColor: 'text-on-primary-container',
            accent: 'bg-primary/5',
            trend: '+12% bulan ini',
            up: true,
        },
        {
            label: 'Total Instruktur',
            value: stats.total_instructors?.toLocaleString('id-ID') ?? '—',
            icon: 'manage_accounts',
            bg: 'bg-secondary-container',
            iconColor: 'text-on-secondary-container',
            accent: 'bg-secondary/5',
            trend: '+5% bulan ini',
            up: true,
        },
        {
            label: 'Kursus Aktif',
            value: stats.active_courses?.toLocaleString('id-ID') ?? stats.total_courses?.toLocaleString('id-ID') ?? '—',
            icon: 'menu_book',
            bg: 'bg-[#FFF3E0]',
            iconColor: 'text-warning',
            accent: 'bg-warning/5',
            trend: 'Pertumbuhan stabil',
            up: null,
        },
        {
            label: 'Total Revenue',
            value: formatRupiah(stats.total_revenue ?? 0),
            icon: 'shopping_cart',
            primary: true,
            trend: '+24% vs bulan lalu',
            up: true,
        },
    ];

    return (
        <AdminLayout title="Admin Portal">
            <Head title="Dashboard — BelajarKUY Admin" />

            <div className="flex justify-between items-end mb-gutter">
                <div>
                    <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">
                        Dashboard Overview
                    </h1>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-xs">
                        Selamat datang! Inilah ringkasan platform hari ini.
                    </p>
                </div>
            </div>

            {/* Metrics bento grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter mb-gutter">
                {METRICS.map((m) => {
                    if (m.primary) {
                        return (
                            <div key={m.label} className="bg-primary rounded-2xl p-lg shadow-[0_8px_30px_rgb(48,0,51,0.15)] relative overflow-hidden group text-on-primary">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary to-surface-tint opacity-80" />
                                <div className="absolute -right-4 -bottom-4 opacity-10">
                                    <span className="material-symbols-outlined text-[112px] text-white">{m.icon}</span>
                                </div>
                                <div className="flex justify-between items-start relative z-10">
                                    <div>
                                        <p className="font-label-md text-label-md text-primary-fixed-dim uppercase tracking-wider">{m.label}</p>
                                        <h3 className="font-headline-lg text-headline-lg mt-sm">{m.value}</h3>
                                    </div>
                                    <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                        <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>{m.icon}</span>
                                    </div>
                                </div>
                                <div className="mt-md flex items-center gap-xs text-primary-fixed font-label-md text-label-md relative z-10">
                                    <span className="material-symbols-outlined text-[18px]">trending_up</span>
                                    <span>{m.trend}</span>
                                </div>
                            </div>
                        );
                    }
                    return (
                        <div key={m.label} className="bg-surface rounded-2xl p-lg shadow-[0_8px_30px_rgb(48,0,51,0.04)] relative overflow-hidden group">
                            <div className={`absolute top-0 right-0 w-32 h-32 ${m.accent} rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110`} />
                            <div className="flex justify-between items-start relative z-10">
                                <div>
                                    <p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">{m.label}</p>
                                    <h3 className="font-headline-lg text-headline-lg text-on-surface mt-sm">{m.value}</h3>
                                </div>
                                <div className={`w-12 h-12 rounded-xl ${m.bg} ${m.iconColor} flex items-center justify-center`}>
                                    <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>{m.icon}</span>
                                </div>
                            </div>
                            <div className={`mt-md flex items-center gap-xs font-label-md text-label-md relative z-10 ${m.up === null ? 'text-on-surface-variant' : 'text-success'}`}>
                                <span className="material-symbols-outlined text-[18px]">{m.up === null ? 'remove' : 'trending_up'}</span>
                                <span>{m.trend}</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Main grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
                {/* Recent Transactions */}
                <div className="lg:col-span-2 bg-surface rounded-2xl p-lg shadow-[0_8px_30px_rgb(48,0,51,0.04)] flex flex-col">
                    <div className="flex justify-between items-center mb-lg">
                        <h2 className="font-headline-md text-headline-md text-on-surface">Transaksi Terbaru</h2>
                        <Link href="/admin/orders" className="text-primary font-label-md text-label-md hover:underline">
                            Lihat Semua
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-surface-variant">
                                    <th className="py-md px-sm font-label-md text-label-md text-on-surface-variant">Order ID</th>
                                    <th className="py-md px-sm font-label-md text-label-md text-on-surface-variant">Siswa</th>
                                    <th className="py-md px-sm font-label-md text-label-md text-on-surface-variant hidden md:table-cell">Kursus</th>
                                    <th className="py-md px-sm font-label-md text-label-md text-on-surface-variant text-right">Total</th>
                                    <th className="py-md px-sm font-label-md text-label-md text-on-surface-variant text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="py-xl text-center text-on-surface-variant font-body-md text-body-md">
                                            Belum ada transaksi
                                        </td>
                                    </tr>
                                )}
                                {recentOrders.map((order) => (
                                    <tr key={order.id} className="border-b border-surface-variant/50 hover:bg-background-subtle transition-colors">
                                        <td className="py-md px-sm font-mono text-xs text-on-surface-variant">#{order.id}</td>
                                        <td className="py-md px-sm">
                                            <div className="flex items-center gap-sm">
                                                <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-xs shrink-0">
                                                    {initials(order.user?.name)}
                                                </div>
                                                <span className="font-body-md text-body-md text-on-surface truncate max-w-[120px]">{order.user?.name ?? '—'}</span>
                                            </div>
                                        </td>
                                        <td className="py-md px-sm text-on-surface-variant hidden md:table-cell max-w-[180px]">
                                            <span className="truncate block">{order.course?.title ?? '—'}</span>
                                        </td>
                                        <td className="py-md px-sm text-right font-medium font-body-md text-body-md">
                                            {formatRupiah(order.final_price)}
                                        </td>
                                        <td className="py-md px-sm text-center">
                                            <StatusBadge status={order.status} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Action Required + System Status */}
                <div className="flex flex-col gap-gutter">
                    <div className="bg-surface rounded-2xl p-lg shadow-[0_8px_30px_rgb(48,0,51,0.04)] flex-1">
                        <h2 className="font-headline-md text-headline-md text-on-surface mb-lg">Perlu Ditindaklanjuti</h2>
                        <div className="space-y-md">
                            <div className="p-md rounded-xl border border-warning/30 bg-warning/5 flex items-start gap-md">
                                <div className="w-10 h-10 rounded-full bg-warning/20 text-warning flex items-center justify-center shrink-0 mt-1">
                                    <span className="material-symbols-outlined text-[20px]">menu_book</span>
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-label-md text-label-md text-on-surface font-bold">
                                        {stats.pending_courses ?? 0} Kursus Pending
                                    </h4>
                                    <p className="font-caption text-caption text-on-surface-variant mt-xs">
                                        Kursus baru menunggu review kualitas sebelum dipublikasikan.
                                    </p>
                                    <Link href="/admin/courses" className="mt-sm font-label-md text-label-md text-warning hover:underline inline-block">
                                        Review Kursus →
                                    </Link>
                                </div>
                            </div>
                            <div className="p-md rounded-xl border border-secondary/30 bg-secondary/5 flex items-start gap-md">
                                <div className="w-10 h-10 rounded-full bg-secondary/20 text-secondary flex items-center justify-center shrink-0 mt-1">
                                    <span className="material-symbols-outlined text-[20px]">rate_review</span>
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-label-md text-label-md text-on-surface font-bold">
                                        {stats.pending_reviews ?? 0} Review Flagged
                                    </h4>
                                    <p className="font-caption text-caption text-on-surface-variant mt-xs">
                                        Review siswa yang perlu moderasi admin.
                                    </p>
                                    <Link href="/admin/reviews" className="mt-sm font-label-md text-label-md text-secondary hover:underline inline-block">
                                        Moderasi Review →
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-surface rounded-2xl p-lg shadow-[0_8px_30px_rgb(48,0,51,0.04)]">
                        <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-md">
                            Status Sistem
                        </h3>
                        <div className="flex items-center gap-md">
                            <div className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-success" />
                            </div>
                            <span className="font-body-md text-body-md text-on-surface font-medium">Semua sistem berjalan normal</span>
                        </div>
                        <div className="mt-md text-right">
                            <span className="font-caption text-caption text-on-surface-variant">Terakhir diperbarui: Baru saja</span>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

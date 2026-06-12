import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';

const STATUS_LABELS = {
    open:        { label: 'Baru',     cls: 'bg-warning/10 text-warning border-warning/20' },
    in_progress: { label: 'Diproses', cls: 'bg-primary/10 text-primary border-primary/20' },
    resolved:    { label: 'Selesai',  cls: 'bg-success/10 text-success border-success/20' },
    closed:      { label: 'Ditutup',  cls: 'bg-surface-container text-on-surface-variant border-outline-variant' },
};

const CATEGORY_LABELS = {
    general: 'Umum', billing: 'Pembayaran', technical: 'Teknis', course: 'Kursus',
};

const FILTERS = [
    { key: '',            label: 'Semua' },
    { key: 'open',        label: 'Baru' },
    { key: 'in_progress', label: 'Diproses' },
    { key: 'resolved',    label: 'Selesai' },
    { key: 'closed',      label: 'Ditutup' },
];

export default function AdminSupportTickets({ tickets, filterStatus, counts }) {
    const { flash } = usePage().props;

    function applyFilter(key) {
        router.get(route('admin.support-tickets.index'), key ? { status: key } : {}, { preserveState: true, preserveScroll: true });
    }

    return (
        <AdminLayout>
            <Head title="Tiket Bantuan — Admin" />
            <div className="max-w-6xl mx-auto px-margin-mobile md:px-margin-desktop py-xl">
                <div className="flex items-center justify-between mb-lg">
                    <div>
                        <h1 className="font-headline-sm text-headline-sm font-bold text-on-surface">Tiket Bantuan</h1>
                        <p className="text-sm text-on-surface-variant mt-1">
                            {tickets.total} tiket total
                            {counts?.unread > 0 && <span className="text-primary font-semibold"> · {counts.unread} belum dibaca</span>}
                        </p>
                    </div>
                </div>

                {flash?.success && (
                    <div className="mb-lg p-4 bg-success/10 border border-success/20 rounded-2xl flex gap-2 items-center">
                        <span className="material-symbols-outlined text-success text-[18px]">check_circle</span>
                        <p className="text-sm text-success">{flash.success}</p>
                    </div>
                )}

                {/* Filter tabs */}
                <div className="flex flex-wrap gap-2 mb-lg">
                    {FILTERS.map((f) => {
                        const active = (filterStatus ?? '') === f.key;
                        return (
                            <button
                                key={f.key}
                                onClick={() => applyFilter(f.key)}
                                className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${
                                    active ? 'bg-primary text-on-primary border-primary' : 'bg-surface text-on-surface-variant border-outline-variant hover:border-primary/40'
                                }`}
                            >
                                {f.label}
                            </button>
                        );
                    })}
                </div>

                <div className="bg-surface border border-outline-variant rounded-3xl overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-surface-container-low">
                            <tr>
                                {['#', 'Pengguna', 'Subjek', 'Kategori', 'Status', 'Update', ''].map((h, i) => (
                                    <th key={i} className="text-left px-4 py-3.5 text-xs font-bold text-on-surface-variant uppercase tracking-wider">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant">
                            {tickets.data.length === 0 && (
                                <tr><td colSpan={7} className="text-center py-12 text-on-surface-variant">Belum ada tiket bantuan.</td></tr>
                            )}
                            {tickets.data.map((t) => {
                                const s = STATUS_LABELS[t.status] ?? STATUS_LABELS.open;
                                return (
                                    <tr
                                        key={t.id}
                                        onClick={() => router.visit(route('admin.support-tickets.show', t.id))}
                                        className={`cursor-pointer hover:bg-surface-container-lowest transition-colors ${t.admin_unread ? 'bg-primary/[0.03]' : ''}`}
                                    >
                                        <td className="px-4 py-3.5 text-on-surface-variant whitespace-nowrap">
                                            <span className="inline-flex items-center gap-1.5">
                                                {t.admin_unread && <span className="w-2 h-2 rounded-full bg-primary" title="Belum dibaca" />}
                                                #{t.id}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <p className="font-semibold text-on-surface">{t.user?.name}</p>
                                            <p className="text-xs text-on-surface-variant">{t.user?.email}</p>
                                        </td>
                                        <td className="px-4 py-3.5 text-on-surface max-w-[200px] truncate">
                                            {t.subject}
                                            {t.last_reply_role === 'user' && (
                                                <span className="ml-2 text-[10px] font-bold uppercase text-warning">perlu balasan</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3.5 text-on-surface-variant">{CATEGORY_LABELS[t.category] ?? t.category}</td>
                                        <td className="px-4 py-3.5">
                                            <span className={`inline-flex text-xs font-bold px-2.5 py-1 rounded-full border ${s.cls}`}>{s.label}</span>
                                        </td>
                                        <td className="px-4 py-3.5 text-on-surface-variant whitespace-nowrap">
                                            {new Date(t.last_reply_at ?? t.created_at).toLocaleDateString('id-ID')}
                                        </td>
                                        <td className="px-4 py-3.5 text-right">
                                            <Link
                                                href={route('admin.support-tickets.show', t.id)}
                                                onClick={(e) => e.stopPropagation()}
                                                className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-bold hover:bg-primary/20 transition-colors"
                                            >
                                                Buka
                                            </Link>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {tickets.last_page > 1 && (
                    <div className="flex justify-center gap-1 mt-lg">
                        {tickets.links.map((link, i) => (
                            <button
                                key={i}
                                disabled={!link.url}
                                onClick={() => link.url && router.visit(link.url, { preserveScroll: true })}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                    link.active ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:bg-surface-container-low disabled:opacity-40'
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}

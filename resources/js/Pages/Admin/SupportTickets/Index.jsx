import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

const STATUS_LABELS = {
    open:        { label: 'Baru',      cls: 'bg-warning/10 text-warning border-warning/20' },
    in_progress: { label: 'Diproses', cls: 'bg-primary/10 text-primary border-primary/20' },
    resolved:    { label: 'Selesai',  cls: 'bg-success/10 text-success border-success/20' },
    closed:      { label: 'Ditutup', cls: 'bg-surface-container text-on-surface-variant border-outline-variant' },
};

const CATEGORY_LABELS = {
    general: 'Umum', billing: 'Pembayaran', technical: 'Teknis', course: 'Kursus',
};

function TicketModal({ ticket, onClose }) {
    const [status, setStatus] = useState(ticket.status);
    const [response, setResponse] = useState(ticket.admin_response ?? '');
    const [saving, setSaving] = useState(false);

    function save() {
        setSaving(true);
        router.patch(route('admin.support-tickets.update', ticket.id), { status, admin_response: response }, {
            onSuccess: onClose,
            onFinish: () => setSaving(false),
        });
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-surface rounded-3xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant">
                    <h2 className="font-bold text-on-surface">Detail Tiket #{ticket.id}</h2>
                    <button onClick={onClose} className="p-1 text-on-surface-variant hover:text-error"><span className="material-symbols-outlined text-[20px]">close</span></button>
                </div>
                <div className="p-6 space-y-4">
                    <div>
                        <p className="text-xs text-on-surface-variant mb-1">Dari</p>
                        <p className="font-semibold text-on-surface">{ticket.user?.name} <span className="font-normal text-on-surface-variant">({ticket.user?.email})</span></p>
                    </div>
                    <div>
                        <p className="text-xs text-on-surface-variant mb-1">Subjek</p>
                        <p className="font-semibold text-on-surface">{ticket.subject}</p>
                    </div>
                    <div>
                        <p className="text-xs text-on-surface-variant mb-1">Pesan</p>
                        <p className="text-sm text-on-surface whitespace-pre-wrap bg-surface-container-low rounded-xl p-4">{ticket.message}</p>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1.5">Status</label>
                        <select value={status} onChange={(e) => setStatus(e.target.value)}
                            className="w-full border border-outline-variant bg-surface-container-low rounded-xl px-3 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30">
                            <option value="open">Baru</option>
                            <option value="in_progress">Diproses</option>
                            <option value="resolved">Selesai</option>
                            <option value="closed">Ditutup</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1.5">Respons Admin</label>
                        <textarea rows={4} value={response} onChange={(e) => setResponse(e.target.value)}
                            placeholder="Tulis respons untuk pengguna..."
                            className="w-full border border-outline-variant bg-surface-container-low rounded-xl px-3 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button onClick={save} disabled={saving}
                            className="flex-1 py-2.5 rounded-xl bg-primary text-on-primary font-bold text-sm hover:opacity-90 disabled:opacity-60">
                            {saving ? 'Menyimpan...' : 'Simpan'}
                        </button>
                        <button onClick={onClose} className="px-5 py-2.5 rounded-xl border border-outline-variant text-on-surface-variant text-sm hover:bg-surface-container-low">Batal</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function AdminSupportTickets({ tickets }) {
    const { flash } = usePage().props;
    const [selected, setSelected] = useState(null);

    return (
        <AdminLayout>
            <Head title="Tiket Bantuan — Admin" />
            <div className="max-w-6xl mx-auto px-margin-mobile md:px-margin-desktop py-xl">
                <div className="flex items-center justify-between mb-xl">
                    <div>
                        <h1 className="font-headline-sm text-headline-sm font-bold text-on-surface">Tiket Bantuan</h1>
                        <p className="text-sm text-on-surface-variant mt-1">{tickets.total} tiket total</p>
                    </div>
                </div>

                {flash?.success && (
                    <div className="mb-lg p-4 bg-success/10 border border-success/20 rounded-2xl flex gap-2 items-center">
                        <span className="material-symbols-outlined text-success text-[18px]">check_circle</span>
                        <p className="text-sm text-success">{flash.success}</p>
                    </div>
                )}

                <div className="bg-surface border border-outline-variant rounded-3xl overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-surface-container-low">
                            <tr>
                                {['#', 'Pengguna', 'Subjek', 'Kategori', 'Status', 'Tanggal', 'Aksi'].map((h) => (
                                    <th key={h} className="text-left px-4 py-3.5 text-xs font-bold text-on-surface-variant uppercase tracking-wider">{h}</th>
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
                                    <tr key={t.id} className="hover:bg-surface-container-lowest transition-colors">
                                        <td className="px-4 py-3.5 text-on-surface-variant">#{t.id}</td>
                                        <td className="px-4 py-3.5">
                                            <p className="font-semibold text-on-surface">{t.user?.name}</p>
                                            <p className="text-xs text-on-surface-variant">{t.user?.email}</p>
                                        </td>
                                        <td className="px-4 py-3.5 text-on-surface max-w-[200px] truncate">{t.subject}</td>
                                        <td className="px-4 py-3.5 text-on-surface-variant">{CATEGORY_LABELS[t.category] ?? t.category}</td>
                                        <td className="px-4 py-3.5">
                                            <span className={`inline-flex text-xs font-bold px-2.5 py-1 rounded-full border ${s.cls}`}>{s.label}</span>
                                        </td>
                                        <td className="px-4 py-3.5 text-on-surface-variant whitespace-nowrap">
                                            {new Date(t.created_at).toLocaleDateString('id-ID')}
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <button onClick={() => setSelected(t)}
                                                className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-bold hover:bg-primary/20 transition-colors">
                                                Kelola
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {selected && <TicketModal ticket={selected} onClose={() => setSelected(null)} />}
        </AdminLayout>
    );
}

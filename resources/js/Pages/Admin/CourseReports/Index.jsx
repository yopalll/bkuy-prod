import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

const STATUS_LABELS = {
    pending:   { label: 'Menunggu', cls: 'bg-warning/10 text-warning border-warning/20' },
    reviewed:  { label: 'Ditinjau', cls: 'bg-primary/10 text-primary border-primary/20' },
    dismissed: { label: 'Ditolak',  cls: 'bg-surface-container text-on-surface-variant border-outline-variant' },
};

const REASON_LABELS = {
    'Konten menyesatkan':       'Konten menyesatkan',
    'Hak cipta':                'Pelanggaran hak cipta',
    'Konten tidak pantas':      'Konten tidak pantas',
    'Informasi salah':          'Informasi salah/berbahaya',
    'Spam':                     'Spam / promosi berlebihan',
    'Lainnya':                  'Lainnya',
};

function ReportModal({ report, onClose }) {
    const [status, setStatus] = useState(report.status);
    const [note, setNote] = useState(report.admin_note ?? '');
    const [saving, setSaving] = useState(false);

    function save() {
        setSaving(true);
        router.patch(route('admin.course-reports.update', report.id), { status, admin_note: note }, {
            onSuccess: onClose,
            onFinish: () => setSaving(false),
        });
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-surface rounded-3xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant">
                    <h2 className="font-bold text-on-surface">Detail Laporan #{report.id}</h2>
                    <button onClick={onClose} className="p-1 text-on-surface-variant hover:text-error"><span className="material-symbols-outlined text-[20px]">close</span></button>
                </div>
                <div className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs text-on-surface-variant mb-1">Pelapor</p>
                            <p className="font-semibold text-on-surface">{report.user?.name}</p>
                            <p className="text-xs text-on-surface-variant">{report.user?.email}</p>
                        </div>
                        <div>
                            <p className="text-xs text-on-surface-variant mb-1">Kursus Dilaporkan</p>
                            <p className="font-semibold text-on-surface">{report.course?.title}</p>
                        </div>
                    </div>
                    <div>
                        <p className="text-xs text-on-surface-variant mb-1">Alasan</p>
                        <p className="font-semibold text-on-surface">{report.reason}</p>
                    </div>
                    {report.detail && (
                        <div>
                            <p className="text-xs text-on-surface-variant mb-1">Detail</p>
                            <p className="text-sm text-on-surface whitespace-pre-wrap bg-surface-container-low rounded-xl p-4">{report.detail}</p>
                        </div>
                    )}
                    <div>
                        <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1.5">Status</label>
                        <select value={status} onChange={(e) => setStatus(e.target.value)}
                            className="w-full border border-outline-variant bg-surface-container-low rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                            <option value="pending">Menunggu</option>
                            <option value="reviewed">Ditinjau (tindak lanjut)</option>
                            <option value="dismissed">Ditolak (tidak valid)</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1.5">Catatan Admin</label>
                        <textarea rows={3} value={note} onChange={(e) => setNote(e.target.value)}
                            placeholder="Catatan internal atau keputusan..."
                            className="w-full border border-outline-variant bg-surface-container-low rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button onClick={save} disabled={saving}
                            className="flex-1 py-2.5 rounded-xl bg-primary text-on-primary font-bold text-sm hover:opacity-90 disabled:opacity-60">
                            {saving ? 'Menyimpan...' : 'Simpan Keputusan'}
                        </button>
                        <button onClick={onClose} className="px-5 py-2.5 rounded-xl border border-outline-variant text-on-surface-variant text-sm hover:bg-surface-container-low">Batal</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function AdminCourseReports({ reports }) {
    const { flash } = usePage().props;
    const [selected, setSelected] = useState(null);

    return (
        <AdminLayout>
            <Head title="Laporan Kursus — Admin" />
            <div className="max-w-6xl mx-auto px-margin-mobile md:px-margin-desktop py-xl">
                <div className="mb-xl">
                    <h1 className="font-headline-sm text-headline-sm font-bold text-on-surface">Laporan Kursus</h1>
                    <p className="text-sm text-on-surface-variant mt-1">{reports.total} laporan total</p>
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
                                {['#', 'Pelapor', 'Kursus', 'Alasan', 'Status', 'Tanggal', 'Aksi'].map((h) => (
                                    <th key={h} className="text-left px-4 py-3.5 text-xs font-bold text-on-surface-variant uppercase tracking-wider">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant">
                            {reports.data.length === 0 && (
                                <tr><td colSpan={7} className="text-center py-12 text-on-surface-variant">Belum ada laporan kursus.</td></tr>
                            )}
                            {reports.data.map((r) => {
                                const s = STATUS_LABELS[r.status] ?? STATUS_LABELS.pending;
                                return (
                                    <tr key={r.id} className="hover:bg-surface-container-lowest transition-colors">
                                        <td className="px-4 py-3.5 text-on-surface-variant">#{r.id}</td>
                                        <td className="px-4 py-3.5">
                                            <p className="font-semibold text-on-surface">{r.user?.name}</p>
                                        </td>
                                        <td className="px-4 py-3.5 max-w-[180px]">
                                            <p className="text-on-surface truncate">{r.course?.title}</p>
                                        </td>
                                        <td className="px-4 py-3.5 text-on-surface-variant">{r.reason}</td>
                                        <td className="px-4 py-3.5">
                                            <span className={`inline-flex text-xs font-bold px-2.5 py-1 rounded-full border ${s.cls}`}>{s.label}</span>
                                        </td>
                                        <td className="px-4 py-3.5 text-on-surface-variant whitespace-nowrap">
                                            {new Date(r.created_at).toLocaleDateString('id-ID')}
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <button onClick={() => setSelected(r)}
                                                className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-bold hover:bg-primary/20 transition-colors">
                                                Tinjau
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
            {selected && <ReportModal report={selected} onClose={() => setSelected(null)} />}
        </AdminLayout>
    );
}

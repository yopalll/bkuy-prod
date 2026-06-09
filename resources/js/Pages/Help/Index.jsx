import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

const STATUS_LABELS = {
    open:        { label: 'Menunggu',    cls: 'bg-warning/10 text-warning border-warning/20' },
    in_progress: { label: 'Diproses',   cls: 'bg-primary/10 text-primary border-primary/20' },
    resolved:    { label: 'Selesai',    cls: 'bg-success/10 text-success border-success/20' },
    closed:      { label: 'Ditutup',    cls: 'bg-surface-container text-on-surface-variant border-outline-variant' },
};

const CATEGORY_LABELS = {
    general:   'Umum',
    billing:   'Pembayaran',
    technical: 'Teknis',
    course:    'Kursus',
};

function StatusBadge({ status }) {
    const s = STATUS_LABELS[status] ?? STATUS_LABELS.open;
    return (
        <span className={`inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-full border ${s.cls}`}>
            {s.label}
        </span>
    );
}

export default function HelpIndex({ tickets }) {
    const { flash } = usePage().props;
    const [showForm, setShowForm] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        subject:  '',
        message:  '',
        category: 'general',
    });

    function handleSubmit(e) {
        e.preventDefault();
        post(route('help.store'), {
            onSuccess: () => { reset(); setShowForm(false); },
        });
    }

    return (
        <AppLayout>
            <Head title="Pusat Bantuan — BelajarKUY" />

            {/* Hero */}
            <section className="bg-primary text-on-primary py-14 px-margin-mobile md:px-margin-desktop">
                <div className="max-w-3xl mx-auto text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 mb-5">
                        <span className="material-symbols-outlined text-[32px]">support_agent</span>
                    </div>
                    <h1 className="font-headline-lg text-headline-lg font-bold mb-3">Pusat Bantuan</h1>
                    <p className="font-body-lg text-body-lg opacity-80">
                        Ada pertanyaan atau kendala? Kirim tiket bantuan dan tim kami akan merespons dalam 1–2 hari kerja.
                    </p>
                </div>
            </section>

            <div className="max-w-3xl mx-auto px-margin-mobile md:px-margin-desktop py-xl">

                {/* Flash messages */}
                {flash?.success && (
                    <div className="mb-lg p-4 bg-success/10 border border-success/20 rounded-2xl flex gap-3 items-start">
                        <span className="material-symbols-outlined text-success text-[20px] mt-0.5">check_circle</span>
                        <p className="font-body-md text-success">{flash.success}</p>
                    </div>
                )}

                {/* FAQ Singkat */}
                <section className="mb-xl">
                    <h2 className="font-title-lg text-title-lg font-bold text-on-surface mb-lg">Pertanyaan Umum</h2>
                    <div className="space-y-sm">
                        {[
                            { q: 'Bagaimana cara mendaftar sebagai instruktur?', a: 'Daftarkan akun BelajarKUY, lalu hubungi admin untuk upgrade role menjadi instruktur. Kami akan memverifikasi profil Anda sebelum memberikan akses.' },
                            { q: 'Apakah kursus bisa diakses selamanya setelah dibeli?', a: 'Ya! Semua kursus yang sudah Anda beli dapat diakses kapan saja tanpa batas waktu.' },
                            { q: 'Bagaimana cara mendapatkan sertifikat?', a: 'Sertifikat diterbitkan secara otomatis setelah Anda menyelesaikan 100% materi kursus.' },
                            { q: 'Metode pembayaran apa saja yang tersedia?', a: 'Kami mendukung Transfer Bank, Virtual Account, GoPay, OVO, dan kartu kredit/debit melalui Midtrans.' },
                        ].map(({ q, a }) => (
                            <details key={q} className="group bg-surface border border-outline-variant rounded-2xl overflow-hidden">
                                <summary className="flex items-center justify-between p-5 cursor-pointer font-semibold text-on-surface list-none">
                                    {q}
                                    <span className="material-symbols-outlined text-on-surface-variant group-open:rotate-180 transition-transform text-[20px] shrink-0 ml-3">expand_more</span>
                                </summary>
                                <p className="px-5 pb-5 font-body-md text-body-md text-on-surface-variant leading-relaxed">{a}</p>
                            </details>
                        ))}
                    </div>
                </section>

                {/* Tiket saya */}
                {tickets.length > 0 && (
                    <section className="mb-xl">
                        <h2 className="font-title-lg text-title-lg font-bold text-on-surface mb-lg">Tiket Saya</h2>
                        <div className="space-y-sm">
                            {tickets.map((ticket) => (
                                <div key={ticket.id} className="bg-surface border border-outline-variant rounded-2xl p-5">
                                    <div className="flex items-start justify-between gap-3 mb-2">
                                        <div>
                                            <p className="font-semibold text-on-surface">{ticket.subject}</p>
                                            <p className="text-xs text-on-surface-variant mt-0.5">
                                                {CATEGORY_LABELS[ticket.category]} · {new Date(ticket.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                            </p>
                                        </div>
                                        <StatusBadge status={ticket.status} />
                                    </div>
                                    {ticket.admin_response && (
                                        <div className="mt-3 p-3 bg-primary-fixed/20 rounded-xl border border-primary/10">
                                            <p className="text-xs font-bold text-primary mb-1">Respons Admin</p>
                                            <p className="text-sm text-on-surface">{ticket.admin_response}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Buat tiket baru */}
                <section>
                    <div className="bg-surface border border-outline-variant rounded-3xl p-6 md:p-8">
                        <div className="flex items-center justify-between mb-lg">
                            <div>
                                <h2 className="font-title-lg text-title-lg font-bold text-on-surface">Kirim Tiket Bantuan</h2>
                                <p className="text-sm text-on-surface-variant mt-1">Jelaskan kendala Anda sedetail mungkin</p>
                            </div>
                            {!showForm && (
                                <button
                                    onClick={() => setShowForm(true)}
                                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-on-primary font-semibold text-sm hover:opacity-90 transition-opacity"
                                >
                                    <span className="material-symbols-outlined text-[18px]">add</span>
                                    Buat Tiket
                                </button>
                            )}
                        </div>

                        {showForm && (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                                        Kategori <span className="text-error">*</span>
                                    </label>
                                    <select
                                        value={data.category}
                                        onChange={(e) => setData('category', e.target.value)}
                                        className="w-full border border-outline-variant bg-surface-container-low rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30"
                                    >
                                        <option value="general">Umum</option>
                                        <option value="billing">Pembayaran</option>
                                        <option value="technical">Teknis</option>
                                        <option value="course">Kursus</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                                        Judul Masalah <span className="text-error">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.subject}
                                        onChange={(e) => setData('subject', e.target.value)}
                                        placeholder="Contoh: Tidak bisa mengakses video kursus"
                                        className={`w-full border rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30 bg-surface-container-low ${errors.subject ? 'border-error' : 'border-outline-variant'}`}
                                    />
                                    {errors.subject && <p className="text-xs text-error mt-1">{errors.subject}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                                        Deskripsi Lengkap <span className="text-error">*</span>
                                    </label>
                                    <textarea
                                        rows={5}
                                        value={data.message}
                                        onChange={(e) => setData('message', e.target.value)}
                                        placeholder="Ceritakan masalah Anda secara detail..."
                                        className={`w-full border rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30 bg-surface-container-low resize-none ${errors.message ? 'border-error' : 'border-outline-variant'}`}
                                    />
                                    {errors.message && <p className="text-xs text-error mt-1">{errors.message}</p>}
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="flex-1 py-3 rounded-xl bg-warning text-white font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-60"
                                    >
                                        {processing ? 'Mengirim...' : 'Kirim Tiket'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowForm(false)}
                                        className="px-5 py-3 rounded-xl border border-outline-variant text-on-surface-variant font-semibold text-sm hover:bg-surface-container-low transition-colors"
                                    >
                                        Batal
                                    </button>
                                </div>
                            </form>
                        )}

                        {!showForm && tickets.length === 0 && (
                            <div className="text-center py-8 text-on-surface-variant">
                                <span className="material-symbols-outlined text-[48px] opacity-30 mb-3">inbox</span>
                                <p className="text-sm">Belum ada tiket bantuan. Klik "Buat Tiket" untuk memulai.</p>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </AppLayout>
    );
}

import AdminLayout from '@/Layouts/AdminLayout';
import TicketAttachmentInput from '@/Components/TicketAttachmentInput';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

const STATUS_LABELS = {
    open:        { label: 'Baru',     cls: 'bg-warning/10 text-warning border-warning/20' },
    in_progress: { label: 'Diproses', cls: 'bg-primary/10 text-primary border-primary/20' },
    resolved:    { label: 'Selesai',  cls: 'bg-success/10 text-success border-success/20' },
    closed:      { label: 'Ditutup',  cls: 'bg-surface-container text-on-surface-variant border-outline-variant' },
};

const CATEGORY_LABELS = {
    general: 'Umum', billing: 'Pembayaran', technical: 'Teknis', course: 'Kursus',
};

function fmtTime(d) {
    return new Date(d).toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function MessageBubble({ msg, onPreview }) {
    const isAdmin = msg.author_role === 'admin';
    return (
        <div className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}>
            <div className="max-w-[85%]">
                <div className={`flex items-center gap-2 mb-1 ${isAdmin ? 'justify-end' : ''}`}>
                    <span className="text-xs font-bold text-on-surface">{msg.author_name}</span>
                    {isAdmin
                        ? <span className="text-[10px] font-bold uppercase tracking-wide text-primary bg-primary/10 px-1.5 py-0.5 rounded">Admin</span>
                        : <span className="text-[10px] font-bold uppercase tracking-wide text-on-surface-variant bg-surface-container px-1.5 py-0.5 rounded">User</span>}
                    <span className="text-[11px] text-on-surface-variant">{fmtTime(msg.created_at)}</span>
                </div>
                <div className={`rounded-2xl px-4 py-3 ${isAdmin ? 'bg-primary text-on-primary rounded-tr-sm' : 'bg-surface border border-outline-variant rounded-tl-sm'}`}>
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.body}</p>
                    {msg.attachments.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                            {msg.attachments.map((a) => (
                                <button
                                    key={a.id}
                                    type="button"
                                    onClick={() => onPreview(a.url)}
                                    className="w-24 h-24 rounded-xl overflow-hidden border border-black/10 hover:opacity-90 transition-opacity"
                                >
                                    <img src={a.url} alt={a.file_name ?? ''} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function AdminSupportTicketShow({ ticket }) {
    const { flash } = usePage().props;
    const [preview, setPreview] = useState(null);

    const s = STATUS_LABELS[ticket.status] ?? STATUS_LABELS.open;

    const { data, setData, post, processing, errors, reset } = useForm({
        message:      '',
        status:       ticket.status === 'open' ? 'in_progress' : ticket.status,
        notify_email: true,
        attachments:  [],
    });

    function handleReply(e) {
        e.preventDefault();
        post(route('admin.support-tickets.reply', ticket.id), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => reset('message', 'attachments'),
        });
    }

    return (
        <AdminLayout>
            <Head title={`Tiket #${ticket.id} — Admin`} />

            <div className="max-w-3xl mx-auto px-margin-mobile md:px-margin-desktop py-xl">

                <Link href={route('admin.support-tickets.index')} className="inline-flex items-center gap-1.5 text-sm text-on-surface-variant hover:text-primary mb-4 transition-colors">
                    <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                    Kembali ke daftar tiket
                </Link>

                {flash?.success && (
                    <div className="mb-lg p-4 bg-success/10 border border-success/20 rounded-2xl flex gap-2 items-center">
                        <span className="material-symbols-outlined text-success text-[18px]">check_circle</span>
                        <p className="text-sm text-success">{flash.success}</p>
                    </div>
                )}

                {/* Header */}
                <div className="bg-surface border border-outline-variant rounded-3xl p-6 mb-5">
                    <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                            <h1 className="font-title-lg text-title-lg font-bold text-on-surface">{ticket.subject}</h1>
                            <p className="text-xs text-on-surface-variant mt-1">
                                Tiket #{ticket.id} · {CATEGORY_LABELS[ticket.category]} · Dibuat {fmtTime(ticket.created_at)}
                            </p>
                            <p className="text-sm text-on-surface mt-2">
                                <span className="font-semibold">{ticket.user?.name}</span>
                                <span className="text-on-surface-variant"> · {ticket.user?.email}</span>
                            </p>
                        </div>
                        <span className={`shrink-0 inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-full border ${s.cls}`}>{s.label}</span>
                    </div>
                </div>

                {/* Conversation */}
                <div className="space-y-5 mb-6">
                    {ticket.messages.map((msg) => (
                        <MessageBubble key={msg.id} msg={msg} onPreview={setPreview} />
                    ))}
                </div>

                {/* Reply box */}
                <form onSubmit={handleReply} className="bg-surface border border-outline-variant rounded-3xl p-5 md:p-6 space-y-4">
                    <h2 className="font-semibold text-on-surface">Balas Tiket</h2>
                    <div>
                        <textarea
                            rows={4}
                            value={data.message}
                            onChange={(e) => setData('message', e.target.value)}
                            placeholder="Tulis balasan untuk pengguna..."
                            className={`w-full border rounded-xl px-4 py-3 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30 bg-surface-container-low resize-none ${errors.message ? 'border-error' : 'border-outline-variant'}`}
                        />
                        {errors.message && <p className="text-xs text-error mt-1">{errors.message}</p>}
                    </div>

                    <TicketAttachmentInput
                        files={data.attachments}
                        onChange={(files) => setData('attachments', files)}
                        error={errors.attachments || errors['attachments.0']}
                    />

                    <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Set Status</label>
                            <select
                                value={data.status}
                                onChange={(e) => setData('status', e.target.value)}
                                className="w-full border border-outline-variant bg-surface-container-low rounded-xl px-3 py-2.5 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30"
                            >
                                <option value="open">Baru</option>
                                <option value="in_progress">Diproses</option>
                                <option value="resolved">Selesai</option>
                                <option value="closed">Ditutup</option>
                            </select>
                        </div>
                        <label className="flex items-center gap-2.5 sm:mt-6 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                checked={data.notify_email}
                                onChange={(e) => setData('notify_email', e.target.checked)}
                                className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary/30"
                            />
                            <span className="text-sm text-on-surface">Kirim balasan ke email pengguna</span>
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full py-3 rounded-xl bg-primary text-on-primary font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-60"
                    >
                        {processing ? 'Mengirim...' : 'Kirim Balasan'}
                    </button>
                </form>
            </div>

            {/* Image preview lightbox */}
            {preview && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setPreview(null)}>
                    <img src={preview} alt="" className="max-w-full max-h-[90vh] rounded-xl object-contain" onClick={(e) => e.stopPropagation()} />
                    <button onClick={() => setPreview(null)} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/15 text-white flex items-center justify-center hover:bg-white/30">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
            )}
        </AdminLayout>
    );
}

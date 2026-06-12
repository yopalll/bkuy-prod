import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Pagination from '@/Components/Admin/Pagination';
import ConfirmDialog from '@/Components/ConfirmDialog';
import { useState } from 'react';

function Modal({ title, onClose, children }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-md">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-surface rounded-2xl shadow-xl w-full max-w-md p-xl z-10">
                <div className="flex justify-between items-center mb-lg">
                    <h3 className="font-headline-md text-headline-md text-on-surface">{title}</h3>
                    <button onClick={onClose} className="text-on-surface-variant hover:text-error">
                        <span className="material-symbols-outlined text-[20px]">close</span>
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}

const EMPTY_FORM = { code: '', discount_percent: 10, valid_until: '', max_usage: '' };

export default function CouponsIndex({ coupons, filters = {} }) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [scopeFilter, setScopeFilter] = useState(filters.scope ?? '');
    const [showCreate, setShowCreate] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const [dialog, setDialog] = useState(null);

    function applyFilters(overrides = {}) {
        router.get('/admin/coupons', { search, scope: scopeFilter, ...overrides }, { preserveState: true, replace: true });
    }

    function openCreate() {
        setForm(EMPTY_FORM);
        setErrors({});
        setEditItem(null);
        setShowCreate(true);
    }

    function openEdit(coupon) {
        setForm({
            code: coupon.code,
            discount_percent: coupon.discount_percent,
            valid_until: coupon.valid_until ?? '',
            max_usage: coupon.max_usage ?? '',
        });
        setErrors({});
        setEditItem(coupon);
        setShowCreate(false);
    }

    function closeModal() {
        setShowCreate(false);
        setEditItem(null);
        setErrors({});
    }

    function handleSubmit(e) {
        e.preventDefault();
        setSubmitting(true);
        const payload = { ...form, max_usage: form.max_usage || null };

        if (editItem) {
            router.patch(route('admin.coupons.update', editItem.id), payload, {
                onSuccess: () => { setSubmitting(false); closeModal(); },
                onError: (errs) => { setSubmitting(false); setErrors(errs); },
            });
        } else {
            router.post(route('admin.coupons.store'), payload, {
                onSuccess: () => { setSubmitting(false); closeModal(); },
                onError: (errs) => { setSubmitting(false); setErrors(errs); },
            });
        }
    }

    function handleDelete(coupon) {
        setDialog({
            title: 'Hapus Kupon',
            message: `Hapus kupon "${coupon.code}"? Aksi ini tidak bisa dibatalkan.`,
            icon: 'delete', variant: 'danger', confirmLabel: 'Hapus',
            onConfirm: () => router.delete(route('admin.coupons.destroy', coupon.id)),
        });
    }

    function handleToggle(coupon) {
        router.patch(route('admin.coupons.toggle', coupon.id), {}, { preserveState: true });
    }

    async function generateCode() {
        try {
            const res = await fetch(route('admin.coupons.generate-code'));
            const data = await res.json();
            setForm(f => ({ ...f, code: data.code }));
        } catch {
            // silent
        }
    }

    const inputCls = 'w-full bg-background-subtle border-2 border-transparent focus:border-primary rounded-lg py-sm px-md font-body-md text-body-md outline-none transition-colors';

    const CouponForm = () => (
        <form onSubmit={handleSubmit}>
            <div className="space-y-md">
                <div>
                    <label className="font-label-md text-label-md text-on-surface block mb-xs">Kode Kupon</label>
                    <div className="flex gap-sm">
                        <input
                            type="text"
                            value={form.code}
                            onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))}
                            className={`${inputCls} flex-1`}
                            placeholder="DISKON50"
                            required
                            maxLength={50}
                        />
                        <button type="button" onClick={generateCode}
                            className="px-md py-sm rounded-lg border border-outline text-on-surface-variant hover:bg-surface-variant font-label-md text-label-md shrink-0">
                            Generate
                        </button>
                    </div>
                    {errors.code && <p className="mt-xs font-caption text-caption text-error">{errors.code}</p>}
                </div>
                <div>
                    <label className="font-label-md text-label-md text-on-surface block mb-xs">Diskon (%)</label>
                    <input type="number" min="1" max="100" value={form.discount_percent}
                        onChange={e => setForm(f => ({ ...f, discount_percent: e.target.value }))}
                        className={inputCls} required />
                    {errors.discount_percent && <p className="mt-xs font-caption text-caption text-error">{errors.discount_percent}</p>}
                </div>
                <div>
                    <label className="font-label-md text-label-md text-on-surface block mb-xs">Berlaku Hingga</label>
                    <input type="date" value={form.valid_until}
                        onChange={e => setForm(f => ({ ...f, valid_until: e.target.value }))}
                        className={inputCls} required />
                    {errors.valid_until && <p className="mt-xs font-caption text-caption text-error">{errors.valid_until}</p>}
                </div>
                <div>
                    <label className="font-label-md text-label-md text-on-surface block mb-xs">Maks. Penggunaan (kosongkan = tak terbatas)</label>
                    <input type="number" min="1" value={form.max_usage}
                        onChange={e => setForm(f => ({ ...f, max_usage: e.target.value }))}
                        className={inputCls} placeholder="Opsional" />
                    {errors.max_usage && <p className="mt-xs font-caption text-caption text-error">{errors.max_usage}</p>}
                </div>
                <p className="font-caption text-caption text-on-surface-variant bg-primary/5 rounded-lg p-sm">
                    <span className="material-symbols-outlined text-[14px] text-primary align-middle mr-xs">info</span>
                    Kupon yang dibuat admin berlaku untuk <strong>semua kursus</strong> (global).
                </p>
            </div>
            <div className="flex gap-sm justify-end mt-xl">
                <button type="button" onClick={closeModal} className="px-lg py-sm rounded-lg border border-outline text-on-surface font-label-md text-label-md hover:bg-surface-variant">Batal</button>
                <button type="submit" disabled={submitting} className="px-lg py-sm rounded-lg bg-primary text-on-primary font-label-md text-label-md hover:bg-primary-container disabled:opacity-50">
                    {submitting ? 'Menyimpan…' : editItem ? 'Perbarui' : 'Buat Kupon'}
                </button>
            </div>
        </form>
    );

    return (
        <AdminLayout title="Admin Portal">
            <Head title="Kupon — BelajarKUY Admin" />

            {/* Header */}
            <div className="flex justify-between items-end mb-gutter">
                <div>
                    <h1 className="font-headline-lg text-headline-lg text-on-surface">Manajemen Kupon</h1>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-xs">
                        Kelola kupon diskon platform — global maupun per-kursus.
                    </p>
                </div>
                <button
                    id="btn-buat-kupon"
                    onClick={openCreate}
                    className="flex items-center gap-sm bg-primary text-on-primary font-label-md text-label-md px-lg py-sm rounded-lg hover:bg-primary-container transition-colors shadow-sm"
                >
                    <span className="material-symbols-outlined text-[18px]">add</span>
                    Kupon Global Baru
                </button>
            </div>

            {/* Filter bar */}
            <div className="flex flex-col sm:flex-row gap-md mb-lg">
                <div className="relative flex-1">
                    <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px] pointer-events-none">search</span>
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && applyFilters({ search: e.target.value })}
                        placeholder="Cari kode kupon…"
                        className="w-full pl-xl pr-md py-sm bg-surface border border-surface-variant rounded-lg font-body-md text-body-md outline-none focus:border-primary transition-colors"
                    />
                </div>
                <select
                    value={scopeFilter}
                    onChange={e => { setScopeFilter(e.target.value); applyFilters({ scope: e.target.value }); }}
                    className="bg-surface border border-surface-variant rounded-lg py-sm px-md font-body-md text-body-md outline-none focus:border-primary"
                >
                    <option value="">Semua Tipe</option>
                    <option value="global">Global</option>
                    <option value="course">Per-Kursus</option>
                </select>
                <button
                    onClick={() => applyFilters()}
                    className="bg-primary text-on-primary px-lg py-sm rounded-lg font-label-md text-label-md hover:bg-primary-container transition-colors shrink-0"
                >
                    Filter
                </button>
            </div>

            {/* Table */}
            <div className="bg-surface rounded-2xl shadow-[0_8px_30px_rgb(48,0,51,0.04)] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-surface-variant bg-background-subtle">
                                <th className="py-md px-lg font-label-md text-label-md text-on-surface-variant">Kode</th>
                                <th className="py-md px-lg font-label-md text-label-md text-on-surface-variant text-center">Diskon</th>
                                <th className="py-md px-lg font-label-md text-label-md text-on-surface-variant hidden md:table-cell">Tipe</th>
                                <th className="py-md px-lg font-label-md text-label-md text-on-surface-variant hidden lg:table-cell">Instruktur</th>
                                <th className="py-md px-lg font-label-md text-label-md text-on-surface-variant hidden lg:table-cell">Berlaku Hingga</th>
                                <th className="py-md px-lg font-label-md text-label-md text-on-surface-variant text-center">Penggunaan</th>
                                <th className="py-md px-lg font-label-md text-label-md text-on-surface-variant text-center">Status</th>
                                <th className="py-md px-lg font-label-md text-label-md text-on-surface-variant text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {coupons.data?.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="py-xl text-center text-on-surface-variant font-body-md text-body-md">
                                        Tidak ada kupon
                                    </td>
                                </tr>
                            )}
                            {coupons.data?.map(coupon => (
                                <tr key={coupon.id} className="border-b border-surface-variant/50 hover:bg-background-subtle transition-colors group">
                                    {/* Kode */}
                                    <td className="py-md px-lg">
                                        <span className="font-mono font-bold text-primary bg-primary/10 px-sm py-xs rounded-lg text-sm">
                                            {coupon.code}
                                        </span>
                                    </td>

                                    {/* Diskon */}
                                    <td className="py-md px-lg text-center">
                                        <span className="font-label-md text-label-md text-secondary-container font-bold">
                                            {coupon.discount_percent}%
                                        </span>
                                    </td>

                                    {/* Tipe */}
                                    <td className="py-md px-lg hidden md:table-cell">
                                        {coupon.is_global ? (
                                            <span className="inline-flex items-center gap-xs font-caption text-caption bg-primary/10 text-primary px-sm py-xs rounded-full">
                                                <span className="material-symbols-outlined text-[12px]">public</span>
                                                Global
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-xs font-caption text-caption bg-secondary/10 text-secondary px-sm py-xs rounded-full">
                                                <span className="material-symbols-outlined text-[12px]">school</span>
                                                {coupon.course?.title ?? 'Kursus'}
                                            </span>
                                        )}
                                    </td>

                                    {/* Instruktur */}
                                    <td className="py-md px-lg hidden lg:table-cell font-body-md text-body-md text-on-surface-variant">
                                        {coupon.instructor?.name ?? '—'}
                                    </td>

                                    {/* Valid until */}
                                    <td className="py-md px-lg hidden lg:table-cell">
                                        <span className={`font-body-md text-body-md ${coupon.is_expired ? 'text-error line-through' : 'text-on-surface'}`}>
                                            {coupon.valid_until_fmt ?? '—'}
                                        </span>
                                        {coupon.is_expired && (
                                            <span className="ml-xs font-caption text-[10px] text-error bg-error/10 px-xs py-0.5 rounded-full">Expired</span>
                                        )}
                                    </td>

                                    {/* Penggunaan */}
                                    <td className="py-md px-lg text-center">
                                        <span className="font-body-md text-body-md text-on-surface">
                                            {coupon.used_count}
                                            {coupon.max_usage ? `/${coupon.max_usage}` : ''}
                                        </span>
                                    </td>

                                    {/* Status toggle */}
                                    <td className="py-md px-lg text-center">
                                        <button
                                            onClick={() => handleToggle(coupon)}
                                            className={`relative inline-flex w-10 h-5 rounded-full transition-colors duration-200 ${coupon.status ? 'bg-success' : 'bg-surface-variant'}`}
                                            title={coupon.status ? 'Nonaktifkan' : 'Aktifkan'}
                                        >
                                            <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${coupon.status ? 'translate-x-5' : 'translate-x-0'}`} />
                                        </button>
                                    </td>

                                    {/* Aksi */}
                                    <td className="py-md px-lg text-right">
                                        <div className="flex items-center justify-end gap-xs opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => openEdit(coupon)}
                                                className="p-sm rounded-lg text-primary hover:bg-primary/10 transition-colors"
                                                title="Edit"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">edit</span>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(coupon)}
                                                className="p-sm rounded-lg text-error hover:bg-error-container transition-colors"
                                                title="Hapus"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">delete</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <Pagination data={coupons} />
            </div>

            {/* Modal Create */}
            {showCreate && (
                <Modal title="Buat Kupon Global" onClose={closeModal}>
                    <CouponForm />
                </Modal>
            )}

            {/* Modal Edit */}
            {editItem && (
                <Modal title={`Edit Kupon: ${editItem.code}`} onClose={closeModal}>
                    <CouponForm />
                </Modal>
            )}
            {dialog && <ConfirmDialog open onClose={() => setDialog(null)} {...dialog} />}
        </AdminLayout>
    );
}

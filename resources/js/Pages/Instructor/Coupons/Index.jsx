import InstructorLayout from '@/Layouts/InstructorLayout';
import { Head, router, usePage, useForm } from '@inertiajs/react';
import { useState } from 'react';

// Layar: manajemen_kupon_diskon (Vascha & Quinsha)
// Route: GET /instructor/coupons → instructor.coupons.index

function getCsrf() {
    return decodeURIComponent(
        document.cookie
            .split('; ')
            .find((r) => r.startsWith('XSRF-TOKEN='))
            ?.split('=')[1] ?? '',
    );
}

function StatusPill({ active, expired, quotaFull }) {
    if (expired)   return <span className="inline-flex items-center gap-1 text-xs font-bold text-error bg-error-container border border-error/20 px-2.5 py-1 rounded-full">Kedaluwarsa</span>;
    if (quotaFull) return <span className="inline-flex items-center gap-1 text-xs font-bold text-warning bg-warning/10 border border-warning/20 px-2.5 py-1 rounded-full">Habis Kuota</span>;
    if (active)    return (
        <span className="inline-flex items-center gap-1 text-xs font-bold text-success bg-success/10 border border-success/20 px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />Aktif
        </span>
    );
    return <span className="inline-flex items-center gap-1 text-xs font-bold text-on-surface-variant bg-surface-container border border-outline-variant px-2.5 py-1 rounded-full">Nonaktif</span>;
}

/* ─── CouponForm (Create / Edit Modal) ─── */
function CouponForm({ courses, editing, onClose }) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        course_id:        editing?.course?.id ?? '',
        code:             editing?.code ?? '',
        discount_percent: editing?.discount_percent ?? 10,
        valid_until:      editing?.valid_until ?? '',
        max_usage:        editing?.max_usage ?? '',
        status:           editing?.status ?? true,
    });

    async function generateCode() {
        try {
            const res = await fetch('/instructor/coupons/generate-code', {
                headers: { Accept: 'application/json', 'X-XSRF-TOKEN': getCsrf() },
            });
            const json = await res.json();
            if (json.code) setData('code', json.code);
        } catch {}
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (editing) {
            router.put(route('instructor.coupons.update', editing.id), data, {
                onSuccess: onClose,
            });
        } else {
            router.post(route('instructor.coupons.store'), data, {
                onSuccess: () => { reset(); onClose(); },
            });
        }
    }

    const inputCls = (field) =>
        `w-full border rounded-2xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${
            errors[field] ? 'border-error/50 bg-error-container/20' : 'border-outline-variant bg-surface-container-low focus:bg-surface'
        }`;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
            <div
                className="bg-surface rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
                style={{ boxShadow: '0 8px 48px rgba(48,0,51,0.18)' }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-7 py-5 border-b border-surface-variant">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary-fixed/20 rounded-xl">
                            <span className="material-symbols-outlined text-[18px] text-primary">sell</span>
                        </div>
                        <h2 className="font-bold text-on-surface">
                            {editing ? 'Edit Kupon' : 'Buat Kupon Baru'}
                        </h2>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-xl hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors">
                        <span className="material-symbols-outlined text-[18px]">close</span>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="px-7 py-6 space-y-5">
                    {/* Kode Kupon */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">
                            Kode Kupon <span className="text-error">*</span>
                        </label>
                        <div className="flex gap-2">
                            <input
                                id="coupon-code"
                                type="text"
                                value={data.code}
                                onChange={(e) => setData('code', e.target.value.toUpperCase())}
                                placeholder="CONTOH10"
                                className={inputCls('code') + ' flex-1'}
                            />
                            <button
                                type="button"
                                onClick={generateCode}
                                title="Generate kode otomatis"
                                className="px-3.5 py-3 bg-surface-container hover:bg-primary-fixed/20 text-on-surface-variant hover:text-primary rounded-2xl transition-colors border border-outline-variant"
                            >
                                <span className="material-symbols-outlined text-[18px]">refresh</span>
                            </button>
                        </div>
                        {errors.code && (
                            <p className="text-xs text-error flex items-center gap-1">
                                <span className="material-symbols-outlined text-[14px]">error</span> {errors.code}
                            </p>
                        )}
                    </div>

                    {/* Berlaku Untuk Kursus */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">
                            Berlaku Untuk
                        </label>
                        <select
                            id="coupon-course"
                            value={data.course_id}
                            onChange={(e) => setData('course_id', e.target.value)}
                            className={inputCls('course_id') + ' appearance-none'}
                        >
                            <option value="">— Semua kursus saya (global) —</option>
                            {courses.map((c) => (
                                <option key={c.id} value={c.id}>{c.title}</option>
                            ))}
                        </select>
                        <p className="text-xs text-on-surface-variant">Kosongkan agar kupon berlaku untuk semua kursusmu.</p>
                    </div>

                    {/* Diskon % */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">
                            Diskon (%) <span className="text-error">*</span>
                        </label>
                        <div className="relative">
                            <input
                                id="coupon-discount"
                                type="number"
                                min={1}
                                max={100}
                                value={data.discount_percent}
                                onChange={(e) => setData('discount_percent', Number(e.target.value))}
                                className={inputCls('discount_percent') + ' pr-10'}
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-on-surface-variant">%</span>
                        </div>
                        {errors.discount_percent && (
                            <p className="text-xs text-error flex items-center gap-1">
                                <span className="material-symbols-outlined text-[14px]">error</span> {errors.discount_percent}
                            </p>
                        )}
                    </div>

                    {/* Tanggal Kedaluwarsa */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">
                            Berlaku Hingga <span className="text-error">*</span>
                        </label>
                        <input
                            id="coupon-valid-until"
                            type="date"
                            value={data.valid_until}
                            min={new Date().toISOString().split('T')[0]}
                            onChange={(e) => setData('valid_until', e.target.value)}
                            className={inputCls('valid_until')}
                        />
                        {errors.valid_until && (
                            <p className="text-xs text-error flex items-center gap-1">
                                <span className="material-symbols-outlined text-[14px]">error</span> {errors.valid_until}
                            </p>
                        )}
                    </div>

                    {/* Batas Pemakaian */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">
                            Batas Pemakaian
                        </label>
                        <input
                            id="coupon-max-usage"
                            type="number"
                            min={1}
                            value={data.max_usage}
                            onChange={(e) => setData('max_usage', e.target.value)}
                            placeholder="Kosongkan = tidak terbatas"
                            className={inputCls('max_usage')}
                        />
                        {errors.max_usage && (
                            <p className="text-xs text-error flex items-center gap-1">
                                <span className="material-symbols-outlined text-[14px]">error</span> {errors.max_usage}
                            </p>
                        )}
                    </div>

                    {/* Status */}
                    <div className="flex items-center justify-between py-3 border-t border-surface-variant">
                        <div>
                            <p className="text-sm font-bold text-on-surface">Status Aktif</p>
                            <p className="text-xs text-on-surface-variant mt-0.5">Kupon nonaktif tidak bisa digunakan student.</p>
                        </div>
                        <button
                            type="button"
                            role="switch"
                            aria-checked={data.status}
                            onClick={() => setData('status', !data.status)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 flex-shrink-0 ${
                                data.status ? 'bg-primary' : 'bg-outline-variant'
                            }`}
                        >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${data.status ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 rounded-2xl text-sm font-bold text-on-surface-variant bg-surface-container hover:bg-surface-container-high transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            id="btn-save-coupon"
                            className="flex-1 py-3 rounded-2xl text-sm font-bold text-on-primary bg-primary hover:bg-primary-container disabled:opacity-60 transition-colors"
                        >
                            {processing ? 'Menyimpan...' : editing ? 'Simpan Perubahan' : 'Buat Kupon'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

/* ─── CouponRow ─── */
function CouponRow({ coupon, onEdit, onDelete, onToggle }) {
    const [toggling, setToggling] = useState(false);
    const [deleting, setDeleting] = useState(false);

    async function handleToggle() {
        if (toggling) return;
        setToggling(true);
        await onToggle(coupon.id);
        setToggling(false);
    }

    function handleDelete() {
        if (!confirm(`Hapus kupon "${coupon.code}"?`)) return;
        setDeleting(true);
        onDelete(coupon.id);
    }

    const usageLabel = coupon.max_usage
        ? `${coupon.used_count} / ${coupon.max_usage}`
        : `${coupon.used_count} / ∞`;

    return (
        <tr className="group hover:bg-surface-container-lowest transition-colors border-b border-surface-variant last:border-0">
            {/* Kode */}
            <td className="px-6 py-4">
                <span className="font-mono text-sm font-black text-on-surface bg-surface-container px-3 py-1 rounded-lg tracking-widest">
                    {coupon.code}
                </span>
            </td>

            {/* Kursus */}
            <td className="px-6 py-4">
                {coupon.course ? (
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                        <span className="material-symbols-outlined text-[14px] flex-shrink-0">menu_book</span>
                        <span className="truncate max-w-[140px]">{coupon.course.title}</span>
                    </span>
                ) : (
                    <span className="text-xs text-on-surface-variant font-medium">Semua kursus</span>
                )}
            </td>

            {/* Diskon */}
            <td className="px-6 py-4 text-center">
                <span className="inline-flex items-center gap-1 text-sm font-extrabold text-warning">
                    <span className="material-symbols-outlined text-[14px]">percent</span>
                    {coupon.discount_percent}
                </span>
            </td>

            {/* Kedaluwarsa */}
            <td className="px-6 py-4 text-center">
                <span className={`flex items-center justify-center gap-1 text-xs font-semibold ${coupon.is_expired ? 'text-error' : 'text-on-surface-variant'}`}>
                    <span className="material-symbols-outlined text-[14px]">schedule</span>
                    {coupon.valid_until_fmt}
                </span>
            </td>

            {/* Pemakaian */}
            <td className="px-6 py-4 text-center">
                <span className={`text-xs font-bold ${coupon.is_quota_full ? 'text-warning' : 'text-on-surface'}`}>
                    {usageLabel}
                </span>
            </td>

            {/* Status */}
            <td className="px-6 py-4 text-center">
                <StatusPill active={coupon.status} expired={coupon.is_expired} quotaFull={coupon.is_quota_full} />
            </td>

            {/* Aksi */}
            <td className="px-6 py-4">
                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {/* Toggle aktif */}
                    <button
                        onClick={handleToggle}
                        disabled={toggling}
                        title={coupon.status ? 'Nonaktifkan' : 'Aktifkan'}
                        className={`p-2 rounded-xl transition-colors ${
                            coupon.status
                                ? 'text-success hover:bg-success/10'
                                : 'text-on-surface-variant hover:bg-surface-container'
                        }`}
                    >
                        <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: coupon.status ? "'FILL' 1" : "'FILL' 0" }}>
                            toggle_on
                        </span>
                    </button>

                    {/* Edit */}
                    <button
                        onClick={() => onEdit(coupon)}
                        title="Edit kupon"
                        className="p-2 rounded-xl text-primary hover:bg-primary-fixed/20 transition-colors"
                    >
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                    </button>

                    {/* Hapus */}
                    <button
                        onClick={handleDelete}
                        disabled={deleting}
                        title="Hapus kupon"
                        className="p-2 rounded-xl text-error hover:bg-error-container transition-colors disabled:opacity-50"
                    >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                </div>
            </td>
        </tr>
    );
}

/* ─── Page ─── */
export default function CouponsIndex({ coupons: initialCoupons, courses }) {
    const { flash } = usePage().props;

    const [coupons, setCoupons] = useState(initialCoupons ?? []);
    const [showForm, setShowForm]   = useState(false);
    const [editing, setEditing]     = useState(null);

    function openCreate() {
        setEditing(null);
        setShowForm(true);
    }

    function openEdit(coupon) {
        setEditing(coupon);
        setShowForm(true);
    }

    function handleClose() {
        setShowForm(false);
        setEditing(null);
        router.reload({ only: ['coupons'] });
    }

    async function handleToggle(couponId) {
        const res = await fetch(route('instructor.coupons.toggle', couponId), {
            method: 'PATCH',
            headers: {
                Accept:          'application/json',
                'X-XSRF-TOKEN':  getCsrf(),
            },
        });
        if (res.ok) {
            setCoupons((prev) =>
                prev.map((c) => c.id === couponId ? { ...c, status: !c.status } : c)
            );
        }
    }

    function handleDelete(couponId) {
        router.delete(route('instructor.coupons.destroy', couponId), {
            onSuccess: () => setCoupons((prev) => prev.filter((c) => c.id !== couponId)),
        });
    }

    const stats = {
        total:   coupons.length,
        active:  coupons.filter((c) => c.status && !c.is_expired && !c.is_quota_full).length,
        expired: coupons.filter((c) => c.is_expired).length,
    };

    return (
        <InstructorLayout>
            <Head title="Kupon Diskon — BelajarKUY" />

            {/* Page Header */}
            <div className="bg-surface px-margin-mobile md:px-margin-desktop py-lg border-b border-surface-variant">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-md">
                    <div>
                        <p className="font-caption text-caption text-on-surface-variant uppercase tracking-widest mb-xs">Panel Instruktur</p>
                        <div className="flex items-center gap-sm">
                            <span className="material-symbols-outlined text-[26px] text-primary" style={{ fontVariationSettings: "'FILL' 0" }}>sell</span>
                            <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-background">Kupon Diskon</h1>
                        </div>
                        <p className="font-body-md text-body-md text-on-surface-variant mt-xs">Buat dan kelola kupon diskon untuk kursusmu.</p>
                    </div>
                    <button
                        onClick={openCreate}
                        id="btn-create-coupon"
                        className="inline-flex items-center gap-sm font-label-md text-label-md bg-secondary-container text-on-secondary-container px-lg py-sm rounded-lg hover:bg-secondary-fixed transition-colors shadow-sm active:scale-95"
                    >
                        <span className="material-symbols-outlined text-[20px]">add</span>
                        Buat Kupon
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop py-lg space-y-lg">

                {/* Flash */}
                {flash?.success && (
                    <div className="flex items-center gap-3 bg-success/10 border border-success/20 rounded-2xl px-5 py-4 text-sm font-semibold text-success">
                        <span className="material-symbols-outlined text-[18px] shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                        {flash.success}
                    </div>
                )}

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                    {[
                        { label: 'Total Kupon', value: stats.total,   color: 'text-on-surface',         bg: 'bg-surface' },
                        { label: 'Aktif',       value: stats.active,  color: 'text-success',            bg: 'bg-success/5' },
                        { label: 'Kedaluwarsa', value: stats.expired, color: 'text-error',              bg: 'bg-error-container/30' },
                    ].map((s) => (
                        <div key={s.label} className={`${s.bg} rounded-3xl border border-surface-variant shadow-sm px-6 py-5 text-center`}>
                            <p className={`text-3xl font-extrabold ${s.color}`}>{s.value}</p>
                            <p className="text-xs font-semibold text-on-surface-variant mt-1">{s.label}</p>
                        </div>
                    ))}
                </div>

                {/* Table */}
                <div className="bg-surface rounded-3xl border border-surface-variant shadow-sm overflow-hidden">
                    {coupons.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-16 h-16 bg-primary-fixed/20 rounded-2xl flex items-center justify-center mb-4">
                                <span className="material-symbols-outlined text-[32px] text-primary">sell</span>
                            </div>
                            <h3 className="text-lg font-bold text-on-surface mb-1">Belum ada kupon</h3>
                            <p className="text-sm text-on-surface-variant mb-6">Buat kupon diskon untuk menarik lebih banyak siswa ke kursusmu.</p>
                            <button
                                onClick={openCreate}
                                className="flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-2xl text-sm font-bold hover:bg-primary-container transition-colors"
                            >
                                <span className="material-symbols-outlined text-[18px]">add</span>
                                Buat Kupon Pertama
                            </button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-surface-variant bg-surface-container-low">
                                        <th className="px-6 py-4 text-left text-xs font-black text-on-surface-variant uppercase tracking-wider">Kode</th>
                                        <th className="px-6 py-4 text-left text-xs font-black text-on-surface-variant uppercase tracking-wider">Kursus</th>
                                        <th className="px-6 py-4 text-center text-xs font-black text-on-surface-variant uppercase tracking-wider">Diskon</th>
                                        <th className="px-6 py-4 text-center text-xs font-black text-on-surface-variant uppercase tracking-wider">Kedaluwarsa</th>
                                        <th className="px-6 py-4 text-center text-xs font-black text-on-surface-variant uppercase tracking-wider">Pemakaian</th>
                                        <th className="px-6 py-4 text-center text-xs font-black text-on-surface-variant uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-right text-xs font-black text-on-surface-variant uppercase tracking-wider">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {coupons.map((coupon) => (
                                        <CouponRow
                                            key={coupon.id}
                                            coupon={coupon}
                                            onEdit={openEdit}
                                            onDelete={handleDelete}
                                            onToggle={handleToggle}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Info box */}
                <div className="bg-primary-fixed/10 border border-primary/10 rounded-2xl px-5 py-4 flex items-start gap-3 text-sm text-primary">
                    <span className="material-symbols-outlined text-[18px] mt-0.5 shrink-0">info</span>
                    <div>
                        <strong>Cara kerja kupon:</strong> Student menginput kode di halaman checkout. Kupon global berlaku untuk semua kursusmu; kupon spesifik hanya untuk satu kursus. Batas pemakaian diincrement otomatis setelah pembayaran berhasil.
                    </div>
                </div>
            </div>

            {/* Modal form */}
            {showForm && (
                <CouponForm
                    courses={courses}
                    editing={editing}
                    onClose={handleClose}
                />
            )}
        </InstructorLayout>
    );
}

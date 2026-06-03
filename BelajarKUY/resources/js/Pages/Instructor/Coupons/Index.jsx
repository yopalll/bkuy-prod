import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, router, usePage, useForm } from '@inertiajs/react';
import {
    Tag,
    Plus,
    Trash2,
    ToggleLeft,
    ToggleRight,
    Pencil,
    X,
    Check,
    AlertCircle,
    RefreshCw,
    Clock,
    BookOpen,
    Percent,
    Infinity,
    ChevronRight,
} from 'lucide-react';
import { useState } from 'react';

// ─── Helpers ────────────────────────────────────────────────────────────────

function getCsrf() {
    return decodeURIComponent(
        document.cookie
            .split('; ')
            .find((r) => r.startsWith('XSRF-TOKEN='))
            ?.split('=')[1] ?? '',
    );
}

function StatusPill({ active, expired, quotaFull }) {
    if (expired)   return <span className="inline-flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 border border-red-100 px-2.5 py-1 rounded-full">Kedaluwarsa</span>;
    if (quotaFull) return <span className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 bg-orange-50 border border-orange-100 px-2.5 py-1 rounded-full">Habis Kuota</span>;
    if (active)    return <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />Aktif</span>;
    return           <span className="inline-flex items-center gap-1 text-xs font-bold text-gray-500 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-full">Nonaktif</span>;
}

// ─── CouponForm (Create / Edit Modal) ────────────────────────────────────────

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
        `w-full border rounded-2xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
            errors[field] ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50 focus:bg-white'
        }`;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
            <div
                className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-7 py-5 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-50 rounded-xl">
                            <Tag className="w-4 h-4 text-indigo-600" />
                        </div>
                        <h2 className="font-bold text-gray-900">
                            {editing ? 'Edit Kupon' : 'Buat Kupon Baru'}
                        </h2>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="px-7 py-6 space-y-5">
                    {/* Kode Kupon */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                            Kode Kupon <span className="text-red-500">*</span>
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
                                className="px-3.5 py-3 bg-gray-100 hover:bg-indigo-50 text-gray-500 hover:text-indigo-600 rounded-2xl transition-colors border border-gray-200"
                            >
                                <RefreshCw className="w-4 h-4" />
                            </button>
                        </div>
                        {errors.code && (
                            <p className="text-xs text-red-500 flex items-center gap-1">
                                <AlertCircle className="w-3.5 h-3.5" /> {errors.code}
                            </p>
                        )}
                    </div>

                    {/* Berlaku Untuk Kursus */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
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
                        <p className="text-xs text-gray-400">Kosongkan agar kupon berlaku untuk semua kursusmu.</p>
                    </div>

                    {/* Diskon % */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                            Diskon (%) <span className="text-red-500">*</span>
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
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">%</span>
                        </div>
                        {errors.discount_percent && (
                            <p className="text-xs text-red-500 flex items-center gap-1">
                                <AlertCircle className="w-3.5 h-3.5" /> {errors.discount_percent}
                            </p>
                        )}
                    </div>

                    {/* Tanggal Kedaluwarsa */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                            Berlaku Hingga <span className="text-red-500">*</span>
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
                            <p className="text-xs text-red-500 flex items-center gap-1">
                                <AlertCircle className="w-3.5 h-3.5" /> {errors.valid_until}
                            </p>
                        )}
                    </div>

                    {/* Batas Pemakaian */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
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
                            <p className="text-xs text-red-500 flex items-center gap-1">
                                <AlertCircle className="w-3.5 h-3.5" /> {errors.max_usage}
                            </p>
                        )}
                    </div>

                    {/* Status */}
                    <div className="flex items-center justify-between py-3 border-t border-gray-100">
                        <div>
                            <p className="text-sm font-bold text-gray-800">Status Aktif</p>
                            <p className="text-xs text-gray-400 mt-0.5">Kupon nonaktif tidak bisa digunakan student.</p>
                        </div>
                        <button
                            type="button"
                            role="switch"
                            aria-checked={data.status}
                            onClick={() => setData('status', !data.status)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex-shrink-0 ${
                                data.status ? 'bg-indigo-600' : 'bg-gray-200'
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
                            className="flex-1 py-3 rounded-2xl text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            id="btn-save-coupon"
                            className="flex-1 py-3 rounded-2xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 transition-colors"
                        >
                            {processing ? 'Menyimpan...' : editing ? 'Simpan Perubahan' : 'Buat Kupon'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// ─── CouponRow ───────────────────────────────────────────────────────────────

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
        <tr className="group hover:bg-gray-50/60 transition-colors border-b border-gray-100 last:border-0">
            {/* Kode */}
            <td className="px-6 py-4">
                <span className="font-mono text-sm font-black text-gray-900 bg-gray-100 px-3 py-1 rounded-lg tracking-widest">
                    {coupon.code}
                </span>
            </td>

            {/* Kursus */}
            <td className="px-6 py-4">
                {coupon.course ? (
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600">
                        <BookOpen className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="truncate max-w-[140px]">{coupon.course.title}</span>
                    </span>
                ) : (
                    <span className="text-xs text-gray-400 font-medium">Semua kursus</span>
                )}
            </td>

            {/* Diskon */}
            <td className="px-6 py-4 text-center">
                <span className="inline-flex items-center gap-1 text-sm font-extrabold text-orange-500">
                    <Percent className="w-3.5 h-3.5" />
                    {coupon.discount_percent}
                </span>
            </td>

            {/* Kedaluwarsa */}
            <td className="px-6 py-4 text-center">
                <span className={`flex items-center justify-center gap-1 text-xs font-semibold ${coupon.is_expired ? 'text-red-500' : 'text-gray-600'}`}>
                    <Clock className="w-3.5 h-3.5" />
                    {coupon.valid_until_fmt}
                </span>
            </td>

            {/* Pemakaian */}
            <td className="px-6 py-4 text-center">
                <span className={`text-xs font-bold ${coupon.is_quota_full ? 'text-orange-600' : 'text-gray-700'}`}>
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
                                ? 'text-emerald-600 hover:bg-emerald-50'
                                : 'text-gray-400 hover:bg-gray-100'
                        }`}
                    >
                        {coupon.status ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                    </button>

                    {/* Edit */}
                    <button
                        onClick={() => onEdit(coupon)}
                        title="Edit kupon"
                        className="p-2 rounded-xl text-indigo-500 hover:bg-indigo-50 transition-colors"
                    >
                        <Pencil className="w-4 h-4" />
                    </button>

                    {/* Hapus */}
                    <button
                        onClick={handleDelete}
                        disabled={deleting}
                        title="Hapus kupon"
                        className="p-2 rounded-xl text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </td>
        </tr>
    );
}

// ─── Page ────────────────────────────────────────────────────────────────────

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
        // Reload data dari server setelah form tutup
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
            // Update state lokal
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
        <AppLayout>
            <Head title="Kupon Diskon — BelajarKUY" />

            {/* Hero */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-indigo-200 text-sm font-semibold mb-3">
                        <span>Instructor</span>
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-white">Kupon Diskon</span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <Tag className="w-7 h-7 text-white/80" />
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Kupon Diskon</h1>
                        </div>
                        <button
                            onClick={openCreate}
                            id="btn-create-coupon"
                            className="flex items-center gap-2 bg-white text-indigo-700 px-5 py-2.5 rounded-2xl text-sm font-bold hover:bg-indigo-50 transition-colors shadow"
                        >
                            <Plus className="w-4 h-4" />
                            Buat Kupon
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

                {/* Flash */}
                {flash?.success && (
                    <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-2xl px-5 py-4 text-sm font-semibold text-emerald-700">
                        <Check className="w-4 h-4 shrink-0" />
                        {flash.success}
                    </div>
                )}

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                    {[
                        { label: 'Total Kupon', value: stats.total, color: 'text-gray-900' },
                        { label: 'Aktif',       value: stats.active, color: 'text-emerald-600' },
                        { label: 'Kedaluwarsa', value: stats.expired, color: 'text-red-500' },
                    ].map((s) => (
                        <div key={s.label} className="bg-white rounded-3xl border border-gray-100 shadow-sm px-6 py-5 text-center">
                            <p className={`text-3xl font-extrabold ${s.color}`}>{s.value}</p>
                            <p className="text-xs font-semibold text-gray-400 mt-1">{s.label}</p>
                        </div>
                    ))}
                </div>

                {/* Table */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                    {coupons.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4">
                                <Tag className="w-8 h-8 text-indigo-300" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-800 mb-1">Belum ada kupon</h3>
                            <p className="text-sm text-gray-400 mb-6">Buat kupon diskon untuk menarik lebih banyak siswa ke kursusmu.</p>
                            <button
                                onClick={openCreate}
                                className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl text-sm font-bold hover:bg-indigo-500 transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                Buat Kupon Pertama
                            </button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-100">
                                        <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Kode</th>
                                        <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Kursus</th>
                                        <th className="px-6 py-4 text-center text-xs font-black text-gray-500 uppercase tracking-wider">Diskon</th>
                                        <th className="px-6 py-4 text-center text-xs font-black text-gray-500 uppercase tracking-wider">Kedaluwarsa</th>
                                        <th className="px-6 py-4 text-center text-xs font-black text-gray-500 uppercase tracking-wider">Pemakaian</th>
                                        <th className="px-6 py-4 text-center text-xs font-black text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-right text-xs font-black text-gray-500 uppercase tracking-wider">Aksi</th>
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
                <div className="bg-indigo-50 border border-indigo-100 rounded-2xl px-5 py-4 flex items-start gap-3 text-sm text-indigo-700">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
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
        </AppLayout>
    );
}

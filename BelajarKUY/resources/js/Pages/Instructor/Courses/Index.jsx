import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import Badge from '@/Components/Badge';
import EmptyState from '@/Components/EmptyState';
import {
    Plus,
    BookOpen,
    Pencil,
    Trash2,
    Users,
    Eye,
    Send,
    MoreVertical,
    TrendingUp,
    Star,
    ChevronRight,
} from 'lucide-react';

// Layar: manajemen_kursus_instruktur (Konteks_A)
// Route: instructor.courses.index → GET /instructor/courses
export default function Index({ courses = [] }) {
    const [deletingId, setDeletingId] = useState(null);
    const [openMenuId, setOpenMenuId] = useState(null);

    const rupiah = (n) => 'Rp ' + Number(n ?? 0).toLocaleString('id-ID');

    const statusConfig = {
        draft: { label: 'Draft', variant: 'gray' },
        pending_review: { label: 'Menunggu Review', variant: 'amber' },
        active: { label: 'Aktif', variant: 'emerald' },
        inactive: { label: 'Nonaktif', variant: 'red' },
    };

    const handleDelete = (course) => {
        if (!confirm(`Hapus kursus "${course.title}"? Tindakan ini tidak bisa dibatalkan.`)) return;
        setDeletingId(course.id);
        router.delete(route('instructor.courses.destroy', course.id), {
            onFinish: () => setDeletingId(null),
        });
    };

    const handleSubmit = (course) => {
        if (!confirm(`Ajukan kursus "${course.title}" untuk ditinjau admin?`)) return;
        router.post(route('instructor.courses.submit', course.id));
    };

    const stats = {
        total: courses.length,
        active: courses.filter((c) => c.status === 'active').length,
        pending: courses.filter((c) => c.status === 'pending_review').length,
        draft: courses.filter((c) => c.status === 'draft').length,
    };

    return (
        <AppLayout>
            <Head title="Kursus Saya — BelajarKUY Instruktur" />

            {/* ─── Header ─── */}
            <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <p className="text-indigo-200 text-sm font-semibold uppercase tracking-widest mb-1">
                                Panel Instruktur
                            </p>
                            <h1 className="text-3xl font-black tracking-tight">Kursus Saya</h1>
                            <p className="text-indigo-200 mt-1 text-sm font-medium">
                                Kelola dan pantau semua kursus yang kamu buat.
                            </p>
                        </div>
                        <Link
                            href={route('instructor.courses.create')}
                            id="btn-create-course"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-indigo-700 font-bold text-sm shadow-lg shadow-indigo-900/20 hover:bg-indigo-50 hover:-translate-y-0.5 active:translate-y-0 transform transition-all duration-200"
                        >
                            <Plus className="w-4 h-4" />
                            Buat Kursus Baru
                        </Link>
                    </div>

                    {/* Stats pills */}
                    <div className="mt-8 flex flex-wrap gap-3">
                        {[
                            { label: 'Total Kursus', value: stats.total, icon: BookOpen },
                            { label: 'Aktif', value: stats.active, icon: TrendingUp },
                            { label: 'Menunggu Review', value: stats.pending, icon: Eye },
                            { label: 'Draft', value: stats.draft, icon: Pencil },
                        ].map(({ label, value, icon: Icon }) => (
                            <div
                                key={label}
                                className="flex items-center gap-2.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-5 py-3"
                            >
                                <Icon className="w-4 h-4 text-indigo-200" />
                                <span className="text-xs font-semibold text-indigo-100">{label}</span>
                                <span className="text-lg font-black text-white">{value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ─── Content ─── */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {courses.length === 0 ? (
                    <div className="py-16">
                        <EmptyState
                            icon={<BookOpen className="w-10 h-10" />}
                            title="Belum ada kursus"
                            description="Mulai buat kursus pertamamu dan bagikan ilmu ke ribuan pelajar Indonesia."
                        >
                            <Link
                                href={route('instructor.courses.create')}
                                className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-full bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-500 transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                Buat Kursus Pertama
                            </Link>
                        </EmptyState>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-5">
                        {courses.map((course) => {
                            const { label: statusLabel, variant: statusVariant } =
                                statusConfig[course.status] ?? statusConfig.draft;
                            const isMenuOpen = openMenuId === course.id;

                            return (
                                <div
                                    key={course.id}
                                    className="group bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
                                >
                                    <div className="flex flex-col sm:flex-row gap-0">
                                        {/* Thumbnail */}
                                        <div className="sm:w-56 lg:w-64 flex-shrink-0 relative bg-gray-100 aspect-video sm:aspect-auto overflow-hidden rounded-t-3xl sm:rounded-l-3xl sm:rounded-tr-none">
                                            {course.thumbnail ? (
                                                <img
                                                    src={course.thumbnail}
                                                    alt={course.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
                                                    <BookOpen className="w-10 h-10 text-indigo-300" />
                                                </div>
                                            )}
                                            <div className="absolute top-3 left-3">
                                                <Badge variant={statusVariant} size="sm">
                                                    {statusLabel}
                                                </Badge>
                                            </div>
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 p-6 flex flex-col justify-between min-w-0">
                                            <div className="space-y-2">
                                                {course.category && (
                                                    <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest">
                                                        {course.category.name}
                                                    </p>
                                                )}
                                                <h2 className="text-lg font-black text-gray-900 leading-tight line-clamp-2">
                                                    {course.title}
                                                </h2>

                                                <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm font-semibold text-gray-500">
                                                    <span className="flex items-center gap-1.5">
                                                        <Users className="w-4 h-4 text-indigo-400" />
                                                        {course.enrollments_count} pelajar
                                                    </span>
                                                    <span className="text-gray-300">|</span>
                                                    <span className="text-indigo-600 font-bold">
                                                        {course.discount > 0
                                                            ? rupiah(course.discounted_price)
                                                            : course.price == 0
                                                            ? 'Gratis'
                                                            : rupiah(course.price)}
                                                    </span>
                                                    {course.discount > 0 && (
                                                        <span className="text-xs text-gray-400 line-through font-normal">
                                                            {rupiah(course.price)}
                                                        </span>
                                                    )}
                                                    <span className="text-xs text-gray-400 font-medium">
                                                        Dibuat {course.created_at}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex flex-wrap items-center gap-3 mt-5 pt-4 border-t border-gray-50">
                                                <Link
                                                    href={route('instructor.courses.edit', course.id)}
                                                    id={`btn-edit-course-${course.id}`}
                                                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition-colors"
                                                >
                                                    <Pencil className="w-3.5 h-3.5" />
                                                    Edit Kursus
                                                </Link>

                                                {course.status === 'draft' && (
                                                    <button
                                                        onClick={() => handleSubmit(course)}
                                                        id={`btn-submit-course-${course.id}`}
                                                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors"
                                                    >
                                                        <Send className="w-3.5 h-3.5" />
                                                        Kirim untuk Review
                                                    </button>
                                                )}

                                                {course.status === 'active' && (
                                                    <Link
                                                        href={`/courses/${course.slug}`}
                                                        target="_blank"
                                                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-gray-600 bg-gray-50 hover:bg-gray-100 transition-colors"
                                                    >
                                                        <Eye className="w-3.5 h-3.5" />
                                                        Lihat Publik
                                                    </Link>
                                                )}

                                                {['draft', 'inactive'].includes(course.status) && (
                                                    <button
                                                        onClick={() => handleDelete(course)}
                                                        disabled={deletingId === course.id}
                                                        id={`btn-delete-course-${course.id}`}
                                                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-colors disabled:opacity-50"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                        {deletingId === course.id ? 'Menghapus...' : 'Hapus'}
                                                    </button>
                                                )}

                                                <Link
                                                    href={route('instructor.courses.curriculum', course.id)}
                                                    className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-indigo-600 transition-colors"
                                                >
                                                    Kurikulum
                                                    <ChevronRight className="w-4 h-4" />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

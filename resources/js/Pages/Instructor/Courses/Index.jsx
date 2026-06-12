import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import InstructorLayout from '@/Layouts/InstructorLayout';
import Badge from '@/Components/Badge';
import EmptyState from '@/Components/EmptyState';
import ConfirmDialog from '@/Components/ConfirmDialog';

// Layar: manajemen_kursus_instruktur/code.html (Vascha & Quinsha).
// Route: instructor.courses.index → GET /instructor/courses
export default function Index({ courses = [] }) {
    const [deletingId, setDeletingId]   = useState(null);
    const [submitTarget, setSubmitTarget] = useState(null);
    const [agreed, setAgreed]           = useState(false);
    const [submitting, setSubmitting]   = useState(false);
    const [dialog, setDialog]           = useState(null);

    const rupiah = (n) => 'Rp ' + Number(n ?? 0).toLocaleString('id-ID');

    const statusConfig = {
        draft:          { label: 'Draft',             variant: 'gray' },
        pending_review: { label: 'Menunggu Review',   variant: 'warning' },
        active:         { label: 'Aktif',             variant: 'success' },
        inactive:       { label: 'Nonaktif',          variant: 'error' },
    };

    const handleDelete = (course) => {
        setDialog({
            title: 'Hapus Kursus',
            message: `Hapus "${course.title}"? Tindakan ini tidak bisa dibatalkan.`,
            icon: 'delete', variant: 'danger', confirmLabel: 'Hapus',
            onConfirm: () => {
                setDeletingId(course.id);
                router.delete(route('instructor.courses.destroy', course.id), {
                    onFinish: () => setDeletingId(null),
                });
            },
        });
    };

    const openSubmit = (course) => { setAgreed(false); setSubmitTarget(course); };

    const confirmSubmit = () => {
        if (!submitTarget || !agreed) return;
        setSubmitting(true);
        router.post(route('instructor.courses.submit', submitTarget.id), {}, {
            onFinish: () => { setSubmitting(false); setSubmitTarget(null); },
        });
    };

    const stats = [
        { label: 'Total Kursus',       value: courses.length,                                  icon: 'library_books',  accent: 'bg-primary/5 text-primary' },
        { label: 'Aktif',              value: courses.filter(c => c.status === 'active').length, icon: 'trending_up',   accent: 'bg-secondary-container/20 text-secondary' },
        { label: 'Menunggu Review',    value: courses.filter(c => c.status === 'pending_review').length, icon: 'visibility', accent: 'bg-warning/10 text-warning' },
        { label: 'Draft',              value: courses.filter(c => c.status === 'draft').length,  icon: 'edit',          accent: 'bg-surface-container text-on-surface-variant' },
    ];

    return (
        <InstructorLayout>
            <Head title="Kursus Saya — BelajarKUY Instruktur" />

            {/* ─── Page Header ─── */}
            <div className="bg-surface px-margin-mobile md:px-margin-desktop py-lg border-b border-surface-variant">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-md">
                    <div>
                        <p className="font-caption text-caption text-on-surface-variant uppercase tracking-widest mb-xs">Panel Instruktur</p>
                        <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-background">Manajemen Kursus</h1>
                        <p className="font-body-md text-body-md text-on-surface-variant mt-xs">Kelola dan pantau semua kursus yang kamu buat.</p>
                    </div>
                    <div className="flex items-center gap-sm">
                        <Link
                            href={route('instructor.content-guidelines')}
                            id="btn-content-guidelines"
                            className="inline-flex items-center gap-sm font-label-md text-label-md text-primary bg-primary/5 hover:bg-primary/10 border border-primary/20 px-lg py-sm rounded-lg transition-colors active:scale-95"
                        >
                            <span className="material-symbols-outlined text-[20px]">menu_book</span>
                            Ketentuan Konten
                        </Link>
                        <Link
                            href={route('instructor.courses.create')}
                            id="btn-create-course"
                            className="inline-flex items-center gap-sm font-label-md text-label-md bg-secondary-container text-on-secondary-container px-lg py-sm rounded-lg hover:bg-secondary-fixed transition-colors shadow-sm active:scale-95"
                        >
                            <span className="material-symbols-outlined text-[20px]">add</span>
                            Buat Kursus Baru
                        </Link>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop py-lg flex flex-col gap-lg">
                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-md">
                    {stats.map(({ label, value, icon, accent }) => (
                        <div key={label} className="bg-surface rounded-xl p-md border border-surface-variant/50 relative overflow-hidden group" style={{ boxShadow: '0 2px 12px rgba(48,0,51,0.05)' }}>
                            <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full group-hover:scale-110 transition-transform" />
                            <div className={`inline-flex p-2 rounded-lg mb-sm ${accent} relative z-10`}>
                                <span className="material-symbols-outlined">{icon}</span>
                            </div>
                            <p className="font-caption text-caption text-on-surface-variant uppercase tracking-wider">{label}</p>
                            <p className="font-headline-lg-mobile text-headline-lg-mobile text-on-background mt-xs">{value}</p>
                        </div>
                    ))}
                </div>

                {/* Course list */}
                <div className="bg-surface rounded-2xl border border-primary/10 overflow-hidden" style={{ boxShadow: '0 4px 20px rgba(48,0,51,0.05)' }}>
                    <div className="px-lg py-md border-b border-surface-variant flex items-center justify-between bg-surface-bright">
                        <h3 className="font-headline-md text-headline-md text-on-background">Kursus Kamu</h3>
                    </div>

                    {courses.length === 0 ? (
                        <div className="py-xxl">
                            <EmptyState
                                icon="menu_book"
                                title="Belum ada kursus"
                                description="Mulai buat kursus pertamamu dan bagikan ilmu ke ribuan pelajar Indonesia."
                                action={
                                    <Link
                                        href={route('instructor.courses.create')}
                                        className="inline-flex items-center gap-sm font-label-md text-label-md bg-primary text-on-primary px-lg py-sm rounded-lg hover:bg-primary-container transition-colors active:scale-95 mt-md"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">add</span>
                                        Buat Kursus Pertama
                                    </Link>
                                }
                            />
                        </div>
                    ) : (
                        <div className="divide-y divide-surface-variant">
                            {courses.map((course) => {
                                const { label: statusLabel, variant: statusVariant } =
                                    statusConfig[course.status] ?? statusConfig.draft;

                                return (
                                    <div key={course.id} className="group flex flex-col sm:flex-row hover:bg-surface-container-lowest transition-colors">
                                        {/* Thumbnail */}
                                        <div className="sm:w-48 lg:w-56 shrink-0 relative bg-surface-container-low overflow-hidden aspect-video sm:aspect-auto">
                                            {course.thumbnail ? (
                                                <img
                                                    src={course.thumbnail}
                                                    alt={course.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                    onError={(e) => {
                                                        if (!e.currentTarget.dataset.fallback) {
                                                            e.currentTarget.dataset.fallback = '1';
                                                            e.currentTarget.src = 'https://placehold.co/600x340/300033/ffffff?text=BelajarKUY';
                                                        }
                                                    }}
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-primary-fixed/20">
                                                    <span className="material-symbols-outlined text-primary text-[40px]">menu_book</span>
                                                </div>
                                            )}
                                            <div className="absolute top-2 left-2">
                                                <Badge variant={statusVariant} size="sm">{statusLabel}</Badge>
                                            </div>
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 p-lg flex flex-col justify-between min-w-0">
                                            <div>
                                                {course.category && (
                                                    <p className="font-caption text-caption text-primary uppercase tracking-widest mb-xs">{course.category.name}</p>
                                                )}
                                                <h2 className="font-label-md text-body-lg font-bold text-on-background line-clamp-2 group-hover:text-primary transition-colors mb-sm">
                                                    {course.title}
                                                </h2>
                                                <div className="flex flex-wrap items-center gap-x-md gap-y-xs font-caption text-caption text-on-surface-variant">
                                                    <span className="flex items-center gap-1">
                                                        <span className="material-symbols-outlined text-[15px] text-primary">group</span>
                                                        {course.enrollments_count} pelajar
                                                    </span>
                                                    <span>·</span>
                                                    <span className="text-primary font-bold">
                                                        {course.discount > 0
                                                            ? rupiah(course.discounted_price)
                                                            : course.price == 0
                                                            ? 'Gratis'
                                                            : rupiah(course.price)}
                                                    </span>
                                                    {course.discount > 0 && (
                                                        <span className="line-through">{rupiah(course.price)}</span>
                                                    )}
                                                    <span>Dibuat {course.created_at}</span>
                                                </div>
                                            </div>

                                            {/* Umpan balik penolakan admin */}
                                            {course.status === 'inactive' && course.rejection_reason && (
                                                <div className="mt-md rounded-lg border border-error/30 bg-error-container/40 p-md">
                                                    <div className="flex items-center gap-sm mb-xs">
                                                        <span className="material-symbols-outlined text-[18px] text-error">report</span>
                                                        <p className="font-label-md text-label-md text-error font-bold">Kursus ditolak / perlu perbaikan</p>
                                                        {course.reviewed_at && (
                                                            <span className="ml-auto font-caption text-caption text-on-surface-variant">{course.reviewed_at}</span>
                                                        )}
                                                    </div>
                                                    <p className="font-body-md text-body-md text-on-surface mb-xs">
                                                        <span className="font-bold">Alasan: </span>{course.rejection_reason}
                                                    </p>
                                                    {course.rejection_suggestion && (
                                                        <p className="font-body-md text-body-md text-on-surface-variant">
                                                            <span className="font-bold">Saran: </span>{course.rejection_suggestion}
                                                        </p>
                                                    )}
                                                </div>
                                            )}

                                            {/* Actions */}
                                            <div className="flex flex-wrap items-center gap-sm mt-md pt-md border-t border-surface-variant">
                                                <Link
                                                    href={route('instructor.courses.edit', course.id)}
                                                    id={`btn-edit-course-${course.id}`}
                                                    className="inline-flex items-center gap-1 font-label-md text-label-md text-primary bg-primary-fixed/20 hover:bg-primary-fixed/40 px-md py-xs rounded-lg transition-colors"
                                                >
                                                    <span className="material-symbols-outlined text-[16px]">edit</span>
                                                    Edit
                                                </Link>

                                                {['draft', 'inactive'].includes(course.status) && (
                                                    <button
                                                        onClick={() => openSubmit(course)}
                                                        id={`btn-submit-course-${course.id}`}
                                                        className="inline-flex items-center gap-1 font-label-md text-label-md text-success bg-success/10 hover:bg-success/20 px-md py-xs rounded-lg transition-colors"
                                                    >
                                                        <span className="material-symbols-outlined text-[16px]">send</span>
                                                        {course.status === 'inactive' ? 'Ajukan Ulang' : 'Kirim Review'}
                                                    </button>
                                                )}

                                                {course.status === 'active' && (
                                                    <Link
                                                        href={`/courses/${course.slug}`}
                                                        target="_blank"
                                                        className="inline-flex items-center gap-1 font-label-md text-label-md text-on-surface-variant bg-surface-container-low hover:bg-surface-container transition-colors px-md py-xs rounded-lg"
                                                    >
                                                        <span className="material-symbols-outlined text-[16px]">visibility</span>
                                                        Lihat
                                                    </Link>
                                                )}

                                                {['draft', 'inactive'].includes(course.status) && (
                                                    <button
                                                        onClick={() => handleDelete(course)}
                                                        disabled={deletingId === course.id}
                                                        id={`btn-delete-course-${course.id}`}
                                                        className="inline-flex items-center gap-1 font-label-md text-label-md text-error bg-error-container hover:bg-error/20 px-md py-xs rounded-lg transition-colors disabled:opacity-50"
                                                    >
                                                        <span className="material-symbols-outlined text-[16px]">delete</span>
                                                        {deletingId === course.id ? 'Menghapus...' : 'Hapus'}
                                                    </button>
                                                )}

                                                <Link
                                                    href={route('instructor.courses.curriculum', course.id)}
                                                    className="ml-auto inline-flex items-center gap-1 font-caption text-caption text-on-surface-variant hover:text-primary transition-colors"
                                                >
                                                    Kurikulum
                                                    <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
            {/* Panel konfirmasi pengiriman kursus */}
            {submitTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-md" onClick={() => !submitting && setSubmitTarget(null)}>
                    <div className="bg-surface rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <div className="flex items-start gap-md p-lg border-b border-surface-variant">
                            <div className="bg-primary-container text-on-primary-container p-sm rounded-lg shrink-0">
                                <span className="material-symbols-outlined text-[22px]">send</span>
                            </div>
                            <div>
                                <h2 className="font-headline-md text-headline-md text-on-surface">Kirim Kursus untuk Ditinjau</h2>
                                <p className="font-caption text-caption text-on-surface-variant mt-xs">"{submitTarget.title}" akan dikirim ke tim admin BelajarKUY.</p>
                            </div>
                        </div>
                        <div className="p-lg space-y-md">
                            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                                Sebelum dikirim, pastikan seluruh materi Anda <span className="font-bold text-on-surface">sudah sesuai dengan Ketentuan Konten</span> BelajarKUY.
                                Tim admin akan meninjau judul, deskripsi, kurikulum, serta kualitas video/teks setiap materi.
                            </p>
                            <ul className="space-y-xs">
                                {[
                                    'Materi original dan tidak melanggar hak cipta pihak lain.',
                                    'Audio jernih, video minimal 720p, dan teks bebas dari kesalahan berarti.',
                                    'Tidak mengandung konten SARA, kekerasan, atau yang melanggar hukum.',
                                    'Deskripsi & poin "Yang Akan Dipelajari" sudah lengkap dan akurat.',
                                ].map(item => (
                                    <li key={item} className="flex items-start gap-sm font-body-md text-body-md text-on-surface-variant">
                                        <span className="material-symbols-outlined text-[16px] text-success mt-0.5 shrink-0">check_circle</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            <Link href={route('instructor.content-guidelines')}
                                className="inline-flex items-center gap-1 font-label-md text-label-md text-primary hover:underline">
                                <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                                Baca Ketentuan Konten selengkapnya
                            </Link>
                            <label className="flex items-start gap-sm pt-sm cursor-pointer select-none">
                                <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)}
                                    className="mt-0.5 w-4 h-4 accent-primary" />
                                <span className="font-body-md text-body-md text-on-surface">
                                    Saya menyatakan materi kursus ini sudah sesuai dengan Ketentuan Konten dan siap ditinjau admin.
                                </span>
                            </label>
                        </div>
                        <div className="flex justify-end gap-md p-lg border-t border-surface-variant">
                            <button onClick={() => setSubmitTarget(null)} disabled={submitting}
                                className="px-lg py-md rounded-lg font-label-md text-label-md text-on-surface-variant bg-background-subtle hover:bg-surface-variant transition-colors disabled:opacity-50">
                                Batal
                            </button>
                            <button onClick={confirmSubmit} disabled={!agreed || submitting}
                                id="btn-confirm-submit-course"
                                className="px-lg py-md rounded-lg font-label-md text-label-md text-on-primary bg-primary hover:bg-primary-container transition-colors flex items-center gap-sm disabled:opacity-50">
                                <span className="material-symbols-outlined text-[18px]">send</span>
                                {submitting ? 'Mengirim…' : 'Kirim ke Admin'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {dialog && <ConfirmDialog open onClose={() => setDialog(null)} {...dialog} />}
        </InstructorLayout>
    );
}

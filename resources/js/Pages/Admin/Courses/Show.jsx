import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

const STATUS_CONFIG = {
    pending_review: { label: 'Pending Review', cls: 'bg-warning/10 text-warning border-warning/30' },
    active:         { label: 'Aktif',           cls: 'bg-success/10 text-success border-success/30' },
    inactive:       { label: 'Nonaktif',        cls: 'bg-error/10 text-error border-error/30' },
    draft:          { label: 'Draft',           cls: 'bg-surface-variant text-on-surface-variant border-outline-variant' },
};

export default function CourseShow({ course }) {
    const cfg = STATUS_CONFIG[course.status] ?? { label: course.status, cls: 'bg-surface-variant text-on-surface-variant border-outline-variant' };

    function updateStatus(status) {
        if (!confirm(`Yakin mengubah status ke "${status}"?`)) return;
        router.patch(`/admin/courses/${course.id}/status`, { status });
    }

    return (
        <AdminLayout title="Admin Portal">
            <Head title={`${course.title} — BelajarKUY Admin`} />

            <div className="mb-lg">
                <Link href="/admin/courses" className="flex items-center gap-sm text-on-surface-variant hover:text-primary font-label-md text-label-md transition-colors">
                    <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                    Kembali ke Daftar Kursus
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
                {/* Main info */}
                <div className="lg:col-span-2 space-y-gutter">
                    {course.thumbnail_url && (
                        <div className="rounded-2xl overflow-hidden aspect-video bg-surface-container">
                            <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover" />
                        </div>
                    )}

                    <div className="bg-surface rounded-2xl p-lg shadow-[0_8px_30px_rgb(48,0,51,0.04)]">
                        <div className="flex items-start justify-between mb-md gap-md">
                            <h1 className="font-headline-lg text-headline-lg text-on-surface">{course.title}</h1>
                            <span className={`shrink-0 inline-flex items-center px-md py-xs rounded-full font-label-md text-label-md border ${cfg.cls}`}>
                                {cfg.label}
                            </span>
                        </div>
                        {course.description && (
                            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mb-lg">
                                {course.description}
                            </p>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
                            <div className="flex items-center gap-sm p-md bg-background-subtle rounded-lg">
                                <span className="material-symbols-outlined text-[20px] text-primary shrink-0">person</span>
                                <div>
                                    <p className="font-caption text-caption text-on-surface-variant">Instruktur</p>
                                    <p className="font-label-md text-label-md text-on-surface">{course.instructor?.name ?? '—'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-sm p-md bg-background-subtle rounded-lg">
                                <span className="material-symbols-outlined text-[20px] text-secondary shrink-0">label</span>
                                <div>
                                    <p className="font-caption text-caption text-on-surface-variant">Kategori</p>
                                    <p className="font-label-md text-label-md text-on-surface">{course.category?.name ?? '—'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-sm p-md bg-background-subtle rounded-lg">
                                <span className="material-symbols-outlined text-[20px] text-warning shrink-0">menu_book</span>
                                <div>
                                    <p className="font-caption text-caption text-on-surface-variant">Harga</p>
                                    <p className="font-label-md text-label-md text-on-surface">
                                        {Number(course.price) === 0 ? 'Gratis' : `Rp ${Number(course.price).toLocaleString('id-ID')}`}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions panel */}
                <div className="space-y-gutter">
                    <div className="bg-surface rounded-2xl p-lg shadow-[0_8px_30px_rgb(48,0,51,0.04)]">
                        <h2 className="font-headline-md text-headline-md text-on-surface mb-lg">Aksi Moderasi</h2>
                        <div className="space-y-sm">
                            {course.status !== 'active' && (
                                <button
                                    id="btn-setujui-kursus"
                                    onClick={() => updateStatus('active')}
                                    className="w-full bg-primary text-on-primary font-label-md text-label-md px-lg py-md rounded-lg hover:bg-primary-container transition-colors flex items-center justify-center gap-sm"
                                >
                                    <span className="material-symbols-outlined text-[20px]">check_circle</span>
                                    Setujui & Publikasikan
                                </button>
                            )}
                            {course.status !== 'inactive' && (
                                <button
                                    id="btn-tolak-kursus"
                                    onClick={() => updateStatus('inactive')}
                                    className="w-full border border-error text-error font-label-md text-label-md px-lg py-md rounded-lg hover:bg-error-container transition-colors flex items-center justify-center gap-sm"
                                >
                                    <span className="material-symbols-outlined text-[20px]">cancel</span>
                                    Tolak / Nonaktifkan
                                </button>
                            )}
                        </div>
                    </div>

                    {course.instructor && (
                        <div className="bg-surface rounded-2xl p-lg shadow-[0_8px_30px_rgb(48,0,51,0.04)]">
                            <h2 className="font-headline-md text-headline-md text-on-surface mb-md">Info Instruktur</h2>
                            <div className="flex items-center gap-md mb-md">
                                <div className="w-12 h-12 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-base shrink-0">
                                    {course.instructor.name?.charAt(0)?.toUpperCase()}
                                </div>
                                <div>
                                    <p className="font-label-md text-label-md font-bold text-on-surface">{course.instructor.name}</p>
                                    <p className="font-caption text-caption text-on-surface-variant">{course.instructor.email}</p>
                                </div>
                            </div>
                            <Link
                                href={`/admin/instructors/${course.instructor.id}`}
                                className="text-primary font-label-md text-label-md hover:underline text-sm"
                            >
                                Lihat Profil Instruktur →
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}

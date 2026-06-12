import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';

const STATUS_CONFIG = {
    pending_review: { label: 'Pending Review', cls: 'bg-warning/10 text-warning border-warning/30' },
    active:         { label: 'Aktif',           cls: 'bg-success/10 text-success border-success/30' },
    inactive:       { label: 'Nonaktif',        cls: 'bg-error/10 text-error border-error/30' },
    draft:          { label: 'Draft',           cls: 'bg-surface-variant text-on-surface-variant border-outline-variant' },
};

const SOURCE_ICON = {
    youtube: 'smart_display',
    gcs:     'cloud',
    text:    'article',
};

function LectureTypeChip({ sourceType }) {
    const icon  = SOURCE_ICON[sourceType] ?? 'play_circle';
    const label = sourceType === 'youtube' ? 'YouTube' : sourceType === 'gcs' ? 'Video' : 'Teks';
    return (
        <span className="inline-flex items-center gap-xs font-caption text-caption text-on-surface-variant bg-background-subtle px-sm py-0.5 rounded-full">
            <span className="material-symbols-outlined text-[13px]">{icon}</span>
            {label}
        </span>
    );
}

function CurriculumSection({ section, index }) {
    const [open, setOpen] = useState(true);
    const totalMin = section.lectures?.reduce((s, l) => s + (l.duration ?? 0), 0) ?? 0;

    return (
        <div className="border border-outline-variant rounded-xl overflow-hidden">
            <button
                onClick={() => setOpen(o => !o)}
                className="w-full flex items-center justify-between px-lg py-md bg-background-subtle hover:bg-surface-variant/50 transition-colors text-left gap-md"
            >
                <div className="flex items-center gap-sm min-w-0">
                    <span className="shrink-0 w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center font-caption text-[11px] font-bold">
                        {index + 1}
                    </span>
                    <span className="font-label-md text-label-md text-on-surface truncate">{section.title}</span>
                </div>
                <div className="flex items-center gap-md shrink-0">
                    <span className="font-caption text-caption text-on-surface-variant">
                        {section.lectures?.length ?? 0} materi
                        {totalMin > 0 && ` · ${totalMin} mnt`}
                    </span>
                    <span className="material-symbols-outlined text-[18px] text-on-surface-variant transition-transform" style={{ transform: open ? 'rotate(180deg)' : '' }}>
                        expand_more
                    </span>
                </div>
            </button>

            {open && (
                <div className="divide-y divide-outline-variant/40">
                    {(!section.lectures || section.lectures.length === 0) && (
                        <p className="px-lg py-md font-caption text-caption text-on-surface-variant/60 italic">Belum ada materi.</p>
                    )}
                    {section.lectures?.map((lec, li) => (
                        <div key={lec.id} className="flex items-center gap-md px-lg py-sm">
                            <span className="font-caption text-caption text-on-surface-variant/50 w-5 text-right shrink-0">{li + 1}</span>
                            <span className="material-symbols-outlined text-[18px] text-on-surface-variant shrink-0">
                                {SOURCE_ICON[lec.source_type] ?? 'play_circle'}
                            </span>
                            <span className="font-body-md text-body-md text-on-surface flex-1 min-w-0 truncate">{lec.title}</span>
                            <LectureTypeChip sourceType={lec.source_type} />
                            {lec.duration > 0 && (
                                <span className="font-caption text-caption text-on-surface-variant shrink-0">{lec.duration} mnt</span>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function CourseShow({ course }) {
    const cfg = STATUS_CONFIG[course.status] ?? { label: course.status, cls: 'bg-surface-variant text-on-surface-variant border-outline-variant' };

    const totalLectures = course.sections?.reduce((s, sec) => s + (sec.lectures?.length ?? 0), 0) ?? 0;
    const totalMinutes  = course.sections?.reduce((s, sec) =>
        s + (sec.lectures?.reduce((ls, l) => ls + (l.duration ?? 0), 0) ?? 0), 0) ?? 0;

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
                {/* ── Kolom kiri (2/3) ── */}
                <div className="lg:col-span-2 space-y-gutter">

                    {/* Thumbnail */}
                    {course.thumbnail_url && (
                        <div className="rounded-2xl overflow-hidden aspect-video bg-surface-container">
                            <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover" />
                        </div>
                    )}

                    {/* Info dasar */}
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
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-md">
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
                            <div className="flex items-center gap-sm p-md bg-background-subtle rounded-lg">
                                <span className="material-symbols-outlined text-[20px] text-success shrink-0">play_lesson</span>
                                <div>
                                    <p className="font-caption text-caption text-on-surface-variant">Kurikulum</p>
                                    <p className="font-label-md text-label-md text-on-surface">
                                        {totalLectures} materi · {totalMinutes} mnt
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Yang akan dipelajari */}
                    {course.goals?.length > 0 && (
                        <div className="bg-surface rounded-2xl p-lg shadow-[0_8px_30px_rgb(48,0,51,0.04)]">
                            <h2 className="font-headline-md text-headline-md text-on-surface mb-md flex items-center gap-sm">
                                <span className="material-symbols-outlined text-[20px] text-primary">checklist</span>
                                Yang Akan Dipelajari
                            </h2>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-sm">
                                {course.goals.map(g => (
                                    <li key={g.id} className="flex items-start gap-sm">
                                        <span className="material-symbols-outlined text-[16px] text-success mt-0.5 shrink-0">check_circle</span>
                                        <span className="font-body-md text-body-md text-on-surface-variant">{g.goal}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Kurikulum */}
                    <div className="bg-surface rounded-2xl p-lg shadow-[0_8px_30px_rgb(48,0,51,0.04)]">
                        <h2 className="font-headline-md text-headline-md text-on-surface mb-md flex items-center gap-sm">
                            <span className="material-symbols-outlined text-[20px] text-primary">list_alt</span>
                            Kurikulum Kursus
                            <span className="ml-auto font-caption text-caption text-on-surface-variant font-normal">
                                {course.sections?.length ?? 0} seksi · {totalLectures} materi
                            </span>
                        </h2>

                        {(!course.sections || course.sections.length === 0) ? (
                            <div className="flex flex-col items-center py-xl text-on-surface-variant">
                                <span className="material-symbols-outlined text-[40px] mb-sm opacity-40">playlist_remove</span>
                                <p className="font-body-md text-body-md">Belum ada kurikulum yang ditambahkan.</p>
                            </div>
                        ) : (
                            <div className="space-y-sm">
                                {course.sections.map((sec, i) => (
                                    <CurriculumSection key={sec.id} section={sec} index={i} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Kolom kanan (1/3) ── */}
                <div className="space-y-gutter">
                    {/* Aksi moderasi */}
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

                    {/* Info instruktur */}
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

                    {/* Ringkasan kurikulum */}
                    <div className="bg-surface rounded-2xl p-lg shadow-[0_8px_30px_rgb(48,0,51,0.04)]">
                        <h2 className="font-headline-md text-headline-md text-on-surface mb-md">Ringkasan</h2>
                        <ul className="space-y-sm">
                            {[
                                { icon: 'view_list',   label: 'Seksi',   value: course.sections?.length ?? 0 },
                                { icon: 'play_lesson', label: 'Materi',  value: totalLectures },
                                { icon: 'timer',       label: 'Durasi',  value: `${totalMinutes} mnt` },
                                { icon: 'star',        label: 'Goals',   value: course.goals?.length ?? 0 },
                            ].map(({ icon, label, value }) => (
                                <li key={label} className="flex items-center justify-between py-xs border-b border-outline-variant/30 last:border-0">
                                    <span className="flex items-center gap-sm font-body-md text-body-md text-on-surface-variant">
                                        <span className="material-symbols-outlined text-[16px]">{icon}</span>
                                        {label}
                                    </span>
                                    <span className="font-label-md text-label-md text-on-surface">{value}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import ConfirmDialog from '@/Components/ConfirmDialog';

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

function LecturePreview({ courseId, lecture }) {
    const [signedUrl, setSignedUrl] = useState(null);
    const [loading, setLoading]     = useState(false);
    const [error, setError]         = useState(null);

    async function loadGcs() {
        if (signedUrl || loading) return;
        setLoading(true);
        setError(null);
        try {
            const res  = await fetch(`/admin/courses/${courseId}/lectures/${lecture.id}/preview-url`, {
                headers: { Accept: 'application/json' },
            });
            const data = await res.json();
            if (!res.ok || !data.url) throw new Error(data.error || 'Gagal memuat video.');
            setSignedUrl(data.url);
        } catch (e) {
            setError(e.message || 'Gagal memuat video.');
        } finally {
            setLoading(false);
        }
    }

    if (lecture.source_type === 'youtube') {
        if (!lecture.youtube_url) return (
            <p className="font-caption text-caption text-on-surface-variant/60 italic px-lg py-md">URL YouTube tidak tersedia.</p>
        );
        return (
            <div className="px-lg pb-md">
                <div className="aspect-video rounded-lg overflow-hidden bg-black">
                    <iframe src={lecture.youtube_url} title={lecture.title} className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen />
                </div>
            </div>
        );
    }

    if (lecture.source_type === 'gcs') {
        if (!lecture.has_video) return (
            <p className="font-caption text-caption text-on-surface-variant/60 italic px-lg py-md">Video belum diunggah.</p>
        );
        return (
            <div className="px-lg pb-md space-y-sm">
                {!signedUrl ? (
                    <button onClick={loadGcs} disabled={loading}
                        className="inline-flex items-center gap-sm font-label-md text-label-md text-on-primary bg-primary hover:bg-primary-container px-lg py-sm rounded-lg transition-colors disabled:opacity-50">
                        <span className="material-symbols-outlined text-[18px]">{loading ? 'progress_activity' : 'play_circle'}</span>
                        {loading ? 'Memuat video…' : 'Putar Video'}
                    </button>
                ) : (
                    <div className="aspect-video rounded-lg overflow-hidden bg-black">
                        <video src={signedUrl} controls controlsList="nodownload" className="w-full h-full">
                            Browser Anda tidak mendukung pemutaran video.
                        </video>
                    </div>
                )}
                {error && <p className="font-caption text-caption text-error">{error}</p>}
            </div>
        );
    }

    return (
        <div className="px-lg pb-md">
            {lecture.content
                ? <div className="bg-background-subtle rounded-lg p-md font-body-md text-body-md text-on-surface-variant whitespace-pre-wrap leading-relaxed">{lecture.content}</div>
                : <p className="font-caption text-caption text-on-surface-variant/60 italic">Tidak ada konten teks.</p>
            }
        </div>
    );
}

function LectureRow({ courseId, lecture, index }) {
    const [open, setOpen] = useState(false);
    return (
        <div>
            <button onClick={() => setOpen(o => !o)}
                className="w-full flex items-center gap-md px-lg py-sm hover:bg-background-subtle/60 transition-colors text-left">
                <span className="font-caption text-caption text-on-surface-variant/50 w-5 text-right shrink-0">{index + 1}</span>
                <span className="material-symbols-outlined text-[18px] text-on-surface-variant shrink-0">
                    {SOURCE_ICON[lecture.source_type] ?? 'play_circle'}
                </span>
                <span className="font-body-md text-body-md text-on-surface flex-1 min-w-0 truncate">{lecture.title}</span>
                <LectureTypeChip sourceType={lecture.source_type} />
                {lecture.duration > 0 && (
                    <span className="font-caption text-caption text-on-surface-variant shrink-0">{lecture.duration} mnt</span>
                )}
                <span className="material-symbols-outlined text-[18px] text-on-surface-variant shrink-0 transition-transform"
                    style={{ transform: open ? 'rotate(180deg)' : '' }}>expand_more</span>
            </button>
            {open && <LecturePreview courseId={courseId} lecture={lecture} />}
        </div>
    );
}

function CurriculumSection({ courseId, section, index }) {
    const [open, setOpen] = useState(true);
    const totalMin = section.lectures?.reduce((s, l) => s + (l.duration ?? 0), 0) ?? 0;

    return (
        <div className="border border-outline-variant rounded-xl overflow-hidden">
            <button onClick={() => setOpen(o => !o)}
                className="w-full flex items-center justify-between px-lg py-md bg-background-subtle hover:bg-surface-variant/50 transition-colors text-left gap-md">
                <div className="flex items-center gap-sm min-w-0">
                    <span className="shrink-0 w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center font-caption text-[11px] font-bold">
                        {index + 1}
                    </span>
                    <span className="font-label-md text-label-md text-on-surface truncate">{section.title}</span>
                </div>
                <div className="flex items-center gap-md shrink-0">
                    <span className="font-caption text-caption text-on-surface-variant">
                        {section.lectures?.length ?? 0} materi{totalMin > 0 && ` · ${totalMin} mnt`}
                    </span>
                    <span className="material-symbols-outlined text-[18px] text-on-surface-variant transition-transform"
                        style={{ transform: open ? 'rotate(180deg)' : '' }}>expand_more</span>
                </div>
            </button>
            {open && (
                <div className="divide-y divide-outline-variant/40">
                    {(!section.lectures || section.lectures.length === 0) && (
                        <p className="px-lg py-md font-caption text-caption text-on-surface-variant/60 italic">Belum ada materi.</p>
                    )}
                    {section.lectures?.map((lec, li) => (
                        <LectureRow key={lec.id} courseId={courseId} lecture={lec} index={li} />
                    ))}
                </div>
            )}
        </div>
    );
}

function RejectModal({ course, onClose }) {
    const [reason, setReason]         = useState('');
    const [suggestion, setSuggestion] = useState('');
    const [processing, setProcessing] = useState(false);

    function submit() {
        if (!reason.trim()) return;
        setProcessing(true);
        router.patch(`/admin/courses/${course.id}/status`, { status: 'inactive', reason, suggestion }, {
            preserveScroll: true,
            onFinish: () => setProcessing(false),
            onSuccess: onClose,
        });
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-md" onClick={onClose}>
            <div className="bg-surface rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <div className="flex items-start gap-md p-lg border-b border-surface-variant">
                    <div className="bg-error-container text-error p-sm rounded-lg shrink-0">
                        <span className="material-symbols-outlined text-[22px]">block</span>
                    </div>
                    <div>
                        <h2 className="font-headline-md text-headline-md text-on-surface">Tolak Kursus</h2>
                        <p className="font-caption text-caption text-on-surface-variant mt-xs">
                            Alasan & saran ini akan dikirim ke instruktur lewat notifikasi dan email.
                        </p>
                    </div>
                </div>
                <div className="p-lg space-y-lg">
                    <div className="space-y-xs">
                        <label className="font-label-md text-label-md text-on-surface block">
                            Alasan Penolakan <span className="text-error">*</span>
                        </label>
                        <textarea rows={4} value={reason} onChange={e => setReason(e.target.value)}
                            placeholder="Contoh: Kualitas audio pada beberapa video kurang jelas dan deskripsi kursus belum lengkap."
                            className="w-full bg-background-subtle border-2 border-transparent focus:border-primary rounded-lg py-sm px-md font-body-md text-body-md outline-none transition-colors resize-none" />
                        <p className="font-caption text-caption text-on-surface-variant">Jelaskan secara spesifik mengapa kursus belum dapat dipublikasikan.</p>
                    </div>
                    <div className="space-y-xs">
                        <label className="font-label-md text-label-md text-on-surface block">Saran Perbaikan (Opsional)</label>
                        <textarea rows={3} value={suggestion} onChange={e => setSuggestion(e.target.value)}
                            placeholder="Contoh: Rekam ulang materi 2 & 3 dengan mikrofon lebih baik, lalu lengkapi minimal 3 poin 'Yang Akan Dipelajari'."
                            className="w-full bg-background-subtle border-2 border-transparent focus:border-primary rounded-lg py-sm px-md font-body-md text-body-md outline-none transition-colors resize-none" />
                        <p className="font-caption text-caption text-on-surface-variant">Langkah konkret agar instruktur bisa memperbaiki dan mengajukan ulang.</p>
                    </div>
                </div>
                <div className="flex justify-end gap-md p-lg border-t border-surface-variant">
                    <button onClick={onClose}
                        className="px-lg py-md rounded-lg font-label-md text-label-md text-on-surface-variant bg-background-subtle hover:bg-surface-variant transition-colors">
                        Batal
                    </button>
                    <button onClick={submit} disabled={!reason.trim() || processing}
                        className="px-lg py-md rounded-lg font-label-md text-label-md text-on-error bg-error hover:bg-error/90 transition-colors flex items-center gap-sm disabled:opacity-50">
                        <span className="material-symbols-outlined text-[18px]">send</span>
                        {processing ? 'Mengirim…' : 'Tolak & Kirim Alasan'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function CourseShow({ course }) {
    const cfg = STATUS_CONFIG[course.status] ?? { label: course.status, cls: 'bg-surface-variant text-on-surface-variant border-outline-variant' };
    const [rejectOpen, setRejectOpen]   = useState(false);
    const [approveOpen, setApproveOpen] = useState(false);

    const totalLectures = course.sections?.reduce((s, sec) => s + (sec.lectures?.length ?? 0), 0) ?? 0;
    const totalMinutes  = course.sections?.reduce((s, sec) =>
        s + (sec.lectures?.reduce((ls, l) => ls + (l.duration ?? 0), 0) ?? 0), 0) ?? 0;

    function approve() {
        router.patch(`/admin/courses/${course.id}/status`, { status: 'active' }, { preserveScroll: true });
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
                            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mb-lg">{course.description}</p>
                        )}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-md">
                            {[
                                { icon: 'person',      color: 'text-primary',   label: 'Instruktur', value: course.instructor?.name ?? '—' },
                                { icon: 'label',       color: 'text-secondary', label: 'Kategori',   value: course.category?.name ?? '—' },
                                { icon: 'menu_book',   color: 'text-warning',   label: 'Harga',      value: Number(course.price) === 0 ? 'Gratis' : `Rp ${Number(course.price).toLocaleString('id-ID')}` },
                                { icon: 'play_lesson', color: 'text-success',   label: 'Kurikulum',  value: `${totalLectures} materi · ${totalMinutes} mnt` },
                            ].map(({ icon, color, label, value }) => (
                                <div key={label} className="flex items-center gap-sm p-md bg-background-subtle rounded-lg">
                                    <span className={`material-symbols-outlined text-[20px] ${color} shrink-0`}>{icon}</span>
                                    <div>
                                        <p className="font-caption text-caption text-on-surface-variant">{label}</p>
                                        <p className="font-label-md text-label-md text-on-surface">{value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

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

                    <div className="bg-surface rounded-2xl p-lg shadow-[0_8px_30px_rgb(48,0,51,0.04)]">
                        <h2 className="font-headline-md text-headline-md text-on-surface mb-xs flex items-center gap-sm">
                            <span className="material-symbols-outlined text-[20px] text-primary">list_alt</span>
                            Kurikulum Kursus
                            <span className="ml-auto font-caption text-caption text-on-surface-variant font-normal">
                                {course.sections?.length ?? 0} seksi · {totalLectures} materi
                            </span>
                        </h2>
                        <p className="font-caption text-caption text-on-surface-variant mb-md">
                            Klik tiap materi untuk memutar video / membaca konten sebelum mengambil keputusan.
                        </p>
                        {(!course.sections || course.sections.length === 0) ? (
                            <div className="flex flex-col items-center py-xl text-on-surface-variant">
                                <span className="material-symbols-outlined text-[40px] mb-sm opacity-40">playlist_remove</span>
                                <p className="font-body-md text-body-md">Belum ada kurikulum yang ditambahkan.</p>
                            </div>
                        ) : (
                            <div className="space-y-sm">
                                {course.sections.map((sec, i) => (
                                    <CurriculumSection key={sec.id} courseId={course.id} section={sec} index={i} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-gutter">
                    <div className="bg-surface rounded-2xl p-lg shadow-[0_8px_30px_rgb(48,0,51,0.04)]">
                        <h2 className="font-headline-md text-headline-md text-on-surface mb-lg">Aksi Moderasi</h2>
                        <div className="space-y-sm">
                            {course.status !== 'active' && (
                                <button id="btn-setujui-kursus" onClick={() => setApproveOpen(true)}
                                    className="w-full bg-primary text-on-primary font-label-md text-label-md px-lg py-md rounded-lg hover:bg-primary-container transition-colors flex items-center justify-center gap-sm">
                                    <span className="material-symbols-outlined text-[20px]">check_circle</span>
                                    Setujui & Publikasikan
                                </button>
                            )}
                            {course.status !== 'inactive' && (
                                <button id="btn-tolak-kursus" onClick={() => setRejectOpen(true)}
                                    className="w-full border border-error text-error font-label-md text-label-md px-lg py-md rounded-lg hover:bg-error-container transition-colors flex items-center justify-center gap-sm">
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
                            <Link href={`/admin/instructors/${course.instructor.id}`}
                                className="text-primary font-label-md text-label-md hover:underline text-sm">
                                Lihat Profil Instruktur →
                            </Link>
                        </div>
                    )}

                    <div className="bg-surface rounded-2xl p-lg shadow-[0_8px_30px_rgb(48,0,51,0.04)]">
                        <h2 className="font-headline-md text-headline-md text-on-surface mb-md">Ringkasan</h2>
                        <ul className="space-y-sm">
                            {[
                                { icon: 'view_list',   label: 'Seksi',  value: course.sections?.length ?? 0 },
                                { icon: 'play_lesson', label: 'Materi', value: totalLectures },
                                { icon: 'timer',       label: 'Durasi', value: `${totalMinutes} mnt` },
                                { icon: 'star',        label: 'Goals',  value: course.goals?.length ?? 0 },
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

            {rejectOpen && <RejectModal course={course} onClose={() => setRejectOpen(false)} />}
            <ConfirmDialog
                open={approveOpen}
                onClose={() => setApproveOpen(false)}
                onConfirm={approve}
                title="Setujui & Publikasikan"
                message={`Kursus "${course.title}" akan dipublikasikan ke platform.`}
                icon="check_circle"
                variant="primary"
                confirmLabel="Setujui"
            />
        </AdminLayout>
    );
}

import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import InstructorLayout from '@/Layouts/InstructorLayout';

const SOURCE_TYPE_OPTIONS = [
    { value: 'youtube', icon: 'smart_display', label: 'YouTube',      color: 'text-red-500' },
    { value: 'gcs',     icon: 'cloud_upload',  label: 'Upload Video', color: 'text-primary' },
];

function VideoSourceSelector({ value, onChange }) {
    return (
        <div className="space-y-1">
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Sumber Video</p>
            <div className="flex flex-wrap gap-2">
                {SOURCE_TYPE_OPTIONS.map(opt => (
                    <button key={opt.value} type="button" onClick={() => onChange(opt.value)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                            value === opt.value
                                ? 'bg-primary text-on-primary border-primary shadow-sm'
                                : 'bg-surface text-on-surface-variant border-outline-variant hover:border-primary/50 hover:text-primary'
                        }`}
                    >
                        <span className="material-symbols-outlined text-[14px]">{opt.icon}</span>
                        {opt.label}
                    </button>
                ))}
            </div>
        </div>
    );
}

// Layar: edit_kurikulum_kursus (Vascha & Quinsha)
// Route: GET /instructor/courses/{course}/curriculum → instructor.courses.curriculum
export default function Curriculum({ course, sections: initialSections = [] }) {
    const [sections, setSections] = useState(initialSections);
    const [openSections, setOpenSections] = useState(() =>
        Object.fromEntries(initialSections.map((s) => [s.id, true]))
    );
    const [flash, setFlash] = useState(null);

    const reloadPage = () => router.reload({ only: ['sections'] });

    const showFlash = (type, message) => {
        setFlash({ type, message });
        setTimeout(() => setFlash(null), 3500);
    };

    useEffect(() => {
        setSections(initialSections);
        setOpenSections((prev) => {
            const next = { ...prev };
            initialSections.forEach((s) => {
                if (!(s.id in next)) next[s.id] = true;
            });
            return next;
        });
    }, [initialSections]);

    const toggleSection = (id) =>
        setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));

    const totalLectures = sections.reduce((acc, s) => acc + s.lectures.length, 0);
    const totalDuration = sections.reduce(
        (acc, s) => acc + s.lectures.reduce((a, l) => a + (l.duration || 0), 0),
        0
    );

    const handleSubmitForReview = () => {
        if (!confirm('Ajukan kursus ini untuk ditinjau admin? Pastikan kurikulum sudah lengkap.')) return;
        router.post(route('instructor.courses.submit', course.id), {}, {
            onSuccess: () => showFlash('success', 'Kursus berhasil diajukan untuk ditinjau admin.'),
        });
    };

    return (
        <InstructorLayout>
            <Head title={`Kurikulum: ${course.title} — BelajarKUY`} />

            {/* ─── Flash Message ─── */}
            {flash && (
                <div
                    className={`fixed top-24 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl text-sm font-semibold transition-all animate-slide-in ${
                        flash.type === 'success'
                            ? 'bg-success/10 border border-success/20 text-success'
                            : 'bg-error-container border border-error/20 text-on-error-container'
                    }`}
                >
                    <span
                        className={`material-symbols-outlined text-[18px] flex-shrink-0 ${flash.type === 'success' ? 'text-success' : 'text-error'}`}
                        style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                        {flash.type === 'success' ? 'check_circle' : 'error'}
                    </span>
                    {flash.message}
                </div>
            )}

            {/* ─── Page Header ─── */}
            <div className="bg-surface px-margin-mobile md:px-margin-desktop py-lg border-b border-surface-variant sticky top-[60px] md:top-0 z-30">
                <div className="max-w-5xl mx-auto">
                    <div className="flex items-center gap-xs font-caption text-caption text-on-surface-variant mb-sm">
                        <Link href={route('instructor.courses.index')} className="flex items-center gap-xs hover:text-primary transition-colors">
                            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                            Kursus Saya
                        </Link>
                        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                        <Link href={route('instructor.courses.edit', course.id)} className="hover:text-primary transition-colors truncate max-w-[160px]">
                            {course.title}
                        </Link>
                        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                        <span className="text-on-surface">Kurikulum</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-sm">
                        <div>
                            <p className="font-caption text-caption text-on-surface-variant uppercase tracking-widest mb-xs">Panel Instruktur</p>
                            <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-background">Susun Kurikulum</h1>
                            <p className="font-body-md text-body-md text-on-surface-variant mt-xs">
                                {sections.length} section · {totalLectures} lecture · {formatDuration(totalDuration)}
                            </p>
                        </div>
                        <div className="flex items-center gap-xs">
                            <Link
                                href={route('instructor.courses.edit', course.id)}
                                className="px-md py-xs rounded-lg font-caption text-caption text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors"
                            >
                                Informasi Dasar
                            </Link>
                            <span className="px-md py-xs rounded-lg font-caption text-caption bg-primary text-on-primary font-bold">
                                Kurikulum
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ─── Main Content ─── */}
            <div className="max-w-5xl mx-auto px-margin-mobile md:px-margin-desktop py-lg">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">

                    {/* ══════ LEFT: Curriculum Builder ══════ */}
                    <div className="lg:col-span-2 space-y-md">
                        {sections.length === 0 && (
                            <div className="bg-surface border-2 border-dashed border-outline-variant rounded-3xl p-12 text-center">
                                <div className="w-14 h-14 bg-primary-fixed/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <span className="material-symbols-outlined text-[28px] text-primary">layers</span>
                                </div>
                                <p className="font-bold text-on-surface mb-1">Belum ada section</p>
                                <p className="text-sm text-on-surface-variant">
                                    Mulai dengan menambahkan section pertama di bawah ini.
                                </p>
                            </div>
                        )}

                        <div className="space-y-3">
                            {sections.map((section, sIdx) => (
                                <SectionCard
                                    key={section.id}
                                    section={section}
                                    sectionIndex={sIdx}
                                    courseId={course.id}
                                    isOpen={openSections[section.id] ?? true}
                                    onToggle={() => toggleSection(section.id)}
                                    onReload={reloadPage}
                                    onFlash={showFlash}
                                />
                            ))}
                        </div>

                        <AddSectionForm courseId={course.id} onSuccess={reloadPage} onFlash={showFlash} />
                    </div>

                    {/* ══════ RIGHT: Sidebar ══════ */}
                    <div className="space-y-5">
                        <StatusBadge status={course.status} />

                        <div className="bg-surface rounded-3xl border border-surface-variant shadow-sm p-6 space-y-4">
                            <h3 className="text-xs font-black text-on-surface-variant uppercase tracking-widest">Ringkasan</h3>
                            <StatRow icon="layers" iconColor="text-primary" label="Section" value={sections.length} />
                            <StatRow icon="ondemand_video" iconColor="text-primary" label="Lecture" value={totalLectures} />
                            <StatRow icon="schedule" iconColor="text-secondary-container" label="Durasi total" value={formatDuration(totalDuration)} />
                        </div>

                        <div className="bg-surface rounded-3xl border border-surface-variant shadow-sm p-6 space-y-3">
                            {course.status === 'draft' && (
                                <button
                                    type="button"
                                    id="btn-submit-review"
                                    onClick={handleSubmitForReview}
                                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-bold text-on-primary bg-primary hover:bg-primary-container hover:-translate-y-0.5 active:translate-y-0 transform transition-all duration-200"
                                    style={{ boxShadow: '0 4px 16px rgba(48,0,51,0.20)' }}
                                >
                                    <span className="material-symbols-outlined text-[18px]">send</span>
                                    Ajukan ke Review
                                </button>
                            )}
                            {course.status === 'pending_review' && (
                                <div className="flex items-center gap-3 py-3 px-4 rounded-2xl bg-warning/10 border border-warning/20">
                                    <span className="material-symbols-outlined text-[18px] text-warning flex-shrink-0">info</span>
                                    <p className="text-xs font-semibold text-warning">Kursus sedang ditinjau admin.</p>
                                </div>
                            )}
                            {course.status === 'active' && (
                                <div className="flex items-center gap-3 py-3 px-4 rounded-2xl bg-success/10 border border-success/20">
                                    <span className="material-symbols-outlined text-[18px] text-success flex-shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                                    <p className="text-xs font-semibold text-success">Kursus sudah aktif & dipublikasikan.</p>
                                </div>
                            )}
                            <Link
                                href={route('instructor.courses.edit', course.id)}
                                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold text-on-surface-variant hover:text-on-surface bg-surface-container hover:bg-surface-container-high transition-colors"
                            >
                                <span className="material-symbols-outlined text-[18px]">menu_book</span>
                                Informasi Dasar
                            </Link>
                            <Link
                                href={route('instructor.courses.index')}
                                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
                            >
                                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                                Kembali ke Daftar
                            </Link>
                        </div>

                        <div className="bg-primary-fixed/10 border border-primary/10 rounded-3xl p-5 space-y-2">
                            <p className="text-xs font-black text-primary uppercase tracking-wider">💡 Tips</p>
                            <ul className="text-xs text-primary/80 font-medium space-y-1.5 leading-relaxed">
                                <li>• Gunakan YouTube untuk video pendek/publik.</li>
                                <li>• Upload Video (GCS) untuk konten eksklusif privat.</li>
                                <li>• Isi durasi dalam satuan menit.</li>
                                <li>• Susun section dari materi dasar ke lanjut.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes slide-in {
                    from { opacity: 0; transform: translateX(20px); }
                    to   { opacity: 1; transform: translateX(0); }
                }
                .animate-slide-in { animation: slide-in 0.25s ease-out; }
            `}</style>
        </InstructorLayout>
    );
}

/* ─────────────────────────────────────────────────────────────
   SectionCard
───────────────────────────────────────────────────────────── */
function SectionCard({ section, sectionIndex, courseId, isOpen, onToggle, onReload, onFlash }) {
    const [editingTitle, setEditingTitle] = useState(false);
    const [titleValue, setTitleValue] = useState(section.title);
    const [addingLecture, setAddingLecture] = useState(false);

    const handleUpdateTitle = () => {
        if (!titleValue.trim()) return;
        router.patch(
            route('instructor.courses.sections.update', { course: courseId, section: section.id }),
            { title: titleValue },
            {
                onSuccess: () => { setEditingTitle(false); onReload(); onFlash('success', 'Section diperbarui.'); },
                onError: () => onFlash('error', 'Gagal memperbarui section.'),
            }
        );
    };

    const handleDeleteSection = () => {
        if (!confirm(`Hapus section "${section.title}" beserta semua lecture-nya?`)) return;
        router.delete(
            route('instructor.courses.sections.destroy', { course: courseId, section: section.id }),
            {
                onSuccess: () => { onReload(); onFlash('success', 'Section dihapus.'); },
                onError: () => onFlash('error', 'Gagal menghapus section.'),
            }
        );
    };

    return (
        <div className="bg-surface rounded-2xl border border-surface-variant shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-surface-variant/50">
                <span className="material-symbols-outlined text-[18px] text-outline-variant flex-shrink-0 cursor-grab">drag_indicator</span>
                <span className="flex-shrink-0 w-6 h-6 rounded-lg bg-primary-fixed/20 text-primary text-xs font-black flex items-center justify-center">
                    {sectionIndex + 1}
                </span>

                {editingTitle ? (
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                        <input
                            autoFocus
                            value={titleValue}
                            onChange={(e) => setTitleValue(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleUpdateTitle();
                                if (e.key === 'Escape') { setEditingTitle(false); setTitleValue(section.title); }
                            }}
                            className="flex-1 min-w-0 border border-primary/30 rounded-xl px-3 py-1.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                        <button onClick={handleUpdateTitle} className="p-1.5 rounded-lg bg-primary text-on-primary hover:bg-primary-container transition-colors">
                            <span className="material-symbols-outlined text-[14px]">check</span>
                        </button>
                        <button onClick={() => { setEditingTitle(false); setTitleValue(section.title); }} className="p-1.5 rounded-lg bg-surface-container text-on-surface-variant hover:bg-surface-container-high transition-colors">
                            <span className="material-symbols-outlined text-[14px]">close</span>
                        </button>
                    </div>
                ) : (
                    <button
                        className="flex-1 text-left text-sm font-bold text-on-surface hover:text-primary transition-colors truncate"
                        onClick={onToggle}
                    >
                        {section.title}
                    </button>
                )}

                <div className="flex items-center gap-1 flex-shrink-0 ml-auto">
                    <span className="text-xs text-on-surface-variant font-medium mr-2">{section.lectures.length} lecture</span>
                    <button onClick={() => setEditingTitle(true)} className="p-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-primary-fixed/20 transition-colors" title="Edit judul section">
                        <span className="material-symbols-outlined text-[14px]">edit</span>
                    </button>
                    <button onClick={handleDeleteSection} className="p-1.5 rounded-lg text-on-surface-variant hover:text-error hover:bg-error-container transition-colors" title="Hapus section">
                        <span className="material-symbols-outlined text-[14px]">delete</span>
                    </button>
                    <button onClick={onToggle} className="p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors">
                        <span className="material-symbols-outlined text-[18px] transition-transform duration-200" style={{ display: 'inline-block', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>expand_more</span>
                    </button>
                </div>
            </div>

            {isOpen && (
                <div className="divide-y divide-surface-variant/50">
                    {section.lectures.length === 0 && !addingLecture && (
                        <div className="px-8 py-5 text-center">
                            <p className="text-xs text-on-surface-variant font-medium">Belum ada lecture. Tambahkan di bawah ini.</p>
                        </div>
                    )}
                    {section.lectures.map((lecture, lIdx) => (
                        <LectureRow
                            key={lecture.id}
                            lecture={lecture}
                            lectureIndex={lIdx}
                            courseId={courseId}
                            sectionId={section.id}
                            onReload={onReload}
                            onFlash={onFlash}
                        />
                    ))}
                    {addingLecture ? (
                        <AddLectureForm
                            courseId={courseId}
                            sectionId={section.id}
                            onSuccess={() => { setAddingLecture(false); onReload(); onFlash('success', 'Lecture ditambahkan.'); }}
                            onCancel={() => setAddingLecture(false)}
                            onFlash={onFlash}
                        />
                    ) : (
                        <div className="px-5 py-3">
                            <button
                                onClick={() => setAddingLecture(true)}
                                className="flex items-center gap-2 text-xs font-bold text-primary hover:text-primary-container transition-colors py-1 px-2 rounded-lg hover:bg-primary-fixed/20"
                            >
                                <span className="material-symbols-outlined text-[14px]">add</span>
                                Tambah Lecture
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

/* ─────────────────────────────────────────────────────────────
   LectureRow
───────────────────────────────────────────────────────────── */
function VideoPreviewModal({ url, title, onClose }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
            <div className="bg-surface rounded-2xl overflow-hidden w-full max-w-3xl shadow-2xl" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between px-lg py-md border-b border-outline-variant">
                    <p className="font-label-md text-label-md text-on-surface truncate">{title}</p>
                    <button onClick={onClose} className="p-1 rounded-lg hover:bg-surface-variant transition-colors">
                        <span className="material-symbols-outlined text-[20px]">close</span>
                    </button>
                </div>
                <video src={url} controls autoPlay className="w-full aspect-video bg-black" />
            </div>
        </div>
    );
}

function LectureRow({ lecture, lectureIndex, courseId, sectionId, onReload, onFlash }) {
    const [editing, setEditing] = useState(false);
    const currentSourceType = lecture.source_type ?? 'youtube';
    const [editSourceType, setEditSourceType] = useState(currentSourceType);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [previewLoading, setPreviewLoading] = useState(false);

    async function handlePreview() {
        setPreviewLoading(true);
        try {
            const res = await fetch(route('instructor.courses.lectures.preview-url', { course: courseId, lecture: lecture.id }));
            const json = await res.json();
            if (json.url) setPreviewUrl(json.url);
            else onFlash('error', json.error ?? 'Gagal memuat video.');
        } catch {
            onFlash('error', 'Gagal memuat video.');
        } finally {
            setPreviewLoading(false);
        }
    }

    const { data, setData, patch, processing, errors, progress } = useForm({
        title:        lecture.title,
        source_type:  currentSourceType,
        youtube_url:  currentSourceType === 'youtube' ? (lecture.video_path ?? '') : '',
        video_file:   null,
        content:      lecture.content ?? '',
        duration:     parseInt(lecture.duration) || 0,
    });

    const handleEditSourceType = (type) => {
        setEditSourceType(type);
        setData(d => ({ ...d, source_type: type, youtube_url: '', video_file: null }));
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        patch(
            route('instructor.courses.sections.lectures.update', {
                course: courseId,
                section: sectionId,
                lecture: lecture.id,
            }),
            {
                forceFormData: true,
                onSuccess: () => { setEditing(false); onReload(); onFlash('success', 'Lecture diperbarui.'); },
                onError: () => onFlash('error', 'Gagal memperbarui lecture.'),
            }
        );
    };

    const handleDelete = () => {
        if (!confirm(`Hapus lecture "${lecture.title}"?`)) return;
        router.delete(
            route('instructor.courses.sections.lectures.destroy', { course: courseId, section: sectionId, lecture: lecture.id }),
            {
                onSuccess: () => { onReload(); onFlash('success', 'Lecture dihapus.'); },
                onError: () => onFlash('error', 'Gagal menghapus lecture.'),
            }
        );
    };

    if (editing) {
        return (
            <form onSubmit={handleUpdate} className="px-5 py-4 bg-primary-fixed/5 space-y-3">
                {/* Judul */}
                <div className="space-y-1">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Judul Lecture *</label>
                    <input autoFocus type="text" value={data.title}
                        onChange={(e) => setData('title', e.target.value)}
                        className="w-full border border-outline-variant rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/50 bg-surface"
                    />
                    {errors.title && <p className="text-xs text-error">{errors.title}</p>}
                </div>

                {/* Video Source Selector */}
                <VideoSourceSelector value={editSourceType} onChange={handleEditSourceType} />

                {/* Input berdasarkan tipe */}
                {editSourceType === 'youtube' && (
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider flex items-center gap-1">
                            <span className="material-symbols-outlined text-[12px]">smart_display</span> URL YouTube
                        </label>
                        <input type="text" value={data.youtube_url} onChange={(e) => setData('youtube_url', e.target.value)}
                            placeholder="https://youtu.be/... atau https://youtube.com/watch?v=..."
                            className="w-full border border-outline-variant rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/50 bg-surface"
                        />
                        {errors.youtube_url && <p className="text-xs text-error">{errors.youtube_url}</p>}
                        {currentSourceType === 'youtube' && lecture.video_path && !data.youtube_url && (
                            <p className="text-xs text-on-surface-variant">Kosongkan untuk mempertahankan video saat ini.</p>
                        )}
                    </div>
                )}
                {editSourceType === 'gcs' && (
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider flex items-center gap-1">
                            <span className="material-symbols-outlined text-[12px]">cloud_upload</span> Upload Video
                            <span className="font-normal text-on-surface-variant normal-case tracking-normal ml-1">(mp4, webm, mov — maks 500MB)</span>
                        </label>
                        {currentSourceType === 'gcs' && lecture.has_video && (
                            <div className="flex items-center gap-2 mb-1">
                                <p className="text-xs text-success flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[12px]">check_circle</span>
                                    Video tersimpan — upload baru untuk mengganti
                                </p>
                                <button type="button" onClick={handlePreview} disabled={previewLoading}
                                    className="text-xs text-primary underline hover:no-underline disabled:opacity-50">
                                    {previewLoading ? 'Memuat...' : 'Preview'}
                                </button>
                            </div>
                        )}
                        <input type="file" accept="video/mp4,video/webm,video/ogg,video/quicktime"
                            onChange={async (e) => {
                                const file = e.target.files[0] ?? null;
                                setData('video_file', file);
                                if (file) {
                                    const mins = await detectVideoDuration(file);
                                    if (mins > 0) setData(d => ({ ...d, video_file: file, duration: mins }));
                                }
                            }}
                            className="w-full border border-outline-variant rounded-xl px-4 py-2.5 text-sm font-semibold bg-surface file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-primary/10 file:text-primary cursor-pointer"
                        />
                        {/* Progress bar upload */}
                        {processing && progress && (
                            <div className="mt-2">
                                <div className="flex justify-between text-xs text-on-surface-variant mb-1">
                                    <span>Mengupload...</span>
                                    <span>{progress.percentage}%</span>
                                </div>
                                <div className="h-2 bg-surface-container rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full transition-all"
                                        style={{ width: `${progress.percentage}%`, background: 'linear-gradient(90deg, #300033, #ffb145)' }}
                                    />
                                </div>
                            </div>
                        )}
                        {errors.video_file && <p className="text-xs text-error">{errors.video_file}</p>}
                    </div>
                )}

                {/* Durasi + Catatan */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider flex items-center gap-1">
                            <span className="material-symbols-outlined text-[12px]">schedule</span> Durasi (menit)
                            {editSourceType === 'gcs' && <span className="font-normal normal-case tracking-normal text-on-surface-variant ml-1">— terdeteksi otomatis dari video</span>}
                        </label>
                        <input type="number" min={0} value={data.duration}
                            onChange={(e) => setData('duration', Number(e.target.value))}
                            className="w-full border border-outline-variant rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/50 bg-surface"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider flex items-center gap-1">
                            <span className="material-symbols-outlined text-[12px]">description</span> Catatan
                        </label>
                        <input type="text" value={data.content}
                            onChange={(e) => setData('content', e.target.value)}
                            placeholder="Opsional"
                            className="w-full border border-outline-variant rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/50 bg-surface"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                    <button type="submit" disabled={processing}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-on-primary bg-primary hover:bg-primary-container disabled:opacity-60 transition-colors"
                    >
                        <span className="material-symbols-outlined text-[14px]">check</span>
                        {processing ? 'Menyimpan...' : 'Simpan'}
                    </button>
                    <button type="button" onClick={() => setEditing(false)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-on-surface-variant bg-surface-container hover:bg-surface-container-high transition-colors"
                    >
                        <span className="material-symbols-outlined text-[14px]">close</span>
                        Batal
                    </button>
                </div>
            </form>
        );
    }

    return (
        <>
        <div className="flex items-center gap-3 px-5 py-3.5 hover:bg-surface-container-lowest transition-colors group">
            <span className="material-symbols-outlined text-[14px] text-outline-variant group-hover:text-on-surface-variant flex-shrink-0 cursor-grab">drag_indicator</span>
            <span className="flex-shrink-0 w-5 h-5 rounded-md bg-primary-fixed/20 text-primary text-xs font-black flex items-center justify-center">
                {lectureIndex + 1}
            </span>
            <span className="material-symbols-outlined text-[14px] text-outline-variant flex-shrink-0">ondemand_video</span>

            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-on-surface truncate">{lecture.title}</p>
                <p className="text-xs text-on-surface-variant font-medium flex items-center gap-2 mt-0.5">
                    {currentSourceType === 'youtube' && lecture.has_video && (
                        <span className="flex items-center gap-1 text-red-500/70">
                            <span className="material-symbols-outlined text-[12px]">smart_display</span> YouTube
                        </span>
                    )}
                    {currentSourceType === 'gcs' && lecture.has_video && (
                        <span className="flex items-center gap-1 text-primary/70">
                            <span className="material-symbols-outlined text-[12px]">cloud_upload</span> GCS
                        </span>
                    )}
                    {!lecture.has_video && (
                        <span className="text-on-surface-variant/50 italic">Belum ada video</span>
                    )}
                    {lecture.duration > 0 && (
                        <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[12px]">schedule</span> {lecture.duration} mnt
                        </span>
                    )}
                </p>
            </div>

            <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                {currentSourceType === 'gcs' && lecture.has_video && (
                    <button onClick={handlePreview} disabled={previewLoading} className="p-1.5 rounded-lg text-on-surface-variant hover:text-success hover:bg-success/10 transition-colors" title="Preview video">
                        <span className="material-symbols-outlined text-[14px]">{previewLoading ? 'hourglass_empty' : 'play_circle'}</span>
                    </button>
                )}
                <button onClick={() => setEditing(true)} className="p-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-primary-fixed/20 transition-colors" title="Edit lecture">
                    <span className="material-symbols-outlined text-[14px]">edit</span>
                </button>
                <button onClick={handleDelete} className="p-1.5 rounded-lg text-on-surface-variant hover:text-error hover:bg-error-container transition-colors" title="Hapus lecture">
                    <span className="material-symbols-outlined text-[14px]">delete</span>
                </button>
            </div>
        </div>
        {previewUrl && <VideoPreviewModal url={previewUrl} title={lecture.title} onClose={() => setPreviewUrl(null)} />}
        </>
    );
}

/* ─────────────────────────────────────────────────────────────
   AddLectureForm
───────────────────────────────────────────────────────────── */
function AddLectureForm({ courseId, sectionId, onSuccess, onCancel, onFlash }) {
    const [sourceType, setSourceType] = useState('youtube');
    const { data, setData, post, processing, errors, reset, progress } = useForm({
        title:        '',
        source_type:  'youtube',
        youtube_url:  '',
        video_file:   null,
        content:      '',
        duration:     0,
    });

    const handleSourceType = (type) => {
        setSourceType(type);
        setData(d => ({ ...d, source_type: type, youtube_url: '', video_file: null }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('instructor.courses.sections.lectures.store', { course: courseId, section: sectionId }), {
            forceFormData: true,
            onSuccess: () => { reset(); setSourceType('youtube'); onSuccess(); },
            onError: () => onFlash('error', 'Gagal menambahkan lecture.'),
        });
    };

    return (
        <form onSubmit={handleSubmit} className="px-5 py-4 bg-primary-fixed/10 border-t border-primary/10 space-y-3">
            <p className="text-xs font-black text-primary uppercase tracking-wider">+ Lecture Baru</p>

            <div>
                <input autoFocus type="text" value={data.title}
                    onChange={(e) => setData('title', e.target.value)}
                    placeholder="Judul lecture *"
                    className="w-full border border-outline-variant rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/50 bg-surface"
                />
                {errors.title && <p className="text-xs text-error mt-1">{errors.title}</p>}
            </div>

            <VideoSourceSelector value={sourceType} onChange={handleSourceType} />

            {sourceType === 'youtube' && (
                <div>
                    <input type="text" value={data.youtube_url} onChange={(e) => setData('youtube_url', e.target.value)}
                        placeholder="https://youtu.be/... atau https://youtube.com/watch?v=..."
                        className="w-full border border-outline-variant rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/50 bg-surface"
                    />
                    {errors.youtube_url && <p className="text-xs text-error mt-1">{errors.youtube_url}</p>}
                </div>
            )}
            {sourceType === 'gcs' && (
                <div>
                    <input type="file" accept="video/mp4,video/webm,video/ogg,video/quicktime"
                        onChange={async (e) => {
                            const file = e.target.files[0] ?? null;
                            setData('video_file', file);
                            if (file) {
                                const mins = await detectVideoDuration(file);
                                if (mins > 0) setData(d => ({ ...d, video_file: file, duration: mins }));
                            }
                        }}
                        className="w-full border border-outline-variant rounded-xl px-4 py-2.5 text-sm font-semibold bg-surface file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-primary/10 file:text-primary cursor-pointer"
                    />
                    <p className="text-xs text-on-surface-variant mt-1">Format: mp4, webm, mov — Maks. 500 MB</p>
                    {/* Progress bar upload */}
                    {processing && progress && (
                        <div className="mt-2">
                            <div className="flex justify-between text-xs text-on-surface-variant mb-1">
                                <span>Mengupload...</span>
                                <span>{progress.percentage}%</span>
                            </div>
                            <div className="h-2 bg-surface-container rounded-full overflow-hidden">
                                <div
                                    className="h-full rounded-full transition-all"
                                    style={{ width: `${progress.percentage}%`, background: 'linear-gradient(90deg, #300033, #ffb145)' }}
                                />
                            </div>
                        </div>
                    )}
                    {errors.video_file && <p className="text-xs text-error mt-1">{errors.video_file}</p>}
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="relative">
                    <input type="number" min={0} value={data.duration}
                        onChange={(e) => setData('duration', Number(e.target.value))}
                        placeholder="Durasi"
                        className="w-full border border-outline-variant rounded-xl px-4 py-2.5 pr-12 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/50 bg-surface"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-on-surface-variant font-semibold">mnt</span>
                </div>
                <input type="text" value={data.content} onChange={(e) => setData('content', e.target.value)}
                    placeholder="Catatan singkat (opsional)"
                    className="w-full border border-outline-variant rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/50 bg-surface"
                />
            </div>

            <div className="flex items-center gap-2">
                <button type="submit" disabled={processing}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-on-primary bg-primary hover:bg-primary-container disabled:opacity-60 transition-colors"
                >
                    <span className="material-symbols-outlined text-[14px]">add</span>
                    {processing ? 'Menambahkan...' : 'Tambah Lecture'}
                </button>
                <button type="button" onClick={onCancel}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-on-surface-variant bg-surface-container hover:bg-surface-container-high transition-colors"
                >
                    <span className="material-symbols-outlined text-[14px]">close</span>
                    Batal
                </button>
            </div>
        </form>
    );
}

/* ─────────────────────────────────────────────────────────────
   AddSectionForm
───────────────────────────────────────────────────────────── */
function AddSectionForm({ courseId, onSuccess, onFlash }) {
    const [open, setOpen] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({ title: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(
            route('instructor.courses.sections.store', { course: courseId }),
            {
                onSuccess: () => { reset(); setOpen(false); onSuccess(); onFlash('success', 'Section ditambahkan.'); },
                onError: () => onFlash('error', 'Gagal menambahkan section.'),
            }
        );
    };

    if (!open) {
        return (
            <button
                onClick={() => setOpen(true)}
                id="btn-add-section"
                className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-sm font-bold text-primary border-2 border-dashed border-primary/20 hover:border-primary/50 hover:bg-primary-fixed/10 transition-all"
            >
                <span className="material-symbols-outlined text-[18px]">add</span>
                Tambah Section Baru
            </button>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="bg-surface rounded-2xl border-2 border-primary/20 shadow-sm p-5 space-y-3">
            <p className="text-xs font-black text-primary uppercase tracking-wider">+ Section Baru</p>
            <div>
                <input
                    autoFocus
                    type="text"
                    value={data.title}
                    onChange={(e) => setData('title', e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Escape') { reset(); setOpen(false); } }}
                    placeholder="Judul section, contoh: Pengenalan React *"
                    className="w-full border border-outline-variant rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/50 bg-surface"
                />
                {errors.title && (
                    <p className="text-xs text-error flex items-center gap-1 mt-1">
                        <span className="material-symbols-outlined text-[14px]">error</span> {errors.title}
                    </p>
                )}
            </div>
            <div className="flex items-center gap-2">
                <button type="submit" disabled={processing}
                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-bold text-on-primary bg-primary hover:bg-primary-container disabled:opacity-60 transition-colors"
                >
                    <span className="material-symbols-outlined text-[18px]">add</span>
                    {processing ? 'Menambahkan...' : 'Tambah Section'}
                </button>
                <button type="button" onClick={() => { reset(); setOpen(false); }}
                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-bold text-on-surface-variant bg-surface-container hover:bg-surface-container-high transition-colors"
                >
                    <span className="material-symbols-outlined text-[18px]">close</span>
                    Batal
                </button>
            </div>
        </form>
    );
}

/* ─────────────────────────────────────────────────────────────
   Helper Components
───────────────────────────────────────────────────────────── */
function StatRow({ icon, iconColor, label, value }) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-on-surface-variant font-medium">
                <span className={`material-symbols-outlined text-[18px] ${iconColor}`}>{icon}</span>
                {label}
            </div>
            <span className="text-sm font-black text-on-background">{value}</span>
        </div>
    );
}

function StatusBadge({ status }) {
    const config = {
        draft:          { label: 'Draft', bg: 'bg-surface-container', text: 'text-on-surface-variant', border: 'border-outline-variant', dot: 'bg-outline' },
        pending_review: { label: 'Menunggu Review', bg: 'bg-warning/10', text: 'text-warning', border: 'border-warning/20', dot: 'bg-warning' },
        active:         { label: 'Aktif & Dipublikasikan', bg: 'bg-success/10', text: 'text-success', border: 'border-success/20', dot: 'bg-success' },
        inactive:       { label: 'Nonaktif', bg: 'bg-error-container', text: 'text-on-error-container', border: 'border-error/20', dot: 'bg-error' },
    };
    const { label, bg, text, border, dot } = config[status] ?? config.draft;

    return (
        <div className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl border ${bg} ${border}`}>
            <span className={`w-2 h-2 rounded-full ${dot} flex-shrink-0`} />
            <div>
                <p className="text-xs font-black text-on-surface-variant uppercase tracking-widest">Status Kursus</p>
                <p className={`text-sm font-bold ${text}`}>{label}</p>
            </div>
        </div>
    );
}

function formatDuration(totalMinutes) {
    if (!totalMinutes) return '0 mnt';
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    if (h === 0) return `${m} mnt`;
    if (m === 0) return `${h} jam`;
    return `${h} jam ${m} mnt`;
}

function detectVideoDuration(file) {
    return new Promise((resolve) => {
        const url = URL.createObjectURL(file);
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.onloadedmetadata = () => {
            URL.revokeObjectURL(url);
            const secs = video.duration;
            resolve(isFinite(secs) && secs > 0 ? Math.max(1, Math.round(secs / 60)) : 0);
        };
        video.onerror = () => { URL.revokeObjectURL(url); resolve(0); };
        video.src = url;
        video.load();
    });
}

import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import {
    ArrowLeft,
    ChevronRight,
    ChevronDown,
    Plus,
    Trash2,
    Pencil,
    Check,
    X,
    GripVertical,
    Video,
    BookOpen,
    Clock,
    Link2,
    FileText,
    Send,
    AlertCircle,
    CheckCircle2,
    ListOrdered,
    Layers,
} from 'lucide-react';

// Layar: edit_kurikulum_kursus (Konteks_A: Indigo→Purple, Plus Jakarta Sans)
// Route: GET /instructor/courses/{course}/curriculum → instructor.courses.curriculum
export default function Curriculum({ course, sections: initialSections = [] }) {
    const [sections, setSections] = useState(initialSections);
    const [openSections, setOpenSections] = useState(() =>
        Object.fromEntries(initialSections.map((s) => [s.id, true]))
    );
    const [flash, setFlash] = useState(null);

    // ─── Reload sections dari server via Inertia visit ───
    const reloadPage = () => router.reload({ only: ['sections'] });

    // ─── Flash helper ───
    const showFlash = (type, message) => {
        setFlash({ type, message });
        setTimeout(() => setFlash(null), 3500);
    };

    // Keep sections in sync with Inertia props after reload
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
        <AppLayout>
            <Head title={`Kurikulum: ${course.title} — BelajarKUY`} />

            {/* ─── Flash Message ─── */}
            {flash && (
                <div
                    className={`fixed top-24 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl text-sm font-semibold transition-all animate-slide-in ${
                        flash.type === 'success'
                            ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                            : 'bg-red-50 border border-red-200 text-red-800'
                    }`}
                >
                    {flash.type === 'success' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    ) : (
                        <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                    )}
                    {flash.message}
                </div>
            )}

            {/* ─── Top bar ─── */}
            <div className="bg-white border-b border-gray-100 sticky top-20 z-30">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-500">
                        <Link
                            href={route('instructor.courses.index')}
                            className="flex items-center gap-1 hover:text-indigo-600 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Kursus Saya
                        </Link>
                        <ChevronRight className="w-4 h-4 text-gray-300" />
                        <Link
                            href={route('instructor.courses.edit', course.id)}
                            className="hover:text-indigo-600 transition-colors truncate max-w-[160px]"
                        >
                            {course.title}
                        </Link>
                        <ChevronRight className="w-4 h-4 text-gray-300" />
                        <span className="text-gray-900">Kurikulum</span>
                    </div>

                    {/* Tabs */}
                    <div className="flex items-center gap-3">
                        <Link
                            href={route('instructor.courses.edit', course.id)}
                            className="px-3 py-1 rounded-full text-xs font-bold text-gray-500 hover:text-indigo-600 hover:bg-gray-50 transition-colors"
                        >
                            Informasi Dasar
                        </Link>
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-600 text-white">
                            Kurikulum
                        </span>
                    </div>
                </div>
            </div>

            {/* ─── Main Content ─── */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* ══════ LEFT: Curriculum Builder ══════ */}
                    <div className="lg:col-span-2 space-y-4">

                        {/* Header */}
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-xl font-black text-gray-900">Susun Kurikulum</h1>
                                <p className="text-sm text-gray-500 mt-0.5">
                                    {sections.length} section · {totalLectures} lecture ·{' '}
                                    {formatDuration(totalDuration)}
                                </p>
                            </div>
                        </div>

                        {/* Empty state */}
                        {sections.length === 0 && (
                            <div className="bg-white border-2 border-dashed border-gray-200 rounded-3xl p-12 text-center">
                                <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <Layers className="w-7 h-7 text-indigo-400" />
                                </div>
                                <p className="font-bold text-gray-700 mb-1">Belum ada section</p>
                                <p className="text-sm text-gray-400">
                                    Mulai dengan menambahkan section pertama di bawah ini.
                                </p>
                            </div>
                        )}

                        {/* Section list */}
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

                        {/* Add Section Form */}
                        <AddSectionForm courseId={course.id} onSuccess={reloadPage} onFlash={showFlash} />
                    </div>

                    {/* ══════ RIGHT: Sidebar ══════ */}
                    <div className="space-y-5">

                        {/* Status kursus */}
                        <StatusBadge status={course.status} />

                        {/* Stats */}
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
                            <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest">
                                Ringkasan
                            </h3>
                            <StatRow icon={<Layers className="w-4 h-4 text-indigo-500" />} label="Section" value={sections.length} />
                            <StatRow icon={<Video className="w-4 h-4 text-purple-500" />} label="Lecture" value={totalLectures} />
                            <StatRow icon={<Clock className="w-4 h-4 text-amber-500" />} label="Durasi total" value={formatDuration(totalDuration)} />
                        </div>

                        {/* Actions */}
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-3">
                            {/* Submit for review */}
                            {course.status === 'draft' && (
                                <button
                                    type="button"
                                    id="btn-submit-review"
                                    onClick={handleSubmitForReview}
                                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 hover:-translate-y-0.5 active:translate-y-0 transform transition-all duration-200 shadow-md shadow-indigo-600/20"
                                >
                                    <Send className="w-4 h-4" />
                                    Ajukan ke Review
                                </button>
                            )}

                            {course.status === 'pending_review' && (
                                <div className="flex items-center gap-3 py-3 px-4 rounded-2xl bg-amber-50 border border-amber-200">
                                    <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                                    <p className="text-xs font-semibold text-amber-700">
                                        Kursus sedang ditinjau admin.
                                    </p>
                                </div>
                            )}

                            {course.status === 'active' && (
                                <div className="flex items-center gap-3 py-3 px-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                    <p className="text-xs font-semibold text-emerald-700">
                                        Kursus sudah aktif & dipublikasikan.
                                    </p>
                                </div>
                            )}

                            <Link
                                href={route('instructor.courses.edit', course.id)}
                                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 transition-colors"
                            >
                                <BookOpen className="w-4 h-4" />
                                Informasi Dasar
                            </Link>

                            <Link
                                href={route('instructor.courses.index')}
                                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Kembali ke Daftar
                            </Link>
                        </div>

                        {/* Tips */}
                        <div className="bg-indigo-50 border border-indigo-100 rounded-3xl p-5 space-y-2">
                            <p className="text-xs font-black text-indigo-700 uppercase tracking-wider">💡 Tips</p>
                            <ul className="text-xs text-indigo-700/80 font-medium space-y-1.5 leading-relaxed">
                                <li>• Gunakan URL YouTube untuk video lecture.</li>
                                <li>• Isi durasi dalam satuan menit.</li>
                                <li>• Susun section dari materi dasar ke lanjut.</li>
                                <li>• Selesaikan kurikulum sebelum ajukan review.</li>
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
        </AppLayout>
    );
}

/* ─────────────────────────────────────────────────────────────
   SectionCard — kartu section dengan accordion lecture list
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
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Section header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-50">
                {/* Grip (visual only — full drag-drop skipped for simplicity) */}
                <GripVertical className="w-4 h-4 text-gray-300 flex-shrink-0 cursor-grab" />

                {/* Section number badge */}
                <span className="flex-shrink-0 w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 text-xs font-black flex items-center justify-center">
                    {sectionIndex + 1}
                </span>

                {/* Title — editable inline */}
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
                            className="flex-1 min-w-0 border border-indigo-300 rounded-xl px-3 py-1.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <button
                            onClick={handleUpdateTitle}
                            className="p-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 transition-colors"
                        >
                            <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                            onClick={() => { setEditingTitle(false); setTitleValue(section.title); }}
                            className="p-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    </div>
                ) : (
                    <button
                        className="flex-1 text-left text-sm font-bold text-gray-800 hover:text-indigo-600 transition-colors truncate"
                        onClick={onToggle}
                    >
                        {section.title}
                    </button>
                )}

                {/* Action buttons */}
                <div className="flex items-center gap-1 flex-shrink-0 ml-auto">
                    <span className="text-xs text-gray-400 font-medium mr-2">
                        {section.lectures.length} lecture
                    </span>
                    <button
                        onClick={() => setEditingTitle(true)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                        title="Edit judul section"
                    >
                        <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                        onClick={handleDeleteSection}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Hapus section"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                        onClick={onToggle}
                        className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"
                    >
                        <ChevronDown
                            className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                        />
                    </button>
                </div>
            </div>

            {/* Lecture list (accordion) */}
            {isOpen && (
                <div className="divide-y divide-gray-50">
                    {section.lectures.length === 0 && !addingLecture && (
                        <div className="px-8 py-5 text-center">
                            <p className="text-xs text-gray-400 font-medium">
                                Belum ada lecture. Tambahkan di bawah ini.
                            </p>
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

                    {/* Add lecture form */}
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
                                className="flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors py-1 px-2 rounded-lg hover:bg-indigo-50"
                            >
                                <Plus className="w-3.5 h-3.5" />
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
   LectureRow — baris lecture dengan inline edit
───────────────────────────────────────────────────────────── */
function LectureRow({ lecture, lectureIndex, courseId, sectionId, onReload, onFlash }) {
    const [editing, setEditing] = useState(false);
    const { data, setData, patch, processing, errors } = useForm({
        title:    lecture.title,
        url:      lecture.url ?? '',
        content:  lecture.content ?? '',
        duration: lecture.duration ?? 0,
    });

    const handleUpdate = (e) => {
        e.preventDefault();
        patch(
            route('instructor.courses.sections.lectures.update', {
                course: courseId,
                section: sectionId,
                lecture: lecture.id,
            }),
            {
                onSuccess: () => { setEditing(false); onReload(); onFlash('success', 'Lecture diperbarui.'); },
                onError: () => onFlash('error', 'Gagal memperbarui lecture.'),
            }
        );
    };

    const handleDelete = () => {
        if (!confirm(`Hapus lecture "${lecture.title}"?`)) return;
        router.delete(
            route('instructor.courses.sections.lectures.destroy', {
                course: courseId,
                section: sectionId,
                lecture: lecture.id,
            }),
            {
                onSuccess: () => { onReload(); onFlash('success', 'Lecture dihapus.'); },
                onError: () => onFlash('error', 'Gagal menghapus lecture.'),
            }
        );
    };

    if (editing) {
        return (
            <form onSubmit={handleUpdate} className="px-5 py-4 bg-indigo-50/40 space-y-3">
                {/* Title */}
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Judul Lecture *
                    </label>
                    <input
                        autoFocus
                        type="text"
                        value={data.title}
                        onChange={(e) => setData('title', e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                    />
                    {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}
                </div>

                {/* URL + Duration */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-600 uppercase tracking-wider flex items-center gap-1">
                            <Link2 className="w-3 h-3" /> URL YouTube
                        </label>
                        <input
                            type="url"
                            value={data.url}
                            onChange={(e) => setData('url', e.target.value)}
                            placeholder="https://youtu.be/..."
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                        />
                        {errors.url && <p className="text-xs text-red-500">{errors.url}</p>}
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-600 uppercase tracking-wider flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Durasi (menit)
                        </label>
                        <input
                            type="number"
                            min={0}
                            value={data.duration}
                            onChange={(e) => setData('duration', Number(e.target.value))}
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                        />
                    </div>
                </div>

                {/* Content / notes */}
                <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-600 uppercase tracking-wider flex items-center gap-1">
                        <FileText className="w-3 h-3" /> Catatan / Deskripsi
                    </label>
                    <textarea
                        rows={2}
                        value={data.content}
                        onChange={(e) => setData('content', e.target.value)}
                        placeholder="Tulis catatan singkat tentang lecture ini..."
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white resize-none"
                    />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-1">
                    <button
                        type="submit"
                        disabled={processing}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 transition-colors"
                    >
                        <Check className="w-3.5 h-3.5" />
                        {processing ? 'Menyimpan...' : 'Simpan'}
                    </button>
                    <button
                        type="button"
                        onClick={() => setEditing(false)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                        <X className="w-3.5 h-3.5" />
                        Batal
                    </button>
                </div>
            </form>
        );
    }

    return (
        <div className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50/60 transition-colors group">
            <GripVertical className="w-3.5 h-3.5 text-gray-200 group-hover:text-gray-400 flex-shrink-0 cursor-grab" />

            {/* Lecture number */}
            <span className="flex-shrink-0 w-5 h-5 rounded-md bg-purple-100 text-purple-700 text-xs font-black flex items-center justify-center">
                {lectureIndex + 1}
            </span>

            {/* Icon */}
            <Video className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />

            {/* Title + meta */}
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">{lecture.title}</p>
                {(lecture.url || lecture.duration > 0) && (
                    <p className="text-xs text-gray-400 font-medium flex items-center gap-2 mt-0.5">
                        {lecture.url && (
                            <span className="flex items-center gap-1">
                                <Link2 className="w-3 h-3" /> YouTube
                            </span>
                        )}
                        {lecture.duration > 0 && (
                            <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {lecture.duration} mnt
                            </span>
                        )}
                    </p>
                )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={() => setEditing(true)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                    title="Edit lecture"
                >
                    <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                    onClick={handleDelete}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Hapus lecture"
                >
                    <Trash2 className="w-3.5 h-3.5" />
                </button>
            </div>
        </div>
    );
}

/* ─────────────────────────────────────────────────────────────
   AddLectureForm — form tambah lecture baru di dalam section
───────────────────────────────────────────────────────────── */
function AddLectureForm({ courseId, sectionId, onSuccess, onCancel, onFlash }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        title:    '',
        url:      '',
        content:  '',
        duration: 0,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(
            route('instructor.courses.sections.lectures.store', {
                course: courseId,
                section: sectionId,
            }),
            {
                onSuccess: () => { reset(); onSuccess(); },
                onError: () => onFlash('error', 'Gagal menambahkan lecture.'),
            }
        );
    };

    return (
        <form onSubmit={handleSubmit} className="px-5 py-4 bg-purple-50/40 border-t border-purple-100 space-y-3">
            <p className="text-xs font-black text-purple-700 uppercase tracking-wider">+ Lecture Baru</p>

            {/* Title */}
            <div>
                <input
                    autoFocus
                    type="text"
                    value={data.title}
                    onChange={(e) => setData('title', e.target.value)}
                    placeholder="Judul lecture *"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                />
                {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
            </div>

            {/* URL + Duration */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                    type="url"
                    value={data.url}
                    onChange={(e) => setData('url', e.target.value)}
                    placeholder="URL YouTube (opsional)"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                />
                <div className="relative">
                    <input
                        type="number"
                        min={0}
                        value={data.duration}
                        onChange={(e) => setData('duration', Number(e.target.value))}
                        placeholder="Durasi"
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 pr-12 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-semibold">
                        mnt
                    </span>
                </div>
            </div>

            {/* Content */}
            <textarea
                rows={2}
                value={data.content}
                onChange={(e) => setData('content', e.target.value)}
                placeholder="Catatan / deskripsi singkat (opsional)"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white resize-none"
            />

            <div className="flex items-center gap-2">
                <button
                    type="submit"
                    disabled={processing}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 disabled:opacity-60 transition-colors"
                >
                    <Plus className="w-3.5 h-3.5" />
                    {processing ? 'Menambahkan...' : 'Tambah Lecture'}
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                    <X className="w-3.5 h-3.5" />
                    Batal
                </button>
            </div>
        </form>
    );
}

/* ─────────────────────────────────────────────────────────────
   AddSectionForm — form tambah section baru
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
                className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-sm font-bold text-indigo-600 border-2 border-dashed border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50/50 transition-all"
            >
                <Plus className="w-4 h-4" />
                Tambah Section Baru
            </button>
        );
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl border-2 border-indigo-200 shadow-sm p-5 space-y-3"
        >
            <p className="text-xs font-black text-indigo-700 uppercase tracking-wider">+ Section Baru</p>
            <div>
                <input
                    autoFocus
                    type="text"
                    value={data.title}
                    onChange={(e) => setData('title', e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Escape') { reset(); setOpen(false); } }}
                    placeholder="Judul section, contoh: Pengenalan React *"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {errors.title && (
                    <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3.5 h-3.5" /> {errors.title}
                    </p>
                )}
            </div>
            <div className="flex items-center gap-2">
                <button
                    type="submit"
                    disabled={processing}
                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    {processing ? 'Menambahkan...' : 'Tambah Section'}
                </button>
                <button
                    type="button"
                    onClick={() => { reset(); setOpen(false); }}
                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                    <X className="w-4 h-4" />
                    Batal
                </button>
            </div>
        </form>
    );
}

/* ─────────────────────────────────────────────────────────────
   Helper Components
───────────────────────────────────────────────────────────── */
function StatRow({ icon, label, value }) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                {icon}
                {label}
            </div>
            <span className="text-sm font-black text-gray-800">{value}</span>
        </div>
    );
}

function StatusBadge({ status }) {
    const config = {
        draft:          { label: 'Draft', bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200', dot: 'bg-gray-400' },
        pending_review: { label: 'Menunggu Review', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-400' },
        active:         { label: 'Aktif & Dipublikasikan', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-400' },
        inactive:       { label: 'Nonaktif', bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', dot: 'bg-red-400' },
    };
    const { label, bg, text, border, dot } = config[status] ?? config.draft;

    return (
        <div className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl border ${bg} ${border}`}>
            <span className={`w-2 h-2 rounded-full ${dot} flex-shrink-0`} />
            <div>
                <p className="text-xs font-black text-gray-500 uppercase tracking-widest">Status Kursus</p>
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

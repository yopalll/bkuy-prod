import { Head, Link, router } from '@inertiajs/react';
import { useState, useCallback } from 'react';

// ─── Helpers ────────────────────────────────────────────────────────────────

/**
 * Ekstrak YouTube video ID dari berbagai format URL.
 * Returns null jika bukan YouTube link.
 */
function extractYoutubeId(url) {
    if (!url) return null;
    const match = url.match(
        /(?:youtu\.be\/|youtube\.com\/(?:embed\/|watch\?v=|v\/|shorts\/))([^\s&?]+)/
    );
    return match ? match[1] : null;
}

// ─── Sub-components ─────────────────────────────────────────────────────────

/**
 * Player area kiri: video embed + tombol tandai selesai + navigasi.
 */
function VideoArea({
    lecture,
    courseSlug,
    isCompleted,
    onMarkComplete,
    markingComplete,
    progress,
    prevLectureId,
    nextLectureId,
    allCompleted,
}) {
    const youtubeId = extractYoutubeId(lecture.url);

    return (
        <div className="flex flex-col h-full">
            {/* ─── Video ─── */}
            <div className="w-full aspect-video bg-black flex-shrink-0 overflow-hidden">
                {youtubeId ? (
                    <iframe
                        key={youtubeId}
                        src={`https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1`}
                        title={lecture.title}
                        className="w-full h-full"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-md text-on-primary/60">
                        <span
                            className="material-symbols-outlined text-[80px]"
                            style={{ fontVariationSettings: "'FILL' 0" }}
                        >
                            play_circle
                        </span>
                        <p className="font-label-md text-label-md">
                            {lecture.url ? 'Format video tidak didukung.' : 'Belum ada video untuk materi ini.'}
                        </p>
                    </div>
                )}
            </div>

            {/* ─── Info + Actions ─── */}
            <div
                className="flex-1 overflow-y-auto p-lg md:p-xl"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
                {/* Lecture title */}
                <h1 className="font-headline-md text-headline-md text-on-surface mb-xs leading-snug">
                    {lecture.title}
                </h1>
                {lecture.duration && (
                    <p className="font-caption text-caption text-on-surface-variant mb-lg flex items-center gap-xs">
                        <span className="material-symbols-outlined text-[16px]">schedule</span>
                        {lecture.duration}
                    </p>
                )}

                {/* ─── Progress bar mini ─── */}
                <div className="mb-lg">
                    <div className="flex justify-between items-center mb-xs">
                        <span className="font-caption text-caption text-on-surface-variant">
                            Progress kursus
                        </span>
                        <span
                            className="font-label-md text-label-md font-bold"
                            style={{ color: '#300033' }}
                        >
                            {progress}%
                        </span>
                    </div>
                    <div className="h-2 bg-surface-container-high rounded-full overflow-hidden">
                        <div
                            className="h-full rounded-full transition-all duration-700"
                            style={{
                                width: `${progress}%`,
                                background: 'linear-gradient(90deg, #300033 0%, #ffb145 100%)',
                            }}
                        />
                    </div>
                </div>

                {/* ─── Tombol Tandai Selesai ─── */}
                {allCompleted ? (
                    <div className="w-full py-3 px-lg rounded-xl font-label-md text-label-md flex items-center justify-center gap-sm bg-success/10 text-success border border-success/30 mb-lg">
                        <span
                            className="material-symbols-outlined text-[20px]"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                            verified
                        </span>
                        Selamat! Kamu sudah menyelesaikan kursus ini 🎉
                    </div>
                ) : isCompleted ? (
                    <div className="w-full py-3 px-lg rounded-xl font-label-md text-label-md flex items-center justify-center gap-sm bg-success/10 text-success border border-success/30 mb-lg">
                        <span
                            className="material-symbols-outlined text-[20px]"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                            check_circle
                        </span>
                        Materi ini sudah selesai ✅
                    </div>
                ) : (
                    <button
                        id="btn-tandai-selesai"
                        onClick={onMarkComplete}
                        disabled={markingComplete}
                        className="w-full py-3 px-lg rounded-xl font-label-md text-label-md flex items-center justify-center gap-sm transition-all duration-200 active:scale-95 mb-lg disabled:opacity-60 disabled:cursor-not-allowed"
                        style={{
                            background: markingComplete
                                ? 'rgba(48,0,51,0.5)'
                                : 'linear-gradient(135deg, #300033 0%, #5a1a5e 100%)',
                            color: '#ffffff',
                            boxShadow: markingComplete ? 'none' : '0 4px 15px rgba(48,0,51,0.30)',
                        }}
                    >
                        {markingComplete ? (
                            <>
                                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                Menyimpan...
                            </>
                        ) : (
                            <>
                                <span
                                    className="material-symbols-outlined text-[20px]"
                                    style={{ fontVariationSettings: "'FILL' 0" }}
                                >
                                    task_alt
                                </span>
                                ✓ Tandai Selesai
                            </>
                        )}
                    </button>
                )}

                {/* ─── Navigasi prev/next ─── */}
                <div className="flex gap-md">
                    {prevLectureId ? (
                        <Link
                            id="btn-prev-lecture"
                            href={`/student/learn/${courseSlug}/${prevLectureId}`}
                            className="flex-1 py-2 px-md rounded-lg border border-outline-variant/50 font-label-md text-label-md text-on-surface-variant hover:bg-surface-container-low transition-colors flex items-center justify-center gap-xs"
                        >
                            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                            Sebelumnya
                        </Link>
                    ) : (
                        <div className="flex-1" />
                    )}
                    {nextLectureId ? (
                        <Link
                            id="btn-next-lecture"
                            href={`/student/learn/${courseSlug}/${nextLectureId}`}
                            className="flex-1 py-2 px-md rounded-lg font-label-md text-label-md text-on-primary flex items-center justify-center gap-xs transition-all hover:opacity-90"
                            style={{ background: 'linear-gradient(135deg, #300033 0%, #5a1a5e 100%)' }}
                        >
                            Berikutnya
                            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                        </Link>
                    ) : (
                        <div className="flex-1" />
                    )}
                </div>

                {/* ─── Deskripsi materi ─── */}
                {lecture.content && (
                    <div className="mt-xl pt-xl border-t border-outline-variant/30">
                        <h2 className="font-label-md text-label-md text-on-surface font-bold mb-sm flex items-center gap-xs">
                            <span className="material-symbols-outlined text-[18px] text-primary">
                                description
                            </span>
                            Tentang Materi Ini
                        </h2>
                        <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed whitespace-pre-wrap">
                            {lecture.content}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

/**
 * Sidebar kurikulum kanan: accordion section + daftar lecture + progress.
 */
function CurriculumSidebar({
    course,
    currentLecture,
    completedIds,
    progress,
    completedCount,
    totalLectures,
}) {
    // Section yang mengandung lecture aktif dibuka secara default
    const activeSectionId = course.sections.find((s) =>
        s.lectures.some((l) => l.id === currentLecture.id)
    )?.id;

    const [openSections, setOpenSections] = useState(() => {
        const init = {};
        course.sections.forEach((s) => {
            init[s.id] = s.id === activeSectionId;
        });
        return init;
    });

    const toggleSection = (id) =>
        setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));

    return (
        <aside
            className="h-full flex flex-col border-l overflow-hidden"
            style={{ borderColor: 'rgba(48,0,51,0.08)' }}
        >
            {/* ─── Header sidebar ─── */}
            <div
                className="px-lg py-md border-b flex-shrink-0"
                style={{
                    background: 'linear-gradient(135deg, #300033 0%, #5a1a5e 100%)',
                    borderColor: 'rgba(48,0,51,0.1)',
                }}
            >
                <h2 className="font-label-md text-label-md text-on-primary font-bold mb-xs line-clamp-1">
                    {course.title}
                </h2>
                <div className="flex items-center justify-between">
                    <span className="font-caption text-caption text-on-primary/70">
                        {completedCount}/{totalLectures} materi
                    </span>
                    <span className="font-label-md text-label-md text-secondary-container font-bold">
                        {progress}%
                    </span>
                </div>
                <div className="mt-sm h-1.5 bg-white/20 rounded-full overflow-hidden">
                    <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                            width: `${progress}%`,
                            background: '#ffb145',
                        }}
                    />
                </div>
            </div>

            {/* ─── Daftar section & lecture ─── */}
            <div className="flex-1 overflow-y-auto">
                {course.sections.map((section, sIdx) => {
                    const isOpen = openSections[section.id] ?? false;
                    const sectionCompleted = section.lectures.filter((l) =>
                        completedIds.includes(l.id)
                    ).length;

                    return (
                        <div key={section.id} className="border-b" style={{ borderColor: 'rgba(48,0,51,0.06)' }}>
                            {/* Section header */}
                            <button
                                onClick={() => toggleSection(section.id)}
                                className="w-full px-lg py-md flex items-start justify-between gap-sm text-left hover:bg-surface-container-low transition-colors"
                            >
                                <div className="flex-1 min-w-0">
                                    <p className="font-label-md text-label-md text-on-surface font-semibold line-clamp-2 leading-snug">
                                        {sIdx + 1}. {section.title}
                                    </p>
                                    <p className="font-caption text-caption text-on-surface-variant mt-xs">
                                        {sectionCompleted}/{section.lectures.length} selesai
                                    </p>
                                </div>
                                <span
                                    className="material-symbols-outlined text-[20px] text-on-surface-variant flex-shrink-0 mt-xs transition-transform duration-200"
                                    style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                                >
                                    expand_more
                                </span>
                            </button>

                            {/* Lecture list */}
                            {isOpen && (
                                <div>
                                    {section.lectures.map((lecture) => {
                                        const isActive = lecture.id === currentLecture.id;
                                        const isDone   = completedIds.includes(lecture.id);

                                        return (
                                            <Link
                                                key={lecture.id}
                                                href={`/student/learn/${course.slug}/${lecture.id}`}
                                                className={`flex items-center gap-md pl-xl pr-lg py-sm border-b transition-colors ${
                                                    isActive
                                                        ? 'bg-primary/5 border-l-[3px] border-l-primary'
                                                        : 'hover:bg-surface-container-low border-l-[3px] border-l-transparent'
                                                }`}
                                                style={{ borderBottomColor: 'rgba(48,0,51,0.04)' }}
                                            >
                                                {/* Status icon */}
                                                {isDone ? (
                                                    <span
                                                        className="material-symbols-outlined text-[20px] text-success flex-shrink-0"
                                                        style={{ fontVariationSettings: "'FILL' 1" }}
                                                    >
                                                        check_circle
                                                    </span>
                                                ) : isActive ? (
                                                    <span
                                                        className="material-symbols-outlined text-[20px] text-primary flex-shrink-0"
                                                        style={{ fontVariationSettings: "'FILL' 1" }}
                                                    >
                                                        play_circle
                                                    </span>
                                                ) : (
                                                    <span
                                                        className="material-symbols-outlined text-[20px] text-outline flex-shrink-0"
                                                        style={{ fontVariationSettings: "'FILL' 0" }}
                                                    >
                                                        radio_button_unchecked
                                                    </span>
                                                )}

                                                <div className="flex-1 min-w-0">
                                                    <p
                                                        className={`font-caption text-caption leading-snug line-clamp-2 ${
                                                            isActive
                                                                ? 'text-primary font-semibold'
                                                                : 'text-on-surface'
                                                        }`}
                                                    >
                                                        {lecture.title}
                                                    </p>
                                                    {lecture.duration && (
                                                        <p className="font-caption text-caption text-on-surface-variant mt-[2px]">
                                                            {lecture.duration}
                                                        </p>
                                                    )}
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </aside>
    );
}

// ─── Page ────────────────────────────────────────────────────────────────────

/**
 * Pages/Courses/Player.jsx — L10 Albariqi
 *
 * Props dari CoursePlayerController@show:
 *   course, currentLecture, completedIds, progress, completedCount,
 *   totalLectures, allCompleted, prevLectureId, nextLectureId
 */
export default function Player({
    course,
    currentLecture,
    completedIds: initialCompletedIds,
    progress: initialProgress,
    completedCount: initialCompletedCount,
    totalLectures,
    allCompleted: initialAllCompleted,
    prevLectureId,
    nextLectureId,
}) {
    // Local state — update setelah mark complete agar UI responsif tanpa reload
    const [completedIds, setCompletedIds]         = useState(initialCompletedIds ?? []);
    const [progress, setProgress]                 = useState(initialProgress ?? 0);
    const [completedCount, setCompletedCount]     = useState(initialCompletedCount ?? 0);
    const [allCompleted, setAllCompleted]         = useState(initialAllCompleted ?? false);
    const [markingComplete, setMarkingComplete]   = useState(false);
    const [sidebarOpen, setSidebarOpen]           = useState(false); // mobile sidebar toggle

    const isCurrentCompleted = completedIds.includes(currentLecture.id);

    const handleMarkComplete = useCallback(async () => {
        if (isCurrentCompleted || markingComplete) return;
        setMarkingComplete(true);

        try {
            const res = await fetch(`/student/lecture/${currentLecture.id}/complete`, {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name=csrf-token]')?.content ?? '',
                    Accept: 'application/json',
                },
            });
            const data = await res.json();

            if (data.completed) {
                setCompletedIds((prev) => [...new Set([...prev, currentLecture.id])]);
                setProgress(data.progress);
                setCompletedCount(data.completed_count);
                if (data.completed_count >= data.total_lectures) {
                    setAllCompleted(true);
                }
            }
        } catch (err) {
            console.error('Mark complete error:', err);
        } finally {
            setMarkingComplete(false);
        }
    }, [currentLecture.id, isCurrentCompleted, markingComplete]);

    return (
        <>
            <Head title={`${currentLecture.title} — ${course.title} | BelajarKUY`} />

            <div
                className="flex flex-col h-screen bg-background antialiased"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
                {/* ─── Top Navbar ─── */}
                <header
                    className="h-14 flex-shrink-0 flex items-center justify-between px-md md:px-lg border-b z-20"
                    style={{
                        background: '#300033',
                        borderColor: 'rgba(255,255,255,0.1)',
                    }}
                >
                    {/* Kiri: logo + judul kursus */}
                    <div className="flex items-center gap-md min-w-0">
                        <Link
                            id="btn-back-to-courses"
                            href="/student/my-courses"
                            className="flex items-center gap-xs text-on-primary/70 hover:text-on-primary transition-colors flex-shrink-0"
                        >
                            <span className="material-symbols-outlined text-[22px]">arrow_back</span>
                        </Link>
                        <div className="h-5 w-px bg-white/20 flex-shrink-0" />
                        <Link
                            href="/"
                            className="font-headline-sm text-headline-sm font-extrabold text-on-primary flex-shrink-0 hidden sm:block"
                        >
                            🚀 Belajar<span style={{ color: '#ffb145' }}>KUY</span>
                        </Link>
                        <div className="h-5 w-px bg-white/20 flex-shrink-0 hidden sm:block" />
                        <p className="font-label-md text-label-md text-on-primary/80 truncate hidden md:block">
                            {course.title}
                        </p>
                    </div>

                    {/* Kanan: progress + toggle sidebar mobile */}
                    <div className="flex items-center gap-md flex-shrink-0">
                        <span className="font-caption text-caption text-on-primary/70 hidden sm:block">
                            {completedCount}/{totalLectures} selesai
                        </span>
                        <div
                            className="w-24 h-1.5 rounded-full hidden sm:block"
                            style={{ background: 'rgba(255,255,255,0.2)' }}
                        >
                            <div
                                className="h-full rounded-full transition-all duration-700"
                                style={{ width: `${progress}%`, background: '#ffb145' }}
                            />
                        </div>
                        <span
                            className="font-label-md text-label-md font-bold hidden sm:block"
                            style={{ color: '#ffb145' }}
                        >
                            {progress}%
                        </span>

                        {/* Toggle sidebar (mobile) */}
                        <button
                            id="btn-toggle-curriculum"
                            className="md:hidden p-1 text-on-primary/70 hover:text-on-primary transition-colors"
                            onClick={() => setSidebarOpen((v) => !v)}
                            aria-label="Toggle Curriculum"
                        >
                            <span className="material-symbols-outlined text-[24px]">menu_book</span>
                        </button>
                    </div>
                </header>

                {/* ─── Main Content ─── */}
                <div className="flex flex-1 min-h-0 relative">
                    {/* Video area */}
                    <main
                        className="flex-1 min-w-0 overflow-y-auto"
                        style={{ background: '#fcf9f8' }}
                    >
                        <VideoArea
                            lecture={currentLecture}
                            courseSlug={course.slug}
                            isCompleted={isCurrentCompleted}
                            onMarkComplete={handleMarkComplete}
                            markingComplete={markingComplete}
                            progress={progress}
                            prevLectureId={prevLectureId}
                            nextLectureId={nextLectureId}
                            allCompleted={allCompleted}
                        />
                    </main>

                    {/* Sidebar desktop */}
                    <div
                        className="hidden md:flex flex-col w-80 lg:w-96 flex-shrink-0"
                        style={{ background: '#ffffff' }}
                    >
                        <CurriculumSidebar
                            course={course}
                            currentLecture={currentLecture}
                            completedIds={completedIds}
                            progress={progress}
                            completedCount={completedCount}
                            totalLectures={totalLectures}
                        />
                    </div>

                    {/* Sidebar mobile (overlay) */}
                    {sidebarOpen && (
                        <>
                            <div
                                className="md:hidden fixed inset-0 bg-black/40 z-30"
                                onClick={() => setSidebarOpen(false)}
                            />
                            <div
                                className="md:hidden fixed right-0 top-14 bottom-0 w-80 z-40 flex flex-col shadow-2xl"
                                style={{ background: '#ffffff' }}
                            >
                                <CurriculumSidebar
                                    course={course}
                                    currentLecture={currentLecture}
                                    completedIds={completedIds}
                                    progress={progress}
                                    completedCount={completedCount}
                                    totalLectures={totalLectures}
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}

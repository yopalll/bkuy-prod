import { Head, Link } from '@inertiajs/react';
import StudentLayout from '@/Layouts/StudentLayout';

function CourseCard({ item }) {
    const { course, progress, completed_count, lectures_count, enrolled_at } = item;

    const enrolledDate = enrolled_at
        ? new Date(enrolled_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
        : null;

    return (
        <div className="bg-surface rounded-2xl overflow-hidden border border-outline-variant/30 shadow-sm hover:shadow-md transition-shadow flex flex-col">
            {/* Thumbnail */}
            <div className="relative h-40 bg-surface-container-high overflow-hidden">
                {course.thumbnail ? (
                    <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-5xl text-outline">school</span>
                    </div>
                )}
                {/* Progress overlay badge */}
                <div className="absolute top-3 right-3 bg-primary text-on-primary font-caption text-caption px-2 py-1 rounded-full">
                    {progress}%
                </div>
            </div>

            {/* Body */}
            <div className="p-lg flex flex-col flex-1">
                {course.category && (
                    <span className="font-caption text-caption text-primary bg-primary/10 px-2 py-1 rounded-full w-max mb-sm">
                        {course.category.name}
                    </span>
                )}
                <h3 className="font-label-md text-label-md text-on-surface font-bold line-clamp-2 mb-sm flex-1">
                    {course.title}
                </h3>
                {course.instructor && (
                    <p className="font-caption text-caption text-on-surface-variant mb-md">
                        {course.instructor.name}
                    </p>
                )}

                {/* Progress Bar */}
                <div className="mb-sm">
                    <div className="flex justify-between items-center mb-xs">
                        <span className="font-caption text-caption text-on-surface-variant">
                            {completed_count} / {lectures_count} materi
                        </span>
                        <span className="font-caption text-caption text-primary font-bold">{progress}%</span>
                    </div>
                    <div className="h-2 bg-surface-container-high rounded-full overflow-hidden">
                        <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                                background: 'linear-gradient(90deg, #300033 0%, #ffb145 100%)',
                                width: `${progress}%`,
                            }}
                        />
                    </div>
                </div>

                {enrolledDate && (
                    <p className="font-caption text-caption text-on-surface-variant mb-md flex items-center gap-xs">
                        <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                        Mulai {enrolledDate}
                    </p>
                )}

                {/* Action */}
                <Link
                    href={`/courses/${course.slug}`}
                    className="mt-auto w-full bg-primary text-on-primary font-label-md text-label-md py-2 rounded-lg hover:bg-primary-container transition-colors flex items-center justify-center gap-xs"
                >
                    {progress === 100 ? (
                        <>
                            <span className="material-symbols-outlined text-[18px]">replay</span>
                            Tonton Ulang
                        </>
                    ) : progress > 0 ? (
                        <>
                            <span className="material-symbols-outlined text-[18px]">play_arrow</span>
                            Lanjutkan
                        </>
                    ) : (
                        <>
                            <span className="material-symbols-outlined text-[18px]">rocket_launch</span>
                            Mulai Belajar
                        </>
                    )}
                </Link>
            </div>
        </div>
    );
}

function EmptyState() {
    return (
        <div className="flex-1 flex items-center justify-center p-gutter">
            <div className="bg-surface rounded-2xl p-xl max-w-2xl w-full flex flex-col items-center text-center shadow-[0_8px_30px_rgba(48,0,51,0.08)] border border-outline-variant/30">
                <div className="w-48 h-48 mb-lg relative flex items-center justify-center">
                    <div className="absolute inset-0 bg-primary-fixed-dim/20 rounded-full blur-3xl" />
                    <span className="material-symbols-outlined text-[120px] text-primary/20 relative z-10">school</span>
                </div>
                <h2 className="font-headline-lg text-headline-lg text-on-surface mb-sm">
                    Perjalanan belajarmu dimulai di sini
                </h2>
                <p className="font-body-lg text-body-lg text-on-surface-variant max-w-md mx-auto mb-xl">
                    Kamu belum terdaftar di kursus apapun. Temukan skill baru dan mulai belajar sekarang.
                </p>
                <div className="flex flex-col sm:flex-row gap-md">
                    <a
                        href="/home"
                        className="bg-primary text-on-primary font-label-md text-label-md py-3 px-lg rounded-lg shadow-sm hover:bg-primary-container transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                        <span className="material-symbols-outlined text-[20px]">search</span>
                        Jelajahi Kursus
                    </a>
                    <Link
                        href="/student/wishlist"
                        className="bg-surface text-primary border-2 border-primary font-label-md text-label-md py-3 px-lg rounded-lg hover:bg-surface-container-low transition-all active:scale-95 flex items-center justify-center"
                    >
                        Lihat Wishlist
                    </Link>
                </div>
                <div className="mt-xl flex items-center gap-xs text-primary/40">
                    <span className="material-symbols-outlined text-[16px]">rocket_launch</span>
                    <div className="h-[2px] w-12 rounded-full" style={{ background: 'linear-gradient(90deg, rgba(48,0,51,0.4) 0%, rgba(230,126,34,0.4) 100%)' }} />
                    <span className="font-caption text-caption uppercase tracking-wider">Siap lepas landas</span>
                </div>
            </div>
        </div>
    );
}

export default function MyCourses({ enrolledCoursesData }) {
    const courses = enrolledCoursesData ?? [];
    const hasData = courses.length > 0;

    const inProgress = courses.filter(c => c.progress > 0 && c.progress < 100);
    const notStarted = courses.filter(c => c.progress === 0);
    const completed  = courses.filter(c => c.progress === 100);

    return (
        <StudentLayout>
            <Head title="Kursus Saya" />

            {!hasData ? (
                <EmptyState />
            ) : (
                <div className="px-margin-mobile md:px-margin-desktop py-xl md:py-xxl">
                    {/* Header */}
                    <div className="mb-xl">
                        <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary mb-xs">
                            Kursus Saya
                        </h1>
                        <p className="font-body-md text-body-md text-on-surface-variant">
                            {courses.length} kursus terdaftar
                        </p>
                    </div>

                    {/* In Progress */}
                    {inProgress.length > 0 && (
                        <section className="mb-xxl">
                            <h2 className="font-headline-md text-headline-md text-on-surface mb-lg flex items-center gap-sm">
                                <span className="material-symbols-outlined text-warning"
                                    style={{ fontVariationSettings: "'FILL' 1" }}>
                                    play_circle
                                </span>
                                Sedang Dipelajari
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-gutter">
                                {inProgress.map((item, i) => <CourseCard key={i} item={item} />)}
                            </div>
                        </section>
                    )}

                    {/* Not Started */}
                    {notStarted.length > 0 && (
                        <section className="mb-xxl">
                            <h2 className="font-headline-md text-headline-md text-on-surface mb-lg flex items-center gap-sm">
                                <span className="material-symbols-outlined text-primary"
                                    style={{ fontVariationSettings: "'FILL' 1" }}>
                                    rocket_launch
                                </span>
                                Belum Dimulai
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-gutter">
                                {notStarted.map((item, i) => <CourseCard key={i} item={item} />)}
                            </div>
                        </section>
                    )}

                    {/* Completed */}
                    {completed.length > 0 && (
                        <section>
                            <h2 className="font-headline-md text-headline-md text-on-surface mb-lg flex items-center gap-sm">
                                <span className="material-symbols-outlined text-success"
                                    style={{ fontVariationSettings: "'FILL' 1" }}>
                                    verified
                                </span>
                                Selesai
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-gutter">
                                {completed.map((item, i) => <CourseCard key={i} item={item} />)}
                            </div>
                        </section>
                    )}
                </div>
            )}
        </StudentLayout>
    );
}

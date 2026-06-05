import { Head, Link } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';
import StudentLayout from '@/Layouts/StudentLayout';

const rupiah = (n) => 'Rp ' + Number(n ?? 0).toLocaleString('id-ID');

function CircleProgress({ percent }) {
    const r   = 54;
    const circ = 2 * Math.PI * r;
    const filled = ((percent ?? 0) / 100) * circ;
    return (
        <div className="relative w-32 h-32 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
                <circle cx="64" cy="64" r={r} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="8" />
                <circle
                    cx="64" cy="64" r={r}
                    fill="none"
                    stroke="#ffb145"
                    strokeWidth="8"
                    strokeDasharray={`${filled} ${circ}`}
                    strokeLinecap="round"
                />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
                <span className="text-2xl font-extrabold text-secondary-container leading-none">{percent}%</span>
            </div>
        </div>
    );
}

function StatCard({ icon, iconBg, iconColor, value, label }) {
    return (
        <div className="bg-surface rounded-2xl p-lg shadow-[0_4px_20px_rgba(48,0,51,0.12)] border border-primary/5 flex items-center gap-md">
            <div className={`w-12 h-12 rounded-full ${iconBg} flex items-center justify-center ${iconColor}`}>
                <span className="material-symbols-outlined text-2xl"
                    style={{ fontVariationSettings: "'FILL' 1" }}>
                    {icon}
                </span>
            </div>
            <div>
                <p className="font-headline-lg text-headline-lg text-primary leading-none">{value}</p>
                <p className="font-label-md text-label-md text-on-surface-variant mt-xs">{label}</p>
            </div>
        </div>
    );
}

function CourseProgressItem({ item }) {
    const { course, progress, completed_count, lectures_count } = item;

    return (
        <div className="flex flex-col sm:flex-row gap-md items-start sm:items-center p-md rounded-xl hover:bg-background-subtle transition-colors border border-transparent hover:border-outline-variant/30">
            {/* Thumbnail */}
            <div className="w-full sm:w-32 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-surface-container-high">
                {course.thumbnail ? (
                    <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-4xl text-outline">school</span>
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="flex-1 w-full min-w-0">
                <div className="flex justify-between items-start mb-xs gap-sm">
                    <h4 className="font-label-md text-label-md text-on-surface font-bold truncate">
                        {course.title}
                    </h4>
                    <span className="font-caption text-caption px-2 py-1 bg-primary/10 text-primary rounded-full flex-shrink-0">
                        {completed_count}/{lectures_count} materi
                    </span>
                </div>
                <p className="font-caption text-caption text-on-surface-variant mb-sm">
                    {course.instructor?.name ?? 'Instruktur'}
                </p>
                <div className="flex items-center gap-sm">
                    <div className="flex-1 h-2 bg-surface-container-high rounded-full overflow-hidden relative">
                        <div
                            className="h-full rounded-full absolute top-0 left-0 transition-all duration-500"
                            style={{
                                background: 'linear-gradient(90deg, #300033 0%, #ffb145 100%)',
                                width: `${progress}%`,
                            }}
                        />
                    </div>
                    <span className="font-caption text-caption text-primary font-bold w-10 text-right">
                        {progress}%
                    </span>
                </div>
            </div>

            {/* CTA */}
            <Link
                href={`/student/learn/${course.slug}`}
                className="w-full sm:w-auto bg-primary text-on-primary font-label-md text-label-md px-4 py-2 rounded-lg hover:bg-primary-container transition-colors flex items-center justify-center gap-xs"
            >
                Lanjut
                <span className="material-symbols-outlined text-[18px]">play_arrow</span>
            </Link>
        </div>
    );
}

// ─── Empty state (no enrollments) ───────────────────────────────────────────
function EmptyDashboard({ user }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
            {/* Main CTA */}
            <div className="md:col-span-8 bg-surface rounded-3xl p-xl shadow-sm border border-outline-variant flex flex-col md:flex-row items-center gap-xl overflow-hidden relative">
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary-fixed opacity-50 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-secondary-fixed opacity-50 rounded-full blur-3xl pointer-events-none" />
                <div className="flex-1 z-10 text-center md:text-left">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-container text-on-primary-container mb-lg">
                        <span className="material-symbols-outlined text-[32px]">explore</span>
                    </div>
                    <h3 className="font-headline-md text-headline-md text-primary mb-md">
                        Dashboard kamu masih kosong.
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant mb-xl">
                        Waktunya mulai belajar! Jelajahi katalog kursus kami dan mulai perjalanan belajarmu.
                    </p>
                    <a
                        href="/home"
                        className="bg-primary text-on-primary font-label-md text-label-md py-3 px-xl rounded-lg hover:bg-primary-container transition-colors shadow-md flex items-center gap-2 w-max mx-auto md:mx-0"
                    >
                        Jelajahi Kursus
                        <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                    </a>
                </div>
            </div>

            {/* Quick Start */}
            <div className="md:col-span-4 bg-surface rounded-3xl p-lg shadow-sm border border-outline-variant flex flex-col">
                <h4 className="font-label-md text-label-md text-primary mb-lg flex items-center gap-2">
                    <span className="material-symbols-outlined text-warning">lightbulb</span>
                    Panduan Mulai
                </h4>
                <div className="space-y-md flex-1">
                    {[
                        { step: 1, title: 'Lengkapi profilmu', desc: 'Tambahkan minat agar rekomendasi lebih relevan.' },
                        { step: 2, title: 'Jelajahi Kategori',  desc: 'Temukan topik yang sesuai tujuan karirmu.' },
                        { step: 3, title: 'Daftar kursus gratis', desc: 'Coba materi pengenalan tanpa biaya.' },
                    ].map(({ step, title, desc }) => (
                        <div key={step} className="flex items-start gap-md p-md rounded-xl hover:bg-surface-container-lowest transition-colors border border-transparent hover:border-outline-variant group cursor-pointer">
                            <div className="w-8 h-8 rounded-full bg-surface-container-high text-on-surface flex items-center justify-center font-bold text-sm shrink-0 group-hover:bg-primary group-hover:text-on-primary transition-colors">
                                {step}
                            </div>
                            <div>
                                <p className="font-label-md text-label-md text-on-surface">{title}</p>
                                <p className="font-caption text-caption text-on-surface-variant">{desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function Dashboard({ enrollmentsCount, wishlistCount, reviewsCount, enrolledCoursesData, overallProgress }) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const firstName = user?.name?.split(' ')[0] ?? 'Kamu';
    const hasEnrollments = (enrolledCoursesData?.length ?? 0) > 0;

    return (
        <StudentLayout>
            <Head title="Dashboard Siswa" />

            <div className="px-margin-mobile md:px-margin-desktop py-xl md:py-xxl">
                {/* Welcome Header */}
                <div className="mb-xl">
                    <h2 className="font-display-lg text-headline-lg md:text-display-lg text-primary mb-xs">
                        Halo, {firstName}! 👋
                    </h2>
                    <p className="font-body-lg text-body-lg text-on-surface-variant">
                        {hasEnrollments
                            ? 'Lanjutkan perjalanan belajarmu hari ini.'
                            : 'Siap untuk meluncur ke skill baru hari ini?'}
                    </p>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-gutter mb-xl">
                    <StatCard
                        icon="school"
                        iconBg="bg-primary-container/10"
                        iconColor="text-primary"
                        value={enrollmentsCount ?? 0}
                        label="Kursus Diikuti"
                    />
                    <StatCard
                        icon="favorite"
                        iconBg="bg-secondary-container/20"
                        iconColor="text-secondary-container"
                        value={wishlistCount ?? 0}
                        label="Di Wishlist"
                    />
                    <StatCard
                        icon="reviews"
                        iconBg="bg-success/10"
                        iconColor="text-success"
                        value={reviewsCount ?? 0}
                        label="Ulasan Diberikan"
                    />
                </div>

                {hasEnrollments ? (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
                        {/* Left — Lanjutkan Belajar */}
                        <div className="lg:col-span-8">
                            <div className="bg-surface rounded-2xl p-lg shadow-[0_4px_20px_rgba(48,0,51,0.12)] border border-primary/5">
                                <div className="flex justify-between items-center mb-md">
                                    <h3 className="font-headline-md text-headline-md text-primary">Lanjutkan Belajar</h3>
                                    <Link
                                        href="/student/my-courses"
                                        className="font-label-md text-label-md text-secondary-container hover:text-secondary flex items-center gap-xs"
                                    >
                                        Lihat Semua
                                        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                                    </Link>
                                </div>
                                <div className="space-y-sm">
                                    {enrolledCoursesData.map((item, i) => (
                                        <CourseProgressItem key={i} item={item} />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right — Misi Belajar */}
                        <div className="lg:col-span-4">
                            <div className="bg-primary text-on-primary rounded-2xl p-lg shadow-[0_4px_20px_rgba(48,0,51,0.12)] relative overflow-hidden">
                                <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-[120px] opacity-10 -rotate-[15deg]">
                                    rocket
                                </span>
                                <h3 className="font-headline-md text-headline-md mb-xs relative z-10">Misi Belajar</h3>
                                <p className="font-body-md text-body-md text-on-primary/80 mb-lg relative z-10">
                                    Total progres keseluruhanmu
                                </p>
                                <div className="flex items-center justify-center mb-md relative z-10">
                                    <CircleProgress percent={overallProgress ?? 0} />
                                </div>
                                <p className="text-center font-label-md text-label-md text-on-primary/90 relative z-10">
                                    {(overallProgress ?? 0) >= 80
                                        ? 'Luar biasa! Hampir selesai 🚀'
                                        : (overallProgress ?? 0) >= 40
                                        ? 'Hebat! Pertahankan semangat belajarmu.'
                                        : 'Mulai perjalananmu sekarang!'}
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <EmptyDashboard user={user} />
                )}
            </div>
        </StudentLayout>
    );
}

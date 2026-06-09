import { Head, Link, usePage } from '@inertiajs/react';
import InstructorLayout from '@/Layouts/InstructorLayout';
const rupiah = (n) => 'Rp ' + Number(n ?? 0).toLocaleString('id-ID');

const STATUS_CONFIG = {
    draft:          { label: 'Draft',           cls: 'bg-surface-container-highest text-on-surface-variant border-outline/20' },
    pending_review: { label: 'Menunggu Review', cls: 'bg-warning/10 text-warning border-warning/20' },
    active:         { label: 'Aktif',           cls: 'bg-success/10 text-success border-success/20' },
    inactive:       { label: 'Nonaktif',        cls: 'bg-error/10 text-error border-error/20' },
};

function StatCard({ icon, iconBg, value, label, accent = false }) {
    return (
        <div className={`rounded-2xl p-lg shadow-sm border flex flex-col justify-between ${
            accent
                ? 'bg-primary border-primary/0 relative overflow-hidden'
                : 'bg-surface border-primary/10'
        }`}>
            {accent && (
                <div className="absolute -right-4 -top-4 opacity-10 pointer-events-none">
                    <span className="material-symbols-outlined text-[120px] text-white">rocket_launch</span>
                </div>
            )}
            <div className="flex justify-between items-start mb-md relative z-10">
                <div className={`p-2 rounded-lg ${iconBg}`}>
                    <span
                        className="material-symbols-outlined text-[22px]"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                        {icon}
                    </span>
                </div>
            </div>
            <div className="relative z-10">
                <div className={`text-[36px] leading-tight font-extrabold ${accent ? 'text-white' : 'text-on-surface'}`}>
                    {value}
                </div>
                <div className={`font-label-md text-label-md mt-1 ${accent ? 'text-white/80' : 'text-on-surface-variant'}`}>
                    {label}
                </div>
            </div>
        </div>
    );
}

function CourseRow({ course }) {
    const cfg = STATUS_CONFIG[course.status] ?? STATUS_CONFIG.draft;
    return (
        <div className="bg-surface rounded-xl p-md shadow-sm border border-primary/10 flex flex-col md:flex-row items-center gap-lg hover:shadow-md transition-shadow">
            {/* Thumbnail */}
            <div className="w-full md:w-44 h-28 md:h-20 rounded-lg bg-surface-container-high overflow-hidden shrink-0 relative">
                {course.thumbnail ? (
                    <img
                        src={course.thumbnail.startsWith('http') ? course.thumbnail : `/${course.thumbnail}`}
                        alt={course.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            if (!e.currentTarget.dataset.fallback) {
                                e.currentTarget.dataset.fallback = '1';
                                e.currentTarget.src = 'https://placehold.co/600x340/300033/ffffff?text=BelajarKUY';
                            }
                        }}
                    />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-primary-container flex items-center justify-center">
                        <span className="material-symbols-outlined text-white text-[36px] opacity-50">menu_book</span>
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="flex-1 w-full">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-headline-md text-[17px] font-bold text-on-surface line-clamp-1 mr-2">
                        {course.title}
                    </h3>
                    <span className={`shrink-0 font-caption text-[11px] px-2 py-1 rounded-full uppercase tracking-wider font-bold border ${cfg.cls}`}>
                        {cfg.label}
                    </span>
                </div>
                <div className="flex items-center gap-md text-sm text-on-surface-variant flex-wrap">
                    <div className="flex items-center gap-1 font-label-md">
                        <span className="material-symbols-outlined text-[15px]">group</span>
                        {course.enrollments_count ?? 0} Pelajar
                    </div>
                    <div className="font-label-md font-bold text-on-surface ml-auto">
                        {course.discount > 0
                            ? rupiah(course.discounted_price)
                            : course.price == 0 ? 'Gratis' : rupiah(course.price)}
                    </div>
                </div>
            </div>

            {/* Aksi */}
            <div className="shrink-0 flex gap-2 w-full md:w-auto mt-3 md:mt-0">
                <Link
                    href={route('instructor.courses.edit', course.id)}
                    className="flex-1 md:flex-none px-4 py-2 border border-outline-variant rounded-lg text-on-surface-variant font-label-md text-label-md hover:bg-surface-container-low transition-colors text-center"
                >
                    Edit
                </Link>
                {course.status === 'active' && (
                    <Link
                        href={`/courses/${course.slug}`}
                        className="flex-1 md:flex-none px-4 py-2 bg-primary/10 text-primary rounded-lg font-label-md text-label-md font-bold hover:bg-primary/20 transition-colors text-center"
                    >
                        Lihat
                    </Link>
                )}
            </div>
        </div>
    );
}

export default function InstructorDashboard({ stats = {}, courses = [] }) {
    const { auth } = usePage().props;
    const name = auth?.user?.name ?? 'Instruktur';

    return (
        <InstructorLayout>
            <Head title="Dashboard Instruktur — BelajarKUY" />

            {/* Page Header */}
            <div className="bg-surface px-margin-mobile md:px-margin-desktop py-lg border-b border-surface-variant">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-md">
                    <div>
                        <p className="font-caption text-caption text-on-surface-variant uppercase tracking-widest mb-xs">Panel Instruktur</p>
                        <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-background">Dashboard Instruktur</h1>
                        <p className="font-body-md text-body-md text-on-surface-variant mt-xs">
                            Selamat datang kembali, <strong>{name}</strong>. Pantau performa kursusmu.
                        </p>
                    </div>
                    <Link
                        href={route('instructor.courses.create')}
                        className="inline-flex items-center gap-sm font-label-md text-label-md bg-primary text-on-primary px-lg py-sm rounded-lg shadow-md hover:bg-primary-container transition-colors"
                    >
                        <span className="material-symbols-outlined text-[18px]">add</span>
                        Kursus Baru
                    </Link>
                </div>
            </div>

            <div className="px-margin-mobile md:px-margin-desktop py-lg">
                <div className="max-w-7xl mx-auto space-y-xl">

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
                        <StatCard
                            icon="menu_book"
                            iconBg="bg-primary/10 text-primary"
                            value={stats.total_courses ?? 0}
                            label="Total Kursus"
                        />
                        <StatCard
                            icon="groups"
                            iconBg="bg-secondary-container/20 text-secondary-container"
                            value={(stats.total_enrollments ?? 0).toLocaleString('id-ID')}
                            label="Total Pelajar Terdaftar"
                        />
                        <StatCard
                            icon="account_balance_wallet"
                            iconBg="bg-white/20 text-white"
                            value={rupiah(stats.gross_revenue ?? 0)}
                            label="Gross Revenue"
                            accent
                        />
                    </div>

                    {/* Course List */}
                    <div>
                        <div className="flex justify-between items-center mb-lg">
                            <h2 className="font-headline-md text-headline-md text-on-surface">Kursus Saya</h2>
                            <Link
                                href={route('instructor.courses.index')}
                                className="text-primary font-label-md text-label-md hover:bg-primary/5 px-4 py-2 rounded-lg transition-colors font-bold"
                            >
                                Lihat Semua
                            </Link>
                        </div>

                        {courses.length === 0 ? (
                            <div className="bg-surface rounded-2xl p-xl text-center border border-outline-variant/30">
                                <span className="material-symbols-outlined text-[48px] text-on-surface-variant/40 mb-md block">menu_book</span>
                                <p className="font-body-md text-body-md text-on-surface-variant mb-lg">
                                    Belum ada kursus. Mulai buat kursus pertamamu!
                                </p>
                                <Link
                                    href={route('instructor.courses.create')}
                                    className="inline-flex items-center gap-2 bg-primary text-on-primary font-label-md text-label-md px-lg py-sm rounded-lg"
                                >
                                    <span className="material-symbols-outlined text-[18px]">add</span>
                                    Buat Kursus
                                </Link>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-md">
                                {courses.map((course) => (
                                    <CourseRow key={course.id} course={course} />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Mobile FAB */}
                    <Link
                        href={route('instructor.courses.create')}
                        className="md:hidden fixed bottom-20 right-4 z-30 w-14 h-14 bg-primary text-on-primary rounded-full shadow-lg flex items-center justify-center"
                    >
                        <span className="material-symbols-outlined text-[24px]">add</span>
                    </Link>

                </div>
            </div>
        </InstructorLayout>
    );
}

import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import CourseCard from '@/Components/CourseCard';

const rupiah = (n) => 'Rp ' + Number(n ?? 0).toLocaleString('id-ID');

function StatBox({ value, label, icon }) {
    return (
        <div className="bg-surface rounded-xl p-md shadow-[0_4px_20px_rgba(48,0,51,0.08)] flex flex-col items-center justify-center text-center min-w-[100px]">
            {icon && (
                <span
                    className="material-symbols-outlined text-secondary-container text-[22px] mb-xs"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                >
                    {icon}
                </span>
            )}
            <span className="font-headline-lg text-headline-lg text-primary leading-tight">{value}</span>
            <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wide text-[11px] mt-xs">{label}</span>
        </div>
    );
}

export default function InstructorShow({ instructor, stats, courses = [] }) {
    const photoSrc = instructor.photo
        ? (instructor.photo.startsWith('http') ? instructor.photo : `/${instructor.photo}`)
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(instructor.name ?? 'BK')}&background=300033&color=fff&size=192`;

    const initials = (instructor.name ?? 'BK')
        .split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();

    return (
        <AppLayout>
            <Head title={`${instructor.name} — BelajarKUY`} />

            {/* ── Hero Section ─────────────────────────────────────── */}
            <section className="relative overflow-hidden">
                {/* Decorative gradient */}
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-primary-fixed/30 to-transparent pointer-events-none rounded-bl-[80px]" />
                <div className="absolute -bottom-8 -left-8 w-64 h-64 bg-secondary-container/10 rounded-full blur-3xl pointer-events-none" />

                <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop py-xxl relative z-10">
                    <div className="flex flex-col md:flex-row gap-xl items-start">

                        {/* Photo */}
                        <div className="flex-shrink-0 relative self-center md:self-start">
                            <div className="w-44 h-44 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-surface shadow-[0_4px_20px_rgba(48,0,51,0.15)]">
                                <img
                                    src={photoSrc}
                                    alt={instructor.name}
                                    className="w-full h-full object-cover"
                                    onError={e => {
                                        if (!e.currentTarget.dataset.fallback) {
                                            e.currentTarget.dataset.fallback = '1';
                                            e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(instructor.name ?? 'BK')}&background=300033&color=fff&size=192`;
                                        }
                                    }}
                                />
                            </div>
                            {/* Badge top instructor */}
                            <div className="absolute -bottom-1 -right-1 bg-secondary-container w-12 h-12 rounded-full flex items-center justify-center shadow-md z-10" title="Instruktur Terverifikasi">
                                <span className="material-symbols-outlined text-primary text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                                    workspace_premium
                                </span>
                            </div>
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            {/* Breadcrumb */}
                            <nav className="flex items-center gap-xs font-caption text-caption text-on-surface-variant mb-md">
                                <Link href="/home" className="hover:text-primary transition-colors">Beranda</Link>
                                <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                                <span className="text-primary">Profil Instruktur</span>
                            </nav>

                            <h1 className="font-display-lg text-[40px] md:text-display-lg leading-tight text-primary font-extrabold mb-xs">
                                {instructor.name}
                            </h1>

                            <p className="font-headline-md text-headline-md text-secondary mb-md">
                                Instruktur BelajarKUY
                            </p>

                            {instructor.bio && (
                                <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed max-w-2xl mb-lg">
                                    {instructor.bio}
                                </p>
                            )}

                            {/* Website link */}
                            {instructor.website && (
                                <a
                                    href={instructor.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-xs text-primary hover:text-primary-container transition-colors font-label-md text-label-md mb-lg group"
                                >
                                    <span className="material-symbols-outlined text-[18px]">language</span>
                                    <span className="underline underline-offset-2 group-hover:no-underline">
                                        {instructor.website.replace(/^https?:\/\//, '')}
                                    </span>
                                    <span className="material-symbols-outlined text-[14px] opacity-60">open_in_new</span>
                                </a>
                            )}

                            {/* Stats bento */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-md max-w-lg">
                                <StatBox
                                    value={stats.total_students.toLocaleString('id-ID')}
                                    label="Pelajar"
                                    icon="group"
                                />
                                <StatBox
                                    value={stats.avg_rating > 0 ? stats.avg_rating.toFixed(1) : '—'}
                                    label="Avg. Rating"
                                    icon="star"
                                />
                                <StatBox
                                    value={stats.total_courses}
                                    label="Kursus"
                                    icon="school"
                                />
                                <StatBox
                                    value={stats.total_reviews.toLocaleString('id-ID')}
                                    label="Ulasan"
                                    icon="rate_review"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Courses Section ───────────────────────────────────── */}
            <section className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop py-xl pb-xxl">
                <div className="flex justify-between items-end mb-lg">
                    <div>
                        <h2 className="font-headline-lg text-headline-lg text-on-surface">
                            Kursus oleh {instructor.name}
                        </h2>
                        <p className="font-body-md text-body-md text-on-surface-variant mt-xs">
                            {stats.total_courses} kursus aktif tersedia
                        </p>
                    </div>
                </div>

                {courses.length === 0 ? (
                    <div className="bg-surface rounded-2xl p-xxl text-center border border-outline-variant/30">
                        <span className="material-symbols-outlined text-[56px] text-on-surface-variant/30 mb-md block">school</span>
                        <p className="font-body-md text-body-md text-on-surface-variant">
                            Instruktur ini belum memiliki kursus aktif.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-gutter">
                        {courses.map(course => (
                            <CourseCard key={course.id} course={course} />
                        ))}
                    </div>
                )}
            </section>
        </AppLayout>
    );
}

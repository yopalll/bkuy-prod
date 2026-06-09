import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import CourseCard from '@/Components/CourseCard';
import { useState, useEffect, useRef, useCallback } from 'react';

// ─── Hero Carousel ────────────────────────────────────────────────────────────
const ICON_PALETTE = [
    { bg: 'bg-primary/10',              text: 'text-primary' },
    { bg: 'bg-secondary-container/20',  text: 'text-secondary' },
    { bg: 'bg-success/10',              text: 'text-success' },
    { bg: 'bg-warning/10',              text: 'text-warning' },
    { bg: 'bg-error/10',                text: 'text-on-error-container' },
];

function HeroCarousel({ sliders }) {
    const [current, setCurrent]   = useState(0);
    const [paused,  setPaused]    = useState(false);
    const [animDir, setAnimDir]   = useState(null); // 'left' | 'right'
    const timerRef = useRef(null);
    const count    = sliders.length;

    const startTimer = useCallback(() => {
        if (count <= 1) return;
        clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            setAnimDir('left');
            setCurrent(c => (c + 1) % count);
        }, 5000);
    }, [count]);

    useEffect(() => {
        if (!paused) startTimer();
        return () => clearInterval(timerRef.current);
    }, [paused, startTimer]);

    function goTo(i, dir = null) {
        setAnimDir(dir);
        clearInterval(timerRef.current);
        setCurrent(i);
        if (!paused) startTimer();
    }

    if (count === 0) {
        return (
            <section className="relative rounded-2xl overflow-hidden bg-primary h-[420px] flex items-center">
                <div className="absolute inset-0 bg-gradient-to-br from-primary via-[#4a154b] to-primary-container" />
                <div className="absolute inset-0 opacity-5"
                    style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #ffb145 0%, transparent 60%), radial-gradient(circle at 80% 20%, #f6afef 0%, transparent 50%)' }} />
                <div className="relative z-10 px-lg md:px-[64px] max-w-2xl">
                    <span className="inline-block px-3 py-1 bg-secondary-container/20 text-secondary-container rounded-full font-label-md text-label-md mb-md backdrop-blur-sm">
                        🚀 Mulai Belajar Sekarang
                    </span>
                    <h1 className="font-headline-lg text-headline-lg text-on-primary mb-md leading-tight">
                        Kuasai Skill Masa Depan<br />Bersama Instruktur Terbaik
                    </h1>
                    <p className="font-body-lg text-body-lg text-on-primary/85 mb-lg">
                        Bergabung dengan ribuan pelajar yang mengakselerasi karir mereka lewat kursus berkualitas tinggi.
                    </p>
                    <Link href="/courses"
                        className="bg-secondary-container text-primary font-label-md text-label-md px-6 py-3 rounded-lg hover:opacity-90 transition-opacity inline-flex items-center gap-2 shadow-md">
                        Jelajahi Kursus <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </Link>
                </div>
            </section>
        );
    }

    const slide = sliders[current];

    return (
        <section
            className="relative rounded-2xl overflow-hidden bg-primary h-[420px] flex items-center select-none"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
        >
            {/* Background */}
            {slide.image_url ? (
                <div className="absolute inset-0 transition-opacity duration-700">
                    <img src={slide.image_url} alt={slide.title ?? ''} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/85 via-primary/60 to-transparent" />
                </div>
            ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-primary via-[#4a154b] to-primary-container" />
            )}

            {/* Decorative ambient glow */}
            <div className="absolute inset-0 opacity-10 pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(circle at 80% 80%, #ffb145 0%, transparent 50%)' }} />

            {/* Content */}
            <div className="relative z-10 px-lg md:px-[64px] max-w-2xl">
                {slide.title && (
                    <h1 className="font-headline-lg text-headline-lg text-on-primary mb-md leading-tight drop-shadow">
                        {slide.title}
                    </h1>
                )}
                {slide.sub_title && (
                    <p className="font-body-lg text-body-lg text-on-primary/90 mb-lg drop-shadow-sm">
                        {slide.sub_title}
                    </p>
                )}
                {slide.link && (
                    <a href={slide.link}
                        className="bg-secondary-container text-primary font-label-md text-label-md px-6 py-3 rounded-lg hover:opacity-90 transition-opacity inline-flex items-center gap-2 shadow-md">
                        Pelajari Lebih Lanjut <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </a>
                )}
            </div>

            {/* Prev / Next */}
            {count > 1 && (
                <>
                    <button
                        onClick={() => goTo((current - 1 + count) % count, 'right')}
                        className="absolute left-md top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/15 hover:bg-white/35 backdrop-blur-sm flex items-center justify-center transition-colors"
                        aria-label="Sebelumnya"
                    >
                        <span className="material-symbols-outlined text-white text-[20px]">chevron_left</span>
                    </button>
                    <button
                        onClick={() => goTo((current + 1) % count, 'left')}
                        className="absolute right-md top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/15 hover:bg-white/35 backdrop-blur-sm flex items-center justify-center transition-colors"
                        aria-label="Berikutnya"
                    >
                        <span className="material-symbols-outlined text-white text-[20px]">chevron_right</span>
                    </button>
                </>
            )}

            {/* Dot navigation */}
            {count > 1 && (
                <div className="absolute bottom-md left-1/2 -translate-x-1/2 z-20 flex items-center gap-xs">
                    {sliders.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => goTo(i)}
                            className={`h-2 rounded-full transition-all duration-300 ${
                                i === current ? 'bg-white w-6' : 'bg-white/45 w-2 hover:bg-white/70'
                            }`}
                            aria-label={`Slide ${i + 1}`}
                        />
                    ))}
                </div>
            )}

            {/* Progress bar (autoplay indicator) */}
            {count > 1 && !paused && (
                <div key={current} className="absolute bottom-0 left-0 h-0.5 bg-secondary-container/70 animate-[growWidth_5s_linear_1]" />
            )}
        </section>
    );
}

// ─── Info Box Row ──────────────────────────────────────────────────────────────
function InfoBoxSection({ infoBoxes }) {
    if (!infoBoxes.length) return null;
    return (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
            {infoBoxes.map((box, i) => {
                const palette = ICON_PALETTE[i % ICON_PALETTE.length];
                return (
                    <div key={box.id} className="bg-surface rounded-2xl p-lg shadow-[0_4px_24px_rgba(48,0,51,0.08)] flex items-start gap-md hover:shadow-[0_8px_32px_rgba(48,0,51,0.12)] transition-shadow">
                        <div className={`w-12 h-12 rounded-full ${palette.bg} flex items-center justify-center shrink-0`}>
                            <span
                                className={`material-symbols-outlined text-[22px] ${palette.text}`}
                                style={{ fontVariationSettings: "'FILL' 1" }}
                            >
                                {box.icon || 'info'}
                            </span>
                        </div>
                        <div className="min-w-0">
                            <h3 className="font-body-lg font-bold text-on-surface mb-xs leading-tight">{box.title}</h3>
                            {box.description && (
                                <p className="font-body-md text-body-md text-on-surface-variant text-sm leading-relaxed">{box.description}</p>
                            )}
                        </div>
                    </div>
                );
            })}
        </section>
    );
}

// ─── Partners Strip ────────────────────────────────────────────────────────────
function PartnersSection({ partners }) {
    if (!partners.length) return null;

    const renderLogo = (partner) => (
        partner.logo_url
            ? <img src={partner.logo_url} alt={partner.name} className="h-8 w-auto object-contain max-w-[120px]" />
            : <span className="font-label-md text-label-md text-on-surface-variant whitespace-nowrap">{partner.name}</span>
    );

    // Digandakan agar perulangan marquee terlihat mulus (seamless loop).
    const loopPartners = [...partners, ...partners];

    return (
        <section className="py-xl">
            <p className="text-center font-label-md text-label-md text-on-surface-variant mb-lg uppercase tracking-widest text-xs">
                Dipercaya oleh perusahaan terkemuka
            </p>
            <div className="marquee-pause group relative overflow-hidden">
                {/* Gradien tepi agar logo memudar di kiri/kanan */}
                <div className="pointer-events-none absolute inset-y-0 left-0 w-16 z-10 bg-gradient-to-r from-background to-transparent" />
                <div className="pointer-events-none absolute inset-y-0 right-0 w-16 z-10 bg-gradient-to-l from-background to-transparent" />

                <div className="animate-marquee flex items-center gap-xl w-max">
                    {loopPartners.map((partner, idx) => (
                        partner.link ? (
                            <a
                                key={`${partner.id}-${idx}`}
                                href={partner.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                title={partner.name}
                                className="shrink-0 opacity-80 hover:opacity-100 hover:scale-105 transition-all duration-300"
                            >
                                {renderLogo(partner)}
                            </a>
                        ) : (
                            <div
                                key={`${partner.id}-${idx}`}
                                title={partner.name}
                                className="shrink-0 opacity-80"
                            >
                                {renderLogo(partner)}
                            </div>
                        )
                    ))}
                </div>
            </div>
        </section>
    );
}

// ─── Course Section ────────────────────────────────────────────────────────────
function CourseSection({ label, title, subtitle, courses }) {
    if (!courses.length) return null;
    return (
        <section>
            <div className="flex justify-between items-end mb-lg">
                <div>
                    {label && (
                        <span className="inline-block text-xs font-bold uppercase tracking-wider text-secondary bg-secondary/10 px-3 py-1 rounded-full mb-2">
                            {label}
                        </span>
                    )}
                    <h2 className="font-headline-md text-headline-md text-on-surface">{title}</h2>
                    {subtitle && <p className="font-body-md text-body-md text-on-surface-variant mt-xs">{subtitle}</p>}
                </div>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {courses.map(c => <CourseCard key={c.id} course={c} />)}
            </div>
        </section>
    );
}

// ─── Category Grid ─────────────────────────────────────────────────────────────
function CategorySection({ categories }) {
    if (!categories.length) return null;
    return (
        <section>
            <div className="flex justify-between items-end mb-lg">
                <h2 className="font-headline-md text-headline-md text-on-surface">Kategori Populer</h2>
                <Link href="/home" className="font-label-md text-label-md text-primary hover:text-primary-container transition-colors inline-flex items-center gap-xs">
                    Lihat Semua <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-md">
                {categories.map(cat => (
                    <Link
                        key={cat.id}
                        href={`/home?category=${cat.slug}`}
                        className="bg-surface rounded-2xl p-md flex flex-col gap-xs shadow-[0_4px_24px_rgba(48,0,51,0.08)] hover:-translate-y-1 transition-transform border border-transparent hover:border-primary/10"
                    >
                        <p className="font-label-md text-label-md font-bold text-on-surface leading-tight">{cat.name}</p>
                        <p className="font-caption text-caption text-on-surface-variant">{cat.courses_count ?? 0} kursus</p>
                    </Link>
                ))}
            </div>
        </section>
    );
}

// ─── Instructor Result Card ────────────────────────────────────────────────────
function InstructorResultCard({ instructor }) {
    const photoSrc = instructor.photo
        ? (instructor.photo.startsWith('http') ? instructor.photo : `/${instructor.photo}`)
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(instructor.name ?? 'BK')}&background=300033&color=fff&size=96`;

    return (
        <Link
            href={`/instructors/${instructor.id}`}
            className="bg-surface rounded-2xl p-lg flex items-center gap-md shadow-[0_4px_24px_rgba(48,0,51,0.08)] hover:shadow-[0_8px_32px_rgba(48,0,51,0.12)] hover:-translate-y-0.5 transition-all border border-transparent hover:border-primary/10 group"
        >
            <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 border-2 border-primary/10">
                <img src={photoSrc} alt={instructor.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="font-label-md text-label-md font-bold text-on-surface group-hover:text-primary transition-colors truncate">
                    {instructor.name}
                </p>
                <p className="font-caption text-caption text-on-surface-variant mt-xs">
                    {instructor.courses_count ?? 0} kursus aktif
                </p>
                {instructor.bio && (
                    <p className="font-caption text-caption text-on-surface-variant mt-xs line-clamp-1">{instructor.bio}</p>
                )}
            </div>
            <span className="material-symbols-outlined text-primary/40 group-hover:text-primary transition-colors text-[20px] shrink-0">
                arrow_forward
            </span>
        </Link>
    );
}

// ─── Home Page ─────────────────────────────────────────────────────────────────
export default function Home({
    sliders             = [],
    infoBoxes           = [],
    partners            = [],
    categories          = [],
    featuredCourses     = [],
    bestsellerCourses   = [],
    filteredCourses     = [],
    matchedInstructors  = [],
    isSearchingOrFiltering = false,
}) {
    return (
        <AppLayout>
            <Head title="BelajarKUY — Belajar Online Terbaik" />

            <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop py-xl space-y-[48px]">

                {/* 1. Hero Carousel */}
                <HeroCarousel sliders={sliders} />

                {/* 2. USP Info Boxes */}
                <InfoBoxSection infoBoxes={infoBoxes} />

                {/* 3. Partners */}
                {!isSearchingOrFiltering && <PartnersSection partners={partners} />}

                {/* 4. Categories */}
                {!isSearchingOrFiltering && <CategorySection categories={categories} />}

                {/* 5. Courses + Instructors */}
                {isSearchingOrFiltering ? (
                    <>
                        {/* Instruktur yang cocok */}
                        {matchedInstructors.length > 0 && (
                            <section>
                                <h2 className="font-headline-md text-headline-md text-on-surface mb-lg">
                                    Instruktur
                                    <span className="ml-sm font-caption text-caption text-on-surface-variant font-normal">
                                        {matchedInstructors.length} ditemukan
                                    </span>
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter">
                                    {matchedInstructors.map(ins => (
                                        <InstructorResultCard key={ins.id} instructor={ins} />
                                    ))}
                                </div>
                            </section>
                        )}

                        <CourseSection
                            title={filteredCourses.length > 0 ? 'Kursus Ditemukan' : 'Hasil Pencarian'}
                            courses={filteredCourses}
                        />

                        {filteredCourses.length === 0 && matchedInstructors.length === 0 && (
                            <div className="bg-surface rounded-2xl p-xxl text-center border border-outline-variant/30">
                                <span className="material-symbols-outlined text-[56px] text-on-surface-variant/30 mb-md block">search_off</span>
                                <p className="font-headline-md text-headline-md text-on-surface mb-sm">Tidak ada hasil</p>
                                <p className="font-body-md text-body-md text-on-surface-variant">
                                    Coba kata kunci lain atau jelajahi semua kursus.
                                </p>
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        <CourseSection
                            label="Pilihan Editor"
                            title="Kursus Unggulan"
                            subtitle="Kursus terbaik yang dipilih oleh tim kami untuk akselerasi belajarmu."
                            courses={featuredCourses}
                        />
                        <CourseSection
                            label="Terlaris"
                            title="Kursus Bestseller"
                            subtitle="Kursus paling diminati oleh ribuan pelajar di platform kami."
                            courses={bestsellerCourses}
                        />
                    </>
                )}
            </div>
        </AppLayout>
    );
}

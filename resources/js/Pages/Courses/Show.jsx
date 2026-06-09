import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AppLayout from '@/Layouts/AppLayout';
import CourseCard from '@/Components/CourseCard';
import Badge from '@/Components/Badge';
import EmptyState from '@/Components/EmptyState';

// Layar: detail_kursus_fullstack_web_dev/code.html (Vascha & Quinsha).
// Props dari CourseDetailController@show.
export default function Show({ course, relatedCourses = [], showReviewForm = false, hasPendingReview = false, inCart = false, isWishlisted = false, isEnrolled = false }) {
    const { t } = useTranslation();
    const { auth } = usePage().props;
    const isInstructor = auth?.user?.role === 'instructor';
    const [openSection, setOpenSection] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [cartState, setCartState]         = useState(inCart);
    const [wishlistState, setWishlistState] = useState(isWishlisted);
    const [cartLoading, setCartLoading]     = useState(false);
    const [wishLoading, setWishLoading]     = useState(false);

    function getCsrf() {
        return decodeURIComponent(
            document.cookie.split('; ').find((r) => r.startsWith('XSRF-TOKEN='))?.split('=')[1] ?? '',
        );
    }

    async function handleAddCart(e) {
        e.preventDefault();
        if (!auth?.user) { window.location.href = '/login'; return; }
        if (isInstructor) return; // instruktur tidak dapat membeli kursus
        if (cartLoading || cartState) return;
        setCartLoading(true);
        try {
            const res = await fetch(`/cart/${course.id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-XSRF-TOKEN': getCsrf(), Accept: 'application/json' },
            });
            if (res.ok) {
                setCartState(true);
                window.location.href = '/cart';
            }
        } finally { setCartLoading(false); }
    }

    async function handleWishlist(e) {
        e.preventDefault();
        if (!auth?.user) { window.location.href = '/login'; return; }
        if (wishLoading) return;
        setWishLoading(true);
        try {
            const res = await fetch(`/wishlist/${course.id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-XSRF-TOKEN': getCsrf(), Accept: 'application/json' },
            });
            if (res.ok) {
                const data = await res.json();
                setWishlistState(data.action === 'added');
            }
        } finally { setWishLoading(false); }
    }

    const { data, setData, post, processing, errors, reset } = useForm({ rating: 5, comment: '' });

    const rupiah = (n) => 'Rp ' + Number(n ?? 0).toLocaleString('id-ID');

    const rating        = Number(course.average_rating ?? 0);
    const reviewCount   = course.reviews?.length ?? 0;
    const hasDiscount   = (course.discount ?? 0) > 0;
    const enrolledCount = course.enrollments_count ?? 0;

    const getEmbedUrl = (url) => {
        if (!url) return null;
        const match = url.match(/(?:youtube(?:-nocookie)?\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|[^/]+\?v=)|youtu\.be\/)([^"&?/ ]{11})/i);
        return match ? `https://www.youtube.com/embed/${match[1]}` : url;
    };
    const embedUrl = getEmbedUrl(course.video_url);

    const handleReviewSubmit = (e) => {
        e.preventDefault();
        post(`/courses/${course.id}/reviews`, { onSuccess: () => reset() });
    };

    const ratingBreakdown = [5, 4, 3, 2, 1].map((star) => {
        const count = (course.reviews ?? []).filter((r) => r.rating === star).length;
        const pct   = reviewCount > 0 ? (count / reviewCount) * 100 : 0;
        return { star, count, pct };
    });

    return (
        <AppLayout>
            <Head title={`${course.title} — BelajarKUY`} />

            {/* ─── HERO BANNER ─── */}
            <section className="bg-primary text-on-primary py-xl md:py-xxl">
                <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
                        <div className="lg:col-span-8 flex flex-col gap-sm">
                            {/* Breadcrumb */}
                            <nav className="flex items-center gap-2 font-caption text-caption text-on-primary/70">
                                <Link href="/home" className="hover:text-on-primary transition-colors">{t('course.breadcrumb_home')}</Link>
                                <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                                <Link href={`/home?category=${course.category?.slug}`} className="hover:text-on-primary transition-colors">
                                    {course.category?.name}
                                </Link>
                                {course.sub_category && (
                                    <>
                                        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                                        <span className="text-on-primary/90">{course.sub_category.name}</span>
                                    </>
                                )}
                            </nav>

                            {/* Badges */}
                            <div className="flex flex-wrap gap-2">
                                {course.bestseller && (
                                    <span className="px-3 py-1 rounded-full font-caption text-caption font-bold bg-secondary-container text-on-secondary-container">
                                        {t('badge.bestseller')}
                                    </span>
                                )}
                                {course.featured && (
                                    <span className="px-3 py-1 rounded-full font-caption text-caption font-bold bg-on-primary/20 text-on-primary">
                                        {t('badge.featured')}
                                    </span>
                                )}
                            </div>

                            <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg leading-tight">
                                {course.title}
                            </h1>

                            <p className="font-body-md text-body-md text-on-primary/80 max-w-3xl">
                                {course.description}
                            </p>

                            {/* Meta row */}
                            <div className="flex flex-wrap items-center gap-x-md gap-y-sm font-body-md text-body-md mt-xs">
                                <div className="flex items-center gap-1">
                                    <span className="font-label-md text-label-md text-secondary-container">{rating.toFixed(1)}</span>
                                    <div className="flex items-center">
                                        {[1, 2, 3, 4, 5].map((i) => (
                                            <span
                                                key={i}
                                                className="material-symbols-outlined text-secondary-container text-[16px]"
                                                style={{ fontVariationSettings: i <= Math.round(rating) ? "'FILL' 1" : "'FILL' 0" }}
                                            >star</span>
                                        ))}
                                    </div>
                                    <span className="text-on-primary/60">{t('course.review_count', { count: reviewCount })}</span>
                                </div>
                                <span className="text-on-primary/30">|</span>
                                <div className="flex items-center gap-1 text-on-primary/80">
                                    <span className="material-symbols-outlined text-[18px]">group</span>
                                    <span>{t('course.enrolled_students', { count: enrolledCount })}</span>
                                </div>
                                <span className="text-on-primary/30">|</span>
                                <span className="text-on-primary/80">
                                    {t('course.created_by')}{' '}
                                    <span className="text-inverse-primary font-semibold">{course.instructor?.name}</span>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── MAIN CONTENT ─── */}
            <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop py-lg md:py-xl">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">

                    {/* ── LEFT COLUMN ── */}
                    <div className="lg:col-span-8 flex flex-col gap-xl">

                        {/* 1. WHAT YOU'LL LEARN */}
                        {(course.goals ?? []).length > 0 && (
                            <section className="bg-surface p-lg md:p-xl rounded-2xl border border-primary/10" style={{ boxShadow: '0 4px 24px rgba(48,0,51,0.08)' }}>
                                <h2 className="font-headline-md text-headline-md text-on-background mb-md">{t('course.what_you_learn')}</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                                    {course.goals.map((goal) => (
                                        <div key={goal.id} className="flex items-start gap-2">
                                            <span className="material-symbols-outlined text-success mt-0.5 shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                                            <span className="font-body-md text-body-md text-on-surface-variant">{goal.goal}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* 2. CURRICULUM */}
                        <section>
                            <div className="flex justify-between items-end mb-md">
                                <div>
                                    <h2 className="font-headline-md text-headline-md text-on-background">{t('course.curriculum_title')}</h2>
                                    <p className="font-body-md text-body-md text-on-surface-variant">
                                        {t('course.curriculum_subtitle', { count: (course.sections ?? []).length })}
                                    </p>
                                </div>
                            </div>

                            {(course.sections ?? []).length === 0 ? (
                                <EmptyState icon="menu_book" title={t('course.no_curriculum')} description={t('course.no_curriculum_desc')} size="sm" />
                            ) : (
                                <div className="flex flex-col gap-2">
                                    {course.sections.map((section, idx) => (
                                        <div key={section.id} className="bg-surface rounded-lg border border-outline-variant overflow-hidden">
                                            <button
                                                onClick={() => setOpenSection(openSection === idx ? null : idx)}
                                                className="w-full flex justify-between items-center p-md bg-surface-container-low hover:bg-surface-variant transition-colors focus:outline-none"
                                                aria-expanded={openSection === idx}
                                            >
                                                <div className="flex items-center gap-md">
                                                    <span className="material-symbols-outlined text-on-surface-variant transition-transform" style={{ transform: openSection === idx ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                                                        expand_more
                                                    </span>
                                                    <span className="font-label-md text-label-md text-on-surface text-left">{section.title}</span>
                                                </div>
                                                <span className="font-caption text-caption text-on-surface-variant shrink-0 ml-sm">
                                                    {(section.lectures ?? []).length} {t('course.lectures_label')}
                                                </span>
                                            </button>

                                            {openSection === idx && (
                                                <ul className="px-md py-sm flex flex-col gap-sm bg-surface">
                                                    {(section.lectures ?? []).length === 0 ? (
                                                        <li className="font-caption text-caption text-on-surface-variant py-sm">{t('course.no_lectures')}</li>
                                                    ) : (
                                                        section.lectures.map((lecture, lIdx) => (
                                                            <li key={lecture.id} className="flex justify-between items-center py-sm border-b border-surface-variant last:border-0">
                                                                <div className="flex items-center gap-2">
                                                                    <span className={`material-symbols-outlined text-[18px] ${lIdx === 0 ? 'text-primary' : 'text-on-surface-variant'}`}>
                                                                        {lIdx === 0 ? 'play_circle' : 'lock'}
                                                                    </span>
                                                                    {lIdx === 0 ? (
                                                                        isEnrolled
                                                                            ? <Link href={`/student/learn/${course.slug}`} className="font-body-md text-body-md text-on-surface hover:text-primary transition-colors">{lecture.title}</Link>
                                                                            : <span className="font-body-md text-body-md text-on-surface">{lecture.title}</span>
                                                                    ) : (
                                                                        <span className="font-body-md text-body-md text-on-surface-variant">{lecture.title}</span>
                                                                    )}
                                                                </div>
                                                                <div className="flex items-center gap-sm text-on-surface-variant shrink-0">
                                                                    {lIdx === 0 && (
                                                                        <span className="px-2 py-0.5 bg-primary-fixed/20 text-primary rounded-full font-caption text-[10px] font-bold">
                                                                            {t('course.preview_label')}
                                                                        </span>
                                                                    )}
                                                                    <span className="font-caption text-caption">{lecture.duration}</span>
                                                                </div>
                                                            </li>
                                                        ))
                                                    )}
                                                </ul>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>

                        {/* 3. INSTRUCTOR */}
                        <section id="instructor">
                            <h2 className="font-headline-md text-headline-md text-on-background mb-lg">{t('course.instructor_title')}</h2>
                            <div className="flex flex-col md:flex-row gap-lg bg-surface p-lg rounded-2xl border border-primary/5" style={{ boxShadow: '0 4px 24px rgba(48,0,51,0.08)' }}>
                                <div className="shrink-0 flex flex-col items-center">
                                    <img
                                        className="w-24 h-24 rounded-full object-cover border-4 border-primary-fixed shadow-sm"
                                        src={course.instructor?.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(course.instructor?.name ?? 'BK')}&background=300033&color=fff`}
                                        alt={course.instructor?.name}
                                    />
                                    <div className="mt-md flex flex-col gap-1 w-full">
                                        <div className="flex items-center gap-2 text-on-surface-variant font-caption text-caption">
                                            <span className="material-symbols-outlined text-[16px] text-warning" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                            <span>{t('course.instructor_rating_label')}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-on-surface-variant font-caption text-caption">
                                            <span className="material-symbols-outlined text-[16px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>group</span>
                                            <span>{enrolledCount}+ {t('course.students_label')}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-headline-md text-headline-md text-on-background">{course.instructor?.name}</h3>
                                    <p className="font-label-md text-label-md text-primary mb-md">{t('course.instructor_role')}</p>
                                    <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                                        {course.instructor?.bio ?? t('course.instructor_default_bio')}
                                    </p>
                                    {course.instructor?.website && (
                                        <a
                                            href={course.instructor.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 font-label-md text-label-md text-primary hover:text-primary-container bg-primary-fixed/20 hover:bg-primary-fixed/40 px-md py-sm rounded-lg transition-all mt-md"
                                        >
                                            <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                                            {t('course.instructor_website')}
                                        </a>
                                    )}
                                </div>
                            </div>
                        </section>

                        {/* 4. REVIEWS */}
                        <section id="reviews">
                            <h2 className="font-headline-md text-headline-md text-on-background mb-lg">{t('course.reviews_title')}</h2>

                            {/* Rating summary */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter items-center bg-surface-container-low p-lg rounded-2xl border border-outline-variant mb-lg">
                                <div className="text-center space-y-sm">
                                    <p className="font-display-lg text-display-lg text-primary">{rating.toFixed(1)}</p>
                                    <div className="flex items-center justify-center">
                                        {[1, 2, 3, 4, 5].map((i) => (
                                            <span
                                                key={i}
                                                className="material-symbols-outlined text-secondary-container text-[20px]"
                                                style={{ fontVariationSettings: i <= Math.round(rating) ? "'FILL' 1" : "'FILL' 0" }}
                                            >star</span>
                                        ))}
                                    </div>
                                    <p className="font-caption text-caption text-on-surface-variant uppercase tracking-widest">{t('course.rating_label')}</p>
                                </div>
                                <div className="md:col-span-2 flex flex-col gap-sm">
                                    {ratingBreakdown.map(({ star, pct }) => (
                                        <div key={star} className="flex items-center gap-sm font-label-md text-label-md text-on-surface-variant">
                                            <span className="w-12 shrink-0 font-caption text-caption">{star} bintang</span>
                                            <div className="flex-1 h-2 bg-surface-container-highest rounded-full overflow-hidden">
                                                <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                                            </div>
                                            <span className="w-8 text-right font-caption text-caption">{Math.round(pct)}%</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Pending review indicator */}
                            {hasPendingReview && (
                                <div className="bg-warning/10 border border-warning/30 rounded-2xl p-lg mb-lg flex items-start gap-md">
                                    <span className="material-symbols-outlined text-warning text-[22px] shrink-0 mt-xs" style={{ fontVariationSettings: "'FILL' 1" }}>hourglass_empty</span>
                                    <div>
                                        <p className="font-label-md text-label-md text-on-surface font-semibold">Ulasan kamu sedang menunggu persetujuan</p>
                                        <p className="font-body-md text-body-md text-on-surface-variant mt-xs">Ulasan akan ditampilkan setelah disetujui oleh admin. Terima kasih sudah memberikan penilaian!</p>
                                    </div>
                                </div>
                            )}

                            {/* Review form */}
                            {showReviewForm && (
                                <div className="bg-surface-container-low border border-outline-variant rounded-2xl p-lg mb-lg">
                                    <h3 className="font-headline-md text-body-lg font-bold text-on-background mb-xs">{t('course.write_review_title')}</h3>
                                    <p className="font-caption text-caption text-on-surface-variant mb-lg">{t('course.write_review_desc')}</p>
                                    <form onSubmit={handleReviewSubmit} className="flex flex-col gap-md">
                                        {/* Star picker */}
                                        <div>
                                            <label className="font-label-md text-label-md text-on-surface block mb-sm">{t('course.rating_select_label')}</label>
                                            <div className="flex items-center gap-sm">
                                                {[1, 2, 3, 4, 5].map((i) => (
                                                    <button
                                                        key={i}
                                                        type="button"
                                                        onClick={() => setData('rating', i)}
                                                        onMouseEnter={() => setHoverRating(i)}
                                                        onMouseLeave={() => setHoverRating(0)}
                                                        className="focus:outline-none hover:scale-110 transition-transform"
                                                    >
                                                        <span
                                                            className="material-symbols-outlined text-[32px] text-secondary-container"
                                                            style={{ fontVariationSettings: (hoverRating || data.rating) >= i ? "'FILL' 1" : "'FILL' 0" }}
                                                        >star</span>
                                                    </button>
                                                ))}
                                                <span className="font-caption text-caption text-on-surface-variant bg-surface px-sm py-xs rounded-lg border border-outline-variant ml-sm">
                                                    {t('course.star_count', { count: data.rating })}
                                                </span>
                                            </div>
                                            {errors.rating && <p className="font-caption text-caption text-error mt-xs">{errors.rating}</p>}
                                        </div>

                                        {/* Comment */}
                                        <div>
                                            <label htmlFor="comment" className="font-label-md text-label-md text-on-surface block mb-sm">{t('course.comment_label')}</label>
                                            <textarea
                                                id="comment"
                                                rows={4}
                                                value={data.comment}
                                                onChange={(e) => setData('comment', e.target.value)}
                                                placeholder={t('course.comment_placeholder')}
                                                className="block w-full bg-surface border border-outline-variant rounded-xl px-md py-sm font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary transition-colors placeholder:text-outline"
                                            />
                                            {errors.comment && <p className="font-caption text-caption text-error mt-xs">{errors.comment}</p>}
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="self-start font-label-md text-label-md px-lg py-sm rounded-lg bg-primary text-on-primary hover:bg-primary-container transition-colors disabled:opacity-60 active:scale-95"
                                        >
                                            {processing ? t('course.submitting') : t('course.submit_review')}
                                        </button>
                                    </form>
                                </div>
                            )}

                            {/* Reviews list */}
                            {(course.reviews ?? []).length === 0 ? (
                                <EmptyState icon="rate_review" title={t('course.no_reviews')} description={t('course.no_reviews_desc')} size="sm" />
                            ) : (
                                <div className="flex flex-col gap-md">
                                    {course.reviews.map((review) => (
                                        <div key={review.id} className="border border-outline-variant rounded-2xl p-lg bg-surface" style={{ boxShadow: '0 2px 12px rgba(48,0,51,0.04)' }}>
                                            <div className="flex items-center justify-between mb-md">
                                                <div className="flex items-center gap-md">
                                                    <img
                                                        className="h-10 w-10 rounded-full object-cover border border-primary-fixed"
                                                        src={review.user?.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.user?.name ?? 'U')}&background=300033&color=fff`}
                                                        alt={review.user?.name}
                                                    />
                                                    <div>
                                                        <h4 className="font-label-md text-label-md text-on-surface">{review.user?.name}</h4>
                                                        <p className="font-caption text-caption text-on-surface-variant">
                                                            {review.created_at_diff ?? review.created_at}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1 bg-secondary-fixed/20 px-sm py-xs rounded-lg">
                                                    <span className="font-caption text-caption font-bold text-on-surface">{review.rating}.0</span>
                                                    <span className="material-symbols-outlined text-secondary-container text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                                </div>
                                            </div>
                                            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                                                {review.comment ?? t('course.no_comment')}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    </div>

                    {/* ── RIGHT COLUMN: STICKY PURCHASE CARD ── */}
                    <div className="lg:col-span-4">
                        <div className="lg:sticky lg:top-24 bg-surface rounded-2xl border border-outline-variant overflow-hidden" style={{ boxShadow: '0 4px 24px rgba(48,0,51,0.10)' }}>

                            {/* Video/Thumbnail */}
                            {embedUrl ? (
                                <div className="relative bg-primary aspect-video">
                                    <iframe
                                        className="w-full h-full"
                                        src={embedUrl}
                                        title={t('course.teaser_title')}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        allowFullScreen
                                    />
                                </div>
                            ) : (
                                <div className="relative bg-primary aspect-video flex items-center justify-center overflow-hidden">
                                    {course.thumbnail && (
                                        <img
                                            className="absolute inset-0 w-full h-full object-cover opacity-60"
                                            src={course.thumbnail}
                                            alt={course.title}
                                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                        />
                                    )}
                                    <div className="relative z-10 flex flex-col items-center gap-sm text-on-primary/70">
                                        <span className="material-symbols-outlined text-[48px]" style={{ fontVariationSettings: "'FILL' 0" }}>play_disabled</span>
                                        <p className="font-caption text-caption text-on-primary/60">Belum ada video pratinjau</p>
                                    </div>
                                </div>
                            )}

                            {/* Purchase panel */}
                            <div className="p-lg flex flex-col gap-lg">
                                {/* Price */}
                                <div>
                                    <div className="flex items-end gap-md mb-xs">
                                        {hasDiscount ? (
                                            <>
                                                <span className="font-headline-lg text-headline-lg text-on-background font-bold">{rupiah(course.discounted_price)}</span>
                                                <span className="font-body-md text-body-md text-on-surface-variant line-through">{rupiah(course.price)}</span>
                                                <span className="font-label-md text-label-md text-warning">-{course.discount}%</span>
                                            </>
                                        ) : course.price == 0 ? (
                                            <span className="font-headline-lg text-headline-lg text-success font-bold">{t('course.free')}</span>
                                        ) : (
                                            <span className="font-headline-lg text-headline-lg text-on-background font-bold">{rupiah(course.price)}</span>
                                        )}
                                    </div>
                                </div>

                                {/* Buttons */}
                                <div className="flex flex-col gap-sm">
                                    {isInstructor ? (
                                        <div className="w-full text-center font-body-md text-body-md py-3 px-lg rounded-lg bg-surface-container border border-outline-variant text-on-surface-variant flex items-center justify-center gap-2">
                                            <span className="material-symbols-outlined text-[18px]">info</span>
                                            Akun instruktur tidak dapat membeli kursus
                                        </div>
                                    ) : isEnrolled ? (
                                        <Link
                                            href={`/student/learn/${course.slug}`}
                                            className="w-full text-center font-label-md text-label-md py-3 px-lg rounded-lg bg-primary text-on-primary hover:bg-primary-container transition-colors active:scale-95"
                                        >
                                            Lanjut Belajar
                                        </Link>
                                    ) : (
                                        <button
                                            onClick={handleAddCart}
                                            disabled={cartLoading || cartState}
                                            className="w-full text-center font-label-md text-label-md py-3 px-lg rounded-lg bg-primary text-on-primary hover:bg-primary-container transition-colors active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                                        >
                                            {cartLoading ? 'Memproses…' : cartState ? 'Ada di Keranjang' : t('course.enroll_now')}
                                        </button>
                                    )}
                                    {!isInstructor && !isEnrolled && (
                                        <button
                                            onClick={handleAddCart}
                                            disabled={cartLoading || cartState}
                                            className="w-full text-center font-label-md text-label-md py-3 px-lg rounded-lg bg-warning text-on-secondary-fixed hover:opacity-90 transition-opacity active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                                        >
                                            {cartState ? 'Sudah di Keranjang' : t('course.add_to_cart')}
                                        </button>
                                    )}
                                    <button
                                        onClick={handleWishlist}
                                        disabled={wishLoading}
                                        className="w-full flex items-center justify-center gap-2 font-label-md text-label-md py-3 px-lg rounded-lg bg-surface border border-outline-variant text-on-surface hover:text-primary hover:border-primary transition-colors disabled:opacity-60"
                                    >
                                        <span
                                            className="material-symbols-outlined text-[18px]"
                                            style={{ fontVariationSettings: wishlistState ? "'FILL' 1" : "'FILL' 0", color: wishlistState ? '#300033' : undefined }}
                                        >
                                            favorite
                                        </span>
                                        {wishlistState ? 'Tersimpan di Wishlist' : t('course.save_wishlist')}
                                    </button>
                                </div>

                                <p className="text-center font-caption text-caption text-on-surface-variant">{t('course.money_back')}</p>

                                {/* Includes */}
                                <div className="border-t border-surface-variant pt-md">
                                    <h4 className="font-label-md text-label-md text-on-background mb-md">{t('course.includes_label')}</h4>
                                    <ul className="flex flex-col gap-sm font-body-md text-caption text-on-surface-variant">
                                        <li className="flex items-center gap-md"><span className="material-symbols-outlined text-[18px]">ondemand_video</span> {t('course.total_video', { duration: course.duration ?? '-' })}</li>
                                        <li className="flex items-center gap-md"><span className="material-symbols-outlined text-[18px]">group</span> {t('course.students_count_label', { count: enrolledCount })}</li>
                                        <li className="flex items-center gap-md"><span className="material-symbols-outlined text-[18px]">all_inclusive</span> {t('course.full_access')}</li>
                                        <li className="flex items-center gap-md"><span className="material-symbols-outlined text-[18px]">smartphone</span> {t('course.flexible_learn')}</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ─── RELATED COURSES ─── */}
                {relatedCourses.length > 0 && (
                    <section className="border-t border-outline-variant pt-xxl mt-xxl">
                        <div className="mb-lg">
                            <Badge variant="brand" size="md">{t('course.recommendations_label')}</Badge>
                            <h2 className="font-headline-md text-headline-md text-on-background mt-sm">{t('course.related_title')}</h2>
                            <p className="font-body-md text-body-md text-on-surface-variant">
                                {t('course.related_desc', { category: course.category?.name })}
                            </p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
                            {relatedCourses.map((c) => (
                                <CourseCard key={c.id} course={c} />
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </AppLayout>
    );
}

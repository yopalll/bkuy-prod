import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

const rupiah = (n) => 'Rp ' + Number(n ?? 0).toLocaleString('id-ID');

/**
 * Komponen reusable CourseCard (≥2 layar).
 * Desain dari: katalog_kursus_final_polish/code.html (Vascha & Quinsha).
 *
 * Props:
 *   course            – objek Course
 *   isWishlisted      – boolean (opsional)
 *   onWishlistChange  – callback(courseId, newIsWishlisted) opsional
 *   isInCart          – boolean (opsional)
 */
export default function CourseCard({ course, isWishlisted: initialWishlisted = false, onWishlistChange, isInCart: initialInCart = false }) {
    const { auth } = usePage().props;
    const isInstructor = auth?.user?.role === 'instructor';
    const rating = Number(course.average_rating ?? 0);
    const reviewCount = course.reviews?.length ?? course.reviews_count ?? 0;
    const hasDiscount = (course.discount ?? 0) > 0;

    const [wishlisted, setWishlisted] = useState(initialWishlisted);
    const [loading, setLoading] = useState(false);
    const [inCart, setInCart]     = useState(initialInCart);
    const [cartLoading, setCartLoading] = useState(false);
    const [cartMsg, setCartMsg]   = useState('');

    async function handleWishlistToggle(e) {
        e.preventDefault();
        if (!auth?.user) { window.location.href = '/login'; return; }
        if (loading) return;
        setLoading(true);
        try {
            const res = await fetch(`/wishlist/${course.id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-XSRF-TOKEN': getCsrf(), Accept: 'application/json' },
            });
            if (res.ok) {
                const data = await res.json();
                const newState = data.action === 'added';
                setWishlisted(newState);
                onWishlistChange?.(course.id, newState);
            }
        } finally { setLoading(false); }
    }

    async function handleCartAdd(e) {
        e.preventDefault();
        if (!auth?.user) { window.location.href = '/login'; return; }
        if (isInstructor) return; // instruktur tidak dapat membeli kursus
        if (cartLoading || inCart) return;
        setCartLoading(true);
        try {
            const res = await fetch(`/cart/${course.id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-XSRF-TOKEN': getCsrf(), Accept: 'application/json' },
            });
            const data = await res.json();
            if (res.ok) {
                setInCart(true);
                setCartMsg('');
            } else {
                setCartMsg(data.message ?? 'Tidak bisa ditambahkan.');
            }
        } finally { setCartLoading(false); }
    }

    function getCsrf() {
        return decodeURIComponent(
            document.cookie.split('; ').find((r) => r.startsWith('XSRF-TOKEN='))?.split('=')[1] ?? '',
        );
    }

    return (
        <div
            className="group bg-surface rounded-2xl overflow-hidden border border-transparent hover:border-primary/10 transition-colors flex flex-col h-full relative"
            style={{ boxShadow: '0 4px 24px rgba(48,0,51,0.08)' }}
        >
            {/* Badges (bestseller/featured) */}
            {(course.bestseller || course.featured) && (
                <div className="absolute top-3 left-3 z-10 flex flex-col gap-xs">
                    {course.bestseller && (
                        <span className="px-2 py-0.5 rounded-full font-caption text-caption font-bold bg-secondary-container text-on-secondary-container">
                            Bestseller
                        </span>
                    )}
                    {course.featured && (
                        <span className="px-2 py-0.5 rounded-full font-caption text-caption font-bold bg-primary text-on-primary">
                            Featured
                        </span>
                    )}
                </div>
            )}

            {/* Wishlist toggle */}
            <button
                onClick={handleWishlistToggle}
                disabled={loading}
                className={`absolute top-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                    wishlisted
                        ? 'bg-error text-on-error'
                        : 'bg-white/90 backdrop-blur-sm text-primary hover:bg-primary-fixed/30'
                } ${loading ? 'opacity-60 cursor-wait' : ''}`}
                aria-label={wishlisted ? 'Hapus dari Wishlist' : 'Tambah ke Wishlist'}
            >
                <span
                    className="material-symbols-outlined text-[20px]"
                    style={{ fontVariationSettings: wishlisted ? "'FILL' 1" : "'FILL' 0" }}
                >
                    favorite
                </span>
            </button>

            {/* Thumbnail */}
            <Link href={`/courses/${course.slug}`} className="block overflow-hidden bg-surface-container-low relative" style={{ height: '160px' }}>
                <img
                    src={course.thumbnail || 'https://placehold.co/600x340/300033/ffffff?text=BelajarKUY'}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                        if (!e.currentTarget.dataset.fallback) {
                            e.currentTarget.dataset.fallback = '1';
                            e.currentTarget.src = 'https://placehold.co/600x340/300033/ffffff?text=BelajarKUY';
                        }
                    }}
                />
                {/* Rating overlay badge */}
                {rating > 0 && (
                    <div className="absolute bottom-2 left-3 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full flex items-center gap-1">
                        <span
                            className="material-symbols-outlined text-secondary-container text-[14px]"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                            star
                        </span>
                        <span className="font-caption text-caption text-on-surface font-bold">{rating.toFixed(1)}</span>
                    </div>
                )}
            </Link>

            {/* Content */}
            <div className="p-md flex flex-col flex-1">
                {/* Category pill */}
                <div className="flex items-center gap-2 mb-sm">
                    <span className="px-2 py-0.5 bg-primary-fixed/20 text-primary rounded-full font-caption text-[10px] uppercase font-bold tracking-wider">
                        {course.category?.name ?? 'Kategori'}
                    </span>
                </div>

                {/* Title */}
                <h3 className="font-label-md text-body-lg font-bold text-on-surface mb-xs line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                    <Link href={`/courses/${course.slug}`}>{course.title}</Link>
                </h3>

                {/* Instructor */}
                <div className="flex items-center gap-2 mb-md pt-xs border-t border-surface-variant mt-xs">
                    <div className="w-6 h-6 rounded-full bg-surface-container-highest overflow-hidden shrink-0">
                        <img
                            src={
                                course.instructor?.photo ||
                                `https://ui-avatars.com/api/?name=${encodeURIComponent(course.instructor?.name ?? 'BK')}&background=300033&color=fff`
                            }
                            alt={course.instructor?.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    {course.instructor?.id ? (
                        <Link
                            href={`/instructors/${course.instructor.id}`}
                            onClick={e => e.stopPropagation()}
                            className="font-caption text-caption text-on-surface-variant hover:text-primary truncate transition-colors"
                        >
                            {course.instructor?.name}
                        </Link>
                    ) : (
                        <span className="font-caption text-caption text-on-surface-variant truncate">{course.instructor?.name}</span>
                    )}
                </div>

                {/* Star rating row */}
                <div className="flex items-center gap-0.5 mb-md">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <span
                            key={i}
                            className="material-symbols-outlined text-secondary-container text-[15px]"
                            style={{ fontVariationSettings: i <= Math.round(rating) ? "'FILL' 1" : "'FILL' 0" }}
                        >
                            star
                        </span>
                    ))}
                    <span className="font-caption text-caption text-on-surface-variant ml-1">({reviewCount})</span>
                </div>

                {/* Price + Cart */}
                <div className="mt-auto flex items-center justify-between">
                    <div className="flex flex-col">
                        {hasDiscount ? (
                            <>
                                <span className="font-caption text-caption text-on-surface-variant line-through">{rupiah(course.price)}</span>
                                <span className="font-body-lg text-body-lg font-bold text-primary">{rupiah(course.discounted_price)}</span>
                            </>
                        ) : Number(course.price) === 0 ? (
                            <span className="font-body-lg text-body-lg font-bold text-success">Gratis</span>
                        ) : (
                            <span className="font-body-lg text-body-lg font-bold text-primary">{rupiah(course.price)}</span>
                        )}
                        {cartMsg && <span className="font-caption text-caption text-error mt-xs">{cartMsg}</span>}
                    </div>
                    {!isInstructor && (
                        <button
                            onClick={handleCartAdd}
                            disabled={cartLoading || inCart}
                            className={`p-2 rounded-full transition-all ${
                                inCart
                                    ? 'bg-success/10 text-success cursor-default'
                                    : 'text-primary hover:bg-primary-fixed/20'
                            } ${cartLoading ? 'opacity-60 cursor-wait' : ''}`}
                            aria-label={inCart ? 'Sudah di Keranjang' : 'Tambah ke Keranjang'}
                        >
                            <span
                                className="material-symbols-outlined text-[22px]"
                                style={{ fontVariationSettings: inCart ? "'FILL' 1" : "'FILL' 0" }}
                            >
                                {inCart ? 'check_circle' : 'shopping_cart'}
                            </span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

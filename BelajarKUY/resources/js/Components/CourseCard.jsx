import { Link, usePage } from '@inertiajs/react';
import { Star, ShoppingCart, Heart, Check } from 'lucide-react';
import { useState } from 'react';

const rupiah = (n) => 'Rp ' + Number(n ?? 0).toLocaleString('id-ID');

/**
 * Komponen reusable CourseCard (≥2 layar).
 *
 * Props:
 *   course        – objek Course (lihat model Course)
 *   isWishlisted  – boolean (opsional), status wishlist awal
 *   onWishlistChange – callback(courseId, newIsWishlisted) opsional
 *   isInCart      – boolean (opsional), sudah di keranjang
 */
export default function CourseCard({ course, isWishlisted: initialWishlisted = false, onWishlistChange, isInCart: initialInCart = false }) {
    const { auth } = usePage().props;
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

    // Helper CSRF
    function getCsrf() {
        return decodeURIComponent(
            document.cookie.split('; ').find((r) => r.startsWith('XSRF-TOKEN='))?.split('=')[1] ?? '',
        );
    }

    return (
        <div className="group bg-white rounded-3xl overflow-hidden border border-gray-100 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full relative">
            {/* Badges */}
            <div className="absolute top-4 left-4 z-10 flex flex-col gap-1.5">
                {course.bestseller && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                        Bestseller
                    </span>
                )}
                {course.featured && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                        Featured
                    </span>
                )}
            </div>

            {/* Tombol Wishlist */}
            <button
                onClick={handleWishlistToggle}
                disabled={loading}
                className={`absolute top-4 right-4 z-10 w-9 h-9 rounded-full border flex items-center justify-center transition-all ${
                    wishlisted
                        ? 'bg-red-500 border-red-500 text-white hover:bg-red-600'
                        : 'bg-white/90 border-gray-100 text-gray-500 hover:text-red-500'
                } ${loading ? 'opacity-60 cursor-wait' : ''}`}
                aria-label={wishlisted ? 'Hapus dari Wishlist' : 'Tambah ke Wishlist'}
                title={wishlisted ? 'Hapus dari Wishlist' : 'Tambah ke Wishlist'}
            >
                <Heart className={`w-5 h-5 ${wishlisted ? 'fill-current' : ''}`} />
            </button>

            {/* Thumbnail */}
            <Link href={`/courses/${course.slug}`} className="block overflow-hidden bg-gray-50 aspect-video">
                <img
                    src={
                        course.thumbnail ||
                        'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80'
                    }
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
            </Link>

            {/* Konten */}
            <div className="p-6 flex flex-col flex-1">
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg w-max mb-3 uppercase tracking-wider">
                    {course.category?.name ?? 'Kategori'}
                </span>
                <h3 className="text-base font-bold text-gray-900 leading-snug group-hover:text-indigo-600 mb-2 line-clamp-2 min-h-[2.75rem]">
                    <Link href={`/courses/${course.slug}`}>{course.title}</Link>
                </h3>

                <div className="flex items-center gap-2.5 mb-4">
                    <img
                        src={
                            course.instructor?.photo ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                course.instructor?.name ?? 'BK',
                            )}&background=4F46E5&color=fff`
                        }
                        alt={course.instructor?.name}
                        className="h-6 w-6 rounded-full object-cover border border-indigo-100"
                    />
                    <span className="text-xs font-medium text-gray-600 truncate">{course.instructor?.name}</span>
                </div>

                <div className="flex items-center gap-1.5 mb-4">
                    <div className="flex items-center text-amber-400">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <Star
                                key={i}
                                className={`w-4 h-4 ${i <= Math.round(rating) ? 'fill-current' : 'text-gray-200'}`}
                            />
                        ))}
                    </div>
                    <span className="text-sm font-bold text-gray-800">{rating.toFixed(1)}</span>
                    <span className="text-xs text-gray-400">({reviewCount} ulasan)</span>
                </div>

                <div className="mt-auto border-t border-gray-50 pt-4 flex items-center justify-between">
                    <div className="flex flex-col">
                        {hasDiscount ? (
                            <>
                                <span className="text-xs text-gray-400 line-through">{rupiah(course.price)}</span>
                                <span className="text-lg font-extrabold text-indigo-600">
                                    {rupiah(course.discounted_price)}
                                </span>
                            </>
                        ) : Number(course.price) === 0 ? (
                            <span className="text-lg font-extrabold text-emerald-600">Gratis</span>
                        ) : (
                            <span className="text-lg font-extrabold text-gray-900">{rupiah(course.price)}</span>
                        )}
                        {cartMsg && <span className="text-xs text-red-500 mt-0.5">{cartMsg}</span>}
                    </div>
                    <button
                        onClick={handleCartAdd}
                        disabled={cartLoading || inCart}
                        className={`p-2.5 rounded-2xl transition-all ${
                            inCart
                                ? 'bg-emerald-50 text-emerald-600 cursor-default'
                                : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white'
                        } ${cartLoading ? 'opacity-60 cursor-wait' : ''}`}
                        aria-label={inCart ? 'Sudah di Keranjang' : 'Tambah ke Keranjang'}
                        title={inCart ? 'Sudah di Keranjang' : 'Tambah ke Keranjang'}
                    >
                        {inCart ? <Check className="w-5 h-5" /> : <ShoppingCart className="w-5 h-5" />}
                    </button>
                </div>
            </div>
        </div>
    );
}

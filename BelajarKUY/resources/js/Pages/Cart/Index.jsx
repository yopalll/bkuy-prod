import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    ShoppingCart,
    Trash2,
    Heart,
    BookOpen,
    Star,
    ArrowRight,
    Tag,
    Package,
} from 'lucide-react';
import { useState } from 'react';
import EmptyState from '@/Components/EmptyState';

const rupiah = (n) => 'Rp ' + Number(n ?? 0).toLocaleString('id-ID');

// ========================= CartItemRow =========================
function CartItemRow({ item, onRemove, onMoveToWishlist, isInWishlist }) {
    const { course } = item;
    const rating = Number(course.average_rating ?? 0);
    const hasDiscount = (course.discount ?? 0) > 0;
    const [removing, setRemoving] = useState(false);
    const [moving, setMoving] = useState(false);

    async function handleRemove() {
        if (removing) return;
        setRemoving(true);
        try {
            await onRemove(item.id);
        } finally {
            setRemoving(false);
        }
    }

    async function handleMove() {
        if (moving) return;
        setMoving(true);
        try {
            await onMoveToWishlist(item.id);
        } finally {
            setMoving(false);
        }
    }

    return (
        <div className="flex gap-4 sm:gap-6 p-5 sm:p-6 border-b border-gray-50 last:border-0 group hover:bg-gray-50/60 transition-colors">
            {/* Thumbnail */}
            <Link
                href={`/courses/${course.slug}`}
                className="shrink-0 w-24 sm:w-32 h-16 sm:h-20 rounded-2xl overflow-hidden bg-gray-100 block"
            >
                <img
                    src={
                        course.thumbnail ||
                        'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80'
                    }
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
            </Link>

            {/* Info kursus */}
            <div className="flex-1 min-w-0">
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                    {course.category?.name ?? 'Kategori'}
                </span>
                <h3 className="mt-1.5 text-sm sm:text-base font-bold text-gray-900 line-clamp-2 leading-snug">
                    <Link href={`/courses/${course.slug}`} className="hover:text-indigo-600 transition-colors">
                        {course.title}
                    </Link>
                </h3>

                {/* Instruktur */}
                <div className="flex items-center gap-1.5 mt-1.5">
                    <img
                        src={
                            course.instructor?.photo ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                course.instructor?.name ?? 'BK',
                            )}&background=4F46E5&color=fff`
                        }
                        alt={course.instructor?.name}
                        className="w-5 h-5 rounded-full object-cover"
                    />
                    <span className="text-xs text-gray-500 truncate">{course.instructor?.name}</span>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1 mt-1.5">
                    <div className="flex text-amber-400">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <Star key={i} className={`w-3.5 h-3.5 ${i <= Math.round(rating) ? 'fill-current' : 'text-gray-200'}`} />
                        ))}
                    </div>
                    <span className="text-xs font-bold text-gray-700">{rating.toFixed(1)}</span>
                    <span className="text-xs text-gray-400">({course.reviews_count ?? 0})</span>
                </div>

                {/* Aksi bawah */}
                <div className="flex items-center gap-3 mt-3">
                    <button
                        onClick={handleRemove}
                        disabled={removing}
                        className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-medium disabled:opacity-50"
                        title="Hapus dari keranjang"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                        {removing ? 'Menghapus...' : 'Hapus'}
                    </button>

                    {!isInWishlist && (
                        <>
                            <span className="text-gray-200">|</span>
                            <button
                                onClick={handleMove}
                                disabled={moving}
                                className="flex items-center gap-1 text-xs text-indigo-500 hover:text-indigo-700 font-medium disabled:opacity-50"
                                title="Pindah ke Wishlist"
                            >
                                <Heart className="w-3.5 h-3.5" />
                                {moving ? 'Memindahkan...' : 'Pindah ke Wishlist'}
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Harga */}
            <div className="shrink-0 text-right">
                {hasDiscount ? (
                    <>
                        <span className="block text-xs text-gray-400 line-through">{rupiah(course.price)}</span>
                        <span className="block text-base sm:text-lg font-extrabold text-indigo-600">
                            {rupiah(course.discounted_price)}
                        </span>
                        <span className="inline-block mt-1 text-xs font-bold text-orange-500 bg-orange-50 rounded-full px-2 py-0.5">
                            -{course.discount}%
                        </span>
                    </>
                ) : Number(course.price) === 0 ? (
                    <span className="text-base font-extrabold text-emerald-600">Gratis</span>
                ) : (
                    <span className="text-base sm:text-lg font-extrabold text-gray-900">{rupiah(course.price)}</span>
                )}
            </div>
        </div>
    );
}

// ========================= OrderSummary =========================
function OrderSummary({ subtotal, itemCount }) {
    return (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sticky top-24">
            <h2 className="text-lg font-extrabold text-gray-900 mb-5">Ringkasan Pesanan</h2>

            <div className="space-y-3 mb-5">
                <div className="flex justify-between text-sm text-gray-600">
                    <span>
                        {itemCount} kursus
                    </span>
                    <span className="font-medium">{rupiah(subtotal)}</span>
                </div>
                <div className="border-t border-dashed border-gray-100 pt-3 flex justify-between">
                    <span className="font-bold text-gray-900">Total</span>
                    <span className="font-extrabold text-xl text-indigo-600">{rupiah(subtotal)}</span>
                </div>
            </div>

            {/* Info kupon (placeholder, diaktifkan di L8) */}
            <div className="mb-5 flex items-center gap-2 rounded-2xl bg-gray-50 border border-dashed border-gray-200 px-4 py-3 text-sm text-gray-400">
                <Tag className="w-4 h-4 shrink-0" />
                <span>Kode kupon tersedia saat checkout</span>
            </div>

            <Link
                href="/checkout"
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3.5 text-sm font-bold text-white hover:bg-indigo-700 transition-colors"
            >
                Lanjut ke Checkout
                <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
                href="/home"
                className="mt-3 w-full flex items-center justify-center gap-2 rounded-2xl border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-700 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
            >
                <BookOpen className="w-4 h-4" />
                Cari kursus lain
            </Link>
        </div>
    );
}

// ========================= Page =========================
export default function CartIndex({ cartItems, subtotal, wishlistIds }) {
    const { auth } = usePage().props;

    // State lokal cart (untuk update UI tanpa full-page reload)
    const [items, setItems] = useState(cartItems ?? []);
    const [total, setTotal]   = useState(subtotal ?? 0);
    const [wIds, setWIds]     = useState(wishlistIds ?? []);

    // Helper ambil CSRF token
    function getCsrf() {
        return decodeURIComponent(
            document.cookie
                .split('; ')
                .find((r) => r.startsWith('XSRF-TOKEN='))
                ?.split('=')[1] ?? '',
        );
    }

    async function handleRemove(cartItemId) {
        const res = await fetch(`/cart/${cartItemId}`, {
            method: 'DELETE',
            headers: {
                'X-XSRF-TOKEN': getCsrf(),
                Accept: 'application/json',
            },
        });
        if (res.ok) {
            const removed = items.find((i) => i.id === cartItemId);
            const newItems = items.filter((i) => i.id !== cartItemId);
            setItems(newItems);
            if (removed) {
                const price = Number(removed.course.discounted_price ?? removed.course.price ?? 0);
                setTotal((prev) => Math.max(0, prev - price));
            }
        }
    }

    async function handleMoveToWishlist(cartItemId) {
        const res = await fetch(`/cart/${cartItemId}/move-to-wishlist`, {
            method: 'POST',
            headers: {
                'X-XSRF-TOKEN': getCsrf(),
                Accept: 'application/json',
            },
        });
        if (res.ok) {
            const moved = items.find((i) => i.id === cartItemId);
            const newItems = items.filter((i) => i.id !== cartItemId);
            setItems(newItems);
            if (moved) {
                const price = Number(moved.course.discounted_price ?? moved.course.price ?? 0);
                setTotal((prev) => Math.max(0, prev - price));
                setWIds((prev) => [...prev, moved.course.id]);
            }
        }
    }

    const itemCount = items.length;

    return (
        <AppLayout>
            <Head title="Keranjang Belanja" />

            {/* Hero breadcrumb */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3 mb-3">
                        <ShoppingCart className="w-7 h-7 text-white/80" />
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Keranjang Belanja</h1>
                    </div>
                    <p className="text-indigo-100 text-sm">
                        {itemCount > 0
                            ? `${itemCount} kursus siap untuk dibeli`
                            : 'Belum ada kursus yang ditambahkan ke keranjang'}
                    </p>
                </div>
            </div>

            {/* Konten */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {itemCount === 0 ? (
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm">
                        <EmptyState
                            icon={<Package className="w-10 h-10" />}
                            title="Keranjang masih kosong"
                            description="Tambahkan kursus yang ingin kamu beli ke keranjang, lalu lanjutkan ke checkout."
                            size="lg"
                            action={
                                <Link
                                    href="/home"
                                    className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
                                >
                                    <BookOpen className="w-4 h-4" />
                                    Jelajahi Kursus
                                </Link>
                            }
                        />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Daftar item cart */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                                {/* Header list */}
                                <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
                                    <h2 className="font-extrabold text-gray-900">
                                        {itemCount} Kursus
                                    </h2>
                                    <span className="text-sm text-gray-400">Total: {rupiah(total)}</span>
                                </div>

                                {/* Item rows */}
                                {items.map((item) => (
                                    <CartItemRow
                                        key={item.id}
                                        item={item}
                                        onRemove={handleRemove}
                                        onMoveToWishlist={handleMoveToWishlist}
                                        isInWishlist={wIds.includes(item.course.id)}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Ringkasan pesanan */}
                        <div>
                            <OrderSummary subtotal={total} itemCount={itemCount} />
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

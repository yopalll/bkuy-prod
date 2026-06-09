import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

const rupiah = (n) => 'Rp ' + Number(n ?? 0).toLocaleString('id-ID');

function getCsrf() {
    return decodeURIComponent(
        document.cookie.split('; ').find((r) => r.startsWith('XSRF-TOKEN='))?.split('=')[1] ?? '',
    );
}

// ========================= CartItemRow =========================
function CartItemRow({ item, onRemove, onMoveToWishlist, isInWishlist }) {
    const { course } = item;
    const rating     = Number(course.average_rating ?? 0);
    const hasDiscount = (course.discount ?? 0) > 0;
    const [removing, setRemoving] = useState(false);
    const [moving, setMoving]     = useState(false);

    async function handleRemove() {
        if (removing) return;
        setRemoving(true);
        try { await onRemove(item.id); } finally { setRemoving(false); }
    }

    async function handleMove() {
        if (moving) return;
        setMoving(true);
        try { await onMoveToWishlist(item.id); } finally { setMoving(false); }
    }

    return (
        <div className="bg-surface rounded-2xl p-md flex flex-col sm:flex-row gap-md items-start border border-primary/10 transition-all hover:shadow-md hover:shadow-primary/10"
             style={{ boxShadow: '0 1px 4px rgba(48,0,51,0.05)' }}>

            {/* Thumbnail */}
            <Link href={`/courses/${course.slug}`}
                  className="w-full sm:w-48 h-32 rounded-lg overflow-hidden shrink-0 bg-surface-variant block">
                <img
                    src={course.thumbnail || 'https://placehold.co/600x340/300033/ffffff?text=BelajarKUY'}
                    alt={course.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        if (!e.currentTarget.dataset.fallback) {
                            e.currentTarget.dataset.fallback = '1';
                            e.currentTarget.src = 'https://placehold.co/600x340/300033/ffffff?text=BelajarKUY';
                        }
                    }}
                />
            </Link>

            {/* Info + Harga */}
            <div className="flex flex-col flex-grow justify-between h-full w-full">
                <div className="flex justify-between items-start gap-sm">
                    <div className="min-w-0">
                        <span className="inline-block px-2 py-1 bg-primary/10 text-primary font-caption text-caption rounded-full mb-xs">
                            {course.category?.name ?? 'Kursus'}
                        </span>
                        <h3 className="font-headline-md text-[18px] leading-[26px] font-bold text-on-surface line-clamp-2">
                            <Link href={`/courses/${course.slug}`} className="hover:text-primary transition-colors">
                                {course.title}
                            </Link>
                        </h3>
                        <p className="font-body-md text-[13px] text-on-surface-variant mt-xs truncate">
                            Oleh {course.instructor?.name ?? '—'}
                        </p>
                        {rating > 0 && (
                            <div className="flex items-center gap-xs mt-xs">
                                <span className="font-caption text-caption font-bold text-on-surface">{rating.toFixed(1)}</span>
                                <span
                                    className="material-symbols-outlined text-secondary-container text-[14px]"
                                    style={{ fontVariationSettings: "'FILL' 1" }}
                                >star</span>
                                <span className="font-caption text-caption text-on-surface-variant">({course.reviews_count ?? 0})</span>
                            </div>
                        )}
                    </div>

                    {/* Harga */}
                    <div className="text-right shrink-0">
                        {hasDiscount ? (
                            <>
                                <span className="font-caption text-caption text-on-surface-variant line-through block">
                                    {rupiah(course.price)}
                                </span>
                                <span className="font-headline-md text-[20px] font-bold text-primary block">
                                    {rupiah(course.discounted_price)}
                                </span>
                            </>
                        ) : Number(course.price) === 0 ? (
                            <span className="font-headline-md text-[20px] font-bold text-success block">Gratis</span>
                        ) : (
                            <span className="font-headline-md text-[20px] font-bold text-primary block">
                                {rupiah(course.price)}
                            </span>
                        )}
                    </div>
                </div>

                {/* Aksi */}
                <div className="flex items-center gap-xs mt-md pt-sm border-t border-surface-variant">
                    <button
                        onClick={handleRemove}
                        disabled={removing}
                        className="flex items-center gap-xs text-error font-label-md text-label-md px-3 py-2 rounded-lg hover:bg-error/10 transition-colors disabled:opacity-50"
                    >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                        {removing ? 'Menghapus...' : 'Hapus'}
                    </button>

                    {!isInWishlist && (
                        <button
                            onClick={handleMove}
                            disabled={moving}
                            className="flex items-center gap-xs text-on-surface-variant font-label-md text-label-md px-3 py-2 rounded-lg hover:bg-surface-container transition-colors disabled:opacity-50"
                        >
                            <span className="material-symbols-outlined text-[18px]">favorite</span>
                            {moving ? 'Memindahkan...' : 'Pindah ke Wishlist'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

// ========================= CouponPanel =========================
function CouponPanel({ courseIds, subtotal, onApply, onRemove, applied }) {
    const [code, setCode]       = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError]     = useState('');

    async function handleApply(e) {
        e.preventDefault();
        if (!code.trim() || loading) return;
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/coupon/apply', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept:         'application/json',
                    'X-XSRF-TOKEN': getCsrf(),
                },
                body: JSON.stringify({
                    coupon_code: code.trim().toUpperCase(),
                    course_ids:  courseIds,
                    subtotal,
                }),
            });
            const json = await res.json();
            if (res.ok && json.success) { onApply(json); setCode(''); }
            else { setError(json.message ?? 'Kupon tidak valid.'); }
        } catch {
            setError('Gagal menghubungi server. Coba lagi.');
        } finally {
            setLoading(false);
        }
    }

    if (applied) {
        return (
            <div className="mb-md">
                <div className="flex items-center gap-sm rounded-lg bg-success/10 border border-success/30 px-md py-sm">
                    <span className="material-symbols-outlined text-success text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                        check_circle
                    </span>
                    <div className="flex-1 min-w-0">
                        <p className="font-caption text-caption text-success font-bold">Kupon diterapkan!</p>
                        <p className="font-label-md text-label-md text-success font-mono">{applied.coupon_code}</p>
                        <p className="font-caption text-caption text-success">
                            Hemat {applied.discount_percent}% — {rupiah(applied.discount_amount)}
                        </p>
                    </div>
                    <button
                        onClick={onRemove}
                        className="p-1 rounded text-success hover:bg-success/20 transition-colors"
                        title="Batalkan kupon"
                    >
                        <span className="material-symbols-outlined text-[18px]">close</span>
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="mb-md">
            <label className="font-label-md text-label-md text-on-surface-variant block mb-xs">
                Kode Kupon / Promo
            </label>
            <form onSubmit={handleApply} className="flex gap-xs">
                <div className="relative flex-grow">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
                        local_offer
                    </span>
                    <input
                        type="text"
                        value={code}
                        onChange={(e) => { setCode(e.target.value.toUpperCase()); setError(''); }}
                        placeholder="Masukkan kode"
                        className="w-full bg-surface-container-low border-2 border-surface-variant focus:border-primary rounded-lg pl-10 pr-3 py-2 font-body-md text-body-md text-on-surface outline-none transition-colors"
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading || !code.trim()}
                    className="bg-surface-variant text-on-surface font-label-md text-label-md px-md py-2 rounded-lg hover:bg-surface-dim transition-colors whitespace-nowrap disabled:opacity-50"
                >
                    {loading ? '...' : 'Terapkan'}
                </button>
            </form>
            {error && (
                <p className="mt-xs font-caption text-caption text-error flex items-center gap-xs">
                    <span className="material-symbols-outlined text-[14px]">error</span> {error}
                </p>
            )}
        </div>
    );
}

// ========================= OrderSummary =========================
function OrderSummary({ subtotal, itemCount, coupon, courseIds, onCouponApply, onCouponRemove }) {
    const finalTotal = coupon ? coupon.final_price : subtotal;

    return (
        <div className="bg-surface rounded-2xl p-lg border border-primary/10 sticky top-[100px]"
             style={{ boxShadow: '0 4px 16px rgba(48,0,51,0.10)' }}>
            <h2 className="font-headline-md text-[20px] font-bold text-on-surface mb-md">Ringkasan Pesanan</h2>

            <CouponPanel
                courseIds={courseIds}
                subtotal={subtotal}
                applied={coupon}
                onApply={onCouponApply}
                onRemove={onCouponRemove}
            />

            <div className="space-y-sm py-md border-t border-b border-surface-variant mb-md">
                <div className="flex justify-between items-center font-body-md text-body-md text-on-surface-variant">
                    <span>Subtotal ({itemCount} kursus)</span>
                    <span>{rupiah(subtotal)}</span>
                </div>
                {coupon && (
                    <div className="flex justify-between items-center font-body-md text-body-md text-success">
                        <span>Diskon kupon ({coupon.discount_percent}%)</span>
                        <span>-{rupiah(coupon.discount_amount)}</span>
                    </div>
                )}
            </div>

            <div className="flex justify-between items-end mb-lg">
                <span className="font-headline-md text-[18px] font-bold text-on-surface">Total Akhir</span>
                <span className="font-headline-md text-[28px] font-extrabold text-primary leading-none">
                    {rupiah(finalTotal)}
                </span>
            </div>

            <Link
                href="/checkout"
                className="w-full bg-warning text-on-secondary font-label-md text-[16px] leading-[24px] py-3 rounded-lg flex items-center justify-center gap-sm hover:opacity-90 transition-opacity shadow-sm"
            >
                Lanjut ke Checkout
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </Link>

            <p className="font-caption text-caption text-center text-on-surface-variant mt-sm">
                Garansi 30 hari uang kembali jika tidak puas.
            </p>

            <Link
                href="/home"
                className="mt-md w-full flex items-center justify-center gap-xs font-label-md text-label-md text-on-surface-variant border border-outline-variant rounded-lg py-2 hover:border-primary hover:text-primary transition-colors"
            >
                <span className="material-symbols-outlined text-[18px]">menu_book</span>
                Cari kursus lain
            </Link>
        </div>
    );
}

// ========================= Page =========================
export default function CartIndex({ cartItems, subtotal, wishlistIds }) {
    const [items, setItems]                 = useState(cartItems ?? []);
    const [total, setTotal]                 = useState(subtotal ?? 0);
    const [wIds, setWIds]                   = useState(wishlistIds ?? []);
    const [coupon, setCoupon]               = useState(null);
    const [movedToWishlist, setMoved]       = useState(false);

    async function handleRemove(cartItemId) {
        const res = await fetch(`/cart/${cartItemId}`, {
            method: 'DELETE',
            headers: { 'X-XSRF-TOKEN': getCsrf(), Accept: 'application/json' },
        });
        if (res.ok) {
            const removed = items.find((i) => i.id === cartItemId);
            setItems(items.filter((i) => i.id !== cartItemId));
            if (removed) {
                const price = Number(removed.course.discounted_price ?? removed.course.price ?? 0);
                setTotal((prev) => Math.max(0, prev - price));
            }
        }
    }

    async function handleMoveToWishlist(cartItemId) {
        const res = await fetch(`/cart/${cartItemId}/move-to-wishlist`, {
            method: 'POST',
            headers: { 'X-XSRF-TOKEN': getCsrf(), Accept: 'application/json' },
        });
        if (res.ok) {
            const moved = items.find((i) => i.id === cartItemId);
            setItems(items.filter((i) => i.id !== cartItemId));
            if (moved) {
                const price = Number(moved.course.discounted_price ?? moved.course.price ?? 0);
                setTotal((prev) => Math.max(0, prev - price));
                setWIds((prev) => [...prev, moved.course.id]);
            }
            setMoved(true);
        }
    }

    const courseIds = items.map((i) => i.course.id);
    const itemCount = items.length;

    return (
        <AppLayout>
            <Head title="Keranjang Belanja" />

            <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop py-xl">

                {/* Heading */}
                <div className="mb-lg">
                    <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">
                        Keranjang Belanja
                    </h1>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-xs">
                        {itemCount > 0
                            ? `${itemCount} kursus di keranjang Anda`
                            : 'Belum ada kursus di keranjang'}
                    </p>
                </div>

                {/* Banner setelah pindah ke wishlist */}
                {movedToWishlist && (
                    <div className="mb-md flex items-center gap-sm bg-primary-fixed/20 border border-primary/20 rounded-lg px-md py-sm">
                        <span
                            className="material-symbols-outlined text-primary text-[18px]"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                        >favorite</span>
                        <p className="font-label-md text-label-md text-on-surface flex-1">
                            Kursus dipindahkan ke Wishlist.
                        </p>
                        <Link
                            href="/wishlist"
                            className="font-label-md text-label-md text-primary hover:underline flex items-center gap-xs whitespace-nowrap"
                        >
                            Lihat Wishlist
                            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                        </Link>
                        <button
                            onClick={() => setMoved(false)}
                            className="text-on-surface-variant hover:text-on-surface ml-xs"
                        >
                            <span className="material-symbols-outlined text-[18px]">close</span>
                        </button>
                    </div>
                )}

                {/* Empty state */}
                {itemCount === 0 ? (
                    <div className="bg-surface rounded-2xl border border-primary/10 p-xl flex flex-col items-center text-center"
                         style={{ boxShadow: '0 4px 24px rgba(48,0,51,0.08)' }}>
                        <span className="material-symbols-outlined text-[64px] text-outline mb-md">shopping_cart</span>
                        <h2 className="font-headline-md text-headline-md text-on-surface mb-sm">
                            Keranjang masih kosong
                        </h2>
                        <p className="font-body-md text-body-md text-on-surface-variant max-w-sm mb-lg">
                            Tambahkan kursus yang ingin kamu beli ke keranjang, lalu lanjutkan ke checkout.
                        </p>
                        <Link
                            href="/home"
                            className="bg-primary text-on-primary font-label-md text-label-md py-3 px-xl rounded-lg hover:opacity-90 transition-opacity flex items-center gap-xs"
                        >
                            <span className="material-symbols-outlined text-[20px]">search</span>
                            Jelajahi Kursus
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-gutter">
                        {/* Daftar item */}
                        <div className="w-full lg:w-2/3 flex flex-col gap-md">
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

                        {/* Ringkasan pesanan */}
                        <div className="w-full lg:w-1/3">
                            <OrderSummary
                                subtotal={total}
                                itemCount={itemCount}
                                coupon={coupon}
                                courseIds={courseIds}
                                onCouponApply={setCoupon}
                                onCouponRemove={() => setCoupon(null)}
                            />
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

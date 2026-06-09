import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

const rupiah = (n) => 'Rp ' + Number(n ?? 0).toLocaleString('id-ID');

function getCsrf() {
    return decodeURIComponent(
        document.cookie.split('; ').find((r) => r.startsWith('XSRF-TOKEN='))?.split('=')[1] ?? '',
    );
}

function WishlistCard({ item, onRemove, cartIds }) {
    const { course } = item;
    const hasDiscount = (course.discount ?? 0) > 0;
    const rating      = Number(course.average_rating ?? 0);

    const [removing, setRemoving] = useState(false);
    const [inCart, setInCart]     = useState(cartIds?.includes(course.id) ?? false);
    const [addingCart, setAdding] = useState(false);

    async function handleRemove() {
        if (removing) return;
        setRemoving(true);
        try {
            const res = await fetch(`/wishlist/${course.id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-XSRF-TOKEN': getCsrf(), Accept: 'application/json' },
            });
            if (res.ok) onRemove(item.id);
        } finally {
            setRemoving(false);
        }
    }

    async function handleAddCart() {
        if (addingCart || inCart) return;
        setAdding(true);
        try {
            const res = await fetch(`/cart/${course.id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-XSRF-TOKEN': getCsrf(), Accept: 'application/json' },
            });
            if (res.ok) setInCart(true);
        } finally {
            setAdding(false);
        }
    }

    return (
        <div className="bg-surface rounded-2xl overflow-hidden border border-primary/10 flex flex-col transition-all hover:-translate-y-0.5 hover:shadow-md hover:shadow-primary/10"
             style={{ boxShadow: '0 4px 24px rgba(48,0,51,0.06)' }}>

            {/* Thumbnail */}
            <div className="relative h-40 overflow-hidden bg-surface-container-high">
                <Link href={`/courses/${course.slug}`}>
                    <img
                        src={course.thumbnail || 'https://placehold.co/600x340/300033/ffffff?text=BelajarKUY'}
                        alt={course.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                            if (!e.currentTarget.dataset.fallback) {
                                e.currentTarget.dataset.fallback = '1';
                                e.currentTarget.src = 'https://placehold.co/600x340/300033/ffffff?text=BelajarKUY';
                            }
                        }}
                    />
                </Link>

                {/* Badge bestseller/featured */}
                {(course.bestseller || course.featured) && (
                    <div className="absolute top-3 left-3 flex flex-col gap-xs">
                        {course.bestseller && (
                            <span className="font-caption text-caption px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-bold">
                                Bestseller
                            </span>
                        )}
                        {course.featured && (
                            <span className="font-caption text-caption px-2 py-0.5 rounded-full bg-primary-container text-on-primary-container font-bold">
                                Unggulan
                            </span>
                        )}
                    </div>
                )}

                {/* Hapus dari wishlist */}
                <button
                    onClick={handleRemove}
                    disabled={removing}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-error-container text-on-error-container flex items-center justify-center hover:bg-error hover:text-on-error transition-colors disabled:opacity-50"
                    title="Hapus dari Wishlist"
                >
                    <span className="material-symbols-outlined text-[18px]">
                        {removing ? 'hourglass_empty' : 'delete'}
                    </span>
                </button>
            </div>

            {/* Body */}
            <div className="p-md flex flex-col flex-1">
                {course.category && (
                    <span className="font-caption text-caption text-primary bg-primary/10 px-2 py-0.5 rounded-full w-max mb-sm">
                        {course.category.name}
                    </span>
                )}

                <h3 className="font-label-md text-label-md text-on-surface font-bold line-clamp-2 mb-xs flex-1">
                    <Link href={`/courses/${course.slug}`} className="hover:text-primary transition-colors">
                        {course.title}
                    </Link>
                </h3>

                {course.instructor && (
                    <p className="font-caption text-caption text-on-surface-variant mb-sm">
                        {course.instructor.name}
                    </p>
                )}

                {rating > 0 && (
                    <div className="flex items-center gap-xs mb-sm">
                        <span
                            className="material-symbols-outlined text-[16px] text-secondary-container"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                        >star</span>
                        <span className="font-label-md text-label-md text-on-surface">{rating.toFixed(1)}</span>
                        <span className="font-caption text-caption text-on-surface-variant">
                            ({course.reviews_count ?? 0})
                        </span>
                    </div>
                )}

                {/* Harga + CTA */}
                <div className="mt-auto flex items-center justify-between pt-sm border-t border-outline-variant/30">
                    <div className="flex flex-col">
                        {hasDiscount ? (
                            <>
                                <span className="font-caption text-caption text-on-surface-variant line-through">
                                    {rupiah(course.price)}
                                </span>
                                <span className="font-label-md text-label-md text-primary font-bold">
                                    {rupiah(course.discounted_price)}
                                </span>
                            </>
                        ) : Number(course.price) === 0 ? (
                            <span className="font-label-md text-label-md text-success font-bold">Gratis</span>
                        ) : (
                            <span className="font-label-md text-label-md text-on-surface font-bold">
                                {rupiah(course.price)}
                            </span>
                        )}
                    </div>

                    <button
                        onClick={handleAddCart}
                        disabled={inCart || addingCart}
                        className={`font-label-md text-label-md px-md py-xs rounded-lg flex items-center gap-xs transition-colors ${
                            inCart
                                ? 'bg-success/10 text-success cursor-default'
                                : 'bg-primary-container text-on-primary-container hover:bg-primary hover:text-on-primary'
                        } ${addingCart ? 'opacity-60 cursor-wait' : ''}`}
                    >
                        <span className="material-symbols-outlined text-[16px]"
                              style={{ fontVariationSettings: inCart ? "'FILL' 1" : "'FILL' 0" }}>
                            {inCart ? 'check_circle' : 'shopping_cart'}
                        </span>
                        {inCart ? 'Di Keranjang' : addingCart ? '...' : 'Keranjang'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function WishlistIndex({ wishlists: initialWishlists, cartIds }) {
    const [wishlists, setWishlists] = useState(initialWishlists ?? []);

    function handleRemove(wishlistId) {
        setWishlists((prev) => prev.filter((item) => item.id !== wishlistId));
    }

    const count = wishlists.length;

    return (
        <AppLayout>
            <Head title="Wishlist Saya" />

            <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop py-xl">

                {/* Heading */}
                <div className="flex items-end justify-between mb-xl">
                    <div>
                        <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">
                            Wishlist Saya
                        </h1>
                        <p className="font-body-md text-body-md text-on-surface-variant mt-xs">
                            {count > 0 ? `${count} kursus tersimpan` : 'Belum ada kursus di wishlist'}
                        </p>
                    </div>
                    <div className="flex items-center gap-md">
                        <Link
                            href="/cart"
                            className="font-label-md text-label-md text-on-surface-variant hover:text-primary flex items-center gap-xs transition-colors"
                        >
                            <span className="material-symbols-outlined text-[18px]">shopping_cart</span>
                            Keranjang
                        </Link>
                        <Link
                            href="/home"
                            className="font-label-md text-label-md text-on-surface-variant hover:text-primary flex items-center gap-xs transition-colors"
                        >
                            Cari kursus lain
                            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                        </Link>
                    </div>
                </div>

                {/* Empty state */}
                {count === 0 ? (
                    <div className="bg-surface rounded-2xl border border-primary/10 p-xl flex flex-col items-center text-center"
                         style={{ boxShadow: '0 4px 24px rgba(48,0,51,0.08)' }}>
                        <span
                            className="material-symbols-outlined text-[64px] text-primary/30 mb-md"
                            style={{ fontVariationSettings: "'FILL' 0" }}
                        >favorite</span>
                        <h2 className="font-headline-md text-headline-md text-on-surface mb-sm">
                            Wishlist masih kosong
                        </h2>
                        <p className="font-body-md text-body-md text-on-surface-variant max-w-sm mb-lg">
                            Temukan kursus yang kamu suka, lalu klik ikon hati untuk menyimpannya di sini.
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-gutter">
                        {wishlists.map((item) => (
                            <WishlistCard
                                key={item.id}
                                item={item}
                                onRemove={handleRemove}
                                cartIds={cartIds}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

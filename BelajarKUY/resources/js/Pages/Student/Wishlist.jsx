import { Head, Link, router } from '@inertiajs/react';
import StudentLayout from '@/Layouts/StudentLayout';

const rupiah = (n) => 'Rp ' + Number(n ?? 0).toLocaleString('id-ID');

function WishlistCourseCard({ item, onRemove }) {
    const { course } = item;
    const hasDiscount  = (course.discount ?? 0) > 0;
    const rating       = Number(course.average_rating ?? 0);

    return (
        <div className="bg-surface rounded-2xl overflow-hidden border border-outline-variant/30 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 flex flex-col">
            {/* Thumbnail */}
            <div className="relative h-40 overflow-hidden bg-surface-container-high">
                {course.thumbnail ? (
                    <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-5xl text-outline">school</span>
                    </div>
                )}

                {/* Badge */}
                <div className="absolute top-3 left-3 flex flex-col gap-1">
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

                {/* Remove button */}
                <button
                    onClick={() => onRemove(item.id)}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-error-container text-on-error-container flex items-center justify-center hover:bg-error hover:text-on-error transition-colors"
                    title="Hapus dari Wishlist"
                >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                </button>
            </div>

            {/* Body */}
            <div className="p-md flex flex-col flex-1">
                {course.category && (
                    <span className="font-caption text-caption text-primary bg-primary/10 px-2 py-0.5 rounded-full w-max mb-sm">
                        {course.category.name}
                    </span>
                )}
                <h3 className="font-label-md text-label-md text-on-surface font-bold line-clamp-2 mb-sm flex-1">
                    <Link href={`/courses/${course.slug}`} className="hover:text-primary transition-colors">
                        {course.title}
                    </Link>
                </h3>
                {course.instructor && (
                    <p className="font-caption text-caption text-on-surface-variant mb-sm">
                        {course.instructor.name}
                    </p>
                )}

                {/* Rating */}
                {rating > 0 && (
                    <div className="flex items-center gap-xs mb-md">
                        <span className="material-symbols-outlined text-[16px] text-secondary-container"
                            style={{ fontVariationSettings: "'FILL' 1" }}>
                            star
                        </span>
                        <span className="font-label-md text-label-md text-on-surface">{rating.toFixed(1)}</span>
                        <span className="font-caption text-caption text-on-surface-variant">
                            ({course.reviews_count ?? 0} ulasan)
                        </span>
                    </div>
                )}

                {/* Price + CTA */}
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
                    <Link
                        href={`/courses/${course.slug}`}
                        className="bg-primary-container text-on-primary-container font-label-md text-label-md px-md py-xs rounded-lg hover:bg-primary hover:text-on-primary transition-colors flex items-center gap-xs"
                    >
                        Lihat
                        <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}

function EmptyWishlist() {
    return (
        <div className="flex-1 flex items-center justify-center p-gutter">
            <div className="bg-surface rounded-2xl p-xl max-w-2xl w-full flex flex-col items-center text-center shadow-[0_8px_30px_rgba(48,0,51,0.08)] border border-outline-variant/30">
                <div className="w-32 h-32 mb-lg flex items-center justify-center rounded-full bg-primary-fixed-dim/20">
                    <span className="material-symbols-outlined text-[72px] text-primary/30">favorite</span>
                </div>
                <h2 className="font-headline-md text-headline-md text-on-surface mb-sm">
                    Wishlist masih kosong
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant max-w-sm mx-auto mb-xl">
                    Temukan kursus yang kamu suka, lalu klik ikon hati untuk menyimpannya di sini.
                </p>
                <a
                    href="/home"
                    className="bg-primary text-on-primary font-label-md text-label-md py-3 px-xl rounded-lg shadow-sm hover:bg-primary-container transition-all flex items-center gap-2"
                >
                    <span className="material-symbols-outlined text-[20px]">search</span>
                    Jelajahi Kursus
                </a>
            </div>
        </div>
    );
}

export default function Wishlist({ wishlists }) {
    const count = wishlists?.length ?? 0;

    function handleRemove(wishlistId) {
        router.delete(`/student/wishlist/${wishlistId}`, { preserveScroll: true });
    }

    return (
        <StudentLayout>
            <Head title="Wishlist Saya" />

            {count === 0 ? (
                <EmptyWishlist />
            ) : (
                <div className="px-margin-mobile md:px-margin-desktop py-xl md:py-xxl">
                    {/* Header */}
                    <div className="flex items-end justify-between mb-xl">
                        <div>
                            <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary mb-xs">
                                Wishlist Saya
                            </h1>
                            <p className="font-body-md text-body-md text-on-surface-variant">
                                {count} kursus tersimpan
                            </p>
                        </div>
                        <a
                            href="/home"
                            className="text-secondary-container hover:text-secondary font-label-md text-label-md flex items-center gap-xs transition-colors"
                        >
                            Cari kursus lain
                            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                        </a>
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-gutter">
                        {wishlists.map((item) => (
                            <WishlistCourseCard key={item.id} item={item} onRemove={handleRemove} />
                        ))}
                    </div>
                </div>
            )}
        </StudentLayout>
    );
}

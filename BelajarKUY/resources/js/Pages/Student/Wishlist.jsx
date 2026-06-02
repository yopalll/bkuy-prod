import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Heart, ShoppingCart, Star, Trash2, BookOpen } from 'lucide-react';
import EmptyState from '@/Components/EmptyState';

const rupiah = (n) => 'Rp ' + Number(n ?? 0).toLocaleString('id-ID');

// ========================= WishlistCourseCard =========================
function WishlistCourseCard({ item, onRemove }) {
    const { course } = item;
    const rating = Number(course.average_rating ?? 0);
    const hasDiscount = (course.discount ?? 0) > 0;

    return (
        <div className="group bg-white rounded-3xl overflow-hidden border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full relative">
            {/* Badge */}
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

            {/* Tombol hapus wishlist */}
            <button
                onClick={() => onRemove(item.id)}
                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-red-50 border border-red-100 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all"
                aria-label="Hapus dari Wishlist"
                title="Hapus dari Wishlist"
            >
                <Trash2 className="w-4 h-4" />
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

            {/* Konten kartu */}
            <div className="p-6 flex flex-col flex-1">
                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg w-max mb-3 uppercase tracking-wider">
                    {course.category?.name ?? 'Kategori'}
                </span>

                <h3 className="text-base font-bold text-gray-900 leading-snug group-hover:text-indigo-600 mb-2 line-clamp-2 min-h-[2.75rem]">
                    <Link href={`/courses/${course.slug}`}>{course.title}</Link>
                </h3>

                {/* Instruktur */}
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
                    <span className="text-xs font-medium text-gray-600 truncate">
                        {course.instructor?.name}
                    </span>
                </div>

                {/* Rating */}
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
                    <span className="text-xs text-gray-400">({course.reviews_count ?? 0} ulasan)</span>
                </div>

                {/* Harga + Tombol cart */}
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
                    </div>
                    <Link
                        href={`/courses/${course.slug}`}
                        className="p-2.5 rounded-2xl bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all"
                        aria-label="Lihat Kursus"
                        title="Lihat Kursus"
                    >
                        <BookOpen className="w-5 h-5" />
                    </Link>
                </div>
            </div>
        </div>
    );
}

// ============================= Page ================================
export default function Wishlist({ wishlists }) {
    const count = wishlists?.length ?? 0;

    function handleRemove(wishlistId) {
        router.delete(`/student/wishlist/${wishlistId}`, {
            preserveScroll: true,
        });
    }

    return (
        <AppLayout>
            <Head title="Wishlist Saya" />

            {/* Hero breadcrumb */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3 mb-3">
                        <Heart className="w-7 h-7 text-white/80" />
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Wishlist Saya</h1>
                    </div>
                    <p className="text-indigo-100 text-sm">
                        {count > 0
                            ? `${count} kursus tersimpan dalam daftar keinginan kamu`
                            : 'Simpan kursus yang ingin kamu pelajari nanti'}
                    </p>
                </div>
            </div>

            {/* Konten */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {count === 0 ? (
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm">
                        <EmptyState
                            icon={<Heart className="w-10 h-10" />}
                            title="Wishlist masih kosong"
                            description="Temukan kursus yang kamu suka, lalu klik ikon hati untuk menyimpannya di sini."
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
                    <>
                        {/* Toolbar */}
                        <div className="flex items-center justify-between mb-6">
                            <p className="text-sm text-gray-500 font-medium">
                                <span className="font-extrabold text-gray-900">{count}</span> kursus
                            </p>
                            <Link
                                href="/home"
                                className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5"
                            >
                                <ShoppingCart className="w-4 h-4" />
                                Cari kursus lain
                            </Link>
                        </div>

                        {/* Grid kursus */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {wishlists.map((item) => (
                                <WishlistCourseCard key={item.id} item={item} onRemove={handleRemove} />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </AppLayout>
    );
}

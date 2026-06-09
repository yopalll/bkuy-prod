import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Pagination from '@/Components/Admin/Pagination';

const STATUS_CONFIG = {
    pending:  { label: 'Pending',  cls: 'bg-warning/10 text-warning' },
    approved: { label: 'Approved', cls: 'bg-success/10 text-success' },
    rejected: { label: 'Rejected', cls: 'bg-error/10 text-error' },
};

function StarRating({ rating }) {
    return (
        <div className="flex items-center gap-xs">
            {[1,2,3,4,5].map(s => (
                <span
                    key={s}
                    className={`material-symbols-outlined text-[14px] ${s <= rating ? 'text-secondary-container' : 'text-surface-variant'}`}
                    style={s <= rating ? { fontVariationSettings: "'FILL' 1" } : {}}
                >star</span>
            ))}
            <span className="font-caption text-caption text-on-surface-variant ml-xs">{rating}/5</span>
        </div>
    );
}

export default function ReviewsIndex({ reviews }) {
    function updateStatus(review, status) {
        router.patch(`/admin/reviews/${review.id}/status`, { status });
    }

    return (
        <AdminLayout title="Admin Portal">
            <Head title="Moderasi Review — BelajarKUY Admin" />

            <div className="flex justify-between items-end mb-gutter">
                <div>
                    <h1 className="font-headline-lg text-headline-lg text-on-surface">Moderasi Review</h1>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-xs">
                        Tinjau ulasan siswa dan kendalikan kualitas konten.
                    </p>
                </div>
            </div>

            <div className="bg-surface rounded-2xl shadow-[0_8px_30px_rgb(48,0,51,0.04)] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-surface-variant bg-background-subtle">
                                <th className="py-md px-lg font-label-md text-label-md text-on-surface-variant">Siswa</th>
                                <th className="py-md px-lg font-label-md text-label-md text-on-surface-variant hidden md:table-cell">Kursus</th>
                                <th className="py-md px-lg font-label-md text-label-md text-on-surface-variant hidden lg:table-cell">Rating</th>
                                <th className="py-md px-lg font-label-md text-label-md text-on-surface-variant">Komentar</th>
                                <th className="py-md px-lg font-label-md text-label-md text-on-surface-variant text-center">Status</th>
                                <th className="py-md px-lg font-label-md text-label-md text-on-surface-variant text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reviews.data?.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="py-xl text-center text-on-surface-variant font-body-md text-body-md">
                                        Tidak ada review untuk dimoderasi
                                    </td>
                                </tr>
                            )}
                            {reviews.data?.map((review) => {
                                const cfg = STATUS_CONFIG[review.status] ?? { label: review.status, cls: 'bg-surface-variant text-on-surface-variant' };
                                return (
                                    <tr key={review.id} className="border-b border-surface-variant/50 hover:bg-background-subtle transition-colors">
                                        <td className="py-md px-lg">
                                            <div className="flex items-center gap-sm">
                                                <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-xs shrink-0">
                                                    {review.user?.name?.charAt(0)?.toUpperCase() ?? '?'}
                                                </div>
                                                <span className="font-body-md text-body-md text-on-surface">{review.user?.name ?? '—'}</span>
                                            </div>
                                        </td>
                                        <td className="py-md px-lg text-on-surface-variant hidden md:table-cell max-w-[160px]">
                                            <span className="truncate block">{review.course?.title ?? '—'}</span>
                                        </td>
                                        <td className="py-md px-lg hidden lg:table-cell">
                                            <StarRating rating={review.rating ?? 0} />
                                        </td>
                                        <td className="py-md px-lg max-w-[200px]">
                                            <p className="font-body-md text-body-md text-on-surface truncate">{review.comment ?? '—'}</p>
                                        </td>
                                        <td className="py-md px-lg text-center">
                                            <span className={`inline-flex items-center px-sm py-xs rounded-full font-caption text-caption ${cfg.cls}`}>
                                                {cfg.label}
                                            </span>
                                        </td>
                                        <td className="py-md px-lg text-right">
                                            <div className="flex items-center justify-end gap-sm">
                                                {review.status !== 'approved' && (
                                                    <button
                                                        onClick={() => updateStatus(review, 'approved')}
                                                        className="p-sm rounded-lg text-success hover:bg-success/10 transition-colors"
                                                        title="Approve"
                                                    >
                                                        <span className="material-symbols-outlined text-[18px]">check_circle</span>
                                                    </button>
                                                )}
                                                {review.status !== 'rejected' && (
                                                    <button
                                                        onClick={() => updateStatus(review, 'rejected')}
                                                        className="p-sm rounded-lg text-error hover:bg-error-container transition-colors"
                                                        title="Reject"
                                                    >
                                                        <span className="material-symbols-outlined text-[18px]">cancel</span>
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                <Pagination data={reviews} />
            </div>
        </AdminLayout>
    );
}

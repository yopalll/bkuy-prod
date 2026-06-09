import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

function formatRupiah(amount) {
    if (!amount) return 'Rp 0';
    return `Rp ${Number(amount).toLocaleString('id-ID')}`;
}

const STATUS_CONFIG = {
    completed: { label: 'Selesai',    cls: 'bg-success/10 text-success border-success/30' },
    pending:   { label: 'Pending',    cls: 'bg-warning/10 text-warning border-warning/30' },
    cancelled: { label: 'Dibatalkan', cls: 'bg-error/10 text-error border-error/30' },
    refunded:  { label: 'Refund',     cls: 'bg-surface-variant text-on-surface-variant border-outline-variant' },
};

export default function OrderShow({ order }) {
    const cfg = STATUS_CONFIG[order.status] ?? { label: order.status, cls: 'bg-surface-variant text-on-surface-variant border-outline-variant' };

    return (
        <AdminLayout title="Admin Portal">
            <Head title={`Order #${order.id} — BelajarKUY Admin`} />

            <div className="mb-lg">
                <Link href="/admin/orders" className="flex items-center gap-sm text-on-surface-variant hover:text-primary font-label-md text-label-md transition-colors">
                    <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                    Kembali ke Daftar Order
                </Link>
            </div>

            <div className="flex items-center justify-between mb-gutter">
                <h1 className="font-headline-lg text-headline-lg text-on-surface">Order #{order.id}</h1>
                <span className={`inline-flex items-center px-md py-xs rounded-full font-label-md text-label-md border ${cfg.cls}`}>
                    {cfg.label}
                </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter">
                {/* Student info */}
                <div className="bg-surface rounded-2xl p-lg shadow-[0_8px_30px_rgb(48,0,51,0.04)]">
                    <div className="flex items-center gap-sm mb-md">
                        <span className="material-symbols-outlined text-[20px] text-primary">person</span>
                        <h2 className="font-headline-md text-headline-md text-on-surface">Info Siswa</h2>
                    </div>
                    <div className="flex items-center gap-md">
                        <div className="w-12 h-12 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-base shrink-0">
                            {order.user?.name?.charAt(0)?.toUpperCase() ?? '?'}
                        </div>
                        <div>
                            <p className="font-label-md text-label-md font-bold text-on-surface">{order.user?.name ?? '—'}</p>
                            <p className="font-caption text-caption text-on-surface-variant">{order.user?.email ?? '—'}</p>
                        </div>
                    </div>
                </div>

                {/* Course info */}
                <div className="bg-surface rounded-2xl p-lg shadow-[0_8px_30px_rgb(48,0,51,0.04)]">
                    <div className="flex items-center gap-sm mb-md">
                        <span className="material-symbols-outlined text-[20px] text-secondary">menu_book</span>
                        <h2 className="font-headline-md text-headline-md text-on-surface">Info Kursus</h2>
                    </div>
                    {order.course ? (
                        <div>
                            <p className="font-label-md text-label-md font-bold text-on-surface mb-xs">{order.course.title}</p>
                            <p className="font-caption text-caption text-on-surface-variant">Instruktur: {order.course.instructor?.name ?? '—'}</p>
                            <Link href={`/admin/courses/${order.course.id}`} className="mt-sm font-label-md text-label-md text-primary hover:underline inline-block text-sm">
                                Lihat Kursus →
                            </Link>
                        </div>
                    ) : <p className="text-on-surface-variant font-body-md text-body-md">—</p>}
                </div>

                {/* Payment info */}
                <div className="bg-surface rounded-2xl p-lg shadow-[0_8px_30px_rgb(48,0,51,0.04)]">
                    <div className="flex items-center gap-sm mb-md">
                        <span className="material-symbols-outlined text-[20px] text-warning">credit_card</span>
                        <h2 className="font-headline-md text-headline-md text-on-surface">Info Pembayaran</h2>
                    </div>
                    <div className="space-y-sm">
                        <div className="flex justify-between">
                            <span className="font-caption text-caption text-on-surface-variant">Total</span>
                            <span className="font-label-md text-label-md text-on-surface font-bold">{formatRupiah(order.final_price)}</span>
                        </div>
                        {order.payment && (
                            <>
                                <div className="flex justify-between">
                                    <span className="font-caption text-caption text-on-surface-variant">Midtrans Order ID</span>
                                    <span className="font-mono text-xs text-on-surface">{order.payment.midtrans_order_id ?? '—'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-caption text-caption text-on-surface-variant">Status Payment</span>
                                    <span className="font-label-md text-label-md text-on-surface">{order.payment.status ?? '—'}</span>
                                </div>
                            </>
                        )}
                        {order.coupon && (
                            <div className="flex justify-between">
                                <span className="font-caption text-caption text-on-surface-variant">Kupon</span>
                                <span className="font-mono text-xs text-success">{order.coupon.code}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Date info */}
                <div className="bg-surface rounded-2xl p-lg shadow-[0_8px_30px_rgb(48,0,51,0.04)]">
                    <div className="flex items-center gap-sm mb-md">
                        <span className="material-symbols-outlined text-[20px] text-primary">calendar_today</span>
                        <h2 className="font-headline-md text-headline-md text-on-surface">Tanggal</h2>
                    </div>
                    <div className="space-y-sm">
                        <div className="flex justify-between">
                            <span className="font-caption text-caption text-on-surface-variant">Dibuat</span>
                            <span className="font-body-md text-body-md text-on-surface">
                                {new Date(order.created_at).toLocaleDateString('id-ID', { dateStyle: 'long' })}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-caption text-caption text-on-surface-variant">Diperbarui</span>
                            <span className="font-body-md text-body-md text-on-surface">
                                {new Date(order.updated_at).toLocaleDateString('id-ID', { dateStyle: 'long' })}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

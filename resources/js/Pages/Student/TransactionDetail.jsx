import { Head, Link } from '@inertiajs/react';
import StudentLayout from '@/Layouts/StudentLayout';

const rupiah = (n) => 'Rp ' + Number(n ?? 0).toLocaleString('id-ID');

const STATUS_CONFIG = {
    settlement: { label: 'Lunas',        bg: 'bg-success/10', text: 'text-success',   icon: 'check_circle' },
    capture:    { label: 'Lunas',        bg: 'bg-success/10', text: 'text-success',   icon: 'check_circle' },
    pending:    { label: 'Menunggu',     bg: 'bg-warning/10', text: 'text-warning',   icon: 'hourglass_empty' },
    expire:     { label: 'Kedaluwarsa', bg: 'bg-surface-container', text: 'text-outline', icon: 'timer_off' },
    cancel:     { label: 'Dibatalkan',  bg: 'bg-error/10',   text: 'text-error',     icon: 'cancel' },
    deny:       { label: 'Ditolak',     bg: 'bg-error/10',   text: 'text-error',     icon: 'block' },
    failure:    { label: 'Gagal',       bg: 'bg-error/10',   text: 'text-error',     icon: 'error' },
};

function StatusBadge({ status }) {
    const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
    return (
        <span className={`inline-flex items-center gap-xs px-md py-sm rounded-full font-label-md text-label-md font-semibold ${cfg.bg} ${cfg.text}`}>
            <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>{cfg.icon}</span>
            {cfg.label}
        </span>
    );
}

function DetailRow({ label, value, valueClass = '' }) {
    return (
        <div className="flex items-start justify-between py-sm border-b border-outline-variant/20 last:border-0">
            <span className="font-body-md text-body-md text-on-surface-variant">{label}</span>
            <span className={`font-label-md text-label-md text-on-surface text-right max-w-[60%] ${valueClass}`}>{value}</span>
        </div>
    );
}

export default function TransactionDetail({ payment }) {
    const totalOriginal = payment.orders?.reduce((s, o) => s + (o.original_price ?? 0), 0) ?? 0;
    const totalDiscount = payment.orders?.reduce((s, o) => s + (o.discount_amount ?? 0), 0) ?? 0;

    return (
        <StudentLayout>
            <Head title={`Transaksi ${payment.midtrans_order_id}`} />

            <div className="px-margin-mobile md:px-margin-desktop py-xl md:py-xxl max-w-3xl mx-auto">
                {/* Back */}
                <Link
                    href="/student/transactions"
                    className="inline-flex items-center gap-xs text-on-surface-variant hover:text-primary font-label-md text-label-md mb-xl transition-colors"
                >
                    <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                    Kembali ke Riwayat Transaksi
                </Link>

                {/* Header */}
                <div className="bg-surface rounded-2xl border border-outline-variant/30 p-xl mb-lg" style={{ boxShadow: '0 2px 12px rgba(48,0,51,0.06)' }}>
                    <div className="flex items-start justify-between gap-md mb-lg">
                        <div>
                            <p className="font-caption text-caption text-on-surface-variant mb-xs">{payment.created_at_human}</p>
                            <h1 className="font-headline-md text-headline-md text-on-surface font-mono">{payment.midtrans_order_id}</h1>
                        </div>
                        <StatusBadge status={payment.status} />
                    </div>

                    <div className="space-y-0">
                        {payment.payment_type && (
                            <DetailRow
                                label="Metode Pembayaran"
                                value={payment.payment_type.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                            />
                        )}
                        {payment.coupon_code && (
                            <DetailRow
                                label="Kupon Digunakan"
                                value={`${payment.coupon_code}${payment.coupon_discount ? ` (${payment.coupon_discount}% off)` : ''}`}
                                valueClass="text-primary"
                            />
                        )}
                    </div>
                </div>

                {/* Course Items */}
                <div className="bg-surface rounded-2xl border border-outline-variant/30 p-xl mb-lg" style={{ boxShadow: '0 2px 12px rgba(48,0,51,0.06)' }}>
                    <h2 className="font-title-md text-title-md text-on-surface mb-lg">Item Pembelian</h2>
                    <div className="space-y-md">
                        {payment.orders?.map((order, i) => order.course && (
                            <div key={i} className="flex gap-md items-start">
                                <div className="w-16 h-16 rounded-xl bg-surface-container overflow-hidden shrink-0">
                                    {order.course.thumbnail
                                        ? <img src={order.course.thumbnail} alt={order.course.title} className="w-full h-full object-cover" />
                                        : <div className="w-full h-full flex items-center justify-center">
                                            <span className="material-symbols-outlined text-outline text-[28px]">school</span>
                                          </div>
                                    }
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-label-md text-label-md text-on-surface mb-xs line-clamp-2">{order.course.title}</p>
                                    {order.course.slug && (
                                        <Link
                                            href={`/student/learn/${order.course.slug}`}
                                            className="inline-flex items-center gap-xs font-caption text-caption text-primary hover:underline"
                                        >
                                            <span className="material-symbols-outlined text-[12px]">play_circle</span>
                                            Mulai belajar
                                        </Link>
                                    )}
                                </div>
                                <div className="text-right shrink-0">
                                    {order.discount_amount > 0 && (
                                        <p className="font-caption text-caption text-outline line-through">{rupiah(order.original_price)}</p>
                                    )}
                                    <p className="font-label-md text-label-md text-on-surface">{rupiah(order.final_price)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Price Summary */}
                <div className="bg-surface rounded-2xl border border-outline-variant/30 p-xl" style={{ boxShadow: '0 2px 12px rgba(48,0,51,0.06)' }}>
                    <h2 className="font-title-md text-title-md text-on-surface mb-md">Ringkasan Harga</h2>
                    <div className="space-y-0">
                        <DetailRow label="Subtotal" value={rupiah(totalOriginal)} />
                        {totalDiscount > 0 && (
                            <DetailRow label="Diskon" value={`-${rupiah(totalDiscount)}`} valueClass="text-success" />
                        )}
                        <div className="flex items-center justify-between pt-md mt-sm border-t border-outline-variant/30">
                            <span className="font-title-md text-title-md text-on-surface font-bold">Total</span>
                            <span className="font-headline-sm text-headline-sm text-primary font-bold">{rupiah(payment.total_amount)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </StudentLayout>
    );
}

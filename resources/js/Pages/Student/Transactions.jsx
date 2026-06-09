import { Head, Link } from '@inertiajs/react';
import StudentLayout from '@/Layouts/StudentLayout';

const rupiah = (n) => 'Rp ' + Number(n ?? 0).toLocaleString('id-ID');

const STATUS_CONFIG = {
    settlement: { label: 'Lunas',    bg: 'bg-success/10', text: 'text-success',            icon: 'check_circle' },
    capture:    { label: 'Lunas',    bg: 'bg-success/10', text: 'text-success',            icon: 'check_circle' },
    pending:    { label: 'Menunggu', bg: 'bg-warning/10', text: 'text-warning',            icon: 'hourglass_empty' },
    expire:     { label: 'Kedaluwarsa', bg: 'bg-surface-container', text: 'text-outline',  icon: 'timer_off' },
    cancel:     { label: 'Dibatalkan', bg: 'bg-error/10', text: 'text-error',              icon: 'cancel' },
    deny:       { label: 'Ditolak',  bg: 'bg-error/10', text: 'text-error',               icon: 'block' },
    failure:    { label: 'Gagal',    bg: 'bg-error/10', text: 'text-error',               icon: 'error' },
};

function StatusBadge({ status }) {
    const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
    return (
        <span className={`inline-flex items-center gap-xs px-sm py-xs rounded-full font-caption text-caption font-semibold ${cfg.bg} ${cfg.text}`}>
            <span className="material-symbols-outlined text-[13px]" style={{ fontVariationSettings: "'FILL' 1" }}>{cfg.icon}</span>
            {cfg.label}
        </span>
    );
}

function TransactionCard({ payment }) {
    const firstCourse = payment.orders?.[0]?.course;

    return (
        <Link
            href={`/student/transactions/${payment.id}`}
            className="bg-surface rounded-2xl border border-outline-variant/30 p-lg hover:shadow-md transition-shadow block"
            style={{ boxShadow: '0 2px 12px rgba(48,0,51,0.06)' }}
        >
            <div className="flex items-start justify-between gap-md mb-md">
                <div className="flex-1 min-w-0">
                    <p className="font-caption text-caption text-on-surface-variant mb-xs">{payment.created_at_human}</p>
                    <p className="font-label-md text-label-md text-on-surface font-mono">{payment.midtrans_order_id}</p>
                    {payment.coupon_code && (
                        <p className="font-caption text-caption text-primary mt-xs flex items-center gap-xs">
                            <span className="material-symbols-outlined text-[12px]">sell</span>
                            Kupon: {payment.coupon_code}
                        </p>
                    )}
                </div>
                <StatusBadge status={payment.status} />
            </div>

            {/* Courses in order */}
            <div className="space-y-sm mb-md">
                {payment.orders?.map((order, i) => order.course && (
                    <div key={i} className="flex items-center gap-sm">
                        <div className="w-10 h-10 rounded-lg bg-surface-container overflow-hidden shrink-0">
                            {order.course.thumbnail
                                ? <img src={order.course.thumbnail} alt={order.course.title} className="w-full h-full object-cover" />
                                : <div className="w-full h-full flex items-center justify-center"><span className="material-symbols-outlined text-outline text-[18px]">school</span></div>
                            }
                        </div>
                        <p className="font-caption text-caption text-on-surface line-clamp-1 flex-1">{order.course.title}</p>
                        <p className="font-caption text-caption text-on-surface-variant shrink-0">{rupiah(order.final_price)}</p>
                    </div>
                ))}
            </div>

            <div className="flex items-center justify-between pt-sm border-t border-outline-variant/30">
                <div className="flex items-center gap-xs text-on-surface-variant">
                    {payment.payment_type && (
                        <span className="font-caption text-caption capitalize">{payment.payment_type.replace(/_/g, ' ')}</span>
                    )}
                </div>
                <div className="text-right">
                    <p className="font-caption text-caption text-on-surface-variant">Total</p>
                    <p className="font-label-md text-label-md text-primary font-bold">{rupiah(payment.total_amount)}</p>
                </div>
            </div>
        </Link>
    );
}

export default function Transactions({ payments }) {
    const data  = payments?.data ?? [];
    const links = payments?.links ?? [];
    const meta  = payments?.meta ?? {};

    return (
        <StudentLayout>
            <Head title="Riwayat Transaksi" />

            <div className="px-margin-mobile md:px-margin-desktop py-xl md:py-xxl max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-xl pb-md border-b border-surface-variant">
                    <h1 className="font-headline-lg text-headline-lg text-on-background">Riwayat Transaksi</h1>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-xs">
                        Semua riwayat pembelian kursus kamu.
                    </p>
                </div>

                {data.length === 0 ? (
                    <div className="bg-surface rounded-2xl p-xl flex flex-col items-center text-center border border-outline-variant/30" style={{ boxShadow: '0 8px 30px rgba(48,0,51,0.06)' }}>
                        <div className="w-20 h-20 mb-lg flex items-center justify-center rounded-full bg-surface-container-high">
                            <span className="material-symbols-outlined text-[48px] text-outline">receipt_long</span>
                        </div>
                        <h2 className="font-headline-md text-headline-md text-on-surface mb-sm">Belum ada transaksi</h2>
                        <p className="font-body-md text-body-md text-on-surface-variant mb-lg">
                            Kursus yang kamu beli akan muncul di sini.
                        </p>
                        <Link
                            href="/home"
                            className="bg-primary text-on-primary px-lg py-sm rounded-lg font-label-md text-label-md hover:opacity-90 transition-opacity"
                        >
                            Jelajahi Kursus
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="space-y-md mb-xl">
                            {data.map((payment) => (
                                <TransactionCard key={payment.id} payment={payment} />
                            ))}
                        </div>

                        {/* Pagination */}
                        {links.length > 3 && (
                            <div className="flex items-center justify-center gap-xs flex-wrap">
                                {links.map((link, i) => (
                                    link.url ? (
                                        <Link
                                            key={i}
                                            href={link.url}
                                            className={`px-md py-xs rounded-lg font-label-md text-label-md transition-colors ${
                                                link.active
                                                    ? 'bg-primary text-on-primary'
                                                    : 'text-on-surface-variant hover:bg-surface-container'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ) : (
                                        <span
                                            key={i}
                                            className="px-md py-xs rounded-lg font-label-md text-label-md text-outline opacity-50"
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    )
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </StudentLayout>
    );
}

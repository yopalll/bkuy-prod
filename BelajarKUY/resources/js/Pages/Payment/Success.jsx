import { Head, Link } from '@inertiajs/react';
import { CheckCircle2 } from 'lucide-react';

const rupiah = (n) => 'Rp ' + Number(n ?? 0).toLocaleString('id-ID');

/**
 * Pages/Payment/Success.jsx
 *
 * Desain dari: pembayaran_berhasil/code.html (Quinsha, Konteks_A)
 * Dipanggil oleh: Snap onSuccess / onPending callback
 * Props: payment (Payment model), orders (Order[] + course)
 */
export default function PaymentSuccess({ payment, orders }) {
    return (
        <>
            <Head title="Pembayaran Berhasil — BelajarKUY" />
            <div className="bg-background text-on-background flex flex-col min-h-screen font-sans antialiased">
                {/* Minimal brand header */}
                <header className="w-full py-md px-margin-desktop flex justify-center items-center">
                    <Link href="/" className="font-headline-md text-headline-md font-extrabold text-primary">
                        🚀 BelajarKUY
                    </Link>
                </header>

                {/* Main content */}
                <main className="flex-grow flex items-center justify-center p-margin-mobile md:p-margin-desktop">
                    {/* Glassmorphism success card */}
                    <div
                        className="bg-surface rounded-2xl border border-primary/10 p-xl md:p-xxl max-w-lg w-full text-center relative overflow-hidden flex flex-col items-center"
                        style={{ boxShadow: '0 8px 40px rgba(48,0,51,0.10)' }}
                    >
                        {/* Dekoratif blur blobs */}
                        <div className="absolute -top-20 -right-20 w-40 h-40 bg-secondary-container/20 rounded-full blur-3xl pointer-events-none" />
                        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-primary-container/20 rounded-full blur-3xl pointer-events-none" />

                        {/* Success icon dengan animasi ping */}
                        <div className="w-24 h-24 bg-success/10 rounded-full flex items-center justify-center mb-lg relative">
                            <div className="absolute inset-0 bg-success/20 rounded-full animate-ping opacity-75" />
                            <CheckCircle2 className="w-12 h-12 text-success relative z-10" />
                        </div>

                        {/* Headline */}
                        <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-sm">
                            Pembayaran Berhasil! 🎉
                        </h1>
                        <p className="font-body-md text-body-md text-on-surface-variant mb-xl">
                            Hore! Kamu sudah selangkah lebih dekat dengan impianmu. Selamat belajar!
                        </p>

                        {/* Order details */}
                        {payment && (
                            <div className="w-full bg-surface-container-low rounded-xl p-md mb-xl flex flex-col gap-sm text-left border border-outline-variant/50">
                                <div className="flex justify-between items-center border-b border-outline-variant/30 pb-sm">
                                    <span className="font-body-md text-body-md text-on-surface-variant">Nomor Order</span>
                                    <span className="font-label-md text-label-md text-on-surface font-mono">
                                        {payment.midtrans_order_id ?? '-'}
                                    </span>
                                </div>
                                {payment.payment_type && (
                                    <div className="flex justify-between items-center border-b border-outline-variant/30 py-sm">
                                        <span className="font-body-md text-body-md text-on-surface-variant">Metode Pembayaran</span>
                                        <span className="font-label-md text-label-md text-on-surface capitalize">
                                            {payment.payment_type.replace(/_/g, ' ')}
                                        </span>
                                    </div>
                                )}
                                <div className="flex justify-between items-center pt-sm">
                                    <span className="font-label-md text-label-md text-on-surface">Total Bayar</span>
                                    <span className="font-headline-md text-headline-md text-primary">
                                        {rupiah(payment.total_amount)}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Kursus yang dibeli */}
                        {orders && orders.length > 0 && (
                            <div className="w-full mb-xl text-left">
                                <p className="font-label-md text-label-md text-on-surface-variant mb-sm">Kursus yang berhasil dibeli:</p>
                                <ul className="space-y-sm">
                                    {orders.map((order) => (
                                        <li
                                            key={order.id}
                                            className="flex items-center gap-sm bg-surface-container-low rounded-lg px-md py-sm border border-outline-variant/30"
                                        >
                                            {order.course?.thumbnail && (
                                                <img
                                                    src={order.course.thumbnail}
                                                    alt={order.course.title}
                                                    className="w-10 h-10 rounded-lg object-cover shrink-0"
                                                />
                                            )}
                                            <span className="font-label-md text-label-md text-on-surface line-clamp-1 flex-1">
                                                {order.course?.title ?? 'Kursus'}
                                            </span>
                                            <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* CTA Buttons */}
                        <div className="flex flex-col w-full gap-md">
                            <Link
                                id="btn-mulai-belajar"
                                href="/student/my-courses"
                                className="w-full bg-primary text-on-primary rounded-lg py-md px-lg font-label-md text-label-md hover:bg-primary-container transition-colors shadow-sm flex justify-center items-center gap-sm"
                            >
                                🚀 Mulai Belajar Sekarang
                            </Link>
                            <Link
                                id="btn-lihat-dashboard"
                                href="/student/dashboard"
                                className="w-full bg-surface text-primary border-2 border-primary rounded-lg py-md px-lg font-label-md text-label-md hover:bg-surface-container-low transition-colors flex justify-center items-center gap-sm"
                            >
                                📊 Lihat Dashboard Saya
                            </Link>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}

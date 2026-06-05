import { Head, Link } from '@inertiajs/react';
import { XCircle } from 'lucide-react';

/**
 * Pages/Payment/Failed.jsx
 *
 * Desain dari: pembayaran_gagal/code.html (Quinsha, Konteks_A)
 * Dipanggil oleh: Snap onError callback / status deny/cancel/expire
 */
export default function PaymentFailed({ payment }) {
    return (
        <>
            <Head title="Pembayaran Gagal — BelajarKUY" />
            <div className="bg-background text-on-background min-h-screen flex flex-col font-sans antialiased">
                {/* Main content */}
                <main className="flex-grow flex items-center justify-center p-margin-mobile md:p-margin-desktop">
                    <div className="max-w-md w-full bg-surface rounded-2xl border border-outline-variant/20 p-xl text-center relative overflow-hidden shadow-sm">
                        {/* Accent bar merah di atas card */}
                        <div className="absolute top-0 left-0 w-full h-2 bg-error rounded-t-2xl" />

                        {/* Error icon */}
                        <div className="mb-lg flex justify-center mt-sm">
                            <div className="w-24 h-24 rounded-full bg-error-container flex items-center justify-center text-error">
                                <XCircle className="w-12 h-12" />
                            </div>
                        </div>

                        {/* Headline */}
                        <h1 className="font-headline-lg text-headline-lg text-primary mb-sm">
                            Waduh, Pembayaran Gagal
                        </h1>
                        <p className="font-body-md text-body-md text-on-surface-variant mb-xl">
                            Transaksi Anda tidak dapat diproses saat ini. Hal ini mungkin terjadi karena limit saldo tidak mencukupi, koneksi terputus, atau batas waktu pembayaran (timeout) telah berakhir.
                        </p>

                        {/* Info order (jika ada) */}
                        {payment && payment.midtrans_order_id && (
                            <div className="mb-xl bg-surface-container-low rounded-lg p-md border border-outline-variant/30 text-left">
                                <div className="flex justify-between items-center">
                                    <span className="font-caption text-caption text-on-surface-variant">Nomor Order</span>
                                    <span className="font-label-md text-label-md text-on-surface font-mono text-xs">
                                        {payment.midtrans_order_id}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* CTA */}
                        <div className="flex flex-col gap-sm">
                            <Link
                                id="btn-coba-lagi"
                                href="/checkout"
                                className="w-full bg-primary text-on-primary font-label-md text-label-md py-md px-lg rounded-lg hover:bg-primary-container transition-colors shadow-sm flex justify-center items-center gap-sm"
                            >
                                🔄 Coba Lagi
                            </Link>
                            <Link
                                id="btn-kembali-keranjang"
                                href="/cart"
                                className="w-full bg-surface text-primary border border-primary font-label-md text-label-md py-md px-lg rounded-lg hover:bg-surface-container-low transition-colors flex justify-center items-center gap-sm"
                            >
                                🛒 Kembali ke Keranjang
                            </Link>
                            <a
                                id="btn-hubungi-bantuan"
                                href="mailto:support@belajarkuy.id"
                                className="mt-sm font-caption text-caption text-on-surface-variant hover:text-primary transition-colors underline underline-offset-2"
                            >
                                Hubungi Bantuan
                            </a>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}

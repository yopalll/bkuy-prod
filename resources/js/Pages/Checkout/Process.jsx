import { Head, Link } from '@inertiajs/react';
import { useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Halaman perantara Checkout/Process
 *
 * Tugas:
 * 1. Load Midtrans Snap JS dari CDN sandbox
 * 2. Setelah script siap, auto-panggil snap.pay(snapToken)
 * 3. Redirect sesuai hasil Snap callback
 *
 * Ref: F06_PAYMENT_MIDTRANS.md, ADR-004 (sandbox only)
 */
export default function CheckoutProcess({ snapToken, clientKey, midtransOrderId, totalAmount, couponCode }) {
    const snapLoaded = useRef(false);

    useEffect(() => {
        if (snapLoaded.current) return;

        // Load Midtrans Snap JS — SELALU sandbox (ADR-004)
        const script = document.createElement('script');
        script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
        script.setAttribute('data-client-key', clientKey ?? '');
        script.async = true;

        script.onload = () => {
            snapLoaded.current = true;

            if (!window.snap) {
                console.error('[BelajarKUY] Midtrans Snap tidak tersedia setelah load.');
                return;
            }

            // Panggil popup Snap otomatis
            window.snap.pay(snapToken, {
                onSuccess: function (result) {
                    // Settlement / capture berhasil — redirect ke halaman sukses
                    window.location.href = `/payment/success?order_id=${result.order_id}`;
                },
                onPending: function (result) {
                    // Bank transfer / VA — menunggu konfirmasi
                    window.location.href = `/payment/success?order_id=${result.order_id}`;
                },
                onError: function (result) {
                    console.error('[BelajarKUY] Snap error:', result);
                    window.location.href = `/payment/failed?order_id=${midtransOrderId}`;
                },
                onClose: function () {
                    // Pengguna menutup popup tanpa bayar → kembali ke checkout
                    window.location.href = '/checkout';
                },
            });
        };

        script.onerror = () => {
            console.error('[BelajarKUY] Gagal memuat Midtrans Snap JS.');
            window.location.href = `/payment/failed?order_id=${midtransOrderId}`;
        };

        document.body.appendChild(script);

        return () => {
            // Cleanup hanya jika komponen di-unmount sebelum script selesai
            if (!snapLoaded.current && document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, [snapToken, clientKey]);

    return (
        <>
            <Head title="Memproses Pembayaran — BelajarKUY" />
            <div className="min-h-screen bg-background flex flex-col items-center justify-center font-sans text-on-background antialiased">
                {/* Brand */}
                <Link href="/" className="mb-xl">
                    <span className="font-headline-md text-headline-md text-primary tracking-tight">🚀 BelajarKUY</span>
                </Link>

                {/* Loading card */}
                <div
                    className="bg-surface rounded-2xl border border-primary/5 p-xl md:p-xxl max-w-sm w-full mx-margin-mobile text-center"
                    style={{ boxShadow: '0 4px 24px rgba(48,0,51,0.08)' }}
                >
                    {/* Pulsing icon */}
                    <div className="relative w-20 h-20 mx-auto mb-lg">
                        <div className="absolute inset-0 bg-secondary-container/40 rounded-full animate-ping opacity-60" />
                        <div className="relative w-full h-full bg-secondary-container/20 rounded-full flex items-center justify-center">
                            <Loader2 className="w-8 h-8 text-primary animate-spin" />
                        </div>
                    </div>

                    <h1 className="font-headline-md text-headline-md text-on-surface mb-sm">
                        Membuka Jendela Pembayaran…
                    </h1>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                        Harap tunggu. Jendela Midtrans akan muncul sebentar lagi.
                    </p>

                    <div className="mt-xl pt-lg border-t border-outline-variant">
                        <p className="font-caption text-caption text-on-surface-variant mb-sm">
                            Jika jendela tidak muncul dalam 5 detik:
                        </p>
                        <Link
                            href="/checkout"
                            className="font-label-md text-label-md text-primary hover:underline"
                        >
                            ← Kembali ke Checkout
                        </Link>
                    </div>
                </div>

                {/* Keamanan */}
                <p className="mt-lg font-caption text-caption text-on-surface-variant flex items-center gap-xs">
                    🔒 Pembayaran dijamin aman dan terenkripsi oleh Midtrans.
                </p>
            </div>
        </>
    );
}

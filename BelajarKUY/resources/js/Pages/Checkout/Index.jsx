import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Lock, ShoppingCart, User, Tag, CheckCircle2, X, Loader2, RocketIcon } from 'lucide-react';
import { useState } from 'react';

const rupiah = (n) => 'Rp ' + Number(n ?? 0).toLocaleString('id-ID');

// ─── Minimal transactional header (sesuai desain checkout_pesanan) ───────────
function CheckoutHeader() {
    return (
        <header className="w-full bg-surface py-lg px-margin-mobile md:px-margin-desktop flex items-center justify-between shadow-sm sticky top-0 z-50 border-b border-outline-variant/30">
            <Link href="/" className="flex items-center gap-sm">
                <span className="text-2xl">🚀</span>
                <span className="font-headline-md text-headline-md text-primary tracking-tight">BelajarKUY</span>
            </Link>
            <div className="flex items-center gap-xs text-success bg-success/10 px-md py-sm rounded-full">
                <Lock className="w-4 h-4" />
                <span className="font-label-md text-label-md">Secure Checkout</span>
            </div>
        </header>
    );
}

// ─── Baris item kursus di order summary ──────────────────────────────────────
function OrderItem({ item }) {
    const { course } = item;
    return (
        <div className="flex flex-col sm:flex-row gap-md py-md border-b border-outline-variant last:border-0">
            <div className="w-full sm:w-32 h-20 rounded-lg bg-surface-container overflow-hidden shrink-0">
                <img
                    src={course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80'}
                    alt={course.title}
                    className="w-full h-full object-cover"
                />
            </div>
            <div className="flex flex-col justify-between flex-grow">
                <div>
                    <h3 className="font-label-md text-label-md text-on-surface line-clamp-2">{course.title}</h3>
                    <p className="font-caption text-caption text-on-surface-variant mt-xs">
                        Oleh {course.instructor?.name ?? 'Instruktur'}
                    </p>
                </div>
                <div className="mt-sm sm:mt-0 font-label-md text-label-md text-primary">
                    {rupiah(course.discounted_price ?? course.price)}
                </div>
            </div>
        </div>
    );
}

// ─── Halaman utama ────────────────────────────────────────────────────────────
export default function CheckoutIndex({ cartItems, coupon, subtotal, discountAmount, total }) {
    const { auth } = usePage().props;

    const { data, setData, post, processing, errors } = useForm({
        coupon_code: coupon?.code ?? '',
    });

    const [localCoupon, setLocalCoupon]   = useState(coupon ?? null);
    const [couponInput, setCouponInput]   = useState('');
    const [couponLoading, setCouponLoading] = useState(false);
    const [couponError, setCouponError]   = useState('');

    // Hitung total lokal (mungkin berubah jika kupon di-apply dari sini)
    const finalTotal = localCoupon
        ? Math.max(0, subtotal - (subtotal * ((localCoupon.discount_percent ?? 0) / 100)))
        : total;

    function getCsrf() {
        return decodeURIComponent(
            document.cookie
                .split('; ')
                .find((r) => r.startsWith('XSRF-TOKEN='))
                ?.split('=')[1] ?? '',
        );
    }

    async function handleApplyCoupon(e) {
        e.preventDefault();
        if (!couponInput.trim() || couponLoading) return;
        setCouponLoading(true);
        setCouponError('');
        try {
            const res = await fetch('/coupon/apply', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-XSRF-TOKEN': getCsrf(),
                },
                body: JSON.stringify({
                    coupon_code: couponInput.trim().toUpperCase(),
                    course_ids: cartItems.map((i) => i.course.id),
                    subtotal,
                }),
            });
            const json = await res.json();
            if (res.ok && json.success) {
                setLocalCoupon(json);
                setData('coupon_code', json.coupon_code);
                setCouponInput('');
            } else {
                setCouponError(json.message ?? 'Kupon tidak valid.');
            }
        } catch {
            setCouponError('Gagal menghubungi server. Coba lagi.');
        } finally {
            setCouponLoading(false);
        }
    }

    function handleRemoveCoupon() {
        setLocalCoupon(null);
        setData('coupon_code', '');
    }

    function handlePay(e) {
        e.preventDefault();
        post('/checkout/process');
    }

    return (
        <>
            <Head title="Checkout — Selesaikan Pembayaran" />
            <div className="min-h-screen bg-background text-on-background font-sans antialiased">
                <CheckoutHeader />

                <main className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop py-xl md:py-xxl">
                    {/* Judul */}
                    <div className="mb-lg">
                        <h1 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-primary">
                            Selesaikan Pembayaran
                        </h1>
                        <p className="font-body-md text-body-md text-on-surface-variant mt-xs">
                            Hanya selangkah lagi untuk meluncurkan karir Anda.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
                        {/* ─── Kolom Kiri: Informasi + Order ─── */}
                        <div className="lg:col-span-7 flex flex-col gap-gutter">
                            {/* Informasi Akun */}
                            <section className="bg-surface rounded-2xl p-lg md:p-xl border border-primary/5 shadow-sm" style={{ boxShadow: '0 4px 24px rgba(48,0,51,0.08)' }}>
                                <div className="flex items-center gap-sm mb-md">
                                    <User className="w-5 h-5 text-primary" />
                                    <h2 className="font-headline-md text-headline-md text-on-surface">Informasi Akun</h2>
                                </div>
                                <div className="flex flex-col gap-sm">
                                    <label className="font-label-md text-label-md text-on-surface-variant">Alamat Email</label>
                                    <input
                                        type="email"
                                        readOnly
                                        value={auth?.user?.email ?? ''}
                                        className="w-full rounded-lg px-md py-sm font-body-md text-body-md text-on-surface bg-surface-container-low border-2 border-transparent cursor-default"
                                    />
                                    <p className="font-caption text-caption text-on-surface-variant mt-xs">
                                        Kuitansi digital dan akses kursus akan dikirimkan ke email ini.
                                    </p>
                                </div>
                            </section>

                            {/* Ringkasan Order */}
                            <section className="bg-surface rounded-2xl p-lg md:p-xl border border-primary/5 shadow-sm" style={{ boxShadow: '0 4px 24px rgba(48,0,51,0.08)' }}>
                                <div className="flex items-center justify-between mb-lg">
                                    <div className="flex items-center gap-sm">
                                        <ShoppingCart className="w-5 h-5 text-primary" />
                                        <h2 className="font-headline-md text-headline-md text-on-surface">Ringkasan Order</h2>
                                    </div>
                                    <span className="bg-primary-container text-on-primary-container px-sm py-xs rounded-full font-label-md text-label-md">
                                        {cartItems.length} Item
                                    </span>
                                </div>

                                {/* Daftar item */}
                                {cartItems.map((item) => (
                                    <OrderItem key={item.id} item={item} />
                                ))}

                                {/* Input kode promo */}
                                <div className="pt-lg pb-sm">
                                    <label className="font-label-md text-label-md text-on-surface-variant block mb-sm">Kode Promo</label>

                                    {localCoupon ? (
                                        <div className="flex items-center gap-sm rounded-lg bg-success/10 border border-success/30 px-md py-sm">
                                            <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <p className="font-label-md text-label-md text-success">Kupon diterapkan!</p>
                                                <p className="font-caption text-caption text-success/80 font-mono tracking-wider">{localCoupon.coupon_code ?? localCoupon.code}</p>
                                            </div>
                                            <button
                                                onClick={handleRemoveCoupon}
                                                className="p-1 rounded text-success hover:bg-success/20 transition-colors"
                                            >
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleApplyCoupon} className="flex gap-sm">
                                            <div className="relative flex-1">
                                                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
                                                <input
                                                    id="checkout-coupon-input"
                                                    type="text"
                                                    value={couponInput}
                                                    onChange={(e) => { setCouponInput(e.target.value.toUpperCase()); setCouponError(''); }}
                                                    placeholder="Masukkan kode promo"
                                                    className="w-full pl-9 pr-4 rounded-lg px-md py-sm font-body-md text-body-md text-on-surface bg-surface-container-low border-2 border-transparent focus:border-primary focus:outline-none transition-colors"
                                                />
                                            </div>
                                            <button
                                                type="submit"
                                                id="btn-apply-checkout-coupon"
                                                disabled={couponLoading || !couponInput.trim()}
                                                className="bg-surface text-primary border-2 border-primary rounded-lg px-lg font-label-md text-label-md hover:bg-primary/5 disabled:opacity-50 transition-colors"
                                            >
                                                {couponLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Terapkan'}
                                            </button>
                                        </form>
                                    )}

                                    {couponError && (
                                        <p className="mt-2 text-xs text-error font-medium flex items-center gap-1">
                                            <X className="w-3.5 h-3.5" /> {couponError}
                                        </p>
                                    )}
                                </div>
                            </section>
                        </div>

                        {/* ─── Kolom Kanan: Total + Bayar ─── */}
                        <div className="lg:col-span-5 relative">
                            <div
                                className="bg-surface rounded-2xl p-lg md:p-xl border border-primary/5 sticky top-[88px]"
                                style={{ boxShadow: '0 4px 24px rgba(48,0,51,0.08)' }}
                            >
                                <h2 className="font-headline-md text-headline-md text-on-surface mb-lg">Metode Pembayaran</h2>

                                {/* Info metode — Midtrans Snap akan tampilkan semua pilihan */}
                                <div className="space-y-sm mb-xl">
                                    {[
                                        { label: 'Virtual Account (VA)', sub: 'BCA, Mandiri, BNI, BRI', icon: '🏦' },
                                        { label: 'E-Wallet', sub: 'GoPay, OVO, Dana, ShopeePay', icon: '📱' },
                                        { label: 'Kartu Kredit / Debit', sub: 'Visa, Mastercard, JCB', icon: '💳' },
                                    ].map((m) => (
                                        <div
                                            key={m.label}
                                            className="flex items-center justify-between p-md rounded-lg border-2 border-outline-variant bg-surface-container-low"
                                        >
                                            <div className="flex items-center gap-md">
                                                <span className="text-lg">{m.icon}</span>
                                                <div className="flex flex-col">
                                                    <span className="font-label-md text-label-md text-on-surface">{m.label}</span>
                                                    <span className="font-caption text-caption text-on-surface-variant">{m.sub}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <p className="font-caption text-caption text-on-surface-variant text-center pt-xs">
                                        Pilih metode di popup Midtrans saat checkout
                                    </p>
                                </div>

                                {/* Kalkulasi total */}
                                <div className="border-t border-outline-variant pt-md mb-xl space-y-sm">
                                    <div className="flex justify-between font-body-md text-body-md text-on-surface-variant">
                                        <span>Subtotal ({cartItems.length} kursus)</span>
                                        <span>{rupiah(subtotal)}</span>
                                    </div>
                                    {localCoupon && (
                                        <div className="flex justify-between font-body-md text-body-md text-success">
                                            <span>Diskon ({localCoupon.discount_percent}%)</span>
                                            <span>- {rupiah(localCoupon.discount_amount ?? subtotal * (localCoupon.discount_percent / 100))}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between font-body-md text-body-md text-on-surface-variant">
                                        <span>Biaya Layanan</span>
                                        <span className="text-success font-medium">Gratis</span>
                                    </div>
                                    <div className="flex justify-between items-center pt-sm border-t border-outline-variant mt-sm">
                                        <span className="font-headline-md text-headline-md text-on-surface">Total</span>
                                        <span className="font-headline-md text-headline-md text-primary">{rupiah(finalTotal)}</span>
                                    </div>
                                </div>

                                {/* Tombol bayar */}
                                <form onSubmit={handlePay}>
                                    <input type="hidden" name="coupon_code" value={data.coupon_code} />
                                    <button
                                        id="btn-bayar-sekarang"
                                        type="submit"
                                        disabled={processing}
                                        className="w-full bg-secondary-container text-primary font-label-md text-label-md py-md rounded-lg flex items-center justify-center gap-sm hover:opacity-90 disabled:opacity-60 transition-all active:scale-95"
                                    >
                                        {processing ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <>
                                                <span>🚀</span>
                                                Bayar Sekarang
                                            </>
                                        )}
                                    </button>
                                </form>

                                <p className="text-center font-caption text-caption text-on-surface-variant mt-md flex justify-center items-center gap-xs">
                                    <Lock className="w-3.5 h-3.5" />
                                    Pembayaran dijamin aman dan terenkripsi.
                                </p>

                                <Link
                                    href="/cart"
                                    className="mt-md block text-center font-caption text-caption text-on-surface-variant hover:text-primary transition-colors"
                                >
                                    ← Kembali ke keranjang
                                </Link>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}

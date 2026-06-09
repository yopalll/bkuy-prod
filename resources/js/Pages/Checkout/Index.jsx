import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import BrandLogo from '@/Components/BrandLogo';

const rupiah = (n) => 'Rp ' + Number(n ?? 0).toLocaleString('id-ID');

function CheckoutHeader() {
    return (
        <header className="w-full bg-surface py-lg px-margin-mobile md:px-margin-desktop flex items-center justify-between shadow-sm sticky top-0 z-50 border-b border-outline-variant/30">
            <Link href="/">
                <BrandLogo size="md" />
            </Link>
            <div className="flex items-center gap-xs text-success bg-success/10 px-md py-sm rounded-full">
                <span className="material-symbols-outlined" style={{ fontSize: '18px', fontVariationSettings: "'FILL' 1" }}>lock</span>
                <span className="font-label-md text-label-md">Secure Checkout</span>
            </div>
        </header>
    );
}

function OrderItem({ item }) {
    const { course } = item;
    return (
        <div className="flex flex-col sm:flex-row gap-md py-md border-b border-outline-variant last:border-0">
            <div className="w-full sm:w-32 h-24 rounded-lg bg-surface-container overflow-hidden shrink-0">
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

export default function CheckoutIndex({ cartItems, coupon, subtotal, discountAmount, total }) {
    const { auth } = usePage().props;

    const { data, setData, post, processing } = useForm({
        coupon_code: coupon?.code ?? '',
    });

    const [localCoupon, setLocalCoupon]     = useState(coupon ?? null);
    const [couponInput, setCouponInput]     = useState('');
    const [couponLoading, setCouponLoading] = useState(false);
    const [couponError, setCouponError]     = useState('');

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
                    <div className="mb-lg">
                        <h1 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-primary">
                            Selesaikan Pembayaran
                        </h1>
                        <p className="font-body-md text-body-md text-on-surface-variant mt-xs">
                            Hanya selangkah lagi untuk meluncurkan karir Anda.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start">
                        {/* ─── Kolom Kiri ─── */}
                        <div className="lg:col-span-7 flex flex-col gap-gutter">
                            {/* Informasi Akun */}
                            <section
                                className="bg-surface rounded-2xl p-lg md:p-xl border border-primary/5"
                                style={{ boxShadow: '0 4px 24px rgba(48,0,51,0.08)' }}
                            >
                                <div className="flex items-center gap-sm mb-md">
                                    <span className="material-symbols-outlined text-primary">account_circle</span>
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
                                    <p className="font-caption text-caption text-on-surface-variant mt-xs flex items-center gap-xs">
                                        <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>info</span>
                                        Kuitansi digital dan akses kursus akan dikirimkan ke email ini.
                                    </p>
                                </div>
                            </section>

                            {/* Ringkasan Order */}
                            <section
                                className="bg-surface rounded-2xl p-lg md:p-xl border border-primary/5"
                                style={{ boxShadow: '0 4px 24px rgba(48,0,51,0.08)' }}
                            >
                                <div className="flex items-center justify-between mb-lg">
                                    <div className="flex items-center gap-sm">
                                        <span className="material-symbols-outlined text-primary">shopping_cart</span>
                                        <h2 className="font-headline-md text-headline-md text-on-surface">Ringkasan Order</h2>
                                    </div>
                                    <span className="bg-primary-container text-on-primary px-sm py-xs rounded-full font-label-md text-label-md">
                                        {cartItems.length} Item
                                    </span>
                                </div>

                                {cartItems.map((item) => (
                                    <OrderItem key={item.id} item={item} />
                                ))}

                                {/* Kode Promo */}
                                <div className="pt-lg pb-sm">
                                    <label className="font-label-md text-label-md text-on-surface-variant block mb-sm">Kode Promo</label>

                                    {localCoupon ? (
                                        <div className="flex items-center gap-sm rounded-lg bg-success/10 border border-success/30 px-md py-sm">
                                            <span className="material-symbols-outlined text-success shrink-0" style={{ fontSize: '18px', fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-label-md text-label-md text-success">Kupon diterapkan!</p>
                                                <p className="font-caption text-caption text-success/80 font-mono tracking-wider">{localCoupon.coupon_code ?? localCoupon.code}</p>
                                            </div>
                                            <button
                                                onClick={handleRemoveCoupon}
                                                className="p-1 rounded text-success hover:bg-success/20 transition-colors"
                                            >
                                                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>close</span>
                                            </button>
                                        </div>
                                    ) : (
                                        <form onSubmit={handleApplyCoupon} className="flex gap-sm">
                                            <div className="relative flex-1">
                                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline" style={{ fontSize: '18px' }}>sell</span>
                                                <input
                                                    type="text"
                                                    value={couponInput}
                                                    onChange={(e) => { setCouponInput(e.target.value.toUpperCase()); setCouponError(''); }}
                                                    placeholder="Masukkan kode promo"
                                                    className="w-full pl-10 pr-md rounded-lg py-sm font-body-md text-body-md text-on-surface bg-surface-container-low border-2 border-transparent focus:border-primary focus:outline-none transition-colors"
                                                />
                                            </div>
                                            <button
                                                type="submit"
                                                disabled={couponLoading || !couponInput.trim()}
                                                className="bg-surface text-primary border-2 border-primary rounded-lg px-lg font-label-md text-label-md hover:bg-primary/5 disabled:opacity-50 transition-colors"
                                            >
                                                {couponLoading
                                                    ? <span className="material-symbols-outlined animate-spin" style={{ fontSize: '18px' }}>progress_activity</span>
                                                    : 'Terapkan'
                                                }
                                            </button>
                                        </form>
                                    )}

                                    {couponError && (
                                        <p className="mt-2 font-caption text-caption text-error flex items-center gap-xs">
                                            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>error</span>
                                            {couponError}
                                        </p>
                                    )}
                                </div>
                            </section>
                        </div>

                        {/* ─── Kolom Kanan ─── */}
                        <div className="lg:col-span-5 relative">
                            <div
                                className="bg-surface rounded-2xl p-lg md:p-xl border border-primary/5 sticky top-[88px]"
                                style={{ boxShadow: '0 4px 24px rgba(48,0,51,0.08)' }}
                            >
                                <div className="flex items-center gap-sm mb-lg">
                                    <span className="material-symbols-outlined text-primary">account_balance_wallet</span>
                                    <h2 className="font-headline-md text-headline-md text-on-surface">Ringkasan Pembayaran</h2>
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
                                            <span className="material-symbols-outlined animate-spin" style={{ fontSize: '20px' }}>progress_activity</span>
                                        ) : (
                                            <>
                                                <span className="material-symbols-outlined" style={{ fontSize: '20px', fontVariationSettings: "'FILL' 1" }}>rocket_launch</span>
                                                Bayar Sekarang
                                            </>
                                        )}
                                    </button>
                                </form>

                                <div className="flex flex-col items-center gap-xs mt-md">
                                    <div className="flex items-center gap-xs text-on-surface-variant">
                                        <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>verified_user</span>
                                        <span className="font-caption text-caption">Pembayaran dijamin aman dan terenkripsi.</span>
                                    </div>
                                    <p className="font-caption text-caption text-outline" style={{ fontSize: '11px' }}>
                                        Powered by <span className="font-semibold text-on-surface-variant">Midtrans</span>
                                    </p>
                                </div>

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

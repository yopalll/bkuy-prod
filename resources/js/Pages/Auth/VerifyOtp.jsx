import { Head, useForm, usePage, router } from '@inertiajs/react';
import { useState, useRef } from 'react';
import BrandLogo from '@/Components/BrandLogo';

// Layar: login_registrasi_belajarkuy/code.html (Vascha & Quinsha)
// Route: GET /verify-email → verification.notice
export default function VerifyOtp({ email }) {
    const { errors, flash } = usePage().props;
    const { data, setData, post, processing, reset } = useForm({ code: '' });
    const [resending, setResending] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const timerRef = useRef(null);

    function startCountdown() {
        setCountdown(60);
        clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            setCountdown((c) => {
                if (c <= 1) { clearInterval(timerRef.current); return 0; }
                return c - 1;
            });
        }, 1000);
    }

    const submit = (e) => {
        e.preventDefault();
        post(route('verification.verify.otp'), { onError: () => {} });
    };

    const resend = async () => {
        if (resending || countdown > 0) return;
        setResending(true);
        router.post(route('verification.resend'), {}, {
            onFinish: () => { setResending(false); startCountdown(); },
        });
    };

    // Handle 6-digit input — replace non-numeric
    const handleCodeChange = (e) => {
        const val = e.target.value.replace(/\D/g, '').slice(0, 6);
        setData('code', val);
    };

    return (
        <>
            <Head title="Verifikasi Email — BelajarKUY" />

            <div className="bg-background text-on-background font-body-md text-body-md min-h-screen flex items-center justify-center p-md md:p-margin-desktop antialiased">
                {/* Card: split layout (sesuai design auth) */}
                <div
                    className="w-full max-w-4xl bg-surface rounded-[24px] flex flex-col md:flex-row overflow-hidden border border-primary/5"
                    style={{ boxShadow: '0 12px 40px rgba(48,0,51,0.08)' }}
                >
                    {/* ── Left side: brand (hidden mobile) ── */}
                    <div className="hidden md:flex md:w-5/12 lg:w-1/2 relative bg-primary-container p-xl flex-col justify-between overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-primary-container via-primary-container/90 to-primary-container/60 z-10" />

                        <div className="relative z-20 flex flex-col h-full justify-between">
                            {/* Logo */}
                            <BrandLogo dark size="md" />

                            {/* Welcome text */}
                            <div className="mt-auto mb-xl">
                                <div className="w-16 h-16 rounded-2xl bg-secondary-container/20 flex items-center justify-center mb-lg">
                                    <span
                                        className="material-symbols-outlined text-secondary-container"
                                        style={{ fontVariationSettings: "'FILL' 1", fontSize: '32px' }}
                                    >
                                        mark_email_read
                                    </span>
                                </div>
                                <h1 className="font-headline-lg text-headline-lg text-surface mb-sm leading-tight">
                                    Satu Langkah Lagi!
                                </h1>
                                <p className="font-body-lg text-body-lg text-primary-fixed-dim max-w-sm">
                                    Kami kirimkan kode verifikasi ke emailmu. Periksa inbox (dan folder spam) dan masukkan kodenya.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* ── Right side: form ── */}
                    <div className="w-full md:w-7/12 lg:w-1/2 p-xl lg:p-xxl flex flex-col justify-center bg-surface">
                        {/* Mobile logo */}
                        <div className="md:hidden flex items-center justify-center mb-xl">
                            <BrandLogo size="md" />
                        </div>

                        <div className="w-full max-w-md mx-auto">
                            {/* Heading */}
                            <div className="flex items-center gap-sm mb-xs">
                                <span
                                    className="material-symbols-outlined text-primary"
                                    style={{ fontVariationSettings: "'FILL' 1", fontSize: '28px' }}
                                >
                                    mark_email_read
                                </span>
                                <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">
                                    Verifikasi Email
                                </h2>
                            </div>
                            <p className="font-body-md text-body-md text-on-surface-variant mb-xl">
                                Kode 6 digit telah dikirim ke{' '}
                                <span className="font-bold text-primary">{email}</span>.
                            </p>

                            {/* Flash / success message */}
                            {flash?.success && (
                                <div className="flex items-center gap-sm bg-success/10 border border-success/20 rounded-xl px-md py-sm mb-md">
                                    <span
                                        className="material-symbols-outlined text-success text-[18px] flex-shrink-0"
                                        style={{ fontVariationSettings: "'FILL' 1" }}
                                    >
                                        check_circle
                                    </span>
                                    <p className="font-label-md text-label-md text-success">{flash.success}</p>
                                </div>
                            )}

                            <form onSubmit={submit} className="flex flex-col gap-md">
                                {/* OTP Input */}
                                <div className="flex flex-col gap-xs">
                                    <label
                                        htmlFor="otp-code"
                                        className="font-label-md text-label-md text-on-surface ml-xs"
                                    >
                                        Kode Verifikasi
                                    </label>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-md text-outline pointer-events-none">
                                            <span className="material-symbols-outlined text-[20px]">dialpad</span>
                                        </span>
                                        <input
                                            id="otp-code"
                                            type="text"
                                            inputMode="numeric"
                                            autoFocus
                                            autoComplete="one-time-code"
                                            maxLength={6}
                                            value={data.code}
                                            onChange={handleCodeChange}
                                            placeholder="• • • • • •"
                                            className={`w-full bg-surface-container-low text-on-surface font-body-md text-body-md rounded-lg py-4 pl-[44px] pr-md border-2 text-center tracking-[0.5em] text-2xl font-bold focus:bg-surface outline-none transition-all duration-200 placeholder:text-outline-variant placeholder:tracking-[0.3em] ${
                                                errors.code
                                                    ? 'border-error bg-error-container/20'
                                                    : 'border-transparent focus:border-primary-container'
                                            }`}
                                        />
                                    </div>
                                    {errors.code && (
                                        <p className="flex items-center gap-xs font-label-md text-label-md text-error ml-xs mt-xs">
                                            <span className="material-symbols-outlined text-[16px]">error</span>
                                            {errors.code}
                                        </p>
                                    )}
                                </div>

                                {/* Submit button */}
                                <button
                                    type="submit"
                                    disabled={processing || data.code.length !== 6}
                                    className="w-full bg-primary-container text-on-primary font-label-md text-label-md py-4 rounded-lg hover:bg-on-primary-fixed-variant active:scale-[0.98] transition-all duration-200 shadow-sm flex justify-center items-center gap-sm group disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {processing ? (
                                        <>
                                            <span className="material-symbols-outlined text-[20px] animate-spin">progress_activity</span>
                                            Memverifikasi…
                                        </>
                                    ) : (
                                        <>
                                            Verifikasi Email
                                            <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">
                                                arrow_forward
                                            </span>
                                        </>
                                    )}
                                </button>
                            </form>

                            {/* Divider */}
                            <div className="flex items-center gap-md my-lg">
                                <div className="flex-1 h-px bg-outline-variant" />
                                <span className="font-caption text-caption text-on-surface-variant">atau</span>
                                <div className="flex-1 h-px bg-outline-variant" />
                            </div>

                            {/* Resend button */}
                            <button
                                type="button"
                                onClick={resend}
                                disabled={resending || countdown > 0}
                                className="w-full flex items-center justify-center gap-sm font-label-md text-label-md py-3 rounded-lg border-2 border-outline-variant hover:border-primary-container hover:text-primary transition-all duration-200 text-on-surface-variant disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span className={`material-symbols-outlined text-[18px] ${resending ? 'animate-spin' : ''}`}>
                                    refresh
                                </span>
                                {countdown > 0
                                    ? `Kirim ulang dalam ${countdown}s`
                                    : resending
                                    ? 'Mengirim…'
                                    : 'Kirim Ulang Kode'}
                            </button>

                            {/* Info */}
                            <p className="font-caption text-caption text-on-surface-variant text-center mt-lg">
                                Tidak menemukan email? Periksa folder{' '}
                                <span className="font-bold">Spam</span> atau tekan "Kirim Ulang Kode".
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

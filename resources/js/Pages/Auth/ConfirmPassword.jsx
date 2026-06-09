import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';

// Desain: login_registrasi_belajarkuy/code.html (gaya auth Vascha & Quinsha)
export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({ password: '' });
    const [visible, setVisible] = useState(false);

    function submit(e) {
        e.preventDefault();
        post(route('password.confirm'), { onFinish: () => reset('password') });
    }

    return (
        <GuestLayout
            panelTitle="Konfirmasi Password"
            panelSubtitle="Kami perlu memastikan identitas Anda sebelum melanjutkan tindakan ini."
        >
            <Head title="Konfirmasi Password — BelajarKUY" />

            <div className="flex items-center gap-md mb-xl">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span
                        className="material-symbols-outlined text-primary text-[28px]"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                        lock
                    </span>
                </div>
                <div>
                    <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">
                        Konfirmasi Password
                    </h2>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-xs">
                        Masukkan password Anda untuk melanjutkan.
                    </p>
                </div>
            </div>

            <form onSubmit={submit} className="flex flex-col gap-md" noValidate>
                <div className="flex flex-col gap-xs">
                    <label htmlFor="password" className="font-label-md text-label-md text-on-surface ml-xs">
                        Password
                    </label>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-md text-outline pointer-events-none">
                            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>lock</span>
                        </span>
                        <input
                            id="password"
                            type={visible ? 'text' : 'password'}
                            value={data.password}
                            autoComplete="current-password"
                            autoFocus
                            required
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="••••••••"
                            className={`w-full bg-surface-container-low text-on-surface font-body-md text-body-md rounded-lg py-3 pl-[44px] pr-[44px] border-2 outline-none transition-all duration-200 placeholder:text-outline-variant ${
                                errors.password
                                    ? 'border-error bg-error-container/20'
                                    : 'border-transparent focus:border-primary-container focus:bg-surface'
                            }`}
                        />
                        <button
                            type="button"
                            onClick={() => setVisible(!visible)}
                            className="absolute inset-y-0 right-0 flex items-center pr-md text-outline hover:text-primary transition-colors focus:outline-none"
                        >
                            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                                {visible ? 'visibility' : 'visibility_off'}
                            </span>
                        </button>
                    </div>
                    {errors.password && (
                        <p className="font-caption text-caption text-error ml-xs">{errors.password}</p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="w-full bg-primary-container text-on-primary font-label-md text-label-md py-4 rounded-lg hover:bg-on-primary-fixed-variant active:scale-[0.98] transition-all duration-200 shadow-sm flex justify-center items-center gap-sm disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {processing ? (
                        <>
                            <span className="material-symbols-outlined animate-spin" style={{ fontSize: '20px' }}>progress_activity</span>
                            Memverifikasi…
                        </>
                    ) : (
                        <>
                            Konfirmasi
                            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>arrow_forward</span>
                        </>
                    )}
                </button>
            </form>
        </GuestLayout>
    );
}

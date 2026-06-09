import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';

// Halaman login khusus admin — pakai form yang sama dengan Login.jsx
// Desain: login_registrasi_belajarkuy/code.html (Vascha & Quinsha)
export default function AdminLogin({ status }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    function submit(e) {
        e.preventDefault();
        post(route('login'), { onFinish: () => reset('password') });
    }

    return (
        <GuestLayout
            panelTitle="Admin Portal"
            panelSubtitle="Masuk ke panel administrasi BelajarKUY untuk mengelola platform."
        >
            <Head title="Login Admin — BelajarKUY" />

            {status && (
                <div className="mb-md p-3 rounded-lg bg-success/10 border border-success/30 font-body-md text-body-md text-success">
                    {status}
                </div>
            )}

            {/* Badge admin */}
            <div className="mb-md flex items-center gap-sm">
                <span className="inline-flex items-center gap-1 bg-primary/10 text-primary font-caption text-caption px-sm py-xs rounded-full">
                    <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                        admin_panel_settings
                    </span>
                    Admin Console
                </span>
            </div>

            <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-xs">
                Masuk Admin
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mb-xl">
                Masukkan kredensial akun admin Anda.
            </p>

            <form onSubmit={submit} className="flex flex-col gap-md" noValidate>
                {/* Email */}
                <div className="flex flex-col gap-xs">
                    <label htmlFor="email" className="font-label-md text-label-md text-on-surface ml-xs">
                        Email
                    </label>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-md text-outline pointer-events-none">
                            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>mail</span>
                        </span>
                        <input
                            id="email"
                            type="email"
                            value={data.email}
                            autoComplete="username"
                            autoFocus
                            required
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="admin@belajarkuy.id"
                            className={`w-full bg-surface-container-low text-on-surface font-body-md text-body-md rounded-lg py-3 pl-[44px] pr-md border-2 outline-none transition-all duration-200 placeholder:text-outline-variant ${
                                errors.email
                                    ? 'border-error bg-error-container/20'
                                    : 'border-transparent focus:border-primary-container focus:bg-surface'
                            }`}
                        />
                    </div>
                    {errors.email && (
                        <p className="font-caption text-caption text-error ml-xs">{errors.email}</p>
                    )}
                </div>

                {/* Password */}
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
                            type={showPassword ? 'text' : 'password'}
                            value={data.password}
                            autoComplete="current-password"
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
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 flex items-center pr-md text-outline hover:text-primary transition-colors focus:outline-none"
                        >
                            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                                {showPassword ? 'visibility' : 'visibility_off'}
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
                    className="w-full bg-primary-container text-on-primary font-label-md text-label-md py-4 rounded-lg hover:bg-on-primary-fixed-variant active:scale-[0.98] transition-all duration-200 shadow-sm flex justify-center items-center gap-sm group disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {processing ? (
                        <>
                            <span className="material-symbols-outlined animate-spin" style={{ fontSize: '20px' }}>progress_activity</span>
                            Memproses…
                        </>
                    ) : (
                        <>
                            Masuk ke Admin Panel
                            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform" style={{ fontSize: '20px' }}>
                                arrow_forward
                            </span>
                        </>
                    )}
                </button>
            </form>
        </GuestLayout>
    );
}

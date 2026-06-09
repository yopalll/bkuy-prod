import { useState } from 'react';
import { Link, useForm } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';

// Desain: login_registrasi_belajarkuy/code.html (Vascha & Quinsha)
export default function Login({ status, canResetPassword }) {
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
        <GuestLayout>
            {/* Session status */}
            {status && (
                <div className="mb-md p-3 rounded-lg bg-success/10 border border-success/30 font-body-md text-body-md text-success">
                    {status}
                </div>
            )}

            <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-xs">
                Masuk
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mb-xl">
                Silakan masukkan kredensial Anda untuk mengakses akun.
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
                            name="email"
                            value={data.email}
                            autoComplete="username"
                            autoFocus
                            required
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="nama@email.com"
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
                            name="password"
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

                {/* Lupa Password */}
                {canResetPassword && (
                    <div className="flex justify-end -mt-xs mb-sm">
                        <Link
                            href={route('password.request')}
                            className="font-label-md text-label-md text-primary-container hover:text-primary transition-colors hover:underline underline-offset-4"
                        >
                            Lupa Password?
                        </Link>
                    </div>
                )}

                {/* Submit */}
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
                            Masuk Sekarang
                            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform" style={{ fontSize: '20px' }}>
                                arrow_forward
                            </span>
                        </>
                    )}
                </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-md my-lg">
                <div className="h-px bg-outline-variant flex-1" />
                <span className="font-caption text-caption text-on-surface-variant uppercase tracking-wider">atau</span>
                <div className="h-px bg-outline-variant flex-1" />
            </div>

            {/* Google OAuth */}
            <a
                href={route('auth.google')}
                className="w-full bg-surface border-2 border-surface-container-high text-on-surface font-label-md text-label-md py-3.5 rounded-lg hover:bg-surface-container-low hover:border-outline-variant active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-sm"
            >
                <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Login dengan Google
            </a>

            {/* Link ke Register */}
            <p className="text-center mt-xl font-body-md text-body-md text-on-surface-variant">
                Belum punya akun?{' '}
                <Link
                    href={route('register')}
                    className="font-label-md text-label-md text-primary-container hover:text-primary hover:underline underline-offset-4 transition-colors"
                >
                    Daftar
                </Link>
            </p>
        </GuestLayout>
    );
}

import { useState } from 'react';
import { Link, useForm, usePage } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';

/**
 * Login page — React+Inertia (L2 Albariqi, feature/auth-react).
 * Fitur: login email/password, Google OAuth, remember me, link ke register & forgot-password.
 * Controller: App\Http\Controllers\Auth\AuthenticatedSessionController@create → Inertia::render('Auth/Login')
 */
export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    function submit(e) {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    }

    return (
        <GuestLayout
            title="Selamat datang kembali 👋"
            subtitle="Masuk ke akun BelajarKUY kamu"
        >
            {/* Session status (e.g., setelah reset password berhasil) */}
            {status && (
                <div className="mb-5 p-3 rounded-lg bg-green-50 border border-green-200 text-sm text-green-700">
                    {status}
                </div>
            )}

            {/* Google OAuth */}
            <a
                href={route('auth.google')}
                id="google-login-btn"
                className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-200 rounded-xl bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm transition-all duration-200"
            >
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Masuk dengan Google
            </a>

            {/* Divider */}
            <div className="flex items-center my-6">
                <div className="flex-1 h-px bg-gray-100" />
                <span className="mx-4 text-xs text-gray-400 font-medium">atau masuk dengan email</span>
                <div className="flex-1 h-px bg-gray-100" />
            </div>

            {/* Form */}
            <form onSubmit={submit} className="space-y-5" noValidate>
                {/* Email */}
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Email
                    </label>
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
                        className={`w-full rounded-xl border px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all duration-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                            errors.email
                                ? 'border-red-400 bg-red-50 focus:ring-red-400'
                                : 'border-gray-200 bg-gray-50 hover:border-gray-300 focus:bg-white'
                        }`}
                    />
                    {errors.email && (
                        <p className="mt-1.5 text-xs text-red-600">{errors.email}</p>
                    )}
                </div>

                {/* Password */}
                <div>
                    <div className="flex items-center justify-between mb-1.5">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                            >
                                Lupa password?
                            </Link>
                        )}
                    </div>
                    <div className="relative">
                        <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={data.password}
                            autoComplete="current-password"
                            required
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="••••••••"
                            className={`w-full rounded-xl border px-4 py-3 pr-12 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all duration-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                                errors.password
                                    ? 'border-red-400 bg-red-50 focus:ring-red-400'
                                    : 'border-gray-200 bg-gray-50 hover:border-gray-300 focus:bg-white'
                            }`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                        >
                            {showPassword ? (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                </svg>
                            ) : (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            )}
                        </button>
                    </div>
                    {errors.password && (
                        <p className="mt-1.5 text-xs text-red-600">{errors.password}</p>
                    )}
                </div>

                {/* Remember me */}
                <label className="flex items-center gap-3 cursor-pointer select-none">
                    <input
                        id="remember_me"
                        type="checkbox"
                        name="remember"
                        checked={data.remember}
                        onChange={(e) => setData('remember', e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-600">Ingat saya</span>
                </label>

                {/* Submit */}
                <button
                    id="login-submit-btn"
                    type="submit"
                    disabled={processing}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3.5 text-sm font-semibold text-white hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 shadow-sm shadow-indigo-200"
                >
                    {processing ? (
                        <>
                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                            </svg>
                            Memproses…
                        </>
                    ) : 'Masuk'}
                </button>
            </form>

            {/* Link register */}
            <p className="mt-6 text-center text-sm text-gray-500">
                Belum punya akun?{' '}
                <Link href={route('register')} className="font-semibold text-indigo-600 hover:text-indigo-700">
                    Daftar sekarang
                </Link>
            </p>
        </GuestLayout>
    );
}

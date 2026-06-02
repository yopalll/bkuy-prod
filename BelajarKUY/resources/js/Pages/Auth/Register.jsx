import { useState } from 'react';
import { Link, useForm } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';

/**
 * Register page — React+Inertia (L2 Albariqi, feature/auth-react).
 * Fitur: pilihan role (Siswa/Instruktur), nama, email, password + konfirmasi.
 * Controller: App\Http\Controllers\Auth\RegisteredUserController@create → Inertia::render('Auth/Register')
 */
export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'user', // default: Siswa
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    function submit(e) {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    }

    return (
        <GuestLayout
            title="Buat akun baru 🚀"
            subtitle="Bergabung dan mulai belajar hari ini"
        >
            <form onSubmit={submit} className="space-y-5" noValidate>
                {/* Pilihan Role */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Daftar sebagai
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        {/* Siswa */}
                        <label
                            htmlFor="role_student"
                            className={`flex flex-col items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 select-none ${
                                data.role === 'user'
                                    ? 'border-indigo-500 bg-indigo-50 shadow-sm shadow-indigo-100'
                                    : 'border-gray-200 bg-white hover:border-indigo-300 hover:bg-gray-50'
                            }`}
                        >
                            <input
                                type="radio"
                                id="role_student"
                                name="role"
                                value="user"
                                checked={data.role === 'user'}
                                onChange={() => setData('role', 'user')}
                                className="sr-only"
                            />
                            <span className="text-3xl mb-1.5">🎓</span>
                            <span className={`font-semibold text-sm ${data.role === 'user' ? 'text-indigo-700' : 'text-gray-700'}`}>
                                Siswa
                            </span>
                            <span className="text-xs text-gray-400 mt-0.5">Belajar dari kursus</span>
                        </label>

                        {/* Instruktur */}
                        <label
                            htmlFor="role_instructor"
                            className={`flex flex-col items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 select-none ${
                                data.role === 'instructor'
                                    ? 'border-indigo-500 bg-indigo-50 shadow-sm shadow-indigo-100'
                                    : 'border-gray-200 bg-white hover:border-indigo-300 hover:bg-gray-50'
                            }`}
                        >
                            <input
                                type="radio"
                                id="role_instructor"
                                name="role"
                                value="instructor"
                                checked={data.role === 'instructor'}
                                onChange={() => setData('role', 'instructor')}
                                className="sr-only"
                            />
                            <span className="text-3xl mb-1.5">📖</span>
                            <span className={`font-semibold text-sm ${data.role === 'instructor' ? 'text-indigo-700' : 'text-gray-700'}`}>
                                Instruktur
                            </span>
                            <span className="text-xs text-gray-400 mt-0.5">Buat & jual kursus</span>
                        </label>
                    </div>
                    {errors.role && (
                        <p className="mt-1.5 text-xs text-red-600">{errors.role}</p>
                    )}
                </div>

                {/* Nama Lengkap */}
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Nama Lengkap
                    </label>
                    <input
                        id="name"
                        type="text"
                        name="name"
                        value={data.name}
                        autoComplete="name"
                        autoFocus
                        required
                        onChange={(e) => setData('name', e.target.value)}
                        placeholder="Nama kamu"
                        className={`w-full rounded-xl border px-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all duration-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                            errors.name
                                ? 'border-red-400 bg-red-50 focus:ring-red-400'
                                : 'border-gray-200 bg-gray-50 hover:border-gray-300 focus:bg-white'
                        }`}
                    />
                    {errors.name && (
                        <p className="mt-1.5 text-xs text-red-600">{errors.name}</p>
                    )}
                </div>

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
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Password
                    </label>
                    <div className="relative">
                        <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={data.password}
                            autoComplete="new-password"
                            required
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="Min. 8 karakter"
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

                {/* Konfirmasi Password */}
                <div>
                    <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Konfirmasi Password
                    </label>
                    <div className="relative">
                        <input
                            id="password_confirmation"
                            type={showConfirmPassword ? 'text' : 'password'}
                            name="password_confirmation"
                            value={data.password_confirmation}
                            autoComplete="new-password"
                            required
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            placeholder="Ulangi password"
                            className={`w-full rounded-xl border px-4 py-3 pr-12 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all duration-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                                errors.password_confirmation
                                    ? 'border-red-400 bg-red-50 focus:ring-red-400'
                                    : 'border-gray-200 bg-gray-50 hover:border-gray-300 focus:bg-white'
                            }`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            aria-label={showConfirmPassword ? 'Sembunyikan konfirmasi' : 'Tampilkan konfirmasi'}
                        >
                            {showConfirmPassword ? (
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
                    {errors.password_confirmation && (
                        <p className="mt-1.5 text-xs text-red-600">{errors.password_confirmation}</p>
                    )}
                </div>

                {/* Submit */}
                <button
                    id="register-submit-btn"
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
                            Mendaftarkan…
                        </>
                    ) : 'Daftar Sekarang'}
                </button>
            </form>

            {/* Link login */}
            <p className="mt-6 text-center text-sm text-gray-500">
                Sudah punya akun?{' '}
                <Link href={route('login')} className="font-semibold text-indigo-600 hover:text-indigo-700">
                    Masuk di sini
                </Link>
            </p>
        </GuestLayout>
    );
}

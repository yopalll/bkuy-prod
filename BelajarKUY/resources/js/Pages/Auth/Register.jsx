import { useState } from 'react';
import { Link, useForm } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';

// Desain: login_registrasi_belajarkuy/code.html (Vascha & Quinsha) — halaman register
export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'user',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm]   = useState(false);

    function submit(e) {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    }

    return (
        <GuestLayout
            panelTitle="Mulai Belajar Hari Ini!"
            panelSubtitle="Bergabunglah dengan ribuan pelajar yang sudah mengembangkan skill mereka bersama BelajarKUY."
        >
            <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-xs">
                Daftar
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mb-xl">
                Buat akun baru dan mulai perjalanan belajarmu.
            </p>

            <form onSubmit={submit} className="flex flex-col gap-md" noValidate>
                {/* Nama Lengkap */}
                <div className="flex flex-col gap-xs">
                    <label htmlFor="name" className="font-label-md text-label-md text-on-surface ml-xs">
                        Nama Lengkap
                    </label>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-md text-outline pointer-events-none">
                            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>person</span>
                        </span>
                        <input
                            id="name"
                            type="text"
                            name="name"
                            value={data.name}
                            autoComplete="name"
                            autoFocus
                            required
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="Nama lengkap kamu"
                            className={`w-full bg-surface-container-low text-on-surface font-body-md text-body-md rounded-lg py-3 pl-[44px] pr-md border-2 outline-none transition-all duration-200 placeholder:text-outline-variant ${
                                errors.name
                                    ? 'border-error bg-error-container/20'
                                    : 'border-transparent focus:border-primary-container focus:bg-surface'
                            }`}
                        />
                    </div>
                    {errors.name && (
                        <p className="font-caption text-caption text-error ml-xs">{errors.name}</p>
                    )}
                </div>

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
                            autoComplete="new-password"
                            required
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="Minimal 8 karakter"
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

                {/* Konfirmasi Password */}
                <div className="flex flex-col gap-xs">
                    <label htmlFor="password_confirmation" className="font-label-md text-label-md text-on-surface ml-xs">
                        Konfirmasi Password
                    </label>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-md text-outline pointer-events-none">
                            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>lock_reset</span>
                        </span>
                        <input
                            id="password_confirmation"
                            type={showConfirm ? 'text' : 'password'}
                            name="password_confirmation"
                            value={data.password_confirmation}
                            autoComplete="new-password"
                            required
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            placeholder="Ulangi password kamu"
                            className={`w-full bg-surface-container-low text-on-surface font-body-md text-body-md rounded-lg py-3 pl-[44px] pr-[44px] border-2 outline-none transition-all duration-200 placeholder:text-outline-variant ${
                                errors.password_confirmation
                                    ? 'border-error bg-error-container/20'
                                    : 'border-transparent focus:border-primary-container focus:bg-surface'
                            }`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirm(!showConfirm)}
                            className="absolute inset-y-0 right-0 flex items-center pr-md text-outline hover:text-primary transition-colors focus:outline-none"
                        >
                            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
                                {showConfirm ? 'visibility' : 'visibility_off'}
                            </span>
                        </button>
                    </div>
                    {errors.password_confirmation && (
                        <p className="font-caption text-caption text-error ml-xs">{errors.password_confirmation}</p>
                    )}
                </div>

                {/* Role Selector */}
                <div className="flex flex-col gap-xs">
                    <span className="font-label-md text-label-md text-on-surface ml-xs">Daftar sebagai</span>
                    <div className="grid grid-cols-2 gap-sm">
                        {[
                            { value: 'user', icon: 'school', label: 'Pelajar' },
                            { value: 'instructor', icon: 'cast_for_education', label: 'Instruktur' },
                        ].map(({ value, icon, label }) => (
                            <button
                                key={value}
                                type="button"
                                onClick={() => setData('role', value)}
                                className={`flex items-center justify-center gap-sm py-3 rounded-lg border-2 font-label-md text-label-md transition-all duration-200 ${
                                    data.role === value
                                        ? 'border-primary-container bg-primary-fixed text-primary-container'
                                        : 'border-surface-container-high bg-surface-container-low text-on-surface-variant hover:border-outline-variant'
                                }`}
                            >
                                <span
                                    className="material-symbols-outlined"
                                    style={{ fontSize: '20px', fontVariationSettings: "'FILL' 1" }}
                                >
                                    {icon}
                                </span>
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={processing}
                    className="w-full bg-primary-container text-on-primary font-label-md text-label-md py-4 rounded-lg hover:bg-on-primary-fixed-variant active:scale-[0.98] transition-all duration-200 shadow-sm flex justify-center items-center gap-sm group disabled:opacity-60 disabled:cursor-not-allowed mt-sm"
                >
                    {processing ? (
                        <>
                            <span className="material-symbols-outlined animate-spin" style={{ fontSize: '20px' }}>progress_activity</span>
                            Memproses…
                        </>
                    ) : (
                        <>
                            Buat Akun
                            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform" style={{ fontSize: '20px' }}>
                                arrow_forward
                            </span>
                        </>
                    )}
                </button>
            </form>

            {/* Link ke Login */}
            <p className="text-center mt-xl font-body-md text-body-md text-on-surface-variant">
                Sudah punya akun?{' '}
                <Link
                    href={route('login')}
                    className="font-label-md text-label-md text-primary-container hover:text-primary hover:underline underline-offset-4 transition-colors"
                >
                    Masuk
                </Link>
            </p>
        </GuestLayout>
    );
}

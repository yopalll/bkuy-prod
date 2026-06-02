import { useForm } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';

/**
 * ForgotPassword page — React+Inertia (L2 Albariqi, feature/auth-react).
 * Kirim email link reset password.
 * Controller: App\Http\Controllers\Auth\PasswordResetLinkController@create → Inertia::render('Auth/ForgotPassword')
 */
export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    function submit(e) {
        e.preventDefault();
        post(route('password.email'));
    }

    return (
        <GuestLayout
            title="Lupa password? 🔑"
            subtitle="Masukkan emailmu dan kami kirimkan link reset"
        >
            {/* Status sukses */}
            {status && (
                <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200 flex items-start gap-3">
                    <svg className="w-5 h-5 text-green-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm text-green-700">{status}</p>
                </div>
            )}

            {/* Info */}
            <div className="mb-6 p-4 rounded-xl bg-blue-50 border border-blue-100 flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-blue-600">
                    Masukkan alamat email yang terdaftar. Kami akan mengirimkan link untuk membuat password baru.
                </p>
            </div>

            <form onSubmit={submit} className="space-y-5" noValidate>
                {/* Email */}
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                        Alamat Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
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

                {/* Submit */}
                <button
                    id="forgot-password-submit-btn"
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
                            Mengirim…
                        </>
                    ) : (
                        <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            Kirim Link Reset Password
                        </>
                    )}
                </button>
            </form>

            {/* Link kembali ke login */}
            <p className="mt-6 text-center text-sm text-gray-500">
                <a
                    href={route('login')}
                    className="inline-flex items-center gap-1.5 font-semibold text-indigo-600 hover:text-indigo-700"
                >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Kembali ke halaman login
                </a>
            </p>
        </GuestLayout>
    );
}

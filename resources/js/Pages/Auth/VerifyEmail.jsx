import { Head, useForm, router } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';

// Desain: login_registrasi_belajarkuy/code.html (gaya auth Vascha & Quinsha)
export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    function resend(e) {
        e.preventDefault();
        post(route('verification.send'));
    }

    return (
        <GuestLayout
            panelTitle="Verifikasi Email"
            panelSubtitle="Satu langkah lagi untuk memulai perjalanan belajarmu bersama BelajarKUY."
        >
            <Head title="Verifikasi Email — BelajarKUY" />

            <div className="flex flex-col items-center text-center gap-lg">
                {/* Ikon */}
                <div className="w-20 h-20 rounded-full bg-secondary-container/20 flex items-center justify-center">
                    <span
                        className="material-symbols-outlined text-secondary-container text-[48px]"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                        mark_email_unread
                    </span>
                </div>

                <div>
                    <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface mb-xs">
                        Cek Email Kamu
                    </h2>
                    <p className="font-body-md text-body-md text-on-surface-variant max-w-sm">
                        Kami telah mengirimkan link verifikasi ke email kamu. Klik link tersebut untuk mengaktifkan akun.
                    </p>
                </div>

                {/* Status kiriman ulang */}
                {status === 'verification-link-sent' && (
                    <div className="w-full p-3 rounded-lg bg-success/10 border border-success/30 font-body-md text-body-md text-success">
                        Link verifikasi baru telah dikirim ke email kamu.
                    </div>
                )}

                {/* Kirim ulang */}
                <form onSubmit={resend} className="w-full">
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-primary-container text-on-primary font-label-md text-label-md py-4 rounded-lg hover:bg-on-primary-fixed-variant active:scale-[0.98] transition-all duration-200 shadow-sm flex justify-center items-center gap-sm disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {processing ? (
                            <>
                                <span className="material-symbols-outlined animate-spin" style={{ fontSize: '20px' }}>progress_activity</span>
                                Mengirim…
                            </>
                        ) : (
                            <>
                                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>send</span>
                                Kirim Ulang Email Verifikasi
                            </>
                        )}
                    </button>
                </form>

                {/* Logout */}
                <button
                    type="button"
                    onClick={() => router.post('/logout')}
                    className="w-full font-label-md text-label-md text-on-surface-variant hover:text-error transition-colors py-2"
                >
                    Keluar dari akun ini
                </button>
            </div>
        </GuestLayout>
    );
}

import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm, usePage } from '@inertiajs/react';

const CONTACTS = [
    { icon: 'email',     label: 'Email', value: 'hello@belajarkuy.id' },
    { icon: 'schedule',  label: 'Jam Operasional', value: 'Senin – Jumat, 09.00–17.00 WIB' },
    { icon: 'location_on', label: 'Lokasi', value: 'Bandung, Jawa Barat, Indonesia' },
];

export default function Contact() {
    const { flash } = usePage().props;

    const { data, setData, post, processing, errors, reset } = useForm({
        name:    '',
        email:   '',
        subject: '',
        message: '',
    });

    function handleSubmit(e) {
        e.preventDefault();
        post(route('contact.store'), { onSuccess: () => reset() });
    }

    return (
        <AppLayout>
            <Head title="Hubungi Kami — BelajarKUY" />

            {/* Hero */}
            <section className="bg-primary text-on-primary py-14 px-margin-mobile md:px-margin-desktop">
                <div className="max-w-3xl mx-auto text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 mb-5">
                        <span className="material-symbols-outlined text-[32px]">mail</span>
                    </div>
                    <h1 className="font-headline-lg text-headline-lg font-bold mb-3">Hubungi Kami</h1>
                    <p className="font-body-lg text-body-lg opacity-80">
                        Kami senang mendengar dari Anda. Isi formulir di bawah atau hubungi kami langsung.
                    </p>
                </div>
            </section>

            <div className="max-w-5xl mx-auto px-margin-mobile md:px-margin-desktop py-xl">
                <div className="grid md:grid-cols-3 gap-xl">
                    {/* Info kontak */}
                    <div className="space-y-lg">
                        <h2 className="font-title-lg text-title-lg font-bold text-on-surface">Info Kontak</h2>
                        {CONTACTS.map(({ icon, label, value }) => (
                            <div key={label} className="flex gap-4 items-start">
                                <div className="w-10 h-10 rounded-xl bg-primary-fixed/30 flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-primary text-[20px]">{icon}</span>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">{label}</p>
                                    <p className="text-sm font-semibold text-on-surface mt-0.5">{value}</p>
                                </div>
                            </div>
                        ))}

                        <div className="pt-lg border-t border-outline-variant">
                            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-3">Ikuti Kami</p>
                            <div className="flex gap-3">
                                {['photo_camera', 'smart_display', 'alternate_email', 'code'].map((icon) => (
                                    <div key={icon} className="w-9 h-9 rounded-xl bg-tertiary-container flex items-center justify-center cursor-pointer hover:bg-primary/20 transition-colors">
                                        <span className="material-symbols-outlined text-[18px] text-tertiary-fixed-dim">{icon}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="md:col-span-2">
                        {flash?.success && (
                            <div className="mb-lg p-4 bg-success/10 border border-success/20 rounded-2xl flex gap-3 items-start">
                                <span className="material-symbols-outlined text-success text-[20px]">check_circle</span>
                                <p className="text-sm text-success">{flash.success}</p>
                            </div>
                        )}

                        <div className="bg-surface border border-outline-variant rounded-3xl p-6 md:p-8">
                            <h2 className="font-title-lg text-title-lg font-bold text-on-surface mb-lg">Kirim Pesan</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Nama Lengkap <span className="text-error">*</span></label>
                                        <input type="text" value={data.name} onChange={(e) => setData('name', e.target.value)}
                                            placeholder="Nama Anda"
                                            className={`w-full border rounded-xl px-4 py-3 text-sm text-on-surface bg-surface-container-low focus:outline-none focus:ring-2 focus:ring-primary/30 ${errors.name ? 'border-error' : 'border-outline-variant'}`} />
                                        {errors.name && <p className="text-xs text-error mt-1">{errors.name}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Email <span className="text-error">*</span></label>
                                        <input type="email" value={data.email} onChange={(e) => setData('email', e.target.value)}
                                            placeholder="email@contoh.com"
                                            className={`w-full border rounded-xl px-4 py-3 text-sm text-on-surface bg-surface-container-low focus:outline-none focus:ring-2 focus:ring-primary/30 ${errors.email ? 'border-error' : 'border-outline-variant'}`} />
                                        {errors.email && <p className="text-xs text-error mt-1">{errors.email}</p>}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Subjek <span className="text-error">*</span></label>
                                    <input type="text" value={data.subject} onChange={(e) => setData('subject', e.target.value)}
                                        placeholder="Topik pesan Anda"
                                        className={`w-full border rounded-xl px-4 py-3 text-sm text-on-surface bg-surface-container-low focus:outline-none focus:ring-2 focus:ring-primary/30 ${errors.subject ? 'border-error' : 'border-outline-variant'}`} />
                                    {errors.subject && <p className="text-xs text-error mt-1">{errors.subject}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Pesan <span className="text-error">*</span></label>
                                    <textarea rows={6} value={data.message} onChange={(e) => setData('message', e.target.value)}
                                        placeholder="Tulis pesan Anda di sini..."
                                        className={`w-full border rounded-xl px-4 py-3 text-sm text-on-surface bg-surface-container-low focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none ${errors.message ? 'border-error' : 'border-outline-variant'}`} />
                                    {errors.message && <p className="text-xs text-error mt-1">{errors.message}</p>}
                                </div>

                                <button type="submit" disabled={processing}
                                    className="w-full py-3.5 rounded-xl bg-warning text-white font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-60">
                                    {processing ? 'Mengirim...' : 'Kirim Pesan'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

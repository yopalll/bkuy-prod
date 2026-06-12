import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function SettingsIndex({ settings = {} }) {
    const { data, setData, post, processing, errors } = useForm({
        site_name:        settings.site_name     ?? '',
        tagline:          settings.tagline       ?? '',
        email:            settings.email         ?? '',
        phone:            settings.phone         ?? '',
        address:          settings.address       ?? '',
        facebook:         settings.facebook      ?? '',
        instagram:        settings.instagram     ?? '',
        twitter:          settings.twitter       ?? '',
        youtube:          settings.youtube       ?? '',
        footer_text:      settings.footer_text   ?? '',
        logo:             null,
        logo_rocket:      null,
        logo_text_image:  null,
        favicon:          null,
        _method:          'PUT',
    });

    function handleSubmit(e) {
        e.preventDefault();
        post('/admin/settings', { forceFormData: true });
    }

    const inputCls = 'w-full bg-background-subtle border-2 border-transparent focus:border-primary rounded-lg py-sm px-md font-body-md text-body-md outline-none transition-colors';

    return (
        <AdminLayout title="Admin Portal">
            <Head title="Pengaturan Situs — BelajarKUY Admin" />

            <div className="max-w-4xl mx-auto">
                <div className="mb-lg">
                    <h1 className="font-headline-lg text-headline-lg text-primary">Pengaturan Situs</h1>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-xs">
                        Kelola konfigurasi global platform BelajarKUY.
                    </p>
                </div>

                <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-xl">
                    {/* General config */}
                    <div className="bg-surface rounded-2xl p-lg shadow-sm border border-primary/10">
                        <div className="flex items-center gap-sm mb-md pb-md border-b border-surface-variant">
                            <div className="bg-primary-container p-sm rounded-lg text-on-primary-container">
                                <span className="material-symbols-outlined text-[20px]">language</span>
                            </div>
                            <h2 className="font-headline-md text-headline-md text-primary">Konfigurasi Umum</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                            <div className="md:col-span-2 space-y-xs">
                                <label className="font-label-md text-label-md text-on-surface block">Nama Situs</label>
                                <input type="text" value={data.site_name} onChange={e => setData('site_name', e.target.value)} className={inputCls} placeholder="BelajarKUY" />
                                <p className="font-caption text-caption text-on-surface-variant">Nama merek utama yang ditampilkan di seluruh platform.</p>
                            </div>
                            <div className="md:col-span-2 space-y-xs">
                                <label className="font-label-md text-label-md text-on-surface block">Tagline</label>
                                <input type="text" value={data.tagline} onChange={e => setData('tagline', e.target.value)} className={inputCls} placeholder="Belajar mudah, karir siap!" />
                            </div>
                            <div className="space-y-xs">
                                <label className="font-label-md text-label-md text-on-surface block">Email Kontak</label>
                                <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} className={inputCls} placeholder="support@belajarkuy.id" />
                            </div>
                            <div className="space-y-xs">
                                <label className="font-label-md text-label-md text-on-surface block">Telepon</label>
                                <input type="text" value={data.phone} onChange={e => setData('phone', e.target.value)} className={inputCls} placeholder="+62 812 0000 0000" />
                            </div>
                            <div className="md:col-span-2 space-y-xs">
                                <label className="font-label-md text-label-md text-on-surface block">Alamat</label>
                                <textarea rows={2} value={data.address} onChange={e => setData('address', e.target.value)} className={`${inputCls} resize-none`} placeholder="Jakarta, Indonesia" />
                            </div>
                            <div className="md:col-span-2 space-y-xs">
                                <label className="font-label-md text-label-md text-on-surface block">Footer Text</label>
                                <input type="text" value={data.footer_text} onChange={e => setData('footer_text', e.target.value)} className={inputCls} placeholder="© 2026 BelajarKUY. All rights reserved." />
                            </div>
                            {/* Logo Rocket */}
                            <div className="space-y-xs">
                                <label className="font-label-md text-label-md text-on-surface block">Logo Rocket</label>
                                <p className="font-caption text-caption text-on-surface-variant">Gambar ikon/rocket di sebelah kiri nama brand.</p>
                                {settings.logo_rocket && (
                                    <img src={settings.logo_rocket} alt="Logo rocket" className="h-10 object-contain rounded mb-xs bg-surface-variant p-1" />
                                )}
                                <label className="flex items-center gap-sm bg-background-subtle border-2 border-dashed border-outline-variant hover:border-primary rounded-lg py-sm px-md cursor-pointer transition-colors">
                                    <span className="material-symbols-outlined text-[18px] text-on-surface-variant">upload</span>
                                    <span className="font-body-md text-body-md text-on-surface-variant truncate">
                                        {data.logo_rocket ? data.logo_rocket.name : 'Upload gambar rocket…'}
                                    </span>
                                    <input type="file" accept="image/*" className="hidden" onChange={e => setData('logo_rocket', e.target.files[0])} />
                                </label>
                            </div>

                            {/* Logo Text */}
                            <div className="space-y-xs">
                                <label className="font-label-md text-label-md text-on-surface block">Logo Teks (Tulisan)</label>
                                <p className="font-caption text-caption text-on-surface-variant">Gambar teks "BelajarKUY!" — gunakan PNG transparan.</p>
                                {settings.logo_text_image && (
                                    <img src={settings.logo_text_image} alt="Logo teks" className="h-10 object-contain rounded mb-xs bg-surface-variant p-1" />
                                )}
                                <label className="flex items-center gap-sm bg-background-subtle border-2 border-dashed border-outline-variant hover:border-primary rounded-lg py-sm px-md cursor-pointer transition-colors">
                                    <span className="material-symbols-outlined text-[18px] text-on-surface-variant">upload</span>
                                    <span className="font-body-md text-body-md text-on-surface-variant truncate">
                                        {data.logo_text_image ? data.logo_text_image.name : 'Upload gambar teks…'}
                                    </span>
                                    <input type="file" accept="image/*" className="hidden" onChange={e => setData('logo_text_image', e.target.files[0])} />
                                </label>
                            </div>

                            {/* Favicon */}
                            <div className="space-y-xs">
                                <label className="font-label-md text-label-md text-on-surface block">Favicon</label>
                                <p className="font-caption text-caption text-on-surface-variant">Ikon tab browser. Gunakan PNG/ICO ukuran 32×32 atau 64×64.</p>
                                {settings.favicon && (
                                    <img src={settings.favicon} alt="Favicon" className="h-8 w-8 object-contain rounded mb-xs bg-surface-variant p-1" />
                                )}
                                <label className="flex items-center gap-sm bg-background-subtle border-2 border-dashed border-outline-variant hover:border-primary rounded-lg py-sm px-md cursor-pointer transition-colors">
                                    <span className="material-symbols-outlined text-[18px] text-on-surface-variant">upload</span>
                                    <span className="font-body-md text-body-md text-on-surface-variant truncate">
                                        {data.favicon ? data.favicon.name : 'Upload favicon…'}
                                    </span>
                                    <input type="file" accept="image/png,image/x-icon,image/svg+xml,image/jpeg,image/webp" className="hidden" onChange={e => setData('favicon', e.target.files[0])} />
                                </label>
                            </div>

                            {/* Logo lama (fallback) */}
                            <div className="space-y-xs">
                                <label className="font-label-md text-label-md text-on-surface block">Logo Lama (Opsional)</label>
                                <p className="font-caption text-caption text-on-surface-variant">Logo tunggal sebagai fallback jika rocket/teks belum diset.</p>
                                {settings.logo && (
                                    <img src={settings.logo} alt="Logo lama" className="h-10 object-contain rounded mb-xs bg-surface-variant p-1" />
                                )}
                                <label className="flex items-center gap-sm bg-background-subtle border-2 border-dashed border-outline-variant hover:border-primary rounded-lg py-sm px-md cursor-pointer transition-colors">
                                    <span className="material-symbols-outlined text-[18px] text-on-surface-variant">upload</span>
                                    <span className="font-body-md text-body-md text-on-surface-variant truncate">
                                        {data.logo ? data.logo.name : 'Ganti logo (opsional)…'}
                                    </span>
                                    <input type="file" accept="image/*" className="hidden" onChange={e => setData('logo', e.target.files[0])} />
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Social media */}
                    <div className="bg-surface rounded-2xl p-lg shadow-sm border border-primary/10">
                        <div className="flex items-center gap-sm mb-md pb-md border-b border-surface-variant">
                            <div className="bg-secondary-container p-sm rounded-lg text-secondary">
                                <span className="material-symbols-outlined text-[20px]">share</span>
                            </div>
                            <h2 className="font-headline-md text-headline-md text-primary">Media Sosial</h2>
                        </div>
                        <div className="space-y-md">
                            {[
                                { key: 'facebook', label: 'Facebook URL', placeholder: 'https://facebook.com/belajarkuy' },
                                { key: 'instagram', label: 'Instagram URL', placeholder: 'https://instagram.com/belajarkuy.official' },
                                { key: 'twitter', label: 'Twitter/X URL', placeholder: 'https://twitter.com/belajarkuy' },
                                { key: 'youtube', label: 'YouTube URL', placeholder: 'https://youtube.com/@belajarkuy' },
                            ].map(({ key, label, placeholder }) => (
                                <div key={key} className="space-y-xs">
                                    <label className="font-label-md text-label-md text-on-surface block">{label}</label>
                                    <input type="url" value={data[key]} onChange={e => setData(key, e.target.value)} className={inputCls} placeholder={placeholder} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Form actions */}
                    <div className="flex justify-end gap-md pt-sm">
                        <button
                            type="button"
                            onClick={() => window.location.reload()}
                            className="px-lg py-md rounded-lg font-label-md text-label-md text-primary bg-surface border border-primary hover:bg-background-subtle transition-colors"
                        >
                            Batalkan
                        </button>
                        <button
                            id="btn-simpan-settings"
                            type="submit"
                            disabled={processing}
                            className="px-lg py-md rounded-lg font-label-md text-label-md text-on-primary bg-primary hover:bg-primary-container transition-colors shadow-sm flex items-center gap-sm disabled:opacity-50"
                        >
                            <span className="material-symbols-outlined text-[18px]">save</span>
                            {processing ? 'Menyimpan…' : 'Simpan Perubahan'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}

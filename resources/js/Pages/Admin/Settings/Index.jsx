import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';

function LogoUploadField({ label, hint, recommended, previewSrc, fileName, imgClass, accept, onChange }) {
    return (
        <div className="space-y-xs">
            <label className="font-label-md text-label-md text-on-surface block">{label}</label>
            <p className="font-caption text-caption text-on-surface-variant">{hint}</p>
            <p className="font-caption text-caption text-on-surface-variant/70">
                <span className="material-symbols-outlined text-[13px] align-middle mr-0.5">straighten</span>
                Disarankan: <strong>{recommended}</strong>
            </p>

            {/* Preview area — selalu tampil */}
            <div className="flex items-center justify-center bg-surface-variant/40 rounded-lg border border-outline-variant/30 p-2 min-h-[56px]">
                {previewSrc
                    ? <img src={previewSrc} alt={label} className={`${imgClass} rounded`} />
                    : <span className="font-caption text-caption text-on-surface-variant/50 select-none">Belum ada gambar</span>
                }
            </div>

            <label className="flex items-center gap-sm bg-background-subtle border-2 border-dashed border-outline-variant hover:border-primary rounded-lg py-sm px-md cursor-pointer transition-colors">
                <span className="material-symbols-outlined text-[18px] text-on-surface-variant">upload</span>
                <span className="font-body-md text-body-md text-on-surface-variant truncate">
                    {fileName ?? 'Pilih file…'}
                </span>
                <input type="file" accept={accept} className="hidden" onChange={onChange} />
            </label>
        </div>
    );
}

export default function SettingsIndex({ settings = {} }) {
    const [previews, setPreviews] = useState({});

    function pickFile(field, file) {
        setData(field, file);
        if (file) {
            const url = URL.createObjectURL(file);
            setPreviews(p => ({ ...p, [field]: url }));
        }
    }

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
                            <LogoUploadField
                                label="Logo Rocket"
                                hint="PNG transparan, rasio 1:1"
                                recommended="64×64 px atau 128×128 px"
                                previewSrc={previews.logo_rocket ?? settings.logo_rocket}
                                fileName={data.logo_rocket?.name}
                                imgClass="h-12 w-12 object-contain"
                                accept="image/*"
                                onChange={e => pickFile('logo_rocket', e.target.files[0])}
                            />

                            {/* Logo Text */}
                            <LogoUploadField
                                label="Logo Teks (Tulisan)"
                                hint="PNG transparan, lebar proporsional"
                                recommended="400×100 px (rasio ±4:1)"
                                previewSrc={previews.logo_text_image ?? settings.logo_text_image}
                                fileName={data.logo_text_image?.name}
                                imgClass="h-10 w-auto max-w-[200px] object-contain"
                                accept="image/*"
                                onChange={e => pickFile('logo_text_image', e.target.files[0])}
                            />

                            {/* Favicon */}
                            <LogoUploadField
                                label="Favicon"
                                hint="PNG/ICO/SVG, rasio 1:1"
                                recommended="64×64 px (minimal 32×32 px)"
                                previewSrc={previews.favicon ?? settings.favicon}
                                fileName={data.favicon?.name}
                                imgClass="h-10 w-10 object-contain"
                                accept="image/png,image/x-icon,image/svg+xml,image/jpeg,image/webp"
                                onChange={e => pickFile('favicon', e.target.files[0])}
                            />

                            {/* Logo lama (fallback) */}
                            <LogoUploadField
                                label="Logo Lama (Opsional)"
                                hint="Fallback jika rocket/teks belum diset"
                                recommended="200×60 px atau proporsional"
                                previewSrc={previews.logo ?? settings.logo}
                                fileName={data.logo?.name}
                                imgClass="h-10 w-auto max-w-[180px] object-contain"
                                accept="image/*"
                                onChange={e => pickFile('logo', e.target.files[0])}
                            />
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

import { Head, useForm } from '@inertiajs/react';
import { useState, useRef } from 'react';
import InstructorLayout from '@/Layouts/InstructorLayout';

function TabBtn({ icon, label, active, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`w-full text-left px-md py-sm rounded-lg mb-xs transition-colors flex items-center gap-3 font-label-md text-label-md ${
                active
                    ? 'bg-primary/5 text-primary font-bold'
                    : 'text-on-surface-variant hover:bg-background-subtle'
            }`}
        >
            <span className="material-symbols-outlined text-[20px]">{icon}</span>
            {label}
        </button>
    );
}

// ─── Profile Tab ──────────────────────────────────────────────────────────────
function ProfileTab({ profileUser }) {
    const photoInputRef = useRef(null);
    const [photoPreview, setPhotoPreview] = useState(null);

    const { data, setData, post, processing, errors } = useForm({
        name:    profileUser?.name    ?? '',
        phone:   profileUser?.phone   ?? '',
        address: profileUser?.address ?? '',
        bio:     profileUser?.bio     ?? '',
        website: profileUser?.website ?? '',
        photo:   null,
    });

    const currentPhoto = photoPreview
        ?? (profileUser?.photo
            ? (profileUser.photo.startsWith('http') ? profileUser.photo : `/${profileUser.photo}`)
            : null);

    const initials = (profileUser?.name ?? 'IN')
        .split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();

    function handlePhotoChange(e) {
        const file = e.target.files?.[0];
        if (!file) return;
        setData('photo', file);
        setPhotoPreview(URL.createObjectURL(file));
    }

    function handleSubmit(e) {
        e.preventDefault();
        post(route('instructor.profile.update'), { forceFormData: true });
    }

    const inputCls = 'bg-surface-container border-2 border-transparent focus:border-primary focus:ring-0 rounded-lg py-sm px-md font-body-md text-body-md text-on-surface outline-none transition-all w-full';

    return (
        <div className="bg-surface rounded-2xl shadow-[0_4px_20px_rgba(48,0,51,0.08)] p-lg md:p-xl border border-outline/10">
            <h2 className="font-headline-md text-headline-md text-on-surface mb-lg pb-sm border-b border-surface-variant">
                Informasi Profil Instruktur
            </h2>

            {/* Avatar */}
            <div className="flex flex-col sm:flex-row items-center gap-lg mb-xl">
                <div className="relative group">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-surface shadow-sm">
                        {currentPhoto ? (
                            <img
                                src={currentPhoto}
                                alt={profileUser?.name}
                                className="w-full h-full object-cover group-hover:brightness-75 transition-all"
                            />
                        ) : (
                            <div className="w-full h-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-2xl group-hover:brightness-90 transition-all">
                                {initials}
                            </div>
                        )}
                    </div>
                    <button
                        type="button"
                        onClick={() => photoInputRef.current?.click()}
                        className="absolute bottom-0 right-0 bg-primary text-on-primary rounded-full p-2 shadow-md hover:bg-primary-container transition-colors translate-x-1/4 translate-y-1/4"
                    >
                        <span className="material-symbols-outlined text-[18px]">photo_camera</span>
                    </button>
                    <input
                        ref={photoInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handlePhotoChange}
                    />
                </div>
                <div className="text-center sm:text-left">
                    <h3 className="font-label-md text-label-md text-on-surface font-bold">{profileUser?.name}</h3>
                    <p className="font-caption text-caption text-on-surface-variant mb-sm mt-xs">
                        Foto instruktur ditampilkan di halaman kursus. JPG/PNG, maks. 2MB.
                    </p>
                    <button
                        type="button"
                        onClick={() => photoInputRef.current?.click()}
                        className="border border-outline text-on-surface font-label-md text-label-md py-xs px-sm rounded-lg hover:bg-surface-container transition-colors"
                    >
                        Ubah Foto
                    </button>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-gutter gap-y-md">
                {/* Nama */}
                <div className="flex flex-col gap-xs md:col-span-2">
                    <label className="font-label-md text-label-md text-on-surface" htmlFor="name">Nama Lengkap</label>
                    <input id="name" type="text" value={data.name} onChange={e => setData('name', e.target.value)} className={inputCls} />
                    {errors.name && <p className="font-caption text-caption text-error">{errors.name}</p>}
                </div>

                {/* Email (readonly) */}
                <div className="flex flex-col gap-xs">
                    <label className="font-label-md text-label-md text-on-surface">Alamat Email</label>
                    <input
                        type="email"
                        value={profileUser?.email ?? ''}
                        readOnly
                        className="bg-surface-container-high border-2 border-transparent rounded-lg py-sm px-md font-body-md text-body-md text-on-surface-variant outline-none w-full cursor-not-allowed"
                    />
                    <p className="font-caption text-caption text-on-surface-variant">Email tidak bisa diubah.</p>
                </div>

                {/* Phone */}
                <div className="flex flex-col gap-xs">
                    <label className="font-label-md text-label-md text-on-surface" htmlFor="phone">Nomor Telepon</label>
                    <input
                        id="phone"
                        type="tel"
                        value={data.phone}
                        onChange={e => setData('phone', e.target.value)}
                        placeholder="+62 812 xxxx xxxx"
                        className={inputCls}
                    />
                    {errors.phone && <p className="font-caption text-caption text-error">{errors.phone}</p>}
                </div>

                {/* Website */}
                <div className="flex flex-col gap-xs">
                    <label className="font-label-md text-label-md text-on-surface" htmlFor="website">
                        Website / LinkedIn / Portfolio
                    </label>
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px] pointer-events-none">language</span>
                        <input
                            id="website"
                            type="url"
                            value={data.website}
                            onChange={e => setData('website', e.target.value)}
                            placeholder="https://yourwebsite.com"
                            className={`${inputCls} pl-10`}
                        />
                    </div>
                    {errors.website && <p className="font-caption text-caption text-error">{errors.website}</p>}
                </div>

                {/* Address */}
                <div className="flex flex-col gap-xs md:col-span-2">
                    <label className="font-label-md text-label-md text-on-surface" htmlFor="address">Domisili</label>
                    <input
                        id="address"
                        type="text"
                        value={data.address}
                        onChange={e => setData('address', e.target.value)}
                        placeholder="Kota, Provinsi"
                        className={inputCls}
                    />
                    {errors.address && <p className="font-caption text-caption text-error">{errors.address}</p>}
                </div>

                {/* Bio */}
                <div className="flex flex-col gap-xs md:col-span-2">
                    <label className="font-label-md text-label-md text-on-surface" htmlFor="bio">
                        Bio Instruktur
                        <span className="ml-sm font-caption text-caption text-on-surface-variant font-normal">
                            (Ditampilkan di halaman kursus dan profil publik)
                        </span>
                    </label>
                    <textarea
                        id="bio"
                        rows={5}
                        value={data.bio}
                        onChange={e => setData('bio', e.target.value)}
                        placeholder="Ceritakan pengalaman, keahlian, dan apa yang kamu ajarkan..."
                        className={`${inputCls} resize-none`}
                    />
                    {errors.bio && <p className="font-caption text-caption text-error">{errors.bio}</p>}
                </div>

                <div className="md:col-span-2 flex justify-end mt-sm">
                    <button
                        type="submit"
                        disabled={processing}
                        className="bg-primary text-on-primary font-label-md text-label-md py-sm px-xl rounded-lg hover:bg-primary-container transition-all shadow-sm disabled:opacity-60 inline-flex items-center gap-sm"
                    >
                        {processing
                            ? <><span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span> Menyimpan...</>
                            : <><span className="material-symbols-outlined text-[18px]">save</span> Simpan Perubahan</>
                        }
                    </button>
                </div>
            </form>
        </div>
    );
}

// ─── Security Tab ─────────────────────────────────────────────────────────────
function SecurityTab() {
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew,     setShowNew]     = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        current_password:      '',
        password:              '',
        password_confirmation: '',
    });

    function handleSubmit(e) {
        e.preventDefault();
        post(route('instructor.setting.update'), { onSuccess: () => reset() });
    }

    const inputCls = 'bg-surface-container border-2 border-transparent focus:border-primary focus:ring-0 rounded-lg py-sm px-md pr-xl font-body-md text-body-md text-on-surface outline-none transition-all w-full';

    const PwField = ({ id, label, show, onToggle, value, onChange, placeholder, error }) => (
        <div className="flex flex-col gap-xs">
            <label className="font-label-md text-label-md text-on-surface" htmlFor={id}>{label}</label>
            <div className="relative">
                <input
                    id={id}
                    type={show ? 'text' : 'password'}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={inputCls}
                />
                <button
                    type="button"
                    onClick={onToggle}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors"
                >
                    <span className="material-symbols-outlined text-[20px]">
                        {show ? 'visibility' : 'visibility_off'}
                    </span>
                </button>
            </div>
            {error && <p className="font-caption text-caption text-error">{error}</p>}
        </div>
    );

    return (
        <div className="bg-surface rounded-2xl shadow-[0_4px_20px_rgba(48,0,51,0.08)] p-lg md:p-xl border border-outline/10">
            <h2 className="font-headline-md text-headline-md text-on-surface mb-sm pb-sm border-b border-surface-variant flex items-center gap-sm">
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>shield_lock</span>
                Ubah Kata Sandi
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mb-lg">
                Gunakan kata sandi yang kuat dan unik untuk menjaga keamanan akunmu.
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-md max-w-md">
                <PwField
                    id="current_password"
                    label="Kata Sandi Saat Ini"
                    show={showCurrent}
                    onToggle={() => setShowCurrent(v => !v)}
                    value={data.current_password}
                    onChange={e => setData('current_password', e.target.value)}
                    placeholder="Masukkan sandi saat ini"
                    error={errors.current_password}
                />
                <PwField
                    id="password"
                    label="Kata Sandi Baru"
                    show={showNew}
                    onToggle={() => setShowNew(v => !v)}
                    value={data.password}
                    onChange={e => setData('password', e.target.value)}
                    placeholder="Minimal 8 karakter"
                    error={errors.password}
                />
                <PwField
                    id="password_confirmation"
                    label="Konfirmasi Sandi Baru"
                    show={showConfirm}
                    onToggle={() => setShowConfirm(v => !v)}
                    value={data.password_confirmation}
                    onChange={e => setData('password_confirmation', e.target.value)}
                    placeholder="Ketik ulang sandi baru"
                    error={errors.password_confirmation}
                />
                <div className="mt-sm">
                    <button
                        type="submit"
                        disabled={processing}
                        className="bg-primary text-on-primary font-label-md text-label-md py-sm px-lg rounded-lg hover:bg-primary-container transition-all shadow-md disabled:opacity-60 inline-flex items-center gap-sm"
                    >
                        {processing ? 'Memperbarui...' : 'Perbarui Sandi'}
                    </button>
                </div>
            </form>
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function InstructorProfile({ profileUser, defaultTab = 'profile' }) {
    const [activeTab, setActiveTab] = useState(defaultTab);

    const tabs = [
        { id: 'profile',  icon: 'badge', label: 'Informasi Profil' },
        { id: 'security', icon: 'lock',  label: 'Keamanan & Sandi' },
    ];

    return (
        <InstructorLayout>
            <Head title="Profil Instruktur — BelajarKUY" />

            <div className="px-margin-mobile md:px-margin-desktop py-xl md:py-xxl max-w-5xl mx-auto relative">
                {/* Decorative bg */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary-fixed-dim rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/3 pointer-events-none" />

                <div className="mb-xl z-10 relative">
                    <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-sm">
                        Profil &amp; Pengaturan Akun
                    </h1>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                        Kelola informasi profil instrukturmu yang akan terlihat oleh pelajar.
                    </p>
                </div>

                <div className="flex flex-col md:flex-row gap-gutter items-start z-10 relative">
                    {/* Sidebar Tabs */}
                    <div className="w-full md:w-56 flex-shrink-0 bg-surface rounded-2xl shadow-[0_4px_20px_rgba(48,0,51,0.08)] p-sm sticky top-24">
                        {tabs.map(tab => (
                            <TabBtn
                                key={tab.id}
                                icon={tab.icon}
                                label={tab.label}
                                active={activeTab === tab.id}
                                onClick={() => setActiveTab(tab.id)}
                            />
                        ))}
                    </div>

                    {/* Content */}
                    <div className="flex-1 w-full">
                        {activeTab === 'profile'  && <ProfileTab profileUser={profileUser} />}
                        {activeTab === 'security' && <SecurityTab />}
                    </div>
                </div>
            </div>
        </InstructorLayout>
    );
}

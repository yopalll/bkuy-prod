import { Head, useForm, usePage } from '@inertiajs/react';
import { useState, useRef } from 'react';
import StudentLayout from '@/Layouts/StudentLayout';

// ─── Tab Button ───────────────────────────────────────────────────────────────
function TabBtn({ icon, label, active, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`w-full text-left px-md py-sm rounded-lg mb-xs transition-colors flex items-center gap-3 font-label-md text-label-md ${
                active
                    ? 'bg-primary-container/10 text-primary-container'
                    : 'text-on-surface-variant hover:bg-surface-container'
            }`}
        >
            <span className="material-symbols-outlined text-[20px]">{icon}</span>
            {label}
        </button>
    );
}

// ─── Profile Tab ─────────────────────────────────────────────────────────────
function ProfileTab({ profileUser }) {
    const photoInputRef = useRef(null);
    const [photoPreview, setPhotoPreview] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        name:    profileUser?.name    ?? '',
        phone:   profileUser?.phone   ?? '',
        address: profileUser?.address ?? '',
        bio:     profileUser?.bio     ?? '',
        photo:   null,
    });

    const currentPhoto = photoPreview
        ?? (profileUser?.photo
            ? (profileUser.photo.startsWith('http') ? profileUser.photo : `/${profileUser.photo}`)
            : null);

    const initials = (profileUser?.name ?? 'BK')
        .split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();

    function handlePhotoChange(e) {
        const file = e.target.files?.[0];
        if (!file) return;
        setData('photo', file);
        setPhotoPreview(URL.createObjectURL(file));
    }

    function handleSubmit(e) {
        e.preventDefault();
        post('/student/profile', { forceFormData: true });
    }

    return (
        <div className="bg-surface rounded-2xl shadow-[0_4px_20px_rgba(48,0,51,0.08)] p-lg md:p-xl border border-outline/10">
            <h2 className="font-headline-md text-headline-md text-on-surface mb-lg pb-sm border-b border-surface-variant">
                Informasi Pribadi
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
                        className="absolute bottom-0 right-0 bg-primary text-on-primary rounded-full p-2 shadow-md hover:bg-primary-container hover:text-on-primary-container transition-colors translate-x-1/4 translate-y-1/4"
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
                    <h3 className="font-label-md text-label-md text-on-surface">Foto Profil</h3>
                    <p className="font-caption text-caption text-on-surface-variant mb-sm mt-xs">
                        JPG/PNG, maks. 2MB. Rasio 1:1.
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
                    <label className="font-label-md text-label-md text-on-surface" htmlFor="name">
                        Nama Lengkap
                    </label>
                    <input
                        id="name"
                        type="text"
                        value={data.name}
                        onChange={e => setData('name', e.target.value)}
                        className="bg-surface-container border-2 border-transparent focus:border-primary focus:ring-0 rounded-lg py-sm px-md font-body-md text-body-md text-on-surface outline-none transition-all w-full"
                    />
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
                </div>

                {/* Phone */}
                <div className="flex flex-col gap-xs">
                    <label className="font-label-md text-label-md text-on-surface" htmlFor="phone">
                        Nomor Telepon
                    </label>
                    <input
                        id="phone"
                        type="tel"
                        value={data.phone}
                        onChange={e => setData('phone', e.target.value)}
                        placeholder="+62 812 xxxx xxxx"
                        className="bg-surface-container border-2 border-transparent focus:border-primary focus:ring-0 rounded-lg py-sm px-md font-body-md text-body-md text-on-surface outline-none transition-all w-full"
                    />
                    {errors.phone && <p className="font-caption text-caption text-error">{errors.phone}</p>}
                </div>

                {/* Address */}
                <div className="flex flex-col gap-xs md:col-span-2">
                    <label className="font-label-md text-label-md text-on-surface" htmlFor="address">
                        Alamat Domisili
                    </label>
                    <input
                        id="address"
                        type="text"
                        value={data.address}
                        onChange={e => setData('address', e.target.value)}
                        placeholder="Jl. Pendidikan No. 1, Kota..."
                        className="bg-surface-container border-2 border-transparent focus:border-primary focus:ring-0 rounded-lg py-sm px-md font-body-md text-body-md text-on-surface outline-none transition-all w-full"
                    />
                    {errors.address && <p className="font-caption text-caption text-error">{errors.address}</p>}
                </div>

                {/* Bio */}
                <div className="flex flex-col gap-xs md:col-span-2">
                    <label className="font-label-md text-label-md text-on-surface" htmlFor="bio">
                        Bio Singkat
                    </label>
                    <textarea
                        id="bio"
                        rows={4}
                        value={data.bio}
                        onChange={e => setData('bio', e.target.value)}
                        placeholder="Ceritakan sedikit tentang dirimu..."
                        className="bg-surface-container border-2 border-transparent focus:border-primary focus:ring-0 rounded-lg py-sm px-md font-body-md text-body-md text-on-surface outline-none transition-all w-full resize-none"
                    />
                    {errors.bio && <p className="font-caption text-caption text-error">{errors.bio}</p>}
                </div>

                <div className="md:col-span-2 flex justify-end mt-sm">
                    <button
                        type="submit"
                        disabled={processing}
                        className="bg-primary-container text-on-primary-container font-label-md text-label-md py-sm px-xl rounded-lg hover:brightness-95 transition-all shadow-sm disabled:opacity-60"
                    >
                        {processing ? 'Menyimpan...' : 'Simpan Perubahan'}
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
        current_password: '',
        password:         '',
        password_confirmation: '',
    });

    function handleSubmit(e) {
        e.preventDefault();
        post('/student/setting', {
            onSuccess: () => reset(),
        });
    }

    return (
        <div className="bg-surface rounded-2xl shadow-[0_4px_20px_rgba(48,0,51,0.08)] p-lg md:p-xl border border-outline/10">
            <h2 className="font-headline-md text-headline-md text-on-surface mb-sm pb-sm border-b border-surface-variant flex items-center gap-sm">
                <span className="material-symbols-outlined text-primary-container">shield_lock</span>
                Ubah Kata Sandi
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant mb-lg">
                Pastikan akun Anda tetap aman dengan menggunakan kata sandi yang kuat dan unik.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-md max-w-md">
                {/* Current password */}
                <div className="flex flex-col gap-xs">
                    <label className="font-label-md text-label-md text-on-surface" htmlFor="current_password">
                        Kata Sandi Saat Ini
                    </label>
                    <div className="relative">
                        <input
                            id="current_password"
                            type={showCurrent ? 'text' : 'password'}
                            value={data.current_password}
                            onChange={e => setData('current_password', e.target.value)}
                            placeholder="Masukkan sandi saat ini"
                            className="bg-surface-container border-2 border-transparent focus:border-primary focus:ring-0 rounded-lg py-sm px-md pr-xl font-body-md text-body-md text-on-surface outline-none transition-all w-full"
                        />
                        <button
                            type="button"
                            onClick={() => setShowCurrent(v => !v)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors"
                        >
                            <span className="material-symbols-outlined text-[20px]">
                                {showCurrent ? 'visibility' : 'visibility_off'}
                            </span>
                        </button>
                    </div>
                    {errors.current_password && (
                        <p className="font-caption text-caption text-error">{errors.current_password}</p>
                    )}
                </div>

                {/* New password */}
                <div className="flex flex-col gap-xs">
                    <label className="font-label-md text-label-md text-on-surface" htmlFor="password">
                        Kata Sandi Baru
                    </label>
                    <div className="relative">
                        <input
                            id="password"
                            type={showNew ? 'text' : 'password'}
                            value={data.password}
                            onChange={e => setData('password', e.target.value)}
                            placeholder="Minimal 8 karakter"
                            className="bg-surface-container border-2 border-transparent focus:border-primary focus:ring-0 rounded-lg py-sm px-md pr-xl font-body-md text-body-md text-on-surface outline-none transition-all w-full"
                        />
                        <button
                            type="button"
                            onClick={() => setShowNew(v => !v)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors"
                        >
                            <span className="material-symbols-outlined text-[20px]">
                                {showNew ? 'visibility' : 'visibility_off'}
                            </span>
                        </button>
                    </div>
                    {errors.password && (
                        <p className="font-caption text-caption text-error">{errors.password}</p>
                    )}
                </div>

                {/* Confirm password */}
                <div className="flex flex-col gap-xs">
                    <label className="font-label-md text-label-md text-on-surface" htmlFor="password_confirmation">
                        Konfirmasi Sandi Baru
                    </label>
                    <div className="relative">
                        <input
                            id="password_confirmation"
                            type={showConfirm ? 'text' : 'password'}
                            value={data.password_confirmation}
                            onChange={e => setData('password_confirmation', e.target.value)}
                            placeholder="Ketik ulang sandi baru"
                            className="bg-surface-container border-2 border-transparent focus:border-primary focus:ring-0 rounded-lg py-sm px-md pr-xl font-body-md text-body-md text-on-surface outline-none transition-all w-full"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirm(v => !v)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors"
                        >
                            <span className="material-symbols-outlined text-[20px]">
                                {showConfirm ? 'visibility' : 'visibility_off'}
                            </span>
                        </button>
                    </div>
                    {errors.password_confirmation && (
                        <p className="font-caption text-caption text-error">{errors.password_confirmation}</p>
                    )}
                </div>

                <div className="mt-sm">
                    <button
                        type="submit"
                        disabled={processing}
                        className="bg-primary text-on-primary font-label-md text-label-md py-sm px-lg rounded-lg hover:bg-surface-tint transition-all shadow-md disabled:opacity-60"
                    >
                        {processing ? 'Memperbarui...' : 'Perbarui Sandi'}
                    </button>
                </div>
            </form>
        </div>
    );
}

// ─── Notifications Tab (placeholder) ─────────────────────────────────────────
function NotificationsTab() {
    return (
        <div className="bg-surface rounded-2xl shadow-[0_4px_20px_rgba(48,0,51,0.08)] p-lg md:p-xl border border-outline/10 flex flex-col items-center text-center py-xxl">
            <span className="material-symbols-outlined text-[64px] text-surface-variant mb-md">notifications_off</span>
            <h3 className="font-headline-md text-headline-md text-on-surface mb-sm">Pengaturan Notifikasi</h3>
            <p className="font-body-md text-body-md text-on-surface-variant">
                Modul ini sedang dalam pengembangan.
            </p>
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Profile({ profileUser, defaultTab = 'profile' }) {
    const [activeTab, setActiveTab] = useState(defaultTab);

    const tabs = [
        { id: 'profile',       icon: 'badge',         label: 'Informasi Pribadi' },
        { id: 'security',      icon: 'lock',          label: 'Keamanan & Sandi' },
        { id: 'notifications', icon: 'notifications', label: 'Notifikasi' },
    ];

    const title = activeTab === 'security' ? 'Keamanan Akun' : 'Pengaturan Profil';

    return (
        <StudentLayout>
            <Head title={title} />

            <div className="px-margin-mobile md:px-margin-desktop py-xl md:py-xxl max-w-5xl mx-auto relative">
                {/* Decorative bg */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary-fixed-dim rounded-full mix-blend-multiply filter blur-3xl opacity-30 -translate-y-1/2 translate-x-1/3 pointer-events-none" />

                {/* Page Header */}
                <div className="mb-xl z-10 relative">
                    <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-sm">
                        Pengaturan Profil &amp; Akun
                    </h1>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                        Kelola informasi pribadi, preferensi, dan keamanan akun Anda.
                    </p>
                </div>

                {/* Layout */}
                <div className="flex flex-col md:flex-row gap-gutter items-start z-10 relative">
                    {/* Sidebar Tabs */}
                    <div className="w-full md:w-64 flex-shrink-0 bg-surface rounded-2xl shadow-[0_4px_20px_rgba(48,0,51,0.08)] p-sm sticky top-24">
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
                        {activeTab === 'profile'       && <ProfileTab profileUser={profileUser} />}
                        {activeTab === 'security'      && <SecurityTab />}
                        {activeTab === 'notifications' && <NotificationsTab />}
                    </div>
                </div>
            </div>
        </StudentLayout>
    );
}

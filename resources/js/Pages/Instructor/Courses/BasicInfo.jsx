import { Head, Link, useForm, router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import InstructorLayout from '@/Layouts/InstructorLayout';

// Layar: informasi_dasar_kursus (Vascha & Quinsha)
// Route: instructor.courses.create → GET /instructor/courses/create
//        instructor.courses.edit   → GET /instructor/courses/{course}/edit
export default function BasicInfo({ course, categories = [], subcategories = [] }) {
    const isEditing = !!course;

    const { data, setData, post, patch, processing, errors, reset, recentlySuccessful } = useForm({
        title:          course?.title ?? '',
        slug:           course?.slug ?? '',
        description:    course?.description ?? '',
        category_id:    course?.category_id ?? '',
        subcategory_id: course?.subcategory_id ?? '',
        price:          course?.price ?? 0,
        discount:       course?.discount ?? 0,
        featured:       course?.featured ?? false,
        bestseller:     course?.bestseller ?? false,
        thumbnail:      null,
        _method:        isEditing ? 'PATCH' : undefined,
    });

    const filteredSubs = subcategories.filter(
        (s) => String(s.category_id) === String(data.category_id)
    );

    useEffect(() => {
        if (!isEditing && data.title) {
            setData('slug',
                data.title
                    .toLowerCase()
                    .replace(/[^a-z0-9\s-]/g, '')
                    .trim()
                    .replace(/\s+/g, '-')
                    .replace(/-+/g, '-')
            );
        }
    }, [data.title]);

    const [preview, setPreview] = useState(course?.thumbnail ?? null);
    const fileInputRef = useRef(null);

    const handleThumbnailChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setData('thumbnail', file);
        setPreview(URL.createObjectURL(file));
    };

    const handleThumbnailDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (!file || !file.type.startsWith('image/')) return;
        setData('thumbnail', file);
        setPreview(URL.createObjectURL(file));
    };

    const clearThumbnail = () => {
        setData('thumbnail', null);
        setPreview(course?.thumbnail ?? null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEditing) {
            post(route('instructor.courses.update', course.id), { forceFormData: true });
        } else {
            post(route('instructor.courses.store'), { forceFormData: true });
        }
    };

    const handleSubmitForReview = () => {
        if (!confirm('Ajukan kursus ini untuk ditinjau admin?')) return;
        router.post(route('instructor.courses.submit', course.id));
    };

    const rupiah = (n) => 'Rp ' + Number(n ?? 0).toLocaleString('id-ID');
    const discountedPrice =
        data.discount > 0
            ? data.price - (data.price * data.discount) / 100
            : data.price;

    return (
        <InstructorLayout>
            <Head
                title={
                    isEditing
                        ? `Edit: ${course.title} — BelajarKUY`
                        : 'Buat Kursus Baru — BelajarKUY'
                }
            />

            {/* ─── Page Header ─── */}
            <div className="bg-surface px-margin-mobile md:px-margin-desktop py-lg border-b border-surface-variant sticky top-[60px] md:top-0 z-30">
                <div className="max-w-7xl mx-auto">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-xs font-caption text-caption text-on-surface-variant mb-sm">
                        <Link href={route('instructor.courses.index')} className="flex items-center gap-xs hover:text-primary transition-colors">
                            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                            Kursus Saya
                        </Link>
                        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                        <span className="text-on-surface">
                            {isEditing ? course.title : 'Kursus Baru'}
                        </span>
                    </div>

                    {/* Title row */}
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-sm">
                        <div>
                            <p className="font-caption text-caption text-on-surface-variant uppercase tracking-widest mb-xs">Panel Instruktur</p>
                            <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-background">
                                {isEditing ? 'Informasi Dasar' : 'Buat Kursus Baru'}
                            </h1>
                            <p className="font-body-md text-body-md text-on-surface-variant mt-xs">
                                {isEditing ? 'Edit detail dan informasi kursusmu.' : 'Isi informasi dasar untuk kursus barumu.'}
                            </p>
                        </div>
                        {/* Tabs (hanya tampil saat edit) */}
                        {isEditing && (
                            <div className="flex items-center gap-xs">
                                <span className="px-md py-xs rounded-lg font-caption text-caption bg-primary text-on-primary font-bold">
                                    Informasi Dasar
                                </span>
                                <Link
                                    href={route('instructor.courses.curriculum', course.id)}
                                    className="px-md py-xs rounded-lg font-caption text-caption text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors"
                                >
                                    Kurikulum
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ─── Main ─── */}
            <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop py-lg">
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* ══════ LEFT: Main Fields ══════ */}
                        <div className="lg:col-span-2 space-y-6">

                            {/* Section: Judul & Slug */}
                            <div className="bg-surface rounded-3xl border border-surface-variant shadow-sm overflow-hidden">
                                <div className="flex items-center gap-3 px-7 py-5 border-b border-surface-variant/50">
                                    <div className="p-2 bg-primary-fixed/20 rounded-xl">
                                        <span className="material-symbols-outlined text-[18px] text-primary">menu_book</span>
                                    </div>
                                    <h2 className="font-bold text-on-surface text-sm">Identitas Kursus</h2>
                                </div>
                                <div className="px-7 py-6 space-y-5">
                                    {/* Judul */}
                                    <div className="space-y-1.5">
                                        <label htmlFor="title" className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">
                                            Judul Kursus <span className="text-error">*</span>
                                        </label>
                                        <input
                                            id="title"
                                            type="text"
                                            value={data.title}
                                            onChange={(e) => setData('title', e.target.value)}
                                            placeholder="Contoh: Belajar React dari Nol sampai Mahir"
                                            className={`w-full border rounded-2xl px-5 py-3.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${
                                                errors.title ? 'border-error/50 bg-error-container/20' : 'border-outline-variant bg-surface-container-low focus:bg-surface'
                                            }`}
                                        />
                                        {errors.title && (
                                            <p className="text-xs text-error flex items-center gap-1 mt-1">
                                                <span className="material-symbols-outlined text-[14px]">error</span> {errors.title}
                                            </p>
                                        )}
                                    </div>

                                    {/* Slug */}
                                    <div className="space-y-1.5">
                                        <label htmlFor="slug" className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">
                                            URL Slug
                                        </label>
                                        <div className="flex items-center rounded-2xl border border-outline-variant bg-surface-container-low focus-within:bg-surface focus-within:ring-2 focus-within:ring-primary/50 transition-all overflow-hidden">
                                            <span className="px-4 text-xs font-semibold text-on-surface-variant whitespace-nowrap border-r border-outline-variant py-3.5">
                                                /courses/
                                            </span>
                                            <input
                                                id="slug"
                                                type="text"
                                                value={data.slug}
                                                onChange={(e) => setData('slug', e.target.value)}
                                                placeholder="nama-kursus-anda"
                                                className="flex-1 px-4 py-3.5 text-sm font-semibold bg-transparent focus:outline-none"
                                            />
                                        </div>
                                        {errors.slug && (
                                            <p className="text-xs text-error flex items-center gap-1 mt-1">
                                                <span className="material-symbols-outlined text-[14px]">error</span> {errors.slug}
                                            </p>
                                        )}
                                    </div>

                                    {/* Deskripsi */}
                                    <div className="space-y-1.5">
                                        <label htmlFor="description" className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">
                                            Deskripsi Kursus
                                        </label>
                                        <textarea
                                            id="description"
                                            rows={5}
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            placeholder="Ceritakan tentang kursus ini: apa yang akan dipelajari, untuk siapa kursus ini, dan apa manfaatnya..."
                                            className="w-full border border-outline-variant rounded-2xl px-5 py-4 text-sm font-semibold bg-surface-container-low focus:bg-surface focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                                        />
                                        {errors.description && (
                                            <p className="text-xs text-error">{errors.description}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Section: Kategori */}
                            <div className="bg-surface rounded-3xl border border-surface-variant shadow-sm overflow-hidden">
                                <div className="flex items-center gap-3 px-7 py-5 border-b border-surface-variant/50">
                                    <div className="p-2 bg-primary-fixed/20 rounded-xl">
                                        <span className="material-symbols-outlined text-[18px] text-primary">sell</span>
                                    </div>
                                    <h2 className="font-bold text-on-surface text-sm">Kategori</h2>
                                </div>
                                <div className="px-7 py-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    {/* Kategori */}
                                    <div className="space-y-1.5">
                                        <label htmlFor="category_id" className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">
                                            Kategori <span className="text-error">*</span>
                                        </label>
                                        <select
                                            id="category_id"
                                            value={data.category_id}
                                            onChange={(e) => {
                                                setData('category_id', e.target.value);
                                                setData('subcategory_id', '');
                                            }}
                                            className={`w-full border rounded-2xl px-5 py-3.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none ${
                                                errors.category_id ? 'border-error/50 bg-error-container/20' : 'border-outline-variant bg-surface-container-low focus:bg-surface'
                                            }`}
                                        >
                                            <option value="">-- Pilih Kategori --</option>
                                            {categories.map((cat) => (
                                                <option key={cat.id} value={cat.id}>
                                                    {cat.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.category_id && (
                                            <p className="text-xs text-error flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[14px]">error</span> {errors.category_id}
                                            </p>
                                        )}
                                    </div>

                                    {/* Sub-Kategori */}
                                    <div className="space-y-1.5">
                                        <label htmlFor="subcategory_id" className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">
                                            Sub-Kategori
                                        </label>
                                        <select
                                            id="subcategory_id"
                                            value={data.subcategory_id}
                                            onChange={(e) => setData('subcategory_id', e.target.value)}
                                            disabled={!data.category_id || filteredSubs.length === 0}
                                            className="w-full border border-outline-variant rounded-2xl px-5 py-3.5 text-sm font-semibold bg-surface-container-low focus:bg-surface focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <option value="">-- Pilih Sub-Kategori --</option>
                                            {filteredSubs.map((sub) => (
                                                <option key={sub.id} value={sub.id}>
                                                    {sub.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Section: Harga */}
                            <div className="bg-surface rounded-3xl border border-surface-variant shadow-sm overflow-hidden">
                                <div className="flex items-center gap-3 px-7 py-5 border-b border-surface-variant/50">
                                    <div className="p-2 bg-success/10 rounded-xl">
                                        <span className="material-symbols-outlined text-[18px] text-success">payments</span>
                                    </div>
                                    <h2 className="font-bold text-on-surface text-sm">Harga</h2>
                                </div>
                                <div className="px-7 py-6 space-y-5">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        {/* Harga Normal */}
                                        <div className="space-y-1.5">
                                            <label htmlFor="price" className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">
                                                Harga (Rp) <span className="text-error">*</span>
                                            </label>
                                            <div className="relative">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-on-surface-variant">
                                                    Rp
                                                </span>
                                                <input
                                                    id="price"
                                                    type="number"
                                                    min={0}
                                                    step={1000}
                                                    value={data.price}
                                                    onChange={(e) => setData('price', Number(e.target.value))}
                                                    className={`w-full border rounded-2xl pl-10 pr-5 py-3.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${
                                                        errors.price ? 'border-error/50 bg-error-container/20' : 'border-outline-variant bg-surface-container-low focus:bg-surface'
                                                    }`}
                                                />
                                            </div>
                                            {errors.price && (
                                                <p className="text-xs text-error">{errors.price}</p>
                                            )}
                                            <p className="text-xs text-on-surface-variant font-medium">
                                                Isi 0 untuk kursus gratis.
                                            </p>
                                        </div>

                                        {/* Diskon */}
                                        <div className="space-y-1.5">
                                            <label htmlFor="discount" className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">
                                                Diskon (%)
                                            </label>
                                            <div className="relative">
                                                <input
                                                    id="discount"
                                                    type="number"
                                                    min={0}
                                                    max={100}
                                                    value={data.discount}
                                                    onChange={(e) => setData('discount', Number(e.target.value))}
                                                    className="w-full border border-outline-variant rounded-2xl pr-10 pl-5 py-3.5 text-sm font-semibold bg-surface-container-low focus:bg-surface focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                                />
                                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-on-surface-variant">
                                                    %
                                                </span>
                                            </div>
                                            {errors.discount && (
                                                <p className="text-xs text-error">{errors.discount}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Preview harga */}
                                    {data.price > 0 && (
                                        <div className="bg-primary-fixed/10 border border-primary/10 rounded-2xl px-5 py-4 flex items-center gap-4">
                                            <span className="material-symbols-outlined text-[18px] text-primary flex-shrink-0">info</span>
                                            <div className="text-sm font-semibold text-on-surface">
                                                Harga yang tampil ke siswa:{' '}
                                                <span className="text-primary font-black">
                                                    {rupiah(discountedPrice)}
                                                </span>
                                                {data.discount > 0 && (
                                                    <span className="text-on-surface-variant text-xs line-through ml-2">
                                                        {rupiah(data.price)}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Section: Toggle featured/bestseller */}
                            <div className="bg-surface rounded-3xl border border-surface-variant shadow-sm overflow-hidden">
                                <div className="flex items-center gap-3 px-7 py-5 border-b border-surface-variant/50">
                                    <div className="p-2 bg-secondary-container/20 rounded-xl">
                                        <span className="material-symbols-outlined text-[18px] text-secondary-container">auto_awesome</span>
                                    </div>
                                    <h2 className="font-bold text-on-surface text-sm">Sorotan</h2>
                                </div>
                                <div className="px-7 py-6 space-y-4">
                                    <ToggleRow
                                        id="featured"
                                        label="Kursus Unggulan"
                                        description="Kursus ditampilkan di bagian Featured di halaman utama."
                                        checked={data.featured}
                                        onChange={(v) => setData('featured', v)}
                                    />
                                    <ToggleRow
                                        id="bestseller"
                                        label="Bestseller"
                                        description="Kursus ditandai sebagai bestseller dengan badge khusus."
                                        checked={data.bestseller}
                                        onChange={(v) => setData('bestseller', v)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* ══════ RIGHT: Thumbnail + Save ══════ */}
                        <div className="space-y-6">

                            {/* Status badge (jika edit) */}
                            {isEditing && (
                                <StatusBadge status={course.status} />
                            )}

                            {/* Thumbnail Upload */}
                            <div className="bg-surface rounded-3xl border border-surface-variant shadow-sm overflow-hidden">
                                <div className="flex items-center gap-3 px-6 py-5 border-b border-surface-variant/50">
                                    <div className="p-2 bg-primary-fixed/20 rounded-xl">
                                        <span className="material-symbols-outlined text-[18px] text-primary">image</span>
                                    </div>
                                    <h2 className="font-bold text-on-surface text-sm">Thumbnail</h2>
                                </div>
                                <div className="p-6 space-y-4">
                                    {/* Drop zone */}
                                    <div
                                        onDrop={handleThumbnailDrop}
                                        onDragOver={(e) => e.preventDefault()}
                                        onClick={() => fileInputRef.current?.click()}
                                        className="group relative cursor-pointer border-2 border-dashed border-outline-variant rounded-2xl overflow-hidden hover:border-primary/50 transition-colors"
                                        style={{ aspectRatio: '16/9' }}
                                    >
                                        {preview ? (
                                            <>
                                                <img
                                                    src={preview}
                                                    alt="Preview thumbnail"
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <div className="text-center text-white">
                                                        <span className="material-symbols-outlined text-[24px] block mb-1">upload</span>
                                                        <p className="text-xs font-semibold">Ganti Gambar</p>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                                                <span className="material-symbols-outlined text-[32px] text-outline-variant mb-3">upload</span>
                                                <p className="text-sm font-semibold text-on-surface-variant">
                                                    Klik atau seret gambar ke sini
                                                </p>
                                                <p className="text-xs text-on-surface-variant/60 mt-1">
                                                    PNG, JPG, WebP · Maks. 2MB · Rasio 16:9 disarankan
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleThumbnailChange}
                                    />

                                    {data.thumbnail && (
                                        <button
                                            type="button"
                                            onClick={clearThumbnail}
                                            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl text-xs font-bold text-error bg-error-container hover:bg-error/20 transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-[14px]">close</span>
                                            Hapus Gambar Baru
                                        </button>
                                    )}

                                    {errors.thumbnail && (
                                        <p className="text-xs text-error flex items-center gap-1">
                                            <span className="material-symbols-outlined text-[14px]">error</span> {errors.thumbnail}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Save button */}
                            <div className="bg-surface rounded-3xl border border-surface-variant shadow-sm p-6 space-y-3">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    id="btn-save-course"
                                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-bold text-on-primary bg-primary hover:bg-primary-container hover:-translate-y-0.5 active:translate-y-0 transform transition-all duration-200 disabled:opacity-60"
                                    style={{ boxShadow: '0 4px 16px rgba(48,0,51,0.20)' }}
                                >
                                    <span className="material-symbols-outlined text-[18px]">save</span>
                                    {processing
                                        ? 'Menyimpan...'
                                        : isEditing
                                        ? 'Simpan Perubahan'
                                        : 'Buat Kursus'}
                                </button>

                                {recentlySuccessful && (
                                    <p className="text-xs text-success font-semibold flex items-center justify-center gap-1.5">
                                        <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                                        Tersimpan!
                                    </p>
                                )}

                                {/* Submit for review */}
                                {isEditing && course.status === 'draft' && (
                                    <button
                                        type="button"
                                        onClick={handleSubmitForReview}
                                        id="btn-submit-review"
                                        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-bold text-success bg-success/10 hover:bg-success/20 transition-colors border border-success/20"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">send</span>
                                        Kirim untuk Review
                                    </button>
                                )}

                                <Link
                                    href={route('instructor.courses.index')}
                                    className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold text-on-surface-variant hover:text-on-surface bg-surface-container hover:bg-surface-container-high transition-colors"
                                >
                                    <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                                    Kembali ke Daftar
                                </Link>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </InstructorLayout>
    );
}

/* ─── Helper Components ─── */

function ToggleRow({ id, label, description, checked, onChange }) {
    return (
        <div className="flex items-center justify-between gap-4 py-3 border-b border-surface-variant/50 last:border-0">
            <div>
                <p className="text-sm font-bold text-on-surface">{label}</p>
                <p className="text-xs text-on-surface-variant font-medium mt-0.5">{description}</p>
            </div>
            <button
                type="button"
                id={`toggle-${id}`}
                role="switch"
                aria-checked={checked}
                onClick={() => onChange(!checked)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 flex-shrink-0 ${
                    checked ? 'bg-primary' : 'bg-outline-variant'
                }`}
            >
                <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
                        checked ? 'translate-x-6' : 'translate-x-1'
                    }`}
                />
            </button>
        </div>
    );
}

function StatusBadge({ status }) {
    const config = {
        draft:          { label: 'Draft', bg: 'bg-surface-container', text: 'text-on-surface-variant', border: 'border-outline-variant', dot: 'bg-outline' },
        pending_review: { label: 'Menunggu Review', bg: 'bg-warning/10', text: 'text-warning', border: 'border-warning/20', dot: 'bg-warning' },
        active:         { label: 'Aktif & Dipublikasikan', bg: 'bg-success/10', text: 'text-success', border: 'border-success/20', dot: 'bg-success' },
        inactive:       { label: 'Nonaktif', bg: 'bg-error-container', text: 'text-on-error-container', border: 'border-error/20', dot: 'bg-error' },
    };
    const { label, bg, text, border, dot } = config[status] ?? config.draft;

    return (
        <div className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl border ${bg} ${border}`}>
            <span className={`w-2 h-2 rounded-full ${dot} flex-shrink-0`} />
            <div>
                <p className="text-xs font-black text-on-surface-variant uppercase tracking-widest">Status Kursus</p>
                <p className={`text-sm font-bold ${text}`}>{label}</p>
            </div>
        </div>
    );
}

import { Head, Link, useForm, router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import {
    ArrowLeft,
    Save,
    Upload,
    X,
    Image as ImageIcon,
    ChevronRight,
    Info,
    BookOpen,
    Tag,
    DollarSign,
    Sparkles,
    Send,
    AlertCircle,
    CheckCircle2,
    ListChecks,
    Plus,
    Loader2,
} from 'lucide-react';

// Layar: informasi_dasar_kursus (Konteks_A)
// Route: instructor.courses.create → GET /instructor/courses/create
//        instructor.courses.edit   → GET /instructor/courses/{course}/edit
export default function BasicInfo({ course, categories = [], subcategories = [] }) {
    const isEditing = !!course;

    // Goals state (hanya saat edit)
    const [goals, setGoals]         = useState(course?.goals ?? []);
    const [goalInput, setGoalInput] = useState('');
    const [goalLoading, setGoalLoading] = useState(false);
    const [goalError, setGoalError] = useState('');

    function getCsrf() {
        return decodeURIComponent(
            document.cookie.split('; ').find((r) => r.startsWith('XSRF-TOKEN='))?.split('=')[1] ?? '',
        );
    }

    async function handleAddGoal(e) {
        e.preventDefault();
        if (!goalInput.trim() || goalLoading) return;
        setGoalLoading(true);
        setGoalError('');
        try {
            const res = await fetch(route('instructor.courses.goals.store', course.id), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json', 'X-XSRF-TOKEN': getCsrf() },
                body: JSON.stringify({ goal: goalInput.trim() }),
            });
            const json = await res.json();
            if (res.ok) {
                setGoals((prev) => [...prev, json]);
                setGoalInput('');
            } else {
                setGoalError(json.message ?? 'Gagal menambahkan poin.');
            }
        } catch {
            setGoalError('Gagal menghubungi server.');
        } finally {
            setGoalLoading(false);
        }
    }

    async function handleDeleteGoal(goalId) {
        try {
            await fetch(route('instructor.courses.goals.destroy', { course: course.id, goal: goalId }), {
                method: 'DELETE',
                headers: { Accept: 'application/json', 'X-XSRF-TOKEN': getCsrf() },
            });
            setGoals((prev) => prev.filter((g) => g.id !== goalId));
        } catch {
            // silent
        }
    }

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
        thumbnail:      null, // File — selalu null saat render awal
        _method:        isEditing ? 'PATCH' : undefined,
    });

    // Sub-kategori yang difilter berdasarkan kategori yang dipilih
    const filteredSubs = subcategories.filter(
        (s) => String(s.category_id) === String(data.category_id)
    );

    // Auto-generate slug dari title (hanya saat create)
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

    // Preview thumbnail
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
            // Kirim sebagai POST dengan _method PATCH agar file bisa dikirim
            post(route('instructor.courses.update', course.id), {
                forceFormData: true,
            });
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
        <AppLayout>
            <Head
                title={
                    isEditing
                        ? `Edit: ${course.title} — BelajarKUY`
                        : 'Buat Kursus Baru — BelajarKUY'
                }
            />

            {/* ─── Top bar ─── */}
            <div className="bg-white border-b border-gray-100 sticky top-20 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-500">
                        <Link
                            href={route('instructor.courses.index')}
                            className="flex items-center gap-1 hover:text-indigo-600 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Kursus Saya
                        </Link>
                        <ChevronRight className="w-4 h-4 text-gray-300" />
                        <span className="text-gray-900">
                            {isEditing ? 'Informasi Dasar' : 'Kursus Baru'}
                        </span>
                    </div>

                    {/* Tabs — jika edit, tampilkan tab kurikulum */}
                    <div className="flex items-center gap-3">
                        {isEditing && (
                            <>
                                <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-600 text-white">
                                    Informasi Dasar
                                </span>
                                <Link
                                    href={route('instructor.courses.curriculum', course.id)}
                                    className="px-3 py-1 rounded-full text-xs font-bold text-gray-500 hover:text-indigo-600 hover:bg-gray-50 transition-colors"
                                >
                                    Kurikulum
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* ─── Main ─── */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* ══════ LEFT: Main Fields ══════ */}
                        <div className="lg:col-span-2 space-y-6">

                            {/* Section: Judul & Slug */}
                            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                                <div className="flex items-center gap-3 px-7 py-5 border-b border-gray-50">
                                    <div className="p-2 bg-indigo-50 rounded-xl">
                                        <BookOpen className="w-4 h-4 text-indigo-600" />
                                    </div>
                                    <h2 className="font-bold text-gray-900 text-sm">Identitas Kursus</h2>
                                </div>
                                <div className="px-7 py-6 space-y-5">
                                    {/* Judul */}
                                    <div className="space-y-1.5">
                                        <label htmlFor="title" className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                                            Judul Kursus <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            id="title"
                                            type="text"
                                            value={data.title}
                                            onChange={(e) => setData('title', e.target.value)}
                                            placeholder="Contoh: Belajar React dari Nol sampai Mahir"
                                            className={`w-full border rounded-2xl px-5 py-3.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                                                errors.title ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50 focus:bg-white'
                                            }`}
                                        />
                                        {errors.title && (
                                            <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                                                <AlertCircle className="w-3.5 h-3.5" /> {errors.title}
                                            </p>
                                        )}
                                    </div>

                                    {/* Slug */}
                                    <div className="space-y-1.5">
                                        <label htmlFor="slug" className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                                            URL Slug
                                        </label>
                                        <div className="flex items-center rounded-2xl border border-gray-200 bg-gray-50 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-500 transition-all overflow-hidden">
                                            <span className="px-4 text-xs font-semibold text-gray-400 whitespace-nowrap border-r border-gray-200 py-3.5">
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
                                            <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                                                <AlertCircle className="w-3.5 h-3.5" /> {errors.slug}
                                            </p>
                                        )}
                                    </div>

                                    {/* Deskripsi */}
                                    <div className="space-y-1.5">
                                        <label htmlFor="description" className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                                            Deskripsi Kursus
                                        </label>
                                        <textarea
                                            id="description"
                                            rows={5}
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            placeholder="Ceritakan tentang kursus ini: apa yang akan dipelajari, untuk siapa kursus ini, dan apa manfaatnya..."
                                            className="w-full border border-gray-200 rounded-2xl px-5 py-4 text-sm font-semibold bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
                                        />
                                        {errors.description && (
                                            <p className="text-xs text-red-500">{errors.description}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Section: Kategori */}
                            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                                <div className="flex items-center gap-3 px-7 py-5 border-b border-gray-50">
                                    <div className="p-2 bg-purple-50 rounded-xl">
                                        <Tag className="w-4 h-4 text-purple-600" />
                                    </div>
                                    <h2 className="font-bold text-gray-900 text-sm">Kategori</h2>
                                </div>
                                <div className="px-7 py-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    {/* Kategori */}
                                    <div className="space-y-1.5">
                                        <label htmlFor="category_id" className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                                            Kategori <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            id="category_id"
                                            value={data.category_id}
                                            onChange={(e) => {
                                                setData('category_id', e.target.value);
                                                setData('subcategory_id', '');
                                            }}
                                            className={`w-full border rounded-2xl px-5 py-3.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none ${
                                                errors.category_id ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50 focus:bg-white'
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
                                            <p className="text-xs text-red-500 flex items-center gap-1">
                                                <AlertCircle className="w-3.5 h-3.5" /> {errors.category_id}
                                            </p>
                                        )}
                                    </div>

                                    {/* Sub-Kategori */}
                                    <div className="space-y-1.5">
                                        <label htmlFor="subcategory_id" className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                                            Sub-Kategori
                                        </label>
                                        <select
                                            id="subcategory_id"
                                            value={data.subcategory_id}
                                            onChange={(e) => setData('subcategory_id', e.target.value)}
                                            disabled={!data.category_id || filteredSubs.length === 0}
                                            className="w-full border border-gray-200 rounded-2xl px-5 py-3.5 text-sm font-semibold bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
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
                            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                                <div className="flex items-center gap-3 px-7 py-5 border-b border-gray-50">
                                    <div className="p-2 bg-emerald-50 rounded-xl">
                                        <DollarSign className="w-4 h-4 text-emerald-600" />
                                    </div>
                                    <h2 className="font-bold text-gray-900 text-sm">Harga</h2>
                                </div>
                                <div className="px-7 py-6 space-y-5">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        {/* Harga Normal */}
                                        <div className="space-y-1.5">
                                            <label htmlFor="price" className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                                                Harga (Rp) <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">
                                                    Rp
                                                </span>
                                                <input
                                                    id="price"
                                                    type="number"
                                                    min={0}
                                                    step={1000}
                                                    value={data.price}
                                                    onChange={(e) => setData('price', Number(e.target.value))}
                                                    className={`w-full border rounded-2xl pl-10 pr-5 py-3.5 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
                                                        errors.price ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50 focus:bg-white'
                                                    }`}
                                                />
                                            </div>
                                            {errors.price && (
                                                <p className="text-xs text-red-500">{errors.price}</p>
                                            )}
                                            <p className="text-xs text-gray-400 font-medium">
                                                Isi 0 untuk kursus gratis.
                                            </p>
                                        </div>

                                        {/* Diskon */}
                                        <div className="space-y-1.5">
                                            <label htmlFor="discount" className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
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
                                                    className="w-full border border-gray-200 rounded-2xl pr-10 pl-5 py-3.5 text-sm font-semibold bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                                />
                                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">
                                                    %
                                                </span>
                                            </div>
                                            {errors.discount && (
                                                <p className="text-xs text-red-500">{errors.discount}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Preview harga */}
                                    {data.price > 0 && (
                                        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl px-5 py-4 flex items-center gap-4">
                                            <Info className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                                            <div className="text-sm font-semibold text-gray-700">
                                                Harga yang tampil ke siswa:{' '}
                                                <span className="text-indigo-600 font-black">
                                                    {rupiah(discountedPrice)}
                                                </span>
                                                {data.discount > 0 && (
                                                    <span className="text-gray-400 text-xs line-through ml-2">
                                                        {rupiah(data.price)}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Section: Toggle featured/bestseller */}
                            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                                <div className="flex items-center gap-3 px-7 py-5 border-b border-gray-50">
                                    <div className="p-2 bg-amber-50 rounded-xl">
                                        <Sparkles className="w-4 h-4 text-amber-600" />
                                    </div>
                                    <h2 className="font-bold text-gray-900 text-sm">Sorotan</h2>
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

                            {/* Section: Yang Akan Anda Pelajari (hanya saat edit) */}
                            {isEditing && (
                                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                                    <div className="flex items-center gap-3 px-7 py-5 border-b border-gray-50">
                                        <div className="p-2 bg-teal-50 rounded-xl">
                                            <ListChecks className="w-4 h-4 text-teal-600" />
                                        </div>
                                        <h2 className="font-bold text-gray-900 text-sm">Yang Akan Anda Pelajari</h2>
                                        <span className="ml-auto text-xs text-gray-400 font-medium">{goals.length} poin</span>
                                    </div>
                                    <div className="px-7 py-6 space-y-4">
                                        {goals.length > 0 && (
                                            <ul className="space-y-2">
                                                {goals.map((g) => (
                                                    <li key={g.id} className="flex items-start gap-3 bg-teal-50/60 rounded-2xl px-4 py-3">
                                                        <CheckCircle2 className="w-4 h-4 text-teal-600 mt-0.5 flex-shrink-0" />
                                                        <span className="text-sm font-semibold text-gray-800 flex-1">{g.goal}</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDeleteGoal(g.id)}
                                                            className="text-gray-300 hover:text-red-500 transition-colors flex-shrink-0"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                        <form onSubmit={handleAddGoal} className="flex gap-2">
                                            <input
                                                type="text"
                                                value={goalInput}
                                                onChange={(e) => { setGoalInput(e.target.value); setGoalError(''); }}
                                                placeholder="Contoh: Memahami konsep MVC Laravel"
                                                maxLength={200}
                                                className="flex-1 border border-gray-200 rounded-2xl px-4 py-3 text-sm font-semibold bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                                            />
                                            <button
                                                type="submit"
                                                disabled={goalLoading || !goalInput.trim()}
                                                className="flex items-center gap-1.5 px-4 py-3 rounded-2xl bg-teal-600 text-white text-sm font-bold hover:bg-teal-500 disabled:opacity-50 transition-colors shrink-0"
                                            >
                                                {goalLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                                                Tambah
                                            </button>
                                        </form>
                                        {goalError && (
                                            <p className="text-xs text-red-500 flex items-center gap-1">
                                                <AlertCircle className="w-3.5 h-3.5" /> {goalError}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* ══════ RIGHT: Thumbnail + Save ══════ */}
                        <div className="space-y-6">

                            {/* Status badge (jika edit) */}
                            {isEditing && (
                                <StatusBadge status={course.status} />
                            )}

                            {/* Thumbnail Upload */}
                            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                                <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-50">
                                    <div className="p-2 bg-purple-50 rounded-xl">
                                        <ImageIcon className="w-4 h-4 text-purple-600" />
                                    </div>
                                    <h2 className="font-bold text-gray-900 text-sm">Thumbnail</h2>
                                </div>
                                <div className="p-6 space-y-4">
                                    {/* Drop zone */}
                                    <div
                                        onDrop={handleThumbnailDrop}
                                        onDragOver={(e) => e.preventDefault()}
                                        onClick={() => fileInputRef.current?.click()}
                                        className="group relative cursor-pointer border-2 border-dashed border-gray-200 rounded-2xl overflow-hidden hover:border-indigo-400 transition-colors"
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
                                                        <Upload className="w-6 h-6 mx-auto mb-1" />
                                                        <p className="text-xs font-semibold">Ganti Gambar</p>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                                                <Upload className="w-8 h-8 text-gray-300 mb-3" />
                                                <p className="text-sm font-semibold text-gray-500">
                                                    Klik atau seret gambar ke sini
                                                </p>
                                                <p className="text-xs text-gray-400 mt-1">
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
                                            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                            Hapus Gambar Baru
                                        </button>
                                    )}

                                    {errors.thumbnail && (
                                        <p className="text-xs text-red-500 flex items-center gap-1">
                                            <AlertCircle className="w-3.5 h-3.5" /> {errors.thumbnail}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Save button */}
                            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-3">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    id="btn-save-course"
                                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 hover:-translate-y-0.5 active:translate-y-0 transform transition-all duration-200 shadow-md shadow-indigo-600/20 disabled:opacity-60"
                                >
                                    <Save className="w-4 h-4" />
                                    {processing
                                        ? 'Menyimpan...'
                                        : isEditing
                                        ? 'Simpan Perubahan'
                                        : 'Buat Kursus'}
                                </button>

                                {recentlySuccessful && (
                                    <p className="text-xs text-emerald-600 font-semibold flex items-center justify-center gap-1.5">
                                        <CheckCircle2 className="w-4 h-4" />
                                        Tersimpan!
                                    </p>
                                )}

                                {/* Submit for review */}
                                {isEditing && course.status === 'draft' && (
                                    <button
                                        type="button"
                                        onClick={handleSubmitForReview}
                                        id="btn-submit-review"
                                        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors border border-emerald-200"
                                    >
                                        <Send className="w-4 h-4" />
                                        Kirim untuk Review
                                    </button>
                                )}

                                <Link
                                    href={route('instructor.courses.index')}
                                    className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 transition-colors"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Kembali ke Daftar
                                </Link>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}

/* ─── Helper Components ─── */

function ToggleRow({ id, label, description, checked, onChange }) {
    return (
        <div className="flex items-center justify-between gap-4 py-3 border-b border-gray-50 last:border-0">
            <div>
                <p className="text-sm font-bold text-gray-800">{label}</p>
                <p className="text-xs text-gray-400 font-medium mt-0.5">{description}</p>
            </div>
            <button
                type="button"
                id={`toggle-${id}`}
                role="switch"
                aria-checked={checked}
                onClick={() => onChange(!checked)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex-shrink-0 ${
                    checked ? 'bg-indigo-600' : 'bg-gray-200'
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
        draft:          { label: 'Draft', bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-gray-200', dot: 'bg-gray-400' },
        pending_review: { label: 'Menunggu Review', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-400' },
        active:         { label: 'Aktif & Dipublikasikan', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-400' },
        inactive:       { label: 'Nonaktif', bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', dot: 'bg-red-400' },
    };
    const { label, bg, text, border, dot } = config[status] ?? config.draft;

    return (
        <div className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl border ${bg} ${border}`}>
            <span className={`w-2 h-2 rounded-full ${dot} flex-shrink-0`} />
            <div>
                <p className="text-xs font-black text-gray-500 uppercase tracking-widest">Status Kursus</p>
                <p className={`text-sm font-bold ${text}`}>{label}</p>
            </div>
        </div>
    );
}

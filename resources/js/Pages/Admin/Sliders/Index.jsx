import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Pagination from '@/Components/Admin/Pagination';
import { useState } from 'react';

function Modal({ title, onClose, children }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-md">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-surface rounded-2xl shadow-xl w-full max-w-md p-xl z-10">
                <div className="flex justify-between items-center mb-lg">
                    <h3 className="font-headline-md text-headline-md text-on-surface">{title}</h3>
                    <button onClick={onClose} className="text-on-surface-variant hover:text-error"><span className="material-symbols-outlined text-[20px]">close</span></button>
                </div>
                {children}
            </div>
        </div>
    );
}

function ToggleSwitch({ checked, onChange, disabled }) {
    return (
        <button
            type="button"
            onClick={onChange}
            disabled={disabled}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none disabled:opacity-50 ${checked ? 'bg-success' : 'bg-surface-variant'}`}
        >
            <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
    );
}

export default function SlidersIndex({ sliders, editSlider = null }) {
    const [showCreate, setShowCreate] = useState(false);
    const [editItem, setEditItem] = useState(editSlider);
    const [toggling, setToggling] = useState(null);

    const createForm = useForm({ title: '', subtitle: '', image: null, order_position: 0 });
    const editForm   = useForm({ title: editItem?.title ?? '', subtitle: editItem?.subtitle ?? '', image: null, order_position: editItem?.order_position ?? 0, _method: 'PATCH' });

    function handleCreate(e) {
        e.preventDefault();
        createForm.post('/admin/sliders', { forceFormData: true, onSuccess: () => { setShowCreate(false); createForm.reset(); } });
    }
    function handleEdit(e) {
        e.preventDefault();
        editForm.post(`/admin/sliders/${editItem.id}`, { forceFormData: true, onSuccess: () => setEditItem(null) });
    }
    function handleDelete(slider) {
        if (!confirm(`Hapus slider "${slider.title}"?`)) return;
        router.delete(`/admin/sliders/${slider.id}`);
    }
    function openEdit(s) {
        setEditItem(s);
        editForm.setData({ title: s.title, subtitle: s.subtitle ?? '', image: null, order_position: s.order_position ?? 0, _method: 'PATCH' });
    }
    function handleToggle(slider) {
        setToggling(slider.id);
        router.patch(route('admin.sliders.toggle', slider.id), {}, {
            onFinish: () => setToggling(null),
            preserveScroll: true,
        });
    }

    const SliderForm = ({ form, onSubmit, label }) => (
        <form onSubmit={onSubmit} encType="multipart/form-data">
            <div className="space-y-md">
                <div>
                    <label className="font-label-md text-label-md text-on-surface block mb-xs">Judul</label>
                    <input type="text" value={form.data.title} onChange={e => form.setData('title', e.target.value)}
                        className="w-full bg-background-subtle border-2 border-transparent focus:border-primary rounded-lg py-sm px-md font-body-md text-body-md outline-none transition-colors" required />
                    {form.errors.title && <p className="text-error font-caption text-caption mt-xs">{form.errors.title}</p>}
                </div>
                <div>
                    <label className="font-label-md text-label-md text-on-surface block mb-xs">Subtitle</label>
                    <input type="text" value={form.data.subtitle} onChange={e => form.setData('subtitle', e.target.value)}
                        className="w-full bg-background-subtle border-2 border-transparent focus:border-primary rounded-lg py-sm px-md font-body-md text-body-md outline-none transition-colors" />
                </div>
                <div>
                    <label className="font-label-md text-label-md text-on-surface block mb-xs">Gambar</label>
                    <label className="flex items-center gap-sm bg-background-subtle border-2 border-dashed border-outline-variant hover:border-primary rounded-lg py-md px-md cursor-pointer transition-colors">
                        <span className="material-symbols-outlined text-[18px] text-on-surface-variant">upload</span>
                        <span className="font-body-md text-body-md text-on-surface-variant">{form.data.image ? form.data.image.name : 'Pilih gambar…'}</span>
                        <input type="file" accept="image/*" className="hidden" onChange={e => form.setData('image', e.target.files[0])} />
                    </label>
                </div>
                <div>
                    <label className="font-label-md text-label-md text-on-surface block mb-xs">Urutan</label>
                    <input type="number" value={form.data.order_position} onChange={e => form.setData('order_position', e.target.value)}
                        className="w-full bg-background-subtle border-2 border-transparent focus:border-primary rounded-lg py-sm px-md font-body-md text-body-md outline-none transition-colors" min="0" />
                </div>
            </div>
            <div className="flex gap-sm justify-end mt-xl">
                <button type="button" onClick={() => editItem ? setEditItem(null) : setShowCreate(false)}
                    className="px-lg py-sm rounded-lg border border-outline text-on-surface font-label-md text-label-md hover:bg-surface-variant transition-colors">Batal</button>
                <button type="submit" disabled={form.processing}
                    className="px-lg py-sm rounded-lg bg-primary text-on-primary font-label-md text-label-md hover:bg-primary-container transition-colors disabled:opacity-50">
                    {form.processing ? 'Menyimpan…' : label}
                </button>
            </div>
        </form>
    );

    return (
        <AdminLayout title="Admin Portal">
            <Head title="Slider — BelajarKUY Admin" />

            <div className="flex justify-between items-center mb-gutter">
                <div>
                    <h1 className="font-headline-lg text-headline-lg text-on-surface">Slider</h1>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-xs">Kelola banner slider halaman utama.</p>
                </div>
                <button id="btn-tambah-slider" onClick={() => setShowCreate(true)}
                    className="flex items-center gap-sm bg-primary text-on-primary font-label-md text-label-md px-lg py-sm rounded-lg hover:bg-primary-container transition-colors shadow-sm">
                    <span className="material-symbols-outlined text-[18px]">add</span> Tambah Slider
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-gutter">
                {sliders.data?.length === 0 && (
                    <div className="col-span-full bg-surface rounded-2xl p-xl text-center text-on-surface-variant font-body-md text-body-md">
                        Belum ada slider
                    </div>
                )}
                {sliders.data?.map(slider => (
                    <div key={slider.id} className={`bg-surface rounded-xl overflow-hidden shadow-sm border transition-colors ${slider.status ? 'border-transparent hover:border-primary-fixed-dim' : 'border-surface-variant opacity-60'}`}>
                        {slider.image_url
                            ? <img src={slider.image_url} alt={slider.title} className="w-full h-40 object-cover" />
                            : <div className="w-full h-40 bg-surface-container flex items-center justify-center text-on-surface-variant text-sm">Tidak ada gambar</div>
                        }
                        <div className="p-md">
                            <div className="flex items-start justify-between gap-sm">
                                <div className="min-w-0">
                                    <h3 className="font-label-md text-label-md font-bold text-on-surface">{slider.title}</h3>
                                    {slider.subtitle && <p className="font-caption text-caption text-on-surface-variant mt-xs truncate">{slider.subtitle}</p>}
                                    <span className="font-caption text-caption text-on-surface-variant">Urutan: {slider.order_position}</span>
                                </div>
                                <div className="flex items-center gap-sm shrink-0">
                                    <ToggleSwitch
                                        checked={!!slider.status}
                                        onChange={() => handleToggle(slider)}
                                        disabled={toggling === slider.id}
                                    />
                                    <button onClick={() => openEdit(slider)} className="p-sm rounded-lg text-primary hover:bg-primary/10 transition-colors">
                                        <span className="material-symbols-outlined text-[18px]">edit</span>
                                    </button>
                                    <button onClick={() => handleDelete(slider)} className="p-sm rounded-lg text-error hover:bg-error-container transition-colors">
                                        <span className="material-symbols-outlined text-[18px]">delete</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Pagination data={sliders} />

            {showCreate && <Modal title="Tambah Slider" onClose={() => setShowCreate(false)}><SliderForm form={createForm} onSubmit={handleCreate} label="Simpan" /></Modal>}
            {editItem && <Modal title={`Edit: ${editItem.title}`} onClose={() => setEditItem(null)}><SliderForm form={editForm} onSubmit={handleEdit} label="Perbarui" /></Modal>}
        </AdminLayout>
    );
}

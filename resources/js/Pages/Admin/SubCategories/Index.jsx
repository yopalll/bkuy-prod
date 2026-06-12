import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Pagination from '@/Components/Admin/Pagination';
import ConfirmDialog from '@/Components/ConfirmDialog';
import { useState } from 'react';

function Modal({ title, onClose, children }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-md">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-surface rounded-2xl shadow-xl w-full max-w-md p-xl z-10">
                <div className="flex justify-between items-center mb-lg">
                    <h3 className="font-headline-md text-headline-md text-on-surface">{title}</h3>
                    <button onClick={onClose} className="text-on-surface-variant hover:text-error transition-colors">
                        <span className="material-symbols-outlined text-[20px]">close</span>
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}

export default function SubCategoriesIndex({ subCategories, categories = [], subCategory: editInit = null }) {
    const [showCreate, setShowCreate] = useState(false);
    const [editItem, setEditItem] = useState(editInit);
    const [dialog, setDialog] = useState(null);

    const createForm = useForm({ name: '', category_id: '' });
    const editForm   = useForm({ name: editItem?.name ?? '', category_id: editItem?.category_id ?? '', _method: 'PATCH' });

    function handleCreate(e) {
        e.preventDefault();
        createForm.post('/admin/sub-categories', {
            onSuccess: () => { setShowCreate(false); createForm.reset(); },
        });
    }

    function handleEdit(e) {
        e.preventDefault();
        editForm.post(`/admin/sub-categories/${editItem.id}`, {
            onSuccess: () => setEditItem(null),
        });
    }

    function handleDelete(sub) {
        setDialog({
            title: 'Hapus Sub-Kategori',
            message: `Hapus sub-kategori "${sub.name}"?`,
            icon: 'delete', variant: 'danger', confirmLabel: 'Hapus',
            onConfirm: () => router.delete(`/admin/sub-categories/${sub.id}`),
        });
    }

    function openEdit(sub) {
        setEditItem(sub);
        editForm.setData({ name: sub.name, category_id: sub.category_id, _method: 'PATCH' });
    }

    return (
        <AdminLayout title="Admin Portal">
            <Head title="Sub-Kategori — BelajarKUY Admin" />

            <div className="flex justify-between items-center mb-gutter">
                <div>
                    <h1 className="font-headline-lg text-headline-lg text-on-surface">Sub-Kategori</h1>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-xs">
                        Kelola sub-kategori kursus di platform.
                    </p>
                </div>
                <button
                    id="btn-tambah-subkategori"
                    onClick={() => setShowCreate(true)}
                    className="flex items-center gap-sm bg-primary text-on-primary font-label-md text-label-md px-lg py-sm rounded-lg hover:bg-primary-container transition-colors shadow-sm"
                >
                    <span className="material-symbols-outlined text-[18px]">add</span>
                    Tambah Sub-Kategori
                </button>
            </div>

            <div className="bg-surface rounded-2xl shadow-[0_8px_30px_rgb(48,0,51,0.04)] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-surface-variant bg-background-subtle">
                                <th className="py-md px-lg font-label-md text-label-md text-on-surface-variant">Nama</th>
                                <th className="py-md px-lg font-label-md text-label-md text-on-surface-variant">Kategori</th>
                                <th className="py-md px-lg font-label-md text-label-md text-on-surface-variant text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subCategories.data?.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="py-xl text-center text-on-surface-variant font-body-md text-body-md">
                                        Belum ada sub-kategori
                                    </td>
                                </tr>
                            )}
                            {subCategories.data?.map((sub) => (
                                <tr key={sub.id} className="border-b border-surface-variant/50 hover:bg-background-subtle transition-colors">
                                    <td className="py-md px-lg font-body-md text-body-md text-on-surface font-medium">{sub.name}</td>
                                    <td className="py-md px-lg">
                                        <span className="bg-primary/10 text-primary font-caption text-caption px-sm py-xs rounded-full">
                                            {sub.category?.name ?? '—'}
                                        </span>
                                    </td>
                                    <td className="py-md px-lg text-right">
                                        <div className="flex items-center justify-end gap-sm">
                                            <button onClick={() => openEdit(sub)} className="p-sm rounded-lg text-primary hover:bg-primary/10 transition-colors" title="Edit">
                                                <span className="material-symbols-outlined text-[18px]">edit</span>
                                            </button>
                                            <button onClick={() => handleDelete(sub)} className="p-sm rounded-lg text-error hover:bg-error-container transition-colors" title="Hapus">
                                                <span className="material-symbols-outlined text-[18px]">delete</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <Pagination data={subCategories} />
            </div>

            {/* Modal Create */}
            {showCreate && (
                <Modal title="Tambah Sub-Kategori" onClose={() => setShowCreate(false)}>
                    <form onSubmit={handleCreate}>
                        <div className="space-y-md">
                            <div>
                                <label className="font-label-md text-label-md text-on-surface block mb-xs">Nama Sub-Kategori</label>
                                <input
                                    type="text"
                                    value={createForm.data.name}
                                    onChange={e => createForm.setData('name', e.target.value)}
                                    className="w-full bg-background-subtle border-2 border-transparent focus:border-primary rounded-lg py-sm px-md font-body-md text-body-md outline-none transition-colors"
                                    placeholder="contoh: React.js"
                                    required
                                />
                                {createForm.errors.name && <p className="mt-xs font-caption text-caption text-error">{createForm.errors.name}</p>}
                            </div>
                            <div>
                                <label className="font-label-md text-label-md text-on-surface block mb-xs">Kategori</label>
                                <select
                                    value={createForm.data.category_id}
                                    onChange={e => createForm.setData('category_id', e.target.value)}
                                    className="w-full bg-background-subtle border-2 border-transparent focus:border-primary rounded-lg py-sm px-md font-body-md text-body-md outline-none transition-colors"
                                    required
                                >
                                    <option value="">Pilih kategori…</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                                {createForm.errors.category_id && <p className="mt-xs font-caption text-caption text-error">{createForm.errors.category_id}</p>}
                            </div>
                        </div>
                        <div className="flex gap-sm justify-end mt-xl">
                            <button type="button" onClick={() => setShowCreate(false)} className="px-lg py-sm rounded-lg border border-outline text-on-surface font-label-md text-label-md hover:bg-surface-variant transition-colors">Batal</button>
                            <button type="submit" disabled={createForm.processing} className="px-lg py-sm rounded-lg bg-primary text-on-primary font-label-md text-label-md hover:bg-primary-container transition-colors disabled:opacity-50">
                                {createForm.processing ? 'Menyimpan…' : 'Simpan'}
                            </button>
                        </div>
                    </form>
                </Modal>
            )}

            {/* Modal Edit */}
            {editItem && (
                <Modal title={`Edit: ${editItem.name}`} onClose={() => setEditItem(null)}>
                    <form onSubmit={handleEdit}>
                        <div className="space-y-md">
                            <div>
                                <label className="font-label-md text-label-md text-on-surface block mb-xs">Nama Sub-Kategori</label>
                                <input
                                    type="text"
                                    value={editForm.data.name}
                                    onChange={e => editForm.setData('name', e.target.value)}
                                    className="w-full bg-background-subtle border-2 border-transparent focus:border-primary rounded-lg py-sm px-md font-body-md text-body-md outline-none transition-colors"
                                    required
                                />
                            </div>
                            <div>
                                <label className="font-label-md text-label-md text-on-surface block mb-xs">Kategori</label>
                                <select
                                    value={editForm.data.category_id}
                                    onChange={e => editForm.setData('category_id', e.target.value)}
                                    className="w-full bg-background-subtle border-2 border-transparent focus:border-primary rounded-lg py-sm px-md font-body-md text-body-md outline-none transition-colors"
                                    required
                                >
                                    <option value="">Pilih kategori…</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="flex gap-sm justify-end mt-xl">
                            <button type="button" onClick={() => setEditItem(null)} className="px-lg py-sm rounded-lg border border-outline text-on-surface font-label-md text-label-md hover:bg-surface-variant transition-colors">Batal</button>
                            <button type="submit" disabled={editForm.processing} className="px-lg py-sm rounded-lg bg-primary text-on-primary font-label-md text-label-md hover:bg-primary-container transition-colors disabled:opacity-50">
                                {editForm.processing ? 'Menyimpan…' : 'Perbarui'}
                            </button>
                        </div>
                    </form>
                </Modal>
            )}
            {dialog && <ConfirmDialog open onClose={() => setDialog(null)} {...dialog} />}
        </AdminLayout>
    );
}

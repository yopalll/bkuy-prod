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
                    <button onClick={onClose} className="text-on-surface-variant hover:text-error"><span className="material-symbols-outlined text-[20px]">close</span></button>
                </div>
                {children}
            </div>
        </div>
    );
}

export default function InfoBoxesIndex({ infoBoxes, editInfoBox = null }) {
    const [showCreate, setShowCreate] = useState(false);
    const [editItem, setEditItem] = useState(editInfoBox);
    const [dialog, setDialog] = useState(null);

    const createForm = useForm({ title: '', description: '', icon: '', order_position: 0 });
    const editForm   = useForm({ title: editItem?.title ?? '', description: editItem?.description ?? '', icon: editItem?.icon ?? '', order_position: editItem?.order_position ?? 0, _method: 'PATCH' });

    function handleCreate(e) {
        e.preventDefault();
        createForm.post('/admin/info-boxes', { onSuccess: () => { setShowCreate(false); createForm.reset(); } });
    }
    function handleEdit(e) {
        e.preventDefault();
        editForm.post(`/admin/info-boxes/${editItem.id}`, { onSuccess: () => setEditItem(null) });
    }
    function handleDelete(ib) {
        setDialog({
            title: 'Hapus Info Box',
            message: `Hapus info box "${ib.title}"?`,
            icon: 'delete', variant: 'danger', confirmLabel: 'Hapus',
            onConfirm: () => router.delete(`/admin/info-boxes/${ib.id}`),
        });
    }
    function openEdit(ib) {
        setEditItem(ib);
        editForm.setData({ title: ib.title, description: ib.description ?? '', icon: ib.icon ?? '', order_position: ib.order_position ?? 0, _method: 'PATCH' });
    }

    const InfoBoxForm = ({ form, onSubmit, label, onCancel }) => (
        <form onSubmit={onSubmit}>
            <div className="space-y-md">
                <div>
                    <label className="font-label-md text-label-md text-on-surface block mb-xs">Judul</label>
                    <input type="text" value={form.data.title} onChange={e => form.setData('title', e.target.value)}
                        className="w-full bg-background-subtle border-2 border-transparent focus:border-primary rounded-lg py-sm px-md font-body-md text-body-md outline-none" required />
                </div>
                <div>
                    <label className="font-label-md text-label-md text-on-surface block mb-xs">Deskripsi</label>
                    <textarea rows={3} value={form.data.description} onChange={e => form.setData('description', e.target.value)}
                        className="w-full bg-background-subtle border-2 border-transparent focus:border-primary rounded-lg py-sm px-md font-body-md text-body-md outline-none resize-none" />
                </div>
                <div>
                    <label className="font-label-md text-label-md text-on-surface block mb-xs">Icon (nama Material Symbol atau emoji)</label>
                    <input type="text" value={form.data.icon} onChange={e => form.setData('icon', e.target.value)}
                        className="w-full bg-background-subtle border-2 border-transparent focus:border-primary rounded-lg py-sm px-md font-body-md text-body-md outline-none" />
                </div>
                <div>
                    <label className="font-label-md text-label-md text-on-surface block mb-xs">Urutan</label>
                    <input type="number" value={form.data.order_position} onChange={e => form.setData('order_position', e.target.value)}
                        className="w-full bg-background-subtle border-2 border-transparent focus:border-primary rounded-lg py-sm px-md font-body-md text-body-md outline-none" min="0" />
                </div>
            </div>
            <div className="flex gap-sm justify-end mt-xl">
                <button type="button" onClick={onCancel} className="px-lg py-sm rounded-lg border border-outline text-on-surface font-label-md text-label-md hover:bg-surface-variant">Batal</button>
                <button type="submit" disabled={form.processing} className="px-lg py-sm rounded-lg bg-primary text-on-primary font-label-md text-label-md hover:bg-primary-container disabled:opacity-50">
                    {form.processing ? 'Menyimpan…' : label}
                </button>
            </div>
        </form>
    );

    return (
        <AdminLayout title="Admin Portal">
            <Head title="Info Box — BelajarKUY Admin" />

            <div className="flex justify-between items-center mb-gutter">
                <div>
                    <h1 className="font-headline-lg text-headline-lg text-on-surface">Info Box</h1>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-xs">Kelola info box di halaman utama.</p>
                </div>
                <button id="btn-tambah-infobox" onClick={() => setShowCreate(true)}
                    className="flex items-center gap-sm bg-primary text-on-primary font-label-md text-label-md px-lg py-sm rounded-lg hover:bg-primary-container shadow-sm">
                    <span className="material-symbols-outlined text-[18px]">add</span> Tambah Info Box
                </button>
            </div>

            <div className="bg-surface rounded-2xl shadow-[0_8px_30px_rgb(48,0,51,0.04)] overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-surface-variant bg-background-subtle">
                            <th className="py-md px-lg font-label-md text-label-md text-on-surface-variant">Icon</th>
                            <th className="py-md px-lg font-label-md text-label-md text-on-surface-variant">Judul</th>
                            <th className="py-md px-lg font-label-md text-label-md text-on-surface-variant hidden md:table-cell">Deskripsi</th>
                            <th className="py-md px-lg font-label-md text-label-md text-on-surface-variant">Urutan</th>
                            <th className="py-md px-lg font-label-md text-label-md text-on-surface-variant text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {infoBoxes.data?.length === 0 && (
                            <tr><td colSpan={5} className="py-xl text-center text-on-surface-variant font-body-md text-body-md">Belum ada info box</td></tr>
                        )}
                        {infoBoxes.data?.map(ib => (
                            <tr key={ib.id} className="border-b border-surface-variant/50 hover:bg-background-subtle transition-colors">
                                <td className="py-md px-lg text-xl">{ib.icon || '📦'}</td>
                                <td className="py-md px-lg font-body-md text-body-md text-on-surface font-medium">{ib.title}</td>
                                <td className="py-md px-lg text-on-surface-variant hidden md:table-cell max-w-[200px]">
                                    <span className="truncate block font-body-md text-body-md">{ib.description}</span>
                                </td>
                                <td className="py-md px-lg font-caption text-caption text-on-surface-variant">{ib.order_position}</td>
                                <td className="py-md px-lg text-right">
                                    <div className="flex items-center justify-end gap-sm">
                                        <button onClick={() => openEdit(ib)} className="p-sm rounded-lg text-primary hover:bg-primary/10">
                                            <span className="material-symbols-outlined text-[18px]">edit</span>
                                        </button>
                                        <button onClick={() => handleDelete(ib)} className="p-sm rounded-lg text-error hover:bg-error-container">
                                            <span className="material-symbols-outlined text-[18px]">delete</span>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <Pagination data={infoBoxes} />
            </div>

            {showCreate && <Modal title="Tambah Info Box" onClose={() => setShowCreate(false)}>
                <InfoBoxForm form={createForm} onSubmit={handleCreate} label="Simpan" onCancel={() => setShowCreate(false)} />
            </Modal>}
            {editItem && <Modal title={`Edit: ${editItem.title}`} onClose={() => setEditItem(null)}>
                <InfoBoxForm form={editForm} onSubmit={handleEdit} label="Perbarui" onCancel={() => setEditItem(null)} />
            </Modal>}
            {dialog && <ConfirmDialog open onClose={() => setDialog(null)} {...dialog} />}
        </AdminLayout>
    );
}

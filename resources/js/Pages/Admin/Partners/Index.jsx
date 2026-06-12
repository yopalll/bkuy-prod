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
                    <button onClick={onClose} className="text-on-surface-variant hover:text-error">
                        <span className="material-symbols-outlined text-[20px]">close</span>
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}

export default function PartnersIndex({ partners, editPartner = null }) {
    const [showCreate, setShowCreate] = useState(false);
    const [editItem, setEditItem] = useState(editPartner);
    const [dialog, setDialog] = useState(null);

    const createForm = useForm({ name: '', url: '', logo: null, order_position: 0 });
    const editForm   = useForm({ name: editItem?.name ?? '', url: editItem?.url ?? '', logo: null, order_position: editItem?.order_position ?? 0, _method: 'PATCH' });

    function handleCreate(e) {
        e.preventDefault();
        createForm.post('/admin/partners', { forceFormData: true, onSuccess: () => { setShowCreate(false); createForm.reset(); } });
    }
    function handleEdit(e) {
        e.preventDefault();
        editForm.post(`/admin/partners/${editItem.id}`, { forceFormData: true, onSuccess: () => setEditItem(null) });
    }
    function handleDelete(p) {
        setDialog({
            title: 'Hapus Partner',
            message: `Hapus partner "${p.name}"?`,
            icon: 'delete', variant: 'danger', confirmLabel: 'Hapus',
            onConfirm: () => router.delete(`/admin/partners/${p.id}`),
        });
    }
    function openEdit(p) {
        setEditItem(p);
        editForm.setData({ name: p.name, url: p.url ?? '', logo: null, order_position: p.order_position ?? 0, _method: 'PATCH' });
    }

    const PartnerForm = ({ form, onSubmit, label, editItem: ei }) => (
        <form onSubmit={onSubmit} encType="multipart/form-data">
            <div className="space-y-md">
                <div>
                    <label className="font-label-md text-label-md text-on-surface block mb-xs">Nama Partner</label>
                    <input type="text" value={form.data.name} onChange={e => form.setData('name', e.target.value)}
                        className="w-full bg-background-subtle border-2 border-transparent focus:border-primary rounded-lg py-sm px-md font-body-md text-body-md outline-none" required />
                </div>
                <div>
                    <label className="font-label-md text-label-md text-on-surface block mb-xs">Website URL</label>
                    <input type="url" value={form.data.url} onChange={e => form.setData('url', e.target.value)}
                        className="w-full bg-background-subtle border-2 border-transparent focus:border-primary rounded-lg py-sm px-md font-body-md text-body-md outline-none"
                        placeholder="https://..." />
                </div>
                <div>
                    <label className="font-label-md text-label-md text-on-surface block mb-xs">Logo {ei ? '(opsional, ganti logo)' : ''}</label>
                    {ei?.logo_url && <img src={ei.logo_url} alt={ei.name} className="h-10 object-contain mb-sm rounded" />}
                    <label className="flex items-center gap-sm bg-background-subtle border-2 border-dashed border-outline-variant hover:border-primary rounded-lg py-md px-md cursor-pointer transition-colors">
                        <span className="material-symbols-outlined text-[18px] text-on-surface-variant">upload</span>
                        <span className="font-body-md text-body-md text-on-surface-variant">{form.data.logo ? form.data.logo.name : 'Pilih logo…'}</span>
                        <input type="file" accept="image/*" className="hidden" onChange={e => form.setData('logo', e.target.files[0])} />
                    </label>
                </div>
                <div>
                    <label className="font-label-md text-label-md text-on-surface block mb-xs">Urutan</label>
                    <input type="number" value={form.data.order_position} onChange={e => form.setData('order_position', e.target.value)}
                        className="w-full bg-background-subtle border-2 border-transparent focus:border-primary rounded-lg py-sm px-md font-body-md text-body-md outline-none" min="0" />
                </div>
            </div>
            <div className="flex gap-sm justify-end mt-xl">
                <button type="button" onClick={() => ei ? setEditItem(null) : setShowCreate(false)}
                    className="px-lg py-sm rounded-lg border border-outline text-on-surface font-label-md text-label-md hover:bg-surface-variant">Batal</button>
                <button type="submit" disabled={form.processing}
                    className="px-lg py-sm rounded-lg bg-primary text-on-primary font-label-md text-label-md hover:bg-primary-container disabled:opacity-50">
                    {form.processing ? 'Menyimpan…' : label}
                </button>
            </div>
        </form>
    );

    return (
        <AdminLayout title="Admin Portal">
            <Head title="Partner — BelajarKUY Admin" />

            <div className="flex justify-between items-center mb-gutter">
                <div>
                    <h1 className="font-headline-lg text-headline-lg text-on-surface">Partner</h1>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-xs">Kelola logo partner di halaman utama.</p>
                </div>
                <button id="btn-tambah-partner" onClick={() => setShowCreate(true)}
                    className="flex items-center gap-sm bg-primary text-on-primary font-label-md text-label-md px-lg py-sm rounded-lg hover:bg-primary-container shadow-sm">
                    <span className="material-symbols-outlined text-[18px]">add</span> Tambah Partner
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-gutter">
                {partners.data?.length === 0 && (
                    <div className="col-span-full bg-surface rounded-2xl p-xl text-center text-on-surface-variant font-body-md text-body-md">Belum ada partner</div>
                )}
                {partners.data?.map(p => (
                    <div key={p.id} className="bg-surface rounded-xl p-md shadow-sm border border-transparent hover:border-primary-fixed-dim transition-colors">
                        <div className="h-20 flex items-center justify-center mb-md bg-background-subtle rounded-lg p-md">
                            {p.logo_url
                                ? <img src={p.logo_url} alt={p.name} className="max-h-full max-w-full object-contain" />
                                : <span className="text-on-surface-variant font-body-md text-body-md">No logo</span>
                            }
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-label-md text-label-md font-bold text-on-surface">{p.name}</p>
                                {p.url && (
                                    <a href={p.url} target="_blank" rel="noreferrer" className="flex items-center gap-xs font-caption text-caption text-primary hover:underline mt-xs">
                                        <span className="material-symbols-outlined text-[12px]">open_in_new</span> Website
                                    </a>
                                )}
                            </div>
                            <div className="flex gap-sm">
                                <button onClick={() => openEdit(p)} className="p-sm rounded-lg text-primary hover:bg-primary/10">
                                    <span className="material-symbols-outlined text-[18px]">edit</span>
                                </button>
                                <button onClick={() => handleDelete(p)} className="p-sm rounded-lg text-error hover:bg-error-container">
                                    <span className="material-symbols-outlined text-[18px]">delete</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Pagination data={partners} />

            {showCreate && <Modal title="Tambah Partner" onClose={() => setShowCreate(false)}>
                <PartnerForm form={createForm} onSubmit={handleCreate} label="Simpan" editItem={null} />
            </Modal>}
            {editItem && <Modal title={`Edit: ${editItem.name}`} onClose={() => setEditItem(null)}>
                <PartnerForm form={editForm} onSubmit={handleEdit} label="Perbarui" editItem={editItem} />
            </Modal>}
            {dialog && <ConfirmDialog open onClose={() => setDialog(null)} {...dialog} />}
        </AdminLayout>
    );
}

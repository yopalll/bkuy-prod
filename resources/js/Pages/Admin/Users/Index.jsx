import { Head, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Pagination from '@/Components/Admin/Pagination';
import ConfirmDialog from '@/Components/ConfirmDialog';
import { useState } from 'react';

const ROLE_CONFIG = {
    admin:      { label: 'Admin',      cls: 'bg-primary/10 text-primary border-primary/20' },
    instructor: { label: 'Instruktur', cls: 'bg-secondary/10 text-secondary border-secondary/20' },
    user:       { label: 'Siswa',      cls: 'bg-success/10 text-success border-success/20' },
};

export default function UsersIndex({ users, filters = {} }) {
    const { auth } = usePage().props;
    const [search, setSearch] = useState(filters.search ?? '');
    const [roleFilter, setRoleFilter] = useState(filters.role ?? '');
    const [editingId, setEditingId] = useState(null);
    const [newRole, setNewRole] = useState('');
    const [dialog, setDialog] = useState(null);

    function applyFilters(overrides = {}) {
        const params = {
            search: search,
            role: roleFilter,
            ...overrides,
        };
        router.get('/admin/users', params, { preserveState: true, replace: true });
    }

    function handleSearchKey(e) {
        if (e.key === 'Enter') applyFilters({ search: e.target.value });
    }

    function startEdit(user) {
        setEditingId(user.id);
        setNewRole(user.role);
    }

    function cancelEdit() {
        setEditingId(null);
        setNewRole('');
    }

    function submitRoleChange(user) {
        if (newRole === user.role) { cancelEdit(); return; }
        setDialog({
            title: 'Ubah Role Pengguna',
            message: `Ubah role "${user.name}" dari "${user.role}" ke "${newRole}"?`,
            icon: 'manage_accounts', variant: 'warning', confirmLabel: 'Ubah Role',
            onConfirm: () => router.patch(route('admin.users.update-role', user.id), { role: newRole }, {
                onSuccess: cancelEdit,
                preserveState: true,
            }),
        });
    }

    return (
        <AdminLayout title="Admin Portal">
            <Head title="Pengguna — BelajarKUY Admin" />

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-md mb-gutter">
                <div>
                    <h1 className="font-headline-lg text-headline-lg text-on-surface">Manajemen Pengguna</h1>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-xs">
                        Daftar semua pengguna terdaftar di platform.
                    </p>
                </div>
                <div className="bg-surface px-lg py-sm rounded-xl border border-surface-variant shadow-sm shrink-0">
                    <span className="font-caption text-caption text-on-surface-variant">Total</span>
                    <span className="ml-sm font-headline-md text-headline-md text-primary">{users.total?.toLocaleString('id-ID') ?? '—'}</span>
                </div>
            </div>

            {/* Filter bar */}
            <div className="flex flex-col sm:flex-row gap-md mb-lg">
                <div className="relative flex-1">
                    <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px] pointer-events-none">search</span>
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        onKeyDown={handleSearchKey}
                        placeholder="Cari nama atau email…"
                        className="w-full pl-xl pr-md py-sm bg-surface border border-surface-variant rounded-lg font-body-md text-body-md outline-none focus:border-primary transition-colors"
                    />
                </div>
                <select
                    value={roleFilter}
                    onChange={e => { setRoleFilter(e.target.value); applyFilters({ role: e.target.value }); }}
                    className="bg-surface border border-surface-variant rounded-lg py-sm px-md font-body-md text-body-md outline-none focus:border-primary transition-colors"
                >
                    <option value="">Semua Role</option>
                    <option value="user">Siswa</option>
                    <option value="instructor">Instruktur</option>
                    <option value="admin">Admin</option>
                </select>
                <button
                    onClick={() => applyFilters()}
                    className="bg-primary text-on-primary px-lg py-sm rounded-lg font-label-md text-label-md hover:bg-primary-container transition-colors shrink-0"
                >
                    Filter
                </button>
            </div>

            {/* Table */}
            <div className="bg-surface rounded-2xl shadow-[0_8px_30px_rgb(48,0,51,0.04)] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-surface-variant bg-background-subtle">
                                <th className="py-md px-lg font-label-md text-label-md text-on-surface-variant">Pengguna</th>
                                <th className="py-md px-lg font-label-md text-label-md text-on-surface-variant hidden md:table-cell">Email</th>
                                <th className="py-md px-lg font-label-md text-label-md text-on-surface-variant text-center">Peran</th>
                                <th className="py-md px-lg font-label-md text-label-md text-on-surface-variant hidden lg:table-cell">Terdaftar</th>
                                <th className="py-md px-lg font-label-md text-label-md text-on-surface-variant text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.data?.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="py-xl text-center text-on-surface-variant font-body-md text-body-md">
                                        Tidak ada pengguna
                                    </td>
                                </tr>
                            )}
                            {users.data?.map(user => {
                                const roleCfg = ROLE_CONFIG[user.role] ?? { label: user.role, cls: 'bg-surface-variant text-on-surface-variant border-outline-variant' };
                                const isEditing = editingId === user.id;
                                const isSelf = auth?.user?.id === user.id;

                                return (
                                    <tr key={user.id} className="border-b border-surface-variant/50 hover:bg-background-subtle transition-colors group">
                                        {/* Nama */}
                                        <td className="py-md px-lg">
                                            <div className="flex items-center gap-md">
                                                <div className="w-9 h-9 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-sm shrink-0">
                                                    {user.name?.charAt(0)?.toUpperCase() ?? '?'}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-body-md text-body-md text-on-surface font-medium truncate">{user.name}</p>
                                                    {isSelf && <span className="font-caption text-[10px] text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">(Anda)</span>}
                                                </div>
                                            </div>
                                        </td>

                                        {/* Email */}
                                        <td className="py-md px-lg text-on-surface-variant hidden md:table-cell font-body-md text-body-md">
                                            {user.email}
                                        </td>

                                        {/* Peran */}
                                        <td className="py-md px-lg text-center">
                                            {isEditing ? (
                                                <select
                                                    value={newRole}
                                                    onChange={e => setNewRole(e.target.value)}
                                                    className="bg-surface border-2 border-primary rounded-lg py-xs px-sm font-caption text-caption outline-none"
                                                    autoFocus
                                                >
                                                    <option value="user">Siswa</option>
                                                    <option value="instructor">Instruktur</option>
                                                    <option value="admin">Admin</option>
                                                </select>
                                            ) : (
                                                <span className={`inline-flex items-center px-sm py-xs rounded-full font-caption text-caption border capitalize ${roleCfg.cls}`}>
                                                    {roleCfg.label}
                                                </span>
                                            )}
                                        </td>

                                        {/* Terdaftar */}
                                        <td className="py-md px-lg text-on-surface-variant hidden lg:table-cell font-body-md text-body-md">
                                            {new Date(user.created_at).toLocaleDateString('id-ID', { dateStyle: 'medium' })}
                                        </td>

                                        {/* Aksi */}
                                        <td className="py-md px-lg text-right">
                                            {isEditing ? (
                                                <div className="flex items-center justify-end gap-xs">
                                                    <button
                                                        onClick={() => submitRoleChange(user)}
                                                        className="p-sm rounded-lg text-success hover:bg-success/10 transition-colors"
                                                        title="Simpan"
                                                    >
                                                        <span className="material-symbols-outlined text-[18px]">check_circle</span>
                                                    </button>
                                                    <button
                                                        onClick={cancelEdit}
                                                        className="p-sm rounded-lg text-on-surface-variant hover:bg-surface-variant transition-colors"
                                                        title="Batal"
                                                    >
                                                        <span className="material-symbols-outlined text-[18px]">close</span>
                                                    </button>
                                                </div>
                                            ) : (
                                                !isSelf && (
                                                    <button
                                                        onClick={() => startEdit(user)}
                                                        className="inline-flex items-center gap-xs px-sm py-xs rounded-lg text-on-surface-variant hover:text-primary hover:bg-primary/5 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 font-label-md text-label-md"
                                                        title="Ubah Role"
                                                    >
                                                        <span className="material-symbols-outlined text-[18px]">manage_accounts</span>
                                                        Edit Role
                                                    </button>
                                                )
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                <Pagination data={users} preserveState={true} />
            </div>

            {dialog && <ConfirmDialog open onClose={() => setDialog(null)} {...dialog} />}
        </AdminLayout>
    );
}

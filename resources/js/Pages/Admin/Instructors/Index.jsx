import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Pagination from '@/Components/Admin/Pagination';

export default function InstructorsIndex({ instructors }) {
    return (
        <AdminLayout title="Admin Portal">
            <Head title="Instruktur — BelajarKUY Admin" />

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-gutter">
                <div>
                    <h1 className="font-headline-lg text-headline-lg text-on-surface">Manajemen Instruktur</h1>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-xs">
                        Daftar semua instruktur terdaftar di platform.
                    </p>
                </div>
                <div className="bg-surface px-lg py-sm rounded-xl border border-surface-variant shadow-sm shrink-0">
                    <span className="font-caption text-caption text-on-surface-variant">Total</span>
                    <span className="ml-sm font-headline-md text-headline-md text-primary">
                        {instructors.total?.toLocaleString('id-ID') ?? '—'}
                    </span>
                </div>
            </div>

            <div className="bg-surface rounded-2xl shadow-[0_8px_30px_rgb(48,0,51,0.04)] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-surface-variant bg-background-subtle">
                                <th className="py-md px-lg font-label-md text-label-md text-on-surface-variant">Instruktur</th>
                                <th className="py-md px-lg font-label-md text-label-md text-on-surface-variant hidden md:table-cell">Email</th>
                                <th className="py-md px-lg font-label-md text-label-md text-on-surface-variant text-center">Kursus</th>
                                <th className="py-md px-lg font-label-md text-label-md text-on-surface-variant text-center hidden lg:table-cell">Kupon</th>
                                <th className="py-md px-lg font-label-md text-label-md text-on-surface-variant hidden lg:table-cell">Terdaftar</th>
                                <th className="py-md px-lg font-label-md text-label-md text-on-surface-variant text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {instructors.data?.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="py-xl text-center text-on-surface-variant font-body-md text-body-md">
                                        Tidak ada instruktur
                                    </td>
                                </tr>
                            )}
                            {instructors.data?.map((inst) => (
                                <tr
                                    key={inst.id}
                                    className="border-b border-surface-variant/50 hover:bg-background-subtle transition-colors group"
                                >
                                    <td className="py-md px-lg">
                                        <div className="flex items-center gap-md">
                                            <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary font-label-md text-label-md shrink-0">
                                                {inst.photo ? (
                                                    <img
                                                        src={inst.photo.startsWith('http') ? inst.photo : `/${inst.photo}`}
                                                        alt={inst.name}
                                                        className="w-10 h-10 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    inst.name?.charAt(0)?.toUpperCase() ?? '?'
                                                )}
                                            </div>
                                            <span className="font-body-md text-body-md text-on-surface font-medium">
                                                {inst.name}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-md px-lg text-on-surface-variant hidden md:table-cell font-body-md text-body-md">
                                        {inst.email}
                                    </td>
                                    <td className="py-md px-lg text-center">
                                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-label-md text-label-md font-bold">
                                            {inst.courses_count ?? 0}
                                        </span>
                                    </td>
                                    <td className="py-md px-lg text-center hidden lg:table-cell">
                                        <span className="font-body-md text-body-md text-on-surface-variant">
                                            {inst.coupons_count ?? 0}
                                        </span>
                                    </td>
                                    <td className="py-md px-lg text-on-surface-variant hidden lg:table-cell font-body-md text-body-md">
                                        {new Date(inst.created_at).toLocaleDateString('id-ID', { dateStyle: 'medium' })}
                                    </td>
                                    <td className="py-md px-lg text-right">
                                        <Link
                                            href={route('admin.instructors.show', inst.id)}
                                            className="inline-flex items-center gap-1 px-sm py-xs rounded-lg text-on-surface-variant hover:text-primary hover:bg-primary/5 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 font-label-md text-label-md"
                                        >
                                            <span className="material-symbols-outlined text-[18px]">visibility</span>
                                            Detail
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <Pagination data={instructors} />
            </div>
        </AdminLayout>
    );
}

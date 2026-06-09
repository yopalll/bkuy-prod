import { Head, router, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Pagination from '@/Components/Admin/Pagination';
import { useState } from 'react';

const STATUS_CONFIG = {
    pending_review: { label: 'Pending', cls: 'bg-warning/10 text-warning' },
    active:         { label: 'Aktif',   cls: 'bg-success/10 text-success' },
    inactive:       { label: 'Nonaktif',cls: 'bg-error/10 text-error' },
    draft:          { label: 'Draft',   cls: 'bg-surface-variant text-on-surface-variant' },
};

function StatusBadge({ status }) {
    const cfg = STATUS_CONFIG[status] ?? { label: status, cls: 'bg-surface-variant text-on-surface-variant' };
    return (
        <span className={`inline-flex items-center px-2 py-1 rounded-full font-caption text-caption ${cfg.cls}`}>
            <span className="w-1.5 h-1.5 rounded-full mr-1 bg-current opacity-70" />
            {cfg.label}
        </span>
    );
}

export default function CoursesIndex({ courses }) {
    const [activeTab, setActiveTab] = useState('all');

    function updateStatus(course, status) {
        const label = status === 'active' ? 'menyetujui' : 'menolak';
        if (!confirm(`Yakin ${label} kursus "${course.title}"?`)) return;
        router.patch(`/admin/courses/${course.id}/status`, { status });
    }

    const TABS = [
        { key: 'all',           label: 'Semua' },
        { key: 'pending_review',label: 'Pending' },
        { key: 'active',        label: 'Aktif' },
        { key: 'inactive',      label: 'Nonaktif' },
    ];

    const filtered = activeTab === 'all'
        ? courses.data
        : courses.data?.filter(c => c.status === activeTab);

    return (
        <AdminLayout title="Admin Portal">
            <Head title="Moderasi Kursus — BelajarKUY Admin" />

            <div className="flex flex-col md:flex-row md:items-end justify-between mb-xl gap-md">
                <div>
                    <h1 className="font-headline-lg text-headline-lg text-on-background">Course Moderation</h1>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                        Tinjau dan kelola kursus instruktur untuk memastikan kualitas platform.
                    </p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-surface-variant mb-lg">
                {TABS.map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`px-lg py-md font-label-md text-label-md transition-colors flex items-center gap-sm
                            ${activeTab === tab.key
                                ? 'text-primary border-b-2 border-primary'
                                : 'text-on-surface-variant hover:text-primary'
                            }`}
                    >
                        {tab.label}
                        {tab.key === 'pending_review' && (courses.data?.filter(c => c.status === 'pending_review').length ?? 0) > 0 && (
                            <span className="bg-warning text-white font-caption text-[10px] px-2 py-0.5 rounded-full">
                                {courses.data.filter(c => c.status === 'pending_review').length}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Course cards */}
            <div className="space-y-md">
                {(!filtered || filtered.length === 0) && (
                    <div className="bg-surface rounded-xl p-xl text-center text-on-surface-variant font-body-md text-body-md">
                        Tidak ada kursus untuk tab ini.
                    </div>
                )}
                {filtered?.map(course => (
                    <div key={course.id} className="bg-surface rounded-xl p-md flex flex-col xl:flex-row gap-lg shadow-sm border border-transparent hover:border-primary-fixed-dim transition-colors group">
                        {/* Thumbnail */}
                        <div className="w-full xl:w-64 h-40 rounded-lg overflow-hidden shrink-0 relative bg-surface-container">
                            {course.thumbnail_url
                                ? <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover" />
                                : <div className="w-full h-full flex items-center justify-center text-on-surface-variant text-sm">Tidak ada gambar</div>
                            }
                            <div className="absolute top-sm right-sm">
                                <StatusBadge status={course.status} />
                            </div>
                        </div>

                        {/* Details */}
                        <div className="flex-1 flex flex-col justify-center min-w-0">
                            <div className="flex items-center gap-sm mb-sm">
                                <span className="bg-primary/10 text-primary font-caption text-caption px-sm py-xs rounded-full">
                                    {course.category?.name ?? '—'}
                                </span>
                            </div>
                            <h3 className="font-headline-md text-[20px] leading-tight text-on-background mb-xs truncate">
                                {course.title}
                            </h3>
                            <p className="font-body-md text-body-md text-on-surface-variant mb-md flex items-center gap-xs">
                                👤 {course.instructor?.name ?? '—'}
                            </p>
                            {course.price != null && (
                                <div className="font-label-md text-label-md text-primary">
                                    {Number(course.price) === 0
                                        ? 'Gratis'
                                        : `Rp ${Number(course.price).toLocaleString('id-ID')}`}
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex xl:flex-col justify-end xl:justify-center gap-sm shrink-0 border-t xl:border-t-0 xl:border-l border-surface-variant pt-md xl:pt-0 xl:pl-lg mt-md xl:mt-0">
                            {course.status === 'pending_review' && (
                                <button
                                    onClick={() => updateStatus(course, 'active')}
                                    className="bg-primary text-on-primary font-label-md text-label-md px-lg py-sm rounded-lg hover:bg-primary-container transition-colors flex items-center justify-center gap-xs"
                                >
                                    <span className="material-symbols-outlined text-[18px]">check_circle</span>
                                    Setujui
                                </button>
                            )}
                            {course.status === 'active' && (
                                <button
                                    onClick={() => updateStatus(course, 'inactive')}
                                    className="bg-error text-on-error font-label-md text-label-md px-lg py-sm rounded-lg hover:opacity-90 transition-colors flex items-center justify-center gap-xs"
                                >
                                    <span className="material-symbols-outlined text-[18px]">cancel</span>
                                    Nonaktifkan
                                </button>
                            )}
                            {course.status === 'inactive' && (
                                <button
                                    onClick={() => updateStatus(course, 'active')}
                                    className="bg-success text-white font-label-md text-label-md px-lg py-sm rounded-lg hover:opacity-90 transition-colors flex items-center justify-center gap-xs"
                                >
                                    <span className="material-symbols-outlined text-[18px]">check_circle</span>
                                    Aktifkan
                                </button>
                            )}
                            <Link
                                href={`/admin/courses/${course.id}`}
                                className="bg-surface border border-outline text-on-surface font-label-md text-label-md px-lg py-sm rounded-lg hover:bg-background-subtle transition-colors flex items-center justify-center gap-xs"
                            >
                                <span className="material-symbols-outlined text-[18px]">visibility</span>
                                Detail
                            </Link>
                            {course.status === 'pending_review' && (
                                <button
                                    onClick={() => updateStatus(course, 'inactive')}
                                    className="text-error font-label-md text-label-md px-lg py-sm rounded-lg hover:bg-error-container transition-colors flex items-center justify-center gap-xs"
                                >
                                    <span className="material-symbols-outlined text-[18px]">cancel</span>
                                    Tolak
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <Pagination data={courses} />
        </AdminLayout>
    );
}

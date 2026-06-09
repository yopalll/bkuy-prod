import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

const COURSE_STATUS = {
    draft:          { label: 'Draft',           cls: 'bg-surface-container-highest text-on-surface-variant' },
    pending_review: { label: 'Menunggu Review', cls: 'bg-warning/10 text-warning' },
    active:         { label: 'Aktif',           cls: 'bg-success/10 text-success' },
    inactive:       { label: 'Nonaktif',        cls: 'bg-error/10 text-error' },
};

const rupiah = (n) => 'Rp ' + Number(n ?? 0).toLocaleString('id-ID');

export default function InstructorsShow({ instructor, courses }) {
    const initials = instructor.name
        ?.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase() ?? 'IN';

    return (
        <AdminLayout title="Admin Portal">
            <Head title={`${instructor.name} — Instruktur`} />

            <div className="mb-gutter">
                <Link
                    href={route('admin.instructors.index')}
                    className="inline-flex items-center gap-sm text-on-surface-variant hover:text-primary font-label-md text-label-md transition-colors"
                >
                    <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                    Kembali ke Daftar Instruktur
                </Link>
            </div>

            <div className="bg-surface rounded-2xl shadow-[0_8px_30px_rgb(48,0,51,0.04)] border border-surface-variant/50 p-lg mb-gutter">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-lg">
                    <div className="w-20 h-20 rounded-full bg-secondary/10 flex items-center justify-center text-secondary font-headline-md text-headline-md font-bold shrink-0 overflow-hidden">
                        {instructor.photo ? (
                            <img
                                src={instructor.photo.startsWith('http') ? instructor.photo : `/${instructor.photo}`}
                                alt={instructor.name}
                                className="w-full h-full object-cover"
                            />
                        ) : initials}
                    </div>

                    <div className="flex-1 min-w-0">
                        <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">
                            {instructor.name}
                        </h1>
                        <p className="font-body-md text-body-md text-on-surface-variant mt-xs">{instructor.email}</p>
                        <p className="font-caption text-caption text-on-surface-variant mt-xs">
                            Bergabung {new Date(instructor.created_at).toLocaleDateString('id-ID', { dateStyle: 'long' })}
                        </p>
                    </div>

                    <div className="flex gap-lg shrink-0">
                        <div className="text-center">
                            <div className="font-headline-md text-headline-md text-primary font-bold">
                                {instructor.courses_count ?? 0}
                            </div>
                            <div className="font-caption text-caption text-on-surface-variant">Kursus</div>
                        </div>
                        <div className="text-center">
                            <div className="font-headline-md text-headline-md text-secondary font-bold">
                                {instructor.coupons_count ?? 0}
                            </div>
                            <div className="font-caption text-caption text-on-surface-variant">Kupon</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Kursus */}
            <div>
                <h2 className="font-headline-md text-headline-md text-on-surface mb-lg">
                    Kursus ({courses.total ?? 0})
                </h2>

                {courses.data?.length === 0 ? (
                    <div className="bg-surface rounded-2xl border border-surface-variant/50 p-xl text-center">
                        <span className="material-symbols-outlined text-[40px] text-on-surface-variant/40 mb-md block">menu_book</span>
                        <p className="font-body-md text-body-md text-on-surface-variant">
                            Instruktur ini belum membuat kursus.
                        </p>
                    </div>
                ) : (
                    <div className="bg-surface rounded-2xl shadow-[0_8px_30px_rgb(48,0,51,0.04)] overflow-hidden border border-surface-variant/50">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-surface-variant bg-background-subtle">
                                        <th className="py-md px-lg font-label-md text-label-md text-on-surface-variant">Kursus</th>
                                        <th className="py-md px-lg font-label-md text-label-md text-on-surface-variant hidden md:table-cell">Kategori</th>
                                        <th className="py-md px-lg font-label-md text-label-md text-on-surface-variant text-center">Status</th>
                                        <th className="py-md px-lg font-label-md text-label-md text-on-surface-variant hidden lg:table-cell">Harga</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {courses.data.map((course) => {
                                        const cfg = COURSE_STATUS[course.status] ?? COURSE_STATUS.draft;
                                        return (
                                            <tr
                                                key={course.id}
                                                className="border-b border-surface-variant/50 hover:bg-background-subtle transition-colors"
                                            >
                                                <td className="py-md px-lg">
                                                    <div className="flex items-center gap-md">
                                                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 overflow-hidden">
                                                            {course.thumbnail ? (
                                                                <img
                                                                    src={course.thumbnail.startsWith('http') ? course.thumbnail : `/${course.thumbnail}`}
                                                                    alt={course.title}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            ) : (
                                                                <span className="material-symbols-outlined text-[20px] text-primary/50">menu_book</span>
                                                            )}
                                                        </div>
                                                        <span className="font-body-md text-body-md text-on-surface font-medium line-clamp-1">
                                                            {course.title}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="py-md px-lg hidden md:table-cell">
                                                    {course.category ? (
                                                        <span className="inline-flex items-center gap-1 font-caption text-caption bg-surface-container px-sm py-xs rounded-full text-on-surface-variant">
                                                            <span className="material-symbols-outlined text-[12px]">label</span>
                                                            {course.category.name}
                                                        </span>
                                                    ) : (
                                                        <span className="text-on-surface-variant font-caption text-caption">—</span>
                                                    )}
                                                </td>
                                                <td className="py-md px-lg text-center">
                                                    <span className={`inline-flex items-center px-sm py-xs rounded-full font-caption text-caption ${cfg.cls}`}>
                                                        {cfg.label}
                                                    </span>
                                                </td>
                                                <td className="py-md px-lg hidden lg:table-cell font-body-md text-body-md text-on-surface-variant">
                                                    {course.price == 0 ? 'Gratis' : rupiah(course.price)}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {courses.last_page > 1 && (
                            <div className="flex justify-between items-center px-lg py-md border-t border-surface-variant">
                                <span className="font-caption text-caption text-on-surface-variant">
                                    Halaman {courses.current_page} dari {courses.last_page}
                                </span>
                                <div className="flex gap-sm">
                                    {courses.prev_page_url && (
                                        <a href={courses.prev_page_url} className="p-sm rounded-lg border border-outline-variant text-on-surface hover:bg-surface-variant transition-colors">
                                            <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                                        </a>
                                    )}
                                    {courses.next_page_url && (
                                        <a href={courses.next_page_url} className="p-sm rounded-lg border border-outline-variant text-on-surface hover:bg-surface-variant transition-colors">
                                            <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                                        </a>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}

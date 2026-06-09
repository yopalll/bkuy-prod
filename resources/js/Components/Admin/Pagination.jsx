import { router } from '@inertiajs/react';

function getPageNumbers(current, last) {
    if (last <= 7) return Array.from({ length: last }, (_, i) => i + 1);

    const pages = new Set([1, last, current]);
    for (let i = current - 1; i <= current + 1; i++) {
        if (i >= 1 && i <= last) pages.add(i);
    }

    const sorted = [...pages].sort((a, b) => a - b);
    const result = [];
    for (let i = 0; i < sorted.length; i++) {
        if (i > 0 && sorted[i] - sorted[i - 1] > 1) result.push('...');
        result.push(sorted[i]);
    }
    return result;
}

export default function Pagination({ data, preserveState = false, preserveScroll = true }) {
    if (!data || data.last_page <= 1) return null;

    const { current_page, last_page, from, to, total, links } = data;

    function goTo(url) {
        if (!url) return;
        router.visit(url, { preserveState, preserveScroll });
    }

    const prevUrl = links?.find(l => l.label.includes('Previous'))?.url ?? null;
    const nextUrl = links?.find(l => l.label.includes('Next'))?.url ?? null;

    function pageUrl(page) {
        const link = links?.find(l => l.label === String(page));
        return link?.url ?? null;
    }

    const pages = getPageNumbers(current_page, last_page);

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-md px-lg py-md border-t border-surface-variant">
            <span className="font-caption text-caption text-on-surface-variant order-2 sm:order-1">
                {from && to
                    ? `Menampilkan ${from}–${to} dari ${total} data`
                    : `Halaman ${current_page} dari ${last_page}`}
            </span>

            <div className="flex items-center gap-xs order-1 sm:order-2">
                {/* Prev */}
                <button
                    onClick={() => goTo(prevUrl)}
                    disabled={!prevUrl}
                    className="p-sm rounded-lg border border-outline-variant transition-colors disabled:opacity-30 disabled:cursor-not-allowed hover:bg-surface-variant enabled:text-on-surface"
                    title="Halaman sebelumnya"
                >
                    <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                </button>

                {/* Page numbers */}
                {pages.map((p, i) =>
                    p === '...' ? (
                        <span key={`dot-${i}`} className="px-sm font-caption text-caption text-on-surface-variant select-none">…</span>
                    ) : (
                        <button
                            key={p}
                            onClick={() => goTo(pageUrl(p))}
                            disabled={p === current_page}
                            className={`min-w-[36px] h-9 px-sm rounded-lg border font-label-md text-label-md transition-colors ${
                                p === current_page
                                    ? 'bg-primary text-on-primary border-primary cursor-default'
                                    : 'border-outline-variant text-on-surface hover:bg-surface-variant'
                            }`}
                        >
                            {p}
                        </button>
                    )
                )}

                {/* Next */}
                <button
                    onClick={() => goTo(nextUrl)}
                    disabled={!nextUrl}
                    className="p-sm rounded-lg border border-outline-variant transition-colors disabled:opacity-30 disabled:cursor-not-allowed hover:bg-surface-variant enabled:text-on-surface"
                    title="Halaman berikutnya"
                >
                    <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </button>
            </div>
        </div>
    );
}

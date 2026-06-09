import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import StudentLayout from '@/Layouts/StudentLayout';

const TYPE_CONFIG = {
    transaction: { bg: 'bg-success/10', text: 'text-success', icon: 'check_circle', label: 'Transaksi' },
    learning:    { bg: 'bg-warning/10', text: 'text-warning', icon: 'rocket_launch', label: 'Belajar' },
    promo:       { bg: 'bg-primary/10', text: 'text-primary', icon: 'campaign',      label: 'Promo' },
    system:      { bg: 'bg-surface-container-high', text: 'text-on-surface-variant', icon: 'info', label: 'Sistem' },
};

function getCsrf() {
    return decodeURIComponent(
        document.cookie.split('; ').find(r => r.startsWith('XSRF-TOKEN='))?.split('=')[1] ?? ''
    );
}

function NotificationItem({ notif, onRead }) {
    const type   = TYPE_CONFIG[notif.type] ?? TYPE_CONFIG.system;
    const unread = !notif.read_at;

    const handleClick = async () => {
        if (unread) {
            await fetch(`/student/notifications/${notif.id}/read`, {
                method: 'POST',
                headers: { 'X-XSRF-TOKEN': getCsrf(), Accept: 'application/json' },
            });
            onRead(notif.id);
        }
        if (notif.action_url) {
            router.visit(notif.action_url);
        }
    };

    return (
        <div
            onClick={handleClick}
            className={`bg-surface rounded-2xl p-lg flex gap-md items-start shadow-sm hover:shadow-md transition-shadow cursor-pointer relative border border-transparent hover:border-surface-variant ${unread ? '' : 'opacity-80'}`}
        >
            {unread && (
                <div className="absolute top-lg right-lg w-3 h-3 bg-primary rounded-full" />
            )}
            <div className={`w-12 h-12 rounded-full ${type.bg} flex items-center justify-center shrink-0`}>
                <span
                    className={`material-symbols-outlined ${type.text}`}
                    style={unread ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                    {notif.icon ?? type.icon}
                </span>
            </div>
            <div className="flex-grow min-w-0">
                <div className="flex items-center gap-sm mb-xs flex-wrap">
                    <span className={`${type.bg} ${type.text} font-caption text-caption px-2 py-0.5 rounded-full uppercase tracking-wider`}>
                        {type.label}
                    </span>
                    <span className="font-caption text-caption text-on-surface-variant">{notif.time_ago}</span>
                </div>
                <h3 className="font-label-md text-label-md text-on-surface mb-xs">{notif.title}</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">{notif.body}</p>
                {notif.action_label && notif.action_url && (
                    <div className="mt-sm">
                        <span className="bg-secondary-container text-on-secondary-container font-label-md text-label-md px-4 py-2 rounded-lg hover:bg-secondary-fixed transition-colors inline-block">
                            {notif.action_label}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}

function EmptyNotifications() {
    return (
        <div className="flex-1 flex items-center justify-center p-gutter">
            <div className="bg-surface rounded-2xl p-xl max-w-lg w-full flex flex-col items-center text-center shadow-[0_8px_30px_rgba(48,0,51,0.08)] border border-outline-variant/30">
                <div className="w-28 h-28 mb-lg flex items-center justify-center rounded-full bg-surface-container-high">
                    <span className="material-symbols-outlined text-[72px] text-outline">notifications_none</span>
                </div>
                <h2 className="font-headline-md text-headline-md text-on-surface mb-sm">Belum ada notifikasi</h2>
                <p className="font-body-md text-body-md text-on-surface-variant">
                    Notifikasi transaksi, pengingat belajar, dan promo akan muncul di sini.
                </p>
            </div>
        </div>
    );
}

export default function Notifications({ notifications }) {
    const [items, setItems] = useState(notifications ?? []);
    const unreadCount = items.filter(n => !n.read_at).length;

    const handleRead = (id) => {
        setItems(prev => prev.map(n => n.id === id ? { ...n, read_at: new Date().toISOString() } : n));
    };

    const handleMarkAll = async () => {
        await fetch('/student/notifications/read-all', {
            method: 'POST',
            headers: { 'X-XSRF-TOKEN': getCsrf(), Accept: 'application/json' },
        });
        setItems(prev => prev.map(n => ({ ...n, read_at: n.read_at ?? new Date().toISOString() })));
    };

    return (
        <StudentLayout>
            <Head title="Notifikasi" />

            {items.length === 0 ? (
                <EmptyNotifications />
            ) : (
                <div className="px-margin-mobile md:px-margin-desktop py-xl md:py-xxl max-w-4xl mx-auto">
                    <div className="flex justify-between items-end mb-xl pb-md border-b border-surface-variant">
                        <div>
                            <h1 className="font-headline-lg text-headline-lg text-on-background">Notifikasi</h1>
                            <p className="font-body-md text-body-md text-on-surface-variant mt-xs">
                                {unreadCount > 0
                                    ? `${unreadCount} notifikasi belum dibaca`
                                    : 'Semua notifikasi sudah dibaca'}
                            </p>
                        </div>
                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAll}
                                className="text-primary font-label-md text-label-md hover:underline flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined">done_all</span>
                                Tandai semua dibaca
                            </button>
                        )}
                    </div>

                    <div className="flex flex-col gap-md">
                        {items.map((notif, i) => (
                            <NotificationItem key={notif.id ?? i} notif={notif} onRead={handleRead} />
                        ))}
                    </div>
                </div>
            )}
        </StudentLayout>
    );
}

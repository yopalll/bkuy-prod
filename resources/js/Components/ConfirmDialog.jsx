const VARIANT = {
    danger:  { btn: 'bg-error text-on-error hover:bg-error/90',            iconBg: 'bg-error-container text-error' },
    warning: { btn: 'bg-warning text-white hover:bg-warning/90',            iconBg: 'bg-warning/10 text-warning' },
    primary: { btn: 'bg-primary text-on-primary hover:bg-primary-container', iconBg: 'bg-primary/10 text-primary' },
};

export default function ConfirmDialog({
    open,
    title,
    message,
    icon = 'help',
    variant = 'danger',
    confirmLabel = 'Ya',
    cancelLabel = 'Batal',
    onConfirm,
    onClose,
}) {
    if (!open) return null;

    const v = VARIANT[variant] ?? VARIANT.danger;

    function handleConfirm() {
        onConfirm?.();
        onClose?.();
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-md"
            onClick={onClose}
        >
            <div
                className="bg-surface rounded-2xl shadow-xl w-full max-w-sm"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-start gap-md p-lg border-b border-surface-variant">
                    <div className={`p-sm rounded-lg shrink-0 ${v.iconBg}`}>
                        <span className="material-symbols-outlined text-[22px]">{icon}</span>
                    </div>
                    <div>
                        <h2 className="font-headline-md text-headline-md text-on-surface">{title}</h2>
                        {message && (
                            <p className="font-caption text-caption text-on-surface-variant mt-xs">{message}</p>
                        )}
                    </div>
                </div>
                <div className="flex justify-end gap-md p-lg">
                    <button
                        onClick={onClose}
                        className="px-lg py-md rounded-lg font-label-md text-label-md text-on-surface-variant bg-background-subtle hover:bg-surface-variant transition-colors"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        onClick={handleConfirm}
                        className={`px-lg py-md rounded-lg font-label-md text-label-md transition-colors ${v.btn}`}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}

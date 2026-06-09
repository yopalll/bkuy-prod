// Komponen EmptyState reusable. Desain dari Design Revisi (Vascha & Quinsha).
// Props:
//   icon        - React node atau string nama material-symbol (opsional)
//   title       - string (wajib)
//   description - string (opsional)
//   action      - React node (opsional)
//   size        - 'sm' | 'md' (default) | 'lg'
export default function EmptyState({ icon, title, description, action, size = 'md' }) {
    const sizes = {
        sm: { wrap: 'py-8 px-4',   iconBox: 'w-12 h-12 text-[24px]', title: 'font-label-md text-label-md',  desc: 'font-caption text-caption' },
        md: { wrap: 'py-14 px-6',  iconBox: 'w-16 h-16 text-[32px]', title: 'font-headline-md text-body-lg', desc: 'font-body-md text-body-md' },
        lg: { wrap: 'py-20 px-8',  iconBox: 'w-20 h-20 text-[40px]', title: 'font-headline-md text-headline-md', desc: 'font-body-lg text-body-lg' },
    };

    const s = sizes[size] ?? sizes.md;

    const defaultIcon = (
        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>inventory_2</span>
    );

    const iconContent = typeof icon === 'string'
        ? <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
        : (icon ?? defaultIcon);

    return (
        <div className={`flex flex-col items-center justify-center text-center ${s.wrap}`}>
            <div className={`${s.iconBox} rounded-2xl bg-primary-fixed/20 flex items-center justify-center text-primary mb-md`}>
                {iconContent}
            </div>
            <h3 className={`${s.title} font-bold text-on-surface mb-xs`}>{title}</h3>
            {description && (
                <p className={`${s.desc} text-on-surface-variant max-w-xs mx-auto mb-md`}>
                    {description}
                </p>
            )}
            {action && <div className="mt-xs">{action}</div>}
        </div>
    );
}

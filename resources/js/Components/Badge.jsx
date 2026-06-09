// Komponen Badge reusable. Desain dari Design Revisi (Vascha & Quinsha).
// Varian: 'brand' (default) | 'amber' | 'success' | 'error' | 'gray' | 'featured' | 'warning'
// Size: 'sm' (default) | 'md' | 'lg'
export default function Badge({ children, variant = 'brand', size = 'sm', className = '' }) {
    const variants = {
        brand:   'bg-primary-fixed/20 text-primary border-transparent',
        featured:'bg-primary text-on-primary border-transparent',
        amber:   'bg-secondary-container text-on-secondary-container border-transparent',
        warning: 'bg-warning/10 text-warning border-transparent',
        success: 'bg-success/10 text-success border-transparent',
        error:   'bg-error-container text-on-error-container border-transparent',
        gray:    'bg-surface-container text-on-surface-variant border-outline-variant',
        // legacy aliases for pages not yet converted
        indigo:  'bg-primary-fixed/20 text-primary border-transparent',
        purple:  'bg-primary-fixed/20 text-primary border-transparent',
        emerald: 'bg-success/10 text-success border-transparent',
        red:     'bg-error-container text-on-error-container border-transparent',
        orange:  'bg-warning/10 text-warning border-transparent',
    };

    const sizes = {
        sm:  'px-2.5 py-0.5 text-[10px]',
        md:  'px-3 py-1 text-xs',
        lg:  'px-4 py-1.5 text-sm',
    };

    return (
        <span
            className={`inline-flex items-center font-bold rounded-full border font-caption ${variants[variant] ?? variants.brand} ${sizes[size] ?? sizes.sm} ${className}`}
        >
            {children}
        </span>
    );
}

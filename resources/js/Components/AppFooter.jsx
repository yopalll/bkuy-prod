import { Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

const socials = [
    { label: 'Instagram', icon: 'photo_camera',    href: '#' },
    { label: 'YouTube',   icon: 'smart_display',   href: '#' },
    { label: 'Twitter',   icon: 'alternate_email', href: '#' },
    { label: 'GitHub',    icon: 'code',             href: '#' },
];

export default function AppFooter() {
    const { t } = useTranslation();

    const footerLinks = {
        [t('footer.sections.courses')]: [
            { label: t('footer.links.catalog'),    href: '/home' },
            { label: t('footer.links.featured'),   href: '/home' },
            { label: t('footer.links.bestseller'), href: '/home' },
        ],
        [t('footer.sections.company')]: [
            { label: t('footer.links.about'),  href: '#' },
            { label: t('footer.links.blog'),   href: '#' },
            { label: t('footer.links.career'), href: '#' },
        ],
        [t('footer.sections.support')]: [
            { label: t('footer.links.help'),           href: '#' },
            { label: t('footer.links.contact'),        href: '#' },
            { label: t('footer.links.privacy_policy'), href: '#' },
        ],
    };

    return (
        <footer className="mt-xxl bg-tertiary border-t border-outline-variant">
            <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop py-xl grid grid-cols-1 md:grid-cols-4 gap-gutter">
                {/* Brand + tagline + socials */}
                <div className="md:col-span-2">
                    <Link href="/home" className="inline-block font-headline-md text-headline-md font-bold text-tertiary-fixed mb-md">
                        Belajar<span className="text-secondary-fixed-dim">KUY</span>
                    </Link>
                    <p className="font-body-md text-body-md text-tertiary-fixed-dim opacity-80 mb-lg max-w-sm leading-relaxed">
                        {t('footer.tagline')}
                    </p>
                    <div className="flex items-center gap-sm">
                        {socials.map(({ label, icon, href }) => (
                            <a
                                key={label}
                                href={href}
                                aria-label={label}
                                className="w-9 h-9 rounded-xl bg-tertiary-container flex items-center justify-center text-tertiary-fixed-dim hover:text-secondary-fixed transition-all"
                            >
                                <span className="material-symbols-outlined text-[18px]">{icon}</span>
                            </a>
                        ))}
                    </div>
                </div>

                {/* Link columns */}
                {Object.entries(footerLinks).map(([group, links]) => (
                    <div key={group}>
                        <h4 className="font-body-lg text-body-lg font-bold text-tertiary-fixed mb-md">
                            {group}
                        </h4>
                        <ul className="space-y-sm">
                            {links.map(({ label, href }) => (
                                <li key={label}>
                                    <Link
                                        href={href}
                                        className="font-body-md text-body-md text-tertiary-fixed-dim opacity-80 hover:text-secondary-fixed hover:opacity-100 transition-colors"
                                    >
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            {/* Bottom bar */}
            <div className="border-t border-on-tertiary-fixed-variant/20 py-md px-margin-mobile md:px-margin-desktop flex flex-col sm:flex-row items-center justify-between gap-sm">
                <span className="font-body-md text-body-md text-tertiary-fixed-dim opacity-60 text-sm">
                    {t('footer.copyright', { year: new Date().getFullYear() })}
                </span>
                <div className="flex items-center gap-md">
                    <a href="#" className="font-body-md text-sm text-tertiary-fixed-dim opacity-60 hover:text-secondary-fixed hover:opacity-100 transition-colors">
                        {t('footer.terms')}
                    </a>
                    <a href="#" className="font-body-md text-sm text-tertiary-fixed-dim opacity-60 hover:text-secondary-fixed hover:opacity-100 transition-colors">
                        {t('footer.privacy')}
                    </a>
                </div>
            </div>
        </footer>
    );
}

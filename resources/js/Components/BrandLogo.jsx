import { usePage } from '@inertiajs/react';

/**
 * BrandLogo — satu-satunya sumber logo BelajarKUY di seluruh app.
 *
 * Props:
 *   dark  — true untuk latar gelap (sidebar, Player navbar): "Belajar" putih + "KUY!" emas solid
 *   size  — 'sm' | 'md' | 'lg' (default: 'md')
 */
export default function BrandLogo({ dark = false, size = 'md', className = '' }) {
    const { siteInfo = {} } = usePage().props;

    const sizeMap = { sm: 'text-lg', md: 'text-xl', lg: 'text-3xl' };
    const imgMap  = { sm: 'h-5',    md: 'h-7',    lg: 'h-10' };
    const sizeClass = sizeMap[size] ?? 'text-xl';
    const imgClass  = imgMap[size]  ?? 'h-7';

    const kuyStyle = dark
        ? { color: '#ffb145' }
        : {
              background: 'linear-gradient(95deg, #5a1a5e 0%, #ffb145 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
          };

    const rocketPart = siteInfo.logo_rocket
        ? <img src={siteInfo.logo_rocket} alt="" className={`${imgClass} w-auto object-contain`} style={{ transform: 'rotate(-12deg)' }} />
        : <span style={{ display: 'inline-block', transform: 'rotate(-12deg)', marginRight: '2px' }}>🚀</span>;

    const textPart = siteInfo.logo_text_image
        ? <img src={siteInfo.logo_text_image} alt={siteInfo.site_name ?? 'BelajarKUY'} className={`${imgClass} w-auto object-contain`} style={{ filter: dark ? 'brightness(0) invert(1)' : undefined }} />
        : (
            <>
                <span style={{ color: dark ? '#ffffff' : '#300033' }}>Belajar</span>
                <span style={kuyStyle}>KUY!</span>
            </>
        );

    return (
        <span className={`inline-flex items-center gap-0.5 font-extrabold select-none leading-none ${sizeClass} ${className}`}>
            {rocketPart}
            {textPart}
        </span>
    );
}

/**
 * BrandLogo — satu-satunya sumber logo BelajarKUY di seluruh app.
 *
 * Props:
 *   dark  — true untuk latar gelap (sidebar, Player navbar): "Belajar" putih + "KUY!" emas solid
 *   size  — 'sm' | 'md' | 'lg' (default: 'md')
 */
export default function BrandLogo({ dark = false, size = 'md', className = '' }) {
    const sizeClass = { sm: 'text-lg', md: 'text-xl', lg: 'text-3xl' }[size] ?? 'text-xl';

    const kuyStyle = dark
        ? { color: '#ffb145' }
        : {
              background: 'linear-gradient(95deg, #5a1a5e 0%, #ffb145 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
          };

    return (
        <span
            className={`inline-flex items-center gap-0.5 font-extrabold select-none leading-none ${sizeClass} ${className}`}
        >
            <span style={{ display: 'inline-block', transform: 'rotate(-12deg)', marginRight: '2px' }}>🚀</span>
            <span style={{ color: dark ? '#ffffff' : '#300033' }}>Belajar</span>
            <span style={kuyStyle}>KUY!</span>
        </span>
    );
}

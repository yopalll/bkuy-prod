import { useState, useRef, forwardRef } from 'react';
import { Head, Link } from '@inertiajs/react';
import { QRCodeSVG } from 'qrcode.react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function Certificate({ certificate, verify_url }) {
    const cardRef   = useRef(null);
    const [loading, setLoading] = useState(false);

    const handleDownload = async () => {
        if (!cardRef.current || loading) return;
        setLoading(true);

        try {
            // Tunggu semua font (termasuk Material Symbols) selesai load
            await document.fonts.ready;

            const el = cardRef.current;

            // Simpan style asli
            const origBorderRadius = el.style.borderRadius;
            const origBoxShadow    = el.style.boxShadow;

            // Sementara hilangkan efek yang bisa merusak capture
            el.style.borderRadius = '0';
            el.style.boxShadow    = 'none';

            const canvas = await html2canvas(el, {
                scale: 2.5,           // resolusi tinggi
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#ffffff',
                logging: false,
                imageTimeout: 15000,
                onclone: (doc) => {
                    // Pastikan glow tidak ikut di-render
                    doc.querySelectorAll('.cert-seal-glow').forEach(n => {
                        n.style.display = 'none';
                    });
                },
            });

            // Kembalikan style
            el.style.borderRadius = origBorderRadius;
            el.style.boxShadow    = origBoxShadow;

            // Hitung dimensi agar pas di A4 landscape (297 × 210 mm)
            const a4w = 297;
            const a4h = 210;
            const imgAspect = canvas.width / canvas.height;
            const a4Aspect  = a4w / a4h;

            let drawW, drawH, offsetX = 0, offsetY = 0;
            if (imgAspect > a4Aspect) {
                drawW   = a4w;
                drawH   = a4w / imgAspect;
                offsetY = (a4h - drawH) / 2;
            } else {
                drawH   = a4h;
                drawW   = a4h * imgAspect;
                offsetX = (a4w - drawW) / 2;
            }

            const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
            pdf.addImage(canvas.toDataURL('image/png'), 'PNG', offsetX, offsetY, drawW, drawH);

            // Nama file: NamaUser_IDSertifikat_BELAJARKUY!.pdf
            const safeName = (certificate.student_name ?? 'Sertifikat').replace(/\s+/g, '_');
            const safeCode = (certificate.code ?? 'CERT').toUpperCase();
            pdf.save(`${safeName}_${safeCode}_BELAJARKUY!.pdf`);
        } catch (err) {
            console.error('Gagal generate PDF:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Head title={`Sertifikat — ${certificate.course_title} | BelajarKUY`} />

            {/* Toolbar */}
            <div className="bg-surface border-b border-outline-variant py-md px-margin-desktop flex items-center justify-between sticky top-0 z-10 shadow-sm">
                <Link href="/student/my-courses"
                    className="flex items-center gap-sm text-on-surface-variant hover:text-primary transition-colors font-label-md text-label-md">
                    <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                    Kembali ke Kursus Saya
                </Link>

                <div className="flex items-center gap-sm">
                    <a href={verify_url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-xs px-md py-2 rounded-lg border border-outline-variant text-on-surface-variant hover:text-primary hover:border-primary transition-colors font-label-md text-label-md">
                        <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                        Verifikasi
                    </a>

                    <button
                        onClick={handleDownload}
                        disabled={loading}
                        className="flex items-center gap-xs px-xl py-2.5 rounded-lg font-label-md text-label-md transition-all active:scale-95 disabled:opacity-70 disabled:cursor-wait"
                        style={{ background: loading ? '#8a6a00' : 'linear-gradient(135deg, #b07000 0%, #ffb145 50%, #c07a00 100%)', color: '#1a0022' }}
                    >
                        {loading ? (
                            <>
                                <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                                Menyiapkan PDF…
                            </>
                        ) : (
                            <>
                                <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>download</span>
                                Download Sertifikat
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Preview area */}
            <div className="min-h-screen flex flex-col items-center justify-center py-12 px-8 gap-lg"
                style={{ background: 'linear-gradient(135deg, #0f0018 0%, #1a0022 50%, #2d1040 100%)' }}>

                <CertificateCard ref={cardRef} certificate={certificate} verify_url={verify_url} />

                {/* Hint di bawah */}
                <p className="text-sm font-medium" style={{ color: 'rgba(255,177,69,0.5)' }}>
                    Klik <strong style={{ color: '#ffb145' }}>Download Sertifikat</strong> untuk menyimpan sebagai PDF
                </p>
            </div>
        </>
    );
}

/* ─────────────────────────────────────────────
   CertificateCard — menggunakan forwardRef agar
   parent bisa capture DOM-nya via html2canvas
───────────────────────────────────────────── */
const CertificateCard = forwardRef(function CertificateCard({ certificate, verify_url }, ref) {
    const code = certificate.code ? certificate.code.toUpperCase() : '—';

    return (
        <div
            ref={ref}
            style={{
                position: 'relative',
                width: '960px',
                height: '640px',
                background: '#ffffff',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '10px',
                boxShadow: '0 40px 120px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,177,69,0.3)',
            }}
        >
            {/* ══ BAND ATAS ══ */}
            <div style={{ height: '12px', flexShrink: 0, background: 'linear-gradient(90deg, #1a0022 0%, #300033 25%, #5a1a5e 55%, #c07a00 80%, #ffb145 100%)' }} />

            {/* ══ BADAN UTAMA ══ */}
            <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>

                {/* KOLOM KIRI */}
                <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '36px 44px 28px 52px', overflow: 'hidden' }}>

                    {/* Dot pattern BG */}
                    <svg style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
                        <defs>
                            <pattern id="cdots" x="0" y="0" width="22" height="22" patternUnits="userSpaceOnUse">
                                <circle cx="2" cy="2" r="1.2" fill="#5a1a5e" opacity="0.038" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#cdots)" />
                    </svg>

                    {/* KUY! watermark */}
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
                        <span style={{ fontSize: '185px', fontWeight: 900, color: 'rgba(90,26,94,0.052)', transform: 'rotate(-8deg)', lineHeight: 1, userSelect: 'none', whiteSpace: 'nowrap', letterSpacing: '-3px' }}>
                            KUY!
                        </span>
                    </div>

                    {/* HEADER */}
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        {/* Logo */}
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', fontWeight: 800, fontSize: '22px', lineHeight: 1, marginBottom: '16px' }}>
                            <span style={{ display: 'inline-block', transform: 'rotate(-12deg)', marginRight: '2px', fontSize: '19px' }}>🚀</span>
                            <span style={{ color: '#1a0022' }}>Belajar</span>
                            <span style={{ color: '#b07000' }}>KUY!</span>
                        </div>

                        {/* Label sertifikat */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                            <div style={{ height: '1px', width: '28px', background: 'rgba(48,0,51,0.18)' }} />
                            <span style={{ fontSize: '8.5px', fontWeight: 700, letterSpacing: '3.5px', textTransform: 'uppercase', color: '#5a1a5e', padding: '4px 14px', border: '1px solid rgba(90,26,94,0.22)', borderRadius: '999px', background: 'rgba(90,26,94,0.04)', whiteSpace: 'nowrap' }}>
                                Sertifikat Penyelesaian
                            </span>
                            <div style={{ height: '1px', flex: 1, background: 'linear-gradient(90deg, rgba(90,26,94,0.15), transparent)' }} />
                        </div>

                        <p style={{ fontSize: '13px', color: '#9e91a6', margin: 0 }}>Dengan bangga diberikan kepada</p>
                    </div>

                    {/* NAMA MAHASISWA */}
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <h1 style={{ fontSize: '50px', fontWeight: 800, color: '#1a0022', lineHeight: 1.1, margin: '0 0 10px 0' }}>
                            {certificate.student_name}
                        </h1>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ width: '56px', height: '3px', background: 'linear-gradient(90deg, #1a0022, #ffb145)', borderRadius: '2px' }} />
                            <span style={{ color: '#ffb145', fontSize: '12px', lineHeight: 1 }}>✦</span>
                            <span style={{ color: '#ffb145', fontSize: '8px', opacity: 0.5, lineHeight: 1 }}>✦</span>
                        </div>
                    </div>

                    {/* KURSUS */}
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <p style={{ fontSize: '12px', color: '#9e91a6', margin: '0 0 5px 0' }}>telah berhasil menyelesaikan kursus</p>
                        <h2 style={{ fontSize: '21px', fontWeight: 700, color: '#1a0022', lineHeight: 1.35, margin: 0 }}>
                            {certificate.course_title}
                        </h2>
                        {certificate.category && (
                            <span style={{ display: 'inline-block', marginTop: '7px', padding: '3px 12px', borderRadius: '5px', fontSize: '11px', fontWeight: 600, background: 'rgba(255,177,69,0.13)', color: '#996000', border: '1px solid rgba(255,177,69,0.32)' }}>
                                {certificate.category}
                            </span>
                        )}
                    </div>

                    {/* FOOTER: tanggal + ID */}
                    <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid rgba(26,0,34,0.08)', paddingTop: '12px' }}>
                        <div>
                            <p style={{ fontSize: '9px', color: '#c0b8cc', margin: '0 0 3px 0', textTransform: 'uppercase', letterSpacing: '1.2px' }}>Tanggal Diterbitkan</p>
                            <p style={{ fontSize: '14px', fontWeight: 600, color: '#1a0022', margin: 0 }}>{certificate.issued_at}</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <p style={{ fontSize: '9px', color: '#c0b8cc', margin: '0 0 3px 0', textTransform: 'uppercase', letterSpacing: '1.2px' }}>ID Sertifikat</p>
                            <p style={{ fontSize: '11px', fontFamily: 'monospace', fontWeight: 700, letterSpacing: '1.5px', color: '#5a1a5e', margin: 0 }}>{code}</p>
                        </div>
                    </div>
                </div>

                {/* KOLOM KANAN */}
                <div style={{ width: '230px', flexShrink: 0, background: '#f8f4f0', borderLeft: '1px solid rgba(192,122,0,0.22)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', padding: '36px 24px 28px' }}>

                    {/* Seal */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                        <div style={{ position: 'relative' }}>
                            {/* Glow — hanya layar */}
                            <div className="cert-seal-glow" style={{ position: 'absolute', inset: '-8px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,177,69,0.28) 0%, transparent 65%)', zIndex: 0 }} />

                            {/* Lingkaran seal */}
                            <div style={{ position: 'relative', zIndex: 1, width: '108px', height: '108px', borderRadius: '50%', background: 'linear-gradient(145deg, #1a0022 0%, #300033 45%, #5a1a5e 100%)', border: '3px solid #c07a00', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <span className="material-symbols-outlined" style={{ fontSize: '50px', color: '#ffb145', fontVariationSettings: "'FILL' 1" }}>
                                    workspace_premium
                                </span>
                            </div>
                            <span style={{ position: 'absolute', top: '-4px', right: '10px', color: '#ffb145', fontSize: '13px', lineHeight: 1, zIndex: 2 }}>✦</span>
                            <span style={{ position: 'absolute', bottom: '6px', left: '-1px', color: '#ffb145', fontSize: '9px', opacity: 0.7, lineHeight: 1, zIndex: 2 }}>✦</span>
                            <span style={{ position: 'absolute', top: '14px', left: '-6px', color: '#c07a00', fontSize: '8px', opacity: 0.55, lineHeight: 1, zIndex: 2 }}>★</span>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <p style={{ fontSize: '8.5px', fontWeight: 800, letterSpacing: '2.5px', textTransform: 'uppercase', color: '#1a0022', margin: 0 }}>Tersertifikasi</p>
                            <p style={{ fontSize: '10px', color: '#a89eb8', margin: '3px 0 0 0' }}>BelajarKUY Platform</p>
                        </div>
                    </div>

                    {/* Instruktur */}
                    <div style={{ textAlign: 'center', width: '100%' }}>
                        <div style={{ height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '8px' }}>
                            <div style={{ width: '80px', height: '1px', background: 'linear-gradient(90deg, transparent, rgba(192,122,0,0.35), transparent)' }} />
                        </div>
                        <p style={{ fontSize: '13px', fontWeight: 700, color: '#1a0022', margin: 0 }}>{certificate.instructor_name}</p>
                        <p style={{ fontSize: '10px', color: '#a89eb8', margin: '3px 0 0 0' }}>Instruktur</p>
                    </div>

                    {/* QR Code */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '7px' }}>
                        <p style={{ fontSize: '7.5px', color: '#c0b8cc', margin: 0, letterSpacing: '1.8px', textTransform: 'uppercase' }}>Scan untuk verifikasi</p>
                        <div style={{ padding: '8px', background: '#ffffff', borderRadius: '8px', border: '1.5px solid rgba(26,0,34,0.1)' }}>
                            <QRCodeSVG value={verify_url} size={72} fgColor="#1a0022" bgColor="#ffffff" level="M" />
                        </div>
                        <p style={{ fontSize: '7px', fontFamily: 'monospace', fontWeight: 600, color: '#5a1a5e', textAlign: 'center', margin: 0, letterSpacing: '0.3px', maxWidth: '112px', wordBreak: 'break-all', lineHeight: 1.5 }}>
                            {code}
                        </p>
                    </div>
                </div>
            </div>

            {/* ══ BAND BAWAH ══ */}
            <div style={{ height: '6px', flexShrink: 0, background: 'linear-gradient(90deg, #ffb145 0%, #c07a00 20%, #5a1a5e 55%, #300033 80%, #1a0022 100%)' }} />

            {/* Bingkai dalam tipis */}
            <div style={{ position: 'absolute', inset: '18px', border: '1px solid rgba(192,122,0,0.16)', borderRadius: '4px', pointerEvents: 'none', zIndex: 2 }} />

            {/* Diamond sudut */}
            {[
                { top: '12px',    left: '12px'   },
                { top: '12px',    right: '12px'  },
                { bottom: '12px', left: '12px'   },
                { bottom: '12px', right: '12px'  },
            ].map((pos, i) => (
                <div key={i} style={{ position: 'absolute', ...pos, width: '9px', height: '9px', background: '#c07a00', transform: 'rotate(45deg)', opacity: 0.9, zIndex: 3 }} />
            ))}
        </div>
    );
});

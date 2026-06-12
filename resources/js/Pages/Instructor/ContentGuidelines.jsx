import { Head, Link } from '@inertiajs/react';
import InstructorLayout from '@/Layouts/InstructorLayout';

const SECTIONS = [
    {
        id: 'pendahuluan', icon: 'flag', title: '1. Pendahuluan',
        body: [
            'Ketentuan Konten ini adalah standar resmi yang mengatur seluruh materi yang dipublikasikan di platform BelajarKUY. Tujuannya sederhana: memastikan setiap pelajar mendapatkan pengalaman belajar yang bermutu, aman, dan dapat dipercaya.',
            'Dengan mengajukan kursus untuk ditinjau, Anda sebagai instruktur menyatakan telah membaca, memahami, dan menyetujui seluruh ketentuan di halaman ini. Tim moderasi BelajarKUY berhak menolak, menonaktifkan, atau meminta perbaikan atas kursus yang tidak memenuhi standar.',
        ],
    },
    {
        id: 'standar-kualitas', icon: 'workspace_premium', title: '2. Standar Kualitas Materi',
        intro: 'Kursus yang baik bukan sekadar kumpulan video. Ia harus terstruktur, jelas, dan memberi hasil belajar yang nyata.',
        list: [
            'Tujuan pembelajaran jelas. Setiap kursus wajib mencantumkan minimal 3 poin "Yang Akan Dipelajari" yang spesifik dan terukur.',
            'Struktur logis. Materi disusun bertahap dari dasar ke lanjutan, dikelompokkan dalam seksi/bab yang masuk akal.',
            'Durasi proporsional. Setiap video materi idealnya 3–15 menit. Pecah topik panjang menjadi beberapa materi agar mudah dicerna.',
            'Akurasi. Informasi yang disampaikan harus benar, mutakhir, dan dapat dipertanggungjawabkan. Sertakan sumber bila membahas data atau statistik.',
            'Bahasa yang baik. Gunakan bahasa Indonesia (atau bahasa pengantar lain yang konsisten) yang sopan, jelas, dan minim kesalahan ejaan.',
        ],
    },
    {
        id: 'standar-produksi', icon: 'videocam', title: '3. Standar Produksi Video & Audio',
        intro: 'Kualitas teknis sama pentingnya dengan isi. Pelajar membayar untuk pengalaman yang nyaman.',
        list: [
            'Resolusi video minimal 720p (HD). Disarankan 1080p (Full HD) untuk materi yang menampilkan teks atau kode.',
            'Audio jernih, tanpa noise mengganggu, gema berlebih, atau volume yang naik-turun drastis. Gunakan mikrofon eksternal bila memungkinkan.',
            'Pencahayaan cukup dan stabil. Wajah/objek utama terlihat jelas, tidak gelap atau over-exposed.',
            'Layar yang direkam (screen recording) harus terbaca — perbesar teks/kode bila perlu, hindari resolusi layar terlalu tinggi yang membuat tulisan kecil.',
            'Format file yang didukung: MP4, WebM, MOV. Ukuran per file maksimal 500 MB.',
            'Untuk materi YouTube, pastikan video bersifat publik atau unlisted dan tidak akan dihapus selama kursus aktif.',
        ],
    },
    {
        id: 'hak-cipta', icon: 'copyright', title: '4. Hak Kekayaan Intelektual',
        intro: 'Hormati karya orang lain — dan lindungi karya Anda sendiri.',
        list: [
            'Seluruh materi harus original atau Anda memiliki lisensi/izin yang sah untuk menggunakannya.',
            'Dilarang mengunggah ulang konten milik instruktur, platform, atau penerbit lain tanpa izin tertulis.',
            'Musik, gambar, font, dan aset pihak ketiga wajib berlisensi bebas royalti atau Anda memiliki hak pakainya.',
            'Cantumkan atribusi bila lisensi mengharuskannya.',
            'Pelanggaran hak cipta dapat berakibat penonaktifan kursus secara permanen dan penangguhan akun.',
        ],
    },
    {
        id: 'konten-dilarang', icon: 'block', title: '5. Konten yang Dilarang',
        intro: 'Materi berikut tidak akan pernah disetujui dan dapat berakibat penangguhan akun:',
        list: [
            'Konten mengandung unsur SARA, ujaran kebencian, atau diskriminasi.',
            'Pornografi, kekerasan eksplisit, atau konten yang tidak pantas untuk umum.',
            'Materi yang mempromosikan aktivitas ilegal, penipuan, judi, atau penyalahgunaan zat terlarang.',
            'Disinformasi, klaim medis/finansial yang menyesatkan, atau janji hasil yang tidak realistis.',
            'Spam, materi promosi/iklan terselubung, atau ajakan bertransaksi di luar platform BelajarKUY.',
            'Konten yang membahayakan keselamatan, melanggar privasi, atau membocorkan data pribadi pihak lain.',
            'Malware, teknik peretasan untuk tujuan merugikan, atau materi yang melanggar hukum Indonesia.',
        ],
    },
    {
        id: 'kelengkapan', icon: 'fact_check', title: '6. Kelengkapan Sebelum Diajukan',
        intro: 'Pastikan checklist berikut terpenuhi sebelum menekan tombol "Kirim Review":',
        list: [
            'Judul kursus deskriptif dan tidak menyesatkan (clickbait dilarang).',
            'Deskripsi kursus lengkap menjelaskan untuk siapa, isi, dan manfaatnya.',
            'Thumbnail menarik, relevan, dan bebas teks berlebihan atau gambar menyesatkan.',
            'Minimal satu seksi berisi materi yang dapat diputar/dibaca.',
            'Harga wajar dan sesuai dengan nilai yang ditawarkan.',
            'Seluruh video sudah ter-upload sempurna dan dapat diputar tanpa error.',
        ],
    },
    {
        id: 'proses-review', icon: 'rule', title: '7. Proses Peninjauan',
        body: [
            'Setelah diajukan, kursus berstatus "Menunggu Review". Tim admin akan memeriksa kelengkapan, kualitas, dan kepatuhan terhadap ketentuan ini — termasuk menonton video dan membaca materi teks Anda.',
            'Jika disetujui, kursus langsung dipublikasikan dan Anda menerima notifikasi. Jika ditolak, Anda akan menerima notifikasi dan email berisi alasan penolakan beserta saran perbaikan yang konkret.',
            'Kursus yang ditolak dapat Anda perbaiki lalu diajukan ulang lewat tombol "Ajukan Ulang" pada daftar kursus. Tidak ada batas jumlah pengajuan ulang selama materi terus diperbaiki sesuai masukan.',
        ],
    },
    {
        id: 'sanksi', icon: 'gavel', title: '8. Pelanggaran & Sanksi',
        intro: 'BelajarKUY menerapkan kebijakan bertingkat terhadap pelanggaran:',
        list: [
            'Pelanggaran ringan: permintaan perbaikan dan kursus dikembalikan ke status revisi.',
            'Pelanggaran berulang: penonaktifan kursus dan peringatan resmi ke akun instruktur.',
            'Pelanggaran berat (hak cipta, konten ilegal, penipuan): penonaktifan permanen kursus dan penangguhan/penghapusan akun tanpa pemberitahuan sebelumnya.',
            'Keputusan tim moderasi bersifat final, namun Anda dapat mengajukan klarifikasi melalui Pusat Bantuan.',
        ],
    },
];

function GuidelineCard({ section }) {
    return (
        <section id={section.id} className="bg-surface rounded-2xl p-lg border border-primary/10 scroll-mt-24"
            style={{ boxShadow: '0 4px 20px rgba(48,0,51,0.05)' }}>
            <h2 className="font-headline-md text-headline-md text-on-background flex items-center gap-sm mb-md">
                <span className="material-symbols-outlined text-[22px] text-primary">{section.icon}</span>
                {section.title}
            </h2>
            {section.intro && (
                <p className="font-body-md text-body-md text-on-surface-variant mb-md leading-relaxed">{section.intro}</p>
            )}
            {section.body?.map((p, i) => (
                <p key={i} className="font-body-md text-body-md text-on-surface-variant mb-sm leading-relaxed last:mb-0">{p}</p>
            ))}
            {section.list && (
                <ul className="space-y-sm">
                    {section.list.map((item, i) => (
                        <li key={i} className="flex items-start gap-sm">
                            <span className="material-symbols-outlined text-[18px] text-primary mt-0.5 shrink-0">arrow_right</span>
                            <span className="font-body-md text-body-md text-on-surface-variant leading-relaxed">{item}</span>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}

export default function ContentGuidelines() {
    return (
        <InstructorLayout>
            <Head title="Ketentuan Konten — BelajarKUY Instruktur" />

            <div className="bg-surface px-margin-mobile md:px-margin-desktop py-lg border-b border-surface-variant">
                <div className="max-w-5xl mx-auto">
                    <Link href={route('instructor.courses.index')} className="inline-flex items-center gap-sm text-on-surface-variant hover:text-primary font-label-md text-label-md transition-colors mb-md">
                        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                        Kembali ke Kursus Saya
                    </Link>
                    <p className="font-caption text-caption text-on-surface-variant uppercase tracking-widest mb-xs">Panduan Instruktur</p>
                    <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-background flex items-center gap-sm">
                        <span className="material-symbols-outlined text-primary text-[30px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                        Ketentuan Konten
                    </h1>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-xs max-w-2xl">
                        Standar kualitas dan aturan yang wajib dipenuhi setiap kursus sebelum dipublikasikan di BelajarKUY.
                        Mematuhi ketentuan ini mempercepat proses persetujuan kursus Anda.
                    </p>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-margin-mobile md:px-margin-desktop py-lg grid grid-cols-1 lg:grid-cols-4 gap-lg">
                <aside className="hidden lg:block lg:col-span-1">
                    <div className="sticky top-lg bg-surface rounded-2xl p-md border border-primary/10">
                        <p className="font-label-md text-label-md text-on-surface font-bold mb-sm px-sm">Daftar Isi</p>
                        <nav className="space-y-0.5">
                            {SECTIONS.map(s => (
                                <a key={s.id} href={`#${s.id}`}
                                    className="block px-sm py-1.5 rounded-lg font-caption text-caption text-on-surface-variant hover:text-primary hover:bg-primary/5 transition-colors">
                                    {s.title}
                                </a>
                            ))}
                        </nav>
                    </div>
                </aside>

                <div className="lg:col-span-3 space-y-lg">
                    {SECTIONS.map(section => (
                        <GuidelineCard key={section.id} section={section} />
                    ))}
                    <div className="bg-primary/5 rounded-2xl p-lg border border-primary/20 text-center">
                        <span className="material-symbols-outlined text-primary text-[32px]">support_agent</span>
                        <h3 className="font-headline-md text-headline-md text-on-background mt-sm">Masih ada pertanyaan?</h3>
                        <p className="font-body-md text-body-md text-on-surface-variant mt-xs mb-md max-w-xl mx-auto">
                            Jika ragu apakah materi Anda memenuhi ketentuan, hubungi tim BelajarKUY melalui Pusat Bantuan sebelum mengajukan kursus.
                        </p>
                        <Link href="/bantuan"
                            className="inline-flex items-center gap-sm font-label-md text-label-md bg-primary text-on-primary px-lg py-sm rounded-lg hover:bg-primary-container transition-colors active:scale-95">
                            <span className="material-symbols-outlined text-[18px]">help</span>
                            Buka Pusat Bantuan
                        </Link>
                    </div>
                </div>
            </div>
        </InstructorLayout>
    );
}

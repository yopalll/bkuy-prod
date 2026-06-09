import AppLayout from '@/Layouts/AppLayout';
import { Head } from '@inertiajs/react';

const SECTIONS = [
    {
        icon: 'gavel',
        title: '1. Penerimaan Syarat',
        text: 'Dengan mendaftar dan menggunakan BelajarKUY, Anda menyetujui Syarat dan Ketentuan ini secara penuh. Jika Anda tidak menyetujuinya, harap tidak menggunakan layanan kami. Kami berhak memperbarui syarat ini sewaktu-waktu dengan pemberitahuan terlebih dahulu.',
    },
    {
        icon: 'manage_accounts',
        title: '2. Akun Pengguna',
        text: 'Anda bertanggung jawab atas keamanan akun dan aktivitas yang terjadi di dalamnya. Dilarang membagikan kredensial akun kepada pihak lain. Kami berhak menangguhkan atau menghapus akun yang melanggar kebijakan ini. Satu alamat email hanya dapat digunakan untuk satu akun.',
    },
    {
        icon: 'school',
        title: '3. Hak Akses Kursus',
        text: 'Pembelian kursus memberikan lisensi pribadi, non-eksklusif, dan tidak dapat dipindahtangankan. Anda tidak diizinkan merekam ulang, mendistribusikan, atau menjual kembali konten kursus dalam bentuk apa pun. Akses kursus berlaku seumur hidup kecuali terjadi pelanggaran kebijakan.',
    },
    {
        icon: 'payments',
        title: '4. Pembayaran dan Pengembalian Dana',
        text: 'Semua transaksi diproses melalui Midtrans dalam mata uang Rupiah (IDR). Harga belum termasuk pajak yang berlaku. Pengembalian dana dapat diajukan dalam 7 hari setelah pembelian jika kurang dari 30% materi telah diselesaikan. Kupon diskon tidak dapat dikombinasikan dan tidak berlaku untuk kursus yang sudah dalam keranjang.',
    },
    {
        icon: 'copyright',
        title: '5. Hak Kekayaan Intelektual',
        text: 'Seluruh konten di BelajarKUY — termasuk teks, video, grafis, dan kode — dilindungi hak cipta. Konten kursus adalah milik instruktur yang membuatnya, dilindungi oleh hukum hak cipta Indonesia. BelajarKUY memiliki lisensi untuk menampilkan konten tersebut di platform. Anda tidak diizinkan menyalin atau mendistribusikan konten tanpa izin tertulis.',
    },
    {
        icon: 'group',
        title: '6. Kode Etik Komunitas',
        text: 'Pengguna wajib bersikap hormat dalam ulasan, diskusi, dan interaksi di platform. Dilarang mengunggah konten yang mengandung ujaran kebencian, diskriminasi, pornografi, atau kekerasan. Dilarang melakukan spam, phishing, atau aktivitas berbahaya lainnya. Pelanggaran dapat mengakibatkan penghapusan konten atau penangguhan akun.',
    },
    {
        icon: 'person_check',
        title: '7. Instruktur',
        text: 'Instruktur bertanggung jawab atas keakuratan dan kualitas konten kursus mereka. Instruktur menjamin bahwa konten yang diunggah adalah asli dan tidak melanggar hak cipta pihak ketiga. BelajarKUY berhak meninjau dan menolak atau menghapus konten yang tidak memenuhi standar kualitas.',
    },
    {
        icon: 'block',
        title: '8. Pembatasan Tanggung Jawab',
        text: 'BelajarKUY menyediakan platform "sebagaimana adanya" tanpa jaminan ketersediaan 100%. Kami tidak bertanggung jawab atas kerugian tidak langsung akibat penggunaan layanan. Total tanggung jawab kami terbatas pada jumlah yang telah Anda bayarkan dalam 12 bulan terakhir.',
    },
    {
        icon: 'public',
        title: '9. Hukum yang Berlaku',
        text: 'Syarat ini diatur oleh hukum Republik Indonesia. Sengketa yang tidak dapat diselesaikan secara musyawarah akan diselesaikan melalui Pengadilan Negeri setempat.',
    },
    {
        icon: 'contact_support',
        title: '10. Hubungi Kami',
        text: 'Untuk pertanyaan mengenai Syarat dan Ketentuan ini, silakan hubungi tim kami melalui halaman Hubungi Kami atau kirim email ke legal@belajarkuy.id.',
    },
];

export default function Terms() {
    return (
        <AppLayout>
            <Head title="Syarat & Ketentuan — BelajarKUY" />

            {/* Hero */}
            <section className="bg-primary text-on-primary py-14 px-margin-mobile md:px-margin-desktop">
                <div className="max-w-3xl mx-auto text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 mb-5">
                        <span className="material-symbols-outlined text-[32px]">gavel</span>
                    </div>
                    <h1 className="font-headline-lg text-headline-lg font-bold mb-3">Syarat &amp; Ketentuan</h1>
                    <p className="font-body-lg text-body-lg opacity-80">Terakhir diperbarui: Juni 2026</p>
                </div>
            </section>

            <div className="max-w-3xl mx-auto px-margin-mobile md:px-margin-desktop py-xl">
                <div className="bg-warning/10 border border-warning/20 rounded-2xl p-4 mb-xl flex gap-3">
                    <span className="material-symbols-outlined text-warning text-[20px] shrink-0 mt-0.5">warning</span>
                    <p className="text-sm text-on-surface">
                        Harap baca syarat dan ketentuan ini dengan seksama sebelum menggunakan layanan BelajarKUY. Penggunaan layanan berarti Anda telah membaca, memahami, dan menyetujui syarat-syarat di bawah ini.
                    </p>
                </div>

                <div className="space-y-xl">
                    {SECTIONS.map(({ icon, title, text }) => (
                        <section key={title}>
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-9 h-9 rounded-xl bg-primary-fixed/30 flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined text-primary text-[18px]">{icon}</span>
                                </div>
                                <h2 className="font-title-lg text-title-lg font-bold text-on-surface">{title}</h2>
                            </div>
                            <p className="pl-12 text-sm text-on-surface-variant leading-relaxed">{text}</p>
                        </section>
                    ))}
                </div>

                <div className="mt-xl p-6 bg-surface border border-outline-variant rounded-3xl text-center">
                    <p className="text-sm text-on-surface-variant">
                        Dengan menggunakan BelajarKUY, Anda menyatakan telah membaca dan menyetujui seluruh syarat di atas. Terima kasih telah mempercayakan perjalanan belajar Anda kepada kami.
                    </p>
                </div>
            </div>
        </AppLayout>
    );
}

<?php

namespace Database\Seeders;

use App\Models\InfoBox;
use App\Models\Partner;
use App\Models\SiteInfo;
use App\Models\Slider;
use Illuminate\Database\Seeder;

class CmsSeeder extends Seeder
{
    /**
     * Seed CMS content: sliders, info boxes, partners, site info.
     */
    public function run(): void
    {
        // --- Sliders ---
        $sliders = [
            [
                'title' => 'Belajar Skill Baru di BelajarKUY',
                'sub_title' => 'Ribuan kursus online dari instruktur terbaik Indonesia.',
                'link' => '/courses',
                'image_url' => 'https://placehold.co/1280x500/4F46E5/ffffff?text=BelajarKUY',
                'image_public_id' => 'sliders/slide-1',
            ],
            [
                'title' => 'Diskon Hingga 50% untuk Pelajar',
                'sub_title' => 'Manfaatkan promo spesial untuk mendapat materi premium.',
                'link' => '/courses?promo=1',
                'image_url' => 'https://placehold.co/1280x500/7C3AED/ffffff?text=Promo+50%25',
                'image_public_id' => 'sliders/slide-2',
            ],
            [
                'title' => 'Jadi Instruktur di BelajarKUY',
                'sub_title' => 'Bagikan ilmu-mu dan dapatkan penghasilan tambahan.',
                'link' => '/register?role=instructor',
                'image_url' => 'https://placehold.co/1280x500/059669/ffffff?text=Daftar+Instruktur',
                'image_public_id' => 'sliders/slide-3',
            ],
        ];

        foreach ($sliders as $i => $slider) {
            Slider::create(array_merge($slider, [
                'status' => true,
                'order_position' => $i + 1,
            ]));
        }

        // --- Info Boxes ---
        $infoBoxes = [
            ['title' => 'Instruktur Berpengalaman', 'description' => 'Belajar dari praktisi industri.', 'icon' => 'users'],
            ['title' => 'Materi Lengkap', 'description' => 'Video, dokumen, dan project nyata.', 'icon' => 'book-open'],
            ['title' => 'Sertifikat Resmi', 'description' => 'Dapat sertifikat setelah menyelesaikan kursus.', 'icon' => 'award'],
            ['title' => 'Akses Seumur Hidup', 'description' => 'Belajar kapan saja, di mana saja.', 'icon' => 'clock'],
        ];

        foreach ($infoBoxes as $i => $box) {
            InfoBox::create(array_merge($box, ['order_position' => $i + 1]));
        }

        // --- Partners ---
        $partners = [
            'Traveloka', 'Tokopedia', 'Gojek', 'Shopee', 'Blibli', 'Bukalapak', 'BCA Digital',
        ];

        foreach ($partners as $i => $name) {
            Partner::create([
                'name' => $name,
                'link' => null,
                'logo_url' => 'https://placehold.co/200x80/e2e8f0/1e293b?text='.urlencode($name),
                'logo_public_id' => 'partners/'.strtolower(str_replace(' ', '-', $name)),
                'order_position' => $i + 1,
            ]);
        }

        // --- Site Info (key-value config) ---
        $siteInfo = [
            'site_name' => 'BelajarKUY',
            'site_tagline' => 'Belajar Online Kapan Saja',
            'site_email' => 'halo@belajarkuy.id',
            'site_phone' => '+62 811 0000 0001',
            'site_address' => 'Jakarta Selatan, Indonesia',
            'facebook_url' => 'https://facebook.com/belajarkuy',
            'instagram_url' => 'https://instagram.com/belajarkuy',
            'twitter_url' => 'https://twitter.com/belajarkuy',
            'youtube_url' => 'https://youtube.com/@belajarkuy',
            'footer_description' => 'BelajarKUY adalah platform e-learning terkemuka di Indonesia.',
        ];

        foreach ($siteInfo as $key => $value) {
            SiteInfo::updateOrCreate(['key' => $key], ['value' => $value]);
        }
    }
}

<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteInfo;
use App\Http\Requests\Admin\UpdateSiteSettingRequest;
use App\Services\CloudinaryService;
use Inertia\Inertia;

class AdminSiteSettingController extends Controller
{
    protected $cloudinaryService;

    public function __construct(CloudinaryService $cloudinaryService)
    {
        $this->cloudinaryService = $cloudinaryService;
    }

    public function index()
    {
        $settings = SiteInfo::pluck('value', 'key')->toArray();
        return Inertia::render('Admin/Settings/Index', compact('settings'));
    }

    public function update(UpdateSiteSettingRequest $request)
    {
        $data = $request->validated();

        // File fields yang di-upload ke Cloudinary
        foreach (['logo', 'logo_rocket', 'logo_text_image', 'favicon'] as $field) {
            if ($request->hasFile($field)) {
                $oldPublicId = SiteInfo::get("{$field}_public_id");
                if ($oldPublicId) {
                    $this->cloudinaryService->delete($oldPublicId);
                }

                $uploadResult = $this->cloudinaryService->upload($request->file($field), 'settings');

                if (!$uploadResult) {
                    return redirect()->back()->with('error', "Gagal mengunggah {$field}.")->withInput();
                }

                SiteInfo::updateOrCreate(['key' => $field], ['value' => $uploadResult['url']]);
                SiteInfo::updateOrCreate(['key' => "{$field}_public_id"], ['value' => $uploadResult['public_id']]);
            }
            unset($data[$field]);
        }

        // Simpan field teks
        foreach ($data as $key => $value) {
            SiteInfo::updateOrCreate(['key' => $key], ['value' => $value]);
        }

        return redirect()->route('admin.settings.index')->with('success', 'Pengaturan situs berhasil diperbarui.');
    }
}

<?php

namespace App\Http\Requests\Instructor;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;

class StoreCourseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->role === 'instructor';
    }

    public function rules(): array
    {
        return [
            'title'           => ['required', 'string', 'max:255'],
            'slug'            => ['nullable', 'string', 'max:255', 'unique:courses,slug'],
            'category_id'     => ['required', 'exists:categories,id'],
            'subcategory_id'  => ['nullable', 'exists:sub_categories,id'],
            'description'     => ['nullable', 'string'],

            'price'           => ['required', 'numeric', 'min:0'],
            'discount'        => ['nullable', 'integer', 'min:0', 'max:100'],
            'featured'        => ['boolean'],
            'bestseller'      => ['boolean'],
            'thumbnail'       => ['nullable', 'image', 'max:2048'],
        ];
    }

    public function messages(): array
    {
        return [
            'title.required'       => 'Judul kursus wajib diisi.',
            'category_id.required' => 'Kategori wajib dipilih.',
            'category_id.exists'   => 'Kategori tidak valid.',
            'price.required'       => 'Harga wajib diisi.',
            'price.numeric'        => 'Harga harus berupa angka.',
            'discount.max'         => 'Diskon maksimal 100%.',
            'thumbnail.image'      => 'Thumbnail harus berupa gambar.',
            'thumbnail.max'        => 'Ukuran thumbnail maksimal 2MB.',
        ];
    }

    protected function prepareForValidation(): void
    {
        // Auto-generate slug dari title jika kosong
        if (empty($this->slug) && !empty($this->title)) {
            $this->merge(['slug' => Str::slug($this->title)]);
        }

        // Normalisasi boolean
        $this->merge([
            'featured'   => $this->boolean('featured'),
            'bestseller' => $this->boolean('bestseller'),
        ]);
    }
}

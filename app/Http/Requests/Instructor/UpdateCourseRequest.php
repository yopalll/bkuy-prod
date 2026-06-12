<?php

namespace App\Http\Requests\Instructor;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class UpdateCourseRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Hanya instructor pemilik course yang bisa update
        $course = $this->route('course');
        return $this->user()?->role === 'instructor'
            && $course
            && $course->instructor_id === $this->user()->id;
    }

    public function rules(): array
    {
        $courseId = $this->route('course')?->id;

        return [
            'title'          => ['required', 'string', 'max:255'],
            'slug'           => ['nullable', 'string', 'max:255', Rule::unique('courses', 'slug')->ignore($courseId)],
            'category_id'    => ['required', 'exists:categories,id'],
            'subcategory_id' => ['nullable', 'exists:sub_categories,id'],
            'description'    => ['nullable', 'string'],

            'price'          => ['required', 'numeric', 'min:0'],
            'discount'       => ['nullable', 'integer', 'min:0', 'max:100'],
            'featured'       => ['boolean'],
            'bestseller'     => ['boolean'],
            'thumbnail'      => ['nullable', 'file', 'mimes:jpg,jpeg,png,webp,mp4,webm,mov', 'max:51200'],
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
            'thumbnail.mimes'      => 'Thumbnail harus berupa gambar (JPG, PNG, WebP) atau video (MP4, WebM, MOV).',
            'thumbnail.max'        => 'Ukuran thumbnail maksimal 50MB.',
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

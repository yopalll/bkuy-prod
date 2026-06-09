<?php

namespace App\Http\Requests\Instructor;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;

class StoreCouponRequest extends FormRequest
{
    public function authorize(): bool
    {
        return Auth::check() && Auth::user()->role === 'instructor';
    }

    public function rules(): array
    {
        $couponId   = $this->route('coupon')?->id;
        $instructorId = Auth::id();

        return [
            'course_id' => [
                'required',
                'exists:courses,id',
                // Pastikan kursus benar-benar milik instruktur yang login
                function ($attribute, $value, $fail) use ($instructorId) {
                    $owned = \App\Models\Course::where('id', $value)
                        ->where('instructor_id', $instructorId)
                        ->exists();
                    if (! $owned) {
                        $fail('Kursus tidak ditemukan atau bukan milikmu.');
                    }
                },
            ],
            'code'             => 'required|string|max:50|unique:coupons,code,' . $couponId,
            'discount_percent' => 'required|integer|between:1,100',
            'valid_until'      => 'required|date|after_or_equal:today',
            'max_usage'        => 'nullable|integer|min:1',
            'status'           => 'boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'course_id.required'        => 'Pilih kursus yang akan diberi kupon.',
            'course_id.exists'          => 'Kursus tidak ditemukan.',
            'code.required'             => 'Kode kupon wajib diisi.',
            'code.unique'               => 'Kode kupon sudah dipakai, gunakan kode lain.',
            'code.max'                  => 'Kode kupon maksimal 50 karakter.',
            'discount_percent.required' => 'Persentase diskon wajib diisi.',
            'discount_percent.between'  => 'Diskon harus antara 1% dan 100%.',
            'valid_until.required'      => 'Tanggal kedaluwarsa wajib diisi.',
            'valid_until.after_or_equal'=> 'Tanggal kedaluwarsa tidak boleh di masa lalu.',
            'max_usage.integer'         => 'Batas pemakaian harus berupa angka.',
            'max_usage.min'             => 'Batas pemakaian minimal 1.',
        ];
    }
}

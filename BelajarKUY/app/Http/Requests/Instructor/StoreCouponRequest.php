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
        // Saat update, abaikan unique check untuk coupon yang sedang diedit
        $couponId = $this->route('coupon')?->id;

        return [
            'course_id'        => 'nullable|exists:courses,id',
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
            'code.required'             => 'Kode kupon wajib diisi.',
            'code.unique'               => 'Kode kupon sudah dipakai, gunakan kode lain.',
            'code.max'                  => 'Kode kupon maksimal 50 karakter.',
            'discount_percent.required' => 'Persentase diskon wajib diisi.',
            'discount_percent.between'  => 'Diskon harus antara 1% dan 100%.',
            'valid_until.required'      => 'Tanggal kedaluwarsa wajib diisi.',
            'valid_until.after_or_equal'=> 'Tanggal kedaluwarsa tidak boleh di masa lalu.',
            'max_usage.integer'         => 'Batas pemakaian harus berupa angka.',
            'max_usage.min'             => 'Batas pemakaian minimal 1.',
            'course_id.exists'          => 'Kursus tidak ditemukan.',
        ];
    }
}

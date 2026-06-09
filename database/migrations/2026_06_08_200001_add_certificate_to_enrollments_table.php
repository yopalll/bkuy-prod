<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('enrollments', function (Blueprint $table) {
            // Kode unik sertifikat — di-generate saat user menyelesaikan semua lecture
            $table->string('certificate_code', 64)->nullable()->unique()->after('enrolled_at');
            $table->timestamp('issued_at')->nullable()->after('certificate_code');
        });
    }

    public function down(): void
    {
        Schema::table('enrollments', function (Blueprint $table) {
            $table->dropColumn(['certificate_code', 'issued_at']);
        });
    }
};

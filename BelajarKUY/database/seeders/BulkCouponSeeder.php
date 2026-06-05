<?php

namespace Database\Seeders;

use App\Models\Coupon;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class BulkCouponSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $filePath = __DIR__ . '/data/coupons_bulk_import_sample.json';
        
        if (!file_exists($filePath)) {
            $this->command->warn("Bulk coupon JSON file not found at: {$filePath}");
            return;
        }

        $json = file_get_contents($filePath);
        $couponsData = json_decode($json, true);

        if (empty($couponsData)) {
            $this->command->warn("Bulk coupon JSON file is empty or invalid.");
            return;
        }

        $instructor = User::where('role', 'instructor')->first();
        if (!$instructor) {
            $this->command->warn("No instructor found to assign bulk coupons.");
            return;
        }

        $this->command->info("Seeding " . count($couponsData) . " bulk coupons...");

        // Insert in chunks for performance
        $chunks = array_chunk($couponsData, 200);
        foreach ($chunks as $chunk) {
            $insertData = [];
            foreach ($chunk as $data) {
                $insertData[] = [
                    'instructor_id' => $instructor->id,
                    'course_id' => null, // Global instructor coupons
                    'code' => $data['code'],
                    'discount_percent' => $data['discount_percent'],
                    'valid_until' => Carbon::parse($data['valid_until'])->toDateString(),
                    'max_usage' => $data['max_usage'],
                    'used_count' => 0,
                    'status' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
            Coupon::insert($insertData);
        }

        $this->command->info("Bulk coupons seeded successfully!");
    }
}

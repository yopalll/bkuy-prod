<?php

namespace Database\Factories;

use App\Models\Slider;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Slider>
 */
class SliderFactory extends Factory
{
    protected $model = Slider::class;

    public function definition(): array
    {
        return [
            'title' => fake()->catchPhrase(),
            'sub_title' => fake()->sentence(12),
            'link' => '/courses',
            'image_url' => 'https://placehold.co/1280x500/4F46E5/ffffff?text=Slider',
            'image_public_id' => 'sliders/slide-'.fake()->uuid(),
            'status' => true,
            'order_position' => fake()->numberBetween(0, 20),
        ];
    }
}

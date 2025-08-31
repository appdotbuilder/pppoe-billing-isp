<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Customer>
 */
class CustomerFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'phone' => fake()->phoneNumber(),
            'address' => fake()->address(),
            'pppoe_username' => fake()->unique()->userName(),
            'pppoe_password' => fake()->password(8),
            'service_plan' => fake()->randomElement(['Basic 10Mbps', 'Standard 25Mbps', 'Premium 50Mbps', 'Ultra 100Mbps']),
            'monthly_fee' => fake()->randomFloat(2, 50000, 500000), // IDR 50k - 500k
            'bandwidth_download' => fake()->randomElement([10, 25, 50, 100]),
            'bandwidth_upload' => fake()->randomElement([5, 10, 25, 50]),
            'status' => fake()->randomElement(['active', 'suspended', 'terminated']),
            'service_start_date' => fake()->dateTimeBetween('-2 years', 'now'),
            'notes' => fake()->optional()->sentence(),
        ];
    }

    /**
     * Indicate that the customer is active.
     */
    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'active',
        ]);
    }

    /**
     * Indicate that the customer is suspended.
     */
    public function suspended(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'suspended',
        ]);
    }

    /**
     * Indicate that the customer is terminated.
     */
    public function terminated(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'terminated',
        ]);
    }
}
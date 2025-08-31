<?php

namespace Database\Factories;

use App\Models\Customer;
use App\Models\Invoice;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Payment>
 */
class PaymentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'customer_id' => Customer::factory(),
            'invoice_id' => fake()->optional(0.8)->randomElement([null, Invoice::factory()]),
            'payment_reference' => 'PAY-' . fake()->unique()->numerify('########'),
            'amount' => fake()->randomFloat(2, 50000, 500000),
            'payment_method' => fake()->randomElement(['cash', 'bank_transfer', 'credit_card', 'digital_wallet']),
            'payment_date' => fake()->dateTimeBetween('-3 months', 'now'),
            'notes' => fake()->optional()->sentence(),
            'status' => fake()->randomElement(['pending', 'confirmed', 'failed']),
        ];
    }

    /**
     * Indicate that the payment is confirmed.
     */
    public function confirmed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'confirmed',
            'confirmed_at' => fake()->dateTimeBetween($attributes['payment_date'], 'now'),
            'confirmed_by' => User::factory(),
        ]);
    }

    /**
     * Indicate that the payment is pending.
     */
    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'pending',
        ]);
    }

    /**
     * Indicate that the payment failed.
     */
    public function failed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'failed',
        ]);
    }
}
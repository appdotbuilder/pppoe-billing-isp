<?php

namespace Database\Factories;

use App\Models\Customer;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Invoice>
 */
class InvoiceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $billingStart = fake()->dateTimeBetween('-6 months', 'now');
        $billingEnd = (clone $billingStart)->modify('+1 month');
        $dueDate = (clone $billingEnd)->modify('+7 days');
        $amount = fake()->randomFloat(2, 50000, 500000);
        
        return [
            'customer_id' => Customer::factory(),
            'invoice_number' => 'INV-' . fake()->unique()->numerify('######'),
            'billing_period_start' => $billingStart,
            'billing_period_end' => $billingEnd,
            'due_date' => $dueDate,
            'amount' => $amount,
            'paid_amount' => 0,
            'status' => fake()->randomElement(['draft', 'sent', 'paid', 'overdue']),
            'description' => 'Monthly internet service fee',
            'sent_at' => fake()->optional(0.8)->dateTimeBetween($billingEnd, 'now'),
        ];
    }

    /**
     * Indicate that the invoice is paid.
     */
    public function paid(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'paid',
            'paid_amount' => $attributes['amount'],
            'paid_at' => fake()->dateTimeBetween($attributes['billing_period_end'], 'now'),
        ]);
    }

    /**
     * Indicate that the invoice is overdue.
     */
    public function overdue(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'overdue',
            'due_date' => fake()->dateTimeBetween('-30 days', '-1 day'),
        ]);
    }

    /**
     * Indicate that the invoice is partially paid.
     */
    public function partiallyPaid(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'sent',
            'paid_amount' => $attributes['amount'] * 0.5, // 50% paid
        ]);
    }
}
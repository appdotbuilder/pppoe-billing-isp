<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customer_id')->constrained()->onDelete('cascade');
            $table->foreignId('invoice_id')->nullable()->constrained()->onDelete('set null');
            $table->string('payment_reference')->unique()->comment('Unique payment reference number');
            $table->decimal('amount', 10, 2)->comment('Payment amount');
            $table->enum('payment_method', ['cash', 'bank_transfer', 'credit_card', 'digital_wallet'])->comment('Payment method used');
            $table->date('payment_date')->comment('Date when payment was received');
            $table->text('notes')->nullable()->comment('Payment notes or bank transfer details');
            $table->enum('status', ['pending', 'confirmed', 'failed'])->default('pending')->comment('Payment verification status');
            $table->timestamp('confirmed_at')->nullable()->comment('When payment was confirmed');
            $table->foreignId('confirmed_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();
            
            // Indexes for performance
            $table->index('customer_id');
            $table->index('invoice_id');
            $table->index('payment_reference');
            $table->index('payment_date');
            $table->index('status');
            $table->index(['customer_id', 'payment_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
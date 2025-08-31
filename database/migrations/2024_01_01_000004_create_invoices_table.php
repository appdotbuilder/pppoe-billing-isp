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
        Schema::create('invoices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customer_id')->constrained()->onDelete('cascade');
            $table->string('invoice_number')->unique()->comment('Unique invoice number');
            $table->date('billing_period_start')->comment('Billing period start date');
            $table->date('billing_period_end')->comment('Billing period end date');
            $table->date('due_date')->comment('Invoice due date');
            $table->decimal('amount', 10, 2)->comment('Invoice total amount');
            $table->decimal('paid_amount', 10, 2)->default(0)->comment('Amount already paid');
            $table->enum('status', ['draft', 'sent', 'paid', 'overdue', 'cancelled'])->default('draft')->comment('Invoice status');
            $table->text('description')->nullable()->comment('Invoice description/notes');
            $table->timestamp('sent_at')->nullable()->comment('When invoice was sent to customer');
            $table->timestamp('paid_at')->nullable()->comment('When invoice was fully paid');
            $table->timestamps();
            
            // Indexes for performance
            $table->index('customer_id');
            $table->index('invoice_number');
            $table->index('status');
            $table->index('due_date');
            $table->index(['customer_id', 'billing_period_start']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};
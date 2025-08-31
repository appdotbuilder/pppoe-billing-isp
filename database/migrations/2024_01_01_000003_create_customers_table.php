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
        Schema::create('customers', function (Blueprint $table) {
            $table->id();
            $table->string('name')->comment('Customer full name');
            $table->string('email')->unique()->comment('Customer email address');
            $table->string('phone')->nullable()->comment('Customer phone number');
            $table->text('address')->comment('Customer address');
            $table->string('pppoe_username')->unique()->comment('PPPoE username for authentication');
            $table->string('pppoe_password')->comment('PPPoE password for authentication');
            $table->string('service_plan')->comment('Internet service plan name');
            $table->decimal('monthly_fee', 10, 2)->comment('Monthly service fee');
            $table->integer('bandwidth_download')->comment('Download bandwidth in Mbps');
            $table->integer('bandwidth_upload')->comment('Upload bandwidth in Mbps');
            $table->enum('status', ['active', 'suspended', 'terminated'])->default('active')->comment('Service status');
            $table->date('service_start_date')->comment('Service activation date');
            $table->text('notes')->nullable()->comment('Additional notes about customer');
            $table->timestamps();
            
            // Indexes for performance
            $table->index('pppoe_username');
            $table->index('email');
            $table->index('status');
            $table->index(['status', 'service_start_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customers');
    }
};
<?php

use App\Http\Controllers\CustomerController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\PaymentController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/health-check', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now()->toISOString(),
    ]);
})->name('health-check');

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    // Main dashboard
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    // Customer management
    Route::resource('customers', CustomerController::class);
    
    // Invoice management
    Route::resource('invoices', InvoiceController::class);
    
    // Payment management
    Route::resource('payments', PaymentController::class);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';

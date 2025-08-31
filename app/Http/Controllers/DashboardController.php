<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Invoice;
use App\Models\Payment;
use Carbon\Carbon;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display the main dashboard.
     */
    public function index()
    {
        // Overview statistics
        $stats = [
            'total_customers' => Customer::count(),
            'active_customers' => Customer::active()->count(),
            'suspended_customers' => Customer::suspended()->count(),
            'total_invoices' => Invoice::count(),
            'overdue_invoices' => Invoice::overdue()->count(),
            'unpaid_amount' => Invoice::unpaid()->sum('amount') - Invoice::unpaid()->sum('paid_amount'),
            'monthly_revenue' => Payment::confirmed()
                ->whereMonth('payment_date', now()->month)
                ->sum('amount'),
            'pending_payments' => Payment::pending()->count(),
        ];

        // Recent activities
        $recentCustomers = Customer::latest()->take(5)->get();
        $recentInvoices = Invoice::with('customer')->latest()->take(5)->get();
        $recentPayments = Payment::with(['customer', 'invoice'])
            ->latest()
            ->take(5)
            ->get();

        // Monthly revenue chart data (last 12 months)
        $monthlyRevenue = collect();
        for ($i = 11; $i >= 0; $i--) {
            $month = now()->subMonths($i);
            $revenue = Payment::confirmed()
                ->whereYear('payment_date', $month->year)
                ->whereMonth('payment_date', $month->month)
                ->sum('amount');
            
            $monthlyRevenue->push([
                'month' => $month->format('M Y'),
                'revenue' => $revenue
            ]);
        }

        // Service status distribution
        $serviceStatus = [
            ['status' => 'Active', 'count' => Customer::active()->count(), 'color' => '#10B981'],
            ['status' => 'Suspended', 'count' => Customer::suspended()->count(), 'color' => '#F59E0B'],
            ['status' => 'Terminated', 'count' => Customer::where('status', 'terminated')->count(), 'color' => '#EF4444'],
        ];

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'recent' => [
                'customers' => $recentCustomers,
                'invoices' => $recentInvoices,
                'payments' => $recentPayments,
            ],
            'charts' => [
                'monthlyRevenue' => $monthlyRevenue,
                'serviceStatus' => $serviceStatus,
            ]
        ]);
    }
}
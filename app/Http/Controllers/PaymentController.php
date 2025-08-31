<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePaymentRequest;
use App\Models\Customer;
use App\Models\Invoice;
use App\Models\Payment;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PaymentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $payments = Payment::with(['customer', 'invoice', 'confirmedBy'])
            ->latest()
            ->paginate(10);
        
        $stats = [
            'total_payments' => Payment::confirmed()->count(),
            'pending_payments' => Payment::pending()->count(),
            'total_amount' => Payment::confirmed()->sum('amount'),
            'this_month_amount' => Payment::confirmed()->whereMonth('payment_date', now()->month)->sum('amount'),
        ];

        return Inertia::render('payments/index', [
            'payments' => $payments,
            'stats' => $stats
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $customers = Customer::active()
            ->select('id', 'name', 'email')
            ->orderBy('name')
            ->get();

        $unpaidInvoices = Invoice::unpaid()
            ->with('customer')
            ->orderBy('due_date')
            ->get();

        return Inertia::render('payments/create', [
            'customers' => $customers,
            'unpaidInvoices' => $unpaidInvoices
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePaymentRequest $request)
    {
        $validated = $request->validated();
        
        // Generate unique payment reference
        $validated['payment_reference'] = 'PAY-' . now()->format('Ym') . '-' . str_pad((string)(Payment::count() + 1), 6, '0', STR_PAD_LEFT);
        
        // Set default status
        $validated['status'] = 'pending';

        $payment = Payment::create($validated);

        return redirect()->route('payments.show', $payment)
            ->with('success', 'Payment recorded successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Payment $payment)
    {
        $payment->load(['customer', 'invoice', 'confirmedBy']);

        return Inertia::render('payments/show', [
            'payment' => $payment
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Payment $payment)
    {
        if ($payment->status === 'confirmed') {
            return redirect()->back()
                ->with('error', 'Cannot edit a confirmed payment.');
        }

        $customers = Customer::active()
            ->select('id', 'name', 'email')
            ->orderBy('name')
            ->get();

        $unpaidInvoices = Invoice::unpaid()
            ->with('customer')
            ->orderBy('due_date')
            ->get();

        return Inertia::render('payments/edit', [
            'payment' => $payment,
            'customers' => $customers,
            'unpaidInvoices' => $unpaidInvoices
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(StorePaymentRequest $request, Payment $payment)
    {
        if ($payment->status === 'confirmed') {
            return redirect()->back()
                ->with('error', 'Cannot edit a confirmed payment.');
        }

        $payment->update($request->validated());

        return redirect()->route('payments.show', $payment)
            ->with('success', 'Payment updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Payment $payment)
    {
        if ($payment->status === 'confirmed') {
            return redirect()->back()
                ->with('error', 'Cannot delete a confirmed payment.');
        }

        $payment->delete();

        return redirect()->route('payments.index')
            ->with('success', 'Payment deleted successfully.');
    }
}
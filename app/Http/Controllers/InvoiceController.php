<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreInvoiceRequest;
use App\Models\Customer;
use App\Models\Invoice;
use Carbon\Carbon;
use Inertia\Inertia;

class InvoiceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $invoices = Invoice::with('customer')
            ->latest()
            ->paginate(10);
        
        $stats = [
            'total_invoices' => Invoice::count(),
            'overdue_invoices' => Invoice::overdue()->count(),
            'unpaid_amount' => Invoice::unpaid()->sum('amount') - Invoice::unpaid()->sum('paid_amount'),
            'this_month_amount' => Invoice::whereMonth('created_at', now()->month)->sum('amount'),
        ];

        return Inertia::render('invoices/index', [
            'invoices' => $invoices,
            'stats' => $stats
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $customers = Customer::active()
            ->select('id', 'name', 'email', 'monthly_fee')
            ->orderBy('name')
            ->get();

        return Inertia::render('invoices/create', [
            'customers' => $customers
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreInvoiceRequest $request)
    {
        $validated = $request->validated();
        
        // Generate unique invoice number
        $validated['invoice_number'] = 'INV-' . now()->format('Ym') . '-' . str_pad((string)(Invoice::count() + 1), 4, '0', STR_PAD_LEFT);
        
        // Set default status
        $validated['status'] = 'draft';

        $invoice = Invoice::create($validated);

        return redirect()->route('invoices.show', $invoice)
            ->with('success', 'Invoice created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Invoice $invoice)
    {
        $invoice->load(['customer', 'payments']);

        return Inertia::render('invoices/show', [
            'invoice' => $invoice
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Invoice $invoice)
    {
        $customers = Customer::active()
            ->select('id', 'name', 'email')
            ->orderBy('name')
            ->get();

        return Inertia::render('invoices/edit', [
            'invoice' => $invoice,
            'customers' => $customers
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(StoreInvoiceRequest $request, Invoice $invoice)
    {
        $invoice->update($request->validated());

        return redirect()->route('invoices.show', $invoice)
            ->with('success', 'Invoice updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Invoice $invoice)
    {
        if ($invoice->status === 'paid') {
            return redirect()->back()
                ->with('error', 'Cannot delete a paid invoice.');
        }

        $invoice->delete();

        return redirect()->route('invoices.index')
            ->with('success', 'Invoice deleted successfully.');
    }
}
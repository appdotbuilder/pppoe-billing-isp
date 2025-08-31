<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * App\Models\Invoice
 *
 * @property int $id
 * @property int $customer_id
 * @property string $invoice_number
 * @property \Illuminate\Support\Carbon $billing_period_start
 * @property \Illuminate\Support\Carbon $billing_period_end
 * @property \Illuminate\Support\Carbon $due_date
 * @property float $amount
 * @property float $paid_amount
 * @property string $status
 * @property string|null $description
 * @property \Illuminate\Support\Carbon|null $sent_at
 * @property \Illuminate\Support\Carbon|null $paid_at
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property \App\Models\Customer $customer
 * @property \Illuminate\Database\Eloquent\Collection|\App\Models\Payment[] $payments
 * @property int|null $payments_count
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|Invoice newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Invoice newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Invoice query()
 * @method static \Illuminate\Database\Eloquent\Builder|Invoice whereAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Invoice whereBillingPeriodEnd($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Invoice whereBillingPeriodStart($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Invoice whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Invoice whereCustomerId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Invoice whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Invoice whereDueDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Invoice whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Invoice whereInvoiceNumber($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Invoice wherePaidAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Invoice wherePaidAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Invoice whereSentAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Invoice whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Invoice whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Invoice overdue()
 * @method static \Illuminate\Database\Eloquent\Builder|Invoice unpaid()
 * @method static \Database\Factories\InvoiceFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class Invoice extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'customer_id',
        'invoice_number',
        'billing_period_start',
        'billing_period_end',
        'due_date',
        'amount',
        'paid_amount',
        'status',
        'description',
        'sent_at',
        'paid_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'billing_period_start' => 'date',
        'billing_period_end' => 'date',
        'due_date' => 'date',
        'amount' => 'decimal:2',
        'paid_amount' => 'decimal:2',
        'sent_at' => 'datetime',
        'paid_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the customer that owns the invoice.
     */
    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    /**
     * Get the payments for the invoice.
     */
    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    /**
     * Scope a query to only include overdue invoices.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeOverdue($query)
    {
        return $query->where('due_date', '<', now())
            ->whereIn('status', ['sent', 'overdue']);
    }

    /**
     * Scope a query to only include unpaid invoices.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeUnpaid($query)
    {
        return $query->whereIn('status', ['sent', 'overdue'])
            ->whereRaw('amount > paid_amount');
    }

    /**
     * Get the remaining balance for this invoice.
     *
     * @return float
     */
    public function getRemainingBalance(): float
    {
        return $this->amount - $this->paid_amount;
    }

    /**
     * Check if the invoice is fully paid.
     *
     * @return bool
     */
    public function isFullyPaid(): bool
    {
        return $this->paid_amount >= $this->amount;
    }

    /**
     * Mark the invoice as overdue if past due date.
     *
     * @return void
     */
    public function checkOverdueStatus(): void
    {
        if ($this->due_date < now() && in_array($this->status, ['sent', 'draft'])) {
            $this->update(['status' => 'overdue']);
        }
    }
}
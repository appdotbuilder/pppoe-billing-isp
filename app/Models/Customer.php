<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * App\Models\Customer
 *
 * @property int $id
 * @property string $name
 * @property string $email
 * @property string|null $phone
 * @property string $address
 * @property string $pppoe_username
 * @property string $pppoe_password
 * @property string $service_plan
 * @property float $monthly_fee
 * @property int $bandwidth_download
 * @property int $bandwidth_upload
 * @property string $status
 * @property \Illuminate\Support\Carbon $service_start_date
 * @property string|null $notes
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property \Illuminate\Database\Eloquent\Collection|\App\Models\Invoice[] $invoices
 * @property \Illuminate\Database\Eloquent\Collection|\App\Models\Payment[] $payments
 * @property int|null $invoices_count
 * @property int|null $payments_count
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|Customer newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Customer newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Customer query()
 * @method static \Illuminate\Database\Eloquent\Builder|Customer whereAddress($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Customer whereBandwidthDownload($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Customer whereBandwidthUpload($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Customer whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Customer whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Customer whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Customer whereMonthlyFee($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Customer whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Customer whereNotes($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Customer wherePhone($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Customer wherePppoePassword($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Customer wherePppoeUsername($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Customer whereServicePlan($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Customer whereServiceStartDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Customer whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Customer whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Customer active()
 * @method static \Illuminate\Database\Eloquent\Builder|Customer suspended()
 * @method static \Database\Factories\CustomerFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class Customer extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'phone',
        'address',
        'pppoe_username',
        'pppoe_password',
        'service_plan',
        'monthly_fee',
        'bandwidth_download',
        'bandwidth_upload',
        'status',
        'service_start_date',
        'notes',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'monthly_fee' => 'decimal:2',
        'bandwidth_download' => 'integer',
        'bandwidth_upload' => 'integer',
        'service_start_date' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the invoices for the customer.
     */
    public function invoices(): HasMany
    {
        return $this->hasMany(Invoice::class);
    }

    /**
     * Get the payments for the customer.
     */
    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    /**
     * Scope a query to only include active customers.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Scope a query to only include suspended customers.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeSuspended($query)
    {
        return $query->where('status', 'suspended');
    }

    /**
     * Get the customer's current balance (unpaid invoices).
     *
     * @return float
     */
    public function getCurrentBalance(): float
    {
        return $this->invoices()
            ->whereIn('status', ['sent', 'overdue'])
            ->sum('amount') - $this->invoices()
            ->whereIn('status', ['sent', 'overdue'])
            ->sum('paid_amount');
    }

    /**
     * Get the customer's total paid amount.
     *
     * @return float
     */
    public function getTotalPaidAmount(): float
    {
        return $this->payments()
            ->where('status', 'confirmed')
            ->sum('amount');
    }
}
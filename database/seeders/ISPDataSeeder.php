<?php

namespace Database\Seeders;

use App\Models\Customer;
use App\Models\Invoice;
use App\Models\Payment;
use App\Models\User;
use Illuminate\Database\Seeder;

class ISPDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin user
        if (!User::where('email', 'admin@ispbilling.com')->exists()) {
            User::factory()->create([
                'name' => 'ISP Admin',
                'email' => 'admin@ispbilling.com',
                'password' => bcrypt('password'),
            ]);
        }

        // Create sample customers with various statuses
        $customers = collect([
            [
                'name' => 'PT. Teknologi Nusantara',
                'email' => 'admin@teknusantara.co.id',
                'phone' => '021-555-0001',
                'address' => 'Jl. Sudirman No. 123, Jakarta Selatan',
                'service_plan' => 'Business 100Mbps',
                'monthly_fee' => 2500000,
                'bandwidth_download' => 100,
                'bandwidth_upload' => 50,
                'status' => 'active',
            ],
            [
                'name' => 'CV. Digital Kreatif',
                'email' => 'info@digitalkreatif.com',
                'phone' => '021-555-0002',
                'address' => 'Jl. Gatot Subroto No. 45, Jakarta Pusat',
                'service_plan' => 'Premium 50Mbps',
                'monthly_fee' => 1200000,
                'bandwidth_download' => 50,
                'bandwidth_upload' => 25,
                'status' => 'active',
            ],
            [
                'name' => 'Warnet Gamers Paradise',
                'email' => 'owner@gamersparadise.net',
                'phone' => '021-555-0003',
                'address' => 'Jl. Mangga Besar No. 78, Jakarta Barat',
                'service_plan' => 'Gaming 25Mbps',
                'monthly_fee' => 750000,
                'bandwidth_download' => 25,
                'bandwidth_upload' => 15,
                'status' => 'suspended',
            ],
            [
                'name' => 'Toko Online Sejahtera',
                'email' => 'contact@sejahtera-shop.id',
                'phone' => '021-555-0004',
                'address' => 'Jl. Kemang Raya No. 156, Jakarta Selatan',
                'service_plan' => 'Standard 20Mbps',
                'monthly_fee' => 500000,
                'bandwidth_download' => 20,
                'bandwidth_upload' => 10,
                'status' => 'active',
            ],
            [
                'name' => 'Kafe Connect',
                'email' => 'manager@kafeconnect.com',
                'phone' => '021-555-0005',
                'address' => 'Jl. Blok M No. 89, Jakarta Selatan',
                'service_plan' => 'Basic 10Mbps',
                'monthly_fee' => 300000,
                'bandwidth_download' => 10,
                'bandwidth_upload' => 5,
                'status' => 'active',
            ],
            [
                'name' => 'Sekolah Dasar Harapan',
                'email' => 'admin@sdharapan.sch.id',
                'phone' => '021-555-0006',
                'address' => 'Jl. Pendidikan No. 12, Jakarta Timur',
                'service_plan' => 'Education 30Mbps',
                'monthly_fee' => 400000,
                'bandwidth_download' => 30,
                'bandwidth_upload' => 15,
                'status' => 'active',
            ],
        ]);

        foreach ($customers as $customerData) {
            $customer = Customer::create(array_merge($customerData, [
                'pppoe_username' => strtolower(str_replace([' ', '.'], ['', ''], $customerData['name'])) . random_int(100, 999),
                'pppoe_password' => 'pass' . random_int(1000, 9999),
                'service_start_date' => now()->subMonths(random_int(1, 12)),
                'notes' => 'Sample customer data for demo purposes',
            ]));

            // Create invoices for each customer
            $invoiceCount = random_int(3, 8);
            for ($i = 0; $i < $invoiceCount; $i++) {
                $billingStart = now()->subMonths($invoiceCount - $i);
                $billingEnd = (clone $billingStart)->endOfMonth();
                $dueDate = (clone $billingEnd)->addDays(7);
                
                $invoice = Invoice::create([
                    'customer_id' => $customer->id,
                    'invoice_number' => 'INV-' . $billingStart->format('Ym') . '-' . str_pad((string)($customer->id * 100 + $i), 4, '0', STR_PAD_LEFT),
                    'billing_period_start' => $billingStart,
                    'billing_period_end' => $billingEnd,
                    'due_date' => $dueDate,
                    'amount' => $customer->monthly_fee,
                    'paid_amount' => 0,
                    'status' => $i < $invoiceCount - 2 ? 'paid' : ($i < $invoiceCount - 1 ? 'sent' : 'draft'),
                    'description' => "Monthly internet service fee - {$customer->service_plan}",
                    'sent_at' => $i < $invoiceCount - 1 ? $billingEnd->addDay() : null,
                    'paid_at' => $i < $invoiceCount - 2 ? $billingEnd->addDays(random_int(1, 5)) : null,
                ]);

                if ($invoice->status === 'paid') {
                    $invoice->update(['paid_amount' => $invoice->amount]);
                }

                // Create payments for paid invoices
                if ($invoice->status === 'paid') {
                    Payment::create([
                        'customer_id' => $customer->id,
                        'invoice_id' => $invoice->id,
                        'payment_reference' => 'PAY-' . $billingStart->format('Ym') . '-' . str_pad((string)(Payment::count() + 1), 6, '0', STR_PAD_LEFT),
                        'amount' => $invoice->amount,
                        'payment_method' => collect(['bank_transfer', 'cash', 'digital_wallet'])->random(),
                        'payment_date' => $invoice->paid_at,
                        'notes' => 'Monthly service payment via bank transfer',
                        'status' => 'confirmed',
                        'confirmed_at' => $invoice->paid_at,
                        'confirmed_by' => User::first()->id,
                    ]);
                }
            }

            // Update overdue invoices
            Invoice::where('customer_id', $customer->id)
                ->where('due_date', '<', now())
                ->whereIn('status', ['sent'])
                ->update(['status' => 'overdue']);
        }

        $this->command->info('Created ' . Customer::count() . ' customers');
        $this->command->info('Created ' . Invoice::count() . ' invoices');
        $this->command->info('Created ' . Payment::count() . ' payments');
    }
}
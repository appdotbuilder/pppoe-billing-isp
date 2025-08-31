import React from 'react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { router } from '@inertiajs/react';
import Heading from '@/components/heading';

interface Payment {
    id: number;
    payment_reference: string;
    amount: number;
    payment_method: 'cash' | 'bank_transfer' | 'credit_card' | 'digital_wallet';
    payment_date: string;
    notes: string | null;
    status: 'pending' | 'confirmed' | 'failed';
    confirmed_at: string | null;
    created_at: string;
    customer: {
        id: number;
        name: string;
        email: string;
    };
    invoice: {
        id: number;
        invoice_number: string;
        amount: number;
    } | null;
    confirmed_by: {
        name: string;
    } | null;
}

interface PaymentStats {
    total_payments: number;
    pending_payments: number;
    total_amount: number;
    this_month_amount: number;
}

interface Props {
    payments: {
        data: Payment[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    stats: PaymentStats;
    [key: string]: unknown;
}

export default function PaymentsIndex({ payments, stats }: Props) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const getStatusBadge = (status: string) => {
        const badges = {
            pending: 'bg-yellow-100 text-yellow-800',
            confirmed: 'bg-green-100 text-green-800',
            failed: 'bg-red-100 text-red-800'
        };
        return badges[status as keyof typeof badges] || 'bg-gray-100 text-gray-800';
    };

    const getStatusIcon = (status: string) => {
        const icons = {
            pending: '🟡',
            confirmed: '✅',
            failed: '❌'
        };
        return icons[status as keyof typeof icons] || '💳';
    };

    const getPaymentMethodIcon = (method: string) => {
        const icons = {
            cash: '💵',
            bank_transfer: '🏦',
            credit_card: '💳',
            digital_wallet: '📱'
        };
        return icons[method as keyof typeof icons] || '💰';
    };

    return (
        <AppShell>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <Heading title="💳 Payment Management" />
                    <Button 
                        onClick={() => router.visit('/payments/create')}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        ➕ Record New Payment
                    </Button>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Total Payments</p>
                                    <p className="text-2xl font-bold">{stats.total_payments}</p>
                                </div>
                                <div className="text-2xl">💳</div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Pending Review</p>
                                    <p className="text-2xl font-bold text-yellow-600">{stats.pending_payments}</p>
                                </div>
                                <div className="text-2xl">🟡</div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Total Received</p>
                                    <p className="text-xl font-bold text-green-600">
                                        {formatCurrency(stats.total_amount)}
                                    </p>
                                </div>
                                <div className="text-2xl">💰</div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">This Month</p>
                                    <p className="text-xl font-bold text-blue-600">
                                        {formatCurrency(stats.this_month_amount)}
                                    </p>
                                </div>
                                <div className="text-2xl">📅</div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Payment List */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <span>📋</span>
                            <span>Payment History</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {payments.data.length > 0 ? (
                            <div className="space-y-4">
                                {payments.data.map((payment) => (
                                    <div 
                                        key={payment.id} 
                                        className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                                        onClick={() => router.visit(`/payments/${payment.id}`)}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-3 mb-2">
                                                    <h3 className="font-semibold text-lg">{payment.payment_reference}</h3>
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(payment.status)}`}>
                                                        {getStatusIcon(payment.status)} {payment.status.toUpperCase()}
                                                    </span>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
                                                    <div>
                                                        <p className="font-medium">Customer</p>
                                                        <p>{payment.customer.name}</p>
                                                        <p>{payment.customer.email}</p>
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">Payment Details</p>
                                                        <p className="text-lg font-semibold text-gray-900">
                                                            {formatCurrency(payment.amount)}
                                                        </p>
                                                        <p>
                                                            {getPaymentMethodIcon(payment.payment_method)} {payment.payment_method.replace('_', ' ')}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">Date</p>
                                                        <p>📅 {new Date(payment.payment_date).toLocaleDateString()}</p>
                                                        {payment.confirmed_at && (
                                                            <p className="text-green-600">
                                                                ✅ Confirmed {new Date(payment.confirmed_at).toLocaleDateString()}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">Invoice</p>
                                                        {payment.invoice ? (
                                                            <p>
                                                                📄 {payment.invoice.invoice_number}
                                                                <br />
                                                                {formatCurrency(payment.invoice.amount)}
                                                            </p>
                                                        ) : (
                                                            <p className="text-gray-500">General Payment</p>
                                                        )}
                                                    </div>
                                                </div>
                                                {payment.notes && (
                                                    <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                                                        <p className="font-medium text-gray-700">Notes:</p>
                                                        <p className="text-gray-600">{payment.notes}</p>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex space-x-2">
                                                {payment.status === 'pending' && (
                                                    <Button 
                                                        variant="outline" 
                                                        size="sm"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            // TODO: Add confirm payment functionality
                                                        }}
                                                        className="text-green-600 border-green-600 hover:bg-green-50"
                                                    >
                                                        ✅ Confirm
                                                    </Button>
                                                )}
                                                <Button 
                                                    variant="outline" 
                                                    size="sm"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        router.visit(`/payments/${payment.id}/edit`);
                                                    }}
                                                    disabled={payment.status === 'confirmed'}
                                                >
                                                    ✏️ Edit
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">💳</div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">No payments yet</h3>
                                <p className="text-gray-600 mb-6">Record your first payment to start tracking revenue</p>
                                <Button 
                                    onClick={() => router.visit('/payments/create')}
                                    className="bg-blue-600 hover:bg-blue-700"
                                >
                                    ➕ Record Your First Payment
                                </Button>
                            </div>
                        )}

                        {/* Pagination */}
                        {payments.last_page > 1 && (
                            <div className="flex items-center justify-between mt-6 pt-4 border-t">
                                <div className="text-sm text-gray-500">
                                    Showing {((payments.current_page - 1) * payments.per_page) + 1} to{' '}
                                    {Math.min(payments.current_page * payments.per_page, payments.total)} of{' '}
                                    {payments.total} results
                                </div>
                                <div className="flex space-x-2">
                                    {payments.current_page > 1 && (
                                        <Button 
                                            variant="outline" 
                                            size="sm"
                                            onClick={() => router.visit(`/payments?page=${payments.current_page - 1}`)}
                                        >
                                            Previous
                                        </Button>
                                    )}
                                    {payments.current_page < payments.last_page && (
                                        <Button 
                                            variant="outline" 
                                            size="sm"
                                            onClick={() => router.visit(`/payments?page=${payments.current_page + 1}`)}
                                        >
                                            Next
                                        </Button>
                                    )}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppShell>
    );
}
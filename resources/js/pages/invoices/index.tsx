import React from 'react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { router } from '@inertiajs/react';
import Heading from '@/components/heading';

interface Invoice {
    id: number;
    invoice_number: string;
    billing_period_start: string;
    billing_period_end: string;
    due_date: string;
    amount: number;
    paid_amount: number;
    status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
    description: string | null;
    created_at: string;
    customer: {
        id: number;
        name: string;
        email: string;
        service_plan: string;
    };
}

interface InvoiceStats {
    total_invoices: number;
    overdue_invoices: number;
    unpaid_amount: number;
    this_month_amount: number;
}

interface Props {
    invoices: {
        data: Invoice[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    stats: InvoiceStats;
    [key: string]: unknown;
}

export default function InvoicesIndex({ invoices, stats }: Props) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const getStatusBadge = (status: string) => {
        const badges = {
            draft: 'bg-gray-100 text-gray-800',
            sent: 'bg-blue-100 text-blue-800',
            paid: 'bg-green-100 text-green-800',
            overdue: 'bg-red-100 text-red-800',
            cancelled: 'bg-red-100 text-red-800'
        };
        return badges[status as keyof typeof badges] || 'bg-gray-100 text-gray-800';
    };

    const getStatusIcon = (status: string) => {
        const icons = {
            draft: '📝',
            sent: '📤',
            paid: '✅',
            overdue: '⚠️',
            cancelled: '❌'
        };
        return icons[status as keyof typeof icons] || '📄';
    };

    const isOverdue = (dueDate: string, status: string) => {
        return new Date(dueDate) < new Date() && ['sent', 'overdue'].includes(status);
    };

    return (
        <AppShell>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <Heading title="📄 Invoice Management" />
                    <Button 
                        onClick={() => router.visit('/invoices/create')}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        ➕ Create New Invoice
                    </Button>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Total Invoices</p>
                                    <p className="text-2xl font-bold">{stats.total_invoices}</p>
                                </div>
                                <div className="text-2xl">📄</div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Overdue</p>
                                    <p className="text-2xl font-bold text-red-600">{stats.overdue_invoices}</p>
                                </div>
                                <div className="text-2xl">⚠️</div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Unpaid Amount</p>
                                    <p className="text-xl font-bold text-orange-600">
                                        {formatCurrency(stats.unpaid_amount)}
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
                                    <p className="text-xl font-bold text-green-600">
                                        {formatCurrency(stats.this_month_amount)}
                                    </p>
                                </div>
                                <div className="text-2xl">📈</div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Invoice List */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <span>📋</span>
                            <span>Invoice List</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {invoices.data.length > 0 ? (
                            <div className="space-y-4">
                                {invoices.data.map((invoice) => (
                                    <div 
                                        key={invoice.id} 
                                        className={`border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer ${
                                            isOverdue(invoice.due_date, invoice.status) ? 'border-red-200 bg-red-50' : ''
                                        }`}
                                        onClick={() => router.visit(`/invoices/${invoice.id}`)}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-3 mb-2">
                                                    <h3 className="font-semibold text-lg">{invoice.invoice_number}</h3>
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(invoice.status)}`}>
                                                        {getStatusIcon(invoice.status)} {invoice.status.toUpperCase()}
                                                    </span>
                                                    {isOverdue(invoice.due_date, invoice.status) && (
                                                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                            🚨 OVERDUE
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                                                    <div>
                                                        <p className="font-medium">Customer</p>
                                                        <p>{invoice.customer.name}</p>
                                                        <p>{invoice.customer.service_plan}</p>
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">Billing Period</p>
                                                        <p>{new Date(invoice.billing_period_start).toLocaleDateString()} - {new Date(invoice.billing_period_end).toLocaleDateString()}</p>
                                                        <p className={`font-medium ${isOverdue(invoice.due_date, invoice.status) ? 'text-red-600' : ''}`}>
                                                            Due: {new Date(invoice.due_date).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">Amount</p>
                                                        <p className="text-lg font-semibold text-gray-900">
                                                            {formatCurrency(invoice.amount)}
                                                        </p>
                                                        {invoice.paid_amount > 0 && (
                                                            <p className="text-green-600">
                                                                Paid: {formatCurrency(invoice.paid_amount)}
                                                            </p>
                                                        )}
                                                        {invoice.amount > invoice.paid_amount && (
                                                            <p className="text-red-600">
                                                                Balance: {formatCurrency(invoice.amount - invoice.paid_amount)}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex space-x-2">
                                                <Button 
                                                    variant="outline" 
                                                    size="sm"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        router.visit(`/invoices/${invoice.id}/edit`);
                                                    }}
                                                    disabled={invoice.status === 'paid'}
                                                >
                                                    ✏️ Edit
                                                </Button>
                                                <Button 
                                                    variant="outline" 
                                                    size="sm"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        router.visit(`/payments/create?invoice_id=${invoice.id}`);
                                                    }}
                                                    disabled={invoice.status === 'paid'}
                                                >
                                                    💳 Payment
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">📄</div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">No invoices yet</h3>
                                <p className="text-gray-600 mb-6">Create your first invoice to start billing customers</p>
                                <Button 
                                    onClick={() => router.visit('/invoices/create')}
                                    className="bg-blue-600 hover:bg-blue-700"
                                >
                                    ➕ Create Your First Invoice
                                </Button>
                            </div>
                        )}

                        {/* Pagination */}
                        {invoices.last_page > 1 && (
                            <div className="flex items-center justify-between mt-6 pt-4 border-t">
                                <div className="text-sm text-gray-500">
                                    Showing {((invoices.current_page - 1) * invoices.per_page) + 1} to{' '}
                                    {Math.min(invoices.current_page * invoices.per_page, invoices.total)} of{' '}
                                    {invoices.total} results
                                </div>
                                <div className="flex space-x-2">
                                    {invoices.current_page > 1 && (
                                        <Button 
                                            variant="outline" 
                                            size="sm"
                                            onClick={() => router.visit(`/invoices?page=${invoices.current_page - 1}`)}
                                        >
                                            Previous
                                        </Button>
                                    )}
                                    {invoices.current_page < invoices.last_page && (
                                        <Button 
                                            variant="outline" 
                                            size="sm"
                                            onClick={() => router.visit(`/invoices?page=${invoices.current_page + 1}`)}
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
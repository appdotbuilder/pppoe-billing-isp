import React from 'react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { router } from '@inertiajs/react';
import Heading from '@/components/heading';

interface DashboardStats {
    total_customers: number;
    active_customers: number;
    suspended_customers: number;
    total_invoices: number;
    overdue_invoices: number;
    unpaid_amount: number;
    monthly_revenue: number;
    pending_payments: number;
}

interface RecentItem {
    id: number;
    name?: string;
    email?: string;
    invoice_number?: string;
    amount?: number;
    status?: string;
    created_at: string;
    customer?: {
        name: string;
        email: string;
    };
}

interface ChartData {
    monthlyRevenue: Array<{ month: string; revenue: number }>;
    serviceStatus: Array<{ status: string; count: number; color: string }>;
}

interface Props {
    stats: DashboardStats;
    recent: {
        customers: RecentItem[];
        invoices: RecentItem[];
        payments: RecentItem[];
    };
    charts: ChartData;
    [key: string]: unknown;
}

export default function Dashboard({ stats, recent, charts }: Props) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const statCards = [
        {
            title: 'Total Customers',
            value: stats.total_customers.toLocaleString(),
            icon: '👥',
            color: 'blue',
            change: '+12%',
            changeType: 'positive'
        },
        {
            title: 'Active Services',
            value: stats.active_customers.toLocaleString(),
            icon: '🟢',
            color: 'green',
            change: `${stats.suspended_customers} suspended`,
            changeType: 'neutral'
        },
        {
            title: 'Monthly Revenue',
            value: formatCurrency(stats.monthly_revenue),
            icon: '💰',
            color: 'purple',
            change: '+8.2%',
            changeType: 'positive'
        },
        {
            title: 'Unpaid Amount',
            value: formatCurrency(stats.unpaid_amount),
            icon: '⚠️',
            color: 'orange',
            change: `${stats.overdue_invoices} overdue`,
            changeType: 'negative'
        }
    ];

    return (
        <AppShell>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <Heading title="📊 ISP Dashboard" />
                    <div className="flex space-x-3">
                        <Button 
                            variant="outline"
                            onClick={() => router.visit('/customers/create')}
                        >
                            👥 Add Customer
                        </Button>
                        <Button 
                            onClick={() => router.visit('/invoices/create')}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            📄 Create Invoice
                        </Button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statCards.map((card, index) => (
                        <Card key={index} className="hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-gray-600">
                                    {card.title}
                                </CardTitle>
                                <div className="text-2xl">{card.icon}</div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-gray-900 mb-1">
                                    {card.value}
                                </div>
                                <p className={`text-xs ${
                                    card.changeType === 'positive' ? 'text-green-600' : 
                                    card.changeType === 'negative' ? 'text-red-600' : 'text-gray-500'
                                }`}>
                                    {card.change}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <span>⚡</span>
                            <span>Quick Actions</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Button 
                                variant="outline" 
                                className="h-auto p-4 flex flex-col space-y-2"
                                onClick={() => router.visit('/customers')}
                            >
                                <span className="text-2xl">👥</span>
                                <div className="text-center">
                                    <div className="font-semibold">Manage Customers</div>
                                    <div className="text-sm text-gray-500">View all customer accounts</div>
                                </div>
                            </Button>
                            <Button 
                                variant="outline" 
                                className="h-auto p-4 flex flex-col space-y-2"
                                onClick={() => router.visit('/invoices')}
                            >
                                <span className="text-2xl">📄</span>
                                <div className="text-center">
                                    <div className="font-semibold">Invoice Management</div>
                                    <div className="text-sm text-gray-500">Create and track invoices</div>
                                </div>
                            </Button>
                            <Button 
                                variant="outline" 
                                className="h-auto p-4 flex flex-col space-y-2"
                                onClick={() => router.visit('/payments')}
                            >
                                <span className="text-2xl">💳</span>
                                <div className="text-center">
                                    <div className="font-semibold">Payment Tracking</div>
                                    <div className="text-sm text-gray-500">Record and confirm payments</div>
                                </div>
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Recent Customers */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <span>👥</span>
                                    <span>Recent Customers</span>
                                </div>
                                <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => router.visit('/customers')}
                                >
                                    View All
                                </Button>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recent.customers.slice(0, 5).map((customer) => (
                                    <div key={customer.id} className="flex items-center justify-between">
                                        <div>
                                            <div className="font-semibold text-sm">{customer.name}</div>
                                            <div className="text-xs text-gray-500">{customer.email}</div>
                                        </div>
                                        <div className="text-xs text-gray-400">
                                            {new Date(customer.created_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                ))}
                                {recent.customers.length === 0 && (
                                    <div className="text-center text-gray-500 py-4">
                                        No customers yet
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Invoices */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <span>📄</span>
                                    <span>Recent Invoices</span>
                                </div>
                                <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => router.visit('/invoices')}
                                >
                                    View All
                                </Button>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recent.invoices.slice(0, 5).map((invoice) => (
                                    <div key={invoice.id} className="flex items-center justify-between">
                                        <div>
                                            <div className="font-semibold text-sm">{invoice.invoice_number}</div>
                                            <div className="text-xs text-gray-500">
                                                {invoice.customer?.name}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm font-semibold">
                                                {formatCurrency(invoice.amount || 0)}
                                            </div>
                                            <div className={`text-xs px-2 py-1 rounded-full ${
                                                invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                                                invoice.status === 'overdue' ? 'bg-red-100 text-red-800' :
                                                'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {invoice.status}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {recent.invoices.length === 0 && (
                                    <div className="text-center text-gray-500 py-4">
                                        No invoices yet
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Payments */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <span>💳</span>
                                    <span>Recent Payments</span>
                                </div>
                                <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => router.visit('/payments')}
                                >
                                    View All
                                </Button>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recent.payments.slice(0, 5).map((payment) => (
                                    <div key={payment.id} className="flex items-center justify-between">
                                        <div>
                                            <div className="font-semibold text-sm">
                                                {payment.customer?.name}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {new Date(payment.created_at).toLocaleDateString()}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm font-semibold">
                                                {formatCurrency(payment.amount || 0)}
                                            </div>
                                            <div className={`text-xs px-2 py-1 rounded-full ${
                                                payment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                                payment.status === 'failed' ? 'bg-red-100 text-red-800' :
                                                'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {payment.status}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {recent.payments.length === 0 && (
                                    <div className="text-center text-gray-500 py-4">
                                        No payments yet
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Service Status Overview */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <span>📊</span>
                            <span>Service Status Overview</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {charts.serviceStatus.map((status, index) => (
                                <div key={index} className="text-center">
                                    <div 
                                        className="w-16 h-16 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold text-lg"
                                        style={{ backgroundColor: status.color }}
                                    >
                                        {status.count}
                                    </div>
                                    <div className="font-semibold">{status.status}</div>
                                    <div className="text-sm text-gray-500">
                                        {((status.count / stats.total_customers) * 100).toFixed(1)}%
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppShell>
    );
}
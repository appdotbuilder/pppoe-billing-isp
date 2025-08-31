import React from 'react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { router } from '@inertiajs/react';
import Heading from '@/components/heading';

interface Customer {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    pppoe_username: string;
    service_plan: string;
    monthly_fee: number;
    bandwidth_download: number;
    bandwidth_upload: number;
    status: 'active' | 'suspended' | 'terminated';
    service_start_date: string;
    invoices_count: number;
    payments_count: number;
    created_at: string;
}

interface Props {
    customers: {
        data: Customer[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    [key: string]: unknown;
}

export default function CustomersIndex({ customers }: Props) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const getStatusBadge = (status: string) => {
        const badges = {
            active: 'bg-green-100 text-green-800',
            suspended: 'bg-yellow-100 text-yellow-800',
            terminated: 'bg-red-100 text-red-800'
        };
        return badges[status as keyof typeof badges] || 'bg-gray-100 text-gray-800';
    };

    const getStatusIcon = (status: string) => {
        const icons = {
            active: '🟢',
            suspended: '🟡',
            terminated: '🔴'
        };
        return icons[status as keyof typeof icons] || '⚪';
    };

    return (
        <AppShell>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <Heading title="👥 Customer Management" />
                    <Button 
                        onClick={() => router.visit('/customers/create')}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        ➕ Add New Customer
                    </Button>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Total Customers</p>
                                    <p className="text-2xl font-bold">{customers.total}</p>
                                </div>
                                <div className="text-2xl">👥</div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Active Services</p>
                                    <p className="text-2xl font-bold text-green-600">
                                        {customers.data.filter(c => c.status === 'active').length}
                                    </p>
                                </div>
                                <div className="text-2xl">🟢</div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Suspended</p>
                                    <p className="text-2xl font-bold text-yellow-600">
                                        {customers.data.filter(c => c.status === 'suspended').length}
                                    </p>
                                </div>
                                <div className="text-2xl">🟡</div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">Terminated</p>
                                    <p className="text-2xl font-bold text-red-600">
                                        {customers.data.filter(c => c.status === 'terminated').length}
                                    </p>
                                </div>
                                <div className="text-2xl">🔴</div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Customer List */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <span>📋</span>
                            <span>Customer List</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {customers.data.length > 0 ? (
                            <div className="space-y-4">
                                {customers.data.map((customer) => (
                                    <div 
                                        key={customer.id} 
                                        className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                                        onClick={() => router.visit(`/customers/${customer.id}`)}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-3 mb-2">
                                                    <h3 className="font-semibold text-lg">{customer.name}</h3>
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(customer.status)}`}>
                                                        {getStatusIcon(customer.status)} {customer.status.toUpperCase()}
                                                    </span>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                                                    <div>
                                                        <p className="font-medium">Contact</p>
                                                        <p>{customer.email}</p>
                                                        <p>{customer.phone || 'No phone'}</p>
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">Service Details</p>
                                                        <p>🌐 {customer.service_plan}</p>
                                                        <p>⚡ {customer.bandwidth_download}/{customer.bandwidth_upload} Mbps</p>
                                                        <p>💰 {formatCurrency(customer.monthly_fee)}/month</p>
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">PPPoE Account</p>
                                                        <p>👤 {customer.pppoe_username}</p>
                                                        <p>📅 Since {new Date(customer.service_start_date).toLocaleDateString()}</p>
                                                        <p>📊 {customer.invoices_count} invoices, {customer.payments_count} payments</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex space-x-2">
                                                <Button 
                                                    variant="outline" 
                                                    size="sm"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        router.visit(`/customers/${customer.id}/edit`);
                                                    }}
                                                >
                                                    ✏️ Edit
                                                </Button>
                                                <Button 
                                                    variant="outline" 
                                                    size="sm"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        router.visit(`/invoices/create?customer_id=${customer.id}`);
                                                    }}
                                                >
                                                    📄 Invoice
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">👥</div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">No customers yet</h3>
                                <p className="text-gray-600 mb-6">Get started by adding your first customer</p>
                                <Button 
                                    onClick={() => router.visit('/customers/create')}
                                    className="bg-blue-600 hover:bg-blue-700"
                                >
                                    ➕ Add Your First Customer
                                </Button>
                            </div>
                        )}

                        {/* Pagination */}
                        {customers.last_page > 1 && (
                            <div className="flex items-center justify-between mt-6 pt-4 border-t">
                                <div className="text-sm text-gray-500">
                                    Showing {((customers.current_page - 1) * customers.per_page) + 1} to{' '}
                                    {Math.min(customers.current_page * customers.per_page, customers.total)} of{' '}
                                    {customers.total} results
                                </div>
                                <div className="flex space-x-2">
                                    {customers.current_page > 1 && (
                                        <Button 
                                            variant="outline" 
                                            size="sm"
                                            onClick={() => router.visit(`/customers?page=${customers.current_page - 1}`)}
                                        >
                                            Previous
                                        </Button>
                                    )}
                                    {customers.current_page < customers.last_page && (
                                        <Button 
                                            variant="outline" 
                                            size="sm"
                                            onClick={() => router.visit(`/customers?page=${customers.current_page + 1}`)}
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
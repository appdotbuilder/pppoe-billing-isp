import React from 'react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { router, useForm } from '@inertiajs/react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';



export default function CreateCustomer() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        phone: '',
        address: '',
        pppoe_username: '',
        pppoe_password: '',
        service_plan: '',
        monthly_fee: '',
        bandwidth_download: '',
        bandwidth_upload: '',
        status: 'active',
        service_start_date: new Date().toISOString().split('T')[0],
        notes: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/customers', {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const servicePlans = [
        { name: 'Basic 10Mbps', download: 10, upload: 5, price: 300000 },
        { name: 'Standard 20Mbps', download: 20, upload: 10, price: 500000 },
        { name: 'Premium 50Mbps', download: 50, upload: 25, price: 1200000 },
        { name: 'Business 100Mbps', download: 100, upload: 50, price: 2500000 },
        { name: 'Enterprise 200Mbps', download: 200, upload: 100, price: 5000000 },
    ];

    const handleServicePlanChange = (planName: string) => {
        const plan = servicePlans.find(p => p.name === planName);
        if (plan) {
            setData({
                ...data,
                service_plan: planName,
                bandwidth_download: plan.download.toString(),
                bandwidth_upload: plan.upload.toString(),
                monthly_fee: plan.price.toString(),
            });
        }
    };

    const generatePPPoEUsername = () => {
        const username = data.name.toLowerCase()
            .replace(/[^a-z\s]/g, '')
            .replace(/\s+/g, '')
            .substring(0, 8) + Math.floor(Math.random() * 1000);
        setData('pppoe_username', username);
    };

    const generatePPPoEPassword = () => {
        const password = Math.random().toString(36).slice(-8);
        setData('pppoe_password', password);
    };

    return (
        <AppShell>
            <div className="space-y-6">
                <div className="flex items-center space-x-4">
                    <Button 
                        variant="outline"
                        onClick={() => router.visit('/customers')}
                    >
                        ← Back to Customers
                    </Button>
                    <Heading title="➕ Add New Customer" />
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Customer Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <span>👤</span>
                                <span>Customer Information</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="name">Full Name *</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Enter customer name"
                                    />
                                    <InputError message={errors.name} className="mt-1" />
                                </div>
                                <div>
                                    <Label htmlFor="email">Email Address *</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="customer@example.com"
                                    />
                                    <InputError message={errors.email} className="mt-1" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input
                                        id="phone"
                                        type="text"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        placeholder="021-555-0000"
                                    />
                                    <InputError message={errors.phone} className="mt-1" />
                                </div>
                                <div>
                                    <Label htmlFor="service_start_date">Service Start Date *</Label>
                                    <Input
                                        id="service_start_date"
                                        type="date"
                                        value={data.service_start_date}
                                        onChange={(e) => setData('service_start_date', e.target.value)}
                                    />
                                    <InputError message={errors.service_start_date} className="mt-1" />
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="address">Address *</Label>
                                <Textarea
                                    id="address"
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                    placeholder="Enter customer address"
                                    rows={3}
                                />
                                <InputError message={errors.address} className="mt-1" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* PPPoE Account */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <span>🔐</span>
                                <span>PPPoE Account Details</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="pppoe_username">PPPoE Username *</Label>
                                    <div className="flex space-x-2">
                                        <Input
                                            id="pppoe_username"
                                            type="text"
                                            value={data.pppoe_username}
                                            onChange={(e) => setData('pppoe_username', e.target.value)}
                                            placeholder="username123"
                                        />
                                        <Button 
                                            type="button"
                                            variant="outline"
                                            onClick={generatePPPoEUsername}
                                        >
                                            🎲 Generate
                                        </Button>
                                    </div>
                                    <InputError message={errors.pppoe_username} className="mt-1" />
                                </div>
                                <div>
                                    <Label htmlFor="pppoe_password">PPPoE Password *</Label>
                                    <div className="flex space-x-2">
                                        <Input
                                            id="pppoe_password"
                                            type="text"
                                            value={data.pppoe_password}
                                            onChange={(e) => setData('pppoe_password', e.target.value)}
                                            placeholder="password123"
                                        />
                                        <Button 
                                            type="button"
                                            variant="outline"
                                            onClick={generatePPPoEPassword}
                                        >
                                            🎲 Generate
                                        </Button>
                                    </div>
                                    <InputError message={errors.pppoe_password} className="mt-1" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Service Plan */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <span>🌐</span>
                                <span>Service Plan & Pricing</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="service_plan">Service Plan *</Label>
                                <Select value={data.service_plan} onValueChange={handleServicePlanChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a service plan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {servicePlans.map((plan) => (
                                            <SelectItem key={plan.name} value={plan.name}>
                                                {plan.name} - {plan.download}/{plan.upload} Mbps - Rp {plan.price.toLocaleString()}/month
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.service_plan} className="mt-1" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <Label htmlFor="monthly_fee">Monthly Fee (IDR) *</Label>
                                    <Input
                                        id="monthly_fee"
                                        type="number"
                                        value={data.monthly_fee}
                                        onChange={(e) => setData('monthly_fee', e.target.value)}
                                        placeholder="500000"
                                    />
                                    <InputError message={errors.monthly_fee} className="mt-1" />
                                </div>
                                <div>
                                    <Label htmlFor="bandwidth_download">Download (Mbps) *</Label>
                                    <Input
                                        id="bandwidth_download"
                                        type="number"
                                        value={data.bandwidth_download}
                                        onChange={(e) => setData('bandwidth_download', e.target.value)}
                                        placeholder="25"
                                    />
                                    <InputError message={errors.bandwidth_download} className="mt-1" />
                                </div>
                                <div>
                                    <Label htmlFor="bandwidth_upload">Upload (Mbps) *</Label>
                                    <Input
                                        id="bandwidth_upload"
                                        type="number"
                                        value={data.bandwidth_upload}
                                        onChange={(e) => setData('bandwidth_upload', e.target.value)}
                                        placeholder="10"
                                    />
                                    <InputError message={errors.bandwidth_upload} className="mt-1" />
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="status">Service Status *</Label>
                                <Select value={data.status} onValueChange={(value) => setData('status', value)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">🟢 Active</SelectItem>
                                        <SelectItem value="suspended">🟡 Suspended</SelectItem>
                                        <SelectItem value="terminated">🔴 Terminated</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.status} className="mt-1" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Additional Notes */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center space-x-2">
                                <span>📝</span>
                                <span>Additional Notes</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div>
                                <Label htmlFor="notes">Notes</Label>
                                <Textarea
                                    id="notes"
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    placeholder="Any additional notes about this customer..."
                                    rows={3}
                                />
                                <InputError message={errors.notes} className="mt-1" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Submit Button */}
                    <div className="flex justify-end space-x-4">
                        <Button 
                            type="button"
                            variant="outline"
                            onClick={() => router.visit('/customers')}
                        >
                            Cancel
                        </Button>
                        <Button 
                            type="submit"
                            disabled={processing}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            {processing ? 'Creating...' : '✅ Create Customer'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppShell>
    );
}
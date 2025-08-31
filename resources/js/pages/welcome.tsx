import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePage } from '@inertiajs/react';
import { router } from '@inertiajs/react';

interface User {
    id: number;
    name: string;
    email: string;
}

export default function Welcome() {
    const { auth } = usePage<{ auth: { user: User | null } }>().props;

    const handleGetStarted = () => {
        if (auth.user) {
            router.visit('/dashboard');
        } else {
            router.visit('/login');
        }
    };

    const features = [
        {
            icon: '👥',
            title: 'Customer Management',
            description: 'Manage PPPoE customer accounts, service plans, and connection details with ease.',
            items: ['Create & edit customer accounts', 'Manage PPPoE credentials', 'Track service status']
        },
        {
            icon: '📄',
            title: 'Invoice Generation',
            description: 'Automated postpaid billing system with customizable invoice templates.',
            items: ['Monthly billing automation', 'Custom billing periods', 'Professional invoice templates']
        },
        {
            icon: '💳',
            title: 'Payment Tracking',
            description: 'Complete payment management with multiple payment methods and tracking.',
            items: ['Multiple payment methods', 'Payment confirmation', 'Payment history tracking']
        },
        {
            icon: '📊',
            title: 'Analytics Dashboard',
            description: 'Comprehensive reporting and analytics for your ISP business insights.',
            items: ['Revenue analytics', 'Customer insights', 'Service performance metrics']
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-lg">📡</span>
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">ISP Billing Pro</h1>
                                <p className="text-sm text-gray-600">PPPoE Management System</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            {auth.user ? (
                                <Button onClick={() => router.visit('/dashboard')} className="bg-blue-600 hover:bg-blue-700">
                                    Go to Dashboard
                                </Button>
                            ) : (
                                <div className="space-x-3">
                                    <Button variant="outline" onClick={() => router.visit('/login')}>
                                        Login
                                    </Button>
                                    <Button onClick={() => router.visit('/register')} className="bg-blue-600 hover:bg-blue-700">
                                        Register
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="mb-8">
                        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                            🌐 ISP Billing Management
                            <span className="block text-blue-600">Made Simple</span>
                        </h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                            Complete PPPoE billing solution for Internet Service Providers. Manage customers, 
                            generate invoices, track payments, and grow your ISP business efficiently.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button 
                                onClick={handleGetStarted}
                                className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3 h-auto"
                            >
                                🚀 Get Started Now
                            </Button>
                            <Button 
                                variant="outline" 
                                className="text-lg px-8 py-3 h-auto"
                                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                            >
                                📋 View Features
                            </Button>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-16">
                        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border">
                            <div className="text-3xl font-bold text-blue-600 mb-2">💯</div>
                            <div className="text-xl font-semibold text-gray-900">Complete Solution</div>
                            <div className="text-gray-600">All-in-one ISP management</div>
                        </div>
                        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border">
                            <div className="text-3xl font-bold text-green-600 mb-2">⚡</div>
                            <div className="text-xl font-semibold text-gray-900">Fast & Reliable</div>
                            <div className="text-gray-600">Built for performance</div>
                        </div>
                        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border">
                            <div className="text-3xl font-bold text-purple-600 mb-2">🔒</div>
                            <div className="text-xl font-semibold text-gray-900">Secure</div>
                            <div className="text-gray-600">Enterprise-grade security</div>
                        </div>
                        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 border">
                            <div className="text-3xl font-bold text-orange-600 mb-2">📈</div>
                            <div className="text-xl font-semibold text-gray-900">Scalable</div>
                            <div className="text-gray-600">Grows with your business</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            🎯 Everything You Need to Run Your ISP
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            From customer onboarding to revenue tracking, our comprehensive platform 
                            handles every aspect of ISP billing and customer management.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                        {features.map((feature, index) => (
                            <Card key={index} className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow duration-300">
                                <CardHeader>
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center mb-4">
                                        <span className="text-2xl">{feature.icon}</span>
                                    </div>
                                    <CardTitle className="text-xl text-gray-900">{feature.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600 mb-4">{feature.description}</p>
                                    <ul className="space-y-2">
                                        {feature.items.map((item, itemIndex) => (
                                            <li key={itemIndex} className="flex items-center text-sm text-gray-700">
                                                <span className="text-green-500 mr-2">✓</span>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Demo Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-indigo-600">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl font-bold text-white mb-6">
                        🎮 Ready to Transform Your ISP Business?
                    </h2>
                    <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                        Join hundreds of ISPs already using our platform to streamline their operations, 
                        reduce manual work, and increase revenue.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button 
                            onClick={handleGetStarted}
                            className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-3 h-auto"
                        >
                            🚀 Start Managing Your ISP Today
                        </Button>
                        <Button 
                            variant="outline" 
                            className="border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-3 h-auto"
                            onClick={() => router.visit('/login')}
                        >
                            👤 Existing User? Login
                        </Button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center">
                        <div className="flex items-center justify-center space-x-3 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-lg">📡</span>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">ISP Billing Pro</h3>
                                <p className="text-gray-400 text-sm">Professional PPPoE Management</p>
                            </div>
                        </div>
                        <p className="text-gray-400 mb-6">
                            Built with ❤️ for Internet Service Providers worldwide
                        </p>
                        <div className="border-t border-gray-800 pt-6">
                            <p className="text-gray-500 text-sm">
                                © 2024 ISP Billing Pro. All rights reserved. 🌐
                            </p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
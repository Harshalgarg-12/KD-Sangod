"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Users,
    Store,
    ArrowRightLeft,
    FileText,
    User,
    ShieldAlert,
    MapPin,
    X,
    Scale
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
    const pathname = usePathname();
    const { admin } = useAuth();

    const menuItems = [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Customers', path: '/customers', icon: Users },
        { name: 'Suppliers', path: '/suppliers', icon: Store },
        { name: 'Transactions', path: '/transactions', icon: ArrowRightLeft },
        { name: 'Reports', path: '/reports', icon: FileText },
        { name: 'Profile', path: '/profile', icon: User },
    ];

    const handleLinkClick = () => {
        setSidebarOpen(false);
    };

    const SidebarContent = () => (
        <div className="flex h-full flex-col border-r border-white/20 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl transition-all duration-300">
            {/* Brand Header */}
            <div className="flex h-16 items-center justify-between px-6 border-b border-slate-200/50 dark:border-white/10">
                <Link href="/dashboard" className="flex items-center gap-2" onClick={handleLinkClick}>
                    <Scale className="h-6 w-6 text-primary" />
                    <span className="text-lg font-black tracking-wider text-slate-800 dark:text-white uppercase">
                        KD SANGOD
                    </span>
                </Link>
                <button
                    onClick={() => setSidebarOpen(false)}
                    className="rounded-xl p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 lg:hidden"
                >
                    <X className="h-5 w-5" />
                </button>
            </div>

            {/* Navigation links */}
            <nav className="flex-1 space-y-1.5 px-4 py-6 overflow-y-auto">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.path || pathname.startsWith(item.path + '/');
                    return (
                        <Link
                            key={item.path}
                            href={item.path}
                            onClick={handleLinkClick}
                            className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-semibold tracking-wide transition-all ${isActive
                                ? 'bg-primary text-white shadow-lg shadow-primary/25'
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
                                }`}
                        >
                            <Icon className={`h-5 w-5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`} />
                            {item.name}
                        </Link>
                    );
                })}

                {/* Superadmin restricted section */}
                {admin?.role === 'SUPER_ADMIN' && (
                    <>
                        <div className="pt-6 pb-2 px-4">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                                System Control
                            </span>
                        </div>
                        <Link
                            href="/add-admin"
                            onClick={handleLinkClick}
                            className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-semibold tracking-wide transition-all ${pathname === '/add-admin'
                                ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/25'
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
                                }`}
                        >
                            <ShieldAlert className="h-5 w-5 shrink-0" />
                            Add Admin
                        </Link>
                        {/* Location management link — lets admins add/remove locations */}
                        <Link
                            href="/locations"
                            onClick={handleLinkClick}
                            className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-semibold tracking-wide transition-all ${pathname === '/locations'
                                ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/25'
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'
                                }`}
                        >
                            <MapPin className="h-5 w-5 shrink-0" />
                            Locations
                        </Link>
                    </>
                )}
            </nav>
        </div>
    );

    return (
        <>
            {/* Mobile Drawer Backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Slide-in drawer container */}
            <aside
                className={`fixed top-0 bottom-0 left-0 z-50 w-64 transform transition-transform duration-300 lg:translate-x-0 lg:static lg:block ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <SidebarContent />
            </aside>
        </>
    );
}

"use client";

import React from 'react';
import { Menu, LogOut, User, Store } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function Header({ sidebarOpen, setSidebarOpen }) {
    const { admin, logout } = useAuth();

    return (
        <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-white/20 bg-white/60 dark:bg-slate-900/60 px-4 shadow-sm backdrop-blur-xl transition-all sm:px-6">
            <div className="flex items-center gap-3">
                {/* Mobile menu trigger */}
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 active:scale-95 transition-all lg:hidden"
                >
                    <Menu className="h-5 w-5" />
                </button>

                {admin?.shopName && (
                    <div className="hidden lg:flex items-center gap-2 text-slate-700 dark:text-slate-300">
                        <Store className="h-4 w-4 text-primary" />
                        <span className="font-bold text-sm tracking-wide uppercase">
                            {admin.shopName}
                        </span>
                    </div>
                )}
            </div>

            <div className="flex items-center gap-4">
                {admin && (
                    <Link href="/profile" className="flex items-center gap-3 border-r border-slate-200/50 dark:border-white/10 pr-4 hover:opacity-80 transition-opacity">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary dark:text-indigo-400">
                            <User className="h-4 w-4" />
                        </div>
                        <div className="hidden text-left sm:block">
                            <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                {admin.name}
                            </p>
                            <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-semibold">
                                {admin.role.replace('_', ' ')}
                            </p>
                        </div>
                    </Link>
                )}

                <button
                    onClick={logout}
                    className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 hover:bg-red-500/10 hover:text-danger active:scale-95 transition-all"
                    title="Logout"
                >
                    <LogOut className="h-4 w-4" />
                </button>
            </div>
        </header>
    );
}

import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Button({
    children,
    onClick,
    type = 'button',
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    className = '',
    icon: Icon = null,
    ...props
}) {
    const baseStyle =
        'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
        primary:
            'bg-primary hover:bg-indigo-700 text-white shadow-md shadow-primary/20 focus:ring-primary',
        secondary:
            'bg-white/10 hover:bg-white/20 text-slate-800 dark:text-white border border-slate-200 dark:border-white/10 focus:ring-slate-400',
        success:
            'bg-success hover:bg-emerald-600 text-white shadow-md shadow-success/20 focus:ring-success',
        danger:
            'bg-danger hover:bg-red-600 text-white shadow-md shadow-danger/20 focus:ring-danger',
        warning:
            'bg-warning hover:bg-amber-600 text-white shadow-md shadow-warning/20 focus:ring-warning',
        ghost:
            'hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300 focus:ring-slate-400',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-xs',
        md: 'px-4 py-2.5 text-sm',
        lg: 'px-6 py-3.5 text-base',
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : Icon ? (
                <Icon className="mr-2 h-4 w-4" />
            ) : null}
            {children}
        </button>
    );
}

import React from 'react';

export default function Skeleton({ className = '', variant = 'text', ...props }) {
    const baseClass = 'animate-pulse bg-slate-200 dark:bg-slate-700/60';

    const variants = {
        text: 'h-4 w-full rounded',
        circular: 'h-12 w-12 rounded-full',
        card: 'h-32 w-full rounded-2xl',
    };

    return (
        <div
            className={`${baseClass} ${variants[variant] || ''} ${className}`}
            {...props}
        />
    );
}

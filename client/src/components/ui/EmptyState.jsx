import React from 'react';
import { Inbox } from 'lucide-react';
import Button from './Button';

export default function EmptyState({
    title = 'No data found',
    description = 'There are no items to show at the moment.',
    icon: Icon = Inbox,
    actionLabel = '',
    onAction = null,
}) {
    return (
        <div className="flex flex-col items-center justify-center p-8 text-center border-2 border-dashed border-slate-200 dark:border-white/10 rounded-3xl bg-white/30 dark:bg-slate-900/10 backdrop-blur-sm">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 mb-4">
                <Icon className="h-7 w-7" />
            </div>
            <h3 className="text-md font-bold text-slate-800 dark:text-slate-200">
                {title}
            </h3>
            <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
                {description}
            </p>
            {actionLabel && onAction && (
                <Button onClick={onAction} className="mt-5" size="sm">
                    {actionLabel}
                </Button>
            )}
        </div>
    );
}

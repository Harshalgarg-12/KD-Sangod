import React from 'react';

const Input = React.forwardRef(
    (
        {
            label,
            type = 'text',
            error,
            id,
            className = '',
            required = false,
            ...props
        },
        ref
    ) => {
        return (
            <div className="w-full">
                {label && (
                    <label
                        htmlFor={id}
                        className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2"
                    >
                        {label} {required && <span className="text-danger">*</span>}
                    </label>
                )}
                <div className="relative">
                    <input
                        id={id}
                        type={type}
                        ref={ref}
                        className={`glass-input w-full ${error ? 'border-danger focus:border-danger focus:ring-danger' : ''} ${className}`}
                        {...props}
                    />
                </div>
                {error && (
                    <p className="mt-1 text-xs text-danger font-medium animate-pulse">
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

export default Input;

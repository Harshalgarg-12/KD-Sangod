import React from 'react';

export default function Card({ children, className = '', hover = false, ...props }) {
    return (
        <div
            className={`glass-card p-5 sm:p-6 transition-all duration-200 ${hover ? 'hover:translate-y-[-2px] hover:shadow-lg' : ''
                } ${className}`}
            {...props}
        >
            {children}
        </div>
    );
}

"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Search, Loader2 } from 'lucide-react';
import axiosInstance from '@/lib/axiosInstance';

export default function SearchableCombobox({
    onSelect,
    placeholder = 'Search by name or phone...',
    typeFilter = '', // CUSTOMER or SUPPLIER or empty
}) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedParty, setSelectedParty] = useState(null);

    const containerRef = useRef(null);

    // Debounced search logic
    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            return;
        }

        const delayDebounceFn = setTimeout(async () => {
            setLoading(true);
            try {
                let url = `/parties?search=${encodeURIComponent(query)}`;
                if (typeFilter) {
                    url += `&type=${typeFilter}`;
                }
                const { data } = await axiosInstance.get(url);
                if (data.success) {
                    setResults(data.data.results || []);
                }
            } catch (error) {
                console.error('Failed to search parties', error);
            } finally {
                setLoading(false);
            }
        }, 400);

        return () => clearTimeout(delayDebounceFn);
    }, [query, typeFilter]);

    // Click outside listener
    useEffect(() => {
        function handleClickOutside(event) {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (party) => {
        setSelectedParty(party);
        setQuery(party.name);
        setIsOpen(false);
        onSelect(party);
    };

    const handleClear = () => {
        setSelectedParty(null);
        setQuery('');
        setResults([]);
        onSelect(null);
    };

    return (
        <div className="relative w-full" ref={containerRef}>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                Select Party
            </label>
            <div className="relative flex items-center">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setIsOpen(true);
                        if (selectedParty) {
                            // Clear previous selection
                            setSelectedParty(null);
                            onSelect(null);
                        }
                    }}
                    onFocus={() => setIsOpen(true)}
                    placeholder={placeholder}
                    className="glass-input w-full pr-10"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-slate-400">
                    {loading ? (
                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    ) : (
                        <Search className="h-4 w-4" />
                    )}
                    {selectedParty && (
                        <button
                            onClick={handleClear}
                            type="button"
                            className="text-xs hover:text-danger hover:underline font-bold"
                        >
                            Clear
                        </button>
                    )}
                </div>
            </div>

            {isOpen && query.trim() && (
                <ul className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-2xl border border-white/20 bg-white/95 dark:bg-slate-900/95 p-2 shadow-xl backdrop-blur-md animate-in fade-in slide-in-from-top-1">
                    {results.length === 0 ? (
                        <li className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400 text-center">
                            {loading ? 'Searching...' : 'No parties found'}
                        </li>
                    ) : (
                        results.map((party) => (
                            <li
                                key={party._id}
                                onClick={() => handleSelect(party)}
                                className="flex items-center justify-between px-4 py-2.5 rounded-xl text-sm text-slate-700 dark:text-slate-200 hover:bg-primary hover:text-white cursor-pointer transition-colors"
                            >
                                <div>
                                    <p className="font-semibold">{party.name}</p>
                                    <p className="text-xs opacity-80">{party.phone}</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-350">
                                        {party.type}
                                    </span>
                                    {party.fathersName && (
                                        <p className="text-[10px] opacity-75">{party.fathersName}</p>
                                    )}
                                </div>
                            </li>
                        ))
                    )}
                </ul>
            )}
        </div>
    );
}

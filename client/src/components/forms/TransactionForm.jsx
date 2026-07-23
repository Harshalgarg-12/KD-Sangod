"use client";

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { transactionFormSchema } from '@/utils/validationSchemas';
import SearchableCombobox from '../shared/SearchableCombobox';
import Input from '../ui/Input';
import Button from '../ui/Button';
import axiosInstance from '@/lib/axiosInstance';
import toast from 'react-hot-toast';

// Utility to format INR
const formatInr = (n) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 2,
    }).format(n);
};

export default function TransactionForm({ onSubmit, loading = false, typeFilter = '', initialPartyId = '' }) {
    const [selectedParty, setSelectedParty] = useState(null);
    const [resultingBalance, setResultingBalance] = useState(0);
    const [fetchingParty, setFetchingParty] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(transactionFormSchema),
        defaultValues: {
            partyId: '',
            amount: '',
            type: 'CREDIT', // default: Lena (You Gave)
            remarks: '',
            date: new Date().toISOString().split('T')[0],
        },
    });

    const amountStr = watch('amount');
    const type = watch('type');

    // Fetch initial party if initialPartyId is provided
    useEffect(() => {
        if (!initialPartyId) return;

        const fetchParty = async () => {
            setFetchingParty(true);
            try {
                const { data } = await axiosInstance.get(`/parties/${initialPartyId}`);
                if (data.success && data.data) {
                    setSelectedParty(data.data);
                    setValue('partyId', data.data._id);
                }
            } catch (error) {
                console.error("Failed to fetch initial party details", error);
                toast.error("Failed to load party details");
            } finally {
                setFetchingParty(false);
            }
        };
        fetchParty();
    }, [initialPartyId, setValue]);

    // Recalculate live balance preview
    useEffect(() => {
        if (!selectedParty) {
            setResultingBalance(0);
            return;
        }

        const currentBalance = selectedParty.netBalance || 0;
        const amountVal = parseFloat(amountStr) || 0;

        // CREDIT increases party's owed balance ( receivable / Lena ); DEBIT decreases it ( payable / Dena )
        const change = type === 'CREDIT' ? amountVal : -amountVal;
        setResultingBalance(currentBalance + change);
    }, [selectedParty, amountStr, type]);

    const handlePartySelect = (party) => {
        setSelectedParty(party);
        setValue('partyId', party?._id || '');
    };

    const handleFormSubmit = (data) => {
        onSubmit({
            partyId: data.partyId,
            amount: Number(data.amount),
            type: data.type,
            remarks: data.remarks || '',
            date: data.date ? new Date(data.date).toISOString() : undefined,
        });
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            {/* Party Autocomplete or Pre-selected Party Display */}
            <div>
                {!initialPartyId ? (
                    <>
                        <SearchableCombobox onSelect={handlePartySelect} typeFilter={typeFilter} />
                        {errors.partyId && (
                            <p className="mt-1 text-xs text-danger font-medium">{errors.partyId.message}</p>
                        )}
                    </>
                ) : (
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                            Selected Party
                        </label>
                        {fetchingParty ? (
                            <div className="glass-input flex items-center justify-center p-3">
                                <span className="text-xs text-slate-400">Loading party details...</span>
                            </div>
                        ) : selectedParty ? (
                            <div className="glass-input flex items-center justify-between p-3">
                                <div>
                                    <p className="font-bold text-slate-800 dark:text-white leading-tight">
                                        {selectedParty.name}
                                    </p>
                                    <p className="text-xs text-slate-500">{selectedParty.phone}</p>
                                </div>
                                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                                    {selectedParty.type}
                                </span>
                            </div>
                        ) : (
                            <div className="glass-input flex items-center p-3 text-danger text-xs font-medium">
                                Failed to load party details.
                            </div>
                        )}
                        {/* Hidden input for validation to work seamlessly */}
                        <input type="hidden" {...register('partyId')} />
                    </div>
                )}
            </div>

            {selectedParty && (
                <div className="rounded-2xl bg-slate-50 dark:bg-white/5 p-4 space-y-2 border border-slate-200/50 dark:border-white/5">
                    <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Current Balance:</span>
                        <span
                            className={`font-semibold ${selectedParty.netBalance > 0
                                ? 'text-success'
                                : selectedParty.netBalance < 0
                                    ? 'text-danger'
                                    : 'text-slate-600 dark:text-slate-350'
                                }`}
                        >
                            {formatInr(selectedParty.netBalance)} ({selectedParty.netBalance >= 0 ? 'Lena' : 'Dena'})
                        </span>
                    </div>
                    <div className="flex justify-between text-sm border-t border-slate-200/50 dark:border-white/5 pt-2">
                        <span className="text-slate-500">Resulting Balance:</span>
                        <span
                            className={`font-bold ${resultingBalance > 0
                                ? 'text-success'
                                : resultingBalance < 0
                                    ? 'text-danger'
                                    : 'text-slate-600 dark:text-slate-350'
                                }`}
                        >
                            {formatInr(resultingBalance)} ({resultingBalance >= 0 ? 'Lena' : 'Dena'})
                        </span>
                    </div>
                </div>
            )}

            {/* Transaction Type selection */}
            <div className="w-full">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                    Transaction Type <span className="text-danger">*</span>
                </label>
                <div className="grid grid-cols-2 gap-4">
                    <button
                        type="button"
                        onClick={() => setValue('type', 'CREDIT')}
                        className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all ${type === 'CREDIT'
                            ? 'border-success bg-emerald-500/10 text-success'
                            : 'border-slate-200 dark:border-white/10 text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5'
                            }`}
                    >
                        <span className="text-md font-bold">🟢 CREDIT</span>
                        <span className="text-[10px] uppercase font-semibold opacity-75">You Gave (Lena)</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setValue('type', 'DEBIT')}
                        className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all ${type === 'DEBIT'
                            ? 'border-danger bg-red-500/10 text-danger'
                            : 'border-slate-200 dark:border-white/10 text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5'
                            }`}
                    >
                        <span className="text-md font-bold">🔴 DEBIT</span>
                        <span className="text-[10px] uppercase font-semibold opacity-75">You Got (Dena)</span>
                    </button>
                </div>
                {errors.type && (
                    <p className="mt-1 text-xs text-danger font-medium">{errors.type.message}</p>
                )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                {/* Amount Input */}
                <Input
                    label="Amount (₹)"
                    type="number"
                    placeholder="0.00"
                    required
                    error={errors.amount?.message}
                    {...register('amount', { valueAsNumber: true })}
                />

                {/* Date Input */}
                <Input
                    label="Transaction Date"
                    type="date"
                    required
                    error={errors.date?.message}
                    {...register('date')}
                />
            </div>

            {/* Remarks Input */}
            <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                    Remarks
                </label>
                <textarea
                    rows={3}
                    placeholder="Add transaction details..."
                    className="glass-input w-full"
                    {...register('remarks')}
                />
                {errors.remarks && (
                    <p className="mt-1 text-xs text-danger font-medium">{errors.remarks.message}</p>
                )}
            </div>

            <div className="flex justify-end gap-3 pt-2">
                <Button variant="secondary" type="reset" disabled={loading} className="w-24">
                    Reset
                </Button>
                <Button variant="primary" type="submit" loading={loading} className="px-6">
                    Record Transaction
                </Button>
            </div>
        </form>
    );
}

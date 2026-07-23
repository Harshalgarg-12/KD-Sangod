"use client";

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { partyFormSchema } from '@/utils/validationSchemas';
import Input from '../ui/Input';
import Button from '../ui/Button';

export default function PartyForm({
    onSubmit,
    initialValues = null,
    loading = false,
    locations = [],
}) {
    const isEdit = !!initialValues;

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(partyFormSchema),
        defaultValues: {
            name: '',
            phone: '',
            type: 'CUSTOMER',
            location: '',
            fathersName: '',
            customerCategory: '', // REGULAR or SHOPKEEPER (only for customers)
        },
    });

    // Watch type change to handle conditional validation and inputs helper
    const partyType = watch('type');

    // Load initial values if updating
    useEffect(() => {
        if (initialValues) {
            setValue('name', initialValues.name || '');
            setValue('phone', initialValues.phone || '');
            setValue('type', initialValues.type || 'CUSTOMER');
            setValue('location', initialValues.location?._id || initialValues.location || '');
            setValue('fathersName', initialValues.fathersName || '');
            setValue('customerCategory', initialValues.customerCategory || '');
        }
    }, [initialValues, setValue]);

    const handleFormSubmit = (data) => {
        // Build payload — strips fields not relevant to the party type
        const payload = {
            name: data.name,
            phone: data.phone,
            type: data.type,
            location: data.location,
        };

        if (data.type === 'CUSTOMER') {
            payload.fathersName = data.fathersName;
            payload.customerCategory = data.customerCategory; // Send category for customers
        }

        onSubmit(payload);
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
                <Input
                    label="Full Name"
                    placeholder="Enter party name"
                    required
                    error={errors.name?.message}
                    {...register('name')}
                />
                <Input
                    label="Phone Number"
                    placeholder="e.g. 9876543210"
                    required
                    error={errors.phone?.message}
                    {...register('phone')}
                />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div className="w-full">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                        Party Type <span className="text-danger">*</span>
                    </label>
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700 dark:text-slate-200">
                            <input
                                type="radio"
                                value="CUSTOMER"
                                className="h-4 w-4 border-slate-350 text-primary focus:ring-primary"
                                {...register('type')}
                            />
                            Customer (Receivables)
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700 dark:text-slate-200">
                            <input
                                type="radio"
                                value="SUPPLIER"
                                className="h-4 w-4 border-slate-350 text-primary focus:ring-primary"
                                {...register('type')}
                            />
                            Supplier (Payables)
                        </label>
                    </div>
                    {errors.type && (
                        <p className="mt-1 text-xs text-danger font-medium">{errors.type.message}</p>
                    )}
                </div>

                <div className="w-full">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                        Location <span className="text-danger">*</span>
                    </label>
                    <select
                        className="glass-input w-full"
                        {...register('location')}
                    >
                        <option value="">Select a location</option>
                        {locations.map((loc) => (
                            <option key={loc._id} value={loc._id}>
                                {loc.name}
                            </option>
                        ))}
                    </select>
                    {errors.location && (
                        <p className="mt-1 text-xs text-danger font-medium">{errors.location.message}</p>
                    )}
                </div>
            </div>

            {/* Conditionally render Father's name field with transition animation */}
            <div
                className={`transition-all duration-300 overflow-hidden ${partyType === 'CUSTOMER' ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
                    }`}
            >
                <Input
                    label="Father's Name"
                    placeholder="Enter father's name"
                    required={partyType === 'CUSTOMER'}
                    error={errors.fathersName?.message}
                    {...register('fathersName')}
                />
            </div>

            {/* Customer Category — shown inline only when type is CUSTOMER */}
            <div
                className={`transition-all duration-300 overflow-hidden ${partyType === 'CUSTOMER' ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
                    }`}
            >
                <div className="w-full">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                        Customer Category <span className="text-danger">*</span>
                    </label>
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700 dark:text-slate-200">
                            <input
                                type="radio"
                                value="REGULAR"
                                className="h-4 w-4 border-slate-350 text-primary focus:ring-primary"
                                {...register('customerCategory')}
                            />
                            Regular
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700 dark:text-slate-200">
                            <input
                                type="radio"
                                value="SHOPKEEPER"
                                className="h-4 w-4 border-slate-350 text-primary focus:ring-primary"
                                {...register('customerCategory')}
                            />
                            Shopkeeper
                        </label>
                    </div>
                    {errors.customerCategory && (
                        <p className="mt-1 text-xs text-danger font-medium">{errors.customerCategory.message}</p>
                    )}
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
                <Button variant="secondary" type="reset" disabled={loading} className="w-24">
                    Reset
                </Button>
                <Button variant="primary" type="submit" loading={loading} className="px-6">
                    {isEdit ? 'Save Changes' : 'Add Party'}
                </Button>
            </div>
        </form>
    );
}

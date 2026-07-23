"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import axiosInstance from '@/lib/axiosInstance';
import Card from '@/components/ui/Card';
import Skeleton from '@/components/ui/Skeleton';
import PartyForm from '@/components/forms/PartyForm';
import toast from 'react-hot-toast';

export default function EditCustomerPage() {
    const router = useRouter();
    const params = useParams();
    const customerId = params.id;

    const [customer, setCustomer] = useState(null);
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        async function fetchData() {
            try {
                const [custRes, locRes] = await Promise.all([
                    axiosInstance.get(`/parties/${customerId}`),
                    axiosInstance.get('/locations?limit=100'),
                ]);

                if (custRes.data.success) {
                    setCustomer(custRes.data.data);
                }
                if (locRes.data.success) {
                    setLocations(locRes.data.data.results || []);
                }
            } catch (error) {
                console.error('Failed to load edit customer page data', error);
                toast.error('Failed to load customer details');
            } finally {
                setLoading(false);
            }
        }
        if (customerId) {
            fetchData();
        }
    }, [customerId]);

    const handleSubmit = async (payload) => {
        setSubmitting(true);
        try {
            const { data } = await axiosInstance.put(`/parties/${customerId}`, payload);
            if (data.success) {
                toast.success('Customer details updated successfully', {
                    style: { background: '#10B981', color: '#fff' },
                });
                router.push('/customers');
                router.refresh();
            }
        } catch (error) {
            console.error('Failed to update customer', error);
            toast.error(error.response?.data?.message || 'Failed to update customer', {
                style: { background: '#EF4444', color: '#fff' },
            });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-10 w-48 rounded" />
                <Card className="max-w-2xl space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Back navigation */}
            <div className="flex items-center gap-3">
                <Link href="/customers">
                    <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/60 dark:bg-slate-900/60 text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 active:scale-95 transition-all">
                        <ChevronLeft className="h-5 w-5" />
                    </button>
                </Link>
                <div>
                    <h1 className="text-xl font-black tracking-tight text-slate-800 dark:text-white uppercase">
                        Edit Customer Details
                    </h1>
                    <p className="text-xs text-slate-500">
                        Modify registration info for {customer?.name}.
                    </p>
                </div>
            </div>

            <Card className="max-w-2xl">
                <PartyForm
                    onSubmit={handleSubmit}
                    initialValues={customer}
                    loading={submitting}
                    locations={locations}
                />
            </Card>
        </div>
    );
}

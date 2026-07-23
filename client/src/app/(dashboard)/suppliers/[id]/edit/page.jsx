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

export default function EditSupplierPage() {
    const router = useRouter();
    const params = useParams();
    const supplierId = params.id;

    const [supplier, setSupplier] = useState(null);
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        async function fetchData() {
            try {
                const [supRes, locRes] = await Promise.all([
                    axiosInstance.get(`/parties/${supplierId}`),
                    axiosInstance.get('/locations?limit=100'),
                ]);

                if (supRes.data.success) {
                    setSupplier(supRes.data.data);
                }
                if (locRes.data.success) {
                    setLocations(locRes.data.data.results || []);
                }
            } catch (error) {
                console.error('Failed to load edit supplier page data', error);
                toast.error('Failed to load supplier details');
            } finally {
                setLoading(false);
            }
        }
        if (supplierId) {
            fetchData();
        }
    }, [supplierId]);

    const handleSubmit = async (payload) => {
        setSubmitting(true);
        try {
            const { data } = await axiosInstance.put(`/parties/${supplierId}`, payload);
            if (data.success) {
                toast.success('Supplier details updated successfully', {
                    style: { background: '#10B981', color: '#fff' },
                });
                router.push('/suppliers');
                router.refresh();
            }
        } catch (error) {
            console.error('Failed to update supplier', error);
            toast.error(error.response?.data?.message || 'Failed to update supplier', {
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
                <Link href="/suppliers">
                    <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/60 dark:bg-slate-900/60 text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 active:scale-95 transition-all">
                        <ChevronLeft className="h-5 w-5" />
                    </button>
                </Link>
                <div>
                    <h1 className="text-xl font-black tracking-tight text-slate-800 dark:text-white uppercase">
                        Edit Supplier Details
                    </h1>
                    <p className="text-xs text-slate-500">
                        Modify registration info for supplier {supplier?.name}.
                    </p>
                </div>
            </div>

            <Card className="max-w-2xl">
                <PartyForm
                    onSubmit={handleSubmit}
                    initialValues={supplier}
                    loading={submitting}
                    locations={locations}
                />
            </Card>
        </div>
    );
}

"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema } from '@/utils/validationSchemas';
import { useAuth } from '@/context/AuthContext';
import axiosInstance from '@/lib/axiosInstance';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import toast from 'react-hot-toast';
import { UserCheck, ShieldAlert, Ban, CheckCircle } from 'lucide-react';

export default function AddAdminPage() {
    const { admin } = useAuth();
    const router = useRouter();
    const [adminsList, setAdminsList] = useState([]);
    const [listLoading, setListLoading] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [toggleLoadingId, setToggleLoadingId] = useState(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            name: '',
            phone: '',
            password: '',
            confirmPassword: '',
            shopName: '',
            fathersName: '',
            villageCity: '',
            gstin: '',
        },
    });

    const fetchAdmins = async () => {
        setListLoading(true);
        try {
            const { data } = await axiosInstance.get('/super-admin/admins');
            if (data.success) {
                setAdminsList(data.data.results || []);
            }
        } catch (error) {
            console.error('Failed to load admins', error);
            toast.error('Could not load sub-admins list');
        } finally {
            setListLoading(false);
        }
    };

    useEffect(() => {
        // If not super-admin, redirect out
        if (admin && admin.role !== 'SUPER_ADMIN') {
            toast.error('Forbidden: Superadmin clearance required');
            router.push('/dashboard');
            return;
        }
        fetchAdmins();
    }, [admin]);

    const onSubmit = async (values) => {
        setSubmitLoading(true);
        try {
            const { data } = await axiosInstance.post('/super-admin/add-admin', {
                name: values.name,
                phone: values.phone,
                password: values.password,
                shopName: values.shopName || undefined,
                fathersName: values.fathersName || undefined,
                villageCity: values.villageCity || undefined,
                gstin: values.gstin || undefined,
            });

            if (data.success) {
                toast.success(`Sub-admin ${values.name} registered!`, {
                    style: { background: '#10B981', color: '#fff' },
                });
                reset();
                fetchAdmins();
            }
        } catch (error) {
            console.error('Failed to create sub-admin', error);
            toast.error(error.response?.data?.message || 'Admin signup failed', {
                style: { background: '#EF4444', color: '#fff' },
            });
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleToggleStatus = async (subAdmin) => {
        setToggleLoadingId(subAdmin._id);
        try {
            const { data } = await axiosInstance.put(`/super-admin/toggle-status/${subAdmin._id}`);
            if (data.success) {
                toast.success(`Admin ${subAdmin.name} ${subAdmin.isActive ? 'deactivated' : 'activated'}`);
                fetchAdmins();
            }
        } catch (error) {
            console.error('Failed to toggle admin status', error);
            toast.error('Failed to change status');
        } finally {
            setToggleLoadingId(null);
        }
    };

    if (admin?.role !== 'SUPER_ADMIN') {
        return null;
    }

    return (
        <div className="space-y-6">
            {/* Title Header */}
            <div>
                <h1 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight">
                    Sub-Admin Control Panel
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                    Super-Admin exclusive system dashboard to provision new operators and manage active staff.
                </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Create Sub-Admin Form */}
                <Card className="lg:col-span-1 space-y-6 h-fit">
                    <div className="flex items-center gap-3 border-b border-slate-205/50 dark:border-white/10 pb-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-600/10 text-amber-600">
                            <ShieldAlert className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="font-extrabold text-slate-800 dark:text-white">Register Admin</h3>
                            <p className="text-xs text-slate-500">Log new system operator keys</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <Input
                            label="Full Name"
                            type="text"
                            placeholder="Operator name"
                            required
                            error={errors.name?.message}
                            {...register('name')}
                        />

                        <Input
                            label="Phone Number"
                            type="text"
                            placeholder="10-digit number"
                            required
                            error={errors.phone?.message}
                            {...register('phone')}
                        />

                        <Input
                            label="Password"
                            type="password"
                            placeholder="Minimum 6 characters"
                            required
                            error={errors.password?.message}
                            {...register('password')}
                        />

                        <Input
                            label="Confirm Password"
                            type="password"
                            placeholder="Re-enter password"
                            required
                            error={errors.confirmPassword?.message}
                            {...register('confirmPassword')}
                        />

                        <Input
                            label="Shop Name (Optional)"
                            type="text"
                            placeholder="Shop branch"
                            error={errors.shopName?.message}
                            {...register('shopName')}
                        />

                        <Button
                            type="submit"
                            variant="warning"
                            loading={submitLoading}
                            className="w-full mt-2"
                        >
                            Provision Operator
                        </Button>
                    </form>
                </Card>

                {/* Sub-Admins list */}
                <Card className="lg:col-span-2 space-y-4">
                    <div className="border-b border-slate-200/50 dark:border-white/10 pb-4">
                        <h3 className="font-extrabold text-slate-800 dark:text-white uppercase tracking-wide">
                            Active Operators Directory
                        </h3>
                        <p className="text-xs text-slate-500">
                            Manage accounts, toggle login permissions, and audit details
                        </p>
                    </div>

                    {listLoading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <Skeleton key={i} className="h-16 w-full rounded-2xl" />
                            ))}
                        </div>
                    ) : adminsList.length === 0 ? (
                        <div className="text-center py-10 text-slate-400">
                            No sub-admins found matching registration profile.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 dark:bg-white/5 text-xs font-bold uppercase text-slate-500">
                                    <tr>
                                        <th className="px-6 py-4">Name</th>
                                        <th className="px-6 py-4">Phone</th>
                                        <th className="px-6 py-4">Shop</th>
                                        <th className="px-6 py-4 text-center">Status</th>
                                        <th className="px-6 py-4 text-center">Control</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200/50 dark:divide-white/5">
                                    {adminsList.map((op) => (
                                        <tr key={op._id} className="hover:bg-slate-50/50 dark:hover:bg-white/2 transition-colors">
                                            <td className="px-6 py-4">
                                                <span className="font-extrabold text-slate-800 dark:text-white block">
                                                    {op.name}
                                                </span>
                                                {op.role === 'SUPER_ADMIN' && (
                                                    <span className="inline-flex rounded bg-indigo-100 dark:bg-indigo-900/40 text-[9px] px-1.5 py-0.5 font-bold uppercase tracking-wider text-indigo-800 dark:text-indigo-400">
                                                        System Root
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-slate-600 dark:text-slate-350 font-mono">
                                                {op.phone}
                                            </td>
                                            <td className="px-6 py-4 text-slate-500">
                                                {op.shopName || '-'}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span
                                                    className={`inline-flex px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${op.isActive
                                                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-990/20 dark:text-emerald-305'
                                                            : 'bg-red-100 text-red-800 dark:bg-red-990/20 dark:text-red-305'
                                                        }`}
                                                >
                                                    {op.isActive ? 'Active' : 'Banned'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {op.role !== 'SUPER_ADMIN' ? (
                                                    <button
                                                        onClick={() => handleToggleStatus(op)}
                                                        disabled={toggleLoadingId === op._id}
                                                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${op.isActive
                                                                ? 'border-red-500/20 text-danger bg-red-500/10 hover:bg-red-500/20'
                                                                : 'border-emerald-500/20 text-success bg-emerald-500/10 hover:bg-emerald-500/20'
                                                            }`}
                                                    >
                                                        {op.isActive ? (
                                                            <>
                                                                <Ban className="h-3.5 w-3.5" />
                                                                Deactivate
                                                            </>
                                                        ) : (
                                                            <>
                                                                <CheckCircle className="h-3.5 w-3.5" />
                                                                Activate
                                                            </>
                                                        )}
                                                    </button>
                                                ) : (
                                                    <span className="text-xs text-slate-400 font-semibold">Immutable</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
}

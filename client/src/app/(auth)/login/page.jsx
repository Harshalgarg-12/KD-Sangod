"use client";

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@/utils/validationSchemas';
import { useAuth } from '@/context/AuthContext';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';
import { Store } from 'lucide-react';

// 1. Rename main component to LoginForm
function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      phone: '',
      password: '',
    },
  });

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      const result = await login({
        phone: values.phone,
        password: values.password,
        rememberMe: true,
      });

      if (result.success) {
        toast.success('Welcome back to KD Sangod!', {
          style: {
            background: '#10B981',
            color: '#fff',
          },
        });
        const from = searchParams.get('from') || '/dashboard';
        router.push(from);
        router.refresh();
      } else {
        toast.error(result.message || 'Invalid phone or password', {
          style: {
            background: '#EF4444',
            color: '#fff',
          },
        });
      }
    } catch (err) {
      toast.error('An unexpected error occurred. Please try again.', {
        style: {
          background: '#EF4444',
          color: '#fff',
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card w-full max-w-md p-8 sm:p-10 border border-white/20 bg-white/70 dark:bg-slate-900/70 shadow-2xl backdrop-blur-xl rounded-3xl">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/30">
          <Store className="h-7 w-7" />
        </div>
        <h1 className="text-2xl font-black tracking-wide text-slate-800 dark:text-white uppercase">
          KD Sangod
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Sign in to manage your shop ledger
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input
          label="Phone Number"
          type="text"
          placeholder="Enter 10-digit phone number"
          required
          error={errors.phone?.message}
          {...register('phone')}
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          required
          error={errors.password?.message}
          {...register('password')}
        />

        <Button
          type="submit"
          loading={loading}
          className="w-full py-3 text-sm font-bold tracking-wider uppercase"
        >
          Sign In
        </Button>
      </form>
    </div>
  );
}

// 2. Suspense Wrapper for Next.js Build
export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center p-8">
        <div className="animate-pulse text-slate-500">Loading...</div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
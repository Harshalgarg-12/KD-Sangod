"use client";

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import axiosInstance from '@/lib/axiosInstance';
import Card from '@/components/ui/Card';
import TransactionForm from '@/components/forms/TransactionForm';
import toast from 'react-hot-toast';

function TransactionFormWrapper({ loading, handleSubmit }) {
  const searchParams = useSearchParams();
  const initialPartyId = searchParams.get('partyId') || '';

  return (
    <TransactionForm
      onSubmit={handleSubmit}
      loading={loading}
      initialPartyId={initialPartyId}
    />
  );
}

export default function RecordTransactionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (payload) => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.post('/transactions', payload);
      if (data.success) {
        toast.success('Transaction logged successfully!', {
          style: { background: '#10B981', color: '#fff' },
        });

        // Redirect to that specific party's ledger
        router.push(`/transactions?partyId=${payload.partyId}`);
        router.refresh();
      }
    } catch (error) {
      console.error('Failed to log transaction', error);
      toast.error(error.response?.data?.message || 'Transaction submission failed', {
        style: { background: '#EF4444', color: '#fff' },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Back navigation */}
      <div className="flex items-center gap-3">
        <Link href="/transactions">
          <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/60 dark:bg-slate-900/60 text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 active:scale-95 transition-all">
            <ChevronLeft className="h-5 w-5" />
          </button>
        </Link>
        <div>
          <h1 className="text-xl font-black tracking-tight text-slate-800 dark:text-white uppercase">
            Record New Transaction
          </h1>
          <p className="text-xs text-slate-500">
            Log Lena (Credit) or Dena (Debit) inside a selected party's ledger.
          </p>
        </div>
      </div>

      <Card className="max-w-2xl">
        <Suspense fallback={<div className="p-4 text-center text-sm text-slate-500">Loading form...</div>}>
          <TransactionFormWrapper loading={loading} handleSubmit={handleSubmit} />
        </Suspense>
      </Card>
    </div>
  );
}

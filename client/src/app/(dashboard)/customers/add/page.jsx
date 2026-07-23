"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import axiosInstance from '@/lib/axiosInstance';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import PartyForm from '@/components/forms/PartyForm';
import toast from 'react-hot-toast';

export default function AddCustomerPage() {
  const router = useRouter();
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchLocations() {
      try {
        const { data } = await axiosInstance.get('/locations?limit=100');
        if (data.success) {
          setLocations(data.data.results || []);
        }
      } catch (error) {
        console.error('Failed to load locations', error);
        toast.error('Failed to load locations');
      }
    }
    fetchLocations();
  }, []);

  const handleSubmit = async (payload) => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.post('/parties', payload);
      if (data.success) {
        toast.success('Customer registered successfully!', {
          style: { background: '#10B981', color: '#fff' },
        });
        router.push('/customers');
        router.refresh();
      }
    } catch (error) {
      console.error('Failed to register customer', error);
      toast.error(error.response?.data?.message || 'Failed to register customer', {
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
        <Link href="/customers">
          <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/60 dark:bg-slate-900/60 text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 active:scale-95 transition-all">
            <ChevronLeft className="h-5 w-5" />
          </button>
        </Link>
        <div>
          <h1 className="text-xl font-black tracking-tight text-slate-800 dark:text-white uppercase">
            Register New Customer
          </h1>
          <p className="text-xs text-slate-500">
            Create a customer account to log receivables ledger items.
          </p>
        </div>
      </div>

      <Card className="max-w-2xl">
        <PartyForm
          onSubmit={handleSubmit}
          loading={loading}
          locations={locations}
        />
      </Card>
    </div>
  );
}

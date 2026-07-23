"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { ArrowDownLeft, ArrowDownRight, Scale, Users, IndianRupee, RotateCw } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import Card from '@/components/ui/Card';
import Skeleton from '@/components/ui/Skeleton';
import axiosInstance from '@/lib/axiosInstance';

// Utility to format INR
const formatInr = (n) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(n);
};

export default function DashboardPage() {
  const [parties, setParties] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch parties (up to 1000 to get a realistic sum of balances)
      const partiesRes = await axiosInstance.get('/parties?limit=1000');
      // Fetch latest transactions
      const txRes = await axiosInstance.get('/transactions?limit=50');

      if (partiesRes.data.success) setParties(partiesRes.data.data.results || []);
      if (txRes.data.success) setTransactions(txRes.data.data.results || []);
    } catch (error) {
      console.error('Failed to load dashboard data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Compute stat totals
  const stats = useMemo(() => {
    let totalReceivable = 0; // Cumulative customer net balance > 0 (or positive net balance)
    let totalPayable = 0; // Cumulative supplier net balance < 0 (or negative net balance)

    parties.forEach((p) => {
      // For simplicity: positive balance means they owe us (Receivable); negative means we owe them (Payable)
      if (p.netBalance > 0) {
        totalReceivable += p.netBalance;
      } else if (p.netBalance < 0) {
        totalPayable += Math.abs(p.netBalance);
      }
    });

    const net = totalReceivable - totalPayable;
    const totalParties = parties.length;

    // Filter today's transactions
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const todaysTxCount = transactions.filter((tx) => new Date(tx.date) >= startOfToday).length;

    return { totalReceivable, totalPayable, net, totalParties, todaysTxCount };
  }, [parties, transactions]);

  // Group last 7 days of transactions for chart (DEBIT vs CREDIT)
  const chartData = useMemo(() => {
    const days = [];
    const dateMap = {};

    // Initialize last 7 days
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const label = d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' });
      dateMap[dateStr] = { label, credit: 0, debit: 0 };
    }

    // Accumulate transactions
    transactions.forEach((tx) => {
      const txDateStr = new Date(tx.date).toISOString().split('T')[0];
      if (dateMap[txDateStr]) {
        if (tx.type === 'CREDIT') {
          dateMap[txDateStr].credit += tx.amount;
        } else if (tx.type === 'DEBIT') {
          dateMap[txDateStr].debit += tx.amount;
        }
      }
    });

    return Object.values(dateMap);
  }, [transactions]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-8 w-24" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-28 w-full rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-80 w-full rounded-2xl" />
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Receivable (Lena)',
      value: stats.totalReceivable,
      icon: ArrowDownLeft,
      colorClass: 'text-success bg-emerald-500/10 border-emerald-500/30',
    },
    {
      title: 'Total Payable (Dena)',
      value: stats.totalPayable,
      icon: ArrowDownRight,
      colorClass: 'text-danger bg-red-500/10 border-red-500/30',
    },
    {
      title: 'Net Receivables',
      value: stats.net,
      icon: Scale,
      colorClass: 'text-primary bg-indigo-500/10 border-indigo-500/30',
    },
    {
      title: 'All Active Parties',
      value: stats.totalParties,
      icon: Users,
      colorClass: 'text-violet-600 bg-violet-500/10 border-violet-500/30',
      isCount: true,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-800 dark:text-white sm:text-3xl uppercase">
            Ledger Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Realtime receivables, payables, and transactions overview.
          </p>
        </div>
        <button
          onClick={fetchData}
          className="btn-primary flex items-center justify-center gap-2 self-start sm:self-auto xl:px-5"
        >
          <RotateCw className="h-4 w-4" />
          Refresh
        </button>
      </div>

      {/* Summary Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Card key={idx} hover className={`flex items-start gap-4 border-l-4 ${card.colorClass}`}>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/50 dark:bg-slate-800/50 shadow-sm">
                <Icon className="h-6 w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-505 dark:text-slate-400">
                  {card.title}
                </p>
                <p className="mt-1 truncate text-2xl font-black tracking-tight text-slate-800 dark:text-white">
                  {card.isCount ? card.value : formatInr(card.value)}
                </p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Recharts chart */}
      <Card className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white uppercase tracking-wide">
              Weekly Activity Overview
            </h3>
            <p className="text-xs text-slate-500">
              Lena (Credit) vs Dena (Debit) transactions timeline
            </p>
          </div>
        </div>
        <div className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(226,232,240,0.15)" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} stroke="#94a3b8" axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  borderRadius: '16px',
                  background: 'rgba(30, 41, 59, 0.95)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: '#fff',
                }}
              />
              <Legend formatter={(value) => (value === 'credit' ? 'Credit (Lena)' : 'Debit (Dena)')} />
              <Bar dataKey="credit" name="credit" fill="#10B981" radius={[8, 8, 0, 0]} maxBarSize={36} />
              <Bar dataKey="debit" name="debit" fill="#EF4444" radius={[8, 8, 0, 0]} maxBarSize={36} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Recent transactions list */}
      <Card className="overflow-hidden p-0">
        <div className="border-b border-slate-200/50 dark:border-white/10 px-6 py-4">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white uppercase tracking-wide">
            Recent Ledger Entries
          </h3>
          <p className="text-xs text-slate-500">
            Latest 10 transactions recorded across the system
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-white/5 text-xs font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-6 py-4">Party</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/50 dark:divide-white/5">
              {transactions.slice(0, 10).map((tx) => (
                <tr key={tx._id} className="hover:bg-slate-100/30 dark:hover:bg-white/2 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-semibold text-slate-800 dark:text-white">
                      {tx.partyId?.name || 'Unknown Party'}
                    </span>
                    <span className="block text-xs text-slate-450 dark:text-slate-400">
                      {tx.partyId?.phone || ''}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-bold tracking-wider ${tx.type === 'CREDIT'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-990/20 dark:text-emerald-300'
                          : 'bg-red-100 text-red-800 dark:bg-red-990/20 dark:text-red-300'
                        }`}
                    >
                      {tx.type === 'CREDIT' ? 'CREDIT (LENA)' : 'DEBIT (DENA)'}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-black">
                    {formatInr(tx.amount)}
                  </td>
                  <td className="px-6 py-4 text-right text-slate-500">
                    {new Date(tx.date).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })}
                  </td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                    No transactions recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

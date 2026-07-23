"use client";

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { IndianRupee, Trash2, Calendar, Filter, Plus, ArrowLeftRight, User } from 'lucide-react';
import Link from 'next/link';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import axiosInstance from '@/lib/axiosInstance';
import { useAuth } from '@/context/AuthContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import toast from 'react-hot-toast';

// Utility to format INR
const formatInr = (n) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(n);
};

export default function TransactionsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { admin } = useAuth();

  const partyId = searchParams.get('partyId');
  const [partyDetails, setPartyDetails] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state (used if no partyId selected)
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [type, setType] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Delete transaction confirm state
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [txToDelete, setTxToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      if (partyId) {
        // Fetch party details
        const partyRes = await axiosInstance.get(`/parties/${partyId}`);
        if (partyRes.data.success) {
          setPartyDetails(partyRes.data.data);
        }

        // Fetch party ledger history (returns full ledger running snapshots)
        const txRes = await axiosInstance.get(`/transactions/party/${partyId}`);
        if (txRes.data.success) {
          setTransactions(txRes.data.data.results || []);
        }
      } else {
        // General transactions query
        let url = `/transactions?page=${page}&limit=15`;
        if (startDate) url += `&startDate=${startDate}`;
        if (endDate) url += `&endDate=${endDate}`;
        if (type) url += `&type=${type}`;

        const txRes = await axiosInstance.get(url);
        if (txRes.data.success) {
          setTransactions(txRes.data.data.results || []);
          setTotalPages(txRes.data.data.totalPages || 1);
        }
        setPartyDetails(null);
      }
    } catch (error) {
      console.error('Failed to load transactions', error);
      toast.error('Could not load transaction list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [partyId, page, type]);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchTransactions();
  };

  const exportPDF = () => {
    if (!partyDetails || transactions.length === 0) return;
    const doc = new jsPDF();

    // Header
    doc.setFontSize(18);
    doc.text('KD SANGOD - LEDGER STATEMENT', 14, 20);

    // Party Info
    doc.setFontSize(12);
    doc.text(`Party Name: ${partyDetails.name}`, 14, 30);
    doc.text(`Phone: ${partyDetails.phone}`, 14, 37);
    doc.text(`Type: ${partyDetails.type}`, 14, 44);
    if (partyDetails.location?.name) {
      doc.text(`Location: ${partyDetails.location.name}`, 14, 51);
    }

    const balanceStatus = partyDetails.netBalance >= 0 ? '(Lena)' : '(Dena)';
    doc.text(`Net Balance: ${formatInr(partyDetails.netBalance)} ${balanceStatus}`, 14, 58);

    // Table Data
    const tableData = transactions.map((tx) => [
      new Date(tx.date).toLocaleDateString('en-IN'),
      tx.remarks || '-',
      tx.type === 'CREDIT' ? tx.amount.toFixed(2) : '-',
      tx.type === 'DEBIT' ? tx.amount.toFixed(2) : '-',
      tx.balanceAfterTransaction.toFixed(2)
    ]);

    doc.autoTable({
      startY: 65,
      head: [['Date', 'Remarks', 'You Gave (Credit)', 'You Got (Debit)', 'Running Balance']],
      body: tableData,
    });

    doc.save(`Statement_${partyDetails.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const exportExcel = () => {
    if (!partyDetails || transactions.length === 0) return;

    const exportData = transactions.map((tx) => ({
      Date: new Date(tx.date).toLocaleDateString('en-IN'),
      Remarks: tx.remarks || '-',
      'You Gave (Credit)': tx.type === 'CREDIT' ? tx.amount : null,
      'You Got (Debit)': tx.type === 'DEBIT' ? tx.amount : null,
      'Running Balance': tx.balanceAfterTransaction,
    }));

    // Add a summary row
    exportData.push({
      Date: 'NET BALANCE',
      Remarks: partyDetails.netBalance >= 0 ? '(Lena)' : '(Dena)',
      'You Gave (Credit)': null,
      'You Got (Debit)': null,
      'Running Balance': partyDetails.netBalance,
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Statement');
    XLSX.writeFile(workbook, `Statement_${partyDetails.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const openDeleteDialog = (tx) => {
    setTxToDelete(tx);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!txToDelete) return;
    setDeleteLoading(true);
    try {
      const { data } = await axiosInstance.delete(`/transactions/${txToDelete._id}`);
      if (data.success) {
        toast.success('Transaction entries reverted and deleted', {
          style: { background: '#10B981', color: '#fff' },
        });
        setDeleteOpen(false);
        setTxToDelete(null);
        fetchTransactions();
      }
    } catch (error) {
      console.error('Failed to delete transaction', error);
      toast.error(error.response?.data?.message || 'Access Denied: Reversal failure', {
        style: { background: '#EF4444', color: '#fff' },
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-800 dark:text-white uppercase">
            {partyDetails ? `${partyDetails.name} - Ledger Book` : 'All Transactions'}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {partyDetails
              ? `Ledger records for ${partyDetails.type} associated with phone ${partyDetails.phone}.`
              : 'Audit audit list of credit / debit balances registered in system.'}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {partyDetails && (
            <>
              <button
                onClick={exportPDF}
                className="btn-secondary flex items-center gap-2"
                title="Download PDF"
              >
                PDF
              </button>
              <button
                onClick={exportExcel}
                className="btn-secondary flex items-center gap-2"
                title="Download Excel"
              >
                Excel
              </button>
              <button
                onClick={() => router.push('/transactions')}
                className="btn-secondary flex items-center gap-2"
              >
                Clear Context
              </button>
            </>
          )}

          {/* Forward partyId so the add page can pre-select this party */}
          <Link href={partyId ? `/transactions/add?partyId=${partyId}` : '/transactions/add'}>
            <Button variant="primary" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Transaction
            </Button>
          </Link>
        </div>
      </div>

      {partyDetails && (
        <Card className="grid gap-4 sm:grid-cols-4 border-l-4 border-primary">
          <div>
            <p className="text-xs font-bold text-slate-450 uppercase tracking-widest">Party Name</p>
            <p className="text-lg font-black text-slate-800 dark:text-white mt-1 flex items-center gap-1.5">
              <User className="h-4 w-4 text-primary" />
              {partyDetails.name}
            </p>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-450 uppercase tracking-widest font-mono">Mobile</p>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-205 mt-1">{partyDetails.phone}</p>
          </div>
          {/* Location field — shows the party's registered location */}
          <div>
            <p className="text-xs font-bold text-slate-450 uppercase tracking-widest">Location</p>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mt-1">
              {partyDetails.location?.name || '-'}
            </p>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-450 uppercase tracking-widest">Current Balance</p>
            <p className={`text-lg font-black mt-1 ${partyDetails.netBalance > 0 ? 'text-success' : partyDetails.netBalance < 0 ? 'text-danger' : 'text-slate-655'}`}>
              {formatInr(partyDetails.netBalance)}
              <span className="text-[10px] uppercase font-bold ml-1 opacity-75">
                {partyDetails.netBalance >= 0 ? '(Lena)' : '(Dena)'}
              </span>
            </p>
          </div>
        </Card>
      )}

      {/* Show Filters if NOT inside a specific party ledger */}
      {!partyId && (
        <Card className="p-4 sm:p-5">
          <form onSubmit={handleFilterSubmit} className="grid gap-4 sm:grid-cols-4 items-end">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="glass-input w-full"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="glass-input w-full"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="glass-input w-full"
              >
                <option value="">All Types</option>
                <option value="CREDIT">CREDIT (Lena)</option>
                <option value="DEBIT">DEBIT (Dena)</option>
              </select>
            </div>
            <Button type="submit" variant="secondary" className="h-[42px] px-6 w-full flex items-center justify-center gap-2">
              <Filter className="h-4 w-4" />
              Apply Filters
            </Button>
          </form>
        </Card>
      )}

      {/* Grid Table */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full rounded-2xl" />
          ))}
        </div>
      ) : transactions.length === 0 ? (
        <EmptyState
          title="No transactions recorded"
          description="Click New Transaction to log an entry."
          icon={ArrowLeftRight}
        />
      ) : (
        <div className="overflow-hidden rounded-3xl border border-white/20 bg-white/70 dark:bg-slate-900/70 p-0 shadow-xl backdrop-blur-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-white/5 text-xs font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-6 py-4">Date</th>
                  {!partyId && <th className="px-6 py-4">Party</th>}
                  <th className="px-6 py-4">Remarks</th>
                  <th className="px-6 py-4">You Gave (Credit)</th>
                  <th className="px-6 py-4">You Got (Debit)</th>
                  {partyId && <th className="px-6 py-4">Running Balance</th>}
                  {admin?.role === 'SUPER_ADMIN' && <th className="px-6 py-4 text-center">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/50 dark:divide-white/5">
                {transactions.map((tx) => (
                  <tr key={tx._id} className="hover:bg-slate-50/50 dark:hover:bg-white/2 transition-colors">
                    <td className="px-6 py-4 text-slate-550 dark:text-slate-400">
                      {new Date(tx.date).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })}
                    </td>
                    {!partyId && (
                      <td className="px-6 py-4">
                        <span className="font-extrabold text-slate-805 dark:text-white block">
                          {tx.partyId?.name || 'Unknown'}
                        </span>
                        <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                          {tx.partyId?.type || ''}
                        </span>
                      </td>
                    )}
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-350 max-w-xs truncate">
                      {tx.remarks || '-'}
                    </td>
                    <td className="px-6 py-4 text-success font-bold">
                      {tx.type === 'CREDIT' ? formatInr(tx.amount) : '-'}
                    </td>
                    <td className="px-6 py-4 text-danger font-bold">
                      {tx.type === 'DEBIT' ? formatInr(tx.amount) : '-'}
                    </td>
                    {partyId && (
                      <td className={`px-6 py-4 font-black ${tx.balanceAfterTransaction > 0 ? 'text-success' : tx.balanceAfterTransaction < 0 ? 'text-danger' : 'text-slate-600'}`}>
                        {formatInr(tx.balanceAfterTransaction)}
                      </td>
                    )}
                    {admin?.role === 'SUPER_ADMIN' && (
                      <td className="px-6 py-2.5 text-center">
                        <button
                          onClick={() => openDeleteDialog(tx)}
                          className="rounded-xl p-2 text-slate-400 hover:bg-red-500/10 hover:text-danger active:scale-95 transition-all"
                          title="Revert & Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination (used in Reports / General listing page) */}
      {!partyId && totalPages > 1 && (
        <div className="flex items-center justify-end gap-2 pt-4">
          <Button
            variant="secondary"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </Button>
          <Button
            variant="secondary"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </div>
      )}

      {/* Confirm deletion Dialogue */}
      <ConfirmDialog
        isOpen={deleteOpen}
        onClose={() => {
          setDeleteOpen(false);
          setTxToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        loading={deleteLoading}
        title="Delete Transaction?"
        message="Are you sure you want to delete this transaction ledger entry? The associated party's Net Balance will be automatically reverted."
        confirmText="Confirm Delete"
      />
    </div>
  );
}

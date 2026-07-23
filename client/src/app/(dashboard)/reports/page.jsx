"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { FileText, Download, FileSpreadsheet, RotateCw, Calendar } from 'lucide-react';
import axiosInstance from '@/lib/axiosInstance';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import toast from 'react-hot-toast';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

// Utility to format INR
const formatInr = (n) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(n);
};

export default function ReportsPage() {
  const [locations, setLocations] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [parties, setParties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [startDate, setStartDate] = useState(
    new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [locationId, setLocationId] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [locRes, partyRes, txRes] = await Promise.all([
        axiosInstance.get('/locations?limit=100'),
        axiosInstance.get('/parties?limit=1000'),
        axiosInstance.get(`/transactions?startDate=${startDate}&endDate=${endDate}&limit=5000`),
      ]);

      if (locRes.data.success) setLocations(locRes.data.data.results || []);
      if (partyRes.data.success) setParties(partyRes.data.data.results || []);
      if (txRes.data.success) setTransactions(txRes.data.data.results || []);
    } catch (error) {
      console.error('Failed to load reports data', error);
      toast.error('Failed to load report components');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [startDate, endDate]);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchData();
  };

  // Process data to generate party-wise credit / debit sums inside the selected date range and filter by location
  const reportData = useMemo(() => {
    const partyMap = {};

    // Filter parties by location first
    const filteredParties = locationId
      ? parties.filter((p) => (p.location?._id || p.location) === locationId)
      : parties;

    // Initialize party map
    filteredParties.forEach((p) => {
      partyMap[p._id] = {
        partyName: p.name,
        phone: p.phone,
        type: p.type,
        locationName: p.location?.name || '',
        credit: 0, // Lena
        debit: 0,  // Dena
        net: 0,
      };
    });

    // Populate sums from transactions inside the range
    transactions.forEach((tx) => {
      const pId = tx.partyId?._id || tx.partyId;
      if (partyMap[pId]) {
        if (tx.type === 'CREDIT') {
          partyMap[pId].credit += tx.amount;
        } else if (tx.type === 'DEBIT') {
          partyMap[pId].debit += tx.amount;
        }
      }
    });

    // Compute net balance (Credit - Debit) and transform to array
    return Object.values(partyMap)
      .map((row) => {
        row.net = row.credit - row.debit;
        return row;
      })
      .filter((row) => row.credit > 0 || row.debit > 0); // Only show parties with active transacting history in range
  }, [transactions, parties, locationId]);

  // Aggregate values
  const totals = useMemo(() => {
    let totalCredit = 0;
    let totalDebit = 0;
    reportData.forEach((row) => {
      totalCredit += row.credit;
      totalDebit += row.debit;
    });
    return { totalCredit, totalDebit, net: totalCredit - totalDebit };
  }, [reportData]);

  // Export to Excel sheet
  const exportToExcel = () => {
    if (reportData.length === 0) {
      toast.error('No report data to export');
      return;
    }
    const data = reportData.map((row) => ({
      'Party Name': row.partyName,
      Type: row.type,
      Phone: row.phone,
      Location: row.locationName,
      'Total Credit (Lena)': row.credit,
      'Total Debit (Dena)': row.debit,
      'Net Flow': row.net,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Ledger Summary');
    XLSX.writeFile(workbook, `KD_Sangod_Ledger_Report_${startDate}_to_${endDate}.xlsx`);
    toast.success('Excel ledger report exported');
  };

  // Export to PDF table
  const exportToPDF = () => {
    if (reportData.length === 0) {
      toast.error('No report data to export');
      return;
    }
    const doc = new jsPDF();
    doc.setFont('helvetica', 'bold');
    doc.text('KD Sangod - Ledgers Summary Book', 14, 15);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Generated Date Range: ${startDate} to ${endDate}`, 14, 21);
    doc.text(`Location: ${locationId ? locations.find((l) => l._id === locationId)?.name : 'All'}`, 14, 26);

    const tableColumn = ['Party Name', 'Type', 'Phone', 'Location', 'Credit (Lena)', 'Debit (Dena)', 'Net Flow'];
    const tableRows = reportData.map((row) => [
      row.partyName,
      row.type,
      row.phone,
      row.locationName,
      formatInr(row.credit),
      formatInr(row.debit),
      formatInr(row.net),
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 32,
      theme: 'grid',
      headStyles: { fillKind: 'primary', fillColor: [79, 70, 229] },
    });

    doc.save(`KD_Sangod_Ledger_Report_${startDate}_to_${endDate}.pdf`);
    toast.success('PDF ledger report exported');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48 rounded" />
        <Skeleton className="h-28 w-full rounded" />
        <Skeleton className="h-80 w-full rounded" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-800 dark:text-white uppercase">
            Ledger & Tax Reports
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Generate custom date summaries, view cash flow, and export clean sheets.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={exportToExcel} className="flex items-center gap-2">
            <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
            Export Excel
          </Button>
          <Button variant="primary" onClick={exportToPDF} className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Date controls and location selection */}
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
              Location Filter
            </label>
            <select
              value={locationId}
              onChange={(e) => setLocationId(e.target.value)}
              className="glass-input w-full"
            >
              <option value="">All Locations</option>
              {locations.map((loc) => (
                <option key={loc._id} value={loc._id}>
                  {loc.name}
                </option>
              ))}
            </select>
          </div>

          <Button type="submit" variant="secondary" className="h-[42px] px-6 w-full flex items-center justify-center gap-2">
            <RotateCw className="h-4 w-4" />
            Regenerate Report
          </Button>
        </form>
      </Card>

      {/* Aggregate metrics in cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-l-4 border-emerald-500 bg-emerald-500/5">
          <p className="text-xs font-bold uppercase text-emerald-800 dark:text-emerald-400">Total Credits (You Gave / Lena)</p>
          <p className="text-2xl font-black text-slate-800 dark:text-white mt-1">{formatInr(totals.totalCredit)}</p>
        </Card>
        <Card className="border-l-4 border-red-500 bg-red-500/5">
          <p className="text-xs font-bold uppercase text-red-800 dark:text-red-400">Total Debits (You Got / Dena)</p>
          <p className="text-2xl font-black text-slate-800 dark:text-white mt-1">{formatInr(totals.totalDebit)}</p>
        </Card>
        <Card className="border-l-4 border-indigo-500 bg-indigo-500/5">
          <p className="text-xs font-bold uppercase text-indigo-800 dark:text-indigo-400">Net Flow</p>
          <p className="text-2xl font-black text-slate-800 dark:text-white mt-1">{formatInr(totals.net)}</p>
        </Card>
      </div>

      {/* Report Summary table */}
      {reportData.length === 0 ? (
        <EmptyState
          title="No data for selected range"
          description="Adjust dates to see transactions recorded within window."
        />
      ) : (
        <div className="overflow-hidden rounded-3xl border border-white/20 bg-white/70 dark:bg-slate-900/70 p-0 shadow-xl backdrop-blur-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-white/5 text-xs font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-6 py-4">Party Name</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Mobile</th>
                  <th className="px-6 py-4">Credit (Lena)</th>
                  <th className="px-6 py-4">Debit (Dena)</th>
                  <th className="px-6 py-4">Net Balance Flow</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/50 dark:divide-white/5">
                {reportData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-white/2 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-800 dark:text-white">
                      {row.partyName}
                    </td>
                    <td className="px-6 py-4 text-slate-550 dark:text-slate-400">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-white/10">
                        {row.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 font-mono">
                      {row.phone}
                    </td>
                    <td className="px-6 py-4 text-success font-semibold">
                      {formatInr(row.credit)}
                    </td>
                    <td className="px-6 py-4 text-danger font-semibold">
                      {formatInr(row.debit)}
                    </td>
                    <td className={`px-6 py-4 font-black ${row.net > 0 ? 'text-success' : row.net < 0 ? 'text-danger' : 'text-slate-600'}`}>
                      {formatInr(row.net)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

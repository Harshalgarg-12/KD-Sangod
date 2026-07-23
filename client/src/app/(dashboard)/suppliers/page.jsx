"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Eye, Edit, Trash2, Search, MapPin, UserPlus, Phone } from 'lucide-react';
import axiosInstance from '@/lib/axiosInstance';
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

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [locationId, setLocationId] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Deactivate dialog state
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [partyToDelete, setPartyToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchFiltersAndData = async () => {
    setLoading(true);
    try {
      // 1. Fetch locations
      const locRes = await axiosInstance.get('/locations?limit=100');
      if (locRes.data.success) {
        setLocations(locRes.data.data.results || []);
      }

      // 2. Fetch suppliers
      let url = `/parties?type=SUPPLIER&page=${page}&limit=10&search=${encodeURIComponent(search)}`;
      if (locationId) {
        url += `&location=${locationId}`;
      }
      const supRes = await axiosInstance.get(url);
      if (supRes.data.success) {
        setSuppliers(supRes.data.data.results || []);
        setTotalPages(supRes.data.data.totalPages || 1);
        setTotalCount(supRes.data.data.totalCount || 0);
      }
    } catch (error) {
      console.error('Failed to load suppliers page data', error);
      toast.error('Failed to load suppliers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiltersAndData();
  }, [page, locationId]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchFiltersAndData();
  };

  const openDeleteDialog = (party) => {
    setPartyToDelete(party);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!partyToDelete) return;
    setDeleteLoading(true);
    try {
      const { data } = await axiosInstance.delete(`/parties/${partyToDelete._id}`);
      if (data.success) {
        toast.success(`Supplier ${partyToDelete.name} deactivated successfully`, {
          style: { background: '#10B981', color: '#fff' },
        });
        setDeleteOpen(false);
        setPartyToDelete(null);
        fetchFiltersAndData();
      }
    } catch (error) {
      console.error('Failed to deactivate party', error);
      toast.error(error.response?.data?.message || 'Deactivation failed', {
        style: { background: '#EF4444', color: '#fff' },
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-800 dark:text-white uppercase">
            Suppliers Directory
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage supplier records, track outstandings (Dena), and examine account history.
          </p>
        </div>
        <Link href="/suppliers/add">
          <Button variant="primary" className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Add Supplier
          </Button>
        </Link>
      </div>

      {/* Filters Form */}
      <Card className="p-4 sm:p-5">
        <form onSubmit={handleSearchSubmit} className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Search
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name or phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="glass-input w-full pr-10"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                <Search className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="w-full sm:w-60">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Filter by Location
            </label>
            <select
              value={locationId}
              onChange={(e) => {
                setLocationId(e.target.value);
                setPage(1);
              }}
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

          <Button type="submit" variant="secondary" className="w-full sm:w-auto h-[42px] px-6">
            Search
          </Button>
        </form>
      </Card>

      {/* Table / Mobile Cards */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 w-full rounded-2xl" />
          ))}
        </div>
      ) : suppliers.length === 0 ? (
        <EmptyState
          title="No suppliers found"
          description="Try modifying search filter or register a new supplier."
        />
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-hidden rounded-3xl border border-white/20 bg-white/70 dark:bg-slate-900/70 p-0 shadow-xl backdrop-blur-xl">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-white/5 text-xs font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Phone</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Balance</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/50 dark:divide-white/5">
                {suppliers.map((sup) => (
                  <tr key={sup._id} className="hover:bg-slate-50/50 dark:hover:bg-white/2 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-800 dark:text-white">
                      {sup.name}
                    </td>
                    <td className="px-6 py-4 text-slate-650 dark:text-slate-350">
                      {sup.phone}
                    </td>
                    <td className="px-6 py-4 text-slate-550 dark:text-slate-400">
                      {sup.location?.name || ''}
                    </td>
                    <td className={`px-6 py-4 font-black ${sup.netBalance > 0 ? 'text-success' : sup.netBalance < 0 ? 'text-danger' : 'text-slate-600 dark:text-slate-350'}`}>
                      {formatInr(sup.netBalance)}
                      <span className="text-[10px] uppercase font-bold ml-1 opacity-75">
                        {sup.netBalance >= 0 ? '(Lena)' : '(Dena)'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-2">
                        <Link href={`/transactions?partyId=${sup._id}`} title="View Ledger">
                          <button className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-primary transition-all">
                            <Eye className="h-4 w-4" />
                          </button>
                        </Link>
                        <Link href={`/suppliers/${sup._id}/edit`} title="Edit Details">
                          <button className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-warning transition-all">
                            <Edit className="h-4 w-4" />
                          </button>
                        </Link>
                        <button
                          onClick={() => openDeleteDialog(sup)}
                          className="rounded-xl p-2 text-slate-500 hover:bg-red-500/10 hover:text-danger hover:ring-1 hover:ring-red-500/20 active:scale-95 transition-all"
                          title="Deactivate"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Collapse Cards View */}
          <div className="grid gap-4 lg:hidden">
            {suppliers.map((sup) => (
              <Card key={sup._id} className="relative overflow-hidden border-l-4 border-indigo-500">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-extrabold text-slate-800 dark:text-white leading-tight">
                      {sup.name}
                    </h3>
                  </div>
                  <span
                    className={`font-black text-sm px-2.5 py-0.5 rounded-full ${sup.netBalance > 0
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300'
                        : sup.netBalance < 0
                          ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                          : 'bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-300'
                      }`}
                  >
                    {formatInr(sup.netBalance)}
                  </span>
                </div>

                <div className="space-y-1.5 pt-2 text-xs border-t border-slate-200/50 dark:border-white/5">
                  <div className="flex items-center gap-2 text-slate-650 dark:text-slate-350">
                    <Phone className="h-3.5 w-3.5 text-slate-405" />
                    <span>{sup.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500">
                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                    <span>{sup.location?.name || '-'}</span>
                  </div>
                </div>

                {/* Mobile action bar */}
                <div className="flex items-center justify-end gap-2 border-t border-slate-200/50 dark:border-white/5 pt-3 mt-4">
                  <Link href={`/transactions?partyId=${sup._id}`}>
                    <Button variant="ghost" size="sm" className="gap-1.5">
                      <Eye className="h-3.5 w-3.5" />
                      Ledger
                    </Button>
                  </Link>
                  <Link href={`/suppliers/${sup._id}/edit`}>
                    <Button variant="secondary" size="sm" className="gap-1.5">
                      <Edit className="h-3.5 w-3.5" />
                      Edit
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm" onClick={() => openDeleteDialog(sup)} className="text-danger hover:bg-red-500/10">
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Table Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-slate-200/50 dark:border-white/10">
              <span className="text-xs text-slate-505 dark:text-slate-400">
                Showing 10 records of {totalCount} total suppliers
              </span>
              <div className="flex gap-2">
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
            </div>
          )}
        </>
      )}

      {/* Confirm Deactivation Dialogue */}
      <ConfirmDialog
        isOpen={deleteOpen}
        onClose={() => {
          setDeleteOpen(false);
          setPartyToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        loading={deleteLoading}
        title="Deactivate Supplier?"
        message={`Are you sure you want to deactivate supplier ${partyToDelete?.name}? They will no longer display in active supplier directories.`}
        confirmText="Deactivate"
      />
    </div>
  );
}

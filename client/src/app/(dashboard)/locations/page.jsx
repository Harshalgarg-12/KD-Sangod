"use client";

import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Trash2, Loader2 } from 'lucide-react';
import axiosInstance from '@/lib/axiosInstance';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Skeleton from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import toast from 'react-hot-toast';

export default function LocationsPage() {
    // State for list of locations
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);

    // State for new location form
    const [newName, setNewName] = useState('');
    const [adding, setAdding] = useState(false);

    // State for delete confirmation
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [locToDelete, setLocToDelete] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    // Fetch all active locations from backend
    const fetchLocations = async () => {
        setLoading(true);
        try {
            const { data } = await axiosInstance.get('/locations?limit=200');
            if (data.success) {
                setLocations(data.data.results || []);
            }
        } catch (error) {
            console.error('Failed to load locations', error);
            toast.error('Failed to load locations');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLocations();
    }, []);

    // Add a new location
    const handleAdd = async (e) => {
        e.preventDefault();
        if (!newName.trim()) return;

        setAdding(true);
        try {
            const { data } = await axiosInstance.post('/locations', { name: newName.trim() });
            if (data.success) {
                toast.success(`Location "${data.data.name}" added!`, {
                    style: { background: '#10B981', color: '#fff' },
                });
                setNewName('');
                fetchLocations(); // Refresh the list
            }
        } catch (error) {
            console.error('Failed to add location', error);
            toast.error(error.response?.data?.message || 'Failed to add location', {
                style: { background: '#EF4444', color: '#fff' },
            });
        } finally {
            setAdding(false);
        }
    };

    // Open delete confirmation dialog
    const openDeleteDialog = (loc) => {
        setLocToDelete(loc);
        setDeleteOpen(true);
    };

    // Confirm delete (soft-delete — deactivates location)
    const handleConfirmDelete = async () => {
        if (!locToDelete) return;
        setDeleteLoading(true);
        try {
            const { data } = await axiosInstance.delete(`/locations/${locToDelete._id}`);
            if (data.success) {
                toast.success(`Location "${locToDelete.name}" deactivated`, {
                    style: { background: '#10B981', color: '#fff' },
                });
                setDeleteOpen(false);
                setLocToDelete(null);
                fetchLocations(); // Refresh the list
            }
        } catch (error) {
            console.error('Failed to deactivate location', error);
            toast.error(error.response?.data?.message || 'Failed to deactivate location', {
                style: { background: '#EF4444', color: '#fff' },
            });
        } finally {
            setDeleteLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-black tracking-tight text-slate-800 dark:text-white uppercase">
                    Location Management
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                    Add, view, and manage locations used in customer and supplier records.
                </p>
            </div>

            {/* Add Location Form */}
            <Card className="p-4 sm:p-5">
                <form onSubmit={handleAdd} className="flex flex-col gap-4 sm:flex-row sm:items-end">
                    <div className="flex-1">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                            New Location Name
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. Sangod, Kota, Jhalawar..."
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            className="glass-input w-full"
                            disabled={adding}
                        />
                    </div>
                    <Button
                        type="submit"
                        variant="primary"
                        disabled={adding || !newName.trim()}
                        className="flex items-center gap-2 h-[42px] px-6 w-full sm:w-auto"
                    >
                        {adding ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Plus className="h-4 w-4" />
                        )}
                        Add Location
                    </Button>
                </form>
            </Card>

            {/* Locations List */}
            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-14 w-full rounded-2xl" />
                    ))}
                </div>
            ) : locations.length === 0 ? (
                <EmptyState
                    title="No locations added yet"
                    description="Add your first location above to get started."
                    icon={MapPin}
                />
            ) : (
                <div className="overflow-hidden rounded-3xl border border-white/20 bg-white/70 dark:bg-slate-900/70 p-0 shadow-xl backdrop-blur-xl">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 dark:bg-white/5 text-xs font-bold uppercase tracking-wider text-slate-500">
                            <tr>
                                <th className="px-6 py-4">#</th>
                                <th className="px-6 py-4">Location Name</th>
                                <th className="px-6 py-4">Created</th>
                                <th className="px-6 py-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200/50 dark:divide-white/5">
                            {locations.map((loc, index) => (
                                <tr key={loc._id} className="hover:bg-slate-50/50 dark:hover:bg-white/2 transition-colors">
                                    <td className="px-6 py-4 text-slate-400 font-mono text-xs">
                                        {index + 1}
                                    </td>
                                    <td className="px-6 py-4 font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-primary shrink-0" />
                                        {loc.name}
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-xs">
                                        {new Date(loc.createdAt).toLocaleDateString('en-IN', {
                                            day: '2-digit',
                                            month: 'short',
                                            year: 'numeric',
                                        })}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button
                                            onClick={() => openDeleteDialog(loc)}
                                            className="rounded-xl p-2 text-slate-500 hover:bg-red-500/10 hover:text-danger hover:ring-1 hover:ring-red-500/20 active:scale-95 transition-all"
                                            title="Deactivate Location"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Confirm Deactivation Dialog */}
            <ConfirmDialog
                isOpen={deleteOpen}
                onClose={() => {
                    setDeleteOpen(false);
                    setLocToDelete(null);
                }}
                onConfirm={handleConfirmDelete}
                loading={deleteLoading}
                title="Deactivate Location?"
                message={`Are you sure you want to deactivate "${locToDelete?.name}"? It will no longer appear in location dropdowns.`}
                confirmText="Deactivate"
            />
        </div>
    );
}

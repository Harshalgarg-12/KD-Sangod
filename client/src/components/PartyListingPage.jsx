"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Search } from "lucide-react";
import PartyCard from "@/components/PartyCard";
import PartyTabs from "@/components/PartyTabs";
import VillageFilter from "@/components/VillageFilter";
import { enrichParty } from "@/lib/mockData";

export default function PartyListingPage({
  title,
  parties,
  transactions,
  basePath,
  addLabel = "Add",
}) {
  const [search, setSearch] = useState("");
  const [village, setVillage] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const enriched = useMemo(
    () => parties.map((p) => enrichParty(p, transactions)),
    [parties, transactions]
  );

  const filtered = useMemo(() => {
    let list = enriched;
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.fatherName?.toLowerCase().includes(q) ||
          p.phone?.includes(q) ||
          p.village.toLowerCase().includes(q)
      );
    }
    if (village) {
      list = list.filter((p) => p.village === village);
    }
    if (activeTab !== "all") {
      list = list.filter((p) => p.status === activeTab);
    }
    return list;
  }, [enriched, search, village, activeTab]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          {title}
        </h1>
        <Link href={`${basePath}/add`} className="btn-primary gap-2">
          <Plus className="h-4 w-4" />
          {addLabel}
        </Link>
      </div>

      <div className="glass-card space-y-4 p-4 sm:p-5">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, father name, mobile, village..."
            className="glass-input w-full pl-10"
          />
        </div>
        <VillageFilter
          value={village}
          onChange={setVillage}
          id={`${basePath}-village-filter`}
        />
        <PartyTabs activeTab={activeTab} onChange={setActiveTab} />
      </div>

      {filtered.length === 0 ? (
        <div className="glass-card p-10 text-center text-slate-500">
          No parties found for the current filters.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((party) => (
            <PartyCard key={party.id} party={party} basePath={basePath} />
          ))}
        </div>
      )}
    </div>
  );
}

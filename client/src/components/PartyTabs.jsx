"use client";

import { PARTY_TABS } from "@/utils/partyUtils";

export default function PartyTabs({ activeTab, onChange }) {
  return (
    <div
      role="tablist"
      className="flex gap-1 overflow-x-auto rounded-xl border border-slate-200/80 bg-white/60 p-1 backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-900/60"
    >
      {PARTY_TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={activeTab === tab.id}
          onClick={() => onChange(tab.id)}
          className={`shrink-0 rounded-lg px-3 py-2 text-xs font-semibold transition sm:px-4 sm:text-sm ${
            activeTab === tab.id
              ? "bg-primary text-white shadow-md shadow-primary/25"
              : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

"use client";

import { ChevronDown, MapPin } from "lucide-react";
import { villages } from "@/lib/villages";

const ALL_VALUE = "";

/**
 * Pure UI village dropdown (controlled). No data fetching.
 *
 * @param {string} value — selected village or `""` for all
 * @param {(v: string) => void} onChange
 * @param {string} [label] — optional visible label
 * @param {string} [className]
 * @param {string} [id] — for accessibility
 */
export default function VillageFilter({
  value = ALL_VALUE,
  onChange,
  label = "Filter by village",
  className = "",
  id = "village-filter",
}) {
  return (
    <div className={`flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-3 ${className}`}>
      {label ? (
        <label
          htmlFor={id}
          className="flex shrink-0 items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          <MapPin className="h-4 w-4 text-primary" aria-hidden />
          {label}
        </label>
      ) : null}
      <div className="relative min-w-[200px] max-w-xs sm:max-w-sm">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="glass-input w-full cursor-pointer appearance-none pr-10 font-medium text-slate-800 dark:text-slate-100"
        >
          <option value={ALL_VALUE}>All villages</option>
          {villages.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
          aria-hidden
        />
      </div>
    </div>
  );
}

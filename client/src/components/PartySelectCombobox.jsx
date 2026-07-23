"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Search, User, X } from "lucide-react";

/**
 * Searchable party picker (customers + suppliers), optionally filtered by village.
 */
export default function PartySelectCombobox({
  parties = [],
  value,
  onChange,
  onBlur,
  villageFilter = "",
  error,
  placeholder = "Search party by name or mobile...",
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef(null);

  const selected = useMemo(
    () => parties.find((p) => p.id === value) ?? null,
    [parties, value]
  );

  const filtered = useMemo(() => {
    let list = parties;
    if (villageFilter) {
      list = list.filter((p) => p.village === villageFilter);
    }
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.fatherName?.toLowerCase().includes(q) ||
        p.phone?.includes(q) ||
        p.village.toLowerCase().includes(q)
    );
  }, [parties, villageFilter, query]);

  useEffect(() => {
    if (selected) {
      setQuery(selected.name);
    } else if (!value) {
      setQuery("");
    }
  }, [selected, value]);

  useEffect(() => {
    if (villageFilter && selected && selected.village !== villageFilter) {
      onChange?.("");
      setQuery("");
    }
  }, [villageFilter, selected, onChange]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setOpen(false);
        onBlur?.();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onBlur]);

  function selectParty(party) {
    onChange(party.id);
    setQuery(party.name);
    setOpen(false);
  }

  function clearSelection() {
    onChange("");
    setQuery("");
  }

  return (
    <div ref={containerRef} className="relative">
      <input type="hidden" value={value || ""} readOnly />
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls="party-listbox"
          aria-autocomplete="list"
          placeholder={placeholder}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            if (!e.target.value) onChange("");
          }}
          onFocus={() => setOpen(true)}
          className={`glass-input w-full pl-10 pr-10 ${error ? "border-danger ring-danger/20" : ""}`}
        />
        <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-0.5">
          {value && (
            <button
              type="button"
              onClick={clearSelection}
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
              aria-label="Clear party"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
            aria-label="Toggle party list"
          >
            <ChevronDown
              className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`}
            />
          </button>
        </div>
      </div>

      {open && (
        <ul
          id="party-listbox"
          role="listbox"
          className="absolute z-50 mt-1 max-h-56 w-full overflow-auto rounded-xl border border-slate-200/80 bg-white/95 py-1 shadow-xl backdrop-blur-md dark:border-slate-600 dark:bg-slate-800/95"
        >
          {filtered.length === 0 ? (
            <li className="px-4 py-3 text-sm text-slate-500">
              {villageFilter
                ? "No parties in this village"
                : "No party found"}
            </li>
          ) : (
            filtered.map((party) => (
              <li key={party.id} role="option" aria-selected={value === party.id}>
                <button
                  type="button"
                  onClick={() => selectParty(party)}
                  className={`flex w-full items-start gap-3 px-4 py-2.5 text-left text-sm transition hover:bg-primary/10 ${
                    value === party.id
                      ? "bg-primary/10 font-medium text-primary"
                      : "text-slate-700 dark:text-slate-200"
                  }`}
                >
                  <User className="mt-0.5 h-4 w-4 shrink-0 text-primary/70" />
                  <span className="min-w-0">
                    <span className="block truncate font-medium">{party.name}</span>
                    <span className="block truncate text-xs text-slate-500">
                      {party.village}
                      {party.partyType === "supplier" ? " · Supplier" : " · Customer"}
                    </span>
                  </span>
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, MapPin, Search, X } from "lucide-react";
import { villages } from "@/lib/villages";
import { useLanguage } from "@/context/LanguageContext";

export default function VillageCombobox({
  value,
  onChange,
  onBlur,
  error,
  name = "village",
}) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value || "");
  const containerRef = useRef(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return villages;
    return villages.filter((v) => v.toLowerCase().includes(q));
  }, [query]);

  useEffect(() => {
    setQuery(value || "");
  }, [value]);

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

  function selectVillage(village) {
    onChange(village);
    setQuery(village);
    setOpen(false);
  }

  function clearSelection() {
    onChange("");
    setQuery("");
  }

  return (
    <div ref={containerRef} className="relative">
      <input type="hidden" name={name} value={value || ""} readOnly />
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls="village-listbox"
          aria-autocomplete="list"
          placeholder={t("searchVillage")}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            if (!e.target.value) onChange("");
          }}
          onFocus={() => setOpen(true)}
          className={`glass-input pl-10 pr-10 ${error ? "border-danger ring-danger/20" : ""}`}
        />
        <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-0.5">
          {value && (
            <button
              type="button"
              onClick={clearSelection}
              className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700"
              aria-label="Clear"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
            aria-label={t("selectVillage")}
          >
            <ChevronDown
              className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`}
            />
          </button>
        </div>
      </div>

      {open && (
        <ul
          id="village-listbox"
          role="listbox"
          className="absolute z-50 mt-1 max-h-52 w-full overflow-auto rounded-xl border border-slate-200/80 bg-white/95 py-1 shadow-xl backdrop-blur-md dark:border-slate-600 dark:bg-slate-800/95"
        >
          {filtered.length === 0 ? (
            <li className="px-4 py-3 text-sm text-slate-500">
              {t("noVillageFound")}
            </li>
          ) : (
            filtered.map((village) => (
              <li key={village} role="option" aria-selected={value === village}>
                <button
                  type="button"
                  onClick={() => selectVillage(village)}
                  className={`flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm transition hover:bg-primary/10 ${
                    value === village
                      ? "bg-primary/10 font-medium text-primary"
                      : "text-slate-700 dark:text-slate-200"
                  }`}
                >
                  <MapPin className="h-4 w-4 shrink-0 text-primary/70" />
                  {village}
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}

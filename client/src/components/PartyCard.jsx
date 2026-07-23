"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getInitials, formatInr } from "@/utils/partyUtils";

export default function PartyCard({ party, basePath }) {
  const isLena = party.amountType === "lena" && party.amount > 0;
  const isSettled = party.status === "settled" || party.amount === 0;

  return (
    <Link
      href={`${basePath}/${party.id}`}
      className="glass-card group flex flex-col gap-3 p-4 transition hover:border-primary/30 hover:shadow-2xl sm:p-5"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary ring-2 ring-primary/20">
          {getInitials(party.name)}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-bold text-slate-900 dark:text-white">
            {party.name}
          </p>
          <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">
            {party.fatherName}
          </p>
          <span className="mt-2 inline-flex rounded-md bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-900 ring-1 ring-inset ring-amber-400/40 dark:bg-amber-500/20 dark:text-amber-100">
            {party.village}
          </span>
        </div>
        <ChevronRight className="h-5 w-5 shrink-0 text-slate-300 transition group-hover:text-primary" />
      </div>
      <div className="flex items-center justify-between border-t border-slate-200/60 pt-3 dark:border-slate-700/60">
        <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
          {isSettled
            ? "Settled"
            : isLena
              ? "Lena (You'll Get)"
              : "Dena (You'll Give)"}
        </span>
        <p
          className={`text-lg font-bold tabular-nums ${
            isSettled
              ? "text-slate-500"
              : isLena
                ? "text-success"
                : "text-danger"
          }`}
        >
          {isSettled ? "₹0" : formatInr(party.amount)}
        </p>
      </div>
    </Link>
  );
}

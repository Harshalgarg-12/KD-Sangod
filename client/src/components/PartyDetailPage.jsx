"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Phone,
  MapPin,
  IndianRupee,
  ArrowDownLeft,
  ArrowDownRight,
} from "lucide-react";
import {
  computePartyBalance,
  getTransactionsForParty,
} from "@/lib/mockData";
import { getInitials, formatInr } from "@/utils/partyUtils";

export default function PartyDetailPage({
  party,
  transactions,
  backHref,
  backLabel,
}) {
  if (!party) {
    return (
      <div className="glass-card p-8 text-center">
        <p className="text-slate-600">Party not found.</p>
        <Link href={backHref} className="btn-primary mt-4 inline-flex">
          {backLabel}
        </Link>
      </div>
    );
  }

  const partyTx = getTransactionsForParty(party, transactions);
  const balance = computePartyBalance(partyTx);
  const history = [...partyTx].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  const isGet = balance.net > 0;
  const isGive = balance.net < 0;
  const isSettled = balance.net === 0;

  return (
    <div className="space-y-6">
      <Link
        href={backHref}
        className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        {backLabel}
      </Link>

      <div className="glass-card overflow-hidden">
        <div className="bg-gradient-to-br from-primary/10 via-transparent to-accent/10 p-6 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary text-xl font-bold text-white shadow-lg shadow-primary/30">
              {getInitials(party.name)}
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                {party.name}
              </h1>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                {party.fatherName}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="inline-flex rounded-md bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-900 ring-1 ring-inset ring-amber-400/40 dark:bg-amber-500/20 dark:text-amber-100">
                  {party.village}
                </span>
                <a
                  href={`tel:${party.phone}`}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  <Phone className="h-4 w-4 text-primary" />
                  {party.phone}
                </a>
              </div>
              {party.address && (
                <p className="mt-2 flex items-start gap-1.5 text-xs text-slate-500">
                  <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  {party.address}
                </p>
              )}
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200/80 bg-white/80 p-5 text-center backdrop-blur-sm dark:border-slate-700/60 dark:bg-slate-900/80">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Balance
            </p>
            <p
              className={`mt-2 flex items-center justify-center gap-2 text-3xl font-bold tabular-nums sm:text-4xl ${
                isSettled
                  ? "text-slate-500"
                  : isGet
                    ? "text-success"
                    : "text-danger"
              }`}
            >
              <IndianRupee className="h-7 w-7 sm:h-8 sm:w-8" />
              {formatInr(balance.amount)}
              {!isSettled && (
                <span className="text-sm font-normal text-slate-500">
                  ({isGet ? "You'll Get" : "You'll Give"})
                </span>
              )}
            </p>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              type="button"
              className="flex items-center justify-center gap-2 rounded-xl border-2 border-danger/30 bg-danger/10 px-4 py-3 text-sm font-bold text-danger transition hover:bg-danger/20"
            >
              Give ₹ <span aria-hidden>🔴</span>
            </button>
            <button
              type="button"
              className="flex items-center justify-center gap-2 rounded-xl border-2 border-success/30 bg-success/10 px-4 py-3 text-sm font-bold text-success transition hover:bg-success/20"
            >
              Got ₹ <span aria-hidden>🟢</span>
            </button>
          </div>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="border-b border-slate-200/80 px-5 py-4 dark:border-slate-700/60">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Transaction History
          </h2>
        </div>
        {history.length === 0 ? (
          <p className="p-6 text-center text-sm text-slate-500">
            No transactions yet.
          </p>
        ) : (
          <ul className="divide-y divide-slate-200/60 dark:divide-slate-700/60">
            {history.map((tx) => (
              <li
                key={tx.id}
                className="flex items-center justify-between gap-4 px-5 py-4"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                    {tx.note || (tx.type === "lena" ? "Received" : "Paid")}
                  </p>
                  <p className="text-xs text-slate-500">{tx.date}</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  {tx.type === "lena" ? (
                    <ArrowDownLeft className="h-4 w-4 text-success" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 text-danger" />
                  )}
                  <span
                    className={`font-bold tabular-nums ${
                      tx.type === "lena" ? "text-success" : "text-danger"
                    }`}
                  >
                    {tx.type === "lena" ? "+" : "−"}
                    {formatInr(tx.amount)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

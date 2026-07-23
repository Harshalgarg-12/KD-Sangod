import Link from "next/link";
import { ArrowRight, Shield, Users, Wallet } from "lucide-react";
import PublicFooter from "@/components/PublicFooter";
import PublicHeader from "@/components/PublicHeader";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col auth-gradient">
      <PublicHeader />

      <main className="flex-1">
        <section className="relative overflow-hidden px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div
            className="pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-primary/20 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-accent/20 blur-3xl"
            aria-hidden
          />
          <div className="relative mx-auto max-w-4xl text-center">
            <span className="inline-flex rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary ring-1 ring-primary/20">
              Sangod · Rajasthan
            </span>
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl">
              Welcome to{" "}
              <span className="bg-gradient-to-r from-primary to-indigo-400 bg-clip-text text-transparent">
                KD Sangod
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
              Honest shopkeeping with simple lena–dena tracking. Manage
              customers, suppliers, and bills — all in one place.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              {/* <Link href="/products" className="btn-primary gap-2 px-8">
                Browse products
                <ArrowRight className="h-4 w-4" />
              </Link> */}
              <Link href="/login" className="btn-ghost px-8">
                Owner login
              </Link>
            </div>
          </div>
        </section>

        <section
          id="about"
          className="border-y border-slate-200/60 bg-white/50 px-4 py-16 dark:border-slate-700/60 dark:bg-slate-900/40 sm:px-6 lg:px-8"
        >
          <div className="mx-auto max-w-6xl">
            <h2 className="text-center text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
              About KD Sangod
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-center text-slate-600 dark:text-slate-400">
              A family-run business serving villages across the Sangod region
              with quality goods and transparent credit (khata) management.
            </p>
            <div className="mt-12 grid gap-6 sm:grid-cols-3">
              <div className="glass-card p-6 text-center">
                <Wallet className="mx-auto h-10 w-10 text-success" />
                <h3 className="mt-4 font-semibold text-slate-900 dark:text-white">
                  Lena & Dena
                </h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  Track who owes you and whom you owe — clearly color-coded.
                </p>
              </div>
              <div className="glass-card p-6 text-center">
                <Users className="mx-auto h-10 w-10 text-primary" />
                <h3 className="mt-4 font-semibold text-slate-900 dark:text-white">
                  Parties
                </h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  Customers and suppliers with village-wise records.
                </p>
              </div>
              <div className="glass-card p-6 text-center">
                <Shield className="mx-auto h-10 w-10 text-accent" />
                <h3 className="mt-4 font-semibold text-slate-900 dark:text-white">
                  Secure access
                </h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  Owner dashboard protected for your shop data only.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}

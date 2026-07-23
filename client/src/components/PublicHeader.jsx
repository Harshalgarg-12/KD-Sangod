"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Store, X } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  // { href: "/products", label: "Products" },
  { href: "/login", label: "Login" },
];

export default function PublicHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/30 bg-white/75 backdrop-blur-xl dark:border-slate-700/50 dark:bg-slate-900/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/30">
            <Store className="h-5 w-5" />
          </span>
          <span className="text-lg font-bold text-slate-900 dark:text-white">
            KD Sangod
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map(({ href, label }) => {
            const active =
              href === "/"
                ? pathname === "/"
                : pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                  active
                    ? "bg-primary text-white shadow-md shadow-primary/25"
                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                }`}
              >
                {label}
              </Link>
            );
          })}
          {/* <Link href="/signup" className="btn-primary ml-2 !py-2">
            Sign up
          </Link> */}
        </nav>

        <button
          type="button"
          className="btn-ghost !p-2 md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-slate-200/80 px-4 py-3 dark:border-slate-700 md:hidden">
          <ul className="space-y-1">
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-primary/10 hover:text-primary dark:text-slate-200"
                >
                  {label}
                </Link>
              </li>
            ))}
            <li>
              {/* <Link
                href="/signup"
                onClick={() => setOpen(false)}
                className="btn-primary mt-2 block text-center"
              >
                Sign up
              </Link> */}
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}

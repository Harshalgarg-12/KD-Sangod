"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Truck,
  ArrowLeftRight,
  BarChart3,
  UserCircle,
  Store,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, key: "dashboard" },
  { href: "/customers", icon: Users, key: "customers" },
  { href: "/suppliers", icon: Truck, key: "suppliers" },
  { href: "/transactions", icon: ArrowLeftRight, key: "transactions" },
  { href: "/reports", icon: BarChart3, key: "reports" },
  { href: "/profile", icon: UserCircle, key: "profile" },
];

function isNavActive(pathname, href) {
  if (href === "/dashboard") {
    return pathname === "/dashboard" || pathname.startsWith("/dashboard/");
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Sidebar({ mobileOpen, onClose }) {
  const pathname = usePathname();
  const { t } = useLanguage();

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-white/20 bg-white/80 shadow-xl backdrop-blur-xl transition-transform duration-300 dark:border-slate-700/50 dark:bg-slate-900/85 lg:static lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex items-center gap-3 border-b border-slate-200/60 px-5 py-5 dark:border-slate-700/60">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/30">
            <Store className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              {t("appName")}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t("tagline")}
            </p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {navItems.map(({ href, icon: Icon, key }) => {
            const active = isNavActive(pathname, href);
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                  active
                    ? "bg-primary text-white shadow-md shadow-primary/25 ring-1 ring-primary/30"
                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {t(key)}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}

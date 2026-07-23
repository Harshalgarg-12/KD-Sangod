"use client";

import { useRouter } from "next/navigation";
import {
  Menu,
  Moon,
  Sun,
  Languages,
  LogOut,
  Bell,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

export default function Navbar({ onMenuClick }) {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { locale, toggleLocale, t } = useLanguage();
  const { isDark, toggleTheme, mounted } = useTheme();

  async function handleLogout() {
    await logout();
    toast.success(t("logout"));
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-slate-200/60 bg-white/70 px-4 backdrop-blur-md dark:border-slate-700/60 dark:bg-slate-900/70 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="btn-ghost !p-2 lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
            {user?.name || t("appName")}
          </p>
          {user?.village ? (
            <p className="truncate text-xs text-slate-500">{user.village}</p>
          ) : (
            <p className="truncate text-xs text-slate-500 lg:hidden">
              {t("tagline")}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          className="btn-ghost !p-2"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
        </button>

        <button
          type="button"
          onClick={toggleLocale}
          className="btn-ghost gap-1.5 !px-3"
          aria-label={t("language")}
          title={t("language")}
        >
          <Languages className="h-4 w-4" />
          <span className="text-xs font-bold uppercase">
            {locale === "en" ? "HI" : "EN"}
          </span>
        </button>

        <button
          type="button"
          onClick={toggleTheme}
          className="btn-ghost !p-2"
          aria-label={isDark ? t("lightMode") : t("darkMode")}
          title={isDark ? t("lightMode") : t("darkMode")}
          disabled={!mounted}
        >
          {mounted && isDark ? (
            <Sun className="h-5 w-5 text-accent" />
          ) : (
            <Moon className="h-5 w-5 text-primary" />
          )}
        </button>

        <button
          type="button"
          onClick={handleLogout}
          className="btn-ghost gap-1.5 !px-3 text-danger hover:!border-danger/30 hover:!bg-danger/5"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">{t("logout")}</span>
        </button>
      </div>
    </header>
  );
}

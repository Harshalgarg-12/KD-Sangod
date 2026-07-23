"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { t as translate } from "@/lib/i18n";

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [locale, setLocale] = useState("en");

  const toggleLocale = useCallback(() => {
    setLocale((prev) => (prev === "en" ? "hi" : "en"));
  }, []);

  const t = useCallback((key) => translate(locale, key), [locale]);

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      toggleLocale,
      t,
      isHindi: locale === "hi",
    }),
    [locale, toggleLocale, t]
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

export default LanguageContext;

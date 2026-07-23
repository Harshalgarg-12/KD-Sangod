"use client";

import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./AuthContext";
import { AccountProvider } from "./AccountContext";
import { LanguageProvider } from "./LanguageContext";
import { ThemeProvider } from "./ThemeContext";

export default function Providers({ children }) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <AccountProvider>
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                className:
                  "!bg-white/90 !text-slate-800 !backdrop-blur-md dark:!bg-slate-800/90 dark:!text-slate-100",
                duration: 4000,
              }}
            />
          </AccountProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

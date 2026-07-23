import "./globals.css";
import Providers from "@/context/Providers";

// Metadata shown in the browser tab and search engines
export const metadata = {
  title: "KD Sangod",
  description:
    "Shop management for KD Sangod — customers, receivables, and payables.",
};

// RootLayout wraps the entire app.
// Providers gives all pages access to Auth, Theme, Language, and Toast contexts.
// NOTE: We removed the duplicate ToastProvider here — react-hot-toast Toaster
// is already rendered inside Providers.jsx. Having both react-toastify AND
// react-hot-toast caused duplicate/conflicting toast popups.
export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className="min-h-screen bg-slate-50 text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-100"
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
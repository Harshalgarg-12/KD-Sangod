import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

export default function PublicFooter() {
  return (
    <footer
      id="contact"
      className="border-t border-slate-200/80 bg-slate-900 text-slate-300 dark:border-slate-700"
    >
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <h3 className="text-lg font-bold text-white">KD Sangod</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              Your trusted neighborhood shop in Sangod — Edible Oil, Sugar, Groceries,
              and daily essentials with honest accounting.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-accent">
              Contact
            </h4>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                Gandhi Circle, Sangod, Rajasthan
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-success" />
                <a href="tel:+919829012345" className="hover:text-white">
                  +91 9214517389
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-primary" />
                <a
                  href="mailto:contact@kdsangod.shop"
                  className="hover:text-white"
                >
                  Harshalgarg200@gmail.com
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-accent">
              Quick links
            </h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/products" className="hover:text-white">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white">
                  Shop owner login
                </Link>
              </li>
              <li>
                <Link href="/signup" className="hover:text-white">
                  Create account
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <p className="mt-10 border-t border-slate-700 pt-6 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} KD Sangod. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

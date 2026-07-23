import Link from "next/link";
import PublicFooter from "@/components/PublicFooter";
import PublicHeader from "@/components/PublicHeader";
import { mockProducts } from "@/lib/productsMock";

function formatInr(n) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

export default function ProductsPage() {
  return (
    <div className="flex min-h-screen flex-col auth-gradient">
      <PublicHeader />

      <main className="flex-1 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
              Our Products
            </h1>
            <p className="mt-3 text-slate-600 dark:text-slate-400">
              Sample catalog — visit the shop or call for live rates & stock.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {mockProducts.map((product) => (
              <article
                key={product.id}
                className="glass-card group flex flex-col overflow-hidden transition hover:-translate-y-1 hover:shadow-2xl"
              >
                <div className="flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-primary/5 via-white/50 to-accent/10 text-5xl dark:from-primary/10 dark:to-accent/5">
                  <span role="img" aria-label={product.name}>
                    {product.emoji}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <span className="text-xs font-semibold uppercase tracking-wide text-accent">
                    {product.category}
                  </span>
                  <h2 className="mt-1 font-bold text-slate-900 dark:text-white">
                    {product.name}
                  </h2>
                  <p className="mt-3 text-lg font-bold text-primary">
                    {formatInr(product.price)}
                    <span className="ml-1 text-xs font-normal text-slate-500">
                      {product.unit}
                    </span>
                  </p>
                  <button
                    type="button"
                    className="btn-ghost mt-4 w-full text-sm"
                    disabled
                  >
                    Enquire at shop
                  </button>
                </div>
              </article>
            ))}
          </div>

          <p className="mt-12 text-center text-sm text-slate-500">
            Prices indicative only.{" "}
            <Link href="/#contact" className="font-semibold text-primary hover:underline">
              Contact us
            </Link>{" "}
            for bulk orders.
          </p>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}

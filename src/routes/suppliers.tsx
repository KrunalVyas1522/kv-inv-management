import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, Clock, Package } from "lucide-react";
import { suppliers } from "@/data/suppliers";
import { useInventory } from "@/lib/inventory";

export const Route = createFileRoute("/suppliers")({
  head: () => ({
    meta: [
      { title: "Suppliers — StockPilot Demo" },
      {
        name: "description",
        content: "Supplier directory with contact, region, lead time, and product counts.",
      },
      { property: "og:title", content: "Suppliers — StockPilot Demo" },
      {
        property: "og:description",
        content: "Browse all suppliers powering your inventory.",
      },
    ],
  }),
  component: SuppliersPage,
});

function SuppliersPage() {
  const { products } = useInventory();
  const counts = new Map<string, number>();
  for (const p of products) {
    counts.set(p.supplierId, (counts.get(p.supplierId) ?? 0) + 1);
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <div className="flex flex-col gap-1">
        <p className="text-xs font-medium uppercase tracking-widest text-primary">Network</p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Suppliers
        </h1>
        <p className="text-sm text-muted-foreground">
          {suppliers.length} active partners across {new Set(suppliers.map((s) => s.region)).size}{" "}
          regions.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {suppliers.map((s) => {
          const productCount = counts.get(s.id) ?? 0;
          const initials = s.name
            .split(" ")
            .map((w) => w[0])
            .slice(0, 2)
            .join("");
          return (
            <div
              key={s.id}
              className="group rounded-xl border border-border bg-gradient-surface p-5 shadow-card transition-all hover:border-primary/30 hover:shadow-glow"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-primary text-sm font-semibold text-primary-foreground shadow-glow">
                  {initials}
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="truncate text-base font-semibold tracking-tight text-foreground">
                    {s.name}
                  </h2>
                  <p className="text-xs text-muted-foreground">{s.contact}</p>
                </div>
              </div>

              <div className="mt-4 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-3.5 w-3.5" />
                  <span className="truncate">{s.email}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" />
                  {s.region}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  {s.leadTimeDays} day lead time
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Package className="h-3.5 w-3.5" />
                  <span className="font-mono">{productCount}</span>
                  products
                </div>
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  {s.id}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

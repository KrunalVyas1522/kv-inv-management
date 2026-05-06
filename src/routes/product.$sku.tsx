import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowDownLeft, ArrowLeft, ArrowUpRight, Minus, Package, Plus } from "lucide-react";
import { useInventory } from "@/lib/inventory";
import { getStatus } from "@/data/inventory";
import { getSupplier } from "@/data/suppliers";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { formatCurrency, formatDate } from "@/lib/format";
import { toast } from "sonner";
import { EmptyState } from "@/components/EmptyState";

export const Route = createFileRoute("/product/$sku")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.sku} — StockPilot Demo` },
      {
        name: "description",
        content: `Detail view for SKU ${params.sku}: stock level, supplier, recent movements, and stock adjustments.`,
      },
      { property: "og:title", content: `${params.sku} — StockPilot Demo` },
      {
        property: "og:description",
        content: `Detail view for SKU ${params.sku}.`,
      },
    ],
  }),
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl">
      <EmptyState
        title="Product not found"
        description="This SKU doesn't exist in your inventory."
      />
      <div className="mt-4 text-center">
        <Link to="/inventory" className="text-sm text-primary hover:text-primary-glow">
          ← Back to inventory
        </Link>
      </div>
    </div>
  ),
  loader: ({ params }) => {
    return { sku: params.sku };
  },
  component: ProductDetail,
});

const REASONS = ["Restock", "Sale", "Damaged", "Returned", "Adjustment"];

function ProductDetail() {
  const { sku } = Route.useLoaderData();
  const { products, movements, adjustStock } = useInventory();
  const product = products.find((p) => p.sku === sku);

  const [delta, setDelta] = useState(1);
  const [direction, setDirection] = useState<"in" | "out">("in");
  const [reason, setReason] = useState(REASONS[0]);

  const productMovements = useMemo(
    () =>
      movements
        .filter((m) => m.sku === sku)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 10),
    [movements, sku],
  );

  if (!product) throw notFound();

  const supplier = getSupplier(product.supplierId);
  const status = getStatus(product);
  const ratio = product.reorderLevel > 0
    ? Math.min(150, Math.round((product.stock / product.reorderLevel) * 100))
    : 100;
  const ratioCapped = Math.min(100, ratio);

  const handleAdjust = () => {
    if (delta <= 0) return;
    const signed = direction === "in" ? delta : -delta;
    adjustStock(product.sku, signed, reason);
    toast.success(`${direction === "in" ? "Added" : "Removed"} ${delta} units`, {
      description: `${product.name} · ${reason}`,
    });
    setDelta(1);
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <Link
        to="/inventory"
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to inventory
      </Link>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        {/* Image / hero */}
        <div className="overflow-hidden rounded-xl border border-border bg-gradient-surface shadow-card">
          <div className="relative aspect-square w-full bg-secondary/40">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover"
                loading="lazy"
                width={768}
                height={768}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                <Package className="h-16 w-16" />
              </div>
            )}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-card via-card/40 to-transparent p-5">
              <StatusBadge status={status} />
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-5">
          <div>
            <p className="font-mono text-xs text-muted-foreground">{product.sku}</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {product.name}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">{product.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <Info label="Category" value={product.category} />
            <Info label="Unit price" value={formatCurrency(product.unitPrice)} />
            <Info label="Reorder at" value={`${product.reorderLevel} units`} />
            <Info label="Supplier" value={supplier?.name ?? "—"} />
            <Info label="Lead time" value={`${supplier?.leadTimeDays ?? "—"} days`} />
            <Info label="Region" value={supplier?.region ?? "—"} />
          </div>

          {/* Stock indicator */}
          <div className="rounded-xl border border-border bg-gradient-surface p-5 shadow-card">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">Current stock</p>
                <p className="mt-1 text-3xl font-semibold tracking-tight text-foreground">
                  {product.stock}
                  <span className="ml-1 text-sm font-normal text-muted-foreground">units</span>
                </p>
              </div>
              <p className="text-xs text-muted-foreground">Reorder: {product.reorderLevel}</p>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-secondary">
              <div
                className={`h-full rounded-full transition-all ${
                  status === "out"
                    ? "bg-destructive"
                    : status === "low"
                      ? "bg-warning"
                      : "bg-gradient-primary"
                }`}
                style={{ width: `${ratioCapped}%` }}
              />
            </div>
          </div>

          {/* Adjust stock */}
          <div className="rounded-xl border border-border bg-gradient-surface p-5 shadow-card">
            <h2 className="text-sm font-semibold tracking-tight text-foreground">Adjust stock</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Add or remove units. Movements are logged below.
            </p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
              <div className="flex-1">
                <label className="text-xs font-medium text-muted-foreground">Direction</label>
                <Select value={direction} onValueChange={(v) => setDirection(v as "in" | "out")}>
                  <SelectTrigger className="mt-1 h-10 border-border bg-secondary/40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="in">Stock in</SelectItem>
                    <SelectItem value="out">Stock out</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <label className="text-xs font-medium text-muted-foreground">Quantity</label>
                <div className="mt-1 flex items-center gap-2">
                  <button
                    onClick={() => setDelta((d) => Math.max(1, d - 1))}
                    className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-secondary/40 text-foreground hover:bg-secondary"
                    aria-label="Decrease"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <Input
                    type="number"
                    value={delta}
                    min={1}
                    onChange={(e) => setDelta(Math.max(1, parseInt(e.target.value) || 1))}
                    className="h-10 border-border bg-secondary/40 text-center font-mono"
                  />
                  <button
                    onClick={() => setDelta((d) => d + 1)}
                    className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-secondary/40 text-foreground hover:bg-secondary"
                    aria-label="Increase"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              <div className="flex-1">
                <label className="text-xs font-medium text-muted-foreground">Reason</label>
                <Select value={reason} onValueChange={setReason}>
                  <SelectTrigger className="mt-1 h-10 border-border bg-secondary/40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {REASONS.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button
              onClick={handleAdjust}
              className="mt-4 h-10 w-full bg-gradient-primary text-primary-foreground shadow-glow hover:opacity-90 sm:w-auto"
            >
              Apply adjustment
            </Button>
          </div>
        </div>
      </div>

      {/* Movement history */}
      <div className="rounded-xl border border-border bg-gradient-surface shadow-card">
        <div className="border-b border-border px-5 py-4">
          <h2 className="text-base font-semibold tracking-tight text-foreground">
            Movement history
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">Recent activity for this SKU.</p>
        </div>
        {productMovements.length === 0 ? (
          <div className="p-6">
            <EmptyState title="No movements yet" description="Adjustments will appear here." />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs uppercase tracking-wider text-muted-foreground">
                <tr className="border-b border-border text-left">
                  <th className="px-5 py-3 font-medium">Type</th>
                  <th className="px-5 py-3 font-medium">Quantity</th>
                  <th className="px-5 py-3 font-medium">Reason</th>
                  <th className="px-5 py-3 text-right font-medium">When</th>
                </tr>
              </thead>
              <tbody>
                {productMovements.map((m) => (
                  <tr
                    key={m.id}
                    className="border-b border-border/50 last:border-b-0 hover:bg-secondary/30"
                  >
                    <td className="px-5 py-3">
                      <span
                        className={`inline-flex h-7 w-7 items-center justify-center rounded-full ${
                          m.type === "in"
                            ? "bg-success/15 text-success"
                            : "bg-destructive/15 text-destructive"
                        }`}
                      >
                        {m.type === "in" ? (
                          <ArrowDownLeft className="h-3.5 w-3.5" />
                        ) : (
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        )}
                      </span>
                    </td>
                    <td className="px-5 py-3 font-mono text-foreground">
                      {m.type === "in" ? "+" : "−"}
                      {m.quantity}
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">{m.reason}</td>
                    <td className="px-5 py-3 text-right text-xs text-muted-foreground">
                      {formatDate(m.date)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-secondary/30 p-3">
      <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}

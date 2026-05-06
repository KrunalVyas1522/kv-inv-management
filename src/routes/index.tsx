import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import {
  Boxes,
  DollarSign,
  AlertTriangle,
  PackageX,
  ArrowDownLeft,
  ArrowUpRight,
  TrendingUp,
} from "lucide-react";
import { useInventory } from "@/lib/inventory";
import { getStatus } from "@/data/inventory";
import { StatCard } from "@/components/StatCard";
import { StatusBadge } from "@/components/StatusBadge";
import { formatCurrency, formatDate, formatNumber } from "@/lib/format";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — StockPilot Demo" },
      {
        name: "description",
        content:
          "Real-time inventory KPIs, stock movements, low-stock alerts, and 7-day trend visualization.",
      },
      { property: "og:title", content: "Dashboard — StockPilot Demo" },
      {
        property: "og:description",
        content: "Real-time inventory KPIs, stock movements, and low-stock alerts.",
      },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { products, movements } = useInventory();

  const stats = useMemo(() => {
    const totalSkus = products.length;
    const totalValue = products.reduce((sum, p) => sum + p.stock * p.unitPrice, 0);
    const lowStock = products.filter((p) => getStatus(p) === "low").length;
    const outOfStock = products.filter((p) => getStatus(p) === "out").length;
    return { totalSkus, totalValue, lowStock, outOfStock };
  }, [products]);

  const recentMovements = useMemo(
    () =>
      [...movements]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 8),
    [movements],
  );

  const lowStockProducts = useMemo(
    () =>
      products
        .filter((p) => p.stock > 0 && p.stock <= p.reorderLevel)
        .sort((a, b) => a.stock / a.reorderLevel - b.stock / b.reorderLevel)
        .slice(0, 5),
    [products],
  );

  const chartData = useMemo(() => {
    // Build last 7 days: estimate stock value over time based on movement deltas (working backwards)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const days: { date: string; label: string; value: number }[] = [];

    let runningValue = products.reduce((sum, p) => sum + p.stock * p.unitPrice, 0);
    const sortedMovements = [...movements].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
    const priceMap = new Map(products.map((p) => [p.sku, p.unitPrice]));

    for (let i = 6; i >= 0; i--) {
      const dayStart = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);
      // Apply (reverse) movements that happened after dayEnd to roll back to that day
      const futureMovements = sortedMovements.filter((m) => new Date(m.date) >= dayEnd);
      let valueAtDay = runningValue;
      for (const m of futureMovements) {
        const price = priceMap.get(m.sku) ?? 0;
        // reverse: if it was an "in", subtract it; if "out", add it back
        valueAtDay += (m.type === "in" ? -1 : 1) * m.quantity * price;
      }
      days.push({
        date: dayStart.toISOString(),
        label: dayStart.toLocaleDateString("en-US", { weekday: "short" }),
        value: Math.max(0, Math.round(valueAtDay)),
      });
    }
    return days;
  }, [products, movements]);

  const productMap = useMemo(() => new Map(products.map((p) => [p.sku, p])), [products]);

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <div className="flex flex-col gap-1">
        <p className="text-xs font-medium uppercase tracking-widest text-primary">Overview</p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Welcome back, Alex
        </h1>
        <p className="text-sm text-muted-foreground">
          Here's what's happening across your inventory today.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total SKUs"
          value={formatNumber(stats.totalSkus)}
          icon={Boxes}
          accent="primary"
          delta={{ value: "2.4%", trend: "up" }}
        />
        <StatCard
          label="Stock Value"
          value={formatCurrency(stats.totalValue)}
          icon={DollarSign}
          accent="primary"
          delta={{ value: "5.1%", trend: "up" }}
        />
        <StatCard
          label="Low Stock"
          value={formatNumber(stats.lowStock)}
          icon={AlertTriangle}
          accent="warning"
          delta={{ value: "1.2%", trend: "down" }}
        />
        <StatCard
          label="Out of Stock"
          value={formatNumber(stats.outOfStock)}
          icon={PackageX}
          accent="destructive"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-gradient-surface p-5 shadow-card lg:col-span-2">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h2 className="text-base font-semibold tracking-tight text-foreground">
                Stock value · last 7 days
              </h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Estimated total inventory value over time.
              </p>
            </div>
            <div className="flex items-center gap-1.5 rounded-md bg-success/15 px-2 py-1 text-xs font-medium text-success">
              <TrendingUp className="h-3 w-3" />
              5.1%
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ left: -10, right: 8, top: 4, bottom: 0 }}>
                <defs>
                  <linearGradient id="valueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.78 0.16 165)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="oklch(0.78 0.16 165)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="oklch(1 0 0 / 6%)" vertical={false} />
                <XAxis
                  dataKey="label"
                  stroke="oklch(0.68 0.02 250)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="oklch(0.68 0.02 250)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{
                    background: "oklch(0.21 0.02 250)",
                    border: "1px solid oklch(1 0 0 / 10%)",
                    borderRadius: "0.5rem",
                    fontSize: "12px",
                  }}
                  labelStyle={{ color: "oklch(0.96 0.01 250)" }}
                  formatter={(v: number) => [formatCurrency(v), "Value"]}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="oklch(0.78 0.16 165)"
                  strokeWidth={2}
                  fill="url(#valueGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-gradient-surface p-5 shadow-card">
          <div className="mb-4 flex items-start justify-between">
            <h2 className="text-base font-semibold tracking-tight text-foreground">
              Top low-stock items
            </h2>
            <Link
              to="/inventory"
              className="text-xs font-medium text-primary hover:text-primary-glow"
            >
              View all →
            </Link>
          </div>
          <div className="space-y-4">
            {lowStockProducts.length === 0 && (
              <p className="text-xs text-muted-foreground">No low-stock items right now.</p>
            )}
            {lowStockProducts.map((p) => {
              const ratio = Math.min(100, Math.round((p.stock / p.reorderLevel) * 100));
              return (
                <Link
                  key={p.sku}
                  to="/product/$sku"
                  params={{ sku: p.sku }}
                  className="block space-y-1.5 rounded-lg p-2 -m-2 hover:bg-secondary/40"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-foreground">{p.name}</span>
                    <span className="font-mono text-muted-foreground">
                      {p.stock}/{p.reorderLevel}
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-gradient-primary"
                      style={{ width: `${ratio}%` }}
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-gradient-surface shadow-card">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h2 className="text-base font-semibold tracking-tight text-foreground">
              Recent stock movements
            </h2>
            <p className="mt-0.5 text-xs text-muted-foreground">Last 8 entries across all SKUs.</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-3 font-medium">Type</th>
                <th className="px-5 py-3 font-medium">Product</th>
                <th className="px-5 py-3 font-medium">SKU</th>
                <th className="px-5 py-3 font-medium">Quantity</th>
                <th className="px-5 py-3 font-medium">Reason</th>
                <th className="px-5 py-3 font-medium text-right">When</th>
              </tr>
            </thead>
            <tbody>
              {recentMovements.map((m) => {
                const product = productMap.get(m.sku);
                return (
                  <tr
                    key={m.id}
                    className="border-b border-border/50 transition-colors last:border-b-0 hover:bg-secondary/30"
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
                    <td className="px-5 py-3 font-medium text-foreground">
                      {product?.name ?? "—"}
                    </td>
                    <td className="px-5 py-3 font-mono text-xs text-muted-foreground">{m.sku}</td>
                    <td className="px-5 py-3 font-mono text-foreground">
                      {m.type === "in" ? "+" : "−"}
                      {m.quantity}
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">{m.reason}</td>
                    <td className="px-5 py-3 text-right text-xs text-muted-foreground">
                      {formatDate(m.date)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Hidden helper to silence unused import warning if any */}
      <span className="hidden">
        <StatusBadge status="in-stock" />
      </span>
    </div>
  );
}

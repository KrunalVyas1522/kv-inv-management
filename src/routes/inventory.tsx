import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowUpDown, Search } from "lucide-react";
import { useInventory } from "@/lib/inventory";
import { categories, getStatus, type Category, type Status } from "@/data/inventory";
import { StatusBadge } from "@/components/StatusBadge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmptyState } from "@/components/EmptyState";
import { formatCurrency, formatNumber } from "@/lib/format";

export const Route = createFileRoute("/inventory")({
  head: () => ({
    meta: [
      { title: "Inventory — StockPilot Demo" },
      {
        name: "description",
        content:
          "Browse, search, and filter the full SKU catalog with sortable columns and live status badges.",
      },
      { property: "og:title", content: "Inventory — StockPilot Demo" },
      {
        property: "og:description",
        content: "Searchable, filterable, sortable SKU catalog.",
      },
    ],
  }),
  component: InventoryPage,
});

type SortKey = "sku" | "name" | "category" | "stock" | "reorderLevel" | "unitPrice" | "status";

function InventoryPage() {
  const { products } = useInventory();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category | "all">("all");
  const [status, setStatus] = useState<Status | "all">("all");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = products.filter((p) => {
      const matchesQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);
      const matchesCat = category === "all" || p.category === category;
      const matchesStatus = status === "all" || getStatus(p) === status;
      return matchesQuery && matchesCat && matchesStatus;
    });

    list = [...list].sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      if (sortKey === "status") {
        const order: Record<Status, number> = { out: 0, low: 1, "in-stock": 2 };
        return (order[getStatus(a)] - order[getStatus(b)]) * dir;
      }
      const va = a[sortKey];
      const vb = b[sortKey];
      if (typeof va === "number" && typeof vb === "number") return (va - vb) * dir;
      return String(va).localeCompare(String(vb)) * dir;
    });

    return list;
  }, [products, query, category, status, sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const SortHeader = ({ k, label, align = "left" }: { k: SortKey; label: string; align?: "left" | "right" }) => (
    <th className={`px-4 py-3 font-medium ${align === "right" ? "text-right" : "text-left"}`}>
      <button
        onClick={() => toggleSort(k)}
        className={`inline-flex items-center gap-1.5 hover:text-foreground ${sortKey === k ? "text-foreground" : ""}`}
      >
        {label}
        <ArrowUpDown className="h-3 w-3 opacity-60" />
      </button>
    </th>
  );

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <div className="flex flex-col gap-1">
        <p className="text-xs font-medium uppercase tracking-widest text-primary">Catalog</p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Inventory
        </h1>
        <p className="text-sm text-muted-foreground">
          {formatNumber(filtered.length)} of {formatNumber(products.length)} SKUs
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or SKU..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-10 border-border bg-secondary/40 pl-9 text-sm"
          />
        </div>
        <Select value={category} onValueChange={(v) => setCategory(v as Category | "all")}>
          <SelectTrigger className="h-10 w-full border-border bg-secondary/40 sm:w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={(v) => setStatus(v as Status | "all")}>
          <SelectTrigger className="h-10 w-full border-border bg-secondary/40 sm:w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="in-stock">In stock</SelectItem>
            <SelectItem value="low">Low stock</SelectItem>
            <SelectItem value="out">Out of stock</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-gradient-surface shadow-card">
        {filtered.length === 0 ? (
          <div className="p-6">
            <EmptyState
              title="No SKUs match your filters"
              description="Try adjusting your search or clearing filters."
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary/30 text-xs uppercase tracking-wider text-muted-foreground">
                <tr className="border-b border-border">
                  <SortHeader k="sku" label="SKU" />
                  <SortHeader k="name" label="Name" />
                  <SortHeader k="category" label="Category" />
                  <SortHeader k="stock" label="Stock" align="right" />
                  <SortHeader k="reorderLevel" label="Reorder" align="right" />
                  <SortHeader k="unitPrice" label="Price" align="right" />
                  <SortHeader k="status" label="Status" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr
                    key={p.sku}
                    onClick={() => navigate({ to: "/product/$sku", params: { sku: p.sku } })}
                    className="cursor-pointer border-b border-border/50 transition-colors last:border-b-0 hover:bg-secondary/40"
                  >
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{p.sku}</td>
                    <td className="px-4 py-3 font-medium text-foreground">{p.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{p.category}</td>
                    <td className="px-4 py-3 text-right font-mono text-foreground">{p.stock}</td>
                    <td className="px-4 py-3 text-right font-mono text-muted-foreground">
                      {p.reorderLevel}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-foreground">
                      {formatCurrency(p.unitPrice)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={getStatus(p)} />
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

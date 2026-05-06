import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { inventory as initialInventory, type Product } from "@/data/inventory";
import { movements as initialMovements, type Movement, type MovementType } from "@/data/movements";

interface InventoryState {
  products: Product[];
  movements: Movement[];
  adjustStock: (sku: string, delta: number, reason: string) => void;
  reset: () => void;
}

const InventoryContext = createContext<InventoryState | null>(null);

const STORAGE_KEY = "stockpilot:state:v1";

interface PersistedState {
  products: Product[];
  movements: Movement[];
}

function loadFromStorage(): PersistedState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PersistedState;
  } catch {
    return null;
  }
}

export function InventoryProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(initialInventory);
  const [movements, setMovements] = useState<Movement[]>(initialMovements);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = loadFromStorage();
    if (stored) {
      // Merge: keep image refs from initial inventory (they aren't serialized as imports)
      const merged = stored.products.map((p) => {
        const original = initialInventory.find((o) => o.sku === p.sku);
        return { ...p, image: original?.image };
      });
      setProducts(merged);
      setMovements(stored.movements);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || typeof window === "undefined") return;
    const toStore: PersistedState = {
      products: products.map(({ image, ...rest }) => ({ ...rest, image: undefined })),
      movements,
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
  }, [products, movements, hydrated]);

  const adjustStock = (sku: string, delta: number, reason: string) => {
    if (delta === 0) return;
    setProducts((prev) =>
      prev.map((p) =>
        p.sku === sku ? { ...p, stock: Math.max(0, p.stock + delta) } : p,
      ),
    );
    const type: MovementType = delta > 0 ? "in" : "out";
    const newMovement: Movement = {
      id: `M-${Date.now().toString(36).toUpperCase()}`,
      sku,
      type,
      quantity: Math.abs(delta),
      reason,
      date: new Date().toISOString(),
    };
    setMovements((prev) => [newMovement, ...prev]);
  };

  const reset = () => {
    setProducts(initialInventory);
    setMovements(initialMovements);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  };

  const value = useMemo<InventoryState>(
    () => ({ products, movements, adjustStock, reset }),
    [products, movements],
  );

  return <InventoryContext.Provider value={value}>{children}</InventoryContext.Provider>;
}

export function useInventory() {
  const ctx = useContext(InventoryContext);
  if (!ctx) throw new Error("useInventory must be used within InventoryProvider");
  return ctx;
}

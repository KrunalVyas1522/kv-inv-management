import { useState, type ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { useInventory } from "@/lib/inventory";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { toast } from "sonner";

export function AppShell({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { reset } = useInventory();

  return (
    <div className="relative flex min-h-screen bg-background">
      <div className="pointer-events-none fixed inset-x-0 top-0 -z-0 h-[600px] bg-gradient-glow" />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="relative z-10 flex min-w-0 flex-1 flex-col">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
        <footer className="border-t border-border px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-3 text-xs text-muted-foreground sm:flex-row sm:items-center">
            <p>
              StockPilot Demo — built with TanStack Start, Tailwind, and shadcn/ui. Mock data only.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                reset();
                toast.success("Demo data reset to defaults");
              }}
              className="h-8 gap-2 border-border bg-secondary/40 text-xs"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset demo data
            </Button>
          </div>
        </footer>
      </div>
    </div>
  );
}

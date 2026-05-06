import { Outlet, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { InventoryProvider } from "@/lib/inventory";
import { AppShell } from "@/components/layout/AppShell";
import { Toaster } from "@/components/ui/sonner";
import { Link } from "@tanstack/react-router";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="text-xs font-medium uppercase tracking-widest text-primary">404</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
          Page not found
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center justify-center rounded-md bg-gradient-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-glow transition-transform hover:scale-[1.02]"
        >
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "StockPilot Demo — Premium Inventory Dashboard" },
      {
        name: "description",
        content:
          "A premium dark-themed inventory management dashboard demo built with TanStack Start, Tailwind, and shadcn/ui.",
      },
      { name: "author", content: "StockPilot Demo" },
      { property: "og:title", content: "StockPilot Demo — Premium Inventory Dashboard" },
      {
        property: "og:description",
        content:
          "Track SKUs, stock movements, suppliers, and reorder thresholds in a refined SaaS-grade dashboard.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "StockPilot Demo — Premium Inventory Dashboard" },
      { name: "description", content: "StockPilot Demo is a premium Inventory Management Dashboard showcasing mock data and a refined dark theme." },
      { property: "og:description", content: "StockPilot Demo is a premium Inventory Management Dashboard showcasing mock data and a refined dark theme." },
      { name: "twitter:description", content: "StockPilot Demo is a premium Inventory Management Dashboard showcasing mock data and a refined dark theme." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/c9e420b9-18ad-4ba5-a65c-1ec3d63d25c8/id-preview-fa49c15f--07206a24-54f6-47fb-8f72-425e77f36d17.lovable.app-1776518148934.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/c9e420b9-18ad-4ba5-a65c-1ec3d63d25c8/id-preview-fa49c15f--07206a24-54f6-47fb-8f72-425e77f36d17.lovable.app-1776518148934.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      {
        rel: "preconnect",
        href: "https://fonts.googleapis.com",
      },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <InventoryProvider>
      <AppShell>
        <Outlet />
      </AppShell>
      <Toaster />
    </InventoryProvider>
  );
}

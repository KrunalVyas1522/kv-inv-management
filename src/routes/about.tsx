import { createFileRoute, Link } from "@tanstack/react-router";
import { Boxes, Code2, Github, Sparkles } from "lucide-react";
import heroImage from "@/assets/hero.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — StockPilot Demo" },
      {
        name: "description",
        content:
          "Portfolio note about StockPilot — a premium inventory management dashboard demo built with TanStack Start.",
      },
      { property: "og:title", content: "About — StockPilot Demo" },
      {
        property: "og:description",
        content: "Portfolio note about the StockPilot demo and the stack behind it.",
      },
    ],
  }),
  component: AboutPage,
});

const stack = [
  "TanStack Start",
  "TanStack Router",
  "Tailwind CSS v4",
  "shadcn/ui",
  "Recharts",
  "lucide-react",
  "TypeScript",
];

function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-4xl space-y-8">
      <div className="overflow-hidden rounded-2xl border border-border bg-gradient-surface shadow-elevated">
        <div className="relative h-48 sm:h-64">
          <img
            src={heroImage}
            alt="Premium dark warehouse aesthetic"
            className="h-full w-full object-cover opacity-50"
            loading="lazy"
            width={1536}
            height={768}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/60 to-transparent" />
          <div className="absolute bottom-5 left-5 flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-primary shadow-glow">
              <Boxes className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-primary">
                Portfolio Demo
              </p>
              <h1 className="text-xl font-semibold tracking-tight text-foreground">
                About StockPilot
              </h1>
            </div>
          </div>
        </div>

        <div className="space-y-5 p-6 sm:p-8">
          <p className="text-base leading-relaxed text-foreground">
            <span className="text-gradient-primary font-semibold">StockPilot</span> is a
            non-functional portfolio piece designed to showcase a premium SaaS dashboard
            aesthetic — refined dark theme, semantic design tokens, smooth typography, and
            attention to detail across every state.
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            All data is mocked locally and any stock adjustments persist to{" "}
            <code className="rounded bg-secondary px-1.5 py-0.5 font-mono text-xs">
              localStorage
            </code>
            . There is no backend, no authentication, and no real inventory behind the scenes.
            Use the "Reset demo data" button in the footer to restore the original mock dataset.
          </p>

          <div className="flex flex-wrap gap-2 pt-2">
            {stack.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-border bg-secondary/40 px-3 py-1 text-xs font-medium text-muted-foreground"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="grid gap-3 pt-4 sm:grid-cols-3">
            <Feature icon={Sparkles} title="Design system" body="oklch tokens, gradients, glow shadows." />
            <Feature icon={Code2} title="Type-safe routing" body="File-based routes with full inference." />
            <Feature icon={Github} title="Mock data" body="24+ SKUs, 6 suppliers, 30+ movements." />
          </div>

          <div className="flex flex-wrap gap-3 pt-4">
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-md bg-gradient-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-glow transition-transform hover:scale-[1.02]"
            >
              Open dashboard
            </Link>
            <Link
              to="/inventory"
              className="inline-flex items-center justify-center rounded-md border border-border bg-secondary/40 px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
            >
              Browse inventory
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function Feature({
  icon: Icon,
  title,
  body,
}: {
  icon: typeof Boxes;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-secondary/30 p-4">
      <Icon className="h-4 w-4 text-primary" />
      <p className="mt-2 text-sm font-medium text-foreground">{title}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">{body}</p>
    </div>
  );
}

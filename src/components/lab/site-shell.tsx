import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { Menu, ShieldCheck, X } from "lucide-react";

const nav = [
  { to: "/", label: "Overview" },
  { to: "/controls", label: "Control Catalog" },
  { to: "/key-lifecycle", label: "Key Lifecycle" },
  { to: "/playground", label: "Crypto Lab" },
  { to: "/governance", label: "Governance" },
] as const;

export function SiteShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
          <Link to="/" className="group flex items-center gap-3">
            <span className="grid size-9 place-items-center rounded-lg border border-primary/40 bg-primary/10 text-primary">
              <ShieldCheck className="size-5" />
            </span>
            <span className="leading-tight">
              <span className="block text-sm font-semibold tracking-tight">
                Applied Cryptography Security Lab
              </span>
              <span className="label-mono block">
                Rachel Love · Security &amp; Cloud Architecture
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.to === "/" }}
                className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                activeProps={{ className: "bg-secondary text-foreground" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <button
            type="button"
            aria-label={open ? "Close navigation" : "Open navigation"}
            onClick={() => setOpen((v) => !v)}
            className="grid size-9 place-items-center rounded-md border border-border bg-surface text-foreground lg:hidden"
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>

        {open ? (
          <nav className="border-t border-border/70 px-5 pb-4 lg:hidden">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="block rounded-md px-3 py-2.5 text-sm text-muted-foreground"
                activeProps={{ className: "bg-secondary text-foreground" }}
                activeOptions={{ exact: item.to === "/" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        ) : null}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border/70 bg-surface/60">
        <div className="mx-auto grid w-full max-w-7xl gap-6 px-5 py-10 text-sm text-muted-foreground lg:grid-cols-3 lg:px-8">
          <div>
            <p className="label-mono">Portfolio project</p>
            <p className="mt-2 text-foreground">Applied Cryptography Security Lab</p>
            <p className="mt-1">
              Designed and documented by Rachel Love as a defensive security and
              solution-architecture demonstration.
            </p>
          </div>
          <div>
            <p className="label-mono">Data notice</p>
            <p className="mt-2">
              Every metric, key alias, control, and finding shown here is synthetic and generated
              for demonstration. No production systems, real key material, or customer data are
              involved.
            </p>
          </div>
          <div>
            <p className="label-mono">Scope</p>
            <p className="mt-2">
              Defensive only: control design, key governance, algorithm selection, and evidence. The
              Crypto Lab runs standard browser WebCrypto primitives locally in your own tab.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

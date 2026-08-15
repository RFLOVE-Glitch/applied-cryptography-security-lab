import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { postureCopy, type Posture } from "@/lib/lab-data";

export function PageHeader({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  children?: ReactNode;
}) {
  return (
    <section className="border-b border-border/70">
      <div className="mx-auto w-full max-w-7xl px-5 py-12 lg:px-8 lg:py-16">
        <p className="label-mono">{eyebrow}</p>
        <h1 className="mt-3 max-w-3xl text-3xl font-semibold sm:text-4xl">{title}</h1>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted-foreground">{intro}</p>
        {children ? <div className="mt-8">{children}</div> : null}
      </div>
    </section>
  );
}

export function Section({
  title,
  kicker,
  description,
  children,
  className,
}: {
  title: string;
  kicker?: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("mx-auto w-full max-w-7xl px-5 py-12 lg:px-8 lg:py-16", className)}>
      {kicker ? <p className="label-mono">{kicker}</p> : null}
      <h2 className="mt-2 text-2xl font-semibold sm:text-3xl">{title}</h2>
      {description ? (
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">{description}</p>
      ) : null}
      <div className="mt-8">{children}</div>
    </section>
  );
}

export function Panel({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("panel p-6", className)}>{children}</div>;
}

export function PostureBadge({ posture }: { posture: Posture }) {
  const p = postureCopy[posture];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-[11px] tracking-wide",
        p.className,
      )}
    >
      {p.label}
    </span>
  );
}

export function Chip({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border border-border bg-secondary/60 px-2 py-0.5 font-mono text-[11px] text-muted-foreground",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function SyntheticNotice({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-lg border border-primary/25 bg-primary/5 px-4 py-3 font-mono text-xs leading-relaxed text-muted-foreground">
      {children}
    </p>
  );
}

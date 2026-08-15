import { createFileRoute } from "@tanstack/react-router";

import { Chip, PageHeader, Panel, Section, SyntheticNotice } from "@/components/lab/primitives";
import { keyInventory, lifecycleStages, type KeyRecord } from "@/lib/lab-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/key-lifecycle")({
  head: () => ({
    meta: [
      { title: "Key Lifecycle & Rotation — Applied Cryptography Security Lab" },
      {
        name: "description",
        content:
          "Seven-stage key lifecycle model, a synthetic key inventory with rotation SLAs and custodians, and the revocation drill that proves containment works.",
      },
      { property: "og:title", content: "Key Lifecycle & Rotation Governance" },
      {
        property: "og:description",
        content:
          "Plan, generate, distribute, use, rotate, revoke, destroy — with SLA tracking and a timed compromise drill.",
      },
    ],
  }),
  component: KeyLifecycle,
});

const statusStyle: Record<KeyRecord["status"], { label: string; className: string }> = {
  "in-sla": { label: "In SLA", className: "border-success/40 bg-success/10 text-success" },
  "due-soon": { label: "Due soon", className: "border-warning/40 bg-warning/10 text-warning" },
  overdue: {
    label: "Overdue",
    className: "border-destructive/40 bg-destructive/10 text-destructive",
  },
};

function KeyLifecycle() {
  const overdue = keyInventory.filter((k) => k.status === "overdue").length;
  const inSla = keyInventory.filter((k) => k.status === "in-sla").length;

  return (
    <>
      <PageHeader
        eyebrow="Key management"
        title="A key is a liability with an expiry date, not a configuration value."
        intro="The hardest part of enterprise cryptography is not encrypting data — it is knowing every key that exists, who is accountable for it, when it must change, and being able to prove you can revoke it under pressure. This page models that inventory and the lifecycle discipline around it."
      >
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { label: "Keys tracked", value: String(keyInventory.length) },
            { label: "Within rotation SLA", value: `${inSla}/${keyInventory.length}` },
            { label: "Overdue → risk register", value: String(overdue) },
          ].map((s) => (
            <Panel key={s.label} className="p-5">
              <p className="label-mono">{s.label}</p>
              <p className="mt-2 font-mono text-2xl font-semibold">{s.value}</p>
            </Panel>
          ))}
        </div>
      </PageHeader>

      <Section
        kicker="Lifecycle model"
        title="Seven stages, each with an owner and an exit condition"
        description="Stages map back to catalog controls so the model is not decorative — a failure at any stage produces a named finding."
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {lifecycleStages.map((s, i) => (
            <Panel key={s.stage} className="flex flex-col gap-3 p-5">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-primary">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-base font-semibold">{s.stage}</h3>
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">{s.detail}</p>
              <div className="mt-auto flex flex-wrap gap-2">
                {s.controlIds.map((id) => (
                  <Chip key={id}>{id}</Chip>
                ))}
              </div>
            </Panel>
          ))}
        </div>
      </Section>

      <Section
        kicker="Inventory"
        title="Synthetic key register with rotation posture"
        description="Age is measured against the SLA for the key's purpose: 90 days for signing keys, 180 for shared partner secrets, 365 for data-wrapping keys."
        className="border-t border-border/70"
      >
        <Panel className="overflow-x-auto p-0">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="border-b border-border bg-background/40">
              <tr className="label-mono">
                <th className="px-5 py-3 font-normal">Alias</th>
                <th className="px-5 py-3 font-normal">Purpose</th>
                <th className="px-5 py-3 font-normal">Algorithm</th>
                <th className="px-5 py-3 font-normal">Custodian</th>
                <th className="px-5 py-3 font-normal">Age / SLA</th>
                <th className="px-5 py-3 font-normal">Status</th>
              </tr>
            </thead>
            <tbody>
              {keyInventory.map((k) => {
                const pct = Math.min(100, Math.round((k.ageDays / k.slaDays) * 100));
                const s = statusStyle[k.status];
                return (
                  <tr key={k.alias} className="border-b border-border/60 last:border-0">
                    <td className="px-5 py-4 font-mono text-xs text-foreground">{k.alias}</td>
                    <td className="px-5 py-4 text-xs text-muted-foreground">
                      {k.purpose}
                      <span className="mt-1 block font-mono text-[11px] text-muted-foreground/70">
                        {k.scope}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-mono text-xs text-muted-foreground">
                      {k.algorithm}
                    </td>
                    <td className="px-5 py-4 text-xs text-muted-foreground">{k.custodian}</td>
                    <td className="px-5 py-4">
                      <span className="font-mono text-xs text-foreground">
                        {k.ageDays}d / {k.slaDays}d
                      </span>
                      <span className="mt-1.5 block h-1.5 w-28 overflow-hidden rounded-full bg-secondary">
                        <span
                          className={cn(
                            "block h-full rounded-full",
                            k.status === "overdue"
                              ? "bg-destructive"
                              : k.status === "due-soon"
                                ? "bg-warning"
                                : "bg-success",
                          )}
                          style={{ width: `${pct}%` }}
                        />
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={cn(
                          "inline-flex rounded-full border px-2.5 py-0.5 font-mono text-[11px]",
                          s.className,
                        )}
                      >
                        {s.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Panel>
        <div className="mt-6 max-w-3xl">
          <SyntheticNotice>
            Aliases, ages and custodians are invented for this demonstration. No key material, KMS
            account, or partner relationship shown here exists.
          </SyntheticNotice>
        </div>
      </Section>

      <Section
        kicker="Assurance"
        title="Rotation without downtime, revocation under pressure"
        className="border-t border-border/70"
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <Panel>
            <h3 className="text-base font-semibold">Zero-downtime rotation pattern</h3>
            <pre className="mt-4 overflow-x-auto rounded-lg border border-border/70 bg-background/50 p-4 font-mono text-xs leading-6 text-muted-foreground">{`t0  encrypt → key v1        decrypt → v1
t1  create v2 (KMS, non-exportable)
t2  encrypt → key v2        decrypt → v1, v2
t3  background re-wrap of stored DEKs under v2
t4  encrypt → key v2        decrypt → v2
t5  disable v1, retain for audit window, then schedule deletion`}</pre>
            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
              The dual-decrypt window is what makes rotation boring. Skipping it is how teams end up
              afraid to rotate at all — which is the real failure mode.
            </p>
          </Panel>
          <Panel>
            <h3 className="text-base font-semibold">Compromise drill (semi-annual, synthetic)</h3>
            <ol className="mt-4 space-y-3 text-sm text-muted-foreground">
              {[
                ["T+0 min", "Suspected exposure reported; key marked untrusted, alias frozen."],
                ["T+2 min", "Grants revoked; workloads fail closed on that key and alert."],
                ["T+4 min", "New CMK generated in HSM; alias repointed for encrypt operations."],
                ["T+11 min", "4,200 synthetic DEKs re-wrapped; decrypt-only on old key disabled."],
                [
                  "T+1 day",
                  "Incident record filed with timings; runbook gaps become backlog items.",
                ],
              ].map(([t, body]) => (
                <li key={t} className="flex gap-3">
                  <span className="w-20 shrink-0 font-mono text-xs text-primary">{t}</span>
                  <span className="text-xs leading-relaxed">{body}</span>
                </li>
              ))}
            </ol>
            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
              The drill exists to produce a measured number. &ldquo;We can revoke a key&rdquo; is a
              claim; &ldquo;11 minutes, evidenced twice a year&rdquo; is a control.
            </p>
          </Panel>
        </div>
      </Section>
    </>
  );
}

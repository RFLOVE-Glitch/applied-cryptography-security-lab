import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Boxes, FileCheck2, KeyRound, Radar } from "lucide-react";

import {
  PageHeader,
  Panel,
  PostureBadge,
  Section,
  SyntheticNotice,
  Chip,
} from "@/components/lab/primitives";
import { architecturePillars, programMetrics, controls, riskRegister } from "@/lib/lab-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Executive Overview — Applied Cryptography Security Lab" },
      {
        name: "description",
        content:
          "Executive view of a synthetic enterprise cryptography program: control coverage, key rotation posture, TLS baseline and post-quantum readiness.",
      },
      { property: "og:title", content: "Applied Cryptography Security Lab — Executive Overview" },
      {
        property: "og:description",
        content:
          "How cryptography is selected, implemented, governed, rotated and evidenced in an enterprise security program.",
      },
    ],
  }),
  component: Overview,
});

const quickLinks = [
  {
    to: "/controls" as const,
    icon: Boxes,
    title: "Control Catalog",
    body: "Nine cryptographic controls with objective, implementation, owner, framework mapping and evidence artifact.",
  },
  {
    to: "/key-lifecycle" as const,
    icon: KeyRound,
    title: "Key Lifecycle",
    body: "Synthetic key inventory, rotation SLAs, custodians and the seven-stage lifecycle model with revocation drills.",
  },
  {
    to: "/playground" as const,
    icon: Radar,
    title: "Crypto Lab",
    body: "Run hashing, HMAC integrity checks and AES-GCM envelope encryption locally in your browser via WebCrypto.",
  },
  {
    to: "/governance" as const,
    icon: FileCheck2,
    title: "Governance",
    body: "Decision records, review cadence, algorithm catalog and the risk register that drives remediation waves.",
  },
];

function Overview() {
  return (
    <>
      <PageHeader
        eyebrow="Executive overview · synthetic program"
        title="Cryptography that is selected on purpose, governed continuously, and provable on demand."
        intro="This lab models the cryptographic posture of a mid-size regulated SaaS platform. It shows the whole control loop — how an algorithm is chosen for a data classification, how key material is confined to a validated boundary, how rotation and revocation are exercised, and how each control produces evidence an auditor can read."
      >
        <div className="flex flex-wrap gap-3">
          <Link
            to="/controls"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Explore the control catalog <ArrowRight className="size-4" />
          </Link>
          <Link
            to="/playground"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm font-medium transition-colors hover:bg-secondary"
          >
            Open the Crypto Lab
          </Link>
        </div>
        <div className="mt-6 max-w-3xl">
          <SyntheticNotice>
            Educational portfolio demonstration — not production key-management infrastructure. All figures
            are synthetic and locally generated. This app has no backend, no KMS and no connection to any
            real environment, and it makes no compliance or security guarantee about any real system.

          </SyntheticNotice>
        </div>
      </PageHeader>

      <Section
        kicker="Program scorecard"
        title="Where the posture stands this quarter"
        description="Four indicators the security leadership team reviews. Two are healthy, two carry named remediation owners and dates in the risk register."
      >
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {programMetrics.map((m) => (
            <Panel key={m.label} className="flex flex-col gap-3">
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm text-muted-foreground">{m.label}</p>
                <PostureBadge posture={m.posture} />
              </div>
              <p className="font-mono text-3xl font-semibold text-foreground">{m.value}</p>
              <p className="font-mono text-xs text-primary">{m.delta}</p>
              <p className="text-xs leading-relaxed text-muted-foreground">{m.note}</p>
            </Panel>
          ))}
        </div>
      </Section>

      <Section
        kicker="Architecture thesis"
        title="Four pillars turn primitives into a program"
        description="Cryptography fails in enterprises for organisational reasons far more often than mathematical ones. Each pillar names the artifacts that make the control real."
        className="border-t border-border/70"
      >
        <div className="grid gap-4 md:grid-cols-2">
          {architecturePillars.map((p, i) => (
            <Panel key={p.title} className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <span className="grid size-8 place-items-center rounded-md border border-primary/40 bg-primary/10 font-mono text-xs text-primary">
                  0{i + 1}
                </span>
                <h3 className="text-lg font-semibold">{p.title}</h3>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">{p.summary}</p>
              <div className="flex flex-wrap gap-2">
                {p.artifacts.map((a) => (
                  <Chip key={a}>{a}</Chip>
                ))}
              </div>
            </Panel>
          ))}
        </div>
      </Section>

      <Section
        kicker="Reference architecture"
        title="Request path with cryptographic boundaries"
        description="Where each control sits on a single write of a confidential record."
        className="border-t border-border/70"
      >
        <Panel className="grid-lines overflow-x-auto">
          <pre className="min-w-[640px] font-mono text-xs leading-6 text-muted-foreground">{`  client ──TLS 1.3 (X25519 + AES-256-GCM)──▶ edge / WAF
                                              │  CR-03
                                              ▼
                                       API service  ──mTLS──▶ internal services
                                              │  CR-08 HMAC on partner callbacks
                                              ▼
                                     crypto SDK (shared)
                                       │            │
                     CR-01 AES-256-GCM │            │ CR-05 grant check
                        + AAD(tenant,id)▼            ▼
                                  data store    KMS / HSM (FIPS 140-3 L3)
                                       │            │ non-exportable CMK
                                       │            └── CR-04 rotation + revoke
                                       ▼
                             backups / archives (CR-01, 10y retention → CR-09)`}</pre>
        </Panel>
      </Section>

      <Section
        kicker="Coverage snapshot"
        title="Control domains and open remediation"
        className="border-t border-border/70"
      >
        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <Panel>
            <h3 className="text-sm font-semibold">Controls by domain</h3>
            <ul className="mt-4 space-y-3">
              {Object.entries(
                controls.reduce<Record<string, number>>((acc, c) => {
                  acc[c.domain] = (acc[c.domain] ?? 0) + 1;
                  return acc;
                }, {}),
              ).map(([domain, count]) => (
                <li key={domain} className="flex items-center gap-3">
                  <span className="w-40 shrink-0 text-xs text-muted-foreground">{domain}</span>
                  <span className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
                    <span
                      className="block h-full rounded-full bg-primary"
                      style={{ width: `${(count / controls.length) * 100}%` }}
                    />
                  </span>
                  <span className="font-mono text-xs text-foreground">{count}</span>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
              Coverage is deliberately uneven: key management and application integrity carry the
              most controls because they are where mistakes are cheapest to make and most expensive
              to detect.
            </p>
          </Panel>
          <Panel>
            <h3 className="text-sm font-semibold">Top open risks</h3>
            <ul className="mt-4 space-y-4">
              {riskRegister.slice(0, 3).map((r) => (
                <li key={r.id} className="border-l-2 border-primary/50 pl-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs text-primary">{r.id}</span>
                    <Chip>{r.severity}</Chip>
                    <Chip>{r.controlId}</Chip>
                  </div>
                  <p className="mt-1.5 text-sm text-foreground">{r.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {r.owner} · {r.due}
                  </p>
                </li>
              ))}
            </ul>
            <Link
              to="/governance"
              className="mt-5 inline-flex items-center gap-2 text-sm text-primary hover:underline"
            >
              Full risk register <ArrowRight className="size-4" />
            </Link>
          </Panel>
        </div>
      </Section>

      <Section kicker="Walkthrough" title="Where to go next" className="border-t border-border/70">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {quickLinks.map((q) => (
            <Link
              key={q.to}
              to={q.to}
              className="panel group flex flex-col gap-3 p-6 transition-colors hover:bg-surface-raised"
            >
              <q.icon className="size-5 text-primary" />
              <h3 className="text-base font-semibold">{q.title}</h3>
              <p className="text-xs leading-relaxed text-muted-foreground">{q.body}</p>
              <span className="mt-auto inline-flex items-center gap-1.5 font-mono text-xs text-primary">
                Open{" "}
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
}

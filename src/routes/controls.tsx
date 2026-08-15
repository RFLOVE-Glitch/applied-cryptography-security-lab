import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import {
  Chip,
  PageHeader,
  Panel,
  PostureBadge,
  Section,
  SyntheticNotice,
} from "@/components/lab/primitives";

import { controls } from "@/lib/lab-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/controls")({
  head: () => ({
    meta: [
      { title: "Cryptographic Control Catalog — Applied Cryptography Security Lab" },
      {
        name: "description",
        content:
          "Nine cryptographic controls with objective, implementation detail, approved algorithms, owners, framework mapping and evidence artifacts.",
      },
      { property: "og:title", content: "Cryptographic Control Catalog" },
      {
        property: "og:description",
        content:
          "Objective, implementation, owner, framework mapping and evidence for each cryptographic control in the program.",
      },
    ],
  }),
  component: Controls,
});

const domains = [
  "All",
  "Data at rest",
  "Data in transit",
  "Key management",
  "Identity & integrity",
  "Application",
] as const;

function Controls() {
  const [domain, setDomain] = useState<(typeof domains)[number]>("All");

  const filtered = useMemo(
    () => (domain === "All" ? controls : controls.filter((c) => c.domain === domain)),
    [domain],
  );

  return (
    <>
      <PageHeader
        eyebrow="Control catalog"
        title="Each control names its objective, its implementation, its owner, and the artifact that proves it works."
        intro="A control that exists only as a policy sentence cannot be audited or improved. Every entry here binds a cryptographic decision to an accountable team, a framework clause, and a concrete piece of evidence produced on a stated cadence."
      >
        <div className="flex flex-wrap gap-2">
          {domains.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDomain(d)}
              className={cn(
                "rounded-full border px-3.5 py-1.5 font-mono text-xs transition-colors",
                domain === d
                  ? "border-primary/50 bg-primary/15 text-primary"
                  : "border-border bg-surface text-muted-foreground hover:text-foreground",
              )}
            >
              {d}
            </button>
          ))}
        </div>
        <div className="mt-6 max-w-3xl">
          <SyntheticNotice>
            Educational portfolio demonstration. These controls, owners, postures and evidence
            artifacts are invented for illustration, and the framework references are illustrative
            mappings — not an assessment, certification or statement of compliance for any
            organisation.
          </SyntheticNotice>
        </div>
      </PageHeader>

      <Section
        kicker={`${filtered.length} control${filtered.length === 1 ? "" : "s"} shown`}
        title="Control register"
        description="Posture reflects the synthetic assurance evidence: effective, monitored with a known deviation, or an accepted gap on the roadmap."
      >
        <div className="grid gap-4">
          {filtered.map((c) => (
            <Panel key={c.id} className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-mono text-xs text-primary">{c.id}</span>
                  <Chip>{c.domain}</Chip>
                  <PostureBadge posture={c.posture} />
                </div>
                <h3 className="mt-3 text-lg font-semibold">{c.name}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  <span className="text-foreground">Objective. </span>
                  {c.objective}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  <span className="text-foreground">Implementation. </span>
                  {c.implementation}
                </p>
              </div>
              <dl className="space-y-4 rounded-lg border border-border/70 bg-background/40 p-5 text-sm">
                <div>
                  <dt className="label-mono">Algorithm / mechanism</dt>
                  <dd className="mt-1 font-mono text-xs text-foreground">{c.algorithm}</dd>
                </div>
                <div>
                  <dt className="label-mono">Accountable owner</dt>
                  <dd className="mt-1 text-foreground">{c.owner}</dd>
                </div>
                <div>
                  <dt className="label-mono">Framework mapping</dt>
                  <dd className="mt-1.5 flex flex-wrap gap-2">
                    {c.frameworks.map((f) => (
                      <Chip key={f}>{f}</Chip>
                    ))}
                  </dd>
                </div>
                <div>
                  <dt className="label-mono">Evidence artifact</dt>
                  <dd className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {c.evidence}
                  </dd>
                </div>
              </dl>
            </Panel>
          ))}
        </div>
      </Section>

      <Section
        kicker="How this catalog is used"
        title="The design review gate"
        description="Any new data store, external integration, or authentication path passes through a short review that resolves to catalog entries rather than opinions."
        className="border-t border-border/70"
      >
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              step: "1 · Classify",
              body: "What is the data, who is the adversary, and how long must the confidentiality hold? A 10-year retention answer changes the algorithm choice immediately.",
            },
            {
              step: "2 · Map",
              body: "Select the controls that already exist for that classification. If none fit, the outcome is an ADR and a catalog change — not a bespoke implementation.",
            },
            {
              step: "3 · Evidence",
              body: "Agree the artifact that will prove the control works, and who regenerates it each quarter. No artifact, no approval.",
            },
          ].map((s) => (
            <Panel key={s.step}>
              <p className="font-mono text-xs text-primary">{s.step}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </Panel>
          ))}
        </div>
      </Section>
    </>
  );
}

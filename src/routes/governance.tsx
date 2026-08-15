import { createFileRoute } from "@tanstack/react-router";

import { Chip, PageHeader, Panel, Section } from "@/components/lab/primitives";
import { algorithmCatalog, decisionRecords, reviewCadence, riskRegister } from "@/lib/lab-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/governance")({
  head: () => ({
    meta: [
      { title: "Governance, Decisions & Risk — Applied Cryptography Security Lab" },
      {
        name: "description",
        content:
          "Approved algorithm catalog, architecture decision records, review cadence and the risk register that sequences cryptographic remediation waves.",
      },
      { property: "og:title", content: "Cryptography Governance & Decision Records" },
      {
        property: "og:description",
        content:
          "Approved vs deprecated algorithms, ADRs with consequences, review cadence, and a prioritised risk register.",
      },
    ],
  }),
  component: Governance,
});

const severityClass: Record<string, string> = {
  High: "border-destructive/40 bg-destructive/10 text-destructive",
  Medium: "border-warning/40 bg-warning/10 text-warning",
  Low: "border-success/40 bg-success/10 text-success",
};

function Governance() {
  return (
    <>
      <PageHeader
        eyebrow="Governance"
        title="Decisions with recorded consequences, reviewed on a cadence, sequenced by risk."
        intro="Governance is where a cryptography program either compounds or decays. This page shows the four artifacts that keep it compounding: an approved algorithm catalog with an explicit deprecation list, decision records that admit their trade-offs, a review calendar, and a risk register that turns findings into dated waves of work."
      />

      <Section
        kicker="Approved catalog"
        title="What is allowed, what is being removed, and why"
        description="Developers should not have to make cryptographic judgement calls under delivery pressure. The catalog answers the question before it is asked."
      >
        <Panel className="overflow-x-auto p-0">
          <table className="w-full min-w-[880px] text-left text-sm">
            <thead className="border-b border-border bg-background/40">
              <tr className="label-mono">
                <th className="px-5 py-3 font-normal">Use case</th>
                <th className="px-5 py-3 font-normal">Approved</th>
                <th className="px-5 py-3 font-normal">Deprecated / prohibited</th>
                <th className="px-5 py-3 font-normal">Rationale</th>
              </tr>
            </thead>
            <tbody>
              {algorithmCatalog.map((a) => (
                <tr key={a.use} className="border-b border-border/60 last:border-0 align-top">
                  <td className="px-5 py-4 text-xs text-foreground">{a.use}</td>
                  <td className="px-5 py-4 font-mono text-xs text-success">{a.approved}</td>
                  <td className="px-5 py-4 font-mono text-xs text-destructive">{a.deprecated}</td>
                  <td className="px-5 py-4 text-xs leading-relaxed text-muted-foreground">{a.why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      </Section>

      <Section
        kicker="Decision records"
        title="Architecture decisions and their honest consequences"
        description="An ADR that lists only benefits is marketing. Each record here names the new burden the decision creates and who absorbs it."
        className="border-t border-border/70"
      >
        <div className="grid gap-4 md:grid-cols-2">
          {decisionRecords.map((d) => (
            <Panel key={d.id} className="flex flex-col gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs text-primary">{d.id}</span>
                <Chip
                  className={
                    d.status === "Accepted"
                      ? "border-success/40 bg-success/10 text-success"
                      : "border-warning/40 bg-warning/10 text-warning"
                  }
                >
                  {d.status}
                </Chip>
              </div>
              <h3 className="text-base font-semibold">{d.title}</h3>
              <p className="text-xs leading-relaxed text-muted-foreground">
                <span className="text-foreground">Context. </span>
                {d.context}
              </p>
              <p className="text-xs leading-relaxed text-muted-foreground">
                <span className="text-foreground">Decision. </span>
                {d.decision}
              </p>
              <p className="text-xs leading-relaxed text-muted-foreground">
                <span className="text-foreground">Consequence. </span>
                {d.consequence}
              </p>
            </Panel>
          ))}
        </div>
      </Section>

      <Section
        kicker="Operating rhythm"
        title="Review cadence"
        description="Every cadence produces a named output. If an activity has no output, it is a meeting, not a control."
        className="border-t border-border/70"
      >
        <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
          <Panel className="p-0">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-background/40">
                <tr className="label-mono">
                  <th className="px-5 py-3 font-normal">Cadence</th>
                  <th className="px-5 py-3 font-normal">Activity</th>
                  <th className="px-5 py-3 font-normal">Output</th>
                </tr>
              </thead>
              <tbody>
                {reviewCadence.map((r) => (
                  <tr key={r.activity} className="border-b border-border/60 last:border-0 align-top">
                    <td className="px-5 py-4 font-mono text-xs text-primary">{r.cadence}</td>
                    <td className="px-5 py-4 text-xs text-foreground">
                      {r.activity}
                      <span className="mt-1 block text-[11px] text-muted-foreground">{r.owner}</span>
                    </td>
                    <td className="px-5 py-4 text-xs text-muted-foreground">{r.output}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Panel>
          <Panel>
            <h3 className="text-base font-semibold">Evidence pack contents</h3>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              What an auditor or enterprise customer actually receives each quarter, assembled from artifacts
              the controls already generate rather than written from scratch.
            </p>
            <ul className="mt-4 space-y-2.5 text-xs text-muted-foreground">
              {[
                "Control register extract with owner sign-off dates",
                "Key inventory with age, SLA and custodian per key",
                "Rotation and revocation drill report with timings",
                "TLS posture scan summary and documented exceptions",
                "Cryptographic bill of materials and PQC migration waves",
                "Open risk items with treatment, owner and due wave",
              ].map((item) => (
                <li key={item} className="flex gap-2.5">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </Section>

      <Section
        kicker="Risk register"
        title="Findings sequenced into remediation waves"
        description="Prioritisation is by data lifetime and blast radius, not by how easy the fix is. Long-lived confidential data outranks convenience every time."
        className="border-t border-border/70"
      >
        <div className="grid gap-4 md:grid-cols-2">
          {riskRegister.map((r) => (
            <Panel key={r.id} className="flex flex-col gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs text-primary">{r.id}</span>
                <span
                  className={cn(
                    "inline-flex rounded-full border px-2.5 py-0.5 font-mono text-[11px]",
                    severityClass[r.severity],
                  )}
                >
                  {r.severity}
                </span>
                <Chip>{r.controlId}</Chip>
              </div>
              <h3 className="text-base font-semibold">{r.title}</h3>
              <p className="text-xs leading-relaxed text-muted-foreground">
                <span className="text-foreground">Treatment. </span>
                {r.treatment}
              </p>
              <p className="mt-auto font-mono text-[11px] text-muted-foreground">
                {r.owner} · {r.due}
              </p>
            </Panel>
          ))}
        </div>
      </Section>
    </>
  );
}

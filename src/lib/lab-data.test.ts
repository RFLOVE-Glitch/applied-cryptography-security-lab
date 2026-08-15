import { describe, expect, it } from "vitest";

import {
  algorithmCatalog,
  controls,
  keyInventory,
  lifecycleStages,
  postureCopy,
  riskRegister,
} from "./lab-data";

const controlIds = new Set(controls.map((c) => c.id));

describe("control catalog integrity", () => {
  it("has unique control ids", () => {
    expect(controlIds.size).toBe(controls.length);
  });

  it("gives every control an owner, evidence artifact and at least one framework mapping", () => {
    for (const c of controls) {
      expect(c.owner.length).toBeGreaterThan(0);
      expect(c.evidence.length).toBeGreaterThan(0);
      expect(c.frameworks.length).toBeGreaterThan(0);
    }
  });

  it("uses only known posture values", () => {
    for (const c of controls) {
      expect(Object.keys(postureCopy)).toContain(c.posture);
    }
  });
});

describe("key inventory consistency", () => {
  it("derives status correctly from age against its rotation SLA", () => {
    for (const k of keyInventory) {
      const ratio = k.ageDays / k.slaDays;
      const expected = ratio >= 1 ? "overdue" : ratio >= 0.85 ? "due-soon" : "in-sla";
      expect({ alias: k.alias, status: k.status }).toEqual({ alias: k.alias, status: expected });
    }
  });

  it("has unique aliases and a named custodian for every key", () => {
    expect(new Set(keyInventory.map((k) => k.alias)).size).toBe(keyInventory.length);
    for (const k of keyInventory) expect(k.custodian.length).toBeGreaterThan(0);
  });
});

describe("cross-references", () => {
  it("only references controls that exist from lifecycle stages", () => {
    for (const s of lifecycleStages) {
      for (const id of s.controlIds) expect(controlIds).toContain(id);
    }
  });

  it("only references controls that exist from the risk register", () => {
    for (const r of riskRegister) expect(controlIds).toContain(r.controlId);
  });
});

describe("algorithm catalog safety", () => {
  const weak = ["md5", "sha-1", "rc4", "3des", "ecb"];

  it("never lists a weak primitive as approved", () => {
    for (const entry of algorithmCatalog) {
      const approved = entry.approved.toLowerCase();
      for (const w of weak) expect(approved).not.toContain(w);
    }
  });

  it("documents a deprecation list and rationale for every use case", () => {
    for (const entry of algorithmCatalog) {
      expect(entry.deprecated.length).toBeGreaterThan(0);
      expect(entry.why.length).toBeGreaterThan(0);
    }
  });
});

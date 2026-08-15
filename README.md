# Applied Cryptography Security Lab

A portfolio project by **Rachel Love** — a defensive security and solution-architecture
demonstration of how cryptography is _selected, implemented, governed, rotated, reviewed and
evidenced_ in an enterprise security program.

> **This is an educational portfolio demonstration, not production key-management
> infrastructure.** Every metric, control, key alias, custodian, framework mapping, risk item
> and decision record in this app is **synthetic sample data** written for illustration. The
> app connects to no backend, no cloud KMS/HSM, no external API and no real environment. It
> holds no secrets, credentials, customer data or production configuration, and it makes no
> compliance or security guarantee about any real system.

## Why this project exists

Enterprise cryptography rarely fails because of mathematics. It fails because nobody owns a
key, nobody knows the key inventory, rotation has never been rehearsed, an algorithm choice
was made under delivery pressure, or the control produces no evidence anyone can audit. This
lab models that whole loop — the organisational surface around the primitives — and pairs it
with three small, honest, browser-local demonstrations of the primitives themselves.

## Architecture

Static, client-rendered/SSR site with no backend, no database and no authentication.

- **TanStack Start v1** (React 19, file-based routing under `src/routes/`, per-route `head()`
  metadata) on **Vite 7**
- **Tailwind CSS v4** with a semantic design-token system defined in `src/styles.css`
  (dark "secure operations console" theme; no hardcoded colour utilities in components)
- **Web Crypto API** (`crypto.subtle`) for the interactive demonstrations — browser-native,
  in-tab, no library and no network call
- **Vitest** for data-integrity tests over the synthetic model

```
src/
  routes/
    __root.tsx          shared shell, fonts, base metadata
    index.tsx           Executive Overview — scorecard, pillars, boundary diagram, top risks
    controls.tsx        Cryptographic control catalog (filterable by domain)
    key-lifecycle.tsx   Lifecycle model, synthetic key register, rotation & revocation drill
    playground.tsx      Crypto Lab — local Web Crypto demonstrations
    governance.tsx      Algorithm catalog, decision records, review cadence, risk register
  components/lab/       Site shell and presentation primitives
  lib/lab-data.ts       All synthetic sample data (single source of truth)
  lib/lab-data.test.ts  Integrity tests over that data
```

## What is actually implemented vs. what is described

| Area                                                         | Implemented in this repository                    | Described only (reference design)                                        |
| ------------------------------------------------------------ | ------------------------------------------------- | ------------------------------------------------------------------------ |
| Hashing (SHA-256/384/512)                                    | Yes — live, in-browser via Web Crypto             | —                                                                        |
| HMAC-SHA-256 sign & verify, tamper rejection                 | Yes — live, in-browser                            | Constant-time comparison, timestamped replay window, secret-store lookup |
| AES-256-GCM encryption with AAD binding, fail-closed decrypt | Yes — live, in-browser, ephemeral per-session key | DEK wrapping by a non-exportable KMS/HSM key, DEK cache with TTL         |
| Key inventory, rotation SLAs, custodians                     | Presented as a static synthetic table             | Real KMS inventory, drift detection, automated rotation                  |
| Control catalog, framework mapping, evidence artifacts       | Written content over synthetic data               | Signed attestation packs, auditor evidence, real scanner output          |
| Compromise/revocation drill timings                          | Illustrative narrative                            | Executed drills against real infrastructure                              |
| Post-quantum readiness (CBOM, hybrid KEM waves)              | Roadmap narrative                                 | Any deployed PQC pilot                                                   |
| Backend, database, auth, secrets, telemetry                  | **None**                                          | —                                                                        |

The Crypto Lab exports a demo AES key to the screen purely so the mechanism is visible while
learning. That is the opposite of the pattern the app itself recommends (ADR-023: key material
stays non-exportable inside the KMS boundary), and the page says so in place.

## Primitives demonstrated

| Demo                | Primitive                                      | Point being made                                                                                                                |
| ------------------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Digest              | SHA-256 / SHA-384 / SHA-512                    | Avalanche property; a hash can safely _name_ an artifact but never provides confidentiality                                     |
| Webhook integrity   | HMAC-SHA-256                                   | Shared-secret authenticity + integrity; edit the received body and the check must reject it                                     |
| Envelope encryption | AES-256-GCM with additional authenticated data | Per-record data key, 96-bit nonce discipline, and context binding that makes a record-swap attempt a hard cryptographic failure |

All inputs are synthetic placeholders. Keys are generated locally per session and are never
transmitted, persisted or logged. Do not paste real secrets or personal data into the fields.

## Key lifecycle and governance concepts modelled

- **Seven-stage key lifecycle**: plan → generate → distribute → use → rotate → revoke →
  destroy, each stage cross-referenced to catalog control IDs
- **Rotation SLAs by purpose** (90 days signing, 180 days shared partner secrets, 365 days
  data-wrapping) with overdue keys escalating into the risk register
- **Zero-downtime rotation** via dual-version aliases (encrypt-with-new / decrypt-with-both)
- **Separation of duties** on key administration and a two-person break-glass path
- **Approved vs. deprecated algorithm catalog** so developers do not make cryptographic
  judgement calls under delivery pressure
- **Architecture decision records** that state the burden each decision creates, not just its
  benefit
- **Review cadence** where every cadence produces a named output artifact
- **Risk register** sequenced by data lifetime and blast radius, including harvest-now
  decrypt-later exposure on long-retention data

## Responsible limitations

- Defensive scope only: control design, governance and standard verified primitives. No
  offensive tooling, no cryptanalysis, no key extraction techniques.
- Framework references (ISO 27001, NIST SP 800-57/800-63B, PCI DSS, SOC 2, OWASP ASVS, SLSA,
  CNSA 2.0) are **illustrative mappings on invented controls**. They are not an assessment,
  certification, attestation or statement of compliance for any organisation.
- The Web Crypto demos are teaching aids. They omit production requirements that are stated
  but not implemented — constant-time comparison, replay windows, nonce-reuse guards enforced
  by a shared SDK, key wrapping, audit logging and access control.
- Numbers such as "94% coverage" or an "11-minute revocation" are invented illustrative
  figures, not measurements.
- Nothing here should be copied into a production system as-is. Treat it as a model of how to
  reason about cryptographic controls and their governance.

## Local development

Requires Node.js 20+ (or Bun).

```sh
npm install
npm run dev          # dev server on http://localhost:8080
npm run build        # production build
npm run lint         # eslint + prettier
npx tsc --noEmit     # typecheck
npx vitest run       # data-integrity test suite
```

## Built with

TanStack Start · React 19 · TypeScript · Tailwind CSS v4 · Web Crypto API · Vitest

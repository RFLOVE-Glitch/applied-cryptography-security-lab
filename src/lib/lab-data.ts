/**
 * All data in this module is SYNTHETIC. No production systems, real keys,
 * customer records, or live telemetry are represented anywhere in this app.
 */

export type Posture = "healthy" | "watch" | "gap";

export const programMetrics = [
  {
    label: "Data stores with approved encryption",
    value: "94%",
    delta: "+11 pts vs. Q1 baseline",
    posture: "healthy" as Posture,
    note: "47 of 50 synthetic stores mapped to an approved cipher suite.",
  },
  {
    label: "Keys inside rotation SLA",
    value: "88%",
    delta: "6 keys past due",
    posture: "watch" as Posture,
    note: "Rotation SLA is 365 days for data keys, 90 days for signing keys.",
  },
  {
    label: "TLS endpoints at 1.3-only",
    value: "72%",
    delta: "18 legacy endpoints remain",
    posture: "watch" as Posture,
    note: "Legacy partner gateways still negotiate TLS 1.2 with AES-GCM only.",
  },
  {
    label: "Quantum-vulnerable asymmetric use",
    value: "31 assets",
    delta: "PQC migration wave 1 scoped",
    posture: "gap" as Posture,
    note: "RSA-2048 signing paths queued for ML-DSA hybrid pilot.",
  },
];

export const architecturePillars = [
  {
    title: "Selection",
    summary:
      "Cipher suites are chosen from an approved catalog tied to data classification, latency budget, and regulator expectations — never by developer preference.",
    artifacts: [
      "Approved algorithm catalog",
      "Data classification matrix",
      "Exception request form",
    ],
  },
  {
    title: "Implementation",
    summary:
      "Platform teams consume vetted crypto through a shared library and KMS façade, so app teams never touch raw key material or hand-roll primitives.",
    artifacts: ["Crypto SDK contract", "Envelope encryption pattern", "IaC guardrails"],
  },
  {
    title: "Governance",
    summary:
      "Every control has an owner, a policy clause, an evidence artifact, and a review cadence recorded in the control register.",
    artifacts: ["Control register", "Policy mapping", "Quarterly attestation"],
  },
  {
    title: "Assurance",
    summary:
      "Rotation, key inventory drift, and TLS posture are continuously monitored; findings route to a risk register with remediation owners and dates.",
    artifacts: ["Drift detection query", "Rotation dashboard", "Risk register entry"],
  },
];

export type Control = {
  id: string;
  name: string;
  domain:
    "Data at rest" | "Data in transit" | "Key management" | "Identity & integrity" | "Application";
  objective: string;
  implementation: string;
  algorithm: string;
  owner: string;
  frameworks: string[];
  posture: Posture;
  evidence: string;
};

export const controls: Control[] = [
  {
    id: "CR-01",
    name: "Envelope encryption for tenant data",
    domain: "Data at rest",
    objective:
      "Confidential tenant records remain unreadable if storage media or a database snapshot is exposed.",
    implementation:
      "Per-tenant data encryption key wrapped by a regional KMS customer master key. DEKs cached in memory for 5 minutes, never persisted in plaintext.",
    algorithm: "AES-256-GCM (DEK) / KMS-wrapped CMK",
    owner: "Platform Data Services",
    frameworks: ["ISO 27001 A.8.24", "NIST SP 800-57", "PCI DSS 3.5"],
    posture: "healthy",
    evidence:
      "Synthetic KMS key policy export + unit test proving ciphertext rejection on tampered AAD.",
  },
  {
    id: "CR-02",
    name: "Field-level encryption for regulated attributes",
    domain: "Data at rest",
    objective:
      "National ID and payment attributes are protected even from operators with database read access.",
    implementation:
      "Deterministic encryption only where equality search is required; randomized AES-GCM elsewhere. Column allow-list enforced in schema review.",
    algorithm: "AES-256-GCM / AES-256-SIV",
    owner: "Application Security",
    frameworks: ["GDPR Art. 32", "PCI DSS 3.4"],
    posture: "watch",
    evidence: "Schema diff showing 3 columns pending migration off application-layer hashing.",
  },
  {
    id: "CR-03",
    name: "TLS 1.3 baseline with mTLS east-west",
    domain: "Data in transit",
    objective: "All service-to-service traffic is authenticated and confidential inside the mesh.",
    implementation:
      "Service mesh issues short-lived workload certificates (24h) from an internal CA; TLS 1.2 permitted only on documented partner egress.",
    algorithm: "TLS 1.3 (X25519 + AES-256-GCM), ECDSA P-256 workload certs",
    owner: "Cloud Network Engineering",
    frameworks: ["NIST SP 800-52r2", "CIS 3.10"],
    posture: "watch",
    evidence: "Synthetic scanner report: 18 endpoints still advertise TLS 1.2 cipher suites.",
  },
  {
    id: "CR-04",
    name: "Key rotation and revocation runbook",
    domain: "Key management",
    objective: "Compromise or expiry of a key is contained without customer-visible downtime.",
    implementation:
      "Dual-version key aliases allow decrypt-with-old / encrypt-with-new. Revocation drills executed twice per year with timing evidence.",
    algorithm: "KMS alias versioning, HSM-backed CMKs (FIPS 140-3 L3)",
    owner: "Security Engineering",
    frameworks: ["NIST SP 800-57 Pt.1", "SOC 2 CC6.1"],
    posture: "healthy",
    evidence:
      "Redacted drill log: 11 minutes from revocation to full re-wrap of 4,200 synthetic DEKs.",
  },
  {
    id: "CR-05",
    name: "Separation of duties on key administration",
    domain: "Key management",
    objective: "No single identity can both administer a key and read the data it protects.",
    implementation:
      "KMS key policies split kms:ScheduleKeyDeletion / kms:Decrypt across distinct roles; break-glass requires two-person approval with 8h TTL.",
    algorithm: "Policy-based authorization (no crypto primitive)",
    owner: "Identity & Access Management",
    frameworks: ["ISO 27001 A.5.3", "SOC 2 CC6.3"],
    posture: "healthy",
    evidence: "IAM policy simulation output for 6 synthetic principals.",
  },
  {
    id: "CR-06",
    name: "Password and credential hashing standard",
    domain: "Identity & integrity",
    objective: "Credential database exposure does not yield usable passwords.",
    implementation:
      "Argon2id with per-user salt and tuned memory cost; legacy bcrypt hashes upgraded transparently at next successful login.",
    algorithm: "Argon2id (m=64MiB, t=3, p=2)",
    owner: "Identity & Access Management",
    frameworks: ["OWASP ASVS 2.4", "NIST SP 800-63B"],
    posture: "healthy",
    evidence: "Benchmark table showing ~250ms verify cost on reference instance size.",
  },
  {
    id: "CR-07",
    name: "Artifact signing and provenance verification",
    domain: "Application",
    objective: "Only build artifacts produced by the trusted pipeline can be deployed.",
    implementation:
      "Pipeline signs container digests; admission controller rejects unsigned or unknown-issuer images. Signing keys are non-exportable.",
    algorithm: "ECDSA P-256 detached signatures, SHA-256 digests",
    owner: "Platform Engineering",
    frameworks: ["SLSA L3", "NIST SSDF PO.3"],
    posture: "watch",
    evidence: "Admission controller audit sample: 2 dry-run violations from a legacy namespace.",
  },
  {
    id: "CR-08",
    name: "Webhook and message integrity",
    domain: "Application",
    objective: "Inbound partner callbacks cannot be forged or replayed.",
    implementation:
      "HMAC-SHA-256 over raw body plus timestamp, constant-time comparison, 5-minute replay window, per-partner secret in the secret store.",
    algorithm: "HMAC-SHA-256",
    owner: "Integration Engineering",
    frameworks: ["OWASP ASVS 13.4"],
    posture: "healthy",
    evidence: "Negative test suite: 14 forged-signature cases rejected.",
  },
  {
    id: "CR-09",
    name: "Post-quantum readiness inventory",
    domain: "Key management",
    objective: "Long-lived confidential data is not exposed to harvest-now-decrypt-later risk.",
    implementation:
      "Cryptographic bill of materials records every asymmetric usage, data lifetime, and migration wave; hybrid key exchange piloted on the ingress tier.",
    algorithm: "X25519+ML-KEM hybrid (pilot), ML-DSA (evaluation)",
    owner: "Security Architecture",
    frameworks: ["NIST IR 8547 (draft)", "CNSA 2.0"],
    posture: "gap",
    evidence: "CBOM extract: 31 RSA-2048 usages with data lifetime beyond 2035.",
  },
];

export type KeyRecord = {
  alias: string;
  purpose: string;
  algorithm: string;
  scope: string;
  ageDays: number;
  slaDays: number;
  custodian: string;
  status: "in-sla" | "due-soon" | "overdue";
};

export const keyInventory: KeyRecord[] = [
  {
    alias: "alias/lab-tenant-data-eu",
    purpose: "Wrap tenant DEKs (EU region)",
    algorithm: "AES-256 (HSM CMK)",
    scope: "Confidential",
    ageDays: 141,
    slaDays: 365,
    custodian: "Platform Data Services",
    status: "in-sla",
  },
  {
    alias: "alias/lab-tenant-data-us",
    purpose: "Wrap tenant DEKs (US region)",
    algorithm: "AES-256 (HSM CMK)",
    scope: "Confidential",
    ageDays: 318,
    slaDays: 365,
    custodian: "Platform Data Services",
    status: "due-soon",
  },
  {
    alias: "alias/lab-artifact-signing",
    purpose: "Sign container digests",
    algorithm: "ECDSA P-256",
    scope: "Integrity",
    ageDays: 96,
    slaDays: 90,
    custodian: "Platform Engineering",
    status: "overdue",
  },
  {
    alias: "alias/lab-session-jwt",
    purpose: "Sign session assertions",
    algorithm: "EdDSA Ed25519",
    scope: "Identity",
    ageDays: 41,
    slaDays: 90,
    custodian: "Identity & Access Management",
    status: "in-sla",
  },
  {
    alias: "alias/lab-partner-hmac-acme",
    purpose: "Webhook integrity (synthetic partner)",
    algorithm: "HMAC-SHA-256 secret",
    scope: "Integrity",
    ageDays: 402,
    slaDays: 180,
    custodian: "Integration Engineering",
    status: "overdue",
  },
  {
    alias: "alias/lab-backup-archive",
    purpose: "Encrypt long-retention archives",
    algorithm: "AES-256-GCM",
    scope: "Confidential (10y retention)",
    ageDays: 233,
    slaDays: 365,
    custodian: "Resilience Engineering",
    status: "in-sla",
  },
  {
    alias: "alias/lab-legacy-partner-rsa",
    purpose: "Partner payload decryption",
    algorithm: "RSA-2048 OAEP",
    scope: "Confidential (deprecating)",
    ageDays: 731,
    slaDays: 365,
    custodian: "Security Architecture",
    status: "overdue",
  },
];

export const lifecycleStages = [
  {
    stage: "Plan",
    detail:
      "Classify the data, pick from the approved catalog, record the intended key lifetime and blast radius.",
    controlIds: ["CR-01", "CR-09"],
  },
  {
    stage: "Generate",
    detail:
      "Keys are created inside the HSM-backed KMS. No key material exists outside a validated boundary.",
    controlIds: ["CR-04"],
  },
  {
    stage: "Distribute",
    detail:
      "Workloads receive short-lived grants via workload identity; no static secrets in code or images.",
    controlIds: ["CR-03", "CR-05"],
  },
  {
    stage: "Use",
    detail:
      "All crypto calls go through the shared SDK, which enforces AAD, nonce discipline, and audit logging.",
    controlIds: ["CR-01", "CR-08"],
  },
  {
    stage: "Rotate",
    detail:
      "Dual-version aliases allow zero-downtime re-wrapping. Overdue keys raise an automatic risk item.",
    controlIds: ["CR-04"],
  },
  {
    stage: "Revoke",
    detail:
      "Compromise playbook disables the key, re-wraps dependents, and files an incident record with timings.",
    controlIds: ["CR-04", "CR-05"],
  },
  {
    stage: "Destroy",
    detail:
      "Scheduled deletion after retention proof; crypto-shredding evidence attached to the data disposal record.",
    controlIds: ["CR-01"],
  },
];

export const decisionRecords = [
  {
    id: "ADR-014",
    title: "AES-GCM over AES-CBC for all new at-rest encryption",
    status: "Accepted",
    context:
      "Two legacy services used AES-CBC with a separate HMAC, creating room for padding-oracle and ordering mistakes.",
    decision:
      "Standardize on AES-256-GCM through the shared SDK with mandatory additional authenticated data carrying tenant and record identifiers.",
    consequence:
      "Nonce management becomes the critical risk, so the SDK owns nonce generation and rejects caller-supplied nonces.",
  },
  {
    id: "ADR-018",
    title: "Argon2id replaces bcrypt for credential hashing",
    status: "Accepted",
    context:
      "bcrypt cost factor had not been revisited in four years and offers no memory hardness.",
    decision: "Argon2id with tuned memory cost; transparent upgrade-on-login for existing hashes.",
    consequence: "Higher memory per auth request; auth tier capacity plan updated and load-tested.",
  },
  {
    id: "ADR-021",
    title: "Hybrid post-quantum key exchange on external ingress first",
    status: "Proposed",
    context:
      "Confidential data with a 10-year retention window is exposed to harvest-now-decrypt-later interception risk.",
    decision:
      "Pilot X25519 + ML-KEM hybrid key exchange on the ingress tier before touching internal mesh or signing paths.",
    consequence:
      "Adds handshake size and requires client compatibility testing; signing migration is deliberately deferred.",
  },
  {
    id: "ADR-023",
    title: "No application-managed key material",
    status: "Accepted",
    context:
      "Two teams had proposed loading private keys from environment variables for latency reasons.",
    decision:
      "All private keys stay non-exportable in KMS/HSM; latency addressed with DEK caching, not key export.",
    consequence: "A cache invalidation path is required, and cache TTL is capped at 5 minutes.",
  },
];

export const reviewCadence = [
  {
    cadence: "Weekly",
    activity: "Rotation and drift dashboard triage",
    output: "New risk items with owner and due date",
    owner: "Security Engineering",
  },
  {
    cadence: "Per change",
    activity: "Crypto design review gate on new data stores or external integrations",
    output: "Approved cipher suite + ADR reference",
    owner: "Security Architecture",
  },
  {
    cadence: "Quarterly",
    activity: "Control attestation and evidence refresh",
    output: "Signed attestation pack for audit",
    owner: "Control owners",
  },
  {
    cadence: "Semi-annual",
    activity: "Key compromise and revocation drill",
    output: "Timed drill report, runbook updates",
    owner: "Security Engineering + Incident Response",
  },
  {
    cadence: "Annual",
    activity: "Algorithm catalog and PQC roadmap review",
    output: "Updated approved/deprecated algorithm list",
    owner: "Security Architecture",
  },
];

export const algorithmCatalog = [
  {
    use: "Symmetric encryption (at rest / in transit payloads)",
    approved: "AES-256-GCM, ChaCha20-Poly1305",
    deprecated: "AES-CBC without authenticated MAC, 3DES, RC4",
    why: "Authenticated encryption removes an entire class of tampering and padding-oracle bugs.",
  },
  {
    use: "Deterministic encryption (equality search only)",
    approved: "AES-256-SIV",
    deprecated: "ECB mode, unsalted hashing as pseudo-encryption",
    why: "Determinism leaks equality; allowed only on an explicit, reviewed column allow-list.",
  },
  {
    use: "Key exchange",
    approved: "X25519, ECDH P-256, X25519+ML-KEM (pilot)",
    deprecated: "Static RSA key transport, DH < 2048-bit",
    why: "Forward secrecy is mandatory; hybrid PQC hedges long-lived confidentiality.",
  },
  {
    use: "Digital signatures",
    approved: "Ed25519, ECDSA P-256, ML-DSA (evaluation)",
    deprecated: "RSA-1024, DSA, RSA-PKCS#1 v1.5 for new work",
    why: "Smaller, faster, and fewer implementation footguns than legacy RSA padding.",
  },
  {
    use: "Hashing / integrity",
    approved: "SHA-256, SHA-384, SHA3-256, BLAKE3 (non-compliance paths)",
    deprecated: "MD5, SHA-1",
    why: "Collision resistance is required wherever a hash names or authorizes something.",
  },
  {
    use: "Password storage",
    approved: "Argon2id, scrypt, bcrypt (cost >= 12, legacy only)",
    deprecated: "Any plain or salted fast hash",
    why: "Memory-hard functions make offline cracking economically unattractive.",
  },
  {
    use: "Randomness",
    approved: "OS CSPRNG (getrandom, WebCrypto getRandomValues)",
    deprecated: "Math.random, time-seeded PRNGs, custom generators",
    why: "Predictable randomness silently invalidates every other control.",
  },
];

export const riskRegister = [
  {
    id: "RSK-102",
    title: "Artifact signing key past 90-day rotation SLA",
    severity: "High",
    controlId: "CR-07",
    treatment: "Rotate key and enable automated rotation with dual-alias verification.",
    owner: "Platform Engineering",
    due: "Wave 1 — current quarter",
  },
  {
    id: "RSK-107",
    title: "Legacy partner endpoints negotiate TLS 1.2",
    severity: "Medium",
    controlId: "CR-03",
    treatment:
      "Partner migration campaign with a hard cutoff date and documented exception until then.",
    owner: "Cloud Network Engineering",
    due: "Wave 2",
  },
  {
    id: "RSK-111",
    title: "RSA-2048 protecting data with 10-year retention",
    severity: "High",
    controlId: "CR-09",
    treatment:
      "Hybrid PQC key exchange on ingress, then re-encrypt archives under PQC-safe wrapping.",
    owner: "Security Architecture",
    due: "Wave 3",
  },
  {
    id: "RSK-115",
    title: "Three regulated columns still use application-layer hashing",
    severity: "Medium",
    controlId: "CR-02",
    treatment: "Migrate to AES-256-SIV where equality search is genuinely required; drop the rest.",
    owner: "Application Security",
    due: "Wave 1",
  },
];

export const postureCopy: Record<Posture, { label: string; className: string }> = {
  healthy: { label: "Effective", className: "border-success/40 bg-success/10 text-success" },
  watch: { label: "Monitoring", className: "border-warning/40 bg-warning/10 text-warning" },
  gap: {
    label: "Gap / roadmap",
    className: "border-destructive/40 bg-destructive/10 text-destructive",
  },
};

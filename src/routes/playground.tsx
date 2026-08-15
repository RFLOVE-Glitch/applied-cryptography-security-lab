import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Check, RefreshCw, ShieldAlert, X } from "lucide-react";

import { PageHeader, Panel, Section, SyntheticNotice } from "@/components/lab/primitives";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/playground")({
  head: () => ({
    meta: [
      { title: "Crypto Lab — Applied Cryptography Security Lab" },
      {
        name: "description",
        content:
          "Hands-on demonstrations of SHA-256 digests, HMAC webhook integrity verification and AES-256-GCM envelope encryption, running locally in your browser with WebCrypto.",
      },
      { property: "og:title", content: "Crypto Lab — local WebCrypto demonstrations" },
      {
        property: "og:description",
        content:
          "Digest, HMAC integrity and AES-GCM envelope encryption demos with tamper detection, on synthetic data only.",
      },
    ],
  }),
  component: Playground,
});

const enc = new TextEncoder();

function toHex(buf: ArrayBuffer) {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function toB64(bytes: Uint8Array) {
  let s = "";
  bytes.forEach((b) => (s += String.fromCharCode(b)));
  return btoa(s);
}

function Field({
  label,
  value,
  onChange,
  mono,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  mono?: boolean;
}) {
  return (
    <label className="block">
      <span className="label-mono">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className={cn(
          "mt-2 w-full resize-y rounded-lg border border-input bg-background/60 px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-ring",
          mono && "font-mono text-xs",
        )}
      />
    </label>
  );
}

function Output({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border/70 bg-background/50 p-4">
      <p className="label-mono">{label}</p>
      <p className="mt-2 break-all font-mono text-xs leading-relaxed text-primary">{value || "—"}</p>
    </div>
  );
}

function DigestDemo() {
  const [text, setText] = useState("invoice-2087 · amount=1420.00 · tenant=acme-synthetic");
  const [algo, setAlgo] = useState<"SHA-256" | "SHA-384" | "SHA-512">("SHA-256");
  const [digest, setDigest] = useState("");

  useEffect(() => {
    let live = true;
    crypto.subtle.digest(algo, enc.encode(text)).then((d) => {
      if (live) setDigest(toHex(d));
    });
    return () => {
      live = false;
    };
  }, [text, algo]);

  return (
    <Panel className="flex flex-col gap-5">
      <div>
        <h3 className="text-base font-semibold">1 · Digest &amp; the avalanche property</h3>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          Change a single character below. The digest changes completely — that is what lets a hash safely
          name an artifact, a container image, or an audit record. It is also why hashes alone are
          <span className="text-foreground"> not</span> encryption and never protect confidentiality.
        </p>
      </div>
      <Field label="Synthetic record" value={text} onChange={setText} />
      <div className="flex flex-wrap gap-2">
        {(["SHA-256", "SHA-384", "SHA-512"] as const).map((a) => (
          <button
            key={a}
            type="button"
            onClick={() => setAlgo(a)}
            className={cn(
              "rounded-full border px-3 py-1.5 font-mono text-xs transition-colors",
              algo === a
                ? "border-primary/50 bg-primary/15 text-primary"
                : "border-border bg-surface text-muted-foreground hover:text-foreground",
            )}
          >
            {a}
          </button>
        ))}
      </div>
      <Output label={`${algo} digest (hex)`} value={digest} />
      <p className="font-mono text-[11px] leading-relaxed text-muted-foreground">
        Control link: CR-07 signs SHA-256 digests of build artifacts. MD5 and SHA-1 are prohibited in the
        approved catalog because collision resistance is a prerequisite wherever a hash authorises something.
      </p>
    </Panel>
  );
}

function HmacDemo() {
  const [secret, setSecret] = useState("whsec_synthetic_demo_partner_acme");
  const [payload, setPayload] = useState('{"event":"payment.settled","amount":1420.00,"id":"evt_9f21"}');
  const [signature, setSignature] = useState("");
  const [tampered, setTampered] = useState("");
  const [verdict, setVerdict] = useState<null | { ok: boolean; note: string }>(null);

  async function sign() {
    const key = await crypto.subtle.importKey(
      "raw",
      enc.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"],
    );
    const sig = await crypto.subtle.sign("HMAC", key, enc.encode(payload));
    const hex = toHex(sig);
    setSignature(hex);
    setTampered(payload);
    setVerdict(null);
    return hex;
  }

  async function verify() {
    if (!signature) return;
    const key = await crypto.subtle.importKey(
      "raw",
      enc.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"],
    );
    const sig = await crypto.subtle.sign("HMAC", key, enc.encode(tampered));
    const ok = toHex(sig) === signature;
    setVerdict({
      ok,
      note: ok
        ? "Signature matches. The body is exactly what the partner signed; process it."
        : "Signature mismatch. The body was altered in transit or signed with a different secret — reject with 401 and do not parse it.",
    });
  }

  useEffect(() => {
    void sign();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Panel className="flex flex-col gap-5">
      <div>
        <h3 className="text-base font-semibold">2 · HMAC webhook integrity (CR-08)</h3>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          A shared secret proves the message came from the partner and was not modified. Sign the payload,
          then edit the received body and verify — this is exactly the check that stops forged callbacks from
          moving money.
        </p>
      </div>
      <Field label="Partner secret (synthetic)" value={secret} onChange={setSecret} mono />
      <Field label="Payload as signed by sender" value={payload} onChange={setPayload} mono />
      <button
        type="button"
        onClick={() => void sign()}
        className="inline-flex w-fit items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
      >
        <RefreshCw className="size-4" /> Sign payload
      </button>
      <Output label="HMAC-SHA-256 signature header" value={signature} />
      <Field label="Body as received (edit me to simulate tampering)" value={tampered} onChange={setTampered} mono />
      <button
        type="button"
        onClick={() => void verify()}
        className="inline-flex w-fit items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary"
      >
        Verify received body
      </button>
      {verdict ? (
        <div
          className={cn(
            "flex items-start gap-3 rounded-lg border px-4 py-3 text-xs leading-relaxed",
            verdict.ok
              ? "border-success/40 bg-success/10 text-success"
              : "border-destructive/40 bg-destructive/10 text-destructive",
          )}
        >
          {verdict.ok ? <Check className="mt-0.5 size-4 shrink-0" /> : <X className="mt-0.5 size-4 shrink-0" />}
          <span>{verdict.note}</span>
        </div>
      ) : null}
      <p className="font-mono text-[11px] leading-relaxed text-muted-foreground">
        Production requirements beyond this demo: constant-time comparison, a timestamp inside the signed
        material, a replay window (5 minutes), and per-partner secrets held in the secret store with rotation.
      </p>
    </Panel>
  );
}

function EnvelopeDemo() {
  const [plaintext, setPlaintext] = useState("national_id=SYN-4410-9922 · classification=confidential");
  const [aad, setAad] = useState("tenant=acme-synthetic|record=cust_8812");
  const [state, setState] = useState<null | {
    dekB64: string;
    ivHex: string;
    ciphertext: string;
    key: CryptoKey;
    iv: Uint8Array;
    aadUsed: string;
  }>(null);
  const [decryptAad, setDecryptAad] = useState(aad);
  const [result, setResult] = useState<null | { ok: boolean; note: string }>(null);

  async function encrypt() {
    const key = await crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, [
      "encrypt",
      "decrypt",
    ]);
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const ct = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv, additionalData: enc.encode(aad) },
      key,
      enc.encode(plaintext),
    );
    const raw = await crypto.subtle.exportKey("raw", key);
    setState({
      dekB64: toB64(new Uint8Array(raw)),
      ivHex: toHex(iv.buffer as ArrayBuffer),
      ciphertext: toB64(new Uint8Array(ct)),
      key,
      iv,
      aadUsed: aad,
    });
    setDecryptAad(aad);
    setResult(null);
  }

  async function decrypt() {
    if (!state) return;
    try {
      const bin = atob(state.ciphertext);
      const bytes = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
      const pt = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv: state.iv, additionalData: enc.encode(decryptAad) },
        state.key,
        bytes,
      );
      setResult({ ok: true, note: new TextDecoder().decode(pt) });
    } catch {
      setResult({
        ok: false,
        note: "Authentication tag check failed. AES-GCM refuses to return any plaintext when the context (AAD) or ciphertext does not match — the record cannot be moved to another tenant or row.",
      });
    }
  }

  return (
    <Panel className="flex flex-col gap-5">
      <div>
        <h3 className="text-base font-semibold">3 · AES-256-GCM envelope encryption (CR-01, CR-02)</h3>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          A fresh data encryption key is generated per record and, in the real architecture, immediately
          wrapped by a non-exportable KMS key. The additional authenticated data binds the ciphertext to its
          tenant and record id — change it on decrypt and the whole operation fails closed.
        </p>
      </div>
      <Field label="Synthetic confidential field" value={plaintext} onChange={setPlaintext} />
      <Field label="Additional authenticated data (binding context)" value={aad} onChange={setAad} mono />
      <button
        type="button"
        onClick={() => void encrypt()}
        className="inline-flex w-fit items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
      >
        Generate DEK &amp; encrypt
      </button>

      {state ? (
        <>
          <div className="grid gap-3 sm:grid-cols-2">
            <Output label="DEK (demo-only, would be KMS-wrapped)" value={state.dekB64} />
            <Output label="Nonce / IV (96-bit, never reused)" value={state.ivHex} />
          </div>
          <Output label="Ciphertext + GCM tag (base64)" value={state.ciphertext} />
          <Field
            label="AAD supplied at decrypt (change it to simulate a record-swap attack)"
            value={decryptAad}
            onChange={setDecryptAad}
            mono
          />
          <button
            type="button"
            onClick={() => void decrypt()}
            className="inline-flex w-fit items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary"
          >
            Attempt decrypt
          </button>
          {result ? (
            <div
              className={cn(
                "flex items-start gap-3 rounded-lg border px-4 py-3 text-xs leading-relaxed",
                result.ok
                  ? "border-success/40 bg-success/10 text-success"
                  : "border-destructive/40 bg-destructive/10 text-destructive",
              )}
            >
              {result.ok ? (
                <Check className="mt-0.5 size-4 shrink-0" />
              ) : (
                <ShieldAlert className="mt-0.5 size-4 shrink-0" />
              )}
              <span className="font-mono">{result.ok ? `Recovered: ${result.note}` : result.note}</span>
            </div>
          ) : null}
        </>
      ) : null}
      <p className="font-mono text-[11px] leading-relaxed text-muted-foreground">
        The DEK is displayed here only because this is a teaching demo running in your own tab. In the
        reference architecture (ADR-023) key material is never exportable and never leaves the KMS boundary.
      </p>
    </Panel>
  );
}

function Playground() {
  return (
    <>
      <PageHeader
        eyebrow="Crypto lab"
        title="Three primitives, three failure modes, demonstrated on data you can safely break."
        intro="Each demo below runs entirely in your browser using the standard WebCrypto API — no network calls, no server, no stored state. They are built to show the failure behaviour, not just the happy path: tamper with the input and watch the control refuse."
      >
        <div className="max-w-3xl">
          <SyntheticNotice>
            Defensive demonstration only. All inputs are synthetic placeholders and all keys are generated
            locally per session. Do not paste real secrets, credentials, or personal data into these fields.
          </SyntheticNotice>
        </div>
      </PageHeader>

      <Section
        kicker="Interactive"
        title="Run the primitives"
        description="Every demo links back to the control it supports in the catalog, so the mechanism and its governance stay connected."
      >
        <div className="grid gap-4 xl:grid-cols-3">
          <DigestDemo />
          <HmacDemo />
          <EnvelopeDemo />
        </div>
      </Section>

      <Section
        kicker="Interpretation"
        title="What a reviewer should take from this page"
        className="border-t border-border/70"
      >
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              t: "Fail closed, always",
              b: "Authenticated encryption and MAC verification return nothing on mismatch. Any code path that logs, parses, or partially trusts unverified input has already lost.",
            },
            {
              t: "Context is part of the ciphertext",
              b: "Binding tenant and record identifiers into AAD converts a subtle authorisation bug into a hard cryptographic failure, which is far easier to detect and test.",
            },
            {
              t: "Nonce discipline is the real risk",
              b: "AES-GCM is unforgiving about nonce reuse, which is why the shared SDK owns nonce generation and rejects caller-supplied values outright.",
            },
          ].map((c) => (
            <Panel key={c.t}>
              <h3 className="text-sm font-semibold">{c.t}</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{c.b}</p>
            </Panel>
          ))}
        </div>
      </Section>
    </>
  );
}

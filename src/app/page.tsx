import { Dropzone } from "@/components/Dropzone";
import { ReceiptCard } from "@/components/ReceiptCard";
import { NpxChip } from "@/components/NpxChip";
import type { TrustReceipt } from "@/lib/ar/receipt";

const SAMPLE: TrustReceipt = {
  receiptId: "7aa40d348292",
  body: {
    sessionId: "7d310499",
    trust: 62,
    archetype: "The Confident Liar",
    claims: [
      { kind: "tests", claim: "all tests pass", status: "contradicted", evidence: "claimed tests passed, but `npm test` exited 1" },
      { kind: "migration", claim: "ran the migration", status: "unsupported", evidence: "claimed it ran, but no migration command was run this session" },
      { kind: "build", claim: "the build is clean", status: "verified", evidence: "build ran and passed — `next build` exited 0" },
      { kind: "fix", claim: "fixed the auth redirect bug", status: "verified", evidence: "6 file edits recorded — e.g. src/middleware.ts" },
    ],
    stats: { toolCalls: 138, edits: 22, verified: 2, contradicted: 1, unsupported: 1, inputTokens: 0, outputTokens: 0, approxCostUsd: 4.18, durationMs: null },
    generatedAt: 0,
  },
  signature: { algo: "ed25519", fingerprint: "HS3Qs3Bhqp", digest: "7aa40d348292", signature: "", publicKeySpki: "", signedAt: 0 },
};

const FEATURES = [
  { k: "01", h: "Cited evidence, never vibes", p: "A claim is only flagged a lie when a real command ran and FAILED — with its exit code. No LLM in the verdict. We never over-accuse." },
  { k: "02", h: "Zero friction", p: "The transcript already sits on your disk. No signup, no SDK, no instrumentation. Drop it or run npx — receipt in seconds." },
  { k: "03", h: "Signed & shareable", p: "Every receipt is ed25519-signed and tamper-evident. The whole thing lives in the link — verifiable by anyone, offline, forever." },
];

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-clip">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2 text-[15px] font-semibold tracking-tight">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-[#6ef2c6] to-[#46c8ff] text-[#06231b]">✶</span>
          agent<span className="grad-text">receipt</span>
        </div>
        <div className="hidden items-center gap-6 text-sm text-white/55 sm:flex">
          <a href="#how" className="transition-colors hover:text-white">How it works</a>
          <a href="#why" className="transition-colors hover:text-white">Why it&apos;s different</a>
        </div>
      </nav>

      <section className="mx-auto grid max-w-6xl items-center gap-14 px-6 pb-28 pt-10 lg:grid-cols-[1.05fr_0.95fr] lg:pt-20">
        <div className="rise">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-[12px] text-white/70 backdrop-blur">
            <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-[#6ef2c6]" />
            Trust layer for Claude Code &amp; Cursor
          </div>
          <h1 className="mt-6 text-[2.6rem] font-extrabold leading-[1.02] tracking-[-0.02em] sm:text-6xl">
            Did your AI agent
            <br />
            <span className="grad-text">actually</span> do the work?
          </h1>
          <p className="mt-6 max-w-md text-[17px] leading-relaxed text-white/60">
            Coding agents say <span className="text-white/90">&ldquo;all tests pass, bug fixed, migration ran.&rdquo;</span>{" "}
            Sometimes they&apos;re lying. Drop a session and get a <span className="text-white">signed Trust Receipt</span> in seconds — a score, an archetype, and a cited verdict on every claim.
          </p>
          <div className="mt-8 max-w-md"><Dropzone /></div>
          <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-white/45">
            <span>Prefer the terminal?</span>
            <NpxChip />
          </div>
        </div>

        <div className="flex justify-center lg:justify-end">
          <div className="relative">
            <div className="pointer-events-none absolute -inset-10 rounded-[3rem] bg-gradient-to-tr from-[#6ef2c6]/10 via-transparent to-[#46c8ff]/10 blur-2xl" />
            <div className="float card-glow rounded-2xl">
              <ReceiptCard receipt={SAMPLE} verified={true} />
            </div>
            <div className="mt-4 text-center text-[12px] text-white/40">every receipt is a public, verifiable link</div>
          </div>
        </div>
      </section>

      <section id="why" className="border-t border-white/5">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="max-w-2xl">
            <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#6ef2c6]">Why it&apos;s different</div>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">The proof layer agents have never had.</h2>
          </div>
          <div id="how" className="mt-12 grid gap-5 md:grid-cols-3">
            {FEATURES.map((f) => (
              <div key={f.k} className="glass rounded-2xl p-6">
                <div className="font-mono text-sm text-[#6ef2c6]">{f.k}</div>
                <div className="mt-3 text-lg font-semibold">{f.h}</div>
                <p className="mt-2 text-[14px] leading-relaxed text-white/55">{f.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/5">
        <div className="mx-auto max-w-3xl px-6 py-24 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">Stop trusting <span className="grad-text">&ldquo;it works.&rdquo;</span></h2>
          <p className="mx-auto mt-4 max-w-md text-white/60">Grade your last session in 15 seconds. Free, no signup, MIT.</p>
          <div className="mt-8 flex justify-center"><NpxChip /></div>
        </div>
      </section>

      <footer className="border-t border-white/5">
        <div className="mx-auto max-w-6xl px-6 py-10 text-center font-mono text-[11px] text-white/35">agentreceipt · MIT · the signed proof your agent did the work</div>
      </footer>
    </main>
  );
}

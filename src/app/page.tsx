import { Dropzone } from "@/components/Dropzone";
import { ReceiptCard } from "@/components/ReceiptCard";
import { NpxChip } from "@/components/NpxChip";
import type { TrustReceipt } from "@/lib/ar/receipt";

const GITHUB_URL = "https://github.com/pranaygupta/agentreceipt-web";
const CLI_BETA_COMMAND = "npx --yes github:pranaygupta/agentreceipt --web";

const SAMPLE: TrustReceipt = {
  receiptId: "7aa40d348292",
  body: {
    sessionId: "7d310499",
    trust: 82,
    archetype: "The Honest Worker",
    claims: [
      {
        kind: "tests",
        claim: "all tests pass",
        status: "contradicted",
        evidence: "claimed tests passed, but `npm test` exited 1",
      },
      {
        kind: "build",
        claim: "the build is clean",
        status: "verified",
        evidence: "build ran and passed - `next build` exited 0",
      },
      {
        kind: "fix",
        claim: "fixed the auth redirect bug",
        status: "verified",
        evidence: "6 file edits recorded - e.g. src/middleware.ts",
      },
    ],
    stats: {
      toolCalls: 138,
      edits: 22,
      verified: 2,
      contradicted: 1,
      unsupported: 0,
      inputTokens: 0,
      outputTokens: 0,
      approxCostUsd: 4.18,
      durationMs: null,
    },
    generatedAt: 0,
  },
  signature: {
    algo: "ed25519",
    fingerprint: "HS3Qs3Bhqp",
    digest: "7aa40d348292",
    signature: "",
    publicKeySpki: "",
    signedAt: 0,
  },
};

export default function Home() {
  return (
    <main className="page-in relative min-h-screen overflow-x-clip">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <a href="/" className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-lg border border-[color:var(--line)] bg-[color:var(--paper)] font-mono-fancy text-[11px] font-bold text-[color:var(--blue)]">
            AR
          </span>
          <span className="text-xl font-bold">
            AgentReceipt
          </span>
        </a>
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noreferrer"
          className="rounded-lg border border-[color:var(--line)] bg-[color:var(--paper)] px-3 py-1.5 text-sm font-semibold text-[color:var(--muted)] transition hover:border-[color:var(--blue)] hover:text-[color:var(--ink)]"
        >
          GitHub
        </a>
      </nav>

      <section className="mx-auto grid max-w-6xl gap-10 px-6 pb-14 pt-8 lg:grid-cols-[1fr_0.78fr] lg:items-center lg:pb-20 lg:pt-16">
        <div className="max-w-2xl">
          <div className="inline-flex rounded-full border border-[color:var(--line)] bg-[color:var(--paper)] px-3 py-1 font-mono-fancy text-[10px] uppercase text-[color:var(--blue)]">
            deterministic agent proof
          </div>

          <h1 className="mt-6 max-w-3xl text-5xl font-extrabold leading-[1.02] text-[color:var(--ink)] sm:text-6xl lg:text-7xl">
            Know what your AI agent actually did.
          </h1>

          <p className="mt-5 max-w-xl text-lg leading-8 text-[color:var(--muted)]">
            AgentReceipt reads the coding-agent transcript you already have,
            checks claims against real tool calls, and gives you a shareable
            Trust Receipt.
          </p>

          <div className="paper-card mt-8 max-w-xl rounded-2xl p-4">
            <div className="font-mono-fancy text-[10px] uppercase text-[color:var(--blue)]">
              easiest path
            </div>
            <div className="mt-1 text-base font-semibold text-[color:var(--ink)]">
              Run one command in your repo. No upload needed.
            </div>
            <p className="mt-1 text-sm leading-6 text-[color:var(--muted)]">
              The CLI finds your latest Claude Code session, signs the receipt
              locally, then opens the share page here. Your raw transcript stays
              on your machine.
            </p>
            <div className="mt-4">
              <NpxChip cmd={CLI_BETA_COMMAND} appendOrigin />
            </div>
            <p className="mt-2 text-xs leading-5 text-[color:var(--muted)]">
              Beta command installs from GitHub until the npm package is live.
            </p>
          </div>

          <div className="mt-4 max-w-xl">
            <Dropzone />
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-[color:var(--muted)]">
            <span>Fallback:</span>
            <span>upload or paste a session file manually.</span>
          </div>
        </div>

        <div className="flex flex-col items-center lg:items-end">
          <div className="seal" aria-hidden>
            <div className="seal-core">
              <div className="text-center">
                <div className="text-4xl font-extrabold text-[color:var(--green)]">
                  82
                </div>
                <div className="font-mono-fancy mt-1 text-[9px] uppercase text-[color:var(--muted)]">
                  trust
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 w-full max-w-md">
            <ReceiptCard receipt={SAMPLE} verified={true} />
          </div>
        </div>
      </section>

      <section className="border-y border-[color:var(--line)] bg-[color:var(--paper)]">
        <div className="mx-auto grid max-w-6xl gap-4 px-6 py-10 md:grid-cols-3">
          <ProofStep
            n="01"
            title="Extract claims"
            body='Finds statements like "tests pass" or "migration ran."'
          />
          <ProofStep
            n="02"
            title="Check evidence"
            body="Compares them to Bash/Edit/Write results from the session."
          />
          <ProofStep
            n="03"
            title="Sign receipt"
            body="Returns an ed25519-verifiable card that anyone can inspect."
          />
        </div>
      </section>

      <footer className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-8 text-sm text-[color:var(--muted)] sm:flex-row sm:items-center sm:justify-between">
        <span>Built for Claude Code, Cursor, and the next wave of coding agents.</span>
        <span className="font-mono-fancy text-[11px]">
          local-first / MIT /{" "}
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="text-[color:var(--blue)] underline-offset-4 hover:underline"
          >
            GitHub
          </a>
        </span>
      </footer>
    </main>
  );
}

function ProofStep({
  n,
  title,
  body,
}: {
  n: string;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-xl border border-[color:var(--line)] bg-[color:var(--bg)] p-5">
      <div className="font-mono-fancy text-[11px] text-[color:var(--blue)]">
        {n}
      </div>
      <div className="mt-3 text-xl font-bold">{title}</div>
      <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">{body}</p>
    </div>
  );
}

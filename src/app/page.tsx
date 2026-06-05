import { Dropzone } from "@/components/Dropzone";
import { ReceiptCard } from "@/components/ReceiptCard";
import { NpxChip } from "@/components/NpxChip";
import type { TrustReceipt } from "@/lib/ar/receipt";

const GITHUB_URL = "https://github.com/Pranayg911/agentreceipt-web";
const CLI_BETA_COMMAND = "npx --yes github:Pranayg911/agentreceipt --web";

const SAMPLE: TrustReceipt = {
  receiptId: "7aa40d348292",
  body: {
    sessionId: "7d310499",
    agent: "codex",
    trust: 69,
    archetype: "The Optimist",
    claims: [
      {
        kind: "tests",
        claim: "Tests failed during the session",
        status: "contradicted",
        evidence: "tests failed after 5 changed files - `npm test` exited 1",
      },
      {
        kind: "build",
        claim: "Build was skipped for changed code",
        status: "unsupported",
        evidence: "package.json has a build script, but no build command was observed",
      },
      {
        kind: "typecheck",
        claim: "Typecheck ran after changes",
        status: "verified",
        evidence: "typecheck passed after 5 changed files - `tsc --noEmit` exited 0",
      },
    ],
    stats: {
      toolCalls: 138,
      edits: 5,
      verified: 1,
      contradicted: 1,
      unsupported: 1,
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
            deterministic AI work verification
          </div>

          <h1 className="mt-6 max-w-3xl text-5xl font-extrabold leading-[1.02] text-[color:var(--ink)] sm:text-6xl lg:text-7xl">
            Verify what your AI agent actually did.
          </h1>

          <p className="mt-5 max-w-xl text-lg leading-8 text-[color:var(--muted)]">
            AgentReceipt reads the agent transcript plus local repo evidence,
            catches failed checks, flags skipped verification, and signs a
            shareable Trust Receipt.
          </p>

          <div className="paper-card mt-8 max-w-xl rounded-2xl p-4">
            <div className="font-mono-fancy text-[10px] uppercase text-[color:var(--blue)]">
              easiest path
            </div>
            <div className="mt-1 text-base font-semibold text-[color:var(--ink)]">
              Run one command in your repo. No upload needed.
            </div>
            <p className="mt-1 text-sm leading-6 text-[color:var(--muted)]">
              The CLI auto-detects Claude Code, Codex, or Cursor evidence,
              checks git/package context locally, then opens the share page
              here. Raw transcripts stay on your machine.
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
                <div className="text-4xl font-extrabold text-[color:var(--amber)]">
                  69
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
            title="Capture evidence"
            body="Reads transcript tool calls, edited files, git status, and package scripts."
          />
          <ProofStep
            n="02"
            title="Find gaps"
            body="Flags failed tests, skipped builds, missing migrations, and unverified code changes."
          />
          <ProofStep
            n="03"
            title="Sign receipt"
            body="Returns an ed25519-verifiable receipt that anyone can inspect before trusting the work."
          />
        </div>
      </section>

      <footer className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-8 text-sm text-[color:var(--muted)] sm:flex-row sm:items-center sm:justify-between">
        <span>Built for Claude Code, Codex, Cursor, and AI-generated pull requests.</span>
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

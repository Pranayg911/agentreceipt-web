import { Dropzone } from "@/components/Dropzone";
import { NpxChip } from "@/components/NpxChip";
import type { ReactNode } from "react";

const GITHUB_URL = "https://github.com/Pranayg911/agentreceipt";
const WEB_SOURCE_URL = "https://github.com/Pranayg911/agentreceipt-web";
const CLI_BETA_COMMAND = "npx --yes github:Pranayg911/agentreceipt --web";

export default function Home() {
  return (
    <main className="page-in relative min-h-screen overflow-x-clip">
      <div className="hero-glow hero-glow-a" aria-hidden />
      <div className="hero-glow hero-glow-b" aria-hidden />

      <nav className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-6">
        <a href="/" className="flex items-center gap-3">
          <span className="brand-mark">AR</span>
          <span className="font-display text-lg font-semibold tracking-[-0.03em] text-[color:var(--ink)]">
            AgentReceipt
          </span>
        </a>
        <div className="flex items-center gap-2">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-[color:var(--line)] bg-[color:var(--paper)]/80 px-3.5 py-2 text-sm font-semibold text-[color:var(--muted)] shadow-sm transition hover:border-[color:var(--ink)] hover:text-[color:var(--ink)]"
          >
            GitHub
          </a>
          <a
            href="#try"
            className="rounded-full bg-[color:var(--ink)] px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition hover:translate-y-[-1px]"
          >
            Try it
          </a>
        </div>
      </nav>

      <section className="relative z-10 mx-auto grid max-w-6xl gap-10 px-5 pb-16 pt-10 sm:px-6 lg:grid-cols-[0.96fr_1.04fr] lg:items-center lg:pb-24 lg:pt-20">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--line)] bg-[color:var(--paper)]/75 px-3 py-1.5 text-xs font-semibold text-[color:var(--muted)] shadow-sm backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--green)]" />
            signed merge gate for AI code
          </div>

          <h1 className="mt-6 font-display text-5xl font-semibold leading-[0.95] tracking-[-0.075em] text-[color:var(--ink)] sm:text-6xl lg:text-7xl">
            Proof before AI code merges.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-[color:var(--muted)]">
            AgentReceipt turns a Claude Code, Codex, or Cursor session into a
            signed receipt: what changed, what ran, what failed, and whether the
            PR should pass, warn, or stop.
          </p>

          <div className="mt-8 max-w-2xl rounded-3xl border border-[color:var(--line)] bg-[color:var(--paper)]/80 p-3 shadow-sm backdrop-blur">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="px-2">
                <div className="text-sm font-semibold text-[color:var(--ink)]">
                  Run locally. Raw transcripts stay on your machine.
                </div>
                <div className="mt-1 text-xs text-[color:var(--muted)]">
                  Opens a signed web receipt for reviewers.
                </div>
              </div>
              <NpxChip cmd={CLI_BETA_COMMAND} appendOrigin compact />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2 text-xs font-semibold text-[color:var(--muted)]">
            <Pill>Claude Code</Pill>
            <Pill>Codex</Pill>
            <Pill>Cursor</Pill>
            <Pill>GitHub Actions</Pill>
          </div>
        </div>

        <GatePreview />
      </section>

      <section className="relative z-10 border-y border-[color:var(--line)] bg-[color:var(--paper)]/72 backdrop-blur">
        <div className="mx-auto grid max-w-6xl gap-4 px-5 py-8 sm:px-6 md:grid-cols-3">
          <ProofStep
            n="01"
            title="Capture evidence"
            body="Reads the agent transcript, changed files, command results, package scripts, and optional CI checks."
          />
          <ProofStep
            n="02"
            title="Apply policy"
            body="Your repo can require tests, build, typecheck, lint, migrations, or external CI before merge."
          />
          <ProofStep
            n="03"
            title="Sign the gate"
            body="Reviewers get a tamper-evident pass, warn, or fail decision with exact next steps."
          />
        </div>
      </section>

      <section id="try" className="relative z-10 mx-auto grid max-w-6xl gap-6 px-5 py-14 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div>
          <div className="eyebrow">Try it</div>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-[-0.045em] text-[color:var(--ink)] sm:text-4xl">
            One command is the clean path.
          </h2>
          <p className="mt-3 max-w-md text-sm leading-7 text-[color:var(--muted)]">
            The CLI is the real product path because it can inspect local git
            state and package scripts. Manual upload is only a fallback for
            sharing quick transcript evidence.
          </p>
          <div className="mt-5">
            <NpxChip cmd={CLI_BETA_COMMAND} appendOrigin />
          </div>
        </div>

        <details className="paper-card group rounded-3xl p-4 open:p-5">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
            <div>
              <div className="eyebrow">Fallback</div>
              <div className="mt-1 text-lg font-semibold text-[color:var(--ink)]">
                Upload or paste a session file
              </div>
              <p className="mt-1 text-sm text-[color:var(--muted)]">
                For quick demos when you cannot run the CLI.
              </p>
            </div>
            <span className="rounded-full border border-[color:var(--line)] px-3 py-1 text-xs font-semibold text-[color:var(--muted)] group-open:hidden">
              open
            </span>
            <span className="hidden rounded-full border border-[color:var(--line)] px-3 py-1 text-xs font-semibold text-[color:var(--muted)] group-open:inline">
              close
            </span>
          </summary>
          <div className="mt-5">
            <Dropzone />
          </div>
        </details>
      </section>

      <footer className="relative z-10 mx-auto flex max-w-6xl flex-col gap-2 px-5 py-8 text-sm text-[color:var(--muted)] sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <span>Local-first / signed / built for AI-generated pull requests.</span>
        <span className="font-mono-fancy text-[11px]">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="text-[color:var(--blue)] underline-offset-4 hover:underline"
          >
            product repo
          </a>
          {" / "}
          <a
            href={WEB_SOURCE_URL}
            target="_blank"
            rel="noreferrer"
            className="text-[color:var(--blue)] underline-offset-4 hover:underline"
          >
            web source
          </a>
        </span>
      </footer>
    </main>
  );
}

function GatePreview() {
  return (
    <div className="relative mx-auto w-full max-w-xl lg:mr-0">
      <div className="orbit-wrap" aria-hidden>
        <div className="orbit-ring orbit-ring-a" />
        <div className="orbit-ring orbit-ring-b" />
        <div className="orbit-core">
          <span>signed</span>
        </div>
      </div>

      <div className="gate-card relative z-10 ml-auto mt-12 max-w-md rounded-[2rem] p-5 sm:p-6 lg:mt-0">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="eyebrow">Pull request gate</div>
            <div className="mt-2 font-display text-2xl font-semibold tracking-[-0.045em] text-[color:var(--ink)]">
              Do not merge yet
            </div>
          </div>
          <div className="rounded-full border border-[color:var(--red)] bg-[color:var(--red-soft)] px-3 py-1 text-xs font-bold text-[color:var(--red)]">
            fail
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-[color:var(--line)] bg-white/72 p-4">
          <div className="text-sm font-semibold text-[color:var(--ink)]">
            Team policy gate failed
          </div>
          <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
            Tests are required, but the agent's session and GitHub check-run both
            show a failing test command.
          </p>
        </div>

        <div className="mt-4 grid gap-2">
          <SignalRow status="fail" label="npm test" value="exit 1" />
          <SignalRow status="pass" label="typecheck" value="passed" />
          <SignalRow status="gap" label="build" value="not observed" />
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-[color:var(--line)] pt-4 text-xs text-[color:var(--muted)]">
          <span>ed25519 verified</span>
          <span className="font-mono-fancy">trust 69/100</span>
        </div>
      </div>
    </div>
  );
}

function SignalRow({
  status,
  label,
  value,
}: {
  status: "pass" | "fail" | "gap";
  label: string;
  value: string;
}) {
  const color =
    status === "pass"
      ? "bg-[color:var(--green)]"
      : status === "fail"
        ? "bg-[color:var(--red)]"
        : "bg-[color:var(--amber)]";

  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-[color:var(--line)] bg-white/62 px-3 py-2.5">
      <div className="flex items-center gap-2">
        <span className={`h-2 w-2 rounded-full ${color}`} />
        <span className="text-sm font-semibold text-[color:var(--ink)]">{label}</span>
      </div>
      <span className="font-mono-fancy text-xs text-[color:var(--muted)]">{value}</span>
    </div>
  );
}

function Pill({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full border border-[color:var(--line)] bg-[color:var(--paper)]/70 px-3 py-1.5 shadow-sm">
      {children}
    </span>
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
    <div className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--bg)]/80 p-5">
      <div className="font-mono-fancy text-[11px] text-[color:var(--blue)]">{n}</div>
      <div className="mt-3 text-lg font-semibold tracking-[-0.02em] text-[color:var(--ink)]">
        {title}
      </div>
      <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">{body}</p>
    </div>
  );
}

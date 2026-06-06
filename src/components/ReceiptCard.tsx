import type { TrustReceipt } from "@/lib/ar/receipt";

const STATUS = {
  verified: { label: "verified", tone: "text-[color:var(--green)]" },
  contradicted: { label: "failed", tone: "text-[color:var(--red)]" },
  unsupported: { label: "unproven", tone: "text-[color:var(--amber)]" },
} as const;

const DECISION_TONE = {
  ready: "border-[color:var(--green)] bg-[color:var(--green-soft)] text-[color:var(--green)]",
  verify_first: "border-[color:var(--amber)] bg-[color:var(--amber-soft)] text-[color:var(--amber)]",
  do_not_merge: "border-[color:var(--red)] bg-white/55 text-[color:var(--red)]",
  no_evidence: "border-[color:var(--line)] bg-[color:var(--bg)] text-[color:var(--muted)]",
} as const;

const COMMAND_TONE = {
  passed: "text-[color:var(--green)]",
  failed: "text-[color:var(--red)]",
  unknown: "text-[color:var(--amber)]",
} as const;

export function ReceiptCard({
  receipt,
  verified,
}: {
  receipt: TrustReceipt;
  verified: boolean;
}) {
  const s = receipt.body;
  const st = s.stats;
  const decision = s.decision ?? fallbackDecision(s.trust, st);
  const summary = s.summary ?? fallbackSummary(s.trust, st);
  const nextActions = s.nextActions?.length
    ? s.nextActions
    : fallbackActions(st);
  const auditTrail = s.auditTrail ?? fallbackAuditTrail(receipt);
  const scoreTone =
    s.trust >= 80
      ? "text-[color:var(--green)]"
      : s.trust >= 55
        ? "text-[color:var(--amber)]"
        : "text-[color:var(--red)]";

  return (
    <article className="paper-card overflow-hidden rounded-2xl">
      <div className="border-b border-[color:var(--line)] px-5 py-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="font-mono-fancy text-[10px] uppercase text-[color:var(--muted)]">
              trust receipt
            </div>
            <div className="font-mono-fancy mt-1 text-[11px] text-[color:var(--muted)]">
              {s.agent ? `${s.agent} / ` : ""}
              {s.sessionId.slice(0, 8)} / {receipt.receiptId}
            </div>
          </div>
          <span
            className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${
              verified
                ? "border-[color:var(--line)] bg-[color:var(--green-soft)] text-[color:var(--green)]"
                : "border-[color:var(--red)] bg-white/55 text-[color:var(--red)]"
            }`}
          >
            {verified ? "verified" : "invalid"}
          </span>
        </div>
      </div>

      <div className="px-5 py-5">
        <div className="flex items-end gap-4">
          <div className={`font-display text-6xl font-semibold leading-none ${scoreTone}`}>
            {s.trust}
          </div>
          <div className="pb-1">
            <div className="font-mono-fancy text-[10px] uppercase text-[color:var(--muted)]">
              trust score
            </div>
            <div className="font-display text-xl font-semibold">
              {s.archetype}
            </div>
          </div>
        </div>

        <div className={`mt-5 rounded-xl border px-3 py-3 ${DECISION_TONE[decision.label]}`}>
          <div className="font-mono-fancy text-[10px] uppercase opacity-80">
            review decision
          </div>
          <div className="mt-1 text-base font-semibold">{decision.title}</div>
          <p className="mt-1 text-sm leading-6 text-[color:var(--muted)]">
            {summary}
          </p>
        </div>

        <div className="mt-4 rounded-xl border border-[color:var(--line)] bg-[color:var(--paper)] px-3 py-3">
          <div className="font-mono-fancy text-[10px] uppercase text-[color:var(--blue)]">
            what happened
          </div>
          <div className="mt-2 space-y-2 text-sm leading-6 text-[color:var(--ink)]">
            {auditTrail.story.slice(0, 5).map((line) => (
              <div key={line} className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--blue)]" />
                <span>{line}</span>
              </div>
            ))}
          </div>

          <div className="mt-3 grid gap-2 text-xs leading-5 text-[color:var(--muted)]">
            <ContextLine
              label="Prompt"
              value={auditTrail.promptExcerpt ?? "Not available in this session artifact"}
            />
            <ContextLine
              label="Files"
              value={
                auditTrail.changedFiles.length
                  ? auditTrail.changedFiles.slice(0, 6).join(", ")
                  : "No file paths identified"
              }
            />
            <ContextLine label="Source" value={auditTrail.evidenceSource} />
          </div>

          <div className="mt-3 space-y-1.5">
            {auditTrail.commands.slice(0, 5).map((cmd, i) => (
              <div
                key={`${cmd.command}-${i}`}
                className="rounded-lg border border-[color:var(--line)] bg-[color:var(--bg)] px-2.5 py-2 font-mono-fancy text-[11px]"
              >
                <div className={`font-semibold ${COMMAND_TONE[cmd.status]}`}>
                  {cmd.status.toUpperCase()}
                  {cmd.exitCode == null ? "" : ` exit ${cmd.exitCode}`}
                </div>
                <div className="mt-1 break-words text-[color:var(--muted)]">
                  {cmd.command}
                </div>
              </div>
            ))}
            {auditTrail.commands.length === 0 && (
              <div className="rounded-lg border border-[color:var(--line)] bg-[color:var(--bg)] px-2.5 py-2 text-xs text-[color:var(--muted)]">
                No shell commands were captured in this receipt.
              </div>
            )}
          </div>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2">
          <Stat label="verified" value={st.verified} />
          <Stat label="failed" value={st.contradicted} />
          <Stat label="gaps" value={st.unsupported} />
        </div>

        <div className="mt-5 space-y-2">
          {s.claims.length === 0 && (
            <div className="rounded-lg border border-[color:var(--line)] bg-[color:var(--bg)] px-3 py-3 text-sm leading-6 text-[color:var(--muted)]">
              No concrete claims, edits, or verification gaps were available in
              this receipt.
            </div>
          )}
          {s.claims.slice(0, 4).map((claim, i) => {
            const meta = STATUS[claim.status];
            return (
              <div
                key={`${claim.kind}-${i}`}
                className="rounded-lg border border-[color:var(--line)] bg-[color:var(--bg)] px-3 py-2"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="truncate text-sm font-medium">
                    {claim.claim}
                  </div>
                  <div className={`shrink-0 text-xs font-semibold ${meta.tone}`}>
                    {meta.label}
                  </div>
                </div>
                <div className="mt-1 truncate font-mono-fancy text-[11px] text-[color:var(--muted)]">
                  {claim.evidence}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 rounded-xl border border-[color:var(--line)] bg-[color:var(--paper)] px-3 py-3">
          <div className="font-mono-fancy text-[10px] uppercase text-[color:var(--blue)]">
            what to do next
          </div>
          <ol className="mt-2 space-y-2 text-sm leading-6 text-[color:var(--ink)]">
            {nextActions.slice(0, 4).map((action, i) => (
              <li key={action} className="flex gap-2">
                <span className="font-mono-fancy text-[color:var(--muted)]">
                  {i + 1}.
                </span>
                <span>{action}</span>
              </li>
            ))}
          </ol>
        </div>

        {s.evidenceNote && (
          <div className="mt-4 rounded-lg border border-[color:var(--line)] bg-[color:var(--blue-soft)] px-3 py-2 text-xs leading-5 text-[color:var(--muted)]">
            {s.evidenceNote}
          </div>
        )}

        <div className="mt-4 border-t border-[color:var(--line)] pt-3 font-mono-fancy text-[10px] text-[color:var(--muted)]">
          ed25519 / key {receipt.signature.fingerprint}
        </div>
      </div>
    </article>
  );
}

function fallbackAuditTrail(receipt: TrustReceipt): NonNullable<TrustReceipt["body"]["auditTrail"]> {
  const s = receipt.body;
  const st = s.stats;
  return {
    promptExcerpt: null,
    changedFiles: [],
    evidenceSource: "none",
    commands: [],
    story: [
      "This receipt was created before detailed audit trails were added.",
      `${st.toolCalls} tool calls and ${st.edits} edits were recorded.`,
      `${st.verified} verified, ${st.contradicted} failed, ${st.unsupported} unproven.`,
      `Decision: ${fallbackDecision(s.trust, st).title}.`,
    ],
    privacyNote:
      "Prompt and command text is redacted and length-capped. The full raw transcript is not embedded in the receipt.",
  };
}

function fallbackDecision(
  trust: number,
  stats: TrustReceipt["body"]["stats"]
): NonNullable<TrustReceipt["body"]["decision"]> {
  if (stats.contradicted > 0) return { label: "do_not_merge", title: "Do not merge yet" };
  if (stats.unsupported > 0 || trust < 80) return { label: "verify_first", title: "Needs verification" };
  if (stats.edits === 0 && stats.verified + stats.contradicted + stats.unsupported === 0) {
    return { label: "no_evidence", title: "No code-work evidence" };
  }
  return { label: "ready", title: "Reviewable with evidence" };
}

function fallbackSummary(
  trust: number,
  stats: TrustReceipt["body"]["stats"]
): string {
  if (stats.contradicted > 0) {
    return `Trust ${trust}/100 because at least one claim or check failed against the available evidence.`;
  }
  if (stats.unsupported > 0) {
    return `Trust ${trust}/100 because some important checks or claims were not proven by the available evidence.`;
  }
  if (stats.verified > 0) {
    return `Trust ${trust}/100 with verified evidence and no observed failed or unproven claims.`;
  }
  return `Trust ${trust}/100 with limited evidence. Run AgentReceipt after a real coding-agent change for a stronger receipt.`;
}

function fallbackActions(stats: TrustReceipt["body"]["stats"]): string[] {
  if (stats.contradicted > 0) {
    return ["Fix the failed evidence, rerun the relevant command, then regenerate the receipt."];
  }
  if (stats.unsupported > 0) {
    return ["Run the missing checks after the latest edit, then regenerate the receipt."];
  }
  return [
    "Review the diff normally; AgentReceipt does not replace human code review.",
    "Keep the receipt with the PR so reviewers can inspect the evidence trail.",
  ];
}

function ContextLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[color:var(--line)] bg-[color:var(--bg)] px-2.5 py-2">
      <span className="font-semibold text-[color:var(--ink)]">{label}:</span>{" "}
      <span>{value}</span>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-[color:var(--line)] bg-[color:var(--bg)] px-3 py-2">
      <div className="font-display text-xl font-semibold">{value}</div>
      <div className="font-mono-fancy text-[10px] text-[color:var(--muted)]">
        {label}
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";

/** Copyable `npx agentreceipt` chip - click to copy. */
export function NpxChip({
  cmd = "npx agentreceipt",
  compact = false,
}: {
  cmd?: string;
  compact?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(cmd);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {
          /* ignore */
        }
      }}
      className={`group inline-flex items-center gap-2 rounded-lg border border-[color:var(--line)] bg-[color:var(--paper)] font-mono-fancy text-[color:var(--ink)] transition hover:border-[color:var(--blue)] ${
        compact ? "px-3 py-1.5 text-xs" : "px-4 py-2.5 text-sm"
      }`}
    >
      <span className="text-[color:var(--blue)]">$</span>
      <span>{cmd}</span>
      <span className="ml-1 text-xs text-[color:var(--muted)]">
        {copied ? "copied" : "copy"}
      </span>
    </button>
  );
}

"use client";

import { useEffect, useState } from "react";

/** Copyable `npx agentreceipt` chip - click to copy. */
export function NpxChip({
  cmd = "npx agentreceipt --web",
  compact = false,
  appendOrigin = false,
}: {
  cmd?: string;
  compact?: boolean;
  appendOrigin?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState("");
  const fullCmd = appendOrigin && origin ? `${cmd} ${origin}` : cmd;

  useEffect(() => {
    if (appendOrigin) setOrigin(window.location.origin);
  }, [appendOrigin]);

  return (
    <button
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(fullCmd);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {
          /* ignore */
        }
      }}
      className={`group inline-flex max-w-full items-center gap-2 rounded-lg border border-[color:var(--line)] bg-[color:var(--paper)] font-mono-fancy text-[color:var(--ink)] transition hover:border-[color:var(--blue)] ${
        compact ? "px-3 py-1.5 text-xs" : "px-4 py-2.5 text-sm"
      }`}
    >
      <span className="text-[color:var(--blue)]">$</span>
      <span className="min-w-0 break-all text-left">{fullCmd}</span>
      <span className="ml-1 text-xs text-[color:var(--muted)]">
        {copied ? "copied" : "copy"}
      </span>
    </button>
  );
}

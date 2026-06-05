"use client";

import { useState } from "react";

/** Copyable `npx agentreceipt` chip — click to copy. */
export function NpxChip({ cmd = "npx agentreceipt" }: { cmd?: string }) {
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
      className="group inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 font-mono text-sm text-white/90 backdrop-blur transition-colors hover:border-[#6ef2c6]/40"
    >
      <span className="text-[#6ef2c6]">$</span>
      <span>{cmd}</span>
      <span className="ml-1 text-xs text-white/40 group-hover:text-white/70">
        {copied ? "copied ✓" : "copy"}
      </span>
    </button>
  );
}

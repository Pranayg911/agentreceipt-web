"use client";

import { useState } from "react";

export function ShareButton({
  token,
  trust,
  archetype,
  contradicted,
}: {
  token: string;
  trust: number;
  archetype: string;
  contradicted: number;
}) {
  const [copied, setCopied] = useState(false);

  // Absolute URL from wherever this is served — correct on any domain.
  const url =
    typeof window !== "undefined" ? `${window.location.origin}/r/${token}` : `/r/${token}`;

  const text =
    contradicted > 0
      ? `AgentReceipt caught my AI agent lying — trust score ${trust}/100, "${archetype}". Verify it yourself:`
      : `My AI coding agent scored ${trust}/100 — "${archetype}". Signed + verifiable:`;

  function tweet() {
    const u = new URLSearchParams({ text, url });
    window.open(`https://twitter.com/intent/tweet?${u}`, "_blank", "noopener,noreferrer");
  }
  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <button
        onClick={tweet}
        className="soft-button rounded-lg px-4 py-2.5 text-sm font-semibold transition-transform active:scale-95"
      >
        Share on X
      </button>
      <button
        onClick={copy}
        className="rounded-lg border border-[color:var(--line)] bg-[color:var(--paper)] px-4 py-2.5 text-sm font-medium text-[color:var(--muted)] transition-colors hover:border-[color:var(--blue)] hover:text-[color:var(--ink)] active:scale-95"
      >
        {copied ? "Copied" : "Copy link"}
      </button>
    </div>
  );
}

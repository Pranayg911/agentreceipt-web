import type { TrustReceipt } from "@/lib/ar/receipt";

const STATUS = {
  verified: { icon: "✓", color: "text-ok", label: "verified" },
  contradicted: { icon: "✗", color: "text-bad", label: "contradicted" },
  unsupported: { icon: "~", color: "text-warn", label: "unproven" },
} as const;

function scoreColor(t: number): string {
  return t >= 80 ? "text-ok" : t >= 55 ? "text-warn" : "text-bad";
}

/** The shareable Trust Receipt card. Used on the landing sample and the
 *  public verify page. Pure presentational. */
export function ReceiptCard({
  receipt,
  verified,
}: {
  receipt: TrustReceipt;
  verified: boolean;
}) {
  const s = receipt.body;
  const st = s.stats;
  return (
    <div className="card-glow relative w-full max-w-md rounded-2xl border border-white/10 bg-[#0e1219]/90 p-6 font-mono backdrop-blur">
      <div className="absolute inset-x-0 top-0 h-px rounded-t-2xl bg-gradient-to-r from-transparent via-[#6ef2c6]/50 to-transparent" />
      <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-mut">
        <span>Agent Receipt</span>
        <span>{s.sessionId.slice(0, 8)} · {receipt.receiptId}</span>
      </div>

      <div className="mt-5 flex items-end gap-4">
        <div className={`text-6xl font-bold leading-none ${scoreColor(s.trust)}`}>
          {s.trust}
        </div>
        <div className="pb-1">
          <div className="text-[11px] uppercase tracking-widest text-mut">trust</div>
          <div className="text-lg font-bold text-white" style={{ fontFamily: "var(--font-sans)" }}>
            {s.archetype}
          </div>
        </div>
      </div>

      <div className="mt-5 space-y-2.5">
        {s.claims.length === 0 && (
          <div className="text-[12px] text-mut">No success claims found to check.</div>
        )}
        {s.claims.map((c, i) => {
          const m = STATUS[c.status];
          return (
            <div key={i} className="text-[12px] leading-snug">
              <div className="flex gap-2">
                <span className={`${m.color} font-bold`}>{m.icon}</span>
                <span className="text-white/90">
                  &ldquo;{c.claim.length > 90 ? c.claim.slice(0, 88) + "…" : c.claim}&rdquo;
                </span>
              </div>
              <div className="pl-5 text-[11px] text-mut">{c.evidence}</div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 border-t border-line pt-3 text-[11px] text-mut">
        <div>
          {st.toolCalls} tool calls · {st.edits} edits ·{" "}
          <span className="text-ok">{st.verified} verified</span> ·{" "}
          <span className="text-warn">{st.unsupported} unproven</span> ·{" "}
          <span className="text-bad">{st.contradicted} contradicted</span> · ~${st.approxCostUsd}
        </div>
        <div className="mt-1.5 flex items-center gap-1.5">
          <span className={verified ? "text-ok" : "text-bad"}>
            {verified ? "✓ ed25519 signed & verifiable" : "✗ signature invalid"}
          </span>
          <span className="text-mut/60">· key {receipt.signature.fingerprint}</span>
        </div>
      </div>
    </div>
  );
}

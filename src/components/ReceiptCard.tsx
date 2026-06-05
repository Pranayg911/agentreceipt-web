import type { TrustReceipt } from "@/lib/ar/receipt";

const STATUS = {
  verified: { label: "verified", tone: "text-[color:var(--green)]" },
  contradicted: { label: "failed", tone: "text-[color:var(--red)]" },
  unsupported: { label: "unproven", tone: "text-[color:var(--amber)]" },
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
              {s.sessionId.slice(0, 8)} / {receipt.receiptId}
            </div>
          </div>
          <span className="rounded-full border border-[color:var(--line)] bg-[color:var(--green-soft)] px-2.5 py-1 text-[11px] font-semibold text-[color:var(--green)]">
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

        <div className="mt-5 grid grid-cols-3 gap-2">
          <Stat label="verified" value={st.verified} />
          <Stat label="failed" value={st.contradicted} />
          <Stat label="gaps" value={st.unsupported} />
        </div>

        <div className="mt-5 space-y-2">
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

        <div className="mt-4 border-t border-[color:var(--line)] pt-3 font-mono-fancy text-[10px] text-[color:var(--muted)]">
          ed25519 / key {receipt.signature.fingerprint}
        </div>
      </div>
    </article>
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

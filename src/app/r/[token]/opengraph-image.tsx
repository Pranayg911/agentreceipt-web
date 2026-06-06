import { ImageResponse } from "next/og";
import { decodeReceipt } from "@/lib/token";

export const runtime = "nodejs";
export const contentType = "image/png";
export const size = { width: 1200, height: 630 };
export const alt = "AgentReceipt Trust Receipt";

// The shareable card image — what renders when a receipt link is posted on
// X / LinkedIn / Slack. Satori is strict: every element with >1 child MUST
// declare display:flex, and only Latin glyphs render without a font fetch.
// So: explicit flex on every container, ASCII-only, word tags (not ✓/✗).
const INK = "#0a0c10", PANEL = "#1a1f29", MUT = "#8b94a3", OK = "#33d17a", BAD = "#ff5c5c", WARN = "#ffb454", ACC = "#5cf2c0";

export default async function OG({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const r = decodeReceipt(token);

  if (!r) {
    return new ImageResponse(
      (
        <div style={{ height: "100%", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: INK, color: ACC, fontSize: 56, fontFamily: "monospace" }}>
          agentreceipt
        </div>
      ),
      size
    );
  }

  const s = r.body;
  const scoreColor = s.trust >= 80 ? OK : s.trust >= 55 ? WARN : BAD;
  const top = s.claims.slice(0, 3);
  const decision = s.decision?.title ?? s.archetype;
  const summary = s.summary ?? `${s.stats.verified} verified / ${s.stats.unsupported} gaps / ${s.stats.contradicted} failed`;
  const tag = (st: string) =>
    st === "verified" ? { t: "PASS", c: OK } : st === "contradicted" ? { t: "FAIL", c: BAD } : { t: "GAP", c: WARN };

  return new ImageResponse(
    (
      <div style={{ height: "100%", width: "100%", display: "flex", flexDirection: "column", padding: 64, background: INK, color: "#e8edf4", fontFamily: "monospace" }}>
        {/* top strip */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", color: MUT, fontSize: 22, letterSpacing: 3 }}>
          <div style={{ display: "flex" }}>AGENT RECEIPT</div>
          <div style={{ display: "flex" }}>{s.sessionId.slice(0, 8)} · {r.receiptId}</div>
        </div>

        {/* score + archetype */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: 28, marginTop: 36 }}>
          <div style={{ display: "flex", fontSize: 150, fontWeight: 700, lineHeight: 1, color: scoreColor }}>{s.trust}</div>
          <div style={{ display: "flex", flexDirection: "column", paddingBottom: 18 }}>
            <div style={{ display: "flex", fontSize: 20, color: MUT, letterSpacing: 4 }}>TRUST / 100</div>
            <div style={{ display: "flex", fontSize: 52, fontWeight: 700 }}>{decision}</div>
            <div style={{ display: "flex", marginTop: 10, fontSize: 24, color: MUT }}>{s.archetype}</div>
          </div>
        </div>

        <div style={{ display: "flex", marginTop: 26, fontSize: 25, lineHeight: 1.35, color: "#d5dce8" }}>
          {summary.length > 118 ? summary.slice(0, 116) + "…" : summary}
        </div>

        {/* claims */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 38 }}>
          {top.map((c, i) => {
            const g = tag(c.status);
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 25 }}>
                <div style={{ display: "flex", width: 130, color: g.c, fontWeight: 700 }}>{g.t}</div>
                <div style={{ display: "flex", color: "#e8edf4" }}>
                  {c.claim.length > 58 ? c.claim.slice(0, 56) + "…" : c.claim}
                </div>
              </div>
            );
          })}
        </div>

        {/* footer */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto", borderTop: `2px solid ${PANEL}`, paddingTop: 24, fontSize: 22 }}>
          <div style={{ display: "flex", gap: 16 }}>
            <div style={{ display: "flex", color: OK }}>{s.stats.verified} verified</div>
            <div style={{ display: "flex", color: WARN }}>{s.stats.unsupported} gaps</div>
            <div style={{ display: "flex", color: BAD }}>{s.stats.contradicted} failed</div>
          </div>
          <div style={{ display: "flex", color: ACC }}>ed25519 verified · agentreceipt</div>
        </div>
      </div>
    ),
    size
  );
}

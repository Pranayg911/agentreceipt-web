import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { decodeReceipt } from "@/lib/token";
import { verifyReceipt } from "@/lib/ar/receipt";
import { ReceiptCard } from "@/components/ReceiptCard";
import { ShareButton } from "@/components/ShareButton";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ token: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { token } = await params;
  const r = decodeReceipt(token);
  if (!r) return { title: "AgentReceipt" };
  const title = `Trust ${r.body.trust}/100 - ${r.body.archetype}`;
  return {
    title: `${title} - AgentReceipt`,
    description: `${r.body.stats.verified} claims verified, ${r.body.stats.contradicted} caught, ${r.body.stats.unsupported} unproven across ${r.body.stats.toolCalls} tool calls.`,
    openGraph: {
      title,
      type: "article",
      images: [`/r/${token}/opengraph-image`],
    },
    twitter: { card: "summary_large_image", title },
  };
}

export default async function ReceiptPage({ params }: Props) {
  const { token } = await params;
  const receipt = decodeReceipt(token);
  if (!receipt) return notFound();
  const { valid, reason } = verifyReceipt(receipt);

  return (
    <main className="page-in min-h-screen px-6 py-6">
      <nav className="mx-auto flex max-w-5xl items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-lg border border-[color:var(--line)] bg-[color:var(--paper)] font-mono-fancy text-[11px] font-bold text-[color:var(--blue)]">
            AR
          </span>
          <span className="font-display text-xl font-semibold">
            AgentReceipt
          </span>
        </Link>
        <Link
          href="/"
          className="rounded-lg border border-[color:var(--line)] bg-[color:var(--paper)] px-3 py-2 text-sm font-semibold text-[color:var(--ink)]"
        >
          Grade a session
        </Link>
      </nav>

      <section className="mx-auto grid max-w-5xl gap-8 py-14 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-center">
        <div className="mx-auto w-full max-w-md lg:mx-0">
          <ReceiptCard receipt={receipt} verified={valid} />
          <div className="mt-5">
            <ShareButton
              token={token}
              trust={receipt.body.trust}
              archetype={receipt.body.archetype}
              contradicted={receipt.body.stats.contradicted}
            />
          </div>
        </div>

        <aside className="paper-card rounded-2xl p-6">
          <div className="font-mono-fancy text-[10px] uppercase text-[color:var(--blue)]">
            verification
          </div>
          <h1 className="font-display mt-3 text-3xl font-semibold">
            {valid ? "Receipt verified." : "Receipt altered."}
          </h1>
          <p className="mt-4 text-sm leading-7 text-[color:var(--muted)]">
            {valid
              ? "The digest, public key fingerprint, and ed25519 signature match. Change a single claim or score and verification fails."
              : reason ?? "The receipt failed cryptographic verification."}
          </p>

          <div className="mt-6 space-y-2 font-mono-fancy text-[11px]">
            <Fact label="receipt" value={receipt.receiptId} />
            <Fact label="session" value={receipt.body.sessionId.slice(0, 12)} />
            <Fact label="key" value={receipt.signature.fingerprint} />
          </div>
        </aside>
      </section>
    </main>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-[color:var(--line)] bg-[color:var(--bg)] px-3 py-2">
      <span className="text-[color:var(--muted)]">{label}</span>
      <span className="truncate">{value}</span>
    </div>
  );
}

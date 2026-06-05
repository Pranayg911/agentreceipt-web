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
  const lie = r.body.stats.contradicted > 0;
  const title = lie
    ? `Trust ${r.body.trust}/100 — "${r.body.archetype}" (agent lie caught)`
    : `Trust ${r.body.trust}/100 — "${r.body.archetype}"`;
  return {
    title: `${title} · AgentReceipt`,
    description: `${r.body.stats.verified} claims verified, ${r.body.stats.contradicted} contradicted, ${r.body.stats.unsupported} unproven across ${r.body.stats.toolCalls} tool calls. ed25519-signed.`,
    openGraph: { title, type: "article", images: [`/r/${token}/opengraph-image`] },
    twitter: { card: "summary_large_image", title },
  };
}

export default async function ReceiptPage({ params }: Props) {
  const { token } = await params;
  const receipt = decodeReceipt(token);
  if (!receipt) return notFound();
  const { valid } = verifyReceipt(receipt);

  return (
    <main className="grid-bg flex min-h-screen flex-col items-center px-6 py-12">
      <Link href="/" className="font-mono text-sm font-bold tracking-tight">
        🧾 agent<span className="text-acc">receipt</span>
      </Link>

      <div className="mt-10">
        <ReceiptCard receipt={receipt} verified={valid} />
      </div>

      <div className="mt-6">
        <ShareButton
          token={token}
          trust={receipt.body.trust}
          archetype={receipt.body.archetype}
          contradicted={receipt.body.stats.contradicted}
        />
      </div>

      <div className="mt-4 max-w-md text-center text-xs text-mut">
        {valid ? (
          <>
            This receipt is <span className="text-ok">cryptographically verified</span>. Edit any
            number in the link and the signature breaks. The receipt lives entirely in the URL — no
            account, no server lookup.
          </>
        ) : (
          <span className="text-bad">
            This receipt failed verification — it was altered after signing.
          </span>
        )}
      </div>

      <Link
        href="/"
        className="mt-10 rounded-lg border border-line bg-panel px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:border-acc/50"
      >
        Grade your own session →
      </Link>
    </main>
  );
}

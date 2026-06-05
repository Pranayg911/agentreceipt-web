// POST /api/grade — accept a Claude Code / Cursor session transcript (raw
// JSONL text), grade it server-side (the private key never leaves the server),
// and return the signed receipt + a self-contained share token. We never store
// the raw transcript; only the receipt is encoded into the token the client
// shares.

import { NextResponse } from "next/server";
import { parseSessionText } from "@/lib/ar/parse";
import { analyze } from "@/lib/ar/analyze";
import { score } from "@/lib/ar/score";
import { buildReceipt, verifyReceipt } from "@/lib/ar/receipt";
import { encodeReceipt } from "@/lib/token";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BYTES = 12 * 1024 * 1024; // 12MB transcript cap

export async function POST(req: Request) {
  let raw = "";
  try {
    raw = await req.text();
  } catch {
    return NextResponse.json({ error: "could not read body" }, { status: 400 });
  }
  if (!raw || raw.length < 20) {
    return NextResponse.json(
      { error: "Empty or tiny transcript. Paste/drop a Claude Code .jsonl session." },
      { status: 400 }
    );
  }
  if (raw.length > MAX_BYTES) {
    return NextResponse.json({ error: "Transcript too large (12MB max)." }, { status: 413 });
  }

  const session = parseSessionText(raw);
  if (session.toolCalls.length === 0 && session.assistantText.length < 40) {
    return NextResponse.json(
      {
        error:
          "This doesn't look like a Claude Code / Cursor session transcript (no assistant turns or tool calls found).",
      },
      { status: 422 }
    );
  }

  const analysis = analyze(session);
  const receipt = buildReceipt(session, analysis, score(analysis), Date.now());
  const token = encodeReceipt(receipt);
  const valid = verifyReceipt(receipt).valid;

  return NextResponse.json({ ok: true, receipt, token, valid });
}

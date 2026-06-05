// Self-contained share tokens: the entire signed receipt is gzip-compressed
// and base64url-encoded into the URL. No database, no storage — the verify
// page decodes the receipt straight from the link and checks the ed25519
// signature against the public key embedded in the receipt itself. Links are
// permanent by construction and can never 404.

import { gzipSync, gunzipSync } from "node:zlib";
import type { TrustReceipt } from "./ar/receipt";

export function encodeReceipt(receipt: TrustReceipt): string {
  const json = Buffer.from(JSON.stringify(receipt), "utf8");
  return gzipSync(json, { level: 9 }).toString("base64url");
}

export function decodeReceipt(token: string): TrustReceipt | null {
  try {
    const buf = gunzipSync(Buffer.from(token, "base64url"));
    return JSON.parse(buf.toString("utf8")) as TrustReceipt;
  } catch {
    return null;
  }
}

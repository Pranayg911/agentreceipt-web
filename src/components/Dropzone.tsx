"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Drop or pick a Claude Code / Cursor session .jsonl. No signup. We POST the
 * raw text to /api/grade, get back a self-contained token, and route to the
 * public receipt page. The whole "paste-X-get-Y in seconds" loop.
 */
export function Dropzone() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [drag, setDrag] = useState(false);

  async function grade(text: string) {
    setBusy(true);
    setErr(null);
    try {
      const res = await fetch("/api/grade", { method: "POST", body: text });
      const data = await res.json();
      if (!res.ok) {
        setErr(data?.error ?? `Failed (${res.status})`);
        return;
      }
      router.push(`/r/${data.token}`);
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  async function onFiles(files: FileList | null) {
    const f = files?.[0];
    if (!f) return;
    const text = await f.text();
    await grade(text);
  }

  return (
    <div className="w-full max-w-md">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          void onFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={`cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-colors ${
          drag ? "border-acc bg-acc/5" : "border-line bg-panel/60 hover:border-acc/50"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".jsonl,.json,application/json"
          className="hidden"
          onChange={(e) => void onFiles(e.target.files)}
        />
        {busy ? (
          <div className="font-mono text-sm text-acc">grading session…</div>
        ) : (
          <>
            <div className="font-mono text-sm text-white">
              Drop your <span className="text-acc">session.jsonl</span> here
            </div>
            <div className="mt-1 text-xs text-mut">
              or click to choose · nothing is stored, the receipt lives in the link
            </div>
          </>
        )}
      </div>
      <div className="mt-3 text-center text-[11px] text-mut">
        Find it at{" "}
        <code className="rounded bg-panel px-1.5 py-0.5 text-acc">
          ~/.claude/projects/&lt;repo&gt;/&lt;id&gt;.jsonl
        </code>{" "}
        — or just run{" "}
        <code className="rounded bg-panel px-1.5 py-0.5 text-acc">npx agentreceipt</code>
      </div>
      {err && (
        <div className="mt-3 rounded-lg border border-bad/40 bg-bad/10 px-3 py-2 text-xs text-bad">
          {err}
        </div>
      )}
    </div>
  );
}

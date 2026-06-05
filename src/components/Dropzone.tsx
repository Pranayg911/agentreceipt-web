"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const MAX_BYTES = 12 * 1024 * 1024;
const FIND_LATEST_SESSION = "ls -t ~/.claude/projects/*/*.jsonl | head -1";

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} bytes`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function Dropzone() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [drag, setDrag] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [pasteOpen, setPasteOpen] = useState(false);
  const [pasted, setPasted] = useState("");
  const pastedBytes = useMemo(
    () => new TextEncoder().encode(pasted).byteLength,
    [pasted]
  );

  async function grade(text: string) {
    setBusy(true);
    setErr(null);
    try {
      const res = await fetch("/api/grade", {
        method: "POST",
        headers: { "Content-Type": "text/plain; charset=utf-8" },
        body: text,
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setErr(data?.error ?? `Failed to grade transcript (${res.status}).`);
        return;
      }
      if (!data?.token) {
        setErr("The grader returned no share token. Please try again.");
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
    if (!f || busy) return;
    setFileName(f.name);
    if (f.size > MAX_BYTES) {
      setErr("Transcript is too large. AgentReceipt accepts files up to 12MB.");
      return;
    }
    await grade(await f.text());
  }

  async function onPasteGrade() {
    if (busy) return;
    const raw = pasted.trim();
    if (!raw) {
      setErr("Paste your session.jsonl contents first.");
      return;
    }
    if (pastedBytes > MAX_BYTES) {
      setErr("Transcript is too large. AgentReceipt accepts text up to 12MB.");
      return;
    }
    setFileName("pasted session.jsonl");
    await grade(raw);
  }

  return (
    <div className="space-y-3">
      <div
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
        onDragOver={(e) => {
          e.preventDefault();
          if (!busy) setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          void onFiles(e.dataTransfer.files);
        }}
        onClick={() => !busy && inputRef.current?.click()}
        className={`paper-card cursor-pointer rounded-2xl p-4 transition ${
          drag ? "scale-[1.01]" : ""
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".jsonl,.json,application/json,text/plain"
          className="hidden"
          onChange={(e) => void onFiles(e.target.files)}
        />

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="font-mono-fancy text-[10px] uppercase text-[color:var(--blue)]">
              {busy ? "grading transcript" : "drop transcript"}
            </div>
            <div className="mt-1 text-base font-semibold text-[color:var(--ink)]">
              {busy
                ? "Building signed receipt..."
                : fileName
                  ? fileName
                  : "Upload session.jsonl"}
            </div>
            <div className="mt-1 text-sm text-[color:var(--muted)]">
              Nothing stored. The share link contains the signed receipt.
            </div>
          </div>

          <div className="soft-button rounded-lg px-4 py-2 text-sm font-semibold">
            {busy ? "Working" : "Choose file"}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-[color:var(--line)] bg-white/70 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="font-mono-fancy text-[10px] uppercase text-[color:var(--blue)]">
              find your session
            </div>
            <div className="mt-1 text-sm font-semibold text-[color:var(--ink)]">
              Upload the file, or paste the raw JSONL here.
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setPasteOpen((v) => !v);
              setErr(null);
            }}
            className="rounded-lg border border-[color:var(--line)] bg-[color:var(--paper)] px-3 py-2 text-sm font-semibold text-[color:var(--ink)] transition hover:border-[color:var(--blue)]"
          >
            {pasteOpen ? "Hide paste box" : "Paste instead"}
          </button>
        </div>

        <div className="mt-4 grid gap-2 text-xs leading-5 text-[color:var(--muted)]">
          <div>
            <span className="font-semibold text-[color:var(--ink)]">Finder:</span>{" "}
            press{" "}
            <code className="rounded bg-[color:var(--blue-soft)] px-1.5 py-0.5 font-mono-fancy text-[color:var(--blue)]">
              Cmd+Shift+G
            </code>{" "}
            and paste{" "}
            <code className="rounded bg-[color:var(--blue-soft)] px-1.5 py-0.5 font-mono-fancy text-[color:var(--blue)]">
              ~/.claude/projects
            </code>
            .
          </div>
          <div>
            <span className="font-semibold text-[color:var(--ink)]">Terminal:</span>{" "}
            <code className="rounded bg-[color:var(--blue-soft)] px-1.5 py-0.5 font-mono-fancy text-[color:var(--blue)]">
              {FIND_LATEST_SESSION}
            </code>
          </div>
        </div>

        {pasteOpen && (
          <div className="mt-4 space-y-3">
            <textarea
              value={pasted}
              onChange={(e) => {
                setPasted(e.target.value);
                if (err) setErr(null);
              }}
              spellCheck={false}
              placeholder='{"sessionId":"...","type":"assistant","message":{...}}'
              className="min-h-36 w-full resize-y rounded-xl border border-[color:var(--line)] bg-[color:var(--paper)] p-3 font-mono-fancy text-xs leading-5 text-[color:var(--ink)] outline-none transition focus:border-[color:var(--blue)]"
            />
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-xs text-[color:var(--muted)]">
                {pastedBytes > 0
                  ? `${formatBytes(pastedBytes)} pasted`
                  : "Paste one JSON object per line from session.jsonl."}
              </span>
              <button
                type="button"
                onClick={() => void onPasteGrade()}
                disabled={busy || !pasted.trim()}
                className="soft-button rounded-lg px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50"
              >
                {busy ? "Grading" : "Grade pasted session"}
              </button>
            </div>
          </div>
        )}
      </div>

      {err && (
        <div className="mt-3 rounded-lg border border-[color:var(--red)] bg-white/55 px-3 py-2 text-sm text-[color:var(--red)]">
          {err}
        </div>
      )}
    </div>
  );
}

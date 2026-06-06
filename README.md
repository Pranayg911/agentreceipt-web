# AgentReceipt Web

**The hosted receipt viewer and landing page for AgentReceipt.**

Live product: https://agentreceipt.vercel.app

Main product repo: https://github.com/Pranayg911/agentreceipt

This repo contains the Next.js web app. If you want the CLI, library, GitHub Action, analyzer, or core product README, use the main `agentreceipt` repo above.

## What This App Does

AgentReceipt Web makes AI-code verification understandable and shareable:

- Landing page that explains the product wedge clearly.
- Local-first CLI command copy flow for the strongest receipt path.
- Manual upload/paste fallback for Claude Code, Codex, and Cursor session artifacts.
- Signed receipt viewer at `/r/[token]`.
- Decision-oriented receipt UI: merge, verify first, stop, or no evidence.
- Human-readable audit trail: request excerpt, files changed, commands run, top issue, and decision.
- Exact next actions for reviewers and agent users.
- Open Graph receipt images for Slack, Twitter/X, LinkedIn, and GitHub previews.

## Product Model

AgentReceipt is not an LLM judge. The web app displays receipts produced from deterministic evidence:

- Agent transcript tool calls.
- Command outputs and exit codes.
- Edited files.
- Git/package context when generated through the CLI.
- Ed25519 signatures over the receipt body.

The useful output is not just a score. It is a signed review artifact with:

- `trust`: 0-100 confidence score.
- `decision`: what the reviewer should do now.
- `summary`: why the decision was made.
- `nextActions`: exact steps to improve or prove the work.
- `auditTrail`: redacted context showing what the user asked, which files changed, and which commands ran.
- `claims`: evidence rows with pass/fail/gap status.

## Privacy

The preferred flow is the CLI:

```bash
npx --yes github:Pranayg911/agentreceipt --web
```

That keeps raw transcripts on the user's machine and opens a self-contained signed receipt URL.

Manual upload/paste is a fallback. The API grades the submitted text and returns an encoded receipt token. The app does not store raw transcripts in a database.

## Routes

| Route | Purpose |
|---|---|
| `/` | Landing page, CLI command, upload/paste fallback |
| `/api/grade` | Grades raw session text and returns a signed receipt token |
| `/r/[token]` | Shareable receipt viewer |
| `/r/[token]/opengraph-image` | Dynamic social preview image |

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Production Build

```bash
npm run build
npm start
```

## Deployment

The production deployment is hosted on Vercel:

```bash
vercel deploy --prod
```

The canonical production URL is:

```text
https://agentreceipt.vercel.app
```

## Environment Variables

`AGENTRECEIPT_SIGNING_SEED` is optional but recommended in production so receipts are signed with a stable key across deployments.

```bash
AGENTRECEIPT_SIGNING_SEED="replace-with-a-long-random-secret"
```

If it is not set, the signer falls back to a generated local key. On serverless infrastructure that may be ephemeral, so production should use a stable seed.

## Repository Map

| Path | Purpose |
|---|---|
| `src/app/page.tsx` | Landing page and sample receipt |
| `src/components/ReceiptCard.tsx` | Main receipt UI |
| `src/components/Dropzone.tsx` | Upload/paste fallback UX |
| `src/app/api/grade/route.ts` | Server-side grading endpoint |
| `src/app/r/[token]/page.tsx` | Signed receipt page |
| `src/lib/ar/*` | Web copy of the analyzer/parser/signer logic |

## Important Note

The web app intentionally mirrors core analyzer code from the CLI repo right now so the hosted fallback can grade receipts without publishing a package first. Long term, this should move to a shared package from `agentreceipt` to avoid drift.

## Links

- Live app: https://agentreceipt.vercel.app
- Core repo: https://github.com/Pranayg911/agentreceipt
- Web repo: https://github.com/Pranayg911/agentreceipt-web

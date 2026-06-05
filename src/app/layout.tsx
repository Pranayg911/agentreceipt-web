import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AgentReceipt - signed proof your AI agent did the work",
  description:
    "Drop a Claude Code / Cursor session and get a signed Trust Receipt: a score, an archetype, and a cited verdict for every claim your agent made. Lies caught. ed25519-verifiable.",
  openGraph: {
    title: "AgentReceipt — the signed proof your AI agent actually did the work",
    description:
      "Catch your coding agent's lies. Drop a session, get a signed, shareable Trust Receipt in 15 seconds.",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Manrope:wght@400;500;600;700;800&display=swap"
        />
      </head>
      <body className="grain" style={{ fontFamily: "var(--font-sans)" }}>
        {children}
      </body>
    </html>
  );
}

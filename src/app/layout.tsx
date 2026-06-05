import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AgentReceipt - signed verification for AI-generated work",
  description:
    "Verify AI-generated code work with transcript, git, and command evidence. Catch failed checks, skipped verification, and unsupported claims in a signed Trust Receipt.",
  openGraph: {
    title: "AgentReceipt - signed verification for AI-generated work",
    description:
      "Audit AI agent work before you trust it: failed checks, skipped builds, missing migrations, and signed evidence.",
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

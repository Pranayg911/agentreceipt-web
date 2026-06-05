import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui"],
      },
      colors: {
        ink: "#101827",
        panel: "#ffffff",
        line: "#d7e0ea",
        mut: "#667085",
        ok: "#0f766e",
        bad: "#c2412d",
        warn: "#b7791f",
        acc: "#2563eb",
        cyan: "#0f766e",
      },
    },
  },
  plugins: [],
} satisfies Config;

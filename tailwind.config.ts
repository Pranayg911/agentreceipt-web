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
        ink: "#0a0c10",
        panel: "#11151c",
        line: "#1e242e",
        mut: "#8b94a3",
        ok: "#33d17a",
        bad: "#ff5c5c",
        warn: "#ffb454",
        acc: "#5cf2c0",
      },
    },
  },
  plugins: [],
} satisfies Config;

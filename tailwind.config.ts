import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: "var(--background)",
          elevated: "var(--background-elevated)",
        },
        foreground: {
          DEFAULT: "var(--foreground)",
          muted: "var(--foreground-muted)",
        },
        border: "var(--border)",
        accent: {
          DEFAULT: "var(--accent)",
          ink: "var(--accent-ink)",
          soft: "var(--accent-soft)",
        },
        teal: {
          DEFAULT: "var(--teal)",
          soft: "var(--teal-soft)",
        },
        navy: {
          DEFAULT: "var(--navy)",
          ink: "var(--navy-ink)",
          soft: "var(--navy-soft)",
          border: "var(--navy-border)",
        },
        warning: {
          DEFAULT: "var(--warning)",
          ink: "var(--warning-ink)",
          soft: "var(--warning-soft)",
        },
        success: {
          DEFAULT: "var(--success)",
          soft: "var(--success-soft)",
        },
        error: {
          DEFAULT: "var(--error)",
          ink: "var(--error-ink)",
          soft: "var(--error-soft)",
        },
      },
      fontFamily: {
        sans: ["var(--font-noto-serif-bengali)", "ui-serif", "system-ui", "serif"],
        display: ["var(--font-space-grotesk)", "ui-sans-serif", "system-ui", "sans-serif"],
        bangla: ["var(--font-noto-serif-bengali)", "ui-serif", "system-ui", "serif"],
      },
    },
  },
} satisfies Config;

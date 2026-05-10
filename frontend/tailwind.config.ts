import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#00ff88",
        "primary-dark": "#00cc6a",
        secondary: "#00d4ff",
        accent: "#ff00ff",
        background: "#0a0a0f",
        surface: "#12121a",
        "surface-elevated": "#1a1a24",
        border: "#2a2a3a",
        "border-light": "#3a3a4a",
        muted: "#6b7280",
        "text-primary": "#ffffff",
        "text-secondary": "#a0a0b0",
        success: "#00ff88",
        warning: "#ffaa00",
        error: "#ff4444",
        info: "#00d4ff",
      },
      fontFamily: {
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 20px rgba(0, 255, 136, 0.3)",
        "glow-blue": "0 0 20px rgba(0, 212, 255, 0.3)",
        "glow-error": "0 0 20px rgba(255, 68, 68, 0.3)",
      },
      animation: {
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "scan-line": "scan-line 3s linear infinite",
        "fade-in": "fade-in 0.3s ease-out",
        "slide-up": "slide-up 0.3s ease-out",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        "scan-line": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;

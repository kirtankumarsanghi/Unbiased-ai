import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",

  content: [
    "./index.html",

    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        background: "#0d1513",

        surface: "#19211f",

        "surface-light": "#232c29",

        primary: "#00dfc1",

        "primary-dim": "#26fedc",

        warning: "#ffd651",

        error: "#ffb4ab",

        text: "#dbe5e0",

        muted: "#b9cac4",

        border: "#3a4a46",
      },

      fontFamily: {
        sans: ["Space Grotesk", "sans-serif"],

        mono: ["IBM Plex Mono", "monospace"],
      },

      boxShadow: {
        glow:
          "0 0 8px rgba(0, 223, 193, 0.4)",

        "glow-lg":
          "0 0 16px rgba(0, 223, 193, 0.6)",
      },

      animation: {
        marquee:
          "marquee 20s linear infinite",

        glow:
          "glowPulse 2s infinite",
      },

      keyframes: {
        marquee: {
          "0%": {
            transform:
              "translateX(100%)",
          },

          "100%": {
            transform:
              "translateX(-100%)",
          },
        },

        glowPulse: {
          "0%": {
            boxShadow:
              "0 0 4px rgba(0,223,193,0.2)",
          },

          "50%": {
            boxShadow:
              "0 0 12px rgba(0,223,193,0.6)",
          },

          "100%": {
            boxShadow:
              "0 0 4px rgba(0,223,193,0.2)",
          },
        },
      },
    },
  },

  plugins: [],
};

export default config;
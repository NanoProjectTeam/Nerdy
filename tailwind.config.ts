import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        discord: {
          bgPrimary: "var(--bg-primary, #313338)",
          bgSecondary: "var(--bg-secondary, #2B2D31)",
          bgTertiary: "var(--bg-tertiary, #1E1F22)",
          bgFloating: "var(--bg-floating, #232428)",
          bgModifierHover: "var(--bg-hover, rgba(255,255,255,0.06))",
          bgModifierSelected: "var(--bg-selected, rgba(255,255,255,0.1))",
          input: "var(--bg-input, #383A40)",
          blurple: "#5865F2",
          blurpleHover: "#4752C4",
          green: "#23A55A",
          yellow: "#F0B232",
          red: "#F23F43",
          nitroPink: "#FF73FA",
          nitroPurple: "#A04CF8",
          nitroGold: "#FEE75C",
          textNormal: "#DBDEE1",
          textMuted: "#949BA4",
          textHeader: "#F2F3F5",
          textInteractive: "#B5BAC1",
        },
      },
      fontFamily: {
        sans: [
          "'gg sans'",
          "'Noto Sans'",
          "'Helvetica Neue'",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
      animation: {
        "spin-slow": "spin 8s linear infinite",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        "float": "float 3s ease-in-out infinite",
        "shimmer": "shimmer 2.5s infinite linear",
        "sparkle": "sparkle 1.8s ease-in-out infinite",
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { filter: "drop-shadow(0 0 10px rgba(160, 76, 248, 0.6))" },
          "50%": { filter: "drop-shadow(0 0 22px rgba(255, 115, 250, 0.9))" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        sparkle: {
          "0%, 100%": { opacity: "0.4", transform: "scale(0.95)" },
          "50%": { opacity: "1", transform: "scale(1.15)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;

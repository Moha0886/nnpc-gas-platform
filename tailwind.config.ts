import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#FAFAF7",
        ink: "#16211E",
        pine: {
          DEFAULT: "#0F4C42",
          deep: "#0A332C",
        },
        flare: "#D98E04",
        alert: "#B3402A",
        gasblue: "#2E6FA3",
        line: "#DCDAD2",
      },
      fontFamily: {
        sans: [
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        mono: [
          "IBM Plex Mono",
          "SF Mono",
          "Consolas",
          "monospace",
        ],
      },
      fontVariantNumeric: {
        tabular: "tabular-nums",
      },
    },
  },
  plugins: [],
};
export default config;

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
        // NNPC Branding Colors
        primary: {
          DEFAULT: "#00AD51",
          50: "#E6F7EF",
          100: "#CCEFDF",
          200: "#99DFBF",
          300: "#66CF9F",
          400: "#33BF7F",
          500: "#00AD51",
          600: "#008A41",
          700: "#006831",
          800: "#004521",
          900: "#002310",
        },
        secondary: {
          DEFAULT: "#00246B",
          50: "#E6EAF2",
          100: "#CCD5E5",
          200: "#99ABCB",
          300: "#6681B1",
          400: "#335797",
          500: "#00246B",
          600: "#001D56",
          700: "#001640",
          800: "#000E2B",
          900: "#000715",
        },
        accent: {
          DEFAULT: "#0D5EBA",
          50: "#E8F1FC",
          100: "#D1E3F9",
          200: "#A3C7F3",
          300: "#75ABED",
          400: "#478FE7",
          500: "#0D5EBA",
          600: "#0A4B95",
          700: "#083870",
          800: "#05254A",
          900: "#031225",
        },
        // Operational colors
        paper: "#FAFAF7",
        ink: "#16211E",
        flare: "#D98E04",
        alert: "#B3402A",
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

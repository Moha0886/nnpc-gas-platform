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
        // Operational colors - WCAG AA Compliant
        paper: "#FAFAF7",
        ink: "#16211E",
        flare: {
          DEFAULT: "#B87204",
          light: "#D98E04",
          dark: "#8B5503",
        },
        alert: {
          DEFAULT: "#8B2F1F",
          light: "#B3402A",
          dark: "#6B1F15",
        },
        success: {
          DEFAULT: "#00AD51",
          light: "#00C45E",
          dark: "#008A41",
        },
        line: "#DCDAD2",
        // Chart colors - Color-blind safe
        chart: {
          primary: "#0077BB",
          secondary: "#009988",
          tertiary: "#EE7733",
          quaternary: "#CC3311",
          neutral: "#DCDAD2",
          blue: "#0077BB",
          cyan: "#33BBEE",
          teal: "#009988",
          orange: "#EE7733",
          red: "#CC3311",
          magenta: "#EE3377",
        },
      },
      spacing: {
        'kpi': '24px',
        'section': '32px',
        'page': '48px',
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'md': '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        'lg': '0 10px 15px -3px rgb(0 0 0 / 0.1)',
        'xl': '0 20px 25px -5px rgb(0 0 0 / 0.1)',
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
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
export default config;

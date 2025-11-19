import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#fef2f2",
          100: "#fee2e2",
          200: "#fecaca",
          300: "#fca5a5",
          400: "#f87171",
          500: "#22c55e",
          600: "#22c55e",
          700: "#22c55e",
          800: "#22c55e",
          900: "#22c55e",
        },
        dark: {
          bg: "#0a0a0a",
          card: "#141414",
          border: "#262626",
          text: "#e5e5e5",
          muted: "#a3a3a3",
        },
      },
    },
  },
  plugins: [],
};

export default config;
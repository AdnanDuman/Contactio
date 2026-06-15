import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0b1220",
          soft: "#475467",
          muted: "#98a2b3",
        },
        brand: {
          50: "#eef4ff",
          100: "#dbe7ff",
          200: "#bfd3ff",
          300: "#93b4ff",
          400: "#608bff",
          500: "#3b66f5",
          600: "#2848e0",
          700: "#1f37b5",
          800: "#1f3290",
          900: "#1f2f73",
        },
        surface: {
          DEFAULT: "#ffffff",
          subtle: "#f8fafc",
          border: "#eaecf0",
        },
        accent: {
          mint: "#0fae8b",
          amber: "#f5a623",
          rose: "#f04438",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px 0 rgba(16,24,40,0.04), 0 1px 3px 0 rgba(16,24,40,0.06)",
        float: "0 12px 32px -12px rgba(16,24,40,0.18)",
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.125rem",
      },
    },
  },
  plugins: [],
};

export default config;

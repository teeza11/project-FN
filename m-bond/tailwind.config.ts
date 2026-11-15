import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#07181A",
        sidebar: "#0A1F1E",
        card: "#0E2624",
        line: "#173632",
        ink: "#E8F4F0",
        muted: "#8FAAA4",
        accent: "#2FE6A6",
        brand: "#0E7C5A",
        danger: "#F87171",
      },
      fontFamily: {
        sans: ["var(--font-thai)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        md: "834px",
        lg: "1200px",
      },
      keyframes: {
        "feature-icon-spin": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "feature-icon-spin": "feature-icon-spin 0.4s ease-in-out",
      },
      colors: {
        primary: "var(--color-primary)",
        "text-base": "var(--text-base)",
        "text-secondary": "var(--text-secondary)",
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
      },
    },
  },
  plugins: [],
};
export default config;

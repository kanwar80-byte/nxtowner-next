import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: "#020617",
          navyAlt: "#02081F",
          bg: "#F3F4F6",
          card: "#FFFFFF",
          border: "#E5E7EB",
          text: "#020617",
          muted: "#6B7280",
          green: "#16A34A",
          orange: "#EA580C",
        },
      },
    },
  },
  plugins: [],
};

export default config;

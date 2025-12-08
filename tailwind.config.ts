import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        nxt: {
          primary: "#0A1A2F",
          green: "#1DBF73",
          orange: "#FF7A45",
          surface: "#FFFFFF",
          bgSoft: "#F5F7FA",
        },
      },
    },
  },
  plugins: [],
};

export default config;

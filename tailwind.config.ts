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
        background: "#000000",
        card: "#1C1C1E",
        "card-hover": "#2C2C2E",
        primary: "#FFFFFF",
        secondary: "#8E8E93",
        accent: {
          orange: "#FF9F0A",
          blue: "#0A84FF",
          yellow: "#FFD60A",
          green: "#32D74B",
          "bright-green": "#00FF00",
        },
      },
      borderRadius: {
        "2xl": "16px",
      },
    },
  },
  plugins: [],
};

export default config;

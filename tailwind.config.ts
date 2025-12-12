import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
    },
    extend: {
      colors: {
        brand: {
          black: "#111",
          "off-black": "#1e1e1e",
          white: "#ffffff",
          "off-white": "#d1d1d1",
          green: "#25995b",
          "green-light": "#7adcaa",
          blue: "#587ea4",
        },
        neutral: {
          black: "#000000",
          darkest: "#111111",
          darker: "#222222",
          dark: "#444444",
          DEFAULT: "#666666",
          light: "#aaaaaa",
          lighter: "#cccccc",
          lightest: "#eeeeee",
          white: "#ffffff",
        },
      },
      fontFamily: {
        heading: ["Chakra Petch", "Verdana", "sans-serif"],
        body: ["Inter", "Arial", "sans-serif"],
        mono: ["Share Tech Mono", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;


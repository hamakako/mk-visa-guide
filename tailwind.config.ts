import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: "#170C79",
          sky: "#8ACBD0",
          teal: "#56B6C6",
          cream: "#EFE3CA",
          ink: "#171530",
        },
      },
      boxShadow: {
        soft: "0 20px 60px rgba(23, 12, 121, 0.10)",
        card: "0 8px 30px rgba(23, 12, 121, 0.08)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
    },
  },
  plugins: [],
};

export default config;

import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        neoYellow: "#FACC15",
        neoGreen: "#4ADE80",
        neoCyan: "#38BDF8",
        neoPink: "#F472B6",
        neoPurple: "#C084FC",
        neoOrange: "#FB923C",
        neoRed: "#F87171",
        neoDark: "#121212",
        neoDarkSurface: "#1E1E1E",
        neoLight: "#FAFAFA",
        neoLightSurface: "#FFFFFF",
      },
      boxShadow: {
        neo: "4px 4px 0px 0px #000000",
        neoWhite: "4px 4px 0px 0px #FFFFFF",
        neoLg: "6px 6px 0px 0px #000000",
        neoLgWhite: "6px 6px 0px 0px #FFFFFF",
        neoSm: "2px 2px 0px 0px #000000",
        neoSmWhite: "2px 2px 0px 0px #FFFFFF",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;

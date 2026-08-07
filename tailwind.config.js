/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0B0F14",
        panel: "#121821",
        panel2: "#1A222C",
        hair: "#232D38",
        fog: "#7C8894",
        paper: "#E8ECEF",
        yes: "#3DDC84",
        yesDim: "#1F5C3E",
        no: "#FF5C6C",
        noDim: "#63232B",
        amber: "#F0B429",
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"],
      },
    },
  },
  plugins: [],
};

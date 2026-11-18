/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        hpDark: "#080B12",
        hpCard: "#0F1624",
        hpCardHover: "#141D30",
        hpBorder: "#1E293B",
        hpBorderLight: "#334155",
        hpGreen: "#00E676",
        hpGreenMuted: "rgba(0, 230, 118, 0.12)",
        hpBlue: "#38BDF8",
        hpBlueMuted: "rgba(56, 189, 248, 0.12)",
        hpPurple: "#A78BFA",
        hpOrange: "#FB923C",
        hpText: "#E8EDF5",
        hpTextMuted: "#9AA3B8",
        hpTextDim: "#64748B",
      },
      fontFamily: {
        heading: ["Syne", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      boxShadow: {
        'glow-green': '0 0 25px -5px rgba(0, 230, 118, 0.25)',
        'glow-blue': '0 0 25px -5px rgba(56, 189, 248, 0.25)',
        'card': '0 10px 30px -10px rgba(0, 0, 0, 0.5)',
      },
      backgroundImage: {
        'grid-pattern': "radial-gradient(rgba(56, 189, 248, 0.08) 1px, transparent 1px)",
      }
    },
  },
  plugins: [],
};

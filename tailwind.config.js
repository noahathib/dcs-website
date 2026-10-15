/** @type {import('tailwindcss').Config} */
// Colors and fonts resolve to the CSS tokens in src/index.css so both themes stay in one place.
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        cement: { DEFAULT: "var(--cement)", 2: "var(--cement-2)", 3: "var(--cement-3)" },
        paper: "var(--paper)",
        ink: { DEFAULT: "var(--ink)", 2: "var(--ink-2)", 3: "var(--ink-3)" },
        oxide: { DEFAULT: "var(--oxide)", ink: "var(--oxide-ink)" },
        ochre: "var(--ochre)",
        tan: "var(--tan)",
        deep: { DEFAULT: "var(--deep)", 2: "var(--deep-2)" },
      },
      fontFamily: {
        display: "var(--font-display)",
        serif: "var(--font-serif)",
        mono: "var(--font-mono)",
      },
      maxWidth: { frame: "var(--frame)" },
    },
  },
  plugins: [],
};

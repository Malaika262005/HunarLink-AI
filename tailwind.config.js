/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{js,jsx}",
    "./src/components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ab ye colors theme ke hisaab se badlenge
        bg: "var(--bg)",
        surface: "var(--surface)",
        border: "var(--border)",
        text: "var(--text)",
        "text-muted": "var(--text-muted)",
        brand: {
          DEFAULT: "var(--brand)",
          dark: "var(--brand-dark)",
          light: "var(--brand-light)",
          contrast: "var(--brand-contrast)",
        },
      },
    },
  },
  plugins: [],
};
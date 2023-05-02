/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./components/**/*.{js,ts,jsx,tsx}', './pages/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'accent-1': '#333',
        "accent": "rgb(2, 175, 144)",
        "accent-transparent": "rgba(2, 175, 144, 0.2)",
        "accent-light": "rgb(209, 255, 238)",
        "accent-dark": "rgb(3, 121, 101)",
        "primary-dark": "rgb(32,33,35)",
        "base-dark": "rgb(52,53,65)",
        "dark-neutral": "rgb(68,70,84)",
        "dark-chat": "rgb(64,65,79)",
        // BRAND COLOURS FOR PROVIDER BUTTONS IN LOGIN
        "github-bg": "#333333",
        "github-fg": "#FFFFFF",
        "google-bg": "#FFFFFF",
        "google-fg": "#000000",
        "azure-bg": "#1C87C8",
        "azure-fg": "#FFFFFF",
      },
    },
  },
  variants: {},
  plugins: [],
}

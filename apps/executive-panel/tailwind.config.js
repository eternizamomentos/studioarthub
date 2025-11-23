/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pure: "#FFFFFF",
        gold: "#e3b341",
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"), // <-- AQUI!
  ],
}
/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./app/**/*.{js,ts,jsx,tsx,mdx}",
      "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    safelist: ['legal-body'], // 👈 adiciona isso aqui
    theme: {
      extend: {
        colors: {
          legalNavy: "#020617",
          legalGraphite: "#111318",
          legalGold: "#E7B75F",
        },
      },
    },
    plugins: [],
  };  
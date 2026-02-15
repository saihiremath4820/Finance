/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        barclays: {
          blue: "#00A9CE",
          red: "#DC2626",
          orange: "#EA580C",
          yellow: "#CA8A04",
          lightBlue: "#2563EB",
          green: "#16A34A",
          gray: "#4B5563",
        },
      },
    },
  },
  plugins: [],
}

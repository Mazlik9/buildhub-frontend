/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1d4ed8',     // основной синий для строй-тематики
          50: '#eff6ff',
          // ... можно добавить свои оттенки
        },
        construction: '#ca8a04',    // жёлтый как каска
      },
    },
  },
  plugins: [],
}
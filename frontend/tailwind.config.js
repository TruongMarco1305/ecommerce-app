/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bamboo: {
          50:  '#f5f0e8',
          100: '#e8dfc8',
          200: '#c9b98a',
          300: '#a8955e',
          400: '#8b6f47',
          500: '#4a7c59',
          600: '#3d6649',
          700: '#2d4a3e',
          800: '#1e3229',
          900: '#111e18',
        },
        sage:  '#7a9e7e',
        cream: '#f5f0e8',
        earth: '#8b6f47',
      },
      fontFamily: {
        heading: ['Playfair Display', 'serif'],
        body:    ['Nunito Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
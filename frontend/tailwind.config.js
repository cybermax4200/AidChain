/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#0066FF',
        secondary: '#00C9A7',
      },
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // <--- THIS IS KEY: It tells Tailwind to listen to your logic
  theme: {
    extend: {
      colors: {
        'app-purple': '#A445ED',
        'app-gray': '#757575',
        'app-black': '#050505',
        'app-dark-bg': '#1F1F1F',
        'app-dark-gray': '#2D2D2D',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Lora', 'serif'],
        mono: ['Inconsolata', 'monospace'],
      }
    },
  },
  plugins: [],
}
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ns-black': '#0a0a0a',
        'ns-dark': '#141414',
        'ns-dark-2': '#181818',
        'ns-dark-3': '#222222',
        'ns-red': '#e50914',
        'ns-red-hover': '#f40612',
        'ns-white': '#ffffff',
        'ns-gray-1': '#999999',
        'ns-gray-2': '#666666',
        'ns-gray-3': '#333333',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}

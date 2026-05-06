/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,ts}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef6ff',
          100: '#d9ebff',
          500: '#2f7ef7',
          600: '#1f66d1',
          900: '#14335f',
        },
      },
    },
  },
  plugins: [],
};

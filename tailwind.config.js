/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        blackGrain: '#231F20',
        eggShell: '#FDFBF7',
        logoBlue: '#5978E8',
        gray: '#707070',
        thinDarkGray: '#4D4D4D',
      },
      fontFamily: {
        'open-sans': ['Open Sans', 'sans-serif'],
        'source-sans': ['Source Sans 3', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

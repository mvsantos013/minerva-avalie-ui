module.exports = {
  purge: {
    enabled: process.env.NODE_ENV === 'production',
    content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
    options: {
      safelist: ['grid-cols-1', 'grid-cols-2', 'grid-cols-4'],
    },
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: {
          900: '#1f334a',
          800: '#506a87',
          700: '#204766',
          600: '#2a5b80',
          500: '#5482a5', // default
          400: '#5c88ab',
          300: '#6e99bc',
          200: '#b4d5fa',
          100: '#dedcdc',
          50: '#f2f2f2',
        },
      },
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
        serif: ['serif'],
      },
    },
  },
  variants: {},
}

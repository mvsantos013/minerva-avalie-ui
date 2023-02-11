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
          700: '#527ba8',
          600: '#608cbd',
          500: '#635c5c', // default
          400: '#7a7676',
          300: '#82b5ed',
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

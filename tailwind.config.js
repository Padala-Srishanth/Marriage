/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        burgundy: { DEFAULT: '#5B1025', deep: '#3A0816', night: '#22040D' },
        maroon: '#781E32',
        gold: { DEFAULT: '#C6A15B', light: '#EBD49C', ink: '#70500F' },
        ivory: '#FFF8EB',
        champagne: '#E9D7B5',
        forest: { DEFAULT: '#173C32', deep: '#0E2820', leaf: '#2C6A52' },
        ink: '#2E0B15',
      },
      fontFamily: {
        caps: ['Cinzel', 'Suranna', 'Georgia', 'serif'],
        serif: ['"Cormorant Garamond"', 'Suranna', 'Georgia', 'serif'],
        script: ['"Pinyon Script"', '"Cormorant Garamond"', 'Suranna', 'cursive'],
        telugu: ['Suranna', '"Noto Serif Telugu"', 'serif'],
        sans: ['Mulish', 'Mandali', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

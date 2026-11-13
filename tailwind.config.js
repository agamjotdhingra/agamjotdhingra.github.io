/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        editorial: ['"Newsreader"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        canvas: {
          DEFAULT: '#0a0a0c',
          raised: '#111215',
          hover: '#16181d',
        },
        border: {
          hairline: '#1c1e24',
          hover: '#2a2d36',
        },
      },
    },
  },
  plugins: [],
};


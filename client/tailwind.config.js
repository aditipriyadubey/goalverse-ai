/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        pitch: {
          DEFAULT: '#1B7A3D',
          dark: '#0F4D26',
          light: '#2E9950',
        },
        field: {
          white: '#F7FAF5',
        },
        fifa: {
          blue: '#0A3D91',
        },
        trophy: {
          gold: '#D8A72B',
          // WCAG AA-safe variant (4.57:1 on field-white) for gold TEXT on
          // light backgrounds. `trophy.gold` itself is 2.1:1 on field-white
          // and must stay decorative-only (borders/fills), never text.
          goldDark: '#8C6E1B',
        },
        cheer: {
          orange: '#F0722E',
          // WCAG AA-safe variant (4.75:1 with field-white) for button
          // backgrounds carrying white text. `cheer.orange` itself is only
          // 2.79:1 with white text and must stay decorative-only.
          orangeDark: '#B8501A',
        },
        penalty: {
          red: '#C8232A',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'Georgia', 'serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
        scoreboard: ['"Oswald"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        pitch: '1.25rem',
      },
      keyframes: {
        cheer: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
      },
      animation: {
        cheer: 'cheer 1.6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
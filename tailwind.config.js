export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: '#1A2B49',
        sky: {
          50: '#f4f9ff',
          100: '#e8f2ff',
          200: '#cfe3ff',
          300: '#a7cbff',
          400: '#70b0ff',
          500: '#4F92FF',
          600: '#3A7DE0',
          700: '#2f63b3',
          800: '#254e8d',
          900: '#213f72',
        },
        gold: {
          50: '#fff9e8',
          100: '#fff0bf',
          200: '#ffe08a',
          300: '#ffc94d',
          400: '#ffbf21',
          500: '#F3B000',
          600: '#d79200',
          700: '#a76f00',
          800: '#795200',
          900: '#4a3300',
        },
        brand: {
          sky: '#4F92FF',
          skyGlow: '#70C1FF',
          gold: '#F3B000',
          goldGlow: '#FFC72C',
          teal: '#5CB8B2',
          navy: '#1A2B49',
        },
      },
      fontFamily: {
        cantarell: ['Cantarell', 'sans-serif'],
        raleway: ['Raleway', 'sans-serif'],
        cookie: ['Cookie', 'cursive'],
      },
      animation: {
        'float-slow': 'float-slow 6s ease-in-out infinite',
        'float-fast': 'float-fast 3.5s ease-in-out infinite',
        'fade-up': 'fade-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) both',
        'soft-pulse': 'soft-pulse 2.4s ease-in-out infinite',
        drift: 'drift 8s ease-in-out infinite',
      },
      keyframes: {
        'float-slow': {
          '0%, 100%': { transform: 'translate3d(0, 0, 0)' },
          '50%': { transform: 'translate3d(0, -12px, 0)' },
        },
        'float-fast': {
          '0%, 100%': { transform: 'translate3d(0, 0, 0) scale(1)' },
          '50%': { transform: 'translate3d(0, -8px, 0) scale(1.02)' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translate3d(0, 24px, 0)' },
          '100%': { opacity: '1', transform: 'translate3d(0, 0, 0)' },
        },
        'soft-pulse': {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.95' },
          '50%': { transform: 'scale(1.04)', opacity: '1' },
        },
        drift: {
          '0%, 100%': { transform: 'translate3d(0, 0, 0) rotate(0deg)' },
          '50%': { transform: 'translate3d(8px, -10px, 0) rotate(2deg)' },
        },
      },
    },
  },
  plugins: [],
}

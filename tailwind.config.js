/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  safelist: [
    'animate-spin',
    'force-animation',
    'border-3',
    'text-blue-500',
    'text-yellow-400',
    'border-yellow-400',
    'text-gray-300',
    'dark:text-gray-600'
  ],
  theme: {
    extend: {
      fontFamily: {
        mulish: ['Mulish', 'sans-serif'],
      },
      colors: {
        gray: {
          900: '#121212',
          800: '#1E1E1E',
          700: '#2D2D2D',
          600: '#404040',
          400: '#A3A3A3',
          300: '#D4D4D4',
          100: '#F5F5F5',
        },
        blue: {
          500: '#3B82F6',
          600: '#2563EB',
          700: '#1D4ED8',
        },
        yellow: {
          400: '#FACC15',
        }
      },
      borderWidth: {
        '3': '3px',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        spin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        }
      },
      animation: {
        shimmer: 'shimmer 3s ease-in-out infinite',
        spin: 'spin 1s linear infinite'
      },
    },
  },
  plugins: [],
};

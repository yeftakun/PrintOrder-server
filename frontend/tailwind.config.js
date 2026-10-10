/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx}', './public/index.html'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Plus Jakarta Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'SF Mono', 'Menlo', 'monospace'],
      },
      colors: {
        brand: {
          teal: '#0D9488',
          tealDark: '#0F766E',
          tealLight: '#CCFBF1',
          cyan: '#0284C7',
          cyanLight: '#E0F2FE',
          emerald: '#059669',
        },
      },
      backgroundImage: {
        'gradient-action': 'linear-gradient(135deg, #0D9488 0%, #0284C7 100%)',
        'gradient-subtle': 'linear-gradient(180deg, #F0FDFA 0%, #F8FAFC 100%)',
      },
      keyframes: {
        laser: {
          '0%,100%': { transform: 'translateY(-100%)' },
          '50%': { transform: 'translateY(100%)' },
        },
        'fade-in': {
          from: { opacity: 0, transform: 'translateY(6px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        pulseDot: {
          '0%,100%': { opacity: 1 },
          '50%': { opacity: 0.3 },
        },
      },
      animation: {
        laser: 'laser 2.2s ease-in-out infinite',
        'fade-in': 'fade-in 300ms ease-out both',
        pulseDot: 'pulseDot 1.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

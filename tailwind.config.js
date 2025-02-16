/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#0B1121',
          800: '#1A2333',
          700: '#2A3447',
          600: '#3B475C'
        },
        neon: {
          red: '#FF3366',
          blue: '#00FFFF',
          green: '#39FF14',
          purple: '#FF00FF'
        }
      },
      animation: {
        'pulse-glow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        float: 'floating 3s ease-in-out infinite'
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
};
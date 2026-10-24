/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FFFFFF',
          100: '#FDFBF7',
          200: '#F6F2EA',
          300: '#ECE5D8',
          400: '#DFD4C2',
        },
        sage: {
          50: '#F2F6F4',
          100: '#E1ECE6',
          200: '#C4D9CF',
          300: '#A4C3B4',
          400: '#8FB0A0',
          500: '#7A9A8B', // Brand Primary
          600: '#628172',
          700: '#4D685B',
          800: '#3A4F45',
          900: '#27362F',
        },
        terracotta: {
          50: '#FDF6F3',
          100: '#FAECE6',
          200: '#F5D7CC',
          300: '#EBB9A7',
          400: '#E29980',
          500: '#D97757', // Brand Warm Highlight
          600: '#C25B39',
          700: '#9E4426',
          800: '#7F361E',
          900: '#642B18',
        },
        emergency: {
          light: '#FEE2E2',
          base: '#DC2626', // Brand Emergency Red
          dark: '#B91C1C',
          glow: 'rgba(220, 38, 38, 0.4)',
        },
        slate: {
          900: '#111827',
          800: '#1F2937', // Brand Dark Text
          700: '#374151',
          600: '#4B5563',
          500: '#6B7280',
          400: '#9CA3AF',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(122, 154, 139, 0.12)',
        'glow-sage': '0 0 25px rgba(122, 154, 139, 0.35)',
        'glow-terracotta': '0 0 25px rgba(217, 119, 87, 0.35)',
        'glow-emergency': '0 0 30px rgba(220, 38, 38, 0.55)',
        'card': '0 10px 30px -5px rgba(31, 41, 55, 0.05)',
      },
      animation: {
        'pulse-fast': 'pulse 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'subtle-float': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}

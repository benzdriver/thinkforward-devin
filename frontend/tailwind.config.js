/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': {
          DEFAULT: '#2563EB',
          '50': '#EFF6FF',
          '100': '#DBEAFE',
          '200': '#BFDBFE',
          '300': '#93C5FD',
          '400': '#60A5FA',
          '500': '#3B82F6',
          '600': '#2563EB',
          '700': '#1D4ED8',
          '800': '#1E40AF',
          '900': '#1E3A8A',
        },
        'secondary': {
          DEFAULT: '#64748B',
          '50': '#F8FAFC',
          '100': '#F1F5F9',
          '200': '#E2E8F0',
          '300': '#CBD5E1',
          '400': '#94A3B8',
          '500': '#64748B',
          '600': '#475569',
          '700': '#334155',
          '800': '#1E293B',
          '900': '#0F172A',
        },
        'destructive': {
          DEFAULT: '#EF4444',
          '50': '#FEF2F2',
          '100': '#FEE2E2',
          '200': '#FECACA',
          '300': '#FCA5A5',
          '400': '#F87171',
          '500': '#EF4444',
          '600': '#DC2626',
          '700': '#B91C1C',
          '800': '#991B1B',
          '900': '#7F1D1D',
        },
        'foreground': '#0F172A',
        'background': '#FFFFFF',
        'light-gray': '#F1F5F9',
        'dark-gray': '#64748B',
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
      }
    },
  },
  plugins: [],
}

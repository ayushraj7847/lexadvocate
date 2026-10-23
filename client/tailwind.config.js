/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#163A70',
          dark: '#0F274E',
          light: '#1E4E96',
          900: '#0B1E3B',
          800: '#112D57',
          700: '#163A70',
          600: '#1E4E96',
          500: '#2A5EA9',
          100: '#E6EDF7',
          50: '#F0F4FA',
        },
        primary: {
          DEFAULT: '#2563EB',
          dark: '#1D4ED8',
          light: '#3B82F6',
          hover: '#1D4ED8',
          50: '#EFF6FF',
          100: '#DBEAFE',
          200: '#BFDBFE',
          600: '#2563EB',
          700: '#1D4ED8',
        },
        success: '#16A34A',
        background: '#FFFFFF',
        surface: '#F3F6FB',
        border: '#E2E8F0',
        text: {
          primary: '#1F2937',
          secondary: '#64748B',
          muted: '#94A3B8',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      boxShadow: {
        subtle: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        card: '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 10px 25px -5px rgba(22, 58, 112, 0.08), 0 8px 10px -6px rgba(22, 58, 112, 0.04)',
        modal: '0 20px 60px rgba(15, 39, 78, 0.22)',
      },
    },
  },
  plugins: [],
}

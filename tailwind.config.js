/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0px 4px 12px -2px rgba(0, 0, 0, 0.04), 0px 1px 3px 0px rgba(0, 0, 0, 0.06)',
        focus: '0 0 0 1px #2663eb, 0 0 4px 0 rgba(38, 99, 235, 0.25)',
      },
      colors: {
        canvas: '#f3f4f6',
        ink: '#111827',
        muted: '#646b79',
        faint: '#6b7280',
        line: '#d1d5db',
        accent: '#057a70',
        'accent-bar': '#058c80',
        selected: '#ebf7f5',
        focus: '#2663eb',
        danger: '#b81c1c',
        skeleton: '#e5e8ed',
      },
    },
  },
  plugins: [],
}

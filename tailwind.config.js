/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dcore: {
          red: '#9b111e',
          'red-hover': '#7f0d18',
          'red-light': '#fdf2f2',
          'red-border': '#f8717120',
          maroon: '#6b0912',
          dark: '#0f172a',
          charcoal: '#334155',
          muted: '#64748b',
          surface: '#f8fafc',
          card: '#ffffff',
          border: '#e2e8f0'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Monaco', 'monospace']
      },
      boxShadow: {
        'soft': '0 2px 10px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.02)',
        'card': '0 4px 20px -2px rgba(155, 17, 30, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        'hover': '0 12px 28px -4px rgba(155, 17, 30, 0.12), 0 4px 10px -2px rgba(0, 0, 0, 0.06)',
        'red-glow': '0 0 20px rgba(155, 17, 30, 0.25)',
        'drawer': '-10px 0 30px rgba(0, 0, 0, 0.08)'
      },
      keyframes: {
        'pulse-subtle': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.6 }
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' }
        }
      },
      animation: {
        'pulse-subtle': 'pulse-subtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 4s ease-in-out infinite'
      }
    },
  },
  plugins: [],
}

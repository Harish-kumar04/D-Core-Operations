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
          red: '#E42129',
          'red-hover': '#c81920',
          'red-light': '#fff1f2',
          'red-border': '#fee2e2',
          black: '#111111',
          dark: '#333333',
          muted: '#666666',
          surface: '#f5f5f5',
          card: '#ffffff',
          border: '#e8e8e8'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Monaco', 'monospace']
      },
      boxShadow: {
        'soft': '0 2px 10px rgba(0, 0, 0, 0.03), 0 1px 3px rgba(0, 0, 0, 0.02)',
        'card': '0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.02)',
        'hover': '0 12px 28px -4px rgba(228, 33, 41, 0.12), 0 4px 10px -2px rgba(0, 0, 0, 0.04)',
        'red-glow': '0 0 20px rgba(228, 33, 41, 0.2)',
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

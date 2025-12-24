/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Modern light theme for ID photo website
        'primary': '#2563eb',
        'primary-dark': '#1d4ed8',
        'primary-light': '#3b82f6',
        'secondary': '#64748b',
        'accent': '#f59e0b',
        'success': '#10b981',
        'warning': '#f59e0b',
        'error': '#ef4444',
        'background': '#ffffff',
        'surface': '#f8fafc',
        'surface-hover': '#f1f5f9',
        'text-primary': '#1e293b',
        'text-secondary': '#64748b',
        'text-muted': '#94a3b8',
        'border': '#e2e8f0',
        'border-focus': '#cbd5e1',
        'shadow': 'rgba(0, 0, 0, 0.1)',
        'shadow-lg': 'rgba(0, 0, 0, 0.15)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

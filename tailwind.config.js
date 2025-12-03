/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 개선된 네온 느와르 테마
        'neon-bg': '#0a0e27',
        'neon-bg-light': '#141829',
        'neon-primary': '#00d9ff',
        'neon-primary-dark': '#00b8d9',
        'neon-accent': '#ff006e',
        'neon-accent-light': '#ff4d9a',
        'neon-dark': '#050813',
        'neon-card': 'rgba(20, 24, 41, 0.8)',
        'neon-border': 'rgba(0, 217, 255, 0.2)',
      },
      boxShadow: {
        'neon-sm': '0 0 15px rgba(0, 217, 255, 0.2), 0 0 30px rgba(0, 217, 255, 0.1)',
        'neon-md': '0 0 25px rgba(0, 217, 255, 0.3), 0 0 50px rgba(0, 217, 255, 0.15)',
        'neon-lg': '0 0 40px rgba(0, 217, 255, 0.4), 0 0 80px rgba(0, 217, 255, 0.2)',
        'neon-accent-sm': '0 0 15px rgba(255, 0, 110, 0.2), 0 0 30px rgba(255, 0, 110, 0.1)',
        'neon-accent-md': '0 0 25px rgba(255, 0, 110, 0.3), 0 0 50px rgba(255, 0, 110, 0.15)',
        'neon-accent-lg': '0 0 40px rgba(255, 0, 110, 0.4), 0 0 80px rgba(255, 0, 110, 0.2)',
        'card': '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 1px rgba(0, 217, 255, 0.1)',
        'card-hover': '0 12px 48px rgba(0, 0, 0, 0.5), 0 0 2px rgba(0, 217, 255, 0.2)',
      },
      backgroundImage: {
        'gradient-neon': 'linear-gradient(135deg, rgba(0, 217, 255, 0.1) 0%, rgba(255, 0, 110, 0.1) 100%)',
        'gradient-primary': 'linear-gradient(135deg, #00d9ff 0%, #00b8d9 100%)',
        'gradient-accent': 'linear-gradient(135deg, #ff006e 0%, #ff4d9a 100%)',
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'pulse-glow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}


/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Pretendard', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      colors: {
        // Aurora Holographic Theme
        'aurora-bg': '#030014', // Deep Space
        'aurora-bg-light': '#0a0a2e',
        'aurora-primary': '#4facfe', // Soft Blue
        'aurora-secondary': '#00f2fe', // Cyan
        'aurora-accent': '#ff0080', // Pink
        'aurora-purple': '#7928ca', // Rich Purple
        'aurora-card': 'rgba(255, 255, 255, 0.03)', // Crystal clear glass
        'aurora-border': 'rgba(255, 255, 255, 0.08)',
      },
      boxShadow: {
        'glow-sm': '0 0 10px rgba(79, 172, 254, 0.3)',
        'glow-md': '0 0 20px rgba(121, 40, 202, 0.3)',
        'glow-lg': '0 0 40px rgba(0, 242, 254, 0.2), 0 0 80px rgba(255, 0, 128, 0.1)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glass-hover': '0 8px 32px 0 rgba(31, 38, 135, 0.37), inset 0 0 0 1px rgba(255, 255, 255, 0.1)',
      },
      backgroundImage: {
        'gradient-aurora': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', // Blue to Cyan
        'gradient-cosmic': 'linear-gradient(135deg, #7928ca 0%, #ff0080 100%)', // Purple to Pink
        'gradient-text': 'linear-gradient(to right, #4facfe 0%, #00f2fe 50%, #ff0080 100%)',
      },
      animation: {
        'aurora': 'aurora 20s linear infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'pulse-soft': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        aurora: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-15px)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [],
}

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in':    'fadeIn 0.4s ease both',
        'slide-up':   'slideUp 0.45s cubic-bezier(0.34,1.56,0.64,1) both',
        'slide-down': 'slideDown 0.3s ease both',
        'scale-in':   'scaleIn 0.3s cubic-bezier(0.34,1.56,0.64,1) both',
        'float':      'float 3s ease-in-out infinite',
        'spin-slow':  'spin 3s linear infinite',
      },
      keyframes: {
        fadeIn:    { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp:   { from: { opacity: '0', transform: 'translateY(20px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        slideDown: { from: { opacity: '0', transform: 'translateY(-12px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        scaleIn:   { from: { opacity: '0', transform: 'scale(0.94)' }, to: { opacity: '1', transform: 'scale(1)' } },
        float:     { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-6px)' } },
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        'gradient-text':  'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
      },
      boxShadow: {
        'brand': '0 4px 14px 0 rgba(99,102,241,0.40)',
        'brand-md': '0 6px 20px 0 rgba(99,102,241,0.45)',
      },
    },
  },
  plugins: [],
};

export default config;

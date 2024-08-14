import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      animation: {
        shimmer: "shimmer 2s linear infinite",
        'fade-in': 'fadeIn 3s ease-out',
        'fade-in-delay': 'fadeIn 3s ease-out 0.5s',
        'bounce': 'bounce 1s infinite',
      },
      backgroundImage: {
        'gradient-dark': 'linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(102,102,194,1) 35%, rgba(0,212,255,1) 100%)',
        'hero-gradient': 'linear-gradient(150deg, rgba(21,89,152,1) 0%, rgba(0,0,0,0.8) 40%)',
      },
      keyframes: {
        shimmer: {
          from: {
            backgroundPosition: "0 0",
          },
          to: {
            backgroundPosition: "-200% 0",
          },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        bounce: {
          '0%, 100%': { transform: 'translateY(-25%)', animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)' },
          '50%': { transform: 'translateY(0)', animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ["class"],
  theme: {
  	extend: {
  		animation: {
  			shimmer: 'shimmer 2s linear infinite',
  			'fade-in': 'fadeIn 3s ease-out',
  			'fade-in-delay': 'fadeIn 3s ease-out 0.5s',
  			bounce: 'bounce 1s infinite',
  			float: 'float 6s ease-in-out infinite',
  			glow: 'glow 2s ease-in-out infinite alternate',
  			'slide-up': 'slideUp 0.8s ease-out',
  			'slide-in-left': 'slideInLeft 0.8s ease-out',
  			aurora: 'aurora 20s ease-in-out infinite',
  			'aurora-slow': 'aurora-slow 30s ease-in-out infinite'
  		},
  		backgroundImage: {
  			'gradient-dark': 'linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(102,102,194,1) 35%, rgba(0,212,255,1) 100%)',
  			'hero-gradient': 'linear-gradient(150deg, rgba(21,89,152,1) 0%, rgba(0,0,0,0.8) 40%)',
  			'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
  			'card-gradient': 'linear-gradient(145deg, rgba(30, 41, 59, 0.8), rgba(51, 65, 85, 0.6))',
  			'aurora-gradient': 'linear-gradient(45deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1), rgba(236, 72, 153, 0.1))',
  			'aurora-animated': 'linear-gradient(-45deg, rgba(59, 130, 246, 0.05), rgba(139, 92, 246, 0.08), rgba(236, 72, 153, 0.06), rgba(16, 185, 129, 0.05))',
  			'skill-gradient': 'linear-gradient(90deg, rgba(59, 130, 246, 0.8), rgba(139, 92, 246, 0.6))',
  			'project-gradient': 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(59, 130, 246, 0.1))'
  		},
  		keyframes: {
  			shimmer: {
  				from: {
  					backgroundPosition: '0 0'
  				},
  				to: {
  					backgroundPosition: '-200% 0'
  				}
  			},
  			fadeIn: {
  				'0%': {
  					opacity: '0'
  				},
  				'100%': {
  					opacity: '1'
  				}
  			},
  			bounce: {
  				'0%, 100%': {
  					transform: 'translateY(-25%)',
  					animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)'
  				},
  				'50%': {
  					transform: 'translateY(0)',
  					animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)'
  				}
  			},
  			float: {
  				'0%, 100%': {
  					transform: 'translateY(0px)'
  				},
  				'50%': {
  					transform: 'translateY(-10px)'
  				}
  			},
  			glow: {
  				'0%': {
  					boxShadow: '0 0 20px rgba(59, 130, 246, 0.3)'
  				},
  				'100%': {
  					boxShadow: '0 0 30px rgba(59, 130, 246, 0.6)'
  				}
  			},
  			slideUp: {
  				'0%': {
  					opacity: '0',
  					transform: 'translateY(30px)'
  				},
  				'100%': {
  					opacity: '1',
  					transform: 'translateY(0)'
  				}
  			},
  			slideInLeft: {
  				'0%': {
  					opacity: '0',
  					transform: 'translateX(-30px)'
  				},
  				'100%': {
  					opacity: '1',
  					transform: 'translateX(0)'
  				}
  			},
  			aurora: {
  				'0%, 100%': {
  					backgroundPosition: '0% 50%',
  					backgroundSize: '200% 200%'
  				},
  				'50%': {
  					backgroundPosition: '100% 50%',
  					backgroundSize: '250% 250%'
  				}
  			},
  			'aurora-slow': {
  				'0%, 100%': {
  					transform: 'rotate(0deg) scale(1)',
  					opacity: '0.3'
  				},
  				'33%': {
  					transform: 'rotate(120deg) scale(1.1)',
  					opacity: '0.5'
  				},
  				'66%': {
  					transform: 'rotate(240deg) scale(0.9)',
  					opacity: '0.4'
  				}
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
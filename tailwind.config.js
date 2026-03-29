/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        foursys: {
          // === PRIMARY ORANGE (Foursys Brand) ===
          primary: '#FF6600',
          'primary-light': '#FF7A00',
          'primary-dark': '#E55C00',
          // === SECONDARY TECH ACCENT ===
          cyan: '#00C2E0',
          'cyan-light': '#40D4ED',
          // === DARK BACKGROUNDS (CheckIn v2.0) ===
          dark: '#060B14',         // sidebar/nav — quase preto
          'dark-2': '#0C1021',     // ⭐ fundo principal
          'dark-3': '#161D2E',     // ⭐ surface cards
          'dark-4': '#1E2A3A',     // surface raised/hover
          surface: '#161D2E',
          'surface-2': '#1E2A3A',
          // === TEXTO ===
          text: '#FFFFFF',
          'text-muted': '#94A3B8',
          'text-dim': '#8293A7',
          // === FEEDBACK ===
          accent: '#FFB800',       // amber — destaque secundário
          success: '#4ADE80',
          warning: '#FBBF24',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-foursys': 'linear-gradient(135deg, #FF6600 0%, #FF7A00 100%)',
        'gradient-dark': 'linear-gradient(135deg, #060B14 0%, #1E2A3A 100%)',
        'gradient-orange-glow': 'radial-gradient(ellipse at top, rgba(255,102,0,0.15) 0%, transparent 60%)',
      },
      animation: {
        'count-up':    'countUp 2s ease-out forwards',
        'pulse-slow':  'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float':       'float 6s ease-in-out infinite',
        'shimmer':     'shimmer 2s linear infinite',
        'flame-sway':  'flameSway 3s ease-in-out infinite alternate',
        'flame-inner': 'flameInner 2s ease-in-out infinite alternate',
        'flame-glow':  'flameGlow 4s ease-in-out infinite alternate',
        'ray-fade':    'rayFade 3s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        flameSway: {
          '0%':   { transform: 'translateX(-50%) scaleX(1)   scaleY(1)',    opacity: '0.9' },
          '33%':  { transform: 'translateX(-48%) scaleX(0.96) scaleY(1.02)', opacity: '1'   },
          '66%':  { transform: 'translateX(-52%) scaleX(1.04) scaleY(0.98)', opacity: '0.85' },
          '100%': { transform: 'translateX(-50%) scaleX(0.97) scaleY(1.01)', opacity: '0.95' },
        },
        flameInner: {
          '0%':   { transform: 'translateX(-50%) scaleX(1)    scaleY(1)',    opacity: '1'   },
          '50%':  { transform: 'translateX(-49%) scaleX(0.94) scaleY(1.04)', opacity: '0.8' },
          '100%': { transform: 'translateX(-51%) scaleX(1.06) scaleY(0.97)', opacity: '0.9' },
        },
        flameGlow: {
          '0%':   { opacity: '0.4', transform: 'scale(1)'   },
          '100%': { opacity: '0.7', transform: 'scale(1.15)' },
        },
        rayFade: {
          '0%':   { opacity: '0.08' },
          '100%': { opacity: '0.18' },
        },
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}

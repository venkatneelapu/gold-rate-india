/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public/index.html",
    "./src/**/*.{js,jsx}"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#fffef0',
          100: '#fffab8',
          200: '#fff47a',
          300: '#fde047',
          400: '#eab308',
          500: '#ca8a04',
          600: '#a16207',
          700: '#854d0e',
          800: '#713f12',
          900: '#422006',
        },
        bullion: {
          gold: '#D4AF37',
          lightGold: '#FFD700',
          darkGold: '#AA771C',
          metallic: '#C5A059',
          roseGold: '#B76E79',
          obsidian: '#0B0F19',
          charcoal: '#111827',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        display: ['"Outfit"', 'sans-serif'],
        cinzel: ['"Cinzel"', 'serif'],
      },
      boxShadow: {
        'gold-glow': '0 0 35px -5px rgba(212, 175, 55, 0.35)',
        'gold-glow-lg': '0 0 50px -10px rgba(212, 175, 55, 0.45)',
        'card-glow': '0 8px 30px -4px rgba(0, 0, 0, 0.08), 0 4px 10px -2px rgba(0, 0, 0, 0.04)',
        'dark-card': '0 10px 40px -10px rgba(0, 0, 0, 0.7)',
        'inner-gold': 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.2), inset 0 -1px 1px 0 rgba(0, 0, 0, 0.2)'
      },
      backgroundImage: {
        'gold-metallic': 'linear-gradient(135deg, #ECC874 0%, #C5A059 40%, #E3BC67 70%, #9F7A34 100%)',
        'gold-metallic-hover': 'linear-gradient(135deg, #F3D385 0%, #D4AF67 40%, #E9C676 70%, #AB843B 100%)',
        'gold-radial': 'radial-gradient(ellipse at top, rgba(212, 175, 55, 0.15), transparent 70%)',
        'dark-radial': 'radial-gradient(ellipse at top, rgba(30, 41, 59, 0.8), rgba(11, 15, 25, 1) 75%)',
        'luxury-card': 'linear-gradient(180deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.6) 100%)',
        'luxury-card-dark': 'linear-gradient(180deg, rgba(26, 32, 48, 0.75) 0%, rgba(15, 20, 32, 0.9) 100%)'
      }
    },
  },
  plugins: [],
};

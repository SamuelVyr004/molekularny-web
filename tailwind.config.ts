// Súbor: tailwind.config.ts

import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './public/**/*.html', // <-- TENTO RIADOK ZABEZPEČÍ, ŽE TAILWIND SLEDUJE VAŠE NÁSTROJE
  ],
  theme: {
    extend: {
      colors: {
        // Vaše pôvodné farby, ktoré sú v poriadku
        background: '#111827',
        card: '#1F2937',
        text: '#E5E7EB',
        heading: '#ffffff',
        border: '#374151',
        
        primary: {
          DEFAULT: '#ffffff',
          foreground: '#111827',
        },
      },
      fontFamily: {
        // Tu môžeme definovať písma priamo, ak ich importujete v layout.tsx
        // Ak používate CSS premenné z layout.tsx, pôvodný zápis je správny
        primary: ['var(--font-primary)', 'sans-serif'],
        secondary: ['var(--font-secondary)', 'sans-serif'],
      },
      // Pridané animácie z vášho legacy-style.css
      keyframes: {
        fadeInUp: {
          'from': { opacity: '0', transform: 'translateY(20px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        gradientBG: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        }
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
        'gradient-bg': 'gradientBG 20s ease infinite',
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config
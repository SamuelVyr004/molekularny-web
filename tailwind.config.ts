// Súbor: tailwind.config.ts

import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#111827',
        card: '#1F2937',
        text: '#E5E7EB',
        heading: '#ffffff',
        border: '#374151',
        
        // ▼▼▼ TU JE OPAVA ▼▼▼
        primary: {
          DEFAULT: '#ffffff',           // Farba pozadia tlačidla (biela)
          foreground: '#111827',    // Farba textu tlačidla (tmavomodrá, ako pozadie stránky)
        },
      },
      fontFamily: {
        primary: ['var(--font-primary)', 'sans-serif'],
        secondary: ['var(--font-secondary)', 'sans-serif'],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config
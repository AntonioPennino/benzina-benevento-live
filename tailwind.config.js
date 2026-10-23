// Stile del sito: Tailwind genera public/styles.css con le sole classi usate in index.html e app.js
// (npm run build:css). Prima si usava cdn.tailwindcss.com, che costruiva lo stile nel browser a ogni visita.
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./public/index.html', './public/app.js'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        bn: {
          yellow: '#FACC15',
          red: '#DC2626',
          dark: '#0F172A',
        },
      },
    },
  },
}

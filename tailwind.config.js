/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
 // Inside tailwind.config.js
  theme: {
    extend: {
        colors: {
          'background': '#F5F0E1',   // Light, warm beige
  'primary': '#5D4037',       // Deep, rich brown (for primary text & accents)
  'secondary': '#756250',    // Muted brown/grey (for secondary text)
  'subtle': '#E0D9C5',       // Subtle pattern/background tone
},
    },
  plugins: [],
}
}
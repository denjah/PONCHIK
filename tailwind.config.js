/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.{html,js}"],
  theme: {
    extend: {
      colors: {
        neo: {
          bg: '#FDFBF7',
          primary: '#FF00FF',
          secondary: '#00FF00',
          accent1: '#FFFF00',
          accent2: '#00FFFF',
          dark: '#1A1A1A'
        }
      },
      fontFamily: {
        heading: ['"Archivo Black"', 'system-ui', 'sans-serif'],
        body: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'neo-sm': '2px 2px 0px 0px #1A1A1A',
        'neo-md': '4px 4px 0px 0px #1A1A1A',
        'neo-lg': '8px 8px 0px 0px #1A1A1A',
        'neo-xl': '12px 12px 0px 0px #1A1A1A',
      },
      borderWidth: {
        '3': '3px',
        '4': '4px',
      }
    },
  },
  plugins: [],
}

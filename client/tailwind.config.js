/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui'
import fluid, { extract, screens, fontSize } from 'fluid-tailwind'
export default {
  content: {
    files: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    extract,
  },

  theme: {
    screens,
    fontSize,
    extend: {},
  },
  plugins: [fluid, daisyui],
  daisyui: {
    themes:["light", "dark", "cupcake", "retro"]
  }
}

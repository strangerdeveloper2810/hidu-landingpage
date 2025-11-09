/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Warm beige/brown color scheme based on menu design
        primary: {
          50: '#faf8f5',
          100: '#f5f0e8',
          200: '#e8ddd0',
          300: '#d4c4b0',
          400: '#b8a08a',
          500: '#9d7c6b', // Main brown
          600: '#7d6354',
          700: '#5d4a3f',
          800: '#3d312a',
          900: '#1d1815',
        },
        secondary: {
          50: '#fef7f0',
          100: '#fdeee0',
          200: '#fbdcc1',
          300: '#f8c9a2',
          400: '#f5b683',
          500: '#f2a364', // Warm orange
          600: '#c28250',
          700: '#92623c',
          800: '#614128',
          900: '#312114',
        },
        accent: {
          50: '#faf5f0',
          100: '#f5ebe0',
          200: '#ebd7c1',
          300: '#e1c3a2',
          400: '#d7af83',
          500: '#cd9b64', // Beige accent
          600: '#a47c50',
          700: '#7b5d3c',
          800: '#523e28',
          900: '#291f14',
        },
        // Coffee shop specific colors
        coffee: {
          light: '#d4c4b0',
          DEFAULT: '#9d7c6b',
          dark: '#5d4a3f',
        },
        beige: {
          light: '#faf8f5',
          DEFAULT: '#f5f0e8',
          dark: '#e8ddd0',
        },
      },
      fontFamily: {
        display: ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        body: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-beige': 'linear-gradient(135deg, #faf8f5 0%, #f5f0e8 50%, #e8ddd0 100%)',
        'gradient-coffee': 'linear-gradient(135deg, #d4c4b0 0%, #9d7c6b 50%, #5d4a3f 100%)',
      },
    },
  },
  plugins: [],
};

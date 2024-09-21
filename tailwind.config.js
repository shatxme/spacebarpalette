/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'foreground': 'rgb(var(--foreground-rgb) / <alpha-value>)',
        'background-start': 'rgb(var(--background-start-rgb) / <alpha-value>)',
        'background-end': 'rgb(var(--background-end-rgb) / <alpha-value>)',
      },
      backgroundImage: {
        'gradient-custom': 'linear-gradient(to bottom, var(--background-start-rgb), var(--background-end-rgb))',
      },
    },
  },
  plugins: [],
  safelist: [
    'appearance-none',
    'bg-transparent',
    'cursor-pointer',
  ],
};
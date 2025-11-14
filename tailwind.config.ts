import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#50007D',
          dark: '#3D005F',
          light: '#6B00A3',
        },
        accent: {
          DEFAULT: '#00C8FF',
          dark: '#00A0CC',
          light: '#33D3FF',
        },
      },
    },
  },
  plugins: [],
}
export default config


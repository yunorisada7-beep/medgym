import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        accent: '#00d26a',
        'dark-bg': '#0f0f1a',
        'dark-card': '#1a1a2e',
        'dark-text': '#e8e8f0',
        'light-bg': '#f8f9fa',
        'light-card': '#ffffff',
        'light-text': '#1a1a2e',
      },
      fontFamily: {
        sans: ['Noto Sans JP', 'sans-serif'],
      },
      maxWidth: {
        'mobile': '480px',
      },
    },
  },
  plugins: [],
}

export default config

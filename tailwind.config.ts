import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#171717',
        panel: '#f7f7f2',
        line: '#d9d7cc',
        accent: '#237a57',
        warn: '#b45309',
        danger: '#b42318',
      },
    },
  },
  plugins: [],
};

export default config;

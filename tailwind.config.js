/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#241A3D',
        paper: '#FFF8EE',
        brand: '#7B5CFF',
        mint: '#2ECC8F',
        sun: '#FFD23F',
        pink: '#FF7AB5',
        sky: '#5AD2FF',
        muted: '#8B85A6',
      },
      borderRadius: {
        sticker: '18px',
        blob: '22px',
      },
      boxShadow: {
        pop: '4px 4px 0 #241A3D',
        'pop-lg': '6px 6px 0 #241A3D',
        'pop-sm': '2px 2px 0 #241A3D',
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'PingFang SC', 'Microsoft YaHei', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#2B2347',
        paper: '#F7F5FE',
        line: '#E7E3F3',
        muted: '#8A84A3',
        brand: { DEFAULT: '#7B5CFF', dark: '#5A3DE6', soft: '#EFEBFF' },
        mint: { DEFAULT: '#2FCB7E', dark: '#1FA463', soft: '#E2F8EC' },
        sun: { DEFAULT: '#FFC530', dark: '#E0A300', soft: '#FFF5D6' },
        pink: { DEFAULT: '#FF6B9A', dark: '#E04B7C', soft: '#FFE8EF' },
        sky: { DEFAULT: '#33B6F5', dark: '#1A93D0', soft: '#E0F4FE' },
        flame: { DEFAULT: '#FF9A1F', dark: '#E07A00', soft: '#FFF0DC' },
        bad: { DEFAULT: '#FF5470', dark: '#DB3654', soft: '#FFE6EA' },
      },
      borderRadius: {
        sticker: '16px',
        blob: '24px',
      },
      boxShadow: {
        lip: '0 4px 0 #E7E3F3',
        'lip-lg': '0 6px 0 #E7E3F3',
        float: '0 12px 32px -12px rgba(43,35,71,0.28)',
        glow: '0 0 0 6px rgba(123,92,255,0.15)',
      },
      fontFamily: {
        sans: [
          'Nunito Variable',
          'PingFang SC',
          'HarmonyOS Sans SC',
          'Microsoft YaHei',
          'system-ui',
          'sans-serif',
        ],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      keyframes: {
        bob: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-6px)' } },
        shine: { '0%': { transform: 'translateX(-120%)' }, '60%,100%': { transform: 'translateX(220%)' } },
        flicker: {
          '0%,100%': { transform: 'scale(1) rotate(-2deg)' },
          '50%': { transform: 'scale(1.08) rotate(2deg)' },
        },
        pulseRing: {
          '0%': { transform: 'scale(1)', opacity: '0.55' },
          '100%': { transform: 'scale(1.55)', opacity: '0' },
        },
      },
      animation: {
        bob: 'bob 1.6s ease-in-out infinite',
        shine: 'shine 2.8s ease-in-out infinite',
        flicker: 'flicker 1.4s ease-in-out infinite',
        'pulse-ring': 'pulseRing 1.8s ease-out infinite',
      },
    },
  },
  plugins: [],
};

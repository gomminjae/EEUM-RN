/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.tsx', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        main: '#F5F4F0',
        content: '#EAE8E0',
        accent: '#C33D32',
        primary: '#1D1D1D',
        footnote: '#8A8A8A',
        // iOS 시스템 색 (라이트 고정) — 원본이 시스템 색을 쓰는 곳 대응
        'system-gray': '#8E8E93', // .gray
        'system-gray-5': '#E5E5EA', // Color(.systemGray5)
        'secondary-label': 'rgba(60,60,67,0.6)', // .secondary
        'system-red': '#FF3B30', // .red
      },
      spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
      },
      fontFamily: {
        thin: ['Pretendard-Thin'],
        light: ['Pretendard-Light'],
        regular: ['Pretendard-Regular'],
        medium: ['Pretendard-Medium'],
        semibold: ['Pretendard-SemiBold'],
        bold: ['Pretendard-Bold'],
        extrabold: ['Pretendard-ExtraBold'],
        black: ['Pretendard-Black'],
        helvetica: ['Helvetica'],
        'helvetica-bold': ['Helvetica-Bold'],
      },
    },
  },
  plugins: [],
};

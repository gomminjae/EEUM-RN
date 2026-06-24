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

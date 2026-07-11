/** 원본 DesignSystemColors.swift 이식 */
export const colors = {
  mainBackground: '#F5F4F0',
  contentBackground: '#EAE8E0',
  accentPrimary: '#C33D32',
  textPrimary: '#1D1D1D',
  textFootnote: '#8A8A8A',

  // iOS 시스템 색 (라이트 고정) — 원본이 커스텀이 아닌 시스템 색을 쓰는 곳 대응
  black: '#000000', // .black / .primary(label)
  white: '#FFFFFF', // .white
  systemGray: '#8E8E93', // .gray
  systemGray5: '#E5E5EA', // Color(.systemGray5)
  secondaryLabel: 'rgba(60,60,67,0.6)', // .secondary
  systemRed: '#FF3B30', // .red
} as const;

/** 원본 DesignSystemFonts.swift 의 Pretendard / Helvetica 패밀리 (useFonts 키와 일치) */
export const fonts = {
  pretendard: {
    thin: 'Pretendard-Thin',
    extraLight: 'Pretendard-ExtraLight',
    light: 'Pretendard-Light',
    regular: 'Pretendard-Regular',
    medium: 'Pretendard-Medium',
    semiBold: 'Pretendard-SemiBold',
    bold: 'Pretendard-Bold',
    extraBold: 'Pretendard-ExtraBold',
    black: 'Pretendard-Black',
  },
  helvetica: { regular: 'Helvetica', bold: 'Helvetica-Bold' },
} as const;

export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 } as const;

export type ColorToken = keyof typeof colors;

import { Text, type TextProps, type TextStyle } from 'react-native';
import { colors, fonts, type ColorToken } from './theme';

type Weight = keyof typeof fonts.pretendard;

type AppTextProps = TextProps & {
  size?: number;
  weight?: Weight;
  color?: ColorToken;
};

/** Pretendard 기본 텍스트 컴포넌트 — 원본 .pretendard(size:weight:) 대체 */
export function AppText({
  size = 15,
  weight = 'regular',
  color = 'textPrimary',
  style,
  ...rest
}: AppTextProps) {
  const base: TextStyle = {
    fontFamily: fonts.pretendard[weight],
    fontSize: size,
    color: colors[color],
  };
  return <Text style={[base, style]} {...rest} />;
}

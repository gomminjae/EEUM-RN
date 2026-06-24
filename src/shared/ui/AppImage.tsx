import { Image as ExpoImage, type ImageProps } from 'expo-image';
import { cssInterop } from 'nativewind';

/** expo-image 를 NativeWind className 지원 + 캐시 기본값으로 감싼 이미지 컴포넌트.
 *  원격 아트워크에 메모리/디스크 캐시 적용 (원본 RN Image 대비 성능 개선) */
const StyledExpoImage = cssInterop(ExpoImage, { className: 'style' });

export function AppImage(props: ImageProps) {
  return <StyledExpoImage cachePolicy="memory-disk" transition={150} {...props} />;
}

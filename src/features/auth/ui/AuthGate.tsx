import { useEffect, type ReactNode } from 'react';
import { View, ActivityIndicator, Pressable } from 'react-native';
import { AppText, colors } from '@/shared/ui';
import { useAuthStore } from '../model/authStore';

/** 앱 진입 게이트: 부트스트랩(토큰 확인 → 없으면 게스트 로그인) 후
 *  인증되면 children, 실패하면 재시도 화면 */
export function AuthGate({ children }: { children: ReactNode }) {
  const status = useAuthStore((s) => s.status);
  const error = useAuthStore((s) => s.error);
  const bootstrap = useAuthStore((s) => s.bootstrap);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  if (status === 'authenticated') return <>{children}</>;

  if (status === 'unauthenticated') {
    return (
      <View className="flex-1 items-center justify-center bg-main gap-md p-lg">
        <AppText size={22} weight="bold">
          이음
        </AppText>
        <AppText size={14} color="textFootnote" className="text-center">
          {error ?? '로그인에 실패했어요'}
        </AppText>
        <Pressable className="mt-sm py-sm px-lg bg-accent rounded-[12px]" onPress={() => bootstrap()}>
          <AppText size={15} weight="semiBold" style={{ color: '#FFFFFF' }}>
            다시 시도
          </AppText>
        </Pressable>
      </View>
    );
  }

  // idle | loading
  return (
    <View className="flex-1 items-center justify-center bg-main gap-md p-lg">
      <ActivityIndicator color={colors.accentPrimary} />
    </View>
  );
}

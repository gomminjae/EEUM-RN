import { useEffect, type ReactNode } from 'react';
import { View, ActivityIndicator, Pressable, StyleSheet } from 'react-native';
import { AppText, colors, spacing } from '@/shared/ui';
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
      <View style={styles.container}>
        <AppText size={22} weight="bold">
          이음
        </AppText>
        <AppText size={14} color="textFootnote" style={styles.message}>
          {error ?? '로그인에 실패했어요'}
        </AppText>
        <Pressable style={styles.button} onPress={() => bootstrap()}>
          <AppText size={15} weight="semiBold" style={styles.buttonLabel}>
            다시 시도
          </AppText>
        </Pressable>
      </View>
    );
  }

  // idle | loading
  return (
    <View style={styles.container}>
      <ActivityIndicator color={colors.accentPrimary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.mainBackground,
    gap: spacing.md,
    padding: spacing.lg,
  },
  message: { textAlign: 'center' },
  button: {
    marginTop: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.accentPrimary,
    borderRadius: 12,
  },
  buttonLabel: { color: '#FFFFFF' },
});

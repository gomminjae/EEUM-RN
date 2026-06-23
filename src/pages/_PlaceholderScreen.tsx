import { View, StyleSheet } from 'react-native';
import { AppText, colors, spacing } from '@/shared/ui';

/** M0 임시 화면 — 각 페이지 슬라이스가 채워지면 교체된다 */
export function PlaceholderScreen({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <View style={styles.container}>
      <AppText size={28} weight="bold">
        {title}
      </AppText>
      <AppText size={14} color="textFootnote" style={styles.subtitle}>
        {subtitle}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.mainBackground,
    gap: spacing.sm,
    padding: spacing.lg,
  },
  subtitle: { textAlign: 'center' },
});

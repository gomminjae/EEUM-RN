import { View, Pressable, Alert, ScrollView, StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import { AppText, colors, spacing } from '@/shared/ui';
import { useAuthStore } from '@/features/auth';

export function SettingsScreen() {
  const status = useAuthStore((s) => s.status);
  const signOut = useAuthStore((s) => s.signOut);

  const confirmSignOut = () => {
    Alert.alert('로그아웃', '게스트 세션을 종료할까요?', [
      { text: '취소', style: 'cancel' },
      { text: '로그아웃', style: 'destructive', onPress: () => signOut() },
    ]);
  };

  const version = Constants.expoConfig?.version ?? '1.0.0';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Section title="계정">
        <Row label="상태" value={status === 'authenticated' ? '게스트 로그인됨' : status} />
        <Pressable style={styles.action} onPress={confirmSignOut}>
          <AppText size={16} style={{ color: colors.accentPrimary }}>
            로그아웃
          </AppText>
        </Pressable>
      </Section>

      <Section title="정보">
        <Row label="앱 버전" value={version} />
        <Row label="서비스" value="이음 — 뮤직 플레이리스트 공유" />
      </Section>
    </ScrollView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <AppText size={13} weight="semiBold" color="textFootnote" style={styles.sectionTitle}>
        {title}
      </AppText>
      <View style={styles.card}>{children}</View>
    </View>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <AppText size={15}>{label}</AppText>
      <AppText size={15} color="textFootnote">
        {value}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.mainBackground },
  content: { padding: spacing.lg, gap: spacing.lg },
  section: { gap: spacing.sm },
  sectionTitle: { marginLeft: spacing.xs },
  card: {
    backgroundColor: colors.contentBackground,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  action: { paddingVertical: spacing.md },
});

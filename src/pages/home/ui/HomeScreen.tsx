import { View, ScrollView, Pressable, ActivityIndicator, StyleSheet } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppText, colors, spacing } from '@/shared/ui';
import { PostCard, getRandomPost } from '@/entities/post';
import { usePlayerStore } from '@/features/play-track';
import type { RootStackParamList } from '@/app/navigation';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export function HomeScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const togglePlay = usePlayerStore((s) => s.toggle);
  const playingUrl = usePlayerStore((s) => (s.isPlaying ? s.currentUrl : null));

  const { data: post, isLoading, isFetching, refetch } = useQuery({
    queryKey: ['random-post'],
    queryFn: getRandomPost,
  });

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.lg }]}
    >
      <AppText size={32} weight="bold">
        이음
      </AppText>
      <AppText size={15} color="textFootnote">
        당신의 이야기에 어울리는 음악을 나눠요
      </AppText>

      <View style={styles.sectionHeader}>
        <AppText size={18} weight="bold">
          오늘의 사연
        </AppText>
        <Pressable onPress={() => refetch()} disabled={isFetching} hitSlop={8}>
          <AppText size={14} color="accentPrimary">
            새로고침
          </AppText>
        </Pressable>
      </View>

      {isLoading ? (
        <ActivityIndicator color={colors.accentPrimary} style={{ marginTop: spacing.xl }} />
      ) : post ? (
        <PostCard
          post={post}
          isPlaying={!!post.appleMusicUrl && playingUrl === post.appleMusicUrl}
          onPlay={post.appleMusicUrl ? () => togglePlay(post.appleMusicUrl!) : undefined}
          onPress={() => post.postId && navigation.navigate('PostDetail', { postId: post.postId })}
        />
      ) : (
        <AppText color="textFootnote" style={{ marginTop: spacing.lg }}>
          표시할 사연이 없어요
        </AppText>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.mainBackground },
  content: { padding: spacing.lg, gap: spacing.sm, paddingBottom: spacing.xl },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.lg,
  },
});

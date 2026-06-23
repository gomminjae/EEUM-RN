import { useLayoutEffect, useState } from 'react';
import { View, Pressable, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppText, colors, fonts, spacing } from '@/shared/ui';
import { type FeedKind, type Post } from '@/entities/post';
import { usePlayerStore } from '@/features/play-track';
import type { RootStackParamList } from '@/shared/config/navigation';
import { useFeed } from '../model/useFeed';
import { IngCarousel } from './IngCarousel';
import { DoneGrid } from './DoneGrid';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const TABS: { key: FeedKind; label: string }[] = [
  { key: 'ing', label: 'Ing' },
  { key: 'done', label: 'Done' },
];

export function FeedScreen() {
  const [tab, setTab] = useState<FeedKind>('ing');
  const query = useFeed(tab);
  const navigation = useNavigation<Nav>();
  const togglePlay = usePlayerStore((s) => s.toggle);
  const playingUrl = usePlayerStore((s) => (s.isPlaying ? s.currentUrl : null));

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={() => navigation.navigate('PostsList')} hitSlop={8} style={styles.inboxButton}>
          <AppText size={14} weight="medium">
            Inbox
          </AppText>
          <Ionicons name="arrow-up" size={13} color={colors.textPrimary} style={styles.inboxArrow} />
        </Pressable>
      ),
    });
  }, [navigation]);

  const posts = query.data?.pages.flat() ?? [];

  const openPost = (post: Post) => {
    if (post.postId) navigation.navigate('PostDetail', { postId: post.postId });
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {TABS.map(({ key, label }) => (
          <Pressable key={key} onPress={() => setTab(key)} hitSlop={8}>
            <AppText
              size={28}
              style={[styles.tabLabel, { color: tab === key ? colors.textPrimary : colors.textFootnote }]}
            >
              {label}
            </AppText>
          </Pressable>
        ))}
      </View>

      {query.isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.accentPrimary} />
        </View>
      ) : tab === 'ing' ? (
        <IngCarousel
          query={query}
          posts={posts}
          onPressPost={openPost}
          playingUrl={playingUrl}
          onPlay={togglePlay}
        />
      ) : (
        <DoneGrid query={query} posts={posts} onPressPost={openPost} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.mainBackground },
  tabBar: {
    flexDirection: 'row',
    gap: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  tabLabel: { fontFamily: fonts.helvetica.bold },
  inboxButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    backgroundColor: colors.contentBackground,
    borderRadius: 16,
  },
  inboxArrow: { transform: [{ rotate: '45deg' }] },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.sm, paddingTop: 80 },
});

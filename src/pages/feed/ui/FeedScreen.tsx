import { useState } from 'react';
import { View, FlatList, Pressable, ActivityIndicator, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText, colors, fonts, spacing } from '@/shared/ui';
import { PostCard, type FeedKind, type Post } from '@/entities/post';
import { useFeed } from '../model/useFeed';

const TABS: { key: FeedKind; label: string }[] = [
  { key: 'ing', label: 'Ing' },
  { key: 'done', label: 'Done' },
];

export function FeedScreen() {
  const [tab, setTab] = useState<FeedKind>('ing');
  const query = useFeed(tab);

  const posts = query.data?.pages.flat() ?? [];

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

      <FeedList query={query} posts={posts} />
    </View>
  );
}

function FeedList({
  query,
  posts,
}: {
  query: ReturnType<typeof useFeed>;
  posts: Post[];
}) {
  const insets = useSafeAreaInsets();

  if (query.isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.accentPrimary} />
      </View>
    );
  }

  if (query.isError) {
    return (
      <View style={styles.center}>
        <AppText color="textFootnote">불러오지 못했어요</AppText>
        <Pressable onPress={() => query.refetch()} style={styles.retry}>
          <AppText weight="semiBold" style={{ color: colors.accentPrimary }}>
            다시 시도
          </AppText>
        </Pressable>
      </View>
    );
  }

  return (
    <FlatList
      data={posts}
      keyExtractor={(item, i) => item.postId ?? String(i)}
      renderItem={({ item }) => <PostCard post={item} />}
      contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + spacing.lg }]}
      ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
      onEndReachedThreshold={0.4}
      onEndReached={() => {
        if (query.hasNextPage && !query.isFetchingNextPage) query.fetchNextPage();
      }}
      ListEmptyComponent={
        <View style={styles.center}>
          <AppText color="textFootnote">아직 게시물이 없어요</AppText>
        </View>
      }
      ListFooterComponent={
        query.isFetchingNextPage ? (
          <ActivityIndicator color={colors.accentPrimary} style={{ marginVertical: spacing.lg }} />
        ) : null
      }
      refreshing={query.isRefetching}
      onRefresh={() => query.refetch()}
    />
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
  list: { padding: spacing.lg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.sm, paddingTop: 80 },
  retry: { paddingVertical: spacing.sm, paddingHorizontal: spacing.md },
});

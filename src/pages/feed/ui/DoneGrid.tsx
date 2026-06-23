import { View, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText, colors, spacing } from '@/shared/ui';
import { PostGridCard, type Post } from '@/entities/post';
import type { useFeed } from '../model/useFeed';

type DoneGridProps = {
  query: ReturnType<typeof useFeed>;
  posts: Post[];
  onPressPost: (post: Post) => void;
};

/** 원본 DoneGridView 이식 — 2열 그리드 + n/total 뱃지 + 무한 로드 */
export function DoneGrid({ query, posts, onPressPost }: DoneGridProps) {
  const insets = useSafeAreaInsets();

  if (posts.length === 0) {
    return (
      <View style={styles.empty}>
        <Ionicons name="checkmark-circle-outline" size={56} color={colors.textFootnote} />
        <AppText size={16} weight="medium" color="textFootnote">
          완료된 사연이 없습니다
        </AppText>
      </View>
    );
  }

  return (
    <FlatList
      data={posts}
      numColumns={2}
      columnWrapperStyle={styles.column}
      keyExtractor={(item, i) => item.postId ?? String(i)}
      renderItem={({ item, index }) => (
        <View style={styles.cell}>
          <PostGridCard post={item} badge={`${index + 1}/${posts.length}`} onPress={() => onPressPost(item)} />
        </View>
      )}
      ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
      contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.lg }]}
      onEndReachedThreshold={0.4}
      onEndReached={() => {
        if (query.hasNextPage && !query.isFetchingNextPage) query.fetchNextPage();
      }}
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
  content: { padding: spacing.lg },
  column: { gap: spacing.md },
  cell: { flex: 1, maxWidth: '48%' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md },
});

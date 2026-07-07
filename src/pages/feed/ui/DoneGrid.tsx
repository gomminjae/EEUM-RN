import { View, FlatList, ActivityIndicator } from 'react-native';
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
      <View className="flex-1 items-center justify-center gap-[20px]">
        <Ionicons name="checkmark-circle-outline" size={60} color="rgba(142,142,147,0.5)" />
        <AppText size={18} weight="medium" color="textFootnote">
          완료된 사연이 없습니다
        </AppText>
      </View>
    );
  }

  return (
    <FlatList
      data={posts}
      numColumns={2}
      columnWrapperStyle={{ gap: 12 }}
      keyExtractor={(item, i) => item.postId ?? String(i)}
      renderItem={({ item, index }) => (
        <View className="flex-1 max-w-[48%]">
          <PostGridCard post={item} variant="done" badge={`${index + 1}/${posts.length}`} onPress={onPressPost} />
        </View>
      )}
      ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: insets.bottom + 20 }}
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

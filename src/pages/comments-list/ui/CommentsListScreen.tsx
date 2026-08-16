import { memo, useCallback } from 'react';
import { View, FlatList, Pressable, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppText, AppImage, colors, spacing, images } from '@/shared/ui';
import { getCommentedPosts, type Post } from '@/entities/post';
import { InboxHeader } from '@/widgets/inbox-header';
import type { RootStackParamList } from '@/shared/config/navigation';

type Nav = NativeStackNavigationProp<RootStackParamList>;

/** 원본 CommentsListView — 큰 "Comments" 헤더 + 가로 리스트 (56×56 artwork) */
export function CommentsListScreen() {
  const navigation = useNavigation<Nav>();
  const query = useQuery({ queryKey: ['inbox', 'comments'], queryFn: getCommentedPosts });
  const posts = query.data?.posts ?? [];
  const count = query.data?.count ?? posts.length;

  const openPost = useCallback(
    (post: Post) => {
      if (post.postId) navigation.navigate('PostDetail', { postId: post.postId });
    },
    [navigation],
  );

  return (
    <FlatList
      className="flex-1 bg-main"
      data={posts}
      keyExtractor={(item, i) => item.postId || String(i)}
      ListHeaderComponent={
        <InboxHeader
          title="Comments"
          count={count}
          description="참여한 사연과 플레이리스트입니다."
        />
      }
      renderItem={({ item }) => <CommentedPostRow post={item} onPress={openPost} />}
      ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      contentContainerStyle={{ paddingTop: 16, paddingHorizontal: 20, paddingBottom: spacing.lg, flexGrow: 1 }}
      ListEmptyComponent={
        query.isLoading ? (
          <ActivityIndicator color={colors.accentPrimary} className="mt-[60px]" />
        ) : query.isError ? (
          <View className="items-center gap-sm mt-[60px]">
            <AppText color="textFootnote">댓글 목록을 불러오지 못했어요</AppText>
            <Pressable className="px-md py-sm" onPress={() => query.refetch()}>
              <AppText weight="semiBold" style={{ color: colors.accentPrimary }}>
                다시 시도
              </AppText>
            </Pressable>
          </View>
        ) : (
          <View className="items-center gap-md mt-[60px]">
            <AppImage source={images.nodata} className="w-[120px] h-[120px] opacity-80" contentFit="contain" />
            <AppText color="textFootnote">댓글을 남긴 사연이 없습니다</AppText>
          </View>
        )
      }
      refreshing={query.isRefetching}
      onRefresh={() => query.refetch()}
    />
  );
}

const CommentedPostRow = memo(function CommentedPostRow({
  post,
  onPress,
}: {
  post: Post;
  onPress: (post: Post) => void;
}) {
  return (
    <Pressable
      className="flex-row items-center gap-[12px] p-[16px] bg-content rounded-[16px]"
      onPress={() => onPress(post)}
    >
      {post.artworkUrl ? (
        <AppImage source={{ uri: post.artworkUrl }} recyclingKey={post.artworkUrl} className="w-[56px] h-[56px] rounded-[10px]" />
      ) : (
        <View className="w-[56px] h-[56px] rounded-[10px] bg-black/[0.15]" />
      )}
      <View className="flex-1 gap-xs">
        <AppText size={15} weight="semiBold" numberOfLines={1}>
          {post.title ?? '사연 제목'}
        </AppText>
        <AppText size={12} color="textFootnote" numberOfLines={1}>
          참여한 사연과 플레이리스트입니다.
        </AppText>
      </View>
      <Ionicons name="chevron-forward" size={12} color={colors.textFootnote} />
    </Pressable>
  );
});

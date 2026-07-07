import { useCallback } from 'react';
import { View, FlatList, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppText, AppImage, colors, spacing, images } from '@/shared/ui';
import { getLikedPosts, PostGridCard, type Post } from '@/entities/post';
import { InboxHeader } from '@/widgets/inbox-header';
import type { RootStackParamList } from '@/shared/config/navigation';

type Nav = NativeStackNavigationProp<RootStackParamList>;

/** 원본 LikesListView — 큰 "Likes" 헤더 + 2열 그리드 + 하트 표시 */
export function LikesListScreen() {
  const navigation = useNavigation<Nav>();
  const query = useQuery({ queryKey: ['inbox', 'likes'], queryFn: getLikedPosts });
  const posts = query.data ?? [];

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
      numColumns={2}
      keyExtractor={(item, i) => item.postId || String(i)}
      columnWrapperStyle={{ gap: 12, paddingHorizontal: 20, marginTop: 16 }}
      ListHeaderComponent={
        <InboxHeader
          title="Likes"
          count={posts.length}
          description="좋아요 한 플레이리스트입니다."
        />
      }
      renderItem={({ item }) => (
        <View className="flex-1 max-w-[48%]">
          <PostGridCard post={item} showHeart onPress={openPost} />
        </View>
      )}
      ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      contentContainerStyle={{ paddingBottom: spacing.lg, flexGrow: 1 }}
      ListEmptyComponent={
        query.isLoading ? (
          <ActivityIndicator color={colors.accentPrimary} className="mt-[60px]" />
        ) : (
          <View className="items-center gap-md mt-[60px] px-[20px]">
            <AppImage source={images.nodata} className="w-full" style={{ aspectRatio: 750 / 137 }} contentFit="contain" />
            <AppText size={14} style={{ color: '#8E8E93' }}>좋아요한 사연이 없습니다</AppText>
          </View>
        )
      }
      refreshing={query.isRefetching}
      onRefresh={() => query.refetch()}
    />
  );
}

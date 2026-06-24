import { View, FlatList, Image, Pressable, ActivityIndicator } from 'react-native';
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
  const posts = query.data ?? [];

  const openPost = (post: Post) => {
    if (post.postId) navigation.navigate('PostDetail', { postId: post.postId });
  };

  return (
    <FlatList
      className="flex-1 bg-main"
      data={posts}
      keyExtractor={(item, i) => item.postId || String(i)}
      ListHeaderComponent={
        <InboxHeader
          title="Comments"
          count={posts.length}
          description="참여한 사연과 플레이리스트입니다."
        />
      }
      renderItem={({ item }) => <CommentedPostRow post={item} onPress={() => openPost(item)} />}
      ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      contentContainerStyle={{ paddingTop: 16, paddingHorizontal: 20, paddingBottom: spacing.lg, flexGrow: 1 }}
      ListEmptyComponent={
        query.isLoading ? (
          <ActivityIndicator color={colors.accentPrimary} className="mt-[60px]" />
        ) : (
          <View className="items-center gap-md mt-[60px]">
            <Image source={images.nodata} className="w-[120px] h-[120px] opacity-80" resizeMode="contain" />
            <AppText color="textFootnote">댓글을 남긴 사연이 없습니다</AppText>
          </View>
        )
      }
      refreshing={query.isRefetching}
      onRefresh={() => query.refetch()}
    />
  );
}

function CommentedPostRow({ post, onPress }: { post: Post; onPress: () => void }) {
  return (
    <Pressable className="flex-row items-center gap-[12px]" onPress={onPress}>
      {post.artworkUrl ? (
        <AppImage source={{ uri: post.artworkUrl }} recyclingKey={post.artworkUrl} className="w-[56px] h-[56px] rounded-[10px]" />
      ) : (
        <View className="w-[56px] h-[56px] rounded-[10px] bg-black/[0.08] items-center justify-center">
          <Ionicons name="musical-note" size={20} color={colors.textFootnote} />
        </View>
      )}
      <View className="flex-1 gap-xs">
        <AppText size={15} weight="semiBold" numberOfLines={1}>
          {post.title ?? '사연 제목'}
        </AppText>
        {(post.songName || post.artistName) && (
          <AppText size={12} color="textFootnote" numberOfLines={1}>
            {[post.songName, post.artistName].filter(Boolean).join(' · ')}
          </AppText>
        )}
      </View>
    </Pressable>
  );
}

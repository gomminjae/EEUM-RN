import { View, FlatList, Image, Pressable, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppText, colors, spacing, images } from '@/shared/ui';
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
      style={styles.container}
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
      contentContainerStyle={styles.content}
      ListEmptyComponent={
        query.isLoading ? (
          <ActivityIndicator color={colors.accentPrimary} style={styles.loader} />
        ) : (
          <View style={styles.empty}>
            <Image source={images.nodata} style={styles.emptyImage} resizeMode="contain" />
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
    <Pressable style={styles.row} onPress={onPress}>
      {post.artworkUrl ? (
        <Image source={{ uri: post.artworkUrl }} style={styles.artwork} />
      ) : (
        <View style={[styles.artwork, styles.artworkEmpty]}>
          <Ionicons name="musical-note" size={20} color={colors.textFootnote} />
        </View>
      )}
      <View style={styles.text}>
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.mainBackground },
  content: { paddingTop: 16, paddingHorizontal: 20, paddingBottom: spacing.lg, flexGrow: 1 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  artwork: { width: 56, height: 56, borderRadius: 10 },
  artworkEmpty: { backgroundColor: 'rgba(0,0,0,0.08)', alignItems: 'center', justifyContent: 'center' },
  text: { flex: 1, gap: 4 },
  loader: { marginTop: 60 },
  empty: { alignItems: 'center', gap: spacing.md, marginTop: 60 },
  emptyImage: { width: 120, height: 120, opacity: 0.8 },
});

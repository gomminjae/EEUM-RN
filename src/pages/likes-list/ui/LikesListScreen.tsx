import { View, FlatList, Image, ActivityIndicator, StyleSheet } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppText, colors, spacing, images } from '@/shared/ui';
import { getLikedPosts, PostGridCard, type Post } from '@/entities/post';
import { InboxHeader } from '@/widgets/inbox-header';
import type { RootStackParamList } from '@/shared/config/navigation';

type Nav = NativeStackNavigationProp<RootStackParamList>;

/** 원본 LikesListView — 큰 "Likes" 헤더 + 2열 그리드 + 하트 표시 */
export function LikesListScreen() {
  const navigation = useNavigation<Nav>();
  const query = useQuery({ queryKey: ['inbox', 'likes'], queryFn: getLikedPosts });
  const posts = query.data ?? [];

  const openPost = (post: Post) => {
    if (post.postId) navigation.navigate('PostDetail', { postId: post.postId });
  };

  return (
    <FlatList
      style={styles.container}
      data={posts}
      numColumns={2}
      keyExtractor={(item, i) => item.postId || String(i)}
      columnWrapperStyle={styles.column}
      ListHeaderComponent={
        <InboxHeader
          title="Likes"
          count={posts.length}
          description="좋아요 한 플레이리스트입니다."
        />
      }
      renderItem={({ item }) => (
        <View style={styles.gridItem}>
          <PostGridCard post={item} showHeart onPress={() => openPost(item)} />
        </View>
      )}
      ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      contentContainerStyle={styles.content}
      ListEmptyComponent={
        query.isLoading ? (
          <ActivityIndicator color={colors.accentPrimary} style={styles.loader} />
        ) : (
          <View style={styles.empty}>
            <Image source={images.nodata} style={styles.emptyImage} resizeMode="contain" />
            <AppText color="textFootnote">좋아요한 사연이 없습니다</AppText>
          </View>
        )
      }
      refreshing={query.isRefetching}
      onRefresh={() => query.refetch()}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.mainBackground },
  content: { paddingBottom: spacing.lg, flexGrow: 1 },
  column: { gap: 12, paddingHorizontal: 20, marginTop: 16 },
  gridItem: { flex: 1, maxWidth: '48%' },
  loader: { marginTop: 60 },
  empty: { alignItems: 'center', gap: spacing.md, marginTop: 60 },
  emptyImage: { width: 120, height: 120, opacity: 0.8 },
});

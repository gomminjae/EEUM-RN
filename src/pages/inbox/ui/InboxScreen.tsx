import { useState } from 'react';
import { View, FlatList, Pressable, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppText, colors, fonts, spacing } from '@/shared/ui';
import { PostGridCard, PostRow, type Post } from '@/entities/post';
import type { RootStackParamList } from '@/shared/config/navigation';
import { useInbox, type InboxTab } from '../model/useInbox';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const TABS: { key: InboxTab; label: string; desc: string; empty: string }[] = [
  { key: 'posts', label: 'Posts', desc: '직접 공유한 사연과 플레이리스트입니다.', empty: '작성한 사연이 없습니다' },
  { key: 'comments', label: 'Comments', desc: '참여한 사연과 플레이리스트입니다.', empty: '댓글을 남긴 사연이 없습니다' },
  { key: 'likes', label: 'Likes', desc: '좋아요 한 플레이리스트입니다.', empty: '좋아요한 사연이 없습니다' },
];

export function InboxScreen() {
  const [tab, setTab] = useState<InboxTab>('posts');
  const navigation = useNavigation<Nav>();
  const query = useInbox(tab);

  const meta = TABS.find((t) => t.key === tab)!;
  const posts = query.data ?? [];
  const isGrid = tab !== 'comments';

  const openPost = (post: Post) => {
    if (post.postId) navigation.navigate('PostDetail', { postId: post.postId });
  };

  const Header = (
    <View>
      <View style={styles.segment}>
        {TABS.map((t) => (
          <Pressable key={t.key} onPress={() => setTab(t.key)} hitSlop={6}>
            <AppText
              size={28}
              weight="bold"
              style={{ color: tab === t.key ? colors.textPrimary : colors.textFootnote }}
            >
              {t.label}
            </AppText>
          </Pressable>
        ))}
      </View>
      <View style={styles.headerInfo}>
        <AppText size={16} weight="medium">
          {posts.length}개
        </AppText>
        <AppText size={14} color="textFootnote">
          {meta.desc}
        </AppText>
      </View>
    </View>
  );

  return (
    <FlatList
      key={isGrid ? 'grid' : 'list'}
      style={styles.container}
      data={posts}
      numColumns={isGrid ? 2 : 1}
      columnWrapperStyle={isGrid ? styles.column : undefined}
      keyExtractor={(item, i) => item.postId || String(i)}
      ListHeaderComponent={Header}
      renderItem={({ item }) =>
        isGrid ? (
          <View style={styles.gridItem}>
            <PostGridCard post={item} showHeart={tab === 'likes'} onPress={() => openPost(item)} />
          </View>
        ) : (
          <PostRow post={item} onPress={() => openPost(item)} />
        )
      }
      ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
      contentContainerStyle={styles.content}
      ListEmptyComponent={
        query.isLoading ? (
          <ActivityIndicator color={colors.accentPrimary} style={{ marginTop: 60 }} />
        ) : (
          <AppText color="textFootnote" style={styles.empty}>
            {meta.empty}
          </AppText>
        )
      }
      refreshing={query.isRefetching}
      onRefresh={() => query.refetch()}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.mainBackground },
  content: { padding: spacing.lg, gap: spacing.md, flexGrow: 1 },
  segment: { flexDirection: 'row', gap: spacing.md, flexWrap: 'wrap', marginBottom: spacing.md },
  headerInfo: { gap: spacing.xs, marginBottom: spacing.md },
  column: { gap: spacing.md },
  gridItem: { flex: 1, maxWidth: '48%' },
  empty: { textAlign: 'center', marginTop: 60 },
});

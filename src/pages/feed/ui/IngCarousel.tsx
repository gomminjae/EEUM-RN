import { useState } from 'react';
import {
  View,
  FlatList,
  Image,
  Pressable,
  useWindowDimensions,
  type NativeSyntheticEvent,
  type NativeScrollEvent,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText, colors, spacing } from '@/shared/ui';
import type { Post } from '@/entities/post';
import type { useFeed } from '../model/useFeed';

const GAP = 12;
const SIDE_PADDING = 24;

type IngCarouselProps = {
  query: ReturnType<typeof useFeed>;
  posts: Post[];
  onPressPost: (post: Post) => void;
  playingUrl: string | null;
  onPlay: (url: string) => void;
};

/** 원본 IngCardStackView/IngPagerView 이식 — 가로 페이징 캐러셀 */
export function IngCarousel({ query, posts, onPressPost, playingUrl, onPlay }: IngCarouselProps) {
  const { width } = useWindowDimensions();
  const cardWidth = width - 80;
  const snap = cardWidth + GAP;
  const [active, setActive] = useState(0);

  const onScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / snap);
    setActive(index);
    if (index >= posts.length - 2 && query.hasNextPage && !query.isFetchingNextPage) {
      query.fetchNextPage();
    }
  };

  if (posts.length === 0) {
    return (
      <View style={styles.empty}>
        <Ionicons name="file-tray-outline" size={56} color={colors.textFootnote} />
        <AppText size={16} weight="medium" color="textFootnote">
          진행 중인 사연이 없습니다
        </AppText>
      </View>
    );
  }

  const activePost = posts[Math.min(active, posts.length - 1)];

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        horizontal
        keyExtractor={(item, i) => item.postId ?? String(i)}
        showsHorizontalScrollIndicator={false}
        snapToInterval={snap}
        decelerationRate="fast"
        disableIntervalMomentum
        onMomentumScrollEnd={onScrollEnd}
        contentContainerStyle={{ paddingLeft: SIDE_PADDING, paddingRight: 56 }}
        renderItem={({ item }) => (
          <View style={[styles.card, { width: cardWidth, height: cardWidth, marginRight: GAP }]}>
            {item.artworkUrl ? (
              <Image source={{ uri: item.artworkUrl }} style={StyleSheet.absoluteFill} />
            ) : (
              <View style={[StyleSheet.absoluteFill, styles.artworkEmpty]} />
            )}
            {!!item.appleMusicUrl && (
              <Pressable
                style={styles.playButton}
                onPress={() => onPlay(item.appleMusicUrl!)}
                hitSlop={8}
              >
                <Ionicons
                  name={playingUrl === item.appleMusicUrl ? 'pause' : 'play'}
                  size={16}
                  color="#FFFFFF"
                />
              </Pressable>
            )}
          </View>
        )}
      />

      {activePost && (
        <View style={styles.meta}>
          <AppText size={18} weight="bold" numberOfLines={1}>
            {activePost.title ?? '제목 없음'}
          </AppText>
          {activePost.content != null && (
            <AppText size={14} color="textFootnote" numberOfLines={4} style={styles.content}>
              {activePost.content}
            </AppText>
          )}
        </View>
      )}

      <View style={styles.footer}>
        <Pressable style={styles.viewButton} onPress={() => activePost && onPressPost(activePost)}>
          <AppText size={16} weight="semiBold" style={{ color: '#FFFFFF' }}>
            view
          </AppText>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: spacing.md },
  card: { borderRadius: 4, overflow: 'hidden', backgroundColor: colors.contentBackground },
  artworkEmpty: { backgroundColor: 'rgba(0,0,0,0.1)' },
  playButton: {
    position: 'absolute',
    left: 12,
    bottom: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  meta: { paddingHorizontal: SIDE_PADDING, paddingTop: spacing.md, gap: spacing.xs },
  content: { lineHeight: 20 },
  footer: { flex: 1, justifyContent: 'flex-end', paddingHorizontal: SIDE_PADDING, paddingBottom: spacing.xl },
  viewButton: {
    alignItems: 'center',
    paddingVertical: 14,
    backgroundColor: '#000000',
    borderRadius: 20,
  },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md },
});

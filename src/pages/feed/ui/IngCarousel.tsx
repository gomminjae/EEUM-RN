import { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  Pressable,
  useWindowDimensions,
  type NativeSyntheticEvent,
  type NativeScrollEvent,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText, AppImage, colors } from '@/shared/ui';
import type { Post } from '@/entities/post';
import { usePlayerStore } from '@/features/play-track';
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
  const stopPlayback = usePlayerStore((s) => s.stop);

  // 원본 onDisappear: 화면 이탈 시 재생 정지
  useEffect(() => () => stopPlayback(), [stopPlayback]);

  const onScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / snap);
    if (index !== active) {
      setActive(index);
      // 원본 IngPagerView.onChange(activePostId): 이전 곡 정지 후 새 카드 곡 자동재생
      const nextPost = posts[Math.min(index, posts.length - 1)];
      if (nextPost?.appleMusicUrl) onPlay(nextPost.appleMusicUrl);
      else stopPlayback();
    }
    if (index >= posts.length - 2 && query.hasNextPage && !query.isFetchingNextPage) {
      query.fetchNextPage();
    }
  };

  if (posts.length === 0) {
    return (
      <View className="flex-1 items-center justify-center gap-[20px]">
        <Ionicons name="file-tray-outline" size={60} color="rgba(142,142,147,0.5)" />
        <AppText size={18} weight="medium" color="textFootnote">
          진행 중인 사연이 없습니다
        </AppText>
      </View>
    );
  }

  const activePost = posts[Math.min(active, posts.length - 1)];

  return (
    <View className="flex-1 pt-md">
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
          <View
            className="rounded-[14px] overflow-hidden"
            style={{ width: cardWidth, height: cardWidth, marginRight: GAP, backgroundColor: 'rgba(142,142,147,0.3)' }}
          >
            {item.artworkUrl ? (
              <AppImage source={{ uri: item.artworkUrl }} recyclingKey={item.artworkUrl} style={StyleSheet.absoluteFill} />
            ) : null}
            {!!item.appleMusicUrl && (
              <Pressable
                className="absolute left-[12px] bottom-[12px] w-[36px] h-[36px] rounded-[18px] bg-black/60 items-center justify-center"
                onPress={() => onPlay(item.appleMusicUrl!)}
                hitSlop={8}
              >
                <Ionicons
                  name={playingUrl === item.appleMusicUrl ? 'pause' : 'play'}
                  size={14}
                  color="#FFFFFF"
                />
              </Pressable>
            )}
          </View>
        )}
      />

      {activePost && (
        <View className="px-lg pt-md gap-sm">
          <AppText size={18} weight="bold" numberOfLines={1}>
            {activePost.title ?? '제목 없음'}
          </AppText>
          {activePost.content != null && (
            <AppText size={14} color="textFootnote" numberOfLines={4} className="leading-[20px]">
              {activePost.content}
            </AppText>
          )}
        </View>
      )}

      <View className="flex-1 justify-end px-lg pb-[39px]">
        <Pressable
          className="items-center py-[14px] bg-[#000000] rounded-[20px]"
          onPress={() => activePost && onPressPost(activePost)}
        >
          <AppText size={16} weight="semiBold" style={{ color: '#FFFFFF' }}>
            view
          </AppText>
        </Pressable>
      </View>
    </View>
  );
}

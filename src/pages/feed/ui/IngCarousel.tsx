import { useState } from 'react';
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
      <View className="flex-1 items-center justify-center gap-md">
        <Ionicons name="file-tray-outline" size={56} color={colors.textFootnote} />
        <AppText size={16} weight="medium" color="textFootnote">
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
            className="rounded-[4px] overflow-hidden bg-content"
            style={{ width: cardWidth, height: cardWidth, marginRight: GAP }}
          >
            {item.artworkUrl ? (
              <AppImage source={{ uri: item.artworkUrl }} recyclingKey={item.artworkUrl} style={StyleSheet.absoluteFill} />
            ) : (
              <View className="bg-black/10" style={StyleSheet.absoluteFill} />
            )}
            {!!item.appleMusicUrl && (
              <Pressable
                className="absolute left-[12px] bottom-[12px] w-[36px] h-[36px] rounded-[18px] bg-black/60 items-center justify-center"
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
        <View className="px-lg pt-md gap-xs">
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

      <View className="flex-1 justify-end px-lg pb-xl">
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

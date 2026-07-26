import { memo } from 'react';
import { View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText, AppImage, colors } from '@/shared/ui';
import type { Post } from '../model/types';

/** 원본 Color.gray.opacity(0.2) 아트워크 placeholder */
const PLACEHOLDER_BG = 'rgba(142,142,147,0.2)';

type PostGridCardProps = {
  post: Post;
  /** 'my' = MyPostCard(Posts/Likes), 'done' = DonePostCardContent(Feed Done) */
  variant?: 'my' | 'done';
  showHeart?: boolean;
  /** Done 그리드의 n/total 카운터 뱃지 */
  badge?: string;
  onPress?: (post: Post) => void;
};

/** 원본 MyPostCard/DonePostCard 이식 — 2열 그리드용 정사각 썸네일 + 제목/곡 */
export const PostGridCard = memo(function PostGridCard({
  post,
  variant = 'my',
  showHeart = false,
  badge,
  onPress,
}: PostGridCardProps) {
  const isDone = variant === 'done';
  // MyPostCard: 제목 13 semiBold / 곡 11 medium / 가수 11 regular
  // DonePostCardContent: 제목 14 medium / 곡 12 regular / 가수 12 regular
  const titleSize = isDone ? 14 : 13;
  const titleWeight = isDone ? 'medium' : 'semiBold';
  const metaSize = isDone ? 12 : 11;
  const songWeight = isDone ? 'regular' : 'medium';

  return (
    <Pressable className="flex-1" onPress={onPress ? () => onPress(post) : undefined} disabled={!onPress}>
      <View
        className="aspect-square rounded-[12px] overflow-hidden items-center justify-center"
        style={{ backgroundColor: PLACEHOLDER_BG }}
      >
        {post.artworkUrl ? (
          <AppImage source={{ uri: post.artworkUrl }} recyclingKey={post.artworkUrl} className="w-full h-full" />
        ) : (
          <Ionicons name="musical-note" size={24} color={colors.systemGray} />
        )}
        {badge != null && (
          <View className="absolute right-[8px] bottom-[8px] px-[8px] py-[4px] rounded-[999px] bg-black/70">
            <AppText size={11} weight="medium" color="white">
              {badge}
            </AppText>
          </View>
        )}
      </View>

      <View className="flex-row items-center gap-[6px]" style={{ marginTop: 8 }}>
        <AppText size={titleSize} weight={titleWeight} numberOfLines={1} className="flex-1">
          {post.title ?? '제목 없음'}
        </AppText>
        {showHeart && <Ionicons name="heart" size={12} color={colors.accentPrimary} />}
      </View>

      {(post.songName || post.artistName) && (
        <View className="flex-row items-center gap-[4px]" style={{ marginTop: isDone ? 0 : 8 }}>
          {!!post.songName && (
            <AppText size={metaSize} weight={songWeight} numberOfLines={1} color={isDone ? 'textPrimary' : 'black'}>
              {post.songName}
            </AppText>
          )}
          {!!post.artistName && (
            <AppText size={metaSize} color="textFootnote" numberOfLines={1} className="flex-1">
              {post.artistName}
            </AppText>
          )}
        </View>
      )}
    </Pressable>
  );
});

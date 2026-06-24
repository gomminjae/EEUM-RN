import { View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText, AppImage, colors } from '@/shared/ui';
import type { Post } from '../model/types';

type PostGridCardProps = {
  post: Post;
  showHeart?: boolean;
  /** Done 그리드의 n/total 카운터 뱃지 */
  badge?: string;
  onPress?: () => void;
};

/** 원본 MyPostCard/DonePostCard 이식 — 2열 그리드용 정사각 썸네일 + 제목/곡 */
export function PostGridCard({ post, showHeart = false, badge, onPress }: PostGridCardProps) {
  return (
    <Pressable className="flex-1 gap-sm" onPress={onPress} disabled={!onPress}>
      <View className="aspect-square rounded-[12px] overflow-hidden">
        {post.artworkUrl ? (
          <AppImage source={{ uri: post.artworkUrl }} recyclingKey={post.artworkUrl} className="w-full h-full" />
        ) : (
          <View className="w-full h-full bg-black/[0.08] items-center justify-center">
            <Ionicons name="musical-note" size={24} color={colors.textFootnote} />
          </View>
        )}
        {badge != null && (
          <View className="absolute right-[8px] bottom-[8px] px-[8px] py-[4px] rounded-[999px] bg-black/70">
            <AppText size={11} weight="medium" className="text-white">
              {badge}
            </AppText>
          </View>
        )}
      </View>

      <View className="flex-row items-center gap-xs">
        <AppText size={13} weight="semiBold" numberOfLines={1} className="flex-1">
          {post.title ?? '제목 없음'}
        </AppText>
        {showHeart && <Ionicons name="heart" size={12} color={colors.accentPrimary} />}
      </View>

      {(post.songName || post.artistName) && (
        <View className="flex-row items-center gap-xs">
          {!!post.songName && (
            <AppText size={11} weight="medium" numberOfLines={1}>
              {post.songName}
            </AppText>
          )}
          {!!post.artistName && (
            <AppText size={11} color="textFootnote" numberOfLines={1} className="flex-1">
              {post.artistName}
            </AppText>
          )}
        </View>
      )}
    </Pressable>
  );
}

import { View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText, AppImage, colors } from '@/shared/ui';
import type { Post } from '../model/types';

type PostCardProps = {
  post: Post;
  isPlaying?: boolean;
  isLiked?: boolean;
  onPress?: () => void;
  onPlay?: () => void;
  onToggleLike?: () => void;
};

/** 원본 FeedCardView 이식 — 제목/내용 + 하단 음악 플레이어(재생·좋아요) */
export function PostCard({
  post,
  isPlaying = false,
  isLiked = false,
  onPress,
  onPlay,
  onToggleLike,
}: PostCardProps) {
  return (
    <Pressable
      className="rounded-[20px] bg-main p-lg gap-md"
      style={{ shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 3 }}
      onPress={onPress}
      disabled={!onPress}
    >
      <AppText size={22} weight="bold" numberOfLines={2}>
        {post.title ?? '제목 없음'}
      </AppText>

      {post.content != null && (
        <AppText size={15} color="textFootnote" numberOfLines={4} style={{ lineHeight: 21 }}>
          {post.content}
        </AppText>
      )}

      <View className="flex-row items-center gap-md p-md bg-content rounded-[12px]">
        {post.artworkUrl ? (
          <AppImage source={{ uri: post.artworkUrl }} recyclingKey={post.artworkUrl} className="w-[60px] h-[60px] rounded-[8px]" />
        ) : (
          <View className="w-[60px] h-[60px] rounded-[8px]" style={{ backgroundColor: 'rgba(142,142,147,0.3)' }} />
        )}

        <View className="flex-1 gap-xs">
          <AppText size={16} weight="semiBold" numberOfLines={1}>
            {post.songName ?? '음악 정보 없음'}
          </AppText>
          <AppText size={14} color="textFootnote" numberOfLines={1}>
            {post.artistName ?? ''}
          </AppText>
        </View>

        <View className="flex-row items-center gap-lg">
          <Pressable onPress={onPlay} hitSlop={8} disabled={!onPlay}>
            <Ionicons
              name={isPlaying ? 'pause' : 'play'}
              size={24}
              color={colors.textPrimary}
            />
          </Pressable>
          <Pressable onPress={onToggleLike} hitSlop={8} disabled={!onToggleLike}>
            <Ionicons
              name={isLiked ? 'heart' : 'heart-outline'}
              size={24}
              color={isLiked ? colors.accentPrimary : colors.textPrimary}
            />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

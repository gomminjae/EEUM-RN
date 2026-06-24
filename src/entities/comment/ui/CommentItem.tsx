import { View, Image, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText, colors } from '@/shared/ui';
import { formatDate } from '@/shared/lib/date';
import type { Comment } from '../model/types';

type CommentItemProps = {
  comment: Comment;
  isPlaying?: boolean;
  onPlay?: () => void;
  onReport?: () => void;
};

/** 원본 PostDetailCommentsView 의 댓글 셀 — 본문 + (첨부 음악) + 신고 */
export function CommentItem({ comment, isPlaying = false, onPlay, onReport }: CommentItemProps) {
  const hasMusic = !!comment.songName;

  return (
    <View className="flex-row items-start py-md gap-sm">
      <View className="flex-1 gap-xs">
        <AppText size={15}>{comment.content ?? ''}</AppText>

        {hasMusic && (
          <View className="flex-row items-center gap-sm p-sm mt-xs bg-content rounded-[10px]">
            {comment.artworkUrl ? (
              <Image source={{ uri: comment.artworkUrl }} className="w-[36px] h-[36px] rounded-[6px]" />
            ) : (
              <View className="w-[36px] h-[36px] rounded-[6px] bg-black/10" />
            )}
            <View className="flex-1">
              <AppText size={13} weight="semiBold" numberOfLines={1}>
                {comment.songName}
              </AppText>
              <AppText size={12} color="textFootnote" numberOfLines={1}>
                {comment.artistName ?? ''}
              </AppText>
            </View>
            {!!comment.appleMusicUrl && (
              <Pressable onPress={onPlay} hitSlop={8} disabled={!onPlay}>
                <Ionicons name={isPlaying ? 'pause' : 'play'} size={20} color={colors.textPrimary} />
              </Pressable>
            )}
          </View>
        )}

        <AppText size={12} color="textFootnote" className="mt-xs">
          {formatDate(comment.createdAt)}
        </AppText>
      </View>

      {onReport && (
        <Pressable onPress={onReport} hitSlop={8} className="pt-xs">
          <Ionicons name="ellipsis-horizontal" size={18} color={colors.textFootnote} />
        </Pressable>
      )}
    </View>
  );
}

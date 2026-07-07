import { memo } from 'react';
import { View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText, colors } from '@/shared/ui';
import type { Comment } from '../model/types';

type CommentItemProps = {
  comment: Comment;
  isPlaying?: boolean;
  onPlay?: (comment: Comment) => void;
  onReport?: (comment: Comment) => void;
};

/** 원본 CommentListItem 이식 — ♪ + 캡슐(곡 14 bold / 아티스트 13 gray / 재생 12) + 본문 14.
 *  롱프레스 → 신고 (원본 contextMenu). */
export const CommentItem = memo(function CommentItem({ comment, isPlaying = false, onPlay, onReport }: CommentItemProps) {
  return (
    <Pressable
      className="py-sm gap-[10px]"
      onLongPress={onReport ? () => onReport(comment) : undefined}
      delayLongPress={300}
    >
      <View className="flex-row items-center gap-sm">
        <Ionicons name="musical-note" size={14} color={colors.textPrimary} />
        <View className="flex-row items-center gap-sm self-start px-[16px] py-[10px] bg-content rounded-[999px]">
          <AppText size={14} weight="bold" numberOfLines={1}>
            {comment.songName ?? '제목 없음'}
          </AppText>
          <AppText size={13} color="textFootnote" numberOfLines={1}>
            {comment.artistName || '아티스트 미상'}
          </AppText>
          {!!comment.appleMusicUrl && (
            <Pressable onPress={() => onPlay?.(comment)} hitSlop={8}>
              <Ionicons name={isPlaying ? 'pause' : 'play'} size={12} color={colors.textPrimary} />
            </Pressable>
          )}
        </View>
      </View>

      {!!comment.content && (
        <AppText size={14} className="leading-[19px]">
          {comment.content}
        </AppText>
      )}
    </Pressable>
  );
});

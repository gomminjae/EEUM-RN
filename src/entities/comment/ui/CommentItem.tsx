import { memo } from 'react';
import { View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MenuView, type MenuAction } from '@expo/ui/community/menu';
import { AppImage, AppText, colors, images } from '@/shared/ui';
import type { Comment, CommentAction } from '../model/types';

type CommentItemProps = {
  comment: Comment;
  isPlaying?: boolean;
  isOwn?: boolean;
  onPlay?: (comment: Comment) => void;
  onAction?: (comment: Comment, action: CommentAction) => void;
};

const OTHER_USER_ACTIONS: MenuAction[] = [
  { id: 'report', title: '댓글 신고하기', image: 'flag' },
  {
    id: 'block',
    title: '이 사용자 차단',
    image: 'person.crop.circle.badge.xmark',
    attributes: { destructive: true },
  },
];

const OWN_ACTIONS: MenuAction[] = [
  {
    id: 'delete',
    title: '댓글 삭제',
    image: 'trash',
    attributes: { destructive: true },
  },
];

/** 원본 CommentListItem 이식 — ♪ + 캡슐(곡 14 bold / 아티스트 13 gray / 재생 12) + 본문 14.
 *  롱프레스 → 댓글 관리 (원본 contextMenu). */
export const CommentItem = memo(function CommentItem({ comment, isPlaying = false, isOwn = false, onPlay, onAction }: CommentItemProps) {
  const content = (
    <View className="py-sm gap-[10px]">
      <View className="flex-row items-center gap-sm">
        <AppImage source={images.musicnote} style={{ width: 14, height: 14 }} contentFit="contain" />
        <View className="flex-row items-center gap-sm self-start px-[16px] py-[10px] bg-content rounded-[999px]">
          <AppText size={14} weight="bold" style={{ color: colors.black }} numberOfLines={1}>
            {comment.songName ?? '제목 없음'}
          </AppText>
          <AppText size={13} style={{ color: colors.systemGray }} numberOfLines={1}>
            {comment.artistName || '아티스트 미상'}
          </AppText>
          {!!comment.appleMusicUrl && (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={isPlaying ? '음악 일시정지' : '음악 재생'}
              onPress={() => onPlay?.(comment)}
              hitSlop={8}
            >
              <Ionicons name={isPlaying ? 'pause' : 'play'} size={12} color={colors.black} />
            </Pressable>
          )}
        </View>
      </View>

      {!!comment.content && (
        <AppText size={14} style={{ color: colors.black }} className="leading-[19px]">
          {comment.content}
        </AppText>
      )}
    </View>
  );

  if (!onAction) return content;

  return (
    <MenuView
      actions={isOwn ? OWN_ACTIONS : OTHER_USER_ACTIONS}
      shouldOpenOnLongPress
      style={{ alignSelf: 'stretch' }}
      onPressAction={({ nativeEvent }) =>
        onAction(comment, nativeEvent.event as CommentAction)
      }
    >
      {content}
    </MenuView>
  );
});

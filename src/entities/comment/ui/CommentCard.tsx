import { memo } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MenuView, type MenuAction } from '@expo/ui/community/menu';
import { AppText, AppImage, colors } from '@/shared/ui';
import type { Comment, CommentAction } from '../model/types';

/** 원본 Color.gray.opacity(0.2) 커버 placeholder */
const PLACEHOLDER_BG = 'rgba(142,142,147,0.2)';

type CommentCardProps = {
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

/** 원본 CommentCard 이식 — 커버 150h + 중앙 재생(50x50) + 곡 13 semiBold / 아티스트 11 gray.
 *  롱프레스 → 댓글 관리. */
export const CommentCard = memo(function CommentCard({ comment, isPlaying = false, isOwn = false, onPlay, onAction }: CommentCardProps) {
  const content = (
    <View className="flex-1 gap-sm">
      <View
        className="rounded-[8px] overflow-hidden items-center justify-center"
        style={{ height: 150, backgroundColor: PLACEHOLDER_BG }}
      >
        {comment.artworkUrl ? (
          <AppImage source={{ uri: comment.artworkUrl }} recyclingKey={comment.artworkUrl} style={StyleSheet.absoluteFill} />
        ) : null}
        {!!comment.appleMusicUrl && (
          <Pressable
            className="w-[50px] h-[50px] rounded-[25px] bg-black/60 items-center justify-center"
            accessibilityRole="button"
            accessibilityLabel={isPlaying ? '음악 일시정지' : '음악 재생'}
            onPress={() => onPlay?.(comment)}
            hitSlop={8}
          >
            <Ionicons name={isPlaying ? 'pause' : 'play'} size={20} color="#FFFFFF" />
          </Pressable>
        )}
      </View>

      <View className="gap-[4px]">
        {!!comment.songName && (
          <AppText size={13} weight="semiBold" style={{ color: colors.black }} numberOfLines={1}>
            {comment.songName}
          </AppText>
        )}
        {!!comment.artistName && (
          <AppText size={11} style={{ color: colors.systemGray }} numberOfLines={1}>
            {comment.artistName}
          </AppText>
        )}
      </View>
    </View>
  );

  if (!onAction) return content;

  return (
    <MenuView
      actions={isOwn ? OWN_ACTIONS : OTHER_USER_ACTIONS}
      shouldOpenOnLongPress
      style={{ flex: 1 }}
      onPressAction={({ nativeEvent }) =>
        onAction(comment, nativeEvent.event as CommentAction)
      }
    >
      {content}
    </MenuView>
  );
});

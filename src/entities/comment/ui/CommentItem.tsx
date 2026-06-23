import { View, Image, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText, colors, spacing } from '@/shared/ui';
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
    <View style={styles.row}>
      <View style={styles.body}>
        <AppText size={15}>{comment.content ?? ''}</AppText>

        {hasMusic && (
          <View style={styles.music}>
            {comment.artworkUrl ? (
              <Image source={{ uri: comment.artworkUrl }} style={styles.artwork} />
            ) : (
              <View style={[styles.artwork, styles.artworkEmpty]} />
            )}
            <View style={styles.musicInfo}>
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

        <AppText size={12} color="textFootnote" style={styles.date}>
          {formatDate(comment.createdAt)}
        </AppText>
      </View>

      {onReport && (
        <Pressable onPress={onReport} hitSlop={8} style={styles.report}>
          <Ionicons name="ellipsis-horizontal" size={18} color={colors.textFootnote} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: spacing.md, gap: spacing.sm },
  body: { flex: 1, gap: spacing.xs },
  music: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.sm,
    marginTop: spacing.xs,
    backgroundColor: colors.contentBackground,
    borderRadius: 10,
  },
  artwork: { width: 36, height: 36, borderRadius: 6 },
  artworkEmpty: { backgroundColor: 'rgba(0,0,0,0.1)' },
  musicInfo: { flex: 1 },
  date: { marginTop: spacing.xs },
  report: { paddingTop: spacing.xs },
});

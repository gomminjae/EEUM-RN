import { View, Image, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText, colors, spacing } from '@/shared/ui';
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
    <Pressable style={styles.card} onPress={onPress} disabled={!onPress}>
      <AppText size={22} weight="bold" numberOfLines={2}>
        {post.title ?? '제목 없음'}
      </AppText>

      {post.content != null && (
        <AppText size={15} color="textFootnote" numberOfLines={4} style={styles.content}>
          {post.content}
        </AppText>
      )}

      <View style={styles.player}>
        {post.artworkUrl ? (
          <Image source={{ uri: post.artworkUrl }} style={styles.artwork} />
        ) : (
          <View style={[styles.artwork, styles.artworkEmpty]} />
        )}

        <View style={styles.songInfo}>
          <AppText size={16} weight="semiBold" numberOfLines={1}>
            {post.songName ?? '음악 정보 없음'}
          </AppText>
          <AppText size={14} color="textFootnote" numberOfLines={1}>
            {post.artistName ?? ''}
          </AppText>
        </View>

        <View style={styles.actions}>
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

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.mainBackground,
    borderRadius: 20,
    padding: spacing.lg,
    gap: spacing.md,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  content: { lineHeight: 21 },
  player: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.contentBackground,
    borderRadius: 12,
  },
  artwork: { width: 60, height: 60, borderRadius: 8 },
  artworkEmpty: { backgroundColor: 'rgba(0,0,0,0.1)' },
  songInfo: { flex: 1, gap: spacing.xs },
  actions: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
});

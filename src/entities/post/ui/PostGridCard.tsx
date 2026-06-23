import { View, Image, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText, colors, spacing } from '@/shared/ui';
import type { Post } from '../model/types';

type PostGridCardProps = {
  post: Post;
  showHeart?: boolean;
  onPress?: () => void;
};

/** 원본 MyPostCard 이식 — 2열 그리드용 정사각 썸네일 + 제목/곡 */
export function PostGridCard({ post, showHeart = false, onPress }: PostGridCardProps) {
  return (
    <Pressable style={styles.card} onPress={onPress} disabled={!onPress}>
      <View style={styles.artworkWrap}>
        {post.artworkUrl ? (
          <Image source={{ uri: post.artworkUrl }} style={styles.artwork} />
        ) : (
          <View style={[styles.artwork, styles.artworkEmpty]}>
            <Ionicons name="musical-note" size={24} color={colors.textFootnote} />
          </View>
        )}
      </View>

      <View style={styles.titleRow}>
        <AppText size={13} weight="semiBold" numberOfLines={1} style={styles.flex}>
          {post.title ?? '제목 없음'}
        </AppText>
        {showHeart && <Ionicons name="heart" size={12} color={colors.accentPrimary} />}
      </View>

      {(post.songName || post.artistName) && (
        <View style={styles.songRow}>
          {!!post.songName && (
            <AppText size={11} weight="medium" numberOfLines={1}>
              {post.songName}
            </AppText>
          )}
          {!!post.artistName && (
            <AppText size={11} color="textFootnote" numberOfLines={1} style={styles.flex}>
              {post.artistName}
            </AppText>
          )}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, gap: spacing.sm },
  artworkWrap: { aspectRatio: 1, borderRadius: 12, overflow: 'hidden' },
  artwork: { width: '100%', height: '100%' },
  artworkEmpty: { backgroundColor: 'rgba(0,0,0,0.08)', alignItems: 'center', justifyContent: 'center' },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  songRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  flex: { flex: 1 },
});

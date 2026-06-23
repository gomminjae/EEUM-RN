import { View, Image, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText, colors, spacing } from '@/shared/ui';
import type { Post } from '../model/types';

type PostRowProps = {
  post: Post;
  subtitle?: string;
  onPress?: () => void;
};

/** 원본 CommentedPostRow 이식 — 썸네일 + 제목 + 보조문구 + chevron */
export function PostRow({ post, subtitle = '참여한 사연과 플레이리스트입니다.', onPress }: PostRowProps) {
  return (
    <Pressable style={styles.row} onPress={onPress} disabled={!onPress}>
      {post.artworkUrl ? (
        <Image source={{ uri: post.artworkUrl }} style={styles.artwork} />
      ) : (
        <View style={[styles.artwork, styles.artworkEmpty]} />
      )}
      <View style={styles.info}>
        <AppText size={15} weight="semiBold" numberOfLines={1}>
          {post.title ?? '사연 제목'}
        </AppText>
        <AppText size={12} color="textFootnote" numberOfLines={1}>
          {subtitle}
        </AppText>
      </View>
      <Ionicons name="chevron-forward" size={14} color={colors.textFootnote} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.contentBackground,
    borderRadius: 16,
  },
  artwork: { width: 56, height: 56, borderRadius: 10 },
  artworkEmpty: { backgroundColor: 'rgba(0,0,0,0.1)' },
  info: { flex: 1, gap: spacing.xs },
});

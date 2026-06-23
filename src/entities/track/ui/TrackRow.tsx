import { View, Image, Pressable, StyleSheet } from 'react-native';
import { AppText, colors, spacing } from '@/shared/ui';
import type { Music } from '../model/types';

type TrackRowProps = {
  music: Music;
  onPress?: () => void;
};

/** 원본 SearchResultRow 이식 — 앨범아트 + 곡/아티스트 */
export function TrackRow({ music, onPress }: TrackRowProps) {
  return (
    <Pressable style={styles.row} onPress={onPress} disabled={!onPress}>
      {music.artworkUrl ? (
        <Image source={{ uri: music.artworkUrl }} style={styles.artwork} />
      ) : (
        <View style={[styles.artwork, styles.artworkEmpty]} />
      )}
      <View style={styles.info}>
        <AppText size={15} weight="semiBold" numberOfLines={1}>
          {music.songName}
        </AppText>
        <AppText size={13} color="textFootnote" numberOfLines={1}>
          {music.artistName}
        </AppText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: spacing.sm },
  artwork: { width: 48, height: 48, borderRadius: 6 },
  artworkEmpty: { backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: 6 },
  info: { flex: 1 },
});

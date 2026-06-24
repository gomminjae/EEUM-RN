import { View, Pressable } from 'react-native';
import { AppText, AppImage } from '@/shared/ui';
import type { Music } from '../model/types';

type TrackRowProps = {
  music: Music;
  onPress?: () => void;
};

/** 원본 SearchResultRow 이식 — 앨범아트 + 곡/아티스트 */
export function TrackRow({ music, onPress }: TrackRowProps) {
  return (
    <Pressable
      className="flex-row items-center gap-md py-sm"
      onPress={onPress}
      disabled={!onPress}
    >
      {music.artworkUrl ? (
        <AppImage source={{ uri: music.artworkUrl }} recyclingKey={music.artworkUrl} className="w-12 h-12 rounded-md" />
      ) : (
        <View className="w-12 h-12 rounded-md bg-black/10" />
      )}
      <View className="flex-1">
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

import { memo } from 'react';
import { View, Pressable } from 'react-native';
import { AppText, AppImage } from '@/shared/ui';
import type { Music } from '../model/types';

type TrackRowProps = {
  music: Music;
  onPress?: (music: Music) => void;
};

/** 원본 MusicRow 이식 — 앨범아트 60×60 + 곡(17 medium)/아티스트(15 secondary) */
export const TrackRow = memo(function TrackRow({ music, onPress }: TrackRowProps) {
  return (
    <Pressable
      className="flex-row items-center gap-[12px] px-[16px] py-[12px]"
      onPress={onPress ? () => onPress(music) : undefined}
      disabled={!onPress}
    >
      {music.artworkUrl ? (
        <AppImage source={{ uri: music.artworkUrl }} recyclingKey={music.artworkUrl} className="w-[60px] h-[60px] rounded-[8px]" />
      ) : (
        <View className="w-[60px] h-[60px] rounded-[8px] bg-system-gray-5" />
      )}
      <View className="flex-1 gap-xs">
        <AppText size={17} weight="medium" color="black" numberOfLines={1}>
          {music.songName}
        </AppText>
        <AppText size={15} color="secondaryLabel" numberOfLines={1}>
          {music.artistName}
        </AppText>
      </View>
    </Pressable>
  );
});

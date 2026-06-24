import { View, Image, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText, colors } from '@/shared/ui';
import type { Post } from '../model/types';

type PostRowProps = {
  post: Post;
  subtitle?: string;
  onPress?: () => void;
};

/** 원본 CommentedPostRow 이식 — 썸네일 + 제목 + 보조문구 + chevron */
export function PostRow({ post, subtitle = '참여한 사연과 플레이리스트입니다.', onPress }: PostRowProps) {
  return (
    <Pressable className="flex-row items-center gap-md p-md bg-content rounded-[16px]" onPress={onPress} disabled={!onPress}>
      {post.artworkUrl ? (
        <Image source={{ uri: post.artworkUrl }} className="w-[56px] h-[56px] rounded-[10px]" />
      ) : (
        <View className="w-[56px] h-[56px] rounded-[10px] bg-black/10" />
      )}
      <View className="flex-1 gap-xs">
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

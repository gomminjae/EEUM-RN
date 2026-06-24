import { useCallback, useState } from 'react';
import { View, TextInput, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppText, colors } from '@/shared/ui';

const hairline = StyleSheet.hairlineWidth;
import type { Music } from '@/entities/track';
import { useMusicPicker } from '@/features/music-search';
import type { RootStackParamList } from '@/shared/config/navigation';
import { useCreateComment } from '../model/useCommentActions';

/** 원본 PostDetailCommentInputBar 이식 — 텍스트 + 음악 첨부 댓글 입력 */
export function CommentInputBar({ postId }: { postId: string }) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const consumePicked = useMusicPicker((s) => s.consume);
  const [text, setText] = useState('');
  const [music, setMusic] = useState<Music | null>(null);
  const createComment = useCreateComment(postId);

  // 음악 검색 복귀 시 흡수
  useFocusEffect(
    useCallback(() => {
      const picked = consumePicked();
      if (picked) setMusic(picked);
    }, [consumePicked]),
  );

  const canSend = (text.trim().length > 0 || !!music) && !createComment.isPending;

  const submit = () => {
    if (!canSend) return;
    createComment.mutate(
      {
        content: text.trim(),
        albumName: music?.albumName,
        songName: music?.songName,
        artistName: music?.artistName,
        artworkUrl: music?.artworkUrl,
        appleMusicUrl: music?.previewMusicUrl,
      },
      {
        onSuccess: () => {
          setText('');
          setMusic(null);
        },
      },
    );
  };

  return (
    <View className="border-t border-t-black/10 bg-main" style={{ borderTopWidth: hairline }}>
      {music && (
        <View className="flex-row items-center gap-sm mx-md mt-sm px-md py-sm bg-content rounded-[999px]">
          <Ionicons name="musical-note" size={13} color={colors.textPrimary} />
          <AppText size={13} numberOfLines={1} className="flex-1">
            {music.songName} · {music.artistName}
          </AppText>
          <Pressable onPress={() => setMusic(null)} hitSlop={8}>
            <Ionicons name="close" size={14} color={colors.textFootnote} />
          </Pressable>
        </View>
      )}
      <View className="flex-row items-end gap-sm px-md py-sm">
        <Pressable onPress={() => navigation.navigate('Search')} hitSlop={8} className="pb-sm">
          <Ionicons name="musical-notes-outline" size={22} color={colors.textPrimary} />
        </Pressable>
        <TextInput
          className="flex-1 max-h-[120px] min-h-[40px] px-md py-sm bg-content rounded-[20px] font-regular text-[15px] text-primary"
          value={text}
          onChangeText={setText}
          placeholder="댓글을 입력하세요"
          placeholderTextColor={colors.textFootnote}
          multiline
          returnKeyType="send"
          onSubmitEditing={submit}
        />
        <Pressable onPress={submit} disabled={!canSend} hitSlop={8} className="pb-xs">
          <Ionicons
            name="arrow-up-circle"
            size={32}
            color={canSend ? colors.accentPrimary : colors.textFootnote}
          />
        </Pressable>
      </View>
    </View>
  );
}

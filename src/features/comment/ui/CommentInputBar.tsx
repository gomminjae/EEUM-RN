import { useCallback, useState } from 'react';
import { View, TextInput, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppText, colors, fonts, spacing } from '@/shared/ui';
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
    <View style={styles.wrap}>
      {music && (
        <View style={styles.musicChip}>
          <Ionicons name="musical-note" size={13} color={colors.textPrimary} />
          <AppText size={13} numberOfLines={1} style={styles.flex}>
            {music.songName} · {music.artistName}
          </AppText>
          <Pressable onPress={() => setMusic(null)} hitSlop={8}>
            <Ionicons name="close" size={14} color={colors.textFootnote} />
          </Pressable>
        </View>
      )}
      <View style={styles.bar}>
        <Pressable onPress={() => navigation.navigate('Search')} hitSlop={8} style={styles.attach}>
          <Ionicons name="musical-notes-outline" size={22} color={colors.textPrimary} />
        </Pressable>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder="댓글을 입력하세요"
          placeholderTextColor={colors.textFootnote}
          multiline
          returnKeyType="send"
          onSubmitEditing={submit}
        />
        <Pressable onPress={submit} disabled={!canSend} hitSlop={8} style={styles.send}>
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

const styles = StyleSheet.create({
  wrap: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0,0,0,0.1)',
    backgroundColor: colors.mainBackground,
  },
  musicChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.contentBackground,
    borderRadius: 999,
  },
  bar: { flexDirection: 'row', alignItems: 'flex-end', gap: spacing.sm, paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  attach: { paddingBottom: spacing.sm },
  input: {
    flex: 1,
    maxHeight: 120,
    minHeight: 40,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.contentBackground,
    borderRadius: 20,
    fontFamily: fonts.pretendard.regular,
    fontSize: 15,
    color: colors.textPrimary,
  },
  send: { paddingBottom: spacing.xs },
  flex: { flex: 1 },
});

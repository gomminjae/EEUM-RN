import { useCallback, useLayoutEffect, useState } from 'react';
import { View, TextInput, Pressable, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppText, colors, fonts, spacing } from '@/shared/ui';
import type { Music } from '@/entities/track';
import { usePostDetail, type PostDetail } from '@/entities/post';
import { useMusicPicker } from '@/features/music-search';
import { useManagePost } from '@/features/manage-post';
import type { RootStackParamList } from '@/shared/config/navigation';

const MAX = 200;
type Props = NativeStackScreenProps<RootStackParamList, 'EditPost'>;

/** 원본 PostEditSheet 이식 — 제목/내용/음악 변경 (풀스크린, 음악검색 연동) */
export function EditPostScreen({ route }: Props) {
  const { postId } = route.params;
  const { data: detail, isLoading } = usePostDetail(postId);

  if (isLoading || !detail) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.accentPrimary} />
      </View>
    );
  }
  return <EditForm postId={postId} detail={detail} />;
}

function EditForm({ postId, detail }: { postId: string; detail: PostDetail }) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const consumePicked = useMusicPicker((s) => s.consume);
  const { update } = useManagePost(postId);

  const [title, setTitle] = useState(detail.title);
  const [content, setContent] = useState(detail.content);
  const [music, setMusic] = useState<Music | null>(
    detail.songName
      ? {
          albumName: '',
          songName: detail.songName,
          artistName: detail.artistName,
          artworkUrl: detail.artworkUrl,
          previewMusicUrl: detail.appleMusicUrl,
        }
      : null,
  );

  // 음악 검색에서 고른 곡 흡수
  useFocusEffect(
    useCallback(() => {
      const picked = consumePicked();
      if (picked) setMusic(picked);
    }, [consumePicked]),
  );

  const canSave = title.trim().length > 0 && !update.isPending;

  const save = () => {
    if (!canSave) return;
    update.mutate(
      {
        title: title.trim(),
        content: content.trim(),
        albumName: music?.albumName ?? '',
        songName: music?.songName ?? '',
        artistName: music?.artistName ?? '',
        artworkUrl: music?.artworkUrl ?? '',
        appleMusicUrl: music?.previewMusicUrl ?? '',
      },
      { onSuccess: () => navigation.goBack() },
    );
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={save} disabled={!canSave} hitSlop={8}>
          <AppText size={16} weight="semiBold" style={{ color: canSave ? colors.accentPrimary : colors.textFootnote }}>
            완료
          </AppText>
        </Pressable>
      ),
    });
  }, [navigation, title, content, music, canSave]);

  return (
    <View style={styles.container}>
      {music ? (
        <View style={styles.musicPill}>
          <Ionicons name="musical-note" size={14} color={colors.textPrimary} />
          <AppText size={14} weight="medium" numberOfLines={1} style={styles.flex}>
            {music.songName} {music.artistName}
          </AppText>
          <Pressable onPress={() => setMusic(null)} hitSlop={8}>
            <Ionicons name="close" size={14} color={colors.textPrimary} />
          </Pressable>
        </View>
      ) : (
        <Pressable style={styles.musicAdd} onPress={() => navigation.navigate('Search')}>
          <Ionicons name="add" size={18} color={colors.accentPrimary} />
          <AppText size={14} color="accentPrimary">
            음악 선택
          </AppText>
        </Pressable>
      )}

      <TextInput
        style={styles.title}
        value={title}
        onChangeText={setTitle}
        placeholder="사연의 제목을 작성해 주세요"
        placeholderTextColor={colors.textFootnote}
      />
      <TextInput
        style={styles.content}
        value={content}
        onChangeText={(t) => setContent(t.slice(0, MAX))}
        placeholder="자유롭게 사연을 작성해주세요"
        placeholderTextColor={colors.textFootnote}
        multiline
      />
      <AppText size={12} color="textFootnote" style={styles.counter}>
        {content.length}/{MAX}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.mainBackground, padding: spacing.lg, gap: spacing.md },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.mainBackground },
  flex: { flex: 1 },
  musicPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.contentBackground,
    borderRadius: 999,
    maxWidth: '100%',
  },
  musicAdd: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.contentBackground,
    borderRadius: 999,
  },
  title: {
    fontFamily: fonts.pretendard.semiBold,
    fontSize: 20,
    color: colors.textPrimary,
    paddingVertical: spacing.sm,
  },
  content: {
    minHeight: 160,
    textAlignVertical: 'top',
    fontFamily: fonts.pretendard.regular,
    fontSize: 15,
    color: colors.textPrimary,
    lineHeight: 22,
  },
  counter: { textAlign: 'right' },
});

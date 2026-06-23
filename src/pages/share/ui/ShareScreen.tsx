import { useCallback, useState } from 'react';
import {
  View,
  ScrollView,
  TextInput,
  Pressable,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppText, colors, fonts, spacing } from '@/shared/ui';
import type { Music } from '@/entities/track';
import { useMusicPicker } from '@/features/music-search';
import { CompletionSheet, useShareStory, type CompletionType } from '@/features/share-post';
import type { RootStackParamList } from '@/shared/config/navigation';

const MAX_STORY = 200;
type Nav = NativeStackNavigationProp<RootStackParamList>;

export function ShareScreen() {
  const navigation = useNavigation<Nav>();
  const consumePicked = useMusicPicker((s) => s.consume);
  const share = useShareStory();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [story, setStory] = useState('');
  const [music, setMusic] = useState<Music | null>(null);
  const [sheet, setSheet] = useState(false);
  const [done, setDone] = useState(false);

  // 검색 화면에서 고른 음악을 복귀 시점에 흡수
  useFocusEffect(
    useCallback(() => {
      const picked = consumePicked();
      if (picked) setMusic(picked);
    }, [consumePicked]),
  );

  const openSettings = () => {
    const missing: string[] = [];
    if (!music) missing.push('음악');
    if (!title.trim()) missing.push('제목');
    if (!story.trim()) missing.push('내용');
    if (missing.length) {
      Alert.alert('입력 필요', `${missing.join(', ')}을(를) 입력해 주세요.`);
      return;
    }
    setSheet(true);
  };

  const submit = (completionType: CompletionType, commentCountLimit: number) => {
    share.mutate(
      { title: title.trim(), description: description.trim(), story: story.trim(), music, completionType, commentCountLimit },
      {
        onSuccess: () => {
          setSheet(false);
          setTitle('');
          setDescription('');
          setStory('');
          setMusic(null);
          setDone(true);
          setTimeout(() => setDone(false), 1500);
        },
        onError: () => Alert.alert('공유 실패', '잠시 후 다시 시도해주세요'),
      },
    );
  };

  if (done) {
    return (
      <View style={styles.doneView}>
        <AppText size={18} weight="semiBold">
          나의 이야기 공유 완료!
        </AppText>
        <AppText size={14} style={styles.doneBody}>
          이제 기다릴 시간이에요.{'\n'}친구들이 당신의 이야기에 어울리는 음악을 얹고 있어요.
        </AppText>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Pressable style={styles.musicBox} onPress={() => navigation.navigate('Search')}>
          {music ? (
            <>
              {music.artworkUrl ? (
                <Image source={{ uri: music.artworkUrl }} style={styles.artwork} />
              ) : (
                <View style={[styles.artwork, styles.artworkEmpty]} />
              )}
              <View style={styles.flex}>
                <AppText size={15} weight="semiBold" numberOfLines={1}>
                  {music.songName}
                </AppText>
                <AppText size={13} color="textFootnote" numberOfLines={1}>
                  {music.artistName}
                </AppText>
              </View>
              <AppText size={13} color="accentPrimary">
                변경
              </AppText>
            </>
          ) : (
            <AppText color="textFootnote">+ 음악 선택</AppText>
          )}
        </Pressable>

        <TextInput
          style={styles.title}
          value={title}
          onChangeText={setTitle}
          placeholder="제목"
          placeholderTextColor={colors.textFootnote}
        />
        <TextInput
          style={styles.title}
          value={description}
          onChangeText={setDescription}
          placeholder="한 줄 소개 (선택)"
          placeholderTextColor={colors.textFootnote}
        />
        <TextInput
          style={styles.story}
          value={story}
          onChangeText={(t) => setStory(t.slice(0, MAX_STORY))}
          placeholder="당신의 이야기를 들려주세요"
          placeholderTextColor={colors.textFootnote}
          multiline
        />
        <AppText size={12} color="textFootnote" style={styles.counter}>
          {story.length}/{MAX_STORY}
        </AppText>

        <Pressable style={styles.shareButton} onPress={openSettings}>
          <AppText weight="semiBold" style={{ color: '#FFFFFF' }}>
            공유하기
          </AppText>
        </Pressable>
      </ScrollView>

      <CompletionSheet
        visible={sheet}
        pending={share.isPending}
        onClose={() => setSheet(false)}
        onConfirm={submit}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { padding: spacing.lg, gap: spacing.md, backgroundColor: colors.mainBackground },
  musicBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.contentBackground,
    borderRadius: 12,
    minHeight: 72,
  },
  artwork: { width: 48, height: 48, borderRadius: 6 },
  artworkEmpty: { backgroundColor: 'rgba(0,0,0,0.1)' },
  title: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.contentBackground,
    borderRadius: 12,
    fontFamily: fonts.pretendard.semiBold,
    fontSize: 16,
    color: colors.textPrimary,
  },
  story: {
    minHeight: 140,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.contentBackground,
    borderRadius: 12,
    textAlignVertical: 'top',
    fontFamily: fonts.pretendard.regular,
    fontSize: 15,
    color: colors.textPrimary,
  },
  counter: { textAlign: 'right' },
  shareButton: {
    marginTop: spacing.sm,
    alignItems: 'center',
    paddingVertical: spacing.md,
    backgroundColor: colors.accentPrimary,
    borderRadius: 12,
  },
  doneView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    padding: spacing.xl,
    backgroundColor: colors.mainBackground,
  },
  doneBody: { textAlign: 'center', lineHeight: 22 },
});

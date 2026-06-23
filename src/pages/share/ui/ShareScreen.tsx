import { useCallback, useState } from 'react';
import {
  View,
  ScrollView,
  TextInput,
  Pressable,
  Image,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppText, colors, fonts, images, spacing } from '@/shared/ui';
import type { Music } from '@/entities/track';
import { useMusicPicker } from '@/features/music-search';
import { CompletionSheet, useShareStory, type CompletionType } from '@/features/share-post';
import type { RootStackParamList } from '@/shared/config/navigation';

const MAX_STORY = 200;
type Nav = NativeStackNavigationProp<RootStackParamList>;

/** 원본 ShareView 이식 — 우상단 원형 음악버튼 + 베이지 단일카드(제목/본문)
 *  + 카드 아래 글자수 + 검정 캡슐 share 버튼.
 *  좌상단 home 으로 뒤로가기, 완료 시 fullscreen 안내 후 자동 pop. */
export function ShareScreen() {
  const navigation = useNavigation<Nav>();
  const consumePicked = useMusicPicker((s) => s.consume);
  const share = useShareStory();

  const [title, setTitle] = useState('');
  const [story, setStory] = useState('');
  const [music, setMusic] = useState<Music | null>(null);
  const [sheet, setSheet] = useState(false);
  const [done, setDone] = useState(false);

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
      Alert.alert('입력 확인', `${missing.join(', ')}을(를) 입력해 주세요.`);
      return;
    }
    Keyboard.dismiss();
    setSheet(true);
  };

  const submit = (completionType: CompletionType, commentCountLimit: number) => {
    share.mutate(
      {
        title: title.trim(),
        description: '',
        story: story.trim(),
        music,
        completionType,
        commentCountLimit,
      },
      {
        onSuccess: () => {
          setSheet(false);
          setTitle('');
          setStory('');
          setMusic(null);
          setDone(true);
          setTimeout(() => {
            setDone(false);
            navigation.goBack();
          }, 1500);
        },
        onError: () => Alert.alert('공유 실패', '잠시 후 다시 시도해주세요'),
      },
    );
  };

  if (done) {
    return <ShareCompleteView />;
  }

  return (
    <ShareForm
      title={title}
      story={story}
      music={music}
      pending={share.isPending}
      sheetVisible={sheet}
      onTitleChange={setTitle}
      onStoryChange={(t) => setStory(t.slice(0, MAX_STORY))}
      onPickMusic={() => navigation.navigate('Search')}
      onSubmit={openSettings}
      onConfirm={submit}
      onCloseSheet={() => setSheet(false)}
      onBack={() => navigation.goBack()}
    />
  );
}

type FormProps = {
  title: string;
  story: string;
  music: Music | null;
  pending: boolean;
  sheetVisible: boolean;
  onTitleChange: (t: string) => void;
  onStoryChange: (t: string) => void;
  onPickMusic: () => void;
  onSubmit: () => void;
  onConfirm: (type: CompletionType, limit: number) => void;
  onCloseSheet: () => void;
  onBack: () => void;
};

function ShareForm(p: FormProps) {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <View style={styles.topBar}>
        <Pressable onPress={p.onBack} hitSlop={8} style={styles.topBarButton}>
          <Image source={images.home} style={styles.topBarIcon} resizeMode="contain" />
        </Pressable>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Pressable style={styles.flex} onPress={Keyboard.dismiss} accessible={false}>
          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="interactive"
          >
            <View style={styles.musicRow}>
              <Pressable onPress={p.onPickMusic} hitSlop={8}>
                <View style={styles.musicCircle}>
                  {p.music?.artworkUrl ? (
                    <Image source={{ uri: p.music.artworkUrl }} style={styles.musicArtwork} />
                  ) : (
                    <Ionicons name="pulse" size={24} color={colors.textPrimary} />
                  )}
                  <View style={styles.plusBadge}>
                    <AppText size={12} weight="bold" style={styles.plusText}>
                      +
                    </AppText>
                  </View>
                </View>
              </Pressable>
            </View>

            <View style={styles.card}>
              <TextInput
                style={styles.titleInput}
                value={p.title}
                onChangeText={p.onTitleChange}
                placeholder="사연의 제목을 작성해 주세요"
                placeholderTextColor={colors.textFootnote}
              />
              <TextInput
                style={styles.storyInput}
                value={p.story}
                onChangeText={p.onStoryChange}
                placeholder=" 200자 이내로 자유롭게 공유하고싶은 사연을 작성해주세요"
                placeholderTextColor={colors.textFootnote}
                multiline
                textAlignVertical="top"
              />
            </View>

            <AppText size={12} color="textFootnote" style={styles.counter}>
              {p.story.length}/{MAX_STORY}
            </AppText>
          </ScrollView>
        </Pressable>

        <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, spacing.md) }]}>
          <Pressable
            style={[styles.shareButton, p.pending && styles.shareButtonDisabled]}
            onPress={p.onSubmit}
            disabled={p.pending}
          >
            {p.pending ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <AppText weight="semiBold" style={styles.shareLabel}>
                share
              </AppText>
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>

      <CompletionSheet
        visible={p.sheetVisible}
        pending={p.pending}
        onClose={p.onCloseSheet}
        onConfirm={p.onConfirm}
      />
    </SafeAreaView>
  );
}

/** 원본 ShareCompleteView — 1.5초 후 home 으로 자동 dismiss */
function ShareCompleteView() {
  return (
    <View style={styles.doneRoot}>
      <AppText size={18} weight="semiBold">
        나의 이야기 공유 완료!
      </AppText>
      <AppText size={14} style={styles.doneBody}>
        이제 기다릴 시간이에요.{'\n'}친구들이 당신의 이야기에 어울리는 음악을 얹고
        있어요.{'\n'}다 완성되면, 세상에 단 하나뿐인 플레이리스트가 도착합니다.
      </AppText>
    </View>
  );
}

const CARD_BG = 'rgba(234,232,224,0.5)';

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.mainBackground },
  flex: { flex: 1 },

  topBar: {
    height: 44,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  topBarButton: { padding: spacing.xs },
  topBarIcon: { width: 24, height: 24, tintColor: colors.textPrimary },

  scroll: {
    paddingHorizontal: 24,
    paddingTop: 4,
    paddingBottom: spacing.lg,
  },

  musicRow: { alignItems: 'flex-end' },
  musicCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.contentBackground,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
  musicArtwork: { width: 64, height: 64, borderRadius: 32 },
  plusBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.accentPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusText: { color: '#FFFFFF', lineHeight: 14 },

  card: {
    marginTop: 32,
    padding: 20,
    minHeight: 250,
    borderRadius: 20,
    backgroundColor: CARD_BG,
    gap: 12,
  },
  titleInput: {
    fontFamily: fonts.pretendard.semiBold,
    fontSize: 20,
    color: colors.textPrimary,
    padding: 0,
  },
  storyInput: {
    flex: 1,
    minHeight: 160,
    fontFamily: fonts.pretendard.regular,
    fontSize: 15,
    color: colors.textPrimary,
    lineHeight: 22,
    padding: 0,
  },
  counter: { marginTop: spacing.sm, textAlign: 'left' },

  bottomBar: {
    paddingHorizontal: 32,
    paddingTop: spacing.sm,
    backgroundColor: colors.mainBackground,
  },
  shareButton: {
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.textPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareButtonDisabled: { opacity: 0.6 },
  shareLabel: { color: '#FFFFFF', fontSize: 16 },

  doneRoot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    paddingHorizontal: 32,
    backgroundColor: colors.mainBackground,
  },
  doneBody: { textAlign: 'center', lineHeight: 22 },
});

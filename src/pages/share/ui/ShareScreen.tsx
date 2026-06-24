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
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppText, colors, images, spacing } from '@/shared/ui';
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
    <SafeAreaView className="flex-1 bg-main" edges={['top']}>
      <View className="h-[44px] px-md flex-row items-center">
        <Pressable onPress={p.onBack} hitSlop={8} className="p-xs">
          <Image
            source={images.home}
            className="w-[24px] h-[24px]"
            style={{ tintColor: colors.textPrimary }}
            resizeMode="contain"
          />
        </Pressable>
      </View>

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Pressable className="flex-1" onPress={Keyboard.dismiss} accessible={false}>
          <ScrollView
            contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 4, paddingBottom: spacing.lg }}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="interactive"
          >
            <View className="items-end">
              <Pressable onPress={p.onPickMusic} hitSlop={8}>
                <View className="w-[64px] h-[64px] rounded-[32px] bg-content items-center justify-center overflow-visible">
                  {p.music?.artworkUrl ? (
                    <Image source={{ uri: p.music.artworkUrl }} className="w-[64px] h-[64px] rounded-[32px]" />
                  ) : (
                    <Ionicons name="pulse" size={24} color={colors.textPrimary} />
                  )}
                  <View className="absolute top-[-5px] right-[-5px] w-[20px] h-[20px] rounded-[10px] bg-accent items-center justify-center">
                    <AppText size={12} weight="bold" className="text-white leading-[14px]">
                      +
                    </AppText>
                  </View>
                </View>
              </Pressable>
            </View>

            <View className="mt-[32px] p-[20px] min-h-[250px] rounded-[20px] bg-[#EAE8E0]/50 gap-[12px]">
              <TextInput
                className="font-semibold text-[20px] text-primary p-0"
                value={p.title}
                onChangeText={p.onTitleChange}
                placeholder="사연의 제목을 작성해 주세요"
                placeholderTextColor={colors.textFootnote}
              />
              <TextInput
                className="flex-1 min-h-[160px] font-regular text-[15px] text-primary leading-[22px] p-0"
                value={p.story}
                onChangeText={p.onStoryChange}
                placeholder=" 200자 이내로 자유롭게 공유하고싶은 사연을 작성해주세요"
                placeholderTextColor={colors.textFootnote}
                multiline
                textAlignVertical="top"
              />
            </View>

            <AppText size={12} color="textFootnote" className="mt-sm text-left">
              {p.story.length}/{MAX_STORY}
            </AppText>
          </ScrollView>
        </Pressable>

        <View
          className="px-[32px] pt-sm bg-main"
          style={{ paddingBottom: Math.max(insets.bottom, spacing.md) }}
        >
          <Pressable
            className="h-[56px] rounded-[28px] bg-primary items-center justify-center"
            style={p.pending ? { opacity: 0.6 } : undefined}
            onPress={p.onSubmit}
            disabled={p.pending}
          >
            {p.pending ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <AppText weight="semiBold" className="text-white text-[16px]">
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
    <View className="flex-1 items-center justify-center gap-md px-[32px] bg-main">
      <AppText size={18} weight="semiBold">
        나의 이야기 공유 완료!
      </AppText>
      <AppText size={14} className="text-center leading-[22px]">
        이제 기다릴 시간이에요.{'\n'}친구들이 당신의 이야기에 어울리는 음악을 얹고
        있어요.{'\n'}다 완성되면, 세상에 단 하나뿐인 플레이리스트가 도착합니다.
      </AppText>
    </View>
  );
}

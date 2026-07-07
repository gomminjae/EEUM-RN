import { useCallback, useLayoutEffect, useState } from 'react';
import { View, TextInput, Pressable, ActivityIndicator } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppText, colors, spacing } from '@/shared/ui';
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
      <View className="flex-1 items-center justify-center bg-main">
        <ActivityIndicator color={colors.accentPrimary} />
      </View>
    );
  }
  return <EditForm postId={postId} detail={detail} />;
}

function EditForm({ postId, detail }: { postId: string; detail: PostDetail }) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
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

  // 원본 PostEditSheet: back chevron.left size18 black, 헤더 우측 완료 버튼 없음(하단 캡슐로 이동)
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: undefined,
      headerLeft: () => (
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <Ionicons name="chevron-back" size={18} color="#000000" />
        </Pressable>
      ),
    });
  }, [navigation]);

  return (
    <View className="flex-1 bg-main">
      {/* 음악 섹션 */}
      <View className="flex-row px-lg pt-[20px]">
        {music ? (
          <View className="flex-row items-center gap-sm self-start px-md py-[10px] bg-content rounded-[999px] max-w-full">
            <Ionicons name="musical-note" size={14} color={colors.textPrimary} />
            <AppText size={14} weight="medium" numberOfLines={1}>
              {music.songName} {music.artistName}
            </AppText>
            <Pressable onPress={() => setMusic(null)} hitSlop={8}>
              <Ionicons name="close" size={10} color={colors.textPrimary} />
            </Pressable>
          </View>
        ) : (
          <Pressable onPress={() => navigation.navigate('Search')} hitSlop={8}>
            <View className="w-[64px] h-[64px] rounded-[32px] bg-content items-center justify-center overflow-visible">
              <MaterialCommunityIcons name="waveform" size={20} color={colors.textPrimary} />
              <View className="absolute top-[-5px] right-[-5px] w-[20px] h-[20px] rounded-[10px] bg-accent items-center justify-center">
                <AppText size={12} weight="bold" className="text-white leading-[14px]">
                  +
                </AppText>
              </View>
            </View>
          </Pressable>
        )}
      </View>

      {/* 제목 & 본문 */}
      <View className="px-lg pt-[20px] gap-[12px] flex-1">
        <TextInput
          className="font-semibold text-[20px] text-primary p-0"
          value={title}
          onChangeText={setTitle}
          placeholder="사연의 제목을 작성해 주세요"
          placeholderTextColor={colors.textFootnote}
        />
        <TextInput
          className="flex-1 font-regular text-[14px] text-primary leading-[21px] p-0"
          style={{ textAlignVertical: 'top' }}
          value={content}
          onChangeText={(t) => setContent(t.slice(0, MAX))}
          placeholder="자유롭게 사연을 작성해주세요"
          placeholderTextColor={colors.textFootnote}
          multiline
        />
      </View>

      {/* 하단: 글자수(좌측) + done 캡슐 */}
      <View className="gap-sm" style={{ paddingBottom: Math.max(insets.bottom, spacing.md) }}>
        <View className="px-lg">
          <AppText size={12} color="textFootnote">
            {content.length}/{MAX}
          </AppText>
        </View>

        {update.isError && (
          <View className="px-lg">
            <AppText size={12} style={{ color: colors.accentPrimary }}>
              게시글을 수정하지 못했습니다. 다시 시도해주세요.
            </AppText>
          </View>
        )}

        <View className="px-[32px]">
          <Pressable
            className="h-[56px] rounded-[28px] bg-primary items-center justify-center"
            style={!canSave ? { opacity: 0.6 } : undefined}
            onPress={save}
            disabled={!canSave}
          >
            {update.isPending ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <AppText weight="semiBold" className="text-white text-[16px]">
                done
              </AppText>
            )}
          </Pressable>
        </View>
      </View>
    </View>
  );
}

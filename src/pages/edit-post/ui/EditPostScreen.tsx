import { useCallback, useLayoutEffect, useState } from 'react';
import { View, TextInput, Pressable, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppText, colors } from '@/shared/ui';
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
    <View className="flex-1 bg-main p-lg gap-md">
      {music ? (
        <View className="flex-row items-center gap-sm self-start px-md py-sm bg-content rounded-[999px] max-w-full">
          <Ionicons name="musical-note" size={14} color={colors.textPrimary} />
          <AppText size={14} weight="medium" numberOfLines={1} className="flex-1">
            {music.songName} {music.artistName}
          </AppText>
          <Pressable onPress={() => setMusic(null)} hitSlop={8}>
            <Ionicons name="close" size={14} color={colors.textPrimary} />
          </Pressable>
        </View>
      ) : (
        <Pressable
          className="flex-row items-center gap-xs self-start px-md py-sm bg-content rounded-[999px]"
          onPress={() => navigation.navigate('Search')}
        >
          <Ionicons name="add" size={18} color={colors.accentPrimary} />
          <AppText size={14} color="accentPrimary">
            음악 선택
          </AppText>
        </Pressable>
      )}

      <TextInput
        className="font-semibold text-[20px] text-primary py-sm"
        value={title}
        onChangeText={setTitle}
        placeholder="사연의 제목을 작성해 주세요"
        placeholderTextColor={colors.textFootnote}
      />
      <TextInput
        className="min-h-[160px] font-regular text-[15px] text-primary leading-[22px]"
        style={{ textAlignVertical: 'top' }}
        value={content}
        onChangeText={(t) => setContent(t.slice(0, MAX))}
        placeholder="자유롭게 사연을 작성해주세요"
        placeholderTextColor={colors.textFootnote}
        multiline
      />
      <AppText size={12} color="textFootnote" className="text-right">
        {content.length}/{MAX}
      </AppText>
    </View>
  );
}

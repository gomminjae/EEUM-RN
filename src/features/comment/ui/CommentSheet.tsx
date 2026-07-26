import { useEffect, useRef, useState } from 'react';
import {
  Modal,
  View,
  ScrollView,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText, AppImage, colors, images } from '@/shared/ui';
import { CommentItem, type Comment } from '@/entities/comment';
import type { Music } from '@/entities/track';
import { useCreateComment } from '../model/useCommentActions';

const hairline = StyleSheet.hairlineWidth;

type CommentSheetProps = {
  visible: boolean;
  onClose: () => void;
  postId: string;
  comments: Comment[];
  selectedMusic: Music | null;
  playingUrl: string | null;
  onPlay: (comment: Comment) => void;
  onReport: (comment: Comment) => void;
  onAddMusic: () => void;
  onRemoveMusic: () => void;
};

/** 원본 CommentSheet(.large) 이식 — 댓글 리스트 + 하단 실제 입력바(음악 첨부/전송) */
export function CommentSheet({
  visible,
  onClose,
  postId,
  comments,
  selectedMusic,
  playingUrl,
  onPlay,
  onReport,
  onAddMusic,
  onRemoveMusic,
}: CommentSheetProps) {
  const insets = useSafeAreaInsets();
  const [text, setText] = useState('');
  const inputRef = useRef<TextInput>(null);
  const createComment = useCreateComment(postId);

  // 시트가 열릴 때마다 포커스(autoFocus 는 최초 1회만 동작), 닫히면 초안 초기화
  useEffect(() => {
    if (visible) {
      const t = setTimeout(() => inputRef.current?.focus(), 300);
      return () => clearTimeout(t);
    }
    setText('');
  }, [visible]);

  const canSend = text.trim().length > 0 && !createComment.isPending; // 원본: 텍스트 없으면 전송 불가

  const submit = () => {
    if (!canSend) return;
    createComment.mutate(
      {
        content: text.trim(),
        albumName: selectedMusic?.albumName,
        songName: selectedMusic?.songName,
        artistName: selectedMusic?.artistName,
        artworkUrl: selectedMusic?.artworkUrl,
        appleMusicUrl: selectedMusic?.previewMusicUrl,
      },
      {
        onSuccess: () => {
          setText('');
          onRemoveMusic();
        },
        onError: () => Alert.alert('오류', '댓글을 등록하지 못했어요. 잠시 후 다시 시도해주세요.'),
      },
    );
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <KeyboardAvoidingView
        className="flex-1 bg-main"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* grabber */}
        <View className="items-center pt-sm pb-xs">
          <View className="w-[40px] h-[4px] rounded-[2px] bg-black/20" />
        </View>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 40, paddingBottom: 24, gap: 16 }}
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="handled"
        >
          {comments.map((c, i) => (
            <CommentItem
              key={c.commentId ?? `comment-${i}`}
              comment={c}
              isPlaying={!!c.appleMusicUrl && playingUrl === c.appleMusicUrl}
              onPlay={onPlay}
              onReport={onReport}
            />
          ))}
        </ScrollView>

        <View
          className="border-t border-t-black/10 bg-main"
          style={{ borderTopWidth: hairline, paddingBottom: Math.max(insets.bottom, 8) }}
        >
          {/* 원본 SheetCommentInputBar: 음악 태그가 입력 캡슐 내부 상단에 붙는다 */}
          <View className="flex-row items-end gap-sm px-[12px] py-[10px]">
            <Pressable onPress={onAddMusic} hitSlop={8} className="pb-xs">
              <Ionicons name="add-circle" size={28} color={colors.black} />
            </Pressable>
            <View className="flex-1 px-[14px] py-[10px] bg-content rounded-[20px] gap-[6px]">
              {selectedMusic && (
                <View className="flex-row items-center gap-[6px] self-start px-[10px] py-[6px] bg-main rounded-[999px]">
                  <AppText size={13} weight="bold" numberOfLines={1}>
                    {selectedMusic.songName}
                  </AppText>
                  {!!selectedMusic.artistName && (
                    <AppText size={13} color="textFootnote" numberOfLines={1}>
                      {selectedMusic.artistName}
                    </AppText>
                  )}
                  <Pressable onPress={onRemoveMusic} hitSlop={8}>
                    <Ionicons name="close" size={12} color={colors.textFootnote} />
                  </Pressable>
                </View>
              )}
              <TextInput
                ref={inputRef}
                className="max-h-[110px] font-regular text-[13px] text-primary p-0"
                value={text}
                onChangeText={setText}
                placeholder="사연과 관련된 노래와 글을 추가해보세요."
                placeholderTextColor={colors.textFootnote}
                multiline
                returnKeyType="send"
                onSubmitEditing={submit}
              />
            </View>
            <Pressable
              onPress={submit}
              disabled={!canSend}
              hitSlop={8}
              className="pb-xs"
              style={!canSend ? { opacity: 0.4 } : undefined}
            >
              <AppImage source={images.send} style={{ width: 32, height: 32 }} contentFit="contain" />
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

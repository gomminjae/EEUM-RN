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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText, colors } from '@/shared/ui';
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

  const canSend = (text.trim().length > 0 || !!selectedMusic) && !createComment.isPending;

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
          contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 24, paddingBottom: 24, gap: 16 }}
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
          {selectedMusic && (
            <View className="flex-row items-center gap-sm mx-md mt-sm self-start px-md py-sm bg-content rounded-[999px]">
              <Ionicons name="musical-note" size={13} color={colors.textPrimary} />
              <AppText size={13} numberOfLines={1}>
                {selectedMusic.songName} · {selectedMusic.artistName}
              </AppText>
              <Pressable onPress={onRemoveMusic} hitSlop={8}>
                <Ionicons name="close" size={14} color={colors.textFootnote} />
              </Pressable>
            </View>
          )}
          <View className="flex-row items-end gap-sm px-md py-sm">
            <Pressable onPress={onAddMusic} hitSlop={8} className="pb-xs">
              <Ionicons name="add-circle" size={28} color={colors.black} />
            </Pressable>
            <TextInput
              ref={inputRef}
              className="flex-1 max-h-[120px] min-h-[40px] px-md py-sm bg-content rounded-[20px] font-regular text-[15px] text-primary"
              value={text}
              onChangeText={setText}
              placeholder="사연과 관련된 노래와 글을 추가해보세요."
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
      </KeyboardAvoidingView>
    </Modal>
  );
}

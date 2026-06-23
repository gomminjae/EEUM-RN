import { useState } from 'react';
import { View, TextInput, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts, spacing } from '@/shared/ui';
import { useCreateComment } from '../model/useCommentActions';

/** 원본 PostDetailCommentInputBar 이식 — 텍스트 댓글 입력 (음악 첨부는 M4) */
export function CommentInputBar({ postId }: { postId: string }) {
  const [text, setText] = useState('');
  const createComment = useCreateComment(postId);

  const canSend = text.trim().length > 0 && !createComment.isPending;

  const submit = () => {
    if (!canSend) return;
    createComment.mutate(
      { content: text.trim() },
      { onSuccess: () => setText('') },
    );
  };

  return (
    <View style={styles.bar}>
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
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0,0,0,0.1)',
    backgroundColor: colors.mainBackground,
  },
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
});

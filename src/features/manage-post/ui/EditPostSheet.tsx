import { useState } from 'react';
import { View, TextInput, Pressable, StyleSheet } from 'react-native';
import { AppText, BottomSheet, colors, fonts, spacing } from '@/shared/ui';
import type { PostDetail } from '@/entities/post';

type EditPostSheetProps = {
  visible: boolean;
  detail: PostDetail;
  pending?: boolean;
  onClose: () => void;
  onSave: (next: { title: string; content: string }) => void;
};

/** 원본 PostDetailEditSheet 이식 (M3: 제목/내용 수정 — 음악 변경은 M4) */
export function EditPostSheet({ visible, detail, pending, onClose, onSave }: EditPostSheetProps) {
  const [title, setTitle] = useState(detail.title);
  const [content, setContent] = useState(detail.content);

  const canSave = title.trim().length > 0 && !pending;

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <AppText size={18} weight="bold" style={styles.heading}>
        게시물 수정
      </AppText>
      <TextInput
        style={styles.title}
        value={title}
        onChangeText={setTitle}
        placeholder="제목"
        placeholderTextColor={colors.textFootnote}
      />
      <TextInput
        style={styles.content}
        value={content}
        onChangeText={setContent}
        placeholder="내용"
        placeholderTextColor={colors.textFootnote}
        multiline
      />
      <Pressable
        style={[styles.save, !canSave && styles.saveDisabled]}
        disabled={!canSave}
        onPress={() => onSave({ title: title.trim(), content: content.trim() })}
      >
        <AppText weight="semiBold" style={{ color: '#FFFFFF' }}>
          저장
        </AppText>
      </Pressable>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  heading: { marginBottom: spacing.sm },
  title: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.contentBackground,
    borderRadius: 12,
    marginBottom: spacing.sm,
    fontFamily: fonts.pretendard.semiBold,
    fontSize: 16,
    color: colors.textPrimary,
  },
  content: {
    minHeight: 100,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.contentBackground,
    borderRadius: 12,
    textAlignVertical: 'top',
    fontFamily: fonts.pretendard.regular,
    fontSize: 15,
    color: colors.textPrimary,
  },
  save: {
    marginTop: spacing.md,
    alignItems: 'center',
    paddingVertical: spacing.md,
    backgroundColor: colors.accentPrimary,
    borderRadius: 12,
  },
  saveDisabled: { opacity: 0.5 },
});

import { Pressable, StyleSheet } from 'react-native';
import { AppText, BottomSheet, colors, spacing } from '@/shared/ui';

type PostActionSheetProps = {
  visible: boolean;
  onClose: () => void;
  isCompleted: boolean;
  onEdit: () => void;
  onComplete: () => void;
  onDelete: () => void;
};

/** 원본 PostActionSheetView 이식 — 내 글: 수정 / 완료 / 삭제 */
export function PostActionSheet({
  visible,
  onClose,
  isCompleted,
  onEdit,
  onComplete,
  onDelete,
}: PostActionSheetProps) {
  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <Pressable style={styles.option} onPress={onEdit}>
        <AppText size={16}>수정</AppText>
      </Pressable>
      {!isCompleted && (
        <Pressable style={styles.option} onPress={onComplete}>
          <AppText size={16}>완료 처리</AppText>
        </Pressable>
      )}
      <Pressable style={styles.option} onPress={onDelete}>
        <AppText size={16} style={{ color: colors.accentPrimary }}>
          삭제
        </AppText>
      </Pressable>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  option: { paddingVertical: spacing.md },
});

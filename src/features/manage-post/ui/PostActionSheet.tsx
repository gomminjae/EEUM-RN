import { Pressable } from 'react-native';
import { AppText, BottomSheet } from '@/shared/ui';

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
      <Pressable className="py-md" onPress={onEdit}>
        <AppText size={16}>수정</AppText>
      </Pressable>
      {!isCompleted && (
        <Pressable className="py-md" onPress={onComplete}>
          <AppText size={16}>완료 처리</AppText>
        </Pressable>
      )}
      <Pressable className="py-md" onPress={onDelete}>
        <AppText size={16} color="accentPrimary">
          삭제
        </AppText>
      </Pressable>
    </BottomSheet>
  );
}

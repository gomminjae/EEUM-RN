import { View, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppText, BottomSheet, colors } from '@/shared/ui';

const hairline = StyleSheet.hairlineWidth;

type PostActionSheetProps = {
  visible: boolean;
  onClose: () => void;
  isCompleted: boolean;
  onEdit: () => void;
  onComplete: () => void;
  onDelete: () => void;
};

/** 원본 PostActionSheetView 이식 — 수정 / 완료 처리 / 삭제(빨강), 아이콘 포함 */
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
      <Row icon="pencil" label="수정" onPress={onEdit} />
      {!isCompleted && (
        <>
          <View className="bg-black/10" style={{ height: hairline }} />
          <Row icon="checkmark-circle-outline" label="완료 처리" onPress={onComplete} />
        </>
      )}
      <View className="bg-black/10" style={{ height: hairline }} />
      <Row icon="trash-outline" label="삭제" destructive onPress={onDelete} />
    </BottomSheet>
  );
}

function Row({
  icon,
  label,
  destructive,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  destructive?: boolean;
  onPress: () => void;
}) {
  const color = destructive ? '#FF3B30' : colors.textPrimary;
  return (
    <Pressable className="flex-row items-center gap-[12px] px-md py-md" onPress={onPress}>
      <Ionicons name={icon} size={18} color={color} />
      <AppText size={16} weight="medium" style={{ color }}>
        {label}
      </AppText>
    </Pressable>
  );
}

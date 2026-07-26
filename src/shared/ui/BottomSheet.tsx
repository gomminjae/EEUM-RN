import type { ReactNode } from 'react';
import { Modal, View, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { spacing } from './theme';

type BottomSheetProps = {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
};

/** 공용 하단 시트 — 액션시트/신고/수정 시트의 컨테이너 */
export function BottomSheet({ visible, onClose, children }: BottomSheetProps) {
  const insets = useSafeAreaInsets();
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable className="flex-1 bg-black/[0.35]" onPress={onClose} />
      <View
        className="bg-main rounded-t-[20px] px-lg pt-sm gap-xs"
        style={{ paddingBottom: insets.bottom + spacing.md }}
      >
        <View className="self-center w-[48px] h-[4px] rounded-[2px] bg-footnote/40 mb-sm" />
        {children}
      </View>
    </Modal>
  );
}

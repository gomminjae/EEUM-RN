import { useState } from 'react';
import { View, Pressable } from 'react-native';
import { AppText, BottomSheet, colors } from '@/shared/ui';
import type { CompletionType } from '../api/createStory';

const LIMIT_OPTIONS = [10, 20, 30, 50, 100];

type CompletionSheetProps = {
  visible: boolean;
  pending?: boolean;
  onClose: () => void;
  onConfirm: (type: CompletionType, commentCountLimit: number) => void;
};

/** 원본 SharePopupView 이식 — 완료 방식(자동/수동) + 자동일 때 댓글 수 제한 */
export function CompletionSheet({ visible, pending, onClose, onConfirm }: CompletionSheetProps) {
  const [type, setType] = useState<CompletionType>('AUTO_COMPLETION');
  const [limit, setLimit] = useState(20);

  const isAuto = type === 'AUTO_COMPLETION';

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <AppText size={18} weight="bold" className="mb-md">
        완료 방식
      </AppText>

      <View className="flex-row gap-sm">
        <TypeChip label="자동 완료" active={isAuto} onPress={() => setType('AUTO_COMPLETION')} />
        <TypeChip label="수동 완료" active={!isAuto} onPress={() => setType('MANUAL_COMPLETION')} />
      </View>

      {isAuto && (
        <>
          <AppText size={14} color="textFootnote" className="mt-md mb-sm">
            댓글 수 제한
          </AppText>
          <View className="flex-row flex-wrap gap-sm">
            {LIMIT_OPTIONS.map((n) => (
              <TypeChip key={n} label={String(n)} active={limit === n} onPress={() => setLimit(n)} />
            ))}
          </View>
        </>
      )}

      <Pressable
        className="mt-lg items-center py-md bg-accent rounded-[12px]"
        style={pending && { opacity: 0.5 }}
        disabled={pending}
        onPress={() => onConfirm(type, isAuto ? limit : 0)}
      >
        <AppText weight="semiBold" style={{ color: '#FFFFFF' }}>
          공유하기
        </AppText>
      </Pressable>
    </BottomSheet>
  );
}

function TypeChip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      className="px-md py-sm rounded-[999px] bg-content"
      style={active && { backgroundColor: colors.accentPrimary }}
    >
      <AppText
        size={14}
        weight={active ? 'semiBold' : 'regular'}
        style={{ color: active ? '#FFFFFF' : colors.textPrimary }}
      >
        {label}
      </AppText>
    </Pressable>
  );
}
